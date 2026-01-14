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

    const { items, redirectUrl } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No items provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get product details and store subaccounts
    const productIds = items.map((item: { productId: string }) => item.productId);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, store_id')
      .in('id', productIds);

    if (productsError || !products) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch products' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get store subaccount info
    const storeIds = [...new Set(products.map(p => p.store_id))];
    const { data: stores } = await supabase
      .from('stores')
      .select('id, subaccount_id')
      .in('id', storeIds);

    const storeSubaccounts = new Map(stores?.map(s => [s.id, s.subaccount_id]) || []);

    // Calculate total and build subaccounts array for split payment
    let totalAmount = 0;
    const subaccounts: Array<{
      id: string;
      transaction_charge_type: string;
      transaction_charge: number;
    }> = [];

    const platformCommission = 10; // 10% platform fee

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const itemTotal = product.price * (item.quantity || 1);
        totalAmount += itemTotal;

        const subaccountId = storeSubaccounts.get(product.store_id);
        if (subaccountId) {
          // Check if subaccount already in array
          const existingIdx = subaccounts.findIndex(s => s.id === subaccountId);
          if (existingIdx === -1) {
            subaccounts.push({
              id: subaccountId,
              transaction_charge_type: 'percentage',
              transaction_charge: platformCommission,
            });
          }
        }
      }
    }

    const txRef = `LUXE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create Flutterwave payment link
    const paymentPayload: Record<string, unknown> = {
      tx_ref: txRef,
      amount: totalAmount,
      currency: 'NGN',
      redirect_url: redirectUrl || `${req.headers.get('origin')}/orders`,
      customer: {
        email: user.email,
        name: user.user_metadata?.full_name || 'Customer',
      },
      customizations: {
        title: 'LUXE Marketplace',
        description: 'Payment for your order',
      },
    };

    // Only add subaccounts if there are any configured
    if (subaccounts.length > 0) {
      paymentPayload.subaccounts = subaccounts;
    }

    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${flutterwaveKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentPayload),
    });

    const data = await response.json();

    if (data.status !== 'success') {
      return new Response(
        JSON.stringify({ error: data.message || 'Failed to create payment' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        paymentLink: data.data.link,
        txRef,
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
