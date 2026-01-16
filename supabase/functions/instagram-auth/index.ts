import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, code, storeId, redirectUri } = await req.json();
    
    const INSTAGRAM_APP_ID = Deno.env.get('INSTAGRAM_APP_ID');
    const INSTAGRAM_APP_SECRET = Deno.env.get('INSTAGRAM_APP_SECRET');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!INSTAGRAM_APP_ID || !INSTAGRAM_APP_SECRET) {
      console.error('Instagram credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Instagram integration not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    if (action === 'get-auth-url') {
      // Generate OAuth URL for Instagram Basic Display API
      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_profile,user_media&response_type=code&state=${storeId}`;
      
      console.log('Generated Instagram auth URL for store:', storeId);
      
      return new Response(
        JSON.stringify({ authUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'exchange-code') {
      // Exchange code for short-lived token
      const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: INSTAGRAM_APP_ID,
          client_secret: INSTAGRAM_APP_SECRET,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code: code,
        }),
      });

      const tokenData = await tokenResponse.json();
      console.log('Token exchange response:', JSON.stringify(tokenData));

      if (tokenData.error_message) {
        return new Response(
          JSON.stringify({ error: tokenData.error_message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Exchange for long-lived token
      const longLivedResponse = await fetch(
        `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${INSTAGRAM_APP_SECRET}&access_token=${tokenData.access_token}`
      );
      const longLivedData = await longLivedResponse.json();
      console.log('Long-lived token response received');

      // Get user profile
      const profileResponse = await fetch(
        `https://graph.instagram.com/me?fields=id,username&access_token=${longLivedData.access_token}`
      );
      const profileData = await profileResponse.json();
      console.log('Instagram profile:', profileData.username);

      // Update store with Instagram info
      const { error: updateError } = await supabase
        .from('stores')
        .update({
          instagram_user_id: profileData.id,
          instagram_access_token: longLivedData.access_token,
          instagram_username: profileData.username,
          instagram_connected_at: new Date().toISOString(),
        })
        .eq('id', storeId);

      if (updateError) {
        console.error('Error updating store:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to save Instagram connection' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          username: profileData.username 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'disconnect') {
      const { error: updateError } = await supabase
        .from('stores')
        .update({
          instagram_user_id: null,
          instagram_access_token: null,
          instagram_username: null,
          instagram_connected_at: null,
        })
        .eq('id', storeId);

      if (updateError) {
        console.error('Error disconnecting Instagram:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to disconnect Instagram' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Instagram auth error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
