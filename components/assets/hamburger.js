// ===== SIMPLIFIED HAMBURGER MENU =====
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.querySelector('.nav');
    const navItems = document.querySelectorAll('.nav__item');
    const body = document.body;
    
    // Toggle menu function
    function toggleMenu() {
        const isOpen = nav.classList.contains('nav--open');
        
        if (isOpen) {
            // Close menu
            hamburger.classList.remove('active');
            nav.classList.remove('nav--open');
            body.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
            
            // Close all dropdowns
            navItems.forEach(item => {
                item.classList.remove('open');
                const dropdown = item.querySelector('.dropdown, .mega-menu');
                if (dropdown) dropdown.classList.remove('menu-open');
            });
        } else {
            // Open menu
            hamburger.classList.add('active');
            nav.classList.add('nav--open');
            body.classList.add('menu-open');
            hamburger.setAttribute('aria-expanded', 'true');
        }
    }
    
    // Toggle hamburger menu
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Handle dropdowns on mobile
    navItems.forEach(item => {
        const link = item.querySelector('.nav__link');
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 900) {
                const hasDropdown = item.classList.contains('has-dropdown') || 
                                    item.classList.contains('has-mega');
                
                if (hasDropdown) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Toggle current dropdown
                    item.classList.toggle('open');
                    const dropdown = item.querySelector('.dropdown, .mega-menu');
                    if (dropdown) dropdown.classList.toggle('menu-open');
                    
                    // Close other dropdowns
                    navItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('open')) {
                            otherItem.classList.remove('open');
                            const otherDropdown = otherItem.querySelector('.dropdown, .mega-menu');
                            if (otherDropdown) otherDropdown.classList.remove('menu-open');
                        }
                    });
                }
            }
        });
    });
    
    // Close menu when clicking on a regular link
    nav.addEventListener('click', function(e) {
        if (window.innerWidth <= 900) {
            const link = e.target.closest('a');
            if (link) {
                const parentItem = link.closest('.nav__item');
                const hasDropdown = parentItem && (parentItem.classList.contains('has-dropdown') || 
                                                   parentItem.classList.contains('has-mega'));
                
                if (!hasDropdown) {
                    // Regular link - close menu
                    toggleMenu();
                }
            }
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 900) {
            const isClickInside = nav.contains(e.target) || hamburger.contains(e.target);
            const isMenuOpen = nav.classList.contains('nav--open');
            
            if (!isClickInside && isMenuOpen) {
                toggleMenu();
            }
        }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && window.innerWidth <= 900 && 
            nav.classList.contains('nav--open')) {
            toggleMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 900 && nav.classList.contains('nav--open')) {
            toggleMenu();
        }
    });
});