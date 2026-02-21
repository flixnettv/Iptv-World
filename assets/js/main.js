/**
 * IPTV World - Main JavaScript
 * Complete Menu System & Navigation
 * Version: 2.0
 */

/**
 * Toggle Mobile Menu
 */
function toggleMenu() {
    const nav = document.getElementById('mobileNav');
    const body = document.body;
    
    if (nav) {
        nav.classList.toggle('active');
        
        if (nav.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }
}

/**
 * Toggle Submenu (Dynamic Accordion)
 * @param {Event} event - Click event
 * @param {string} id - Submenu ID to toggle
 */
function toggleSubmenu(event, id) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('📂 Toggle submenu:', id);
    
    const submenu = document.getElementById(id);
    if (submenu) {
        // Close all other submenus
        document.querySelectorAll('.submenu').forEach(s => {
            if (s.id !== id) {
                s.classList.remove('active');
            }
        });
        
        // Toggle current submenu
        submenu.classList.toggle('active');
        
        console.log('✅ Submenu state:', submenu.classList.contains('active'));
    }
}
/**
 * Close menu when clicking outside
 */
document.addEventListener('click', function(event) {
    const nav = document.getElementById('mobileNav');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const closeBtn = document.querySelector('.close-menu');
    
    if (nav && !nav.contains(event.target) && 
        !menuBtn.contains(event.target) && 
        (!closeBtn || !closeBtn.contains(event.target))) {
        nav.classList.remove('active');
        document.body.style.overflow = '';
    }
});

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#" or empty
        if (href === '#' || href.length < 2) {
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            
            // Close mobile menu
            const nav = document.getElementById('mobileNav');
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Smooth scroll to target
            target.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    });
});

/** * Add active class to current page navigation
 */
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    console.log('📄 Current page:', currentPage);
    
    // Highlight current page in menu
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        const linkHref = link.getAttribute('href');
        
        if (linkHref) {
            // Check if link matches current page
            if (linkHref.includes(currentPage) || 
                (currentPage === '' && linkHref === 'index.html')) {
                link.style.background = 'var(--primary)';
                link.style.color = 'var(--light)';
                link.style.borderRadius = '12px';
                console.log('✅ Active link:', linkHref);
            }
        }
    });
    
    // Add click handlers to submenu toggles
    document.querySelectorAll('.has-submenu > a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            const submenu = parent.querySelector('.submenu');
            
            if (submenu) {
                // Toggle this submenu
                submenu.classList.toggle('active');
                
                // Close other submenus
                document.querySelectorAll('.has-submenu .submenu').forEach(s => {
                    if (s !== submenu) {
                        s.classList.remove('active');
                    }
                });
            }
        });
    });
    
    console.log('✅ Menu system initialized successfully');
});

/**
 * Handle header scroll effect (optional)
 */window.addEventListener('scroll', function() {
    const header = document.querySelector('.flix-header');
    if (header) {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    }
});

/**
 * Close submenu when clicking on a submenu item
 */
document.addEventListener('click', function(event) {
    if (event.target.closest('.submenu a')) {
        const nav = document.getElementById('mobileNav');
        if (nav && nav.classList.contains('active')) {
            setTimeout(() => {
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }, 300);
        }
    }
});

// Export functions to global scope
window.toggleMenu = toggleMenu;
window.toggleSubmenu = toggleSubmenu;

/**
 * Debug function (remove in production)
 */
window.checkMenu = function() {
    console.log('🔍 Menu Debug:');
    console.log('- Nav element:', document.getElementById('mobileNav'));
    console.log('- Submenus:', document.querySelectorAll('.submenu').length);
    console.log('- Has submenu links:', document.querySelectorAll('.has-submenu > a').length);
};