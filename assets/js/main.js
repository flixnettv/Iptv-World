// IPTV World - Static JSON Loader
async function loadApps() {
    const container = document.getElementById('apps-container');
    const loading = document.getElementById('loading-msg');
    const error = document.getElementById('error-msg');
    
    if (!container) return;
    
    try {
        if (loading) loading.style.display = 'block';
        if (error) error.style.display = 'none';
        
        const response = await fetch('data/apps.json');
        if (!response.ok) throw new Error('فشل التحميل');
        
        const json = await response.json();
        const apps = json.apps.filter(app => app.is_active !== false);
        
        if (loading) loading.style.display = 'none';
        
        if (apps.length === 0) {
            container.innerHTML = '<p>لا توجد تطبيقات متاحة</p>';
            return;
        }
        
        container.innerHTML = apps.map(app => `
            <div class="app-card">
                <img src="${app.image_url}" alt="${app.name}">
                <h3>${app.name}</h3>
                <p>${app.description}</p>
                <div class="price">${app.price} ${app.currency}/year</div>
                <a href="activate.html?app=${app.id}" class="btn">اشترك الآن</a>
            </div>
        `).join('');
        
    } catch (err) {
        console.error('Error:', err);
        if (loading) loading.style.display = 'none';
        if (error) {
            error.style.display = 'block';
            error.textContent = 'حدث خطأ أثناء التحميل';
        }
    }
}

document.addEventListener('DOMContentLoaded', loadApps);