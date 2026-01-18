import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const HASHTAG = '#luxe';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { storeId } = await req.json();
    
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get store with Instagram token
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('instagram_access_token, instagram_user_id')
      .eq('id', storeId)
      .single();

    if (storeError || !store?.instagram_access_token) {
      console.error('Store not found or not connected:', storeError);
      return new Response(
        JSON.stringify({ error: 'Instagram not connected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch recent media from Instagram
    const mediaResponse = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${store.instagram_access_token}`
    );
    const mediaData = await mediaResponse.json();

    if (mediaData.error) {
      console.error('Instagram API error:', mediaData.error);
      return new Response(
        JSON.stringify({ error: mediaData.error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetched ${mediaData.data?.length || 0} posts from Instagram`);

    // Get existing draft post IDs to avoid duplicates
    const { data: existingDrafts } = await supabase
      .from('draft_products')
      .select('instagram_post_id')
      .eq('store_id', storeId);

    const existingPostIds = new Set(existingDrafts?.map(d => d.instagram_post_id) || []);

    let newDraftsCount = 0;
    const draftsToInsert = [];

    for (const post of mediaData.data || []) {
      // Skip if already imported
      if (existingPostIds.has(post.id)) {
        continue;
      }

      // Check for hashtag
      const caption = post.caption || '';
      if (!caption.includes(HASHTAG)) {
        continue;
      }

      // Only process images and carousels (use first image)
      if (post.media_type !== 'IMAGE' && post.media_type !== 'CAROUSEL_ALBUM') {
        continue;
      }

      // Extract product name from caption (first line or up to hashtag)
      let productName = caption.split('\n')[0].replace(HASHTAG, '').trim();
      if (!productName) {
        productName = `Instagram Product ${new Date(post.timestamp).toLocaleDateString()}`;
      }
      
      // Clean description (remove hashtag)
      const description = caption.replace(HASHTAG, '').trim();

      draftsToInsert.push({
        store_id: storeId,
        instagram_post_id: post.id,
        name: productName.substring(0, 100),
        description: description.substring(0, 500),
        image_url: post.media_url,
        instagram_permalink: post.permalink,
        status: 'pending',
      });

      newDraftsCount++;
    }

    if (draftsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('draft_products')
        .insert(draftsToInsert);

      if (insertError) {
        console.error('Error inserting drafts:', insertError);
        return new Response(
          JSON.stringify({ error: 'Failed to create draft products' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log(`Created ${newDraftsCount} new draft products`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        newDrafts: newDraftsCount,
        totalPosts: mediaData.data?.length || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Instagram sync error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
