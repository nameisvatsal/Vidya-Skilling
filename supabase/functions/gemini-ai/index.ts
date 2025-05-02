
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// API key for Gemini API
const GEMINI_API_KEY = "AIzaSyAPtq1dfxsg4vRcPLd2jKhIoQoTKh_jJjQ";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, model, language, mode } = await req.json();

    if (!prompt) {
      throw new Error("Prompt is required");
    }

    let endpoint = "";
    let requestBody = {};

    // Use different endpoints based on the mode (text, multimodal, etc.)
    switch (mode) {
      case "text":
        endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";
        requestBody = {
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        };
        break;
      case "translation":
        endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";
        requestBody = {
          contents: [{
            parts: [{ 
              text: `Translate the following text from ${language.source || 'English'} to ${language.target}: ${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.2,
          }
        };
        break;
      case "adaptive-learning":
        endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";
        requestBody = {
          contents: [{
            parts: [{ 
              text: `You are an educational assistant helping learners in rural India. Simplify and adapt the following content to make it more accessible: ${prompt}. User's preferred language is ${language || 'English'}.`
            }]
          }],
          generationConfig: {
            temperature: 0.4,
          }
        };
        break;
      default:
        endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";
        requestBody = {
          contents: [{
            parts: [{ text: prompt }]
          }]
        };
    }

    // Add API key to endpoint
    endpoint = `${endpoint}?key=${GEMINI_API_KEY}`;

    // Send request to Gemini API
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    // Extract the generated text from the response
    let result = "";
    if (data.candidates && data.candidates.length > 0) {
      if (data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
        result = data.candidates[0].content.parts[0].text;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        result: result,
        data: data
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
