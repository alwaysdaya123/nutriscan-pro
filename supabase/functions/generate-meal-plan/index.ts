import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface MealPlanRequest {
  dietGoal: 'weight_loss' | 'maintenance' | 'muscle_gain';
  dailyCalorieTarget: number;
  dietaryPreference: 'veg' | 'non-veg' | 'vegan';
  days: number; // 1 for daily, 7 for weekly
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dietGoal, dailyCalorieTarget, dietaryPreference, days } = await req.json() as MealPlanRequest;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generating ${days}-day meal plan for ${dietGoal} with ${dailyCalorieTarget} calories`);

    const goalDescription = {
      weight_loss: "Focus on high protein, fiber-rich foods with moderate carbs. Create a calorie deficit.",
      maintenance: "Balanced macronutrients with variety. Maintain current calorie intake.",
      muscle_gain: "High protein meals with complex carbs. Slight calorie surplus for muscle building."
    }[dietGoal];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert nutritionist creating personalized meal plans. 
            
Generate meal plans as a JSON array with this structure:
{
  "mealPlans": [
    {
      "day": 1,
      "meals": [
        {
          "meal_type": "breakfast",
          "food_name": "Oatmeal with Berries",
          "description": "Whole grain oats topped with fresh berries and honey",
          "calories": 350,
          "protein": 12,
          "carbs": 55,
          "fat": 8
        }
      ]
    }
  ]
}

Rules:
- Each day MUST have exactly 4 meals: breakfast, lunch, dinner, and snack
- Total daily calories should be close to the target (within 50-100 calories)
- Respect dietary preferences strictly
- Provide realistic, appetizing meal names
- Include brief descriptions
- All numeric values should be realistic
- Respond ONLY with valid JSON, no additional text`
          },
          {
            role: "user",
            content: `Create a ${days}-day meal plan with these requirements:
- Diet Goal: ${dietGoal} (${goalDescription})
- Daily Calorie Target: ${dailyCalorieTarget} calories
- Dietary Preference: ${dietaryPreference}
- Number of days: ${days}

Distribute calories roughly as:
- Breakfast: 25% of daily calories
- Lunch: 35% of daily calories  
- Dinner: 30% of daily calories
- Snack: 10% of daily calories`
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate meal plan" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "No meal plan generated" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let mealPlanData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        mealPlanData = JSON.parse(jsonMatch[0]);
      } else {
        mealPlanData = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError, "Content:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse meal plan data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Successfully generated ${days}-day meal plan`);

    return new Response(
      JSON.stringify(mealPlanData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-meal-plan function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
