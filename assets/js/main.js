/**
 * IPTV World - Main JavaScript
 * Fixed Menu & Improved Navigation
 */

function toggleMenu() {
    const nav = document.getElementById('mobileNav');
    const body = document.body;
    
    if (nav) {
        nav.classList.toggle('active');
        body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    }
}

function toggleSubmenu(event, id) {
    event.preventDefault();
    event.stopPropagation();
    
    const submenu = document.getElementById(id);
    if (submenu) {
        // Close other submenus
        document.querySelectorAll('.submenu').forEach(s => {
            if (s.id !== id) s.classList.remove('active');
        });
        submenu.classList.toggle('active');
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const nav = document.getElementById('mobileNav');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (nav && !nav.contains(event.target) && !menuBtn.contains(event.target)) {
        nav.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu
                document.getElementById('mobileNav').classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
});

// Add active class to current page nav
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.style.background = 'var(--primary)';
            link.style.color = 'var(--light)';
        }
    });
});

window.toggleMenu = toggleMenu;
window.toggleSubmenu = toggleSubmenu;