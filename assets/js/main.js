/**
 * IPTV World - Main JavaScript
 * Dynamic Menu System
 */

function toggleMenu() {
    const nav = document.getElementById('mobileNav');
    if (nav) {
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    }
}

function toggleSubmenu(event, id) {
    event.preventDefault();
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

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

window.toggleMenu = toggleMenu;
window.toggleSubmenu = toggleSubmenu;