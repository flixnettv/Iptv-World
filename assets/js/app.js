// app.js
// Load applications from Supabase

async function loadApps() {
  const container = document.getElementById('apps-container');
  
  if (!container) {
    console.error('Apps container not found');
    return;
  }

  try {
    // Show loading
    container.innerHTML = `
      <div class="loading" role="status" aria-live="polite">
        <i class="fas fa-spinner fa-spin"></i>
        <p>جاري تحميل التطبيقات...</p>
      </div>
    `;

    // Check if Supabase client is available
    if (!window.supabaseClient) {
      throw new Error('Supabase client not initialized. Waiting...');
    }

    // Fetch from Supabase
    const { data, error } = await window.supabaseClient
      .from('apps')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading apps:', error);
      throw error;
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

    // Display apps
    container.innerHTML = data.map(app => `
      <div class="app-card" role="listitem">
        <img src="${app.image_url || 'https://via.placeholder.com/300x200'}" 
             alt="${app.name}" 
             loading="lazy">
        <h3>${app.name}</h3>
        <p class="description">${app.description || ''}</p>
        <p class="price">$${app.price || '70'}</p>
        <a href="https://wa.me/1234567890?text=${encodeURIComponent('أريد تفعيل ' + app.name)}" 
           class="btn btn-primary" 
           target="_blank" 
           rel="noopener noreferrer">
          <i class="fab fa-whatsapp"></i>
          اشترِ الآن
        </a>
      </div>
    `).join('');

  } catch (err) {
    console.error('Error:', err);
    container.innerHTML = `
      <div class="error-message" role="alert">
        <i class="fas fa-exclamation-triangle"></i>
        <p>حدث خطأ في تحميل التطبيقات. يرجى المحاولة لاحقاً.</p>
      </div>
    `;
  }
}

// Load apps when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadApps);
} else {
  loadApps();
}