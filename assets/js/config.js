// ⚠️ تحذير: المفاتيح دي هتتحط فعلياً في Vercel Environment Variables
// للكود المحلي، حط القيم هنا للتجربة بس

export const SUPABASE_CONFIG = {
    url: 'https://YOUR_PROJECT_ID.supabase.co',
    anonKey: 'YOUR_ANON_KEY'
};

// هنتغير القيم دي لما نرفع على Vercel
export const isProduction = window.location.hostname.includes('vercel.app');