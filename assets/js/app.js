// assets/js/app.js
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('apps-container');
  if (!container) return;

  try {
    // عرض حالة التحميل
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> جاري تحميل التطبيقات...</div>';

    // الاتصال الآمن بـ Vercel Proxy بدلاً من كشف مفاتيح Supabase
    // هذا الطلب سيذهب إلى ملف api/supabase-proxy.js الخاص بك
    const response = await fetch('/api/supabase-proxy?table=apps&eq=is_active:true');
    
    if (!response.ok) {
        throw new Error('مشكلة في جلب البيانات من السيرفر');
    }

    const data = await response.json();

    // في حال عدم وجود تطبيقات
    if (!data || data.length === 0) {
      container.innerHTML = `
        <div class="no-apps">
          <i class="fas fa-inbox"></i>
          <p>لا توجد تطبيقات متاحة حالياً</p>
        </div>
      `;
      return;
    }

    // عرض التطبيقات ديناميكياً
    container.innerHTML = data.map(app => `
      <div class="app-card">
        <img src="${app.image_url || 'https://via.placeholder.com/300x200'}" alt="${app.name}">
        <h3>${app.name}</h3>
        <p>${app.description || 'تطبيق مميز لمشاهدة القنوات'}</p>
        <a href="apps/${app.slug || 'flix'}.html" class="btn">تفعيل الآن</a>
      </div>
    `).join('');

  } catch (error) {
    console.error('Fetch Error:', error);
    container.innerHTML = `
      <div class="error" role="alert">
        <i class="fas fa-exclamation-triangle"></i>
        <p>❌ فشل تحميل التطبيقات</p>
        <small>${error.message}</small>
      </div>
    `;
  }
});
