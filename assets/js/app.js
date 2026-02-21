// assets/js/app.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('apps-container');
  if (!container) return;

  // التحقق من وجود window.SUPABASE_CONFIG
  if (typeof window.SUPABASE_CONFIG === 'undefined') {
    container.innerHTML = `
      <div class="error" role="alert">
        <i class="fas fa-exclamation-triangle"></i>
        <p>❌ config.js لم يُحمّل</p>
        <small>السبب: قد يكون supabase-client.js مُرفقاً في index.html — احذفه!</small>
      </div>
    `;
    console.error('SUPABASE_CONFIG not defined');
    return;
  }

  // التحقق من وجود مكتبة Supabase من CDN
  if (typeof window.supabase === 'undefined') {
    container.innerHTML = `
      <div class="error" role="alert">
        <i class="fas fa-exclamation-triangle"></i>
        <p>❌ مكتبة Supabase غير محملة</p>
        <small>تأكد من وجود سكريبت Supabase في index.html قبل config.js</small>
      </div>
    `;
    console.error('Supabase library not loaded');
    return;
  }

  // إنشاء العميل
  const { url, anonKey } = window.SUPABASE_CONFIG;
  const supabase = window.supabase.createClient(url, anonKey);

  // جلب البيانات
  supabase
    .from('apps')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        console.error('Supabase Error:', error);
        container.innerHTML = `
          <div class="error" role="alert">
            <i class="fas fa-exclamation-triangle"></i>
            <p>فشل التحميل: ${error.message}</p>
            <small>تحقق من: RLS مفعل؟ الجدول apps موجود؟</small>
          </div>
        `;
        return;
      }

      if (!data || data.length === 0) {
        container.innerHTML = `
          <div class="no-apps" role="alert">
            <i class="fas fa-inbox"></i>
            <p>لا توجد تطبيقات متاحة حالياً</p>
          </div>
        `;
        return;
      }

      container.innerHTML = data.map(app => `
        <div class="app-card" role="article">
          <img src="${app.image_url || 'https://via.placeholder.com/300x200'}" 
               alt="${app.name}" 
               loading="lazy">
          <h3>${app.name}</h3>
          <p class="description">${app.description || ''}</p>
          <p class="price">$${app.price || '70'}</p>
          <a href="https://wa.me/1234567890?text=${encodeURIComponent('أريد تفعيل ' + app.name)}" 
             target="_blank" 
             rel="noopener noreferrer"
             class="btn btn-primary">
            <i class="fab fa-whatsapp"></i> تفعيل الآن
          </a>
        </div>
      `).join('');
    });
});