(function () {
  'use strict';

  function initHeader() {
    const hamburger = document.getElementById('hamburger');
    const navList = document.getElementById('navList');
    const navItems = document.querySelectorAll('.nav__item');
    const breakpointMobile = 900;
    let isMobile = window.innerWidth <= breakpointMobile;
    let isMenuOpen = false;

    console.log('Header initialization started');

    // Close all dropdowns and mega menus
    function closeAllDropdowns() {
      console.log('Closing all dropdowns');
      navItems.forEach(item => {
        if (item.classList.contains('open')) {
          item.classList.remove('open');
          const link = item.querySelector('.nav__link');
          if (link) {
            link.setAttribute('aria-expanded', 'false');
          }
          const dropdown = item.querySelector('.dropdown, .mega-menu');
          if (dropdown) {
            dropdown.setAttribute('aria-hidden', 'true');
          }
        }
      });
    }

    // Close mobile menu
    function closeMobileMenu() {
      console.log('Closing mobile menu');
      if (navList) {
        navList.classList.remove('nav__list--open');
        isMenuOpen = false;
      }
      if (hamburger) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
      closeAllDropdowns();
    }

    // Open mobile menu
    function openMobileMenu() {
      console.log('Opening mobile menu');
      if (navList) {
        navList.classList.add('nav__list--open');
        isMenuOpen = true;
      }
      if (hamburger) {
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
      }
    }

    // Toggle mobile menu
    function toggleMobileMenu() {
      console.log('Toggling mobile menu, current state:', isMenuOpen);
      if (isMenuOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    }

    // Initialize hamburger button
    if (hamburger && navList) {
      hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleMobileMenu();
      });

      // Add keyboard support for hamburger
      hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleMobileMenu();
        }
        if (e.key === 'Escape' && isMenuOpen) {
          closeMobileMenu();
        }
      });
    } else {
      console.error('Hamburger or navList not found!');
    }

    // Close menu when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (isMobile && isMenuOpen && !e.target.closest('.header__inner')) {
        closeMobileMenu();
      }
      
      // Close dropdowns when clicking outside on desktop
      if (!isMobile && !e.target.closest('.nav__item') && !e.target.closest('.mega-menu') && !e.target.closest('.dropdown')) {
        closeAllDropdowns();
      }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (isMobile && isMenuOpen) {
          closeMobileMenu();
          if (hamburger) hamburger.focus();
        } else {
          closeAllDropdowns();
        }
      }
    });

    // Setup each navigation item
    navItems.forEach((item, index) => {
      const link = item.querySelector('.nav__link');
      const hasDropdown = item.querySelector('.dropdown, .mega-menu');
      const dropdown = item.querySelector('.dropdown, .mega-menu');

      if (!link) return;

      // Initialize ARIA attributes
      if (!link.hasAttribute('aria-expanded')) {
        link.setAttribute('aria-expanded', 'false');
      }
      if (hasDropdown && !link.hasAttribute('aria-haspopup')) {
        link.setAttribute('aria-haspopup', 'true');
      }

      // Initialize dropdown visibility
      if (dropdown && !dropdown.hasAttribute('aria-hidden')) {
        dropdown.setAttribute('aria-hidden', 'true');
      }

      // Desktop hover behavior
      if (hasDropdown && !isMobile) {
        let closeTimeout;
        
        item.addEventListener('mouseenter', () => {
          console.log(`Mouse enter on item ${index}`);
          clearTimeout(closeTimeout);
          closeAllDropdowns();
          item.classList.add('open');
          link.setAttribute('aria-expanded', 'true');
          if (dropdown) dropdown.setAttribute('aria-hidden', 'false');
        });

        item.addEventListener('mouseleave', (e) => {
          console.log(`Mouse leave from item ${index}`);
          
          // Clear any existing timeout
          clearTimeout(closeTimeout);
          
          // Set a timeout to close
          closeTimeout = setTimeout(() => {
            // Check if mouse is still over the item or dropdown
            const isOverItem = item.matches(':hover');
            const isOverDropdown = dropdown && dropdown.matches(':hover');
            
            if (!isOverItem && !isOverDropdown) {
              item.classList.remove('open');
              link.setAttribute('aria-expanded', 'false');
              if (dropdown) dropdown.setAttribute('aria-hidden', 'true');
            }
          }, 150);
        });

        // Add mouse events to dropdown as well
        if (dropdown) {
          dropdown.addEventListener('mouseenter', () => {
            clearTimeout(closeTimeout);
          });

          dropdown.addEventListener('mouseleave', () => {
            closeTimeout = setTimeout(() => {
              item.classList.remove('open');
              link.setAttribute('aria-expanded', 'false');
              dropdown.setAttribute('aria-hidden', 'true');
            }, 150);
          });
        }

        // Keep dropdown open when focus is inside
        item.addEventListener('focusin', () => {
          console.log(`Focus in on item ${index}`);
          clearTimeout(closeTimeout);
          closeAllDropdowns();
          item.classList.add('open');
          link.setAttribute('aria-expanded', 'true');
          if (dropdown) dropdown.setAttribute('aria-hidden', 'false');
        });

        item.addEventListener('focusout', (e) => {
          closeTimeout = setTimeout(() => {
            if (!item.contains(document.activeElement) && 
                (!dropdown || !dropdown.contains(document.activeElement))) {
              console.log(`Focus out from item ${index}`);
              item.classList.remove('open');
              link.setAttribute('aria-expanded', 'false');
              if (dropdown) dropdown.setAttribute('aria-hidden', 'true');
            }
          }, 100);
        });
      }

      // Mobile click behavior
      link.addEventListener('click', (e) => {
        console.log(`Link clicked on item ${index}, isMobile: ${isMobile}, hasDropdown: ${hasDropdown}`);
        
        if (isMobile && hasDropdown) {
          e.preventDefault();
          e.stopPropagation();
          
          const isOpen = item.classList.contains('open');
          console.log(`Dropdown is currently open: ${isOpen}`);
          
          // Close other dropdowns
          navItems.forEach(other => {
            if (other !== item && other.classList.contains('open')) {
              other.classList.remove('open');
              const otherLink = other.querySelector('.nav__link');
              if (otherLink) otherLink.setAttribute('aria-expanded', 'false');
              const otherDropdown = other.querySelector('.dropdown, .mega-menu');
              if (otherDropdown) otherDropdown.setAttribute('aria-hidden', 'true');
            }
          });
          
          // Toggle current dropdown
          if (isOpen) {
            console.log(`Closing dropdown ${index}`);
            item.classList.remove('open');
            link.setAttribute('aria-expanded', 'false');
            if (dropdown) dropdown.setAttribute('aria-hidden', 'true');
          } else {
            console.log(`Opening dropdown ${index}`);
            item.classList.add('open');
            link.setAttribute('aria-expanded', 'true');
            if (dropdown) dropdown.setAttribute('aria-hidden', 'false');
          }
        } else if (isMobile && !hasDropdown) {
          // Regular links on mobile close the menu
          console.log(`Regular link click on mobile, closing menu`);
          closeMobileMenu();
        }
      });

      // Keyboard navigation
      link.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && isMobile && hasDropdown) {
          e.preventDefault();
          console.log(`Keyboard activation of dropdown ${index}`);
          link.click();
        }
      });
    });

    // Handle window resize
    function handleResize() {
      const wasMobile = isMobile;
      isMobile = window.innerWidth <= breakpointMobile;
      
      console.log(`Resize: wasMobile=${wasMobile}, isMobile=${isMobile}`);
      
      if (wasMobile && !isMobile) {
        // Switching to desktop - close mobile menu
        console.log('Switching to desktop mode');
        closeMobileMenu();
        closeAllDropdowns();
      } else if (!wasMobile && isMobile) {
        // Switching to mobile - close all dropdowns
        console.log('Switching to mobile mode');
        closeAllDropdowns();
      }
    }

    // Add resize listener
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 150);
    });
    
    window.addEventListener('orientationchange', handleResize);

    // Initialize on page load
    handleResize();

    // Make sure mega menus are properly hidden initially
    document.querySelectorAll('.mega-menu, .dropdown').forEach(el => {
      if (!el.hasAttribute('aria-hidden')) {
        el.setAttribute('aria-hidden', 'true');
      }
    });

    console.log('Header initialization complete');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
  } else {
    initHeader();
  }
})();