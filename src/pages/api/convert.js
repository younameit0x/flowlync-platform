// Next.js API route for logging demo conversions
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { linkId } = req.body;
  if (!linkId) {
    return res.status(400).json({ error: 'Missing linkId' });
  }
  // Log conversion event in Supabase
  const { error } = await supabase.from('demo_conversions').insert([
    {
      link_id: linkId,
      timestamp: new Date().toISOString(),
    },
  ]);
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ success: true });
}
