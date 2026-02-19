// ===================================
// IPTV World - Main Application Script
// ===================================

// Initialize Supabase Client (مهم جدًا: نستورد supabase بدل createClient)
import { supabase } from './supabase-client.js';

// DOM Elements
const appsContainer = document.getElementById('apps-container');
const noAppsMessage = document.getElementById('no-apps');
const menuToggle = document.getElementById('menu-toggle');
const closeMenu = document.getElementById('close-menu');
const mobileMenu = document.getElementById('mobile-menu');
const widgetToggle = document.getElementById('widget-toggle');
const widgetOptions = document.getElementById('widget-options');

// ================================
// Initialize Application
// ================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    initApp();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize floating widget
    initFloatingWidget();
    
    // Add triple-tap test for Supabase
    addTripleTapTest();
});

// ================================
// Application Functions
// ================================

function initApp() {
    // Load applications
    loadApplications();
}

// ================================
// Load Applications from Supabase
// ================================

async function loadApplications() {
    try {
        // Show loading state        appsContainer.innerHTML = `
            <div class="loading" role="status" aria-live="polite">
                <i class="fas fa-spinner fa-spin"></i>
                <p>جاري تحميل التطبيقات...</p>
            </div>
        `;
        
        // Get applications from the database (مهم جدًا: نستخدم supabase مباشرة)
        const { data, error } = await supabase
            .from('apps')
            .select('*')
            .order('id', { ascending: true });
        
        // Handle errors
        if (error) {
            console.error('Error loading applications:', error);
            appsContainer.innerHTML = `
                <div class="error" role="alert">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>حدث خطأ في تحميل التطبيقات. يرجى المحاولة لاحقاً.</p>
                </div>
            `;
            return;
        }
        
        // Check if we have applications
        if (!data || data.length === 0) {
            noAppsMessage.style.display = 'block';
            appsContainer.innerHTML = '';
            return;
        }
        
        // Render applications
        renderApplications(data);
        
    } catch (error) {
        console.error('Unexpected error:', error);
        appsContainer.innerHTML = `
            <div class="error" role="alert">
                <i class="fas fa-exclamation-triangle"></i>
                <p>حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.</p>
            </div>
        `;
    }
}

// ================================
// Render Applications
// ================================
function renderApplications(apps) {
    // Clear container
    appsContainer.innerHTML = '';
    
    // Create grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'apps-grid';
    gridContainer.setAttribute('role', 'list');
    
    // Add each app to the grid
    apps.forEach(app => {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.setAttribute('role', 'listitem');
        card.setAttribute('aria-label', `${app.name} - ${app.description}`);
        
        card.innerHTML = `
            <div class="app-image">
                <i class="fas fa-tv" style="font-size: 64px;"></i>
            </div>
            <div class="app-info">
                <h3>${app.name}</h3>
                <p>${app.description}</p>
                <div class="app-price">${app.price}$ / سنوياً</div>
                <a href="apps/${app.name.toLowerCase()}.html" class="app-btn">
                    تفعيل التطبيق
                </a>
            </div>
        `;
        
        gridContainer.appendChild(card);
    });
    
    // Add grid to container
    appsContainer.appendChild(gridContainer);
    
    // Hide no apps message
    noAppsMessage.style.display = 'none';
}

// ================================
// Mobile Menu Functions
// ================================

function initMobileMenu() {
    if (!menuToggle || !closeMenu || !mobileMenu) return;
    
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');        document.body.style.overflow = 'hidden';
    });
    
    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
}

// ================================
// Floating Widget Functions
// ================================

function initFloatingWidget() {
    if (!widgetToggle || !widgetOptions) return;
    
    widgetToggle.addEventListener('click', () => {
        const isExpanded = widgetToggle.getAttribute('aria-expanded') === 'true';
        widgetOptions.classList.toggle('active');
        widgetToggle.setAttribute('aria-expanded', !isExpanded);
    });
    
    // Close widget when clicking outside
    document.addEventListener('click', (e) => {
        if (widgetOptions.classList.contains('active') && 
            !widgetOptions.contains(e.target) && 
            !widgetToggle.contains(e.target)) {
            widgetOptions.classList.remove('active');
            widgetToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ================================
// Triple Tap Test for Supabase
// ================================

function addTripleTapTest() {
    const logo = document.querySelector('.logo');
    let tapCount = 0;    let lastTapTime = 0;
    const tripleTapThreshold = 500; // 500 مللي ثانية

    if (logo) {
        logo.addEventListener('click', () => {
            const currentTime = Date.now();
            if (currentTime - lastTapTime < tripleTapThreshold) {
                tapCount++;
            } else {
                tapCount = 1;
            }
            lastTapTime = currentTime;

            if (tapCount >= 3) {
                testSupabaseConnection();
                tapCount = 0;
            }
        });
    }
}

async function testSupabaseConnection() {
    try {
        // اختبار الربط بـ Supabase (مهم جدًا: نستخدم supabase مباشرة)
        const { data, error } = await supabase.from('apps').select('*');
        
        if (error) {
            alert(`⚠️ خطأ في الربط: ${error.message}\n\nالسبب المحتمل:\n- المتغيرات غلط على Vercel\n- الجدول مش موجود`);
        } else {
            if (data.length > 0) {
                alert(`✅ الربط شغال!\n\n- وجدنا ${data.length} تطبيقات\n- اضغط على "التطبيقات" لرؤيتها`);
            } else {
                alert(`⚠️ الربط شغال لكن الجدول فاضي!\n\n- روح لـ Supabase Dashboard\n- أضف تطبيقات في جدول "apps"`);
            }
        }
    } catch (err) {
        alert(`❌ خطأ في الاختبار:\n${err.message}\n\nالخطوات المطلوبة:\n1. تأكد من المتغيرات على Vercel\n2. تأكد من وجود جدول "apps"`);
    }
}

// ================================
// Smooth Scroll for Navigation
// ================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});