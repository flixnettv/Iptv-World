/**
 * IPTV World - Main JavaScript
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
    event.stopPropagation();
    
    const submenu = document.getElementById(id);
    if (submenu) {
        // Close other submenus
        document.querySelectorAll('.submenu').forEach(s => {
            if (s.id !== id) {
                s.classList.remove('active');
            }
        });
        
        // Toggle current submenu
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

window.toggleMenu = toggleMenu;
window.toggleSubmenu = toggleSubmenu;