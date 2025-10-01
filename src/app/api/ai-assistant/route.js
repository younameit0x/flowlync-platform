export async function GET() {export async function GET() {export async function GET() {

  return new Response(JSON.stringify({ 

    message: 'AI Assistant API works!',  return new Response(JSON.stringify({   return new Response(JSON.stringify({ 

    timestamp: new Date().toISOString(),

    status: 'active'    message: 'AI Assistant API works!',    message: 'AI Assistant API works!',

  }), {

    headers: { 'Content-Type': 'application/json' }    timestamp: new Date().toISOString(),    timestamp: new Date().toISOString(),

  });

}    status: 'active'    status: 'active'



export async function POST(request) {  }), {  }), {

  try {

    const body = await request.json();    headers: { 'Content-Type': 'application/json' }    headers: { 'Content-Type': 'application/json' }

    return new Response(JSON.stringify({ 

      message: 'AI Assistant POST works!',  });  });

      received: body,

      response: 'Hello from AI Assistant API!'}}

    }), {

      headers: { 'Content-Type': 'application/json' }

    });

  } catch (error) {export async function POST(request) {export async function POST(request) {

    return new Response(JSON.stringify({ 

      error: 'Invalid JSON'  try {  try {

    }), {

      status: 400,    const body = await request.json();    const body = await request.json();

      headers: { 'Content-Type': 'application/json' }

    });    return new Response(JSON.stringify({     return new Response(JSON.stringify({ 

  }

}      message: 'AI Assistant POST works!',      message: 'AI Assistant POST works!',

      received: body,      received: body,

      response: 'Hello from AI Assistant API!'      response: 'Hello from AI Assistant API!'

    }), {    }), {

      headers: { 'Content-Type': 'application/json' }      headers: { 'Content-Type': 'application/json' }

    });    });

  } catch (error) {  } catch (error) {

    return new Response(JSON.stringify({     return new Response(JSON.stringify({ 

      error: 'Invalid JSON'      error: 'Invalid JSON'

    }), {    }), {

      status: 400,      status: 400,

      headers: { 'Content-Type': 'application/json' }      headers: { 'Content-Type': 'application/json' }

    });    });

  }  }

}      ]
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
