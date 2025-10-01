export async function GET() {
  return new Response(JSON.stringify({ 
    status: 'Premium AI Chat API - FREE Groq + Smart Patterns v2',
    endpoints: ['POST /api/ai-chat'],
    features: ['Real AI responses (Groq)', 'Smart pattern fallbacks', 'Zero cost'],
    timestamp: new Date().toISOString(),
    deployment: 'force-refresh'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// Premium AI Chat with Platform Integration
export async function POST(request) {
  try {
    const body = await request.json();
    const { message, user_id, context } = body;

    if (!message) {
      return new Response(JSON.stringify({ 
        error: 'Message is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Analyze user intent and determine if platform integration is needed
    const intent = analyzeUserIntent(message);
    
    let aiResponse;
    let provider = 'smart_patterns';
    let platformIntegration = null;

    // Try AI providers first
    try {
      if (process.env.GROQ_API_KEY) {
        aiResponse = await getGroqResponse(message, intent);
        provider = 'groq_free';
      } else {
        throw new Error('Groq not configured, using patterns');
      }
    } catch (error) {
      aiResponse = getAdvancedPatternResponse(message, intent);
      provider = 'smart_patterns';
    }

    // Add platform-specific integrations based on intent
    if (intent.needsSmartMatching && user_id) {
      platformIntegration = await generateSmartMatchingIntegration(intent, user_id);
    } else if (intent.needsPlatformGuidance) {
      platformIntegration = generatePlatformGuidance(intent);
    } else if (intent.needsUserProfiling) {
      platformIntegration = generateUserProfilingQuestions(intent);
    }

    return new Response(JSON.stringify({
      response: aiResponse,
      timestamp: new Date().toISOString(),
      context: 'premium_ai_assistant',
      provider: provider,
      version: 'platform_integrated_v1',
      intent: intent.categories,
      platform_integration: platformIntegration
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI Chat error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process message',
      response: getAdvancedPatternResponse(message || 'help')
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// FREE Groq API Implementation 
async function getGroqResponse(message) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant', // Updated model name
      messages: [{
        role: 'system',
        content: `You are an expert affiliate marketing consultant specializing in casino and gaming affiliate programs. Provide specific, actionable advice focused on: affiliate programs, content strategies, SEO techniques, traffic generation, compliance, and revenue optimization. Keep responses concise but valuable (2-3 sentences max).`
      }, {
        role: 'user',
        content: message
      }],
      max_tokens: 200,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// Advanced Pattern Matching (Always Available Fallback)
function getAdvancedPatternResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Affiliate Programs
  if (lowerMessage.includes('affiliate') || lowerMessage.includes('program') || lowerMessage.includes('commission')) {
    const responses = [
      "🎯 **Top casino affiliate programs**: BetMGM (35% commission), DraftKings (competitive rates + strong brand), FanDuel (excellent conversion rates). Focus on programs with reliable payments and 30+ day cookie duration.",
      "💰 **High-converting programs**: Look for 25-45% commission rates, reliable payment history, and good marketing support. Evolution Gaming and Pragmatic Play partners often perform well.",
      "⚡ **Best strategies**: Target location-specific keywords, create detailed bonus comparison content, and focus on programs with proven track records. Always check payment terms and minimum thresholds."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Content Creation
  if (lowerMessage.includes('content') || lowerMessage.includes('blog') || lowerMessage.includes('write') || lowerMessage.includes('article')) {
    const responses = [
      "📝 **High-converting content**: 'Best Casino Bonuses [Your Country]' (targets local traffic), 'Safe Casino Guide for Beginners' (builds trust), Game strategy guides (attracts serious players). Focus on user intent.",
      "✍️ **Content that converts**: Create honest reviews with pros/cons, bonus comparison tables, and educational content. Use long-tail keywords like 'best online casinos for [specific game]' for better rankings.",
      "🚀 **Winning formula**: Problem (user's need) + Solution (casino recommendation) + Proof (screenshots, experience) + Call-to-action (clear next steps). This structure converts 3-5x better."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // SEO
  if (lowerMessage.includes('seo') || lowerMessage.includes('rank') || lowerMessage.includes('search') || lowerMessage.includes('google')) {
    const responses = [
      "🔍 **Casino SEO strategy**: Target location + game keywords ('online slots [country]'), create comprehensive pillar content, build quality backlinks from finance/gambling sites. Focus on E-A-T (Expertise, Authority, Trust).",
      "📈 **Rank higher**: Use schema markup for reviews, optimize for featured snippets, create comparison pages. Target keywords with commercial intent like 'best [casino type] [location]' - these convert better.",
      "⭐ **SEO tips**: Long-tail keywords have less competition, local SEO drives targeted traffic, user-generated content (reviews) builds authority. Always optimize for mobile-first indexing."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Smart Matching Integration
  if (lowerMessage.includes('smart') || lowerMessage.includes('match') || lowerMessage.includes('recommend') || lowerMessage.includes('find')) {
    return "🎯 **Smart Matching Available!** I can help you find perfect affiliate programs using our AI-powered matching system. It analyzes your traffic, audience demographics, and content style to recommend the highest-converting casino affiliates for your specific situation. Ready to get personalized recommendations?";
  }
  
  // General Help
  if (lowerMessage.includes('help') || lowerMessage.includes('start') || lowerMessage.includes('begin') || lowerMessage.includes('how')) {
    return "👋 **I'm your AI affiliate marketing consultant!** I can help with: 🎯 **Finding profitable programs** • 📝 **Creating converting content** • 🔍 **SEO strategies** • 📈 **Traffic generation** • 💰 **Revenue optimization**. What specific challenge are you working on today?";
  }
  
  // Default Response
  return "I'm here to help you succeed in affiliate marketing! I can assist with **affiliate programs**, **content creation**, **SEO optimization**, **traffic generation**, and **revenue strategies**. What would you like to know more about?";
}

// Platform Integration Functions

// Intelligent Intent Analysis
function analyzeUserIntent(message) {
  const lowerMessage = message.toLowerCase();
  const intent = {
    categories: [],
    needsSmartMatching: false,
    needsPlatformGuidance: false,
    needsUserProfiling: false,
    userLevel: 'unknown',
    specificNeeds: []
  };

  // Detect if user needs Smart Matching
  if (lowerMessage.includes('recommend') || lowerMessage.includes('best program') || 
      lowerMessage.includes('which affiliate') || lowerMessage.includes('find program') ||
      lowerMessage.includes('suggest') || lowerMessage.includes('help me choose')) {
    intent.needsSmartMatching = true;
    intent.categories.push('smart_matching');
  }

  // Detect if user needs platform guidance
  if (lowerMessage.includes('how to use') || lowerMessage.includes('dashboard') ||
      lowerMessage.includes('getting started') || lowerMessage.includes('navigate') ||
      lowerMessage.includes('setup') || lowerMessage.includes('flowlync')) {
    intent.needsPlatformGuidance = true;
    intent.categories.push('platform_guidance');
  }

  // Detect user experience level
  if (lowerMessage.includes('beginner') || lowerMessage.includes('new to') ||
      lowerMessage.includes('just started') || lowerMessage.includes('first time')) {
    intent.userLevel = 'beginner';
    intent.needsUserProfiling = true;
  } else if (lowerMessage.includes('experienced') || lowerMessage.includes('advanced') ||
             lowerMessage.includes('scaling') || lowerMessage.includes('optimize')) {
    intent.userLevel = 'advanced';
  }

  // Add content categories
  if (lowerMessage.includes('affiliate') || lowerMessage.includes('program')) {
    intent.categories.push('affiliate_programs');
  }
  if (lowerMessage.includes('content') || lowerMessage.includes('blog')) {
    intent.categories.push('content_creation');
  }
  if (lowerMessage.includes('seo') || lowerMessage.includes('rank')) {
    intent.categories.push('seo_optimization');
  }

  return intent;
}

// Generate Smart Matching Integration
async function generateSmartMatchingIntegration(intent, userId) {
  return {
    type: 'smart_matching_trigger',
    title: '🎯 Get Personalized Recommendations',
    description: 'Based on your question, I can find the perfect affiliate programs for you using our AI Smart Matching system.',
    action: {
      type: 'smart_matching',
      endpoint: `/api/smart-matching/recommendations?user_id=${userId}&limit=5`,
      button_text: 'Find My Perfect Programs',
      follow_up: 'This will analyze your traffic, audience, and goals to recommend the highest-converting casino affiliate programs for your specific situation.'
    },
    quick_setup: {
      message: "Don't have a profile yet? I can help you set one up in 2 minutes to get better recommendations.",
      setup_url: '/smart-matching'
    }
  };
}

// Generate Platform Guidance
function generatePlatformGuidance(intent) {
  const guidance = {
    type: 'platform_guidance',
    title: '🚀 FlowLync Platform Guide',
    features: []
  };

  guidance.features.push({
    name: 'Smart Matching',
    description: 'AI-powered system that finds the best affiliate programs for your specific situation',
    link: '/smart-matching',
    benefit: 'Save hours of research and find higher-converting programs'
  });

  guidance.features.push({
    name: 'Performance Dashboard',
    description: 'Track your affiliate performance and optimize your earnings',
    link: '/dashboard',
    benefit: 'Monitor what works and scale your best performers'
  });

  guidance.features.push({
    name: 'AI Chat Assistant',
    description: 'Get expert advice anytime with our specialized affiliate marketing AI',
    link: '#chat',
    benefit: 'Instant answers to your affiliate marketing questions'
  });

  return guidance;
}

// Generate User Profiling Questions
function generateUserProfilingQuestions(intent) {
  return {
    type: 'user_profiling',
    title: '💡 Help Me Understand Your Needs',
    description: 'A few quick questions to give you better recommendations:',
    questions: [
      {
        id: 'experience_level',
        question: 'What\'s your experience with affiliate marketing?',
        options: ['Complete beginner', '1-6 months experience', '6+ months experience', 'Expert (2+ years)']
      },
      {
        id: 'traffic_source',
        question: 'What\'s your main traffic source?',
        options: ['Website/Blog', 'Social Media', 'YouTube', 'Email Marketing', 'Paid Ads', 'Other']
      },
      {
        id: 'audience_location',
        question: 'Where is most of your audience located?',
        options: ['United States', 'United Kingdom', 'Canada', 'Europe', 'Global', 'Other']
      }
    ],
    benefit: 'This helps me provide more targeted advice and better affiliate program recommendations.'
  };
}

// Enhanced Groq Response with Platform Context
async function getGroqResponse(message, intent) {
  const systemPrompt = buildSystemPrompt(intent);
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{
        role: 'system',
        content: systemPrompt
      }, {
        role: 'user',
        content: message
      }],
      max_tokens: 200,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// Build context-aware system prompt
function buildSystemPrompt(intent) {
  let basePrompt = `You are an expert affiliate marketing consultant for FlowLync, a platform that helps marketers find and optimize casino affiliate programs using AI-powered Smart Matching technology.`;

  if (intent.needsSmartMatching) {
    basePrompt += ` The user seems interested in finding specific affiliate programs. You should encourage them to use FlowLync's Smart Matching system for personalized recommendations.`;
  }

  if (intent.needsPlatformGuidance) {
    basePrompt += ` The user needs help with the FlowLync platform. Explain how our tools work and guide them to relevant features.`;
  }

  if (intent.userLevel === 'beginner') {
    basePrompt += ` The user appears to be a beginner. Provide simple, step-by-step guidance.`;
  } else if (intent.userLevel === 'advanced') {
    basePrompt += ` The user seems experienced. Provide advanced strategies and technical details.`;
  }

  basePrompt += ` Keep responses concise but valuable (2-3 sentences max). Always end with a helpful suggestion or next step.`;

  return basePrompt;
}

function generateAIResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Affiliate marketing responses
  if (lowerMessage.includes('affiliate') || lowerMessage.includes('program')) {
    const responses = [
      "Great question about affiliate programs! I'd recommend starting with established casino brands that offer 25-45% commission rates. Look for programs with reliable payments and good marketing support.",
      "For affiliate programs, focus on brands with proven track records. Check their payment terms, commission structure, and whether they provide marketing materials to help you succeed."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Content creation responses
  if (lowerMessage.includes('content') || lowerMessage.includes('blog') || lowerMessage.includes('write')) {
    const responses = [
      "Content creation is key to affiliate success! I recommend creating detailed reviews, comparison posts, and beginner guides. These build trust and convert well.",
      "For content that converts, focus on honest reviews with pros and cons, bonus comparisons, and educational content about casino games or betting strategies."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // SEO responses
  if (lowerMessage.includes('seo') || lowerMessage.includes('rank') || lowerMessage.includes('search')) {
    const responses = [
      "For SEO success, target long-tail keywords like 'best casino bonuses for [country]' or 'how to choose safe online casinos'. These have better conversion rates.",
      "SEO tip: Create location-specific content and build topical authority by covering all aspects of your niche. Quality backlinks from gambling/finance sites help too."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Smart Matching integration
  if (lowerMessage.includes('smart') || lowerMessage.includes('match') || lowerMessage.includes('recommend')) {
    return "I can help you find the perfect affiliate programs using our Smart Matching system! It analyzes your traffic, audience, and preferences to recommend the best casino affiliate programs for your specific situation. Would you like me to help you get started?";
  }
  
  // General greeting or help
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
    return "Hello! I'm your AI affiliate marketing assistant. I can help you with affiliate programs, content creation, SEO strategies, and more. What specific challenge are you working on today?";
  }
  
  // Default response
  return "I'm here to help with your affiliate marketing questions! I can assist with finding programs, creating content, SEO optimization, and strategy. What would you like to know more about?";
}