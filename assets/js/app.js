// assets/js/app.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('apps-container');
  if (!container) return;

  // التحقق من وجود window.SUPABASE_CONFIG
  if (typeof window.SUPABASE_CONFIG === 'undefined') {
    container.innerHTML = `
      <div class="error" role="alert">
        <i class="fas fa-exclamation-triangle"></i>
        <p>❌ خطأ: config.js لم يُحمّل</p>
        <small>السبب: قد يكون supabase-client.js موجوداً في index.html — احذفه!</small>
      </div>
    `;
    console.error('SUPABASE_CONFIG not defined');
    return;
  }

  // التحقق من وجود مكتبة Supabase
  if (typeof window.supabase === 'undefined') {
    container.innerHTML = `
      <div class="error" role="alert">
        <i class="fas fa-exclamation-triangle"></i>
        <p>❌ مكتبة Supabase غير محملة</p>
        <small>تأكد من وجود السكريبت من CDN قبل config.js</small>
      </div>
    `;
    console.error('Supabase library not loaded');
    return;
  }

  // إنشاء العميل
  const { url, anonKey } = window.SUPABASE_CONFIG;
  const supabase = window.supabase.createClient(url, anonKey);

  // جلب التطبيقات
  supabase
    .from('apps')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        console.error('Supabase Error:', error);
        container.innerHTML = `<div class="error">فشل التحميل: ${error.message}</div>`;
        return;
      }

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
    });
});