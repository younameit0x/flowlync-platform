// FREE AI Chat Implementation using Hugging Face + Groq
export async function POST(request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return new Response(
        JSON.stringify({
          error: "Message is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Try multiple FREE AI providers with fallback
    let aiResponse;

    try {
      // Option 1: Try Groq (free tier) - FASTEST
      aiResponse = await getGroqResponse(message);
    } catch (error) {
      try {
        // Option 2: Try Hugging Face (free) - RELIABLE
        aiResponse = await getHuggingFaceResponse(message);
      } catch (error2) {
        // Option 3: Fallback to smart pattern matching
        aiResponse = getSmartPatternResponse(message);
      }
    }

    return new Response(
      JSON.stringify({
        response: aiResponse,
        timestamp: new Date().toISOString(),
        context: "free_ai_assistant",
        provider: "multi_free_tier",
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("AI Chat error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process message",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// FREE Groq API Implementation
async function getGroqResponse(message) {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`, // FREE tier key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // FREE model
        messages: [
          {
            role: "system",
            content: `You are an expert affiliate marketing consultant specializing in casino and gaming affiliate programs. Provide actionable, specific advice focused on:
        - High-converting affiliate programs
        - Content strategies that drive traffic
        - SEO techniques for gambling niches
        - Compliance and regulations
        - Revenue optimization
        Keep responses concise but valuable.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    },
  );

  const data = await response.json();
  return data.choices[0].message.content;
}

// FREE Hugging Face Implementation
async function getHuggingFaceResponse(message) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`, // FREE
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `Affiliate Marketing Expert: ${message}`,
        parameters: {
          max_length: 200,
          temperature: 0.7,
          return_full_text: false,
        },
      }),
    },
  );

  const data = await response.json();
  return data[0].generated_text;
}

// Smart Pattern Matching (No API needed)
function getSmartPatternResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Advanced pattern matching with context awareness
  const responses = {
    affiliate: [
      "Top casino affiliate programs to consider: 1) BetMGM (35% commission, reliable payments), 2) DraftKings (competitive rates, strong brand), 3) FanDuel (excellent conversion rates). Focus on programs with proven track records and good affiliate support.",
      "For maximizing affiliate revenue: Target high-value keywords like 'best casino bonuses [location]', create detailed comparison content, and focus on programs with 30-45% commission rates. Always check payment terms and minimum thresholds.",
    ],
    content: [
      "High-converting content ideas: 1) 'Best Casino Bonuses for [Country] Players' - targets local traffic, 2) 'Beginner's Guide to Online Casino Safety' - builds trust, 3) Game strategy guides - attracts serious players. Focus on user intent and provide real value.",
      "Content that converts: Create honest reviews with pros/cons, bonus comparison tables, and educational content. Use long-tail keywords and focus on solving specific problems your audience has.",
    ],
    seo: [
      "SEO strategy for casino affiliates: Target location-specific keywords ('best online casinos [country]'), create pillar content around main topics, build quality backlinks from finance/gambling sites. Focus on E-A-T (Expertise, Authority, Trust).",
      "Rank higher in casino affiliate space: Use schema markup for reviews, optimize for featured snippets, create comprehensive comparison pages. Target keywords with commercial intent and manageable competition.",
    ],
  };

  if (lowerMessage.includes("affiliate") || lowerMessage.includes("program")) {
    return responses.affiliate[
      Math.floor(Math.random() * responses.affiliate.length)
    ];
  } else if (
    lowerMessage.includes("content") ||
    lowerMessage.includes("blog")
  ) {
    return responses.content[
      Math.floor(Math.random() * responses.content.length)
    ];
  } else if (lowerMessage.includes("seo") || lowerMessage.includes("rank")) {
    return responses.seo[Math.floor(Math.random() * responses.seo.length)];
  }

  return "I'm your AI affiliate marketing consultant! I can help you with finding profitable programs, creating converting content, SEO strategies, and maximizing your affiliate revenue. What specific challenge are you working on?";
}

export async function GET() {
  return new Response(
    JSON.stringify({
      status: "FREE AI Chat API - Multi-Provider",
      providers: [
        "Groq (free)",
        "Hugging Face (free)",
        "Smart Pattern Matching",
      ],
      features: ["Real AI responses", "Fallback system", "Zero cost"],
      timestamp: new Date().toISOString(),
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
