// Premium AI Chat with FREE Groq + Hugging Face + Smart Fallbacks
export async function POST(request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return new Response(JSON.stringify({ 
        error: 'Message is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Try multiple FREE AI providers with intelligent fallback
    let aiResponse;
    let provider = 'smart_fallback';
    
    try {
      // Primary: Groq (free tier) - Ultra fast, high quality
      aiResponse = await getGroqResponse(message);
      provider = 'groq_free';
    } catch (groqError) {
      console.log('Groq unavailable, trying Hugging Face...');
      try {
        // Secondary: Hugging Face (free) - Reliable
        aiResponse = await getHuggingFaceResponse(message);
        provider = 'huggingface_free';
      } catch (hfError) {
        console.log('All AI APIs unavailable, using smart patterns...');
        // Tertiary: Advanced pattern matching (always works)
        aiResponse = getAdvancedPatternResponse(message);
        provider = 'smart_patterns';
      }
    }

    return new Response(JSON.stringify({
      response: aiResponse,
      timestamp: new Date().toISOString(),
      context: 'premium_ai_assistant',
      provider: provider,
      version: 'free_ai_v1'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Premium AI Chat error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process message',
      fallback: getAdvancedPatternResponse('general help')
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// FREE Groq API Implementation (LLaMA 3.1 - excellent quality)
async function getGroqResponse(message) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('Groq API key not configured');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192', // FREE model
      messages: [{
        role: 'system',
        content: `You are an expert affiliate marketing consultant specializing in casino and gaming affiliate programs. You help users with:

1. AFFILIATE PROGRAMS: High-converting programs, commission rates, payment terms
2. CONTENT STRATEGY: Creating content that converts visitors to players
3. SEO OPTIMIZATION: Ranking for competitive gambling keywords
4. TRAFFIC GENERATION: Driving quality traffic that converts
5. COMPLIANCE: Legal requirements and regulations
6. REVENUE OPTIMIZATION: Maximizing earnings per visitor

Provide specific, actionable advice. Keep responses concise but valuable (2-3 sentences max). Focus on practical steps users can implement immediately.`
      }, {
        role: 'user',
        content: message
      }],
      max_tokens: 200,
      temperature: 0.7,
      top_p: 0.9
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// FREE Hugging Face Implementation (Backup)
async function getHuggingFaceResponse(message) {
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error('Hugging Face API key not configured');
  }

  const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: `User asks about affiliate marketing: "${message}". Provide helpful, specific advice about affiliate programs, content creation, or SEO.`,
      parameters: {
        max_length: 150,
        temperature: 0.7,
        return_full_text: false,
        do_sample: true
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error);
  }
  
  return data[0]?.generated_text || getAdvancedPatternResponse(message);
}

// Advanced Pattern Matching (Always Available Fallback)
function getAdvancedPatternResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Affiliate Programs
  if (lowerMessage.includes('affiliate') || lowerMessage.includes('program') || lowerMessage.includes('commission')) {
    const responses = [
      "Top casino affiliate programs: **BetMGM** (35% commission), **DraftKings** (competitive rates + strong brand), **FanDuel** (excellent conversion rates). Focus on programs with reliable payments and 30+ day cookie duration.",
      "For high-converting affiliate programs: Look for 25-45% commission rates, reliable payment history, and good marketing support. **Evolution Gaming** and **Pragmatic Play** partners often perform well.",
      "Best affiliate strategies: Target location-specific keywords, create detailed bonus comparison content, and focus on programs with proven track records. Always check payment terms and minimum thresholds."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Content Creation
  if (lowerMessage.includes('content') || lowerMessage.includes('blog') || lowerMessage.includes('write') || lowerMessage.includes('article')) {
    const responses = [
      "High-converting content ideas: **'Best Casino Bonuses [Your Country]'** (targets local traffic), **'Safe Casino Guide for Beginners'** (builds trust), **Game strategy guides** (attracts serious players). Focus on user intent and provide real value.",
      "Content that converts: Create honest reviews with pros/cons, bonus comparison tables, and educational content. Use long-tail keywords like 'best online casinos for [specific game]' for better rankings.",
      "Winning content formula: **Problem** (user's need) + **Solution** (casino recommendation) + **Proof** (screenshots, personal experience) + **Call-to-action** (clear next steps). This structure converts 3-5x better."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // SEO
  if (lowerMessage.includes('seo') || lowerMessage.includes('rank') || lowerMessage.includes('search') || lowerMessage.includes('google')) {
    const responses = [
      "Casino SEO strategy: Target **location + game** keywords ('online slots [country]'), create comprehensive pillar content, build quality backlinks from finance/gambling sites. Focus on E-A-T (Expertise, Authority, Trust).",
      "Rank higher: Use **schema markup** for reviews, optimize for featured snippets, create comparison pages. Target keywords with commercial intent like 'best [casino type] [location]' - these convert better.",
      "SEO tips that work: **Long-tail keywords** have less competition, **local SEO** drives targeted traffic, **user-generated content** (reviews) builds authority. Always optimize for mobile-first indexing."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Traffic & Marketing
  if (lowerMessage.includes('traffic') || lowerMessage.includes('marketing') || lowerMessage.includes('promote') || lowerMessage.includes('advertise')) {
    const responses = [
      "Traffic generation: **YouTube** (game tutorials), **Reddit** (helpful community participation), **Twitter** (industry news), **TikTok** (quick tips). Organic traffic converts 2-3x better than paid ads.",
      "Marketing channels that work: **Email lists** (highest ROI), **social media** (build community), **content marketing** (long-term traffic), **influencer partnerships** (credibility boost). Focus on 1-2 channels first.",
      "Promotion strategies: Create **free tools** (odds calculators), offer **exclusive bonuses**, build **email sequences** for nurturing. Value-first approach builds trust and long-term success."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Smart Matching Integration
  if (lowerMessage.includes('smart') || lowerMessage.includes('match') || lowerMessage.includes('recommend') || lowerMessage.includes('find')) {
    return "🎯 **Smart Matching Available!** I can help you find perfect affiliate programs using our AI-powered matching system. It analyzes your traffic, audience demographics, and content style to recommend the highest-converting casino affiliates for your specific situation. Ready to get personalized recommendations?";
  }
  
  // General Help
  if (lowerMessage.includes('help') || lowerMessage.includes('start') || lowerMessage.includes('begin') || lowerMessage.includes('how')) {
    return "👋 **I'm your AI affiliate marketing consultant!** I can help you with: **🎯 Finding profitable programs** • **📝 Creating converting content** • **🔍 SEO strategies** • **📈 Traffic generation** • **💰 Revenue optimization**. What specific challenge are you working on today?";
  }
  
  // Default Response
  return "I'm here to help you succeed in affiliate marketing! I can assist with **affiliate programs**, **content creation**, **SEO optimization**, **traffic generation**, and **revenue strategies**. What would you like to know more about?";
}

// Health Check Endpoint
export async function GET() {
  return new Response(JSON.stringify({
    status: 'Premium AI Chat API - Multi-Provider FREE System',
    providers: [
      'Groq LLaMA 3.1 (free tier)',
      'Hugging Face DialoGPT (free)',
      'Advanced Pattern Matching (always available)'
    ],
    features: [
      'Real AI responses',
      'Intelligent fallback system',
      'Zero ongoing costs',
      'Ultra-fast response times',
      'Specialized affiliate marketing knowledge'
    ],
    performance: 'Optimized for speed and reliability',
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}