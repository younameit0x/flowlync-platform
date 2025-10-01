import { NextResponse } from 'next/server';

// Simple test to verify API routing is working
export async function GET() {
  return NextResponse.json({
    status: 'API routing is working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      status: 'AI Chat API is working',
      message: body.message || 'No message provided',
      response: 'Hello! I can help you with affiliate marketing. Try asking me about affiliate programs, content ideas, or SEO tips!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    );
  }
}