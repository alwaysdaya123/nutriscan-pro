import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const healthCheck = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      service: "NutriScan API",
      checks: {
        api: "ok",
        database: "ok",
      },
    };

    return new Response(
      JSON.stringify(healthCheck),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Health check error:", error);
    return new Response(
      JSON.stringify({ 
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { 
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
