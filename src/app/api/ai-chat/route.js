export async function GET() {
  return new Response(JSON.stringify({ 
    status: 'AI Chat API is working!',
    endpoints: ['POST /api/ai-chat'],
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

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

    // Generate AI response based on message content
    const response = generateAIResponse(message);

    return new Response(JSON.stringify({
      response,
      timestamp: new Date().toISOString(),
      context: 'ai_chat_assistant'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI Chat error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process message',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
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