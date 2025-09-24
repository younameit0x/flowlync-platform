// Next.js API route for logging demo link clicks
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { linkId } = req.query;
  if (!linkId) {
    return res.status(400).json({ error: 'Missing linkId' });
  }
  // Log click event in Supabase
  const { error } = await supabase.from('demo_clicks').insert([
    {
      link_id: linkId,
      timestamp: new Date().toISOString(),
      user_agent: req.headers['user-agent'] || '',
      referrer: req.headers.referer || '',
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '',
    },
  ]);
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  // Redirect to conversion simulation page
  res.redirect(`/demo-convert?linkId=${encodeURIComponent(linkId)}`);
}
