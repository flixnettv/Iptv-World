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