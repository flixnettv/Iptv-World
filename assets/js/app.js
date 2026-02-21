// app.js
// Load apps directly using window.supabase (after config.js loads)

async function loadApps() {
  const container = document.getElementById('apps-container');
  if (!container) return;

  try {
    // Show loading
    container.innerHTML = `
      <div class="loading" role="status">
        <i class="fas fa-spinner fa-spin"></i>
        <p>جاري التحميل...</p>
      </div>
    `;

    // ✅ تأكد من أن window.SUPABASE_CONFIG موجود
    if (typeof window.SUPABASE_CONFIG === 'undefined') {
      throw new Error('⚠️ window.SUPABASE_CONFIG غير مُعرّف! تحقق من config.js');
    }

    const { url, anonKey } = window.SUPABASE_CONFIG;
    
    // ✅ استخدم window.supabase مباشرة (اللي تم تحميله من CDN)
    if (typeof window.supabase === 'undefined') {
      throw new Error('⚠️ window.supabase غير متوفر! تحقق من تحميل Supabase CDN');
    }

    const supabase = window.supabase.createClient(url, anonKey);

    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = `
        <div class="no-apps">
          <i class="fas fa-inbox"></i>
          <p>لا توجد تطبيقات متاحة حالياً</p>
        </div>
      `;
      return;
    }

    container.innerHTML = data.map(app => `
      <div class="app-card">
        <img src="${app.image_url || 'https://via.placeholder.com/300x200'}" alt="${app.name}">
        <h3>${app.name}</h3>
        <p>${app.description || ''}</p>
        <p class="price">$${app.price || '70'}</p>
        <a href="https://wa.me/1234567890?text=${encodeURIComponent('أريد تفعيل ' + app.name)}" 
           target="_blank" class="btn">تفعيل الآن</a>
      </div>
    `).join('');

  } catch (err) {
    console.error('❌ خطأ:', err);
    document.getElementById('apps-container').innerHTML = `
      <div class="error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>فشل التحميل: ${err.message}</p>
        <small>تأكد من: 1) config.js مُحمّل 2) روابط Supabase صحيحة</small>
      </div>
    `;
  }
}

// ابدأ بعد تحميل DOM
document.addEventListener('DOMContentLoaded', () => {
  // انتظر قليلاً للتأكد من تحميل Supabase CDN
  setTimeout(loadApps, 300);
});