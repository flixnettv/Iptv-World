const CONFIG = {
    DATA_URL: 'https://raw.githubusercontent.com/flixnettv/Iptv-World/main/data/apps.json',
    CONTAINER: 'apps-container',
    LOADING: 'loading-msg',
    ERROR: 'error-msg'
};

async function loadApps() {
    const container = document.getElementById(CONFIG.CONTAINER);
    const loading = document.getElementById(CONFIG.LOADING);
    const error = document.getElementById(CONFIG.ERROR);
    
    if (!container) return;
    
    try {
        loading?.classList.remove('hidden');
        error?.classList.add('hidden');
        
        const response = await fetch(CONFIG.DATA_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const json = await response.json();
        const apps = (json.apps || []).filter(app => app.is_active !== false);
        
        loading?.classList.add('hidden');
        
        if (apps.length === 0) {
            container.innerHTML = '<p class="no-apps">No applications available.</p>';
            return;
        }
        
        container.innerHTML = apps.map((app, index) => `
            <article class="app-card" style="animation: fadeInUp 0.5s ease ${index * 0.1}s both">
                <div class="app-image">
                    <img src="${app.image_url}" alt="${escapeHtml(app.name)}"
                         onerror="this.src='https://via.placeholder.com/400x200/e91e63/ffffff?text=IPTV'">
                </div>
                <div class="app-info">
                    <h3>${escapeHtml(app.name)}</h3>
                    <p class="app-desc">${escapeHtml(app.description)}</p>
                    ${app.features?.length ? `
                    <ul class="app-features">
                        ${app.features.slice(0, 3).map(f => `<li>${escapeHtml(f)}</li>`).join('')}
                    </ul>` : ''}
                    <div class="app-price">${app.price} ${app.currency}/year</div>
                    <a href="activate.html?app=${encodeURIComponent(app.id)}" class="flix-btn flix-btn-primary">
                        <i class="fas fa-shopping-cart"></i> Subscribe Now
                    </a>
                </div>
            </article>
        `).join('');
        
    } catch (err) {
        console.error('❌ Error loading apps:', err);
        loading?.classList.add('hidden');
        error?.classList.remove('hidden');
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadApps);
} else {
    loadApps();
}
// Auto-Scroll Variables
let autoScrollInterval;
let isAutoScrollPaused = false;
let scrollDirection = 1; // 1 = right, -1 = left

// Horizontal Scroll Function
function scrollApps(distance) {
    const container = document.getElementById('apps-scroll-container');
    if (container) {
        container.scrollBy({
            left: distance,
            behavior: 'smooth'
        });
    }
}

// Auto-Scroll Function
function startAutoScroll() {
    if (autoScrollInterval) clearInterval(autoScrollInterval);
    
    autoScrollInterval = setInterval(() => {
        if (!isAutoScrollPaused) {
            const container = document.getElementById('apps-scroll-container');
            if (container) {
                const maxScroll = container.scrollWidth - container.clientWidth;
                const currentScroll = container.scrollLeft;
                
                // Change direction at edges
                if (currentScroll >= maxScroll - 10) {
                    scrollDirection = -1;
                } else if (currentScroll <= 10) {
                    scrollDirection = 1;
                }
                
                // Scroll smoothly
                container.scrollBy({
                    left: 100 * scrollDirection,
                    behavior: 'smooth'
                });
            }
        }
    }, 2000); // Every 2 seconds
}

// Toggle Pause
function toggleAutoScroll() {
    isAutoScrollPaused = !isAutoScrollPaused;
    const btn = document.getElementById('pause-btn');
    if (btn) {
        if (isAutoScrollPaused) {            btn.innerHTML = '<i class="fas fa-play"></i> <span>Resume Auto-Scroll</span>';
            btn.style.background = '#28a745';
        } else {
            btn.innerHTML = '<i class="fas fa-pause"></i> <span>Pause Auto-Scroll</span>';
            btn.style.background = 'var(--dark)';
        }
    }
}

// Update loadApps for compact cards
async function loadApps() {
    const container = document.getElementById(CONFIG.CONTAINER);
    const loading = document.getElementById(CONFIG.LOADING);
    const error = document.getElementById(CONFIG.ERROR);
    
    if (!container) return;
    
    try {
        loading?.classList.remove('hidden');
        error?.classList.add('hidden');
        
        const response = await fetch(CONFIG.DATA_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const json = await response.json();
        const apps = (json.apps || []).filter(app => app.is_active !== false);
        
        loading?.classList.add('hidden');
        
        if (apps.length === 0) {
            container.innerHTML = '<p class="no-apps">No applications available.</p>';
            return;
        }
        
        // Compact Card Layout
        container.innerHTML = apps.map((app, index) => `
            <article class="app-card-compact" style="animation-delay: ${index * 0.05}s">
                <div class="app-image">
                    <img src="${app.image_url}" 
                         alt="${escapeHtml(app.name)}"
                         onerror="this.src='https://via.placeholder.com/400x200/e91e63/ffffff?text=IPTV'">
                </div>
                <div class="app-info">
                    <h3>${escapeHtml(app.name)}</h3>
                    <p class="app-desc">${escapeHtml(app.description)}</p>
                    ${app.features?.length ? `
                    <ul class="app-features">
                        ${app.features.slice(0, 2).map(f => `<li>${escapeHtml(f)}</li>`).join('')}
                    </ul>` : ''}
                    <div class="app-price">${app.price} ${app.currency}/year</div>                    <a href="activate.html?app=${encodeURIComponent(app.id)}" class="flix-btn flix-btn-primary">
                        <i class="fas fa-shopping-cart"></i> Subscribe
                    </a>
                </div>
            </article>
        `).join('');
        
        // Start auto-scroll after apps load
        setTimeout(() => {
            startAutoScroll();
        }, 1000);
        
        // Pause on hover
        const scrollContainer = document.getElementById('apps-scroll-container');
        if (scrollContainer) {
            scrollContainer.addEventListener('mouseenter', () => {
                isAutoScrollPaused = true;
            });
            
            scrollContainer.addEventListener('mouseleave', () => {
                isAutoScrollPaused = false;
            });
        }
        
    } catch (err) {
        console.error('❌ Error loading apps:', err);
        loading?.classList.add('hidden');
        error?.classList.remove('hidden');
    }
}
// Update loadApps function to use horizontal cards
async function loadApps() {
    const container = document.getElementById(CONFIG.CONTAINER);
    const loading = document.getElementById(CONFIG.LOADING);
    const error = document.getElementById(CONFIG.ERROR);
    
    if (!container) return;
    
    try {
        loading?.classList.remove('hidden');
        error?.classList.add('hidden');
        
        const response = await fetch(CONFIG.DATA_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const json = await response.json();
        const apps = (json.apps || []).filter(app => app.is_active !== false);
        
        loading?.classList.add('hidden');
        
        if (apps.length === 0) {
            container.innerHTML = '<p class="no-apps">No applications available.</p>';
            return;
        }
        
        // Horizontal Card Layout
        container.innerHTML = apps.map((app, index) => `
            <article class="app-card-horizontal" style="animation-delay: ${index * 0.1}s">
                <div class="app-image">
                    <img src="${app.image_url}" 
                         alt="${escapeHtml(app.name)}"
                         onerror="this.src='https://via.placeholder.com/400x200/e91e63/ffffff?text=IPTV'">
                </div>
                <div class="app-info">
                    <h3>${escapeHtml(app.name)}</h3>
                    <p class="app-desc">${escapeHtml(app.description)}</p>
                    ${app.features?.length ? `
                    <ul class="app-features">
                        ${app.features.slice(0, 3).map(f => `<li>${escapeHtml(f)}</li>`).join('')}
                    </ul>` : ''}
                    <div class="app-price">${app.price} ${app.currency}/year</div>
                    <a href="activate.html?app=${encodeURIComponent(app.id)}" class="flix-btn flix-btn-primary">
                        <i class="fas fa-shopping-cart"></i> Subscribe Now
                    </a>
                </div>
            </article>
        `).join('');
        
    } catch (err) {
        console.error('❌ Error loading apps:', err);
        loading?.classList.add('hidden');
        error?.classList.remove('hidden');
    }
}