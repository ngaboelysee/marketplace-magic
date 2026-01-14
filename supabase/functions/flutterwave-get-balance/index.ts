import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const flutterwaveKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY');

    if (!flutterwaveKey) {
      return new Response(
        JSON.stringify({ error: 'Flutterwave API key not configured' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { storeId } = await req.json();

    // Get store with subaccount info
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('id, owner_id, subaccount_id')
      .eq('id', storeId)
      .single();

    if (storeError || !store || store.owner_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Store not found or unauthorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!store.subaccount_id) {
      return new Response(
        JSON.stringify({ 
          success: true,
          balance: 0,
          pending: 0,
          message: 'No subaccount configured'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get subaccount balance from Flutterwave
    const response = await fetch(
      `https://api.flutterwave.com/v3/subaccounts/${store.subaccount_id}`,
      {
        headers: {
          'Authorization': `Bearer ${flutterwaveKey}`,
        },
      }
    );

    const data = await response.json();

    if (data.status !== 'success') {
      return new Response(
        JSON.stringify({ error: data.message || 'Failed to fetch balance' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get transactions for this subaccount
    const txnResponse = await fetch(
      `https://api.flutterwave.com/v3/transactions?subaccount_id=${store.subaccount_id}`,
      {
        headers: {
          'Authorization': `Bearer ${flutterwaveKey}`,
        },
      }
    );

    const txnData = await txnResponse.json();
    
    let totalEarnings = 0;
    let pendingSettlements = 0;

    if (txnData.status === 'success' && txnData.data) {
      for (const txn of txnData.data) {
        if (txn.status === 'successful') {
          totalEarnings += txn.charged_amount || 0;
        } else if (txn.status === 'pending') {
          pendingSettlements += txn.charged_amount || 0;
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        totalEarnings,
        pendingSettlements,
        subaccount: data.data,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
