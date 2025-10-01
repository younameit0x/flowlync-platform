export async function GET() {
  return new Response(JSON.stringify({
    message: 'AI Assistant API works!',
    timestamp: new Date().toISOString(),
    status: 'active'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return new Response(JSON.stringify({
      message: 'AI Assistant POST works!',
      received: body,
      response: 'Hello from AI Assistant API!'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Invalid JSON'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
