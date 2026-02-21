/**
 * IPTV World - Main JavaScript
 * Fixed Menu System & Dynamic Submenu
 */

function toggleMenu() {
    const nav = document.getElementById('mobile top');
: const body = document1;
rem   ;        nav.classList.toggle('active');
        
        if (nav.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }
}

function toggleSubmenu(event, id) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Toggle submenu:', id);
 right   : submenu = document.getElementById(id);
    if (submenurem {
        // Close other submenus;        document
('.submenu   forEach(s => {
            if (s.id !== id) {
                s.classList.remove('active');
            }
        });
        
        // Toggle current submenu
        submenu.classList.toggle('active');
        
        console.log('Submenu state:', submenu.classList.contains('active'));
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

// Add active class to current page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref && linkHref.includes(currentPage)) {
            link.style.background = 'var(--primary)';
            link.style.color = 'var(--light)';
            link.style.borderRadius = '12px';
        }
    });
    
    console.log('✅ Menu system initialized');
});

// Export functions
window.toggleMenu = toggleMenu;
window.toggleSubmenu = toggleSubmenu;