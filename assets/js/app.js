// ===================================
// IPTV World - Main Application Script
// ===================================

// Initialize Supabase Client
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
    // Check if we're in production
    const isProduction = import.meta.env.PROD;
    
    // Load applications
    loadApplications();
}

// ================================
// Load Applications from Supabase
// ================================
async function loadApplications() {
    try {
        // Show loading state
        appsContainer.innerHTML = `
            <div class="loading" role="status" aria-live="polite">
                <i class="fas fa-spinner fa-spin"></i>
                <p>جاري تحميل التطبيقات...</p>
            </div>
        `;
        
        // Get applications from the database
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

// ================================// Render Applications
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
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    });
    
    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menu