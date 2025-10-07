export async function GET() {
  return new Response(
    JSON.stringify({
      message: "Test API works!",
      timestamp: new Date().toISOString(),
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}

export async function POST() {
  return new Response(
    JSON.stringify({
      message: "Test POST works!",
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
