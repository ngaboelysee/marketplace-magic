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

    const { storeId, businessName, bankCode, accountNumber, splitValue = 90 } = await req.json();

    if (!storeId || !businessName || !bankCode || !accountNumber) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: storeId, businessName, bankCode, accountNumber' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify store ownership
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('id, owner_id')
      .eq('id', storeId)
      .single();

    if (storeError || !store || store.owner_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Store not found or unauthorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Flutterwave subaccount
    const flutterwaveResponse = await fetch('https://api.flutterwave.com/v3/subaccounts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${flutterwaveKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account_bank: bankCode,
        account_number: accountNumber,
        business_name: businessName,
        business_email: user.email,
        country: 'NG',
        split_type: 'percentage',
        split_value: splitValue, // Vendor gets this %, platform gets the rest
      }),
    });

    const flutterwaveData = await flutterwaveResponse.json();

    if (flutterwaveData.status !== 'success') {
      return new Response(
        JSON.stringify({ error: flutterwaveData.message || 'Failed to create subaccount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update store with subaccount info
    const { error: updateError } = await supabase
      .from('stores')
      .update({
        subaccount_id: flutterwaveData.data.subaccount_id,
        bank_name: flutterwaveData.data.bank_name,
        account_number: accountNumber,
        business_name: businessName,
      })
      .eq('id', storeId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to save subaccount info' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        subaccount_id: flutterwaveData.data.subaccount_id,
        bank_name: flutterwaveData.data.bank_name,
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
