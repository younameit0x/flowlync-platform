// Next.js API route for logging demo link clicks
// Mock implementation for demo purposes - works without Supabase setup

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { linkId } = req.query;
  if (!linkId) {
    return res.status(400).json({ error: "Missing linkId" });
  }

  // Mock click logging for demo purposes
  console.log(
    `Demo click tracked: ${linkId} from ${req.headers["user-agent"]} at ${new Date().toISOString()}`,
  );

  // Redirect to conversion simulation page
  res.redirect(`/demo-convert?linkId=${encodeURIComponent(linkId)}`);
}
