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
    // Show loading state
    container.innerHTML = '<div class="loading">جاري تحميل التطبيقات...</div>';

    // Fetch data from Supabase
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading apps:', error);
      container.innerHTML = '<div class="error">حدث خطأ في تحميل التطبيقات</div>';
      return;
    }

    if (!data || data.length === 0) {
      container.innerHTML = '<div class="no-data">لا توجد تطبيقات متاحة حالياً</div>';
      return;
    }

    // Render apps
    container.innerHTML = data.map(app => `
      <div class="app-card">
        <img src="${app.image_url || 'https://via.placeholder.com/300x200'}" alt="${app.name}">
        <h3>${app.name}</h3>
        <p class="description">${app.description || ''}</p>
        <p class="price">$${app.price || '70'}</p>
        <a href="https://wa.me/1234567890?text=أريد تفعيل ${app.name}" 
           class="btn btn-primary" 
           target="_blank">
          تفعيل الآن
        </a>
      </div>
    `).join('');

  } catch (err) {
    console.error('Unexpected error:', err);
    container.innerHTML = '<div class="error">حدث خطأ غير متوقع</div>';
  }
}

// Load apps when page loads
document.addEventListener('DOMContentLoaded', loadApps);