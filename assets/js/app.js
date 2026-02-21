/**
 * IPTV World - Main Application Script
 * النسخة النهائية - تستخدم API Proxy
 * @author Hany
 * @version 2.0
 */

// ===================================
// Global State
// ===================================
const AppState = {
    apps: [],
    loading: false,
    error: null,
};

// ===================================
// Initialize Application
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 IPTV World App Initialized');
    initializeApp();
    setupEventListeners();
});

async function initializeApp() {
    const container = document.getElementById('apps-container');
    if (!container) {
        console.warn('Apps container not found');
        return;
    }

    try {
        AppState.loading = true;
        showLoading(container);
        
        AppState.apps = await fetchAppsFromAPI();
        
        if (!AppState.apps || AppState.apps.length === 0) {
            showNoApps(container);
            return;
        }

        renderApps(container, AppState.apps);
        
        // Update stats if exists
        updateStats(AppState.apps.length);

    } catch (error) {
        console.error('Initialization Error:', error);        AppState.error = error.message;
        showError(container, error.message);
    } finally {
        AppState.loading = false;
    }
}

// ===================================
// API Functions
// ===================================
async function fetchAppsFromAPI() {
    const response = await fetch('/api/supabase-proxy?table=apps', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
        throw new Error(result.error || 'Failed to fetch apps');
    }

    return result.data || [];
}

async function fetchAppById(id) {
    const response = await fetch(`/api/supabase-proxy?table=apps&id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success || !result.data || result.data.length === 0) {
        throw new Error('App not found');
    }

    return result.data[0];}

// ===================================
// Rendering Functions
// ===================================
function renderApps(container, apps) {
    container.innerHTML = '';
    
    const grid = document.createElement('div');
    grid.className = 'apps-grid';
    grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 2rem;
        padding: 1rem;
        max-width: 1400px;
        margin: 0 auto;
    `;

    apps.forEach((app, index) => {
        const card = createAppCard(app, index);
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

function createAppCard(app, index) {
    const card = document.createElement('div');
    card.className = 'app-card';
    card.style.cssText = `
        background: var(--card-bg, #ffffff);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: fadeInUp 0.6s ease ${index * 0.1}s both;
        border: 1px solid rgba(0,0,0,0.05);
    `;

    // Hover effect
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
        card.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.2)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
    });
    const appName = escapeHtml(app.name || 'تطبيق IPTV');
    const appDescription = escapeHtml(app.description || 'تطبيق مميز لمشاهدة القنوات العربية والعالمية');
    const appPrice = app.price || 70;
    const appSlug = slugify(appName);

    card.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 220px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        ">
            <div style="
                position: absolute;
                width: 150%;
                height: 150%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                animation: pulse 3s ease-in-out infinite;
            "></div>
            <i class="fas fa-tv" style="
                font-size: 80px; 
                color: white;
                z-index: 1;
                filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
            "></i>
        </div>
        <div style="padding: 1.75rem;">
            <h3 style="
                margin: 0 0 0.75rem 0;
                color: var(--text-dark, #1a1a1a);
                font-size: 1.4rem;
                font-weight: 700;
            ">${appName}</h3>
            <p style="
                margin: 0 0 1.25rem 0;
                color: var(--text-muted, #666);
                font-size: 0.95rem;
                line-height: 1.7;
            ">${appDescription}</p>
            
            <div style="
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1.25rem;
                flex-wrap: wrap;
            ">                <span style="
                    background: #eef2ff;
                    color: #667eea;
                    padding: 0.35rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                ">HD/FHD/4K</span>
                <span style="
                    background: #eef2ff;
                    color: #667eea;
                    padding: 0.35rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                ">دعم فني 24/7</span>
            </div>

            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.25rem;
                padding: 1rem;
                background: #f8f9ff;
                border-radius: 12px;
            ">
                <div>
                    <span style="
                        font-size: 1.75rem;
                        font-weight: 800;
                        color: #667eea;
                    ">${appPrice}$</span>
                    <span style="
                        font-size: 0.9rem;
                        color: var(--text-muted, #666);
                        margin-right: 0.25rem;
                    ">/ سنوياً</span>
                </div>
                <div style="
                    background: #10b981;
                    color: white;
                    padding: 0.4rem 0.8rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                ">
                    <i class="fas fa-check-circle" style="margin-left: 0.35rem;"></i>
                    متوفر
                </div>            </div>

            <a href="/apps/${appSlug}.html" style="
                display: block;
                text-align: center;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 700;
                font-size: 1.05rem;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.3)'">
                <i class="fas fa-rocket" style="margin-left: 0.5rem;"></i>
                تفعيل التطبيق
            </a>
        </div>
    `;

    return card;
}

// ===================================
// UI Helper Functions
// ===================================
function showLoading(container) {
    container.innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 4rem 2rem;
            gap: 1.5rem;
            min-height: 400px;
        ">
            <div class="spinner" style="
                width: 60px;
                height: 60px;
                border: 4px solid #eef2ff;
                border-top: 4px solid #667eea;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
            <p style="
                color: var(--text-muted, #666);
                font-size: 1.1rem;
                font-weight: 500;            ">جاري تحميل التطبيقات...</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.5; }
                50% { transform: scale(1.1); opacity: 0.8; }
            }
        </style>
    `;
}

function showNoApps(container) {
    container.innerHTML = `
        <div style="
            text-align: center;
            padding: 4rem 2rem;
            color: var(--text-muted, #666);
            background: #f8f9ff;
            border-radius: 16px;
            margin: 2rem auto;
            max-width: 600px;
        ">
            <i class="fas fa-inbox" style="
                font-size: 5rem; 
                margin-bottom: 1.5rem;
                color: #667eea;
                opacity: 0.5;
            "></i>
            <h3 style="
                margin: 0 0 0.75rem 0;
                color: var(--text-dark, #1a1a1a);
                font-size: 1.5rem;
            ">لا توجد تطبيقات متاحة حالياً</h3>
            <p style="margin: 0; font-size: 1rem;">سنتواصل معك قريباً بتطبيقات جديدة</p>
        </div>
    `;}

function showError(container, message) {
    container.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #fee 0%, #fcc 100%);
            border: 2px solid #fcc;
            border-radius: 16px;
            padding: 2.5rem;
            text-align: center;
            max-width: 600px;
            margin: 2rem auto;
            box-shadow: 0 4px 15px rgba(204, 51, 51, 0.2);
        ">
            <i class="fas fa-exclamation-triangle" style="
                color: #c33;
                font-size: 3rem;
                margin-bottom: 1.25rem;
                display: block;
            "></i>
            <h3 style="
                margin: 0 0 0.75rem 0;
                color: #c33;
                font-size: 1.4rem;
                font-weight: 700;
            ">حدث خطأ في تحميل التطبيقات</h3>
            <p style="
                color: #666; 
                font-size: 0.95rem; 
                margin-bottom: 1.5rem;
                line-height: 1.6;
            ">${escapeHtml(message)}</p>
            <button onclick="window.location.reload()" style="
                padding: 0.85rem 2rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-size: 1rem;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.3)'">
                <i class="fas fa-redo" style="margin-left: 0.5rem;"></i>
                إعادة المحاولة
            </button>
        </div>
    `;
}
function updateStats(count) {
    const statsElement = document.querySelector('.stats-count');
    if (statsElement) {
        statsElement.textContent = count;
    }
}

// ===================================
// Event Listeners
// ===================================
function setupEventListeners() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle, .mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu, .navbar-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Form submissions (if any)    setupFormHandlers();
}

function setupFormHandlers() {
    const forms = document.querySelectorAll('form[data-ajax]');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleFormSubmit(form);
        });
    });
}

async function handleFormSubmit(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    
    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        const response = await fetch(form.action || window.location.href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('فشل في إرسال البيانات');
        }

        showNotification('تم الإرسال بنجاح!', 'success');
        form.reset();

    } catch (error) {
        console.error('Form Error:', error);
        showNotification(error.message || 'حدث خطأ', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }}

// ===================================
// Utility Functions
// ===================================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#667eea'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideDown 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Export for external use
// ===================================
window.IPTVWorld = {
    fetchApps: fetchAppsFromAPI,
    fetchAppById: fetchAppById,
    state: AppState,
};

console.log('✅ IPTV World API Ready');