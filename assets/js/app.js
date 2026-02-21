// Initialize Supabase Client
const supabaseUrl = SUPABASE_CONFIG.url;
const supabaseKey = SUPABASE_CONFIG.anonKey;
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Load applications from Supabase
async function loadApps() {
  const container = document.getElementById('apps-container');
  
  if (!container) {
    console.log('Apps container not found');
    return;
  }

  try {
    // Show loading
    container.innerHTML = '<div style="text-align:center;padding:50px;">جاري تحميل التطبيقات...</div>';

    // Fetch from Supabase
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error:', error);
      container.innerHTML = '<div style="text-align:center;padding:50px;color:red;">حدث خطأ في التحميل</div>';
      return;
    }

    if (!data || data.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:50px;">لا توجد تطبيقات حالياً</div>';
      return;
    }

    // Display apps
    container.innerHTML = data.map(app => `
      <div class="app-card" style="border:1px solid #ddd;border-radius:10px;padding:20px;margin:15px;text-align:center;">
        <img src="${app.image_url || 'https://via.placeholder.com/300x200'}" 
             alt="${app.name}" 
             style="max-width:100%;border-radius:8px;">
        <h3 style="margin:15px 0 10px;">${app.name}</h3>
        <p style="color:#666;">${app.description || ''}</p>
        <p style="color:#e91e63;font-size:20px;font-weight:bold;">$${app.price || '70'}</p>
        <a href="https://wa.me/1234567890?text=أريد%20تفعيل%20${encodeURIComponent(app.name)}" 
           class="btn" 
           style="display:inline-block;background:#e91e63;color:white;padding:10px 25px;text-decoration:none;border-radius:5px;margin-top:10px;"
           target="_blank">
          اشترِ الآن
        </a>
      </div>
    `).join('');

  } catch (err) {
    console.error('Error:', err);
    container.innerHTML = '<div style="text-align:center;padding:50px;color:red;">خطأ غير متوقع</div>';
  }
}

// Load when page is ready
document.addEventListener('DOMContentLoaded', loadApps);