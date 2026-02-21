// app.js
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('apps-container');
  if (!container) return;

  // 1. تحقق من وجود window.SUPABASE_CONFIG
  if (typeof window.SUPABASE_CONFIG === 'undefined') {
    container.innerHTML = `
      <div class="error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>⚠️ خطأ: ملف config.js لم يُحمّل بشكل صحيح</p>
        <small>الرجاء التأكد من:</small>
        <ul>
          <li>الملف assets/js/config.js موجود</li>
          <li>الترتيب في index.html: config.js قبل app.js</li>
        </ul>
      </div>
    `;
    console.error('SUPABASE_CONFIG not found');
    return;
  }

  // 2. تحقق من وجود window.supabase (من CDN)
  if (typeof window.supabase === 'undefined') {
    container.innerHTML = `
      <div class="error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>⚠️ خطأ: مكتبة Supabase لم تُحمّل</p>
        <small>الرجاء التأكد من وجود سكريبت Supabase في index.html</small>
      </div>
    `;
    console.error('Supabase library not loaded');
    return;
  }

  // 3. إنشاء العميل
  const { url, anonKey } = window.SUPABASE_CONFIG;
  const supabase = window.supabase.createClient(url, anonKey);

  // 4. جلب البيانات
  try {
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
    console.error('❌ خطأ في جلب البيانات:', err);
    container.innerHTML = `
      <div class="error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>فشل التحميل: ${err.message}</p>
      </div>
    `;
  }
});