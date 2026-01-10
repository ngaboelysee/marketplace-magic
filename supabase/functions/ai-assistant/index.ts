import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are LUXE Assistant, a helpful AI for the LUXE Marketplace - a multi-vendor luxury marketplace.

YOUR ROLE:
- Help users find products, understand categories, and navigate the site
- Answer questions about the marketplace, shipping, returns, and policies
- Provide product recommendations based on user preferences
- Guide users to the right pages (shop, categories, cart, etc.)

RULES (STRICTLY FOLLOW):
- You are NOT a seller - never negotiate prices or make sales promises
- NEVER give medical, legal, or financial advice
- NEVER share personal data or make up product information
- Only use information from the LUXE Marketplace platform
- Keep responses friendly, concise (under 100 words when possible)
- Ask clarifying questions when the request is unclear
- Suggest contacting support@luxe.com for complex issues

AVAILABLE CATEGORIES: Fashion, Home & Living, Jewelry, Art & Collectibles, Beauty, Electronics

NAVIGATION TIPS YOU CAN SHARE:
- /shop - Browse all products
- /categories - View all categories  
- /cart - View shopping cart
- /auth - Sign in or create account
- /sell - Information for becoming a seller

When users ask about products, suggest they visit /shop or specific category pages.
Always be helpful but redirect to human support when unsure.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the request body
    const body: Record<string, unknown> = {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      stream: type === "stream",
    };

    // For quick answers, use lower tokens
    if (type === "quick") {
      body.max_tokens = 150;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "I'm receiving too many requests right now. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Sorry, I'm having trouble responding right now. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (type === "stream") {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // Non-streaming response
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    
    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
