const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const flutterwaveKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY');

    if (!flutterwaveKey) {
      return new Response(
        JSON.stringify({ error: 'Flutterwave API key not configured' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const country = url.searchParams.get('country') || 'NG';

    const response = await fetch(
      `https://api.flutterwave.com/v3/banks/${country}`,
      {
        headers: {
          'Authorization': `Bearer ${flutterwaveKey}`,
        },
      }
    );

    const data = await response.json();

    if (data.status !== 'success') {
      return new Response(
        JSON.stringify({ error: data.message || 'Failed to fetch banks' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        banks: data.data,
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
