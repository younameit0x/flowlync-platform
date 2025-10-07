// Next.js API route for logging demo conversions
// Mock implementation for demo purposes - works without Supabase setup

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { linkId } = req.body;
  if (!linkId) {
    return res.status(400).json({ error: "Missing linkId" });
  }

  // Mock successful conversion for demo purposes
  console.log(
    `Demo conversion logged: ${linkId} at ${new Date().toISOString()}`,
  );

  // Simulate a small delay like a real database call
  await new Promise((resolve) => setTimeout(resolve, 500));

  res.status(200).json({
    success: true,
    message: "Demo conversion logged successfully",
    linkId: linkId,
    timestamp: new Date().toISOString(),
  });
}
