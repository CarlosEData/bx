// ============================================
// HAMBURGUER JS - VERSÃO PREMIUM
// Menu de tela cheia com funcionalidades premium
// ============================================

(function () {
  'use strict';

  const CONFIG = {
    breakpoint: 900,
    animationDuration: 400,
    itemStaggerDelay: 50
  };

  // Elementos principais
  const elements = {
    hamburger: null,
    navList: null,
    navItems: [],
    navOverlay: null,
    navClose: null,
    body: document.body
  };

  // Estado
  const state = {
    isMobile: false,
    isMenuOpen: false,
    isTransitioning: false,
    activeDropdown: null,
    scrollPosition: 0
  };

  // ==================== FUNÇÕES UTILITÁRIAS ====================
  
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function checkMobileMode() {
    return window.innerWidth <= CONFIG.breakpoint;
  }

  // ==================== SISTEMA DE OVERLAY ====================
  
  function createOverlay() {
    if (elements.navOverlay) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.4s ease, visibility 0.4s ease;
    `;
    
    overlay.addEventListener('click', closeMobileMenu);
    document.body.appendChild(overlay);
    elements.navOverlay = overlay;
  }

  // ==================== GESTÃO DE SCROLL ====================
  
  function manageBodyScroll(lock) {
    if (lock) {
      state.scrollPosition = window.scrollY;
      elements.body.style.position = 'fixed';
      elements.body.style.top = `-${state.scrollPosition}px`;
      elements.body.style.width = '100%';
      elements.body.style.overflow = 'hidden';
      elements.body.classList.add('menu-open');
      elements.body.setAttribute('data-scroll-position', state.scrollPosition);
    } else {
      elements.body.style.position = '';
      elements.body.style.top = '';
      elements.body.style.width = '';
      elements.body.style.overflow = '';
      elements.body.classList.remove('menu-open');
      
      const savedPosition = elements.body.getAttribute('data-scroll-position');
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition));
      }
      elements.body.removeAttribute('data-scroll-position');
    }
  }

  // ==================== ACORDEÃO ====================
  
  function closeAllDropdowns() {
    elements.navItems.forEach(item => {
      const link = item.querySelector('.nav__link');
      const dropdown = item.querySelector('.dropdown, .mega-menu');
      
      item.classList.remove('open');
      if (link) link.setAttribute('aria-expanded', 'false');
      if (dropdown) dropdown.setAttribute('aria-hidden', 'true');
    });
    
    state.activeDropdown = null;
  }

  function toggleDropdown(item) {
    if (state.isTransitioning) return;
    
    const isOpening = !item.classList.contains('open');
    
    // Fecha outros dropdowns no mobile
    if (state.isMobile && isOpening) {
      elements.navItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          closeDropdown(otherItem);
        }
      });
    }
    
    // Alterna o atual
    if (isOpening) {
      openDropdown(item);
    } else {
      closeDropdown(item);
    }
  }

  function openDropdown(item) {
    const link = item.querySelector('.nav__link');
    const dropdown = item.querySelector('.dropdown, .mega-menu');
    
    item.classList.add('open');
    if (link) link.setAttribute('aria-expanded', 'true');
    if (dropdown) dropdown.setAttribute('aria-hidden', 'false');
    
    state.activeDropdown = item;
  }

  function closeDropdown(item) {
    const link = item.querySelector('.nav__link');
    const dropdown = item.querySelector('.dropdown, .mega-menu');
    
    item.classList.remove('open');
    if (link) link.setAttribute('aria-expanded', 'false');
    if (dropdown) dropdown.setAttribute('aria-hidden', 'true');
    
    if (state.activeDropdown === item) {
      state.activeDropdown = null;
    }
  }

  // ==================== MENU MOBILE ====================
  
  function closeMobileMenu() {
    if (!state.isMenuOpen || state.isTransitioning) return;
    
    state.isTransitioning = true;
    
    // Fecha visual
    if (elements.navList) {
      elements.navList.classList.remove('nav__list--open');
    }
    
    if (elements.hamburger) {
      elements.hamburger.classList.remove('active');
      elements.hamburger.setAttribute('aria-expanded', 'false');
    }
    
    // Fecha overlay
    if (elements.navOverlay) {
      elements.navOverlay.classList.remove('active');
      setTimeout(() => {
        elements.navOverlay.style.display = 'none';
        elements.navOverlay.setAttribute('aria-hidden', 'true');
      }, 400);
    }
    
    // Libera scroll
    manageBodyScroll(false);
    
    // Fecha dropdowns
    closeAllDropdowns();
    
    // Anima itens para saída
    elements.navItems.forEach((item, index) => {
      item.style.transitionDelay = `${index * 20}ms`;
      item.style.opacity = '0';
      item.style.transform = 'translateY(10px)';
    });
    
    // Atualiza estado
    setTimeout(() => {
      state.isMenuOpen = false;
      state.isTransitioning = false;
      
      // Reset animações dos itens
      elements.navItems.forEach(item => {
        item.style.transitionDelay = '';
        item.style.opacity = '';
        item.style.transform = '';
      });
    }, CONFIG.animationDuration);
  }

  function openMobileMenu() {
    if (state.isMenuOpen || state.isTransitioning) return;
    
    state.isTransitioning = true;
    
    // Cria overlay
    createOverlay();
    
    // Mostra overlay
    if (elements.navOverlay) {
      elements.navOverlay.style.display = 'block';
      elements.navOverlay.setAttribute('aria-hidden', 'false');
      
      setTimeout(() => {
        elements.navOverlay.classList.add('active');
      }, 10);
    }
    
    // Abre menu
    if (elements.navList) {
      elements.navList.classList.add('nav__list--open');
    }
    
    if (elements.hamburger) {
      elements.hamburger.classList.add('active');
      elements.hamburger.setAttribute('aria-expanded', 'true');
    }
    
    // Bloqueia scroll
    manageBodyScroll(true);
    
    // Anima itens para entrada
    setTimeout(() => {
      elements.navItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * CONFIG.itemStaggerDelay}ms`;
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      });
    }, 100);
    
    // Atualiza estado
    setTimeout(() => {
      state.isMenuOpen = true;
      state.isTransitioning = false;
      
      // Foco no botão fechar
      if (elements.navClose) {
        elements.navClose.focus();
      }
    }, CONFIG.animationDuration);
  }

  function toggleMobileMenu() {
    if (state.isTransitioning) return;
    
    if (state.isMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  // ==================== EVENT HANDLERS ====================
  
  function handleHamburgerClick(e) {
    e.stopPropagation();
    toggleMobileMenu();
  }

  function handleCloseClick(e) {
    e.stopPropagation();
    closeMobileMenu();
  }

  function handleMobileClick(e, item, hasDropdown) {
    if (!state.isMobile) return;
    
    if (hasDropdown) {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown(item);
    } else {
      setTimeout(closeMobileMenu, 150);
    }
  }

  function handleOutsideClick(e) {
    const clickedInside = e.target.closest('.nav__list') || 
                         e.target.closest('.nav__mobile-header');
    const clickedHamburger = e.target.closest('#hamburger');
    
    if (state.isMobile && state.isMenuOpen && !clickedInside && !clickedHamburger) {
      closeMobileMenu();
      return;
    }
    
    if (!state.isMobile && !clickedInside) {
      closeAllDropdowns();
    }
  }

  function handleEscapeKey(e) {
    if (e.key !== 'Escape') return;
    
    if (state.isMobile && state.isMenuOpen) {
      closeMobileMenu();
      if (elements.hamburger) elements.hamburger.focus();
    } else {
      closeAllDropdowns();
    }
  }

  function handleKeydown(e, item, hasDropdown) {
    if (e.key === 'Enter' || e.key === ' ') {
      if (state.isMobile && hasDropdown) {
        e.preventDefault();
        toggleDropdown(item);
      }
    }
    
    if (e.key === 'Escape' && state.isMobile && item.classList.contains('open')) {
      e.preventDefault();
      closeDropdown(item);
    }
  }

  const handleResize = debounce(() => {
    const wasMobile = state.isMobile;
    state.isMobile = checkMobileMode();
    
    if (wasMobile !== state.isMobile) {
      closeMobileMenu();
      closeAllDropdowns();
      setupNavigationItems();
    }
  }, 150);

  // ==================== SETUP ====================
  
  function setupNavigationItems() {
    elements.navItems.forEach((item) => {
      const link = item.querySelector('.nav__link');
      const hasDropdown = item.querySelector('.dropdown, .mega-menu');
      
      if (!link) return;
      
      // Remove listeners antigos
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);
      const newLink = newItem.querySelector('.nav__link');
      
      // Clique mobile
      newLink.addEventListener('click', (e) => {
        if (state.isMobile && hasDropdown) {
          e.preventDefault();
          e.stopPropagation();
          toggleDropdown(newItem);
        } else if (state.isMobile) {
          setTimeout(closeMobileMenu, 150);
        }
      });
      
      // Teclado
      newLink.addEventListener('keydown', (e) => {
        handleKeydown(e, newItem, hasDropdown);
      });
    });
  }

  function setupHamburger() {
    if (!elements.hamburger) return;
    
    elements.hamburger.addEventListener('click', handleHamburgerClick);
    elements.hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMobileMenu();
      }
      if (e.key === 'Escape' && state.isMenuOpen) {
        closeMobileMenu();
      }
    });
  }

  function setupCloseButton() {
    const closeBtn = document.querySelector('.nav__close');
    if (!closeBtn) return;
    
    elements.navClose = closeBtn;
    closeBtn.addEventListener('click', handleCloseClick);
    closeBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        closeMobileMenu();
      }
    });
  }

  function setupGlobalListeners() {
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 200);
    });
  }

  function initializeARIA() {
    // Hamburguer
    if (elements.hamburger) {
      elements.hamburger.setAttribute('aria-label', 'Abrir menu');
      elements.hamburger.setAttribute('aria-expanded', 'false');
      elements.hamburger.setAttribute('aria-controls', 'navList');
    }
    
    // Botão fechar
    const closeBtn = document.querySelector('.nav__close');
    if (closeBtn) {
      closeBtn.setAttribute('aria-label', 'Fechar menu');
    }
    
    // Itens
    elements.navItems.forEach((item, index) => {
      const link = item.querySelector('.nav__link');
      const dropdown = item.querySelector('.dropdown, .mega-menu');
      
      if (!link) return;
      
      if (!link.id) link.id = `nav-link-${index}`;
      
      if (dropdown) {
        link.setAttribute('aria-haspopup', 'true');
        link.setAttribute('aria-expanded', 'false');
        
        if (!dropdown.id) dropdown.id = `dropdown-${index}`;
        
        dropdown.setAttribute('aria-hidden', 'true');
        dropdown.setAttribute('aria-labelledby', link.id);
      }
    });
  }

  // ==================== INICIALIZAÇÃO ====================
  
  function init() {
    console.log('🚀 Inicializando menu premium...');
    
    // Cache elementos
    elements.hamburger = document.getElementById('hamburger');
    elements.navList = document.getElementById('navList');
    elements.navItems = Array.from(document.querySelectorAll('.nav__item'));
    elements.body = document.body;
    
    // Verifica elementos
    if (!elements.hamburger || !elements.navList) {
      console.error('Elementos não encontrados');
      return;
    }
    
    // Estado inicial
    state.isMobile = checkMobileMode();
    
    // Inicializa
    initializeARIA();
    setupHamburger();
    setupCloseButton();
    setupNavigationItems();
    setupGlobalListeners();
    createOverlay();
    
    console.log('✅ Menu premium inicializado');
  }

  // Inicia quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
