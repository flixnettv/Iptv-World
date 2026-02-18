import { getSiteConfig, getApps } from './supabase-client.js';

// ========================================
// تهيئة الصفحة
// ========================================
async function initPage() {
    // جلب الإعدادات
    const config = await getSiteConfig();
    if (config) {
        updateContactLinks(config);
    }
    
    // جلب التطبيقات
    await loadApps('smart-tv', 'smart-tv-apps');
    await loadApps('iptv-app', 'iptv-apps');
}

// ========================================
// تحديث روابط التواصل
// ========================================
function updateContactLinks(config) {
    const waLink = document.getElementById('wa-link');
    const tgLink = document.getElementById('tg-link');
    
    if (waLink && config.whatsapp_link) {
        waLink.href = config.whatsapp_link;
    }
    
    if (tgLink && config.telegram_link) {
        tgLink.href = config.telegram_link;
    }
}

// ========================================
// تحميل التطبيقات
// ========================================
async function loadApps(category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const apps = await getApps(category);
    
    if (apps.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #777;">لا توجد تطبيقات متاحة حالياً</p>';
        return;
    }
    
    container.innerHTML = apps.map(app => `
        <div class="app-card" onclick="window.location.href='apps/${app.slug}.html'">
            <img src="${app.logo_url || 'https://cdn-icons-png.flaticon.com/512/43/43319.png'}" 
                 alt="${app.name}" 
                 class="app-logo"
                 onerror="this.src='https://cdn-icons-png.flaticon.com/512/43/43319.png'">
            <h3>${app.name}</h3>
            <p>${app.description || ''}</p>
        </div>
    `).join('');
}

// ========================================
// تشغيل عند التحميل
// ========================================
document.addEventListener('DOMContentLoaded', initPage);