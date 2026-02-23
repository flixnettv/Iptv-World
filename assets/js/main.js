/**
 * IPTV World - Main JavaScript
 * GitHub + Vercel Static Site
 */

const CONFIG = {
    DATA_URL: '/data/apps.json',
    CONTAINER: 'apps-container',
    LOADING: 'loading-msg',
    ERROR: 'error-msg'
};

// Auto-Scroll Configuration
const AUTO_SCROLL = {
    interval: 2000,      // 2 seconds
    distance: 80,        // pixels per scroll
    direction: 1         // 1 = right, -1 = left
};

let autoScrollTimer;

/**
 * Auto-scroll function for apps container
 */
function startAutoScroll() {
    if (autoScrollTimer) clearInterval(autoScrollTimer);
    
    autoScrollTimer = setInterval(() => {
        const container = document.getElementById('apps-scroll-container');
        if (!container) return;
        
        const maxScroll = container.scrollWidth - container.clientWidth;
        const currentScroll = container.scrollLeft;
        
        // Reverse direction at edges
        if (currentScroll >= maxScroll - 10) {
            AUTO_SCROLL.direction = -1;
        } else if (currentScroll <= 10) {
            AUTO_SCROLL.direction = 1;
        }
        
        // Smooth scroll
        container.scrollBy({
            left: AUTO_SCROLL.distance * AUTO_SCROLL.direction,
            behavior: 'smooth'
        });
    }, AUTO_SCROLL.interval);
}

/** * Load and display applications from JSON
 */
async function loadApps() {
    const container = document.getElementById(CONFIG.CONTAINER);
    const loading = document.getElementById(CONFIG.LOADING);
    const error = document.getElementById(CONFIG.ERROR);
    
    if (!container) return;
    
    try {
        // Show loading, hide error
        loading?.classList.remove('hidden');
        error?.classList.add('hidden');
        
        // Fetch data from GitHub-hosted JSON
        const response = await fetch(CONFIG.DATA_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const json = await response.json();
        const apps = (json.apps || []).filter(app => app.is_active !== false);
        
        // Hide loading
        loading?.classList.add('hidden');
        
        // Handle empty state
        if (apps.length === 0) {
            container.innerHTML = '<p class="no-apps">No applications available.</p>';
            return;
        }
        
        // Render square cards
        container.innerHTML = apps.map((app, index) => `
            <article class="app-card-square" style="animation-delay: ${index * 0.05}s">
                <a href="activate.html?app=${encodeURIComponent(app.id)}" style="display:block; height:100%;">
                    <div class="app-image">
                        <img src="${app.image_url}" 
                             alt="${escapeHtml(app.name)}"
                             loading="lazy"
                             onerror="this.src='https://via.placeholder.com/400x200/e91e63/ffffff?text=IPTV'">
                    </div>
                    <div class="app-info">
                        <h3>${escapeHtml(app.name)}</h3>
                        <span class="flix-btn flix-btn-primary">
                            <i class="fas fa-shopping-cart"></i> Subscribe
                        </span>
                    </div>
                </a>
            </article>
        `).join('');
                // Start auto-scroll after render
        setTimeout(startAutoScroll, 1000);
        
    } catch (err) {
        console.error('❌ Error loading apps:', err);
        loading?.classList.add('hidden');
        error?.classList.remove('hidden');
    }
}

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Initialize on DOM ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadApps);
} else {
    loadApps();
}

/**
 * Cleanup on page unload
 */
window.addEventListener('beforeunload', () => {
    if (autoScrollTimer) clearInterval(autoScrollTimer);
});