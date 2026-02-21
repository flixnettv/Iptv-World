// api/supabase-proxy.js (Vercel Edge Function)
    import { createClient } from '@supabase/supabase-js';

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // أو ANON_KEY إذا كانت RLS مفعلة
    );

    export default async function handler(req, res) {
      // فقط GET مسموح
      if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { table, select = '*', eq } = req.query;

      if (!table) {
        return res.status(400).json({ error: 'Table name is required' });
      }

      let query = supabase.from(table).select(select);

      if (eq) {
        const [column, value] = eq.split(':');
        if (column && value) {
          query = query.eq(column, value);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase Error:', error);
        return res.status(500).json({ error: error.message });
      }

      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(data);
    }