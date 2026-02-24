const CONFIG = {
    DATA_URL: '/data/apps.json',
    CONTAINER: 'apps-container',
    LOADING: 'loading-msg',
    ERROR: 'error-msg'
};

const AUTO_SCROLL = {
    interval: 2000,
    distance: 80,
    direction: 1
};

let autoScrollTimer;
let appsDataCache = null;

/**
 * Get Apps Data (Cached)
 */
async function getAppsData() {
    if (!appsDataCache) {
        const res = await fetch(CONFIG.DATA_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        appsDataCache = await res.json();
    }
    return appsDataCache;
}

/**
 * Auto-scroll function
 */
function startAutoScroll() {
    if (autoScrollTimer) clearInterval(autoScrollTimer);
    
    autoScrollTimer = setInterval(() => {
        const container = document.getElementById('apps-scroll-container');
        if (!container) return;
        
        const maxScroll = container.scrollWidth - container.clientWidth;
        const currentScroll = container.scrollLeft;
        
        if (currentScroll >= maxScroll - 10) {
            AUTO_SCROLL.direction = -1;
        } else if (currentScroll <= 10) {
            AUTO_SCROLL.direction = 1;
        }
        
        container.scrollBy({
            left: AUTO_SCROLL.distance * AUTO_SCROLL.direction,
            behavior: 'smooth'        });
    }, AUTO_SCROLL.interval);
}

/**
 * Load applications
 */
async function loadApps() {
    const container = document.getElementById(CONFIG.CONTAINER);
    const loading = document.getElementById(CONFIG.LOADING);
    const error = document.getElementById(CONFIG.ERROR);
    
    if (!container) return;
    
    try {
        loading?.classList.remove('hidden');
        error?.classList.add('hidden');
        
        const json = await getAppsData();
        const apps = (json.apps || []).filter(app => app.is_active !== false);
        
        loading?.classList.add('hidden');
        
        if (apps.length === 0) {
            container.innerHTML = '<p class="no-apps">No applications available.</p>';
            return;
        }
        
        container.innerHTML = apps.map((app, index) => {
            // Determine activation page based on activation_type
            const activatePage = app.activation_type === 'smart-tv' 
                ? 'activate-smart-tv.html' 
                : 'activate-app.html';
            
            return `
            <article class="app-card-square" style="animation-delay: ${index * 0.05}s">
                <a href="${activatePage}?app=${encodeURIComponent(app.id)}" style="display:block; height:100%;">
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
                </a>            </article>
        `}).join('');
        
        setTimeout(startAutoScroll, 1000);
        
    } catch (err) {
        console.error('❌ Error loading apps:', err);
        loading?.classList.add('hidden');
        error?.classList.remove('hidden');
    }
}

/**
 * Load Mobile Menu Apps
 */
async function loadMobileMenuApps() {
    try {
        const json = await getAppsData();
        const apps = (json.apps || []).filter(app => app.is_active !== false);
        
        const submenu = document.getElementById('apps-submenu');
        if (!submenu) return;
        
        submenu.innerHTML = apps.map(app => {
            // Determine activation page based on activation_type
            const activatePage = app.activation_type === 'smart-tv' 
                ? 'activate-smart-tv.html' 
                : 'activate-app.html';
            
            return `
            <li>
                <a href="${activatePage}?app=${encodeURIComponent(app.id)}" onclick="closeMobileMenu()">
                    ${escapeHtml(app.name)}
                </a>
            </li>
        `}).join('');
        
    } catch (err) {
        console.error('Error loading mobile menu apps:', err);
    }
}

/**
 * Toggle Submenu
 */
function toggleSubmenu(event) {
    event.preventDefault();
    const toggle = event.currentTarget;
    const submenu = document.getElementById('apps-submenu');
        toggle.classList.toggle('active');
    
    if (submenu.classList.contains('show')) {
        submenu.classList.remove('show');
    } else {
        submenu.classList.add('show');
    }
}

/**
 * Close Mobile Menu
 */
function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    if (mobileNav) {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    const submenu = document.getElementById('apps-submenu');
    const toggle = document.querySelector('.submenu-toggle');
    if (submenu) submenu.classList.remove('show');
    if (toggle) toggle.classList.remove('active');
}

/**
 * Escape HTML
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
 * Initialize
 */
document.addEventListener('DOMContentLoaded', function() {
    // Load apps
    loadApps();
    loadMobileMenuApps();
    
    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menuBtn');    const closeMenu = document.getElementById('closeMenu');
    const mobileNav = document.getElementById('mobileNav');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (mobileNav) {
                mobileNav.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    if (closeMenu) {
        closeMenu.addEventListener('click', function() {
            if (mobileNav) {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    if (mobileNav) {
        mobileNav.addEventListener('click', function(e) {
            if (e.target === mobileNav) {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

/**
 * Cleanup
 */
window.addEventListener('beforeunload', () => {
    if (autoScrollTimer) clearInterval(autoScrollTimer);
});

/**
 * Close menu on outside click
 */
document.addEventListener('click', function(event) {
    const mobileNav = document.getElementById('mobileNav');
    const menuBtn = document.getElementById('menuBtn');
    
    if (mobileNav && menuBtn && 
        !mobileNav.contains(event.target) && 
        !menuBtn.contains(event.target) && 
        mobileNav.classList.contains('active')) {        closeMobileMenu();
    }
});