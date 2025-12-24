// ==================== HAMBURGER MENU - VERSÃO FINAL ====================
// Arquivo: hamburger.js

(function () {
  'use strict';

  // ==================== CONFIGURAÇÃO ====================
  const CONFIG = {
    breakpoint: 900,
    hoverDelay: 200,
    closeDelay: 150,
    transitionDuration: 300
  };

  // ==================== SELETORES ====================
  const DOM = {
    hamburger: null,
    navList: null,
    navItems: [],
    body: document.body
  };

  // ==================== ESTADO GLOBAL ====================
  const STATE = {
    isMobile: false,
    isMenuOpen: false,
    isTransitioning: false,
    activeDropdown: null,
    hoverTimeouts: new Map()
  };

  // ==================== FUNÇÕES UTILITÁRIAS ====================

  /**
   * Debounce - limita execução de função
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Limpa todos os timeouts de hover
   */
  function clearAllTimeouts() {
    STATE.hoverTimeouts.forEach(timeout => clearTimeout(timeout));
    STATE.hoverTimeouts.clear();
  }

  /**
   * Bloqueia/desbloqueia scroll do body
   */
  function toggleBodyScroll(lock) {
    if (lock) {
      // Salva posição atual do scroll
      const scrollY = window.scrollY;
      DOM.body.style.position = 'fixed';
      DOM.body.style.top = `-${scrollY}px`;
      DOM.body.style.width = '100%';
      DOM.body.style.overflow = 'hidden';
      DOM.body.setAttribute('data-scroll-position', scrollY);
    } else {
      // Restaura posição do scroll
      const scrollY = DOM.body.getAttribute('data-scroll-position');
      DOM.body.style.position = '';
      DOM.body.style.top = '';
      DOM.body.style.width = '';
      DOM.body.style.overflow = '';
      DOM.body.removeAttribute('data-scroll-position');
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
      }
    }
  }

  /**
   * Verifica se está em modo mobile
   */
  function checkMobileMode() {
    return window.innerWidth <= CONFIG.breakpoint;
  }

  // ==================== FUNÇÕES DE DROPDOWN ====================

  /**
   * Fecha todos os dropdowns
   */
  function closeAllDropdowns() {
    console.log('Fechando todos os dropdowns');
    
    DOM.navItems.forEach(item => {
      const link = item.querySelector('.nav__link');
      const dropdown = item.querySelector('.dropdown, .mega-menu');
      
      item.classList.remove('open');
      if (link) link.setAttribute('aria-expanded', 'false');
      if (dropdown) dropdown.setAttribute('aria-hidden', 'true');
    });
    
    STATE.activeDropdown = null;
    clearAllTimeouts();
  }

  /**
   * Abre um dropdown específico
   */
  function openDropdown(item) {
    console.log('Abrindo dropdown');
    
    const link = item.querySelector('.nav__link');
    const dropdown = item.querySelector('.dropdown, .mega-menu');
    
    // Fecha outros dropdowns no mobile
    if (STATE.isMobile) {
      closeAllDropdowns();
    }
    
    item.classList.add('open');
    if (link) link.setAttribute('aria-expanded', 'true');
    if (dropdown) dropdown.setAttribute('aria-hidden', 'false');
    
    STATE.activeDropdown = item;
  }

  /**
   * Fecha um dropdown específico
   */
  function closeDropdown(item) {
    console.log('Fechando dropdown');
    
    const link = item.querySelector('.nav__link');
    const dropdown = item.querySelector('.dropdown, .mega-menu');
    
    item.classList.remove('open');
    if (link) link.setAttribute('aria-expanded', 'false');
    if (dropdown) dropdown.setAttribute('aria-hidden', 'true');
    
    if (STATE.activeDropdown === item) {
      STATE.activeDropdown = null;
    }
  }

  /**
   * Toggle dropdown (abre se fechado, fecha se aberto)
   */
  function toggleDropdown(item) {
    if (item.classList.contains('open')) {
      closeDropdown(item);
    } else {
      openDropdown(item);
    }
  }

  // ==================== FUNÇÕES DO MENU MOBILE ====================

  /**
   * Fecha o menu mobile
   */
  function closeMobileMenu() {
    if (!STATE.isMenuOpen || STATE.isTransitioning) return;
    
    console.log('Fechando menu mobile');
    STATE.isTransitioning = true;
    
    // Remove classes visuais
    if (DOM.navList) DOM.navList.classList.remove('nav__list--open');
    if (DOM.hamburger) {
      DOM.hamburger.classList.remove('active');
      DOM.hamburger.setAttribute('aria-expanded', 'false');
    }
    
    // Fecha dropdowns e libera scroll
    closeAllDropdowns();
    toggleBodyScroll(false);
    
    // Atualiza estado após transição
    setTimeout(() => {
      STATE.isMenuOpen = false;
      STATE.isTransitioning = false;
    }, CONFIG.transitionDuration);
  }

  /**
   * Abre o menu mobile
   */
  function openMobileMenu() {
    if (STATE.isMenuOpen || STATE.isTransitioning) return;
    
    console.log('Abrindo menu mobile');
    STATE.isTransitioning = true;
    
    // Adiciona classes visuais
    if (DOM.navList) DOM.navList.classList.add('nav__list--open');
    if (DOM.hamburger) {
      DOM.hamburger.classList.add('active');
      DOM.hamburger.setAttribute('aria-expanded', 'true');
    }
    
    // Bloqueia scroll do body
    toggleBodyScroll(true);
    
    // Atualiza estado após transição
    setTimeout(() => {
      STATE.isMenuOpen = true;
      STATE.isTransitioning = false;
    }, CONFIG.transitionDuration);
  }

  /**
   * Toggle menu mobile
   */
  function toggleMobileMenu() {
    if (STATE.isTransitioning) return;
    
    console.log('Toggle menu mobile, estado atual:', STATE.isMenuOpen);
    
    if (STATE.isMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  // ==================== EVENT HANDLERS ====================

  /**
   * Handler para clique no hamburger
   */
  function handleHamburgerClick(e) {
    e.stopPropagation();
    e.preventDefault();
    toggleMobileMenu();
  }

  /**
   * Handler para teclado no hamburger
   */
  function handleHamburgerKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMobileMenu();
    }
    if (e.key === 'Escape' && STATE.isMenuOpen) {
      closeMobileMenu();
      DOM.hamburger?.focus();
    }
  }

  /**
   * Handler para hover desktop (mouse enter)
   */
  function handleDesktopMouseEnter(item) {
    if (STATE.isMobile) return;
    
    clearAllTimeouts();
    
    const timeoutId = setTimeout(() => {
      closeAllDropdowns();
      openDropdown(item);
    }, CONFIG.hoverDelay);
    
    STATE.hoverTimeouts.set(item, timeoutId);
  }

  /**
   * Handler para hover desktop (mouse leave)
   */
  function handleDesktopMouseLeave(item) {
    if (STATE.isMobile) return;
    
    clearAllTimeouts();
    
    const timeoutId = setTimeout(() => {
      const dropdown = item.querySelector('.dropdown, .mega-menu');
      const isOverItem = item.matches(':hover');
      const isOverDropdown = dropdown?.matches(':hover');
      
      if (!isOverItem && !isOverDropdown) {
        closeDropdown(item);
      }
    }, CONFIG.closeDelay);
    
    STATE.hoverTimeouts.set(item, timeoutId);
  }

  /**
   * Handler para focus desktop
   */
  function handleDesktopFocus(item) {
    if (STATE.isMobile) return;
    
    clearAllTimeouts();
    closeAllDropdowns();
    openDropdown(item);
  }

  /**
   * Handler para blur desktop
   */
  function handleDesktopBlur(item) {
    if (STATE.isMobile) return;
    
    setTimeout(() => {
      if (!item.contains(document.activeElement)) {
        closeDropdown(item);
      }
    }, 100);
  }

  /**
   * Handler para clique mobile nos links
   */
  function handleMobileClick(e, item, hasDropdown) {
    if (!STATE.isMobile) return;
    
    console.log('Clique mobile no item');
    
    if (hasDropdown) {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown(item);
    } else {
      // Link regular - fecha o menu
      setTimeout(() => closeMobileMenu(), 100);
    }
  }

  /**
   * Handler para cliques fora do menu
   */
  function handleOutsideClick(e) {
    const clickedInside = e.target.closest('.header__inner');
    const clickedOnNav = e.target.closest('.nav__item');
    const clickedOnDropdown = e.target.closest('.mega-menu, .dropdown');
    
    // Mobile: fecha menu se clicar fora
    if (STATE.isMobile && STATE.isMenuOpen && !clickedInside) {
      closeMobileMenu();
      return;
    }
    
    // Desktop: fecha dropdowns se clicar fora
    if (!STATE.isMobile && !clickedOnNav && !clickedOnDropdown) {
      closeAllDropdowns();
    }
  }

  /**
   * Handler para tecla Escape
   */
  function handleEscapeKey(e) {
    if (e.key !== 'Escape') return;
    
    if (STATE.isMobile && STATE.isMenuOpen) {
      closeMobileMenu();
      DOM.hamburger?.focus();
    } else {
      closeAllDropdowns();
    }
  }

  /**
   * Handler para resize da janela
   */
  const handleResize = debounce(() => {
    const wasMobile = STATE.isMobile;
    STATE.isMobile = checkMobileMode();
    
    console.log(`Resize: era mobile=${wasMobile}, agora mobile=${STATE.isMobile}, largura=${window.innerWidth}`);
    
    if (wasMobile !== STATE.isMobile) {
      // Mudou de modo - reseta tudo
      console.log(`Mudou para modo ${STATE.isMobile ? 'mobile' : 'desktop'}`);
      closeMobileMenu();
      closeAllDropdowns();
      
      // Re-inicializa event listeners
      setupNavigationItems();
    }
  }, CONFIG.transitionDuration);

  // ==================== SETUP FUNCTIONS ====================

  /**
   * Inicializa atributos ARIA
   */
  function initializeARIA() {
    console.log('Inicializando ARIA');
    
    // Setup hamburger
    if (DOM.hamburger) {
      DOM.hamburger.setAttribute('aria-label', 'Menu de navegação');
      DOM.hamburger.setAttribute('aria-expanded', 'false');
      DOM.hamburger.setAttribute('aria-controls', 'navList');
    }
    
    // Setup items de navegação
    DOM.navItems.forEach((item, index) => {
      const link = item.querySelector('.nav__link');
      const dropdown = item.querySelector('.dropdown, .mega-menu');
      
      if (!link) return;
      
      if (!link.id) link.id = `nav-link-${index}`;
      
      if (dropdown) {
        link.setAttribute('aria-haspopup', 'true');
        link.setAttribute('aria-expanded', 'false');
        dropdown.setAttribute('id', `dropdown-${index}`);
        dropdown.setAttribute('aria-hidden', 'true');
        dropdown.setAttribute('aria-labelledby', link.id);
        link.setAttribute('aria-controls', `dropdown-${index}`);
      }
    });
  }

  /**
   * Remove todos os event listeners de um item
   */
  function removeItemListeners(item) {
    const newItem = item.cloneNode(true);
    item.parentNode.replaceChild(newItem, item);
    return newItem;
  }

  /**
   * Setup dos items de navegação
   */
  function setupNavigationItems() {
    console.log('Configurando items de navegação, modo:', STATE.isMobile ? 'mobile' : 'desktop');
    
    DOM.navItems.forEach((item, index) => {
      const link = item.querySelector('.nav__link');
      const dropdown = item.querySelector('.dropdown, .mega-menu');
      const hasDropdown = !!dropdown;
      
      if (!link) return;
      
      // DESKTOP: Eventos de hover e focus
      if (!STATE.isMobile && hasDropdown) {
        item.addEventListener('mouseenter', () => handleDesktopMouseEnter(item));
        item.addEventListener('mouseleave', () => handleDesktopMouseLeave(item));
        item.addEventListener('focusin', () => handleDesktopFocus(item));
        item.addEventListener('focusout', () => handleDesktopBlur(item));
        
        // Dropdown também precisa de eventos
        if (dropdown) {
          dropdown.addEventListener('mouseenter', () => clearAllTimeouts());
          dropdown.addEventListener('mouseleave', () => handleDesktopMouseLeave(item));
        }
      }
      
      // MOBILE: Evento de clique
      link.addEventListener('click', (e) => handleMobileClick(e, item, hasDropdown));
      
      // Keyboard support
      link.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && STATE.isMobile && hasDropdown) {
          e.preventDefault();
          handleMobileClick(e, item, hasDropdown);
        }
      });
    });
  }

  /**
   * Setup do botão hamburger
   */
  function setupHamburger() {
    if (!DOM.hamburger || !DOM.navList) {
      console.error('Hamburger ou navList não encontrado!');
      return;
    }
    
    console.log('Configurando hamburger');
    
    DOM.hamburger.addEventListener('click', handleHamburgerClick);
    DOM.hamburger.addEventListener('keydown', handleHamburgerKeydown);
  }

  /**
   * Setup de event listeners globais
   */
  function setupGlobalListeners() {
    console.log('Configurando listeners globais');
    
    // Clique fora
    document.addEventListener('click', handleOutsideClick);
    
    // Tecla Escape
    document.addEventListener('keydown', handleEscapeKey);
    
    // Resize e orientação
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 200);
    });
  }

  /**
   * Previne scroll em touch no iOS
   */
  function setupTouchScrollPrevention() {
    if (!DOM.navList) return;
    
    let startY = 0;
    
    DOM.navList.addEventListener('touchstart', (e) => {
      startY = e.touches[0].pageY;
    }, { passive: true });
    
    DOM.navList.addEventListener('touchmove', (e) => {
      const currentY = e.touches[0].pageY;
      const scrollTop = DOM.navList.scrollTop;
      const scrollHeight = DOM.navList.scrollHeight;
      const clientHeight = DOM.navList.clientHeight;
      
      // Prevenir overscroll
      if ((scrollTop <= 0 && currentY > startY) || 
          (scrollTop + clientHeight >= scrollHeight && currentY < startY)) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  // ==================== INICIALIZAÇÃO ====================

  /**
   * Inicializa todo o sistema de navegação
   */
  function init() {
    console.log('=== INICIANDO MENU HAMBURGER ===');
    
    // 1. Cachear elementos DOM
    DOM.hamburger = document.getElementById('hamburger');
    DOM.navList = document.getElementById('navList');
    DOM.navItems = Array.from(document.querySelectorAll('.nav__item'));
    
    if (!DOM.hamburger || !DOM.navList) {
      console.error('Elementos essenciais não encontrados!');
      return;
    }
    
    // 2. Definir estado inicial
    STATE.isMobile = checkMobileMode();
    STATE.isMenuOpen = false;
    
    console.log('Estado inicial - Mobile:', STATE.isMobile, 'Largura:', window.innerWidth);
    
    // 3. Inicializar ARIA
    initializeARIA();
    
    // 4. Setup hamburger
    setupHamburger();
    
    // 5. Setup items de navegação
    setupNavigationItems();
    
    // 6. Setup listeners globais
    setupGlobalListeners();
    
    // 7. Setup touch scroll prevention
    setupTouchScrollPrevention();
    
    console.log('=== MENU HAMBURGER INICIALIZADO COM SUCESSO ===');
  }

  // ==================== AUTO-INIT ====================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
