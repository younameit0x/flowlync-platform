import { NextResponse } from 'next/server';

// Simplified AI Chat Assistant - No external dependencies for testing
class SimpleAIChatAssistant {
  constructor() {
    this.responses = {
      affiliate: [
        "Casino affiliate programs typically offer 25-45% commission rates. Look for programs with reliable payments and good conversion rates.",
        "Start with well-established casino brands that have proven track records in affiliate marketing.",
        "Focus on programs that provide marketing materials and dedicated affiliate managers."
      ],
      content: [
        "Create detailed casino reviews with pros and cons - this builds trust with your audience.",
        "Write comparison posts between different casino bonuses - these convert very well.",
        "Develop beginner guides to casino games - educational content attracts new players."
      ],
      seo: [
        "Target long-tail keywords like 'best casino affiliate programs for beginners'",
        "Create location-specific content if you're targeting certain regions",
        "Build topical authority by covering all aspects of casino affiliate marketing"
      ]
    };
  }

  generateResponse(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('affiliate') || lowerQuery.includes('program')) {
      return this.getRandomResponse('affiliate');
    }
    
    if (lowerQuery.includes('content') || lowerQuery.includes('blog')) {
      return this.getRandomResponse('content');
    }
    
    if (lowerQuery.includes('seo') || lowerQuery.includes('rank')) {
      return this.getRandomResponse('seo');
    }
    
    return "I'm here to help with affiliate marketing! Try asking me about affiliate programs, content creation, or SEO strategies.";
  }

  getRandomResponse(category) {
    const responses = this.responses[category] || this.responses.affiliate;
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// POST /api/ai-chat - Handle chat messages
export async function POST(request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const chatAI = new SimpleAIChatAssistant();
    const response = chatAI.generateResponse(message);

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
      context: 'simple_ai_assistant'
    });

  } catch (error) {
    console.error('Error in AI chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/ai-chat - Health check
export async function GET() {
  return NextResponse.json({
    status: 'AI Chat API is working',
    timestamp: new Date().toISOString()
  });
}
