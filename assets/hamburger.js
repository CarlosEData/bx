// ============================================
// HAMBURGUER JS - VERSÃO PROFISSIONAL
// Navegação fluida para sites institucionais
// ============================================

(function () {
  'use strict';

  // ==================== CONFIGURAÇÃO ====================
  const CONFIG = {
    breakpoint: 900,
    hoverDelay: 200,
    closeDelay: 300,
    animationDuration: 300,
    enableSmoothAnimations: true
  };

  // ==================== CACHE DE ELEMENTOS ====================
  const elements = {
    hamburger: null,
    navList: null,
    navItems: [],
    body: document.body,
    navOverlay: null
  };

  // ==================== ESTADO GLOBAL ====================
  const state = {
    isMobile: false,
    isMenuOpen: false,
    activeDropdown: null,
    isTransitioning: false,
    resizeTimeout: null,
    hoverTimeouts: new Map()
  };

  // ==================== FUNÇÕES UTILITÁRIAS ====================
  
  /**
   * Debounce para otimizar eventos de resize
   */
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

  /**
   * Verifica se está em modo mobile
   */
  function checkMobileMode() {
    return window.innerWidth <= CONFIG.breakpoint;
  }

  /**
   * Cria overlay para o menu mobile
   */
  function createOverlay() {
    if (elements.navOverlay) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.setAttribute('role', 'presentation');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.display = 'none';
    
    overlay.addEventListener('click', closeMobileMenu);
    document.body.appendChild(overlay);
    elements.navOverlay = overlay;
  }

  /**
   * Gerencia o scroll do body
   */
  function manageBodyScroll(lock) {
    if (lock) {
      const scrollY = window.scrollY;
      elements.body.style.position = 'fixed';
      elements.body.style.top = `-${scrollY}px`;
      elements.body.style.width = '100%';
      elements.body.style.overflow = 'hidden';
      elements.body.setAttribute('data-scroll-position', scrollY);
      elements.body.classList.add('menu-open');
    } else {
      const scrollY = elements.body.getAttribute('data-scroll-position');
      elements.body.style.position = '';
      elements.body.style.top = '';
      elements.body.style.width = '';
      elements.body.style.overflow = '';
      elements.body.classList.remove('menu-open');
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
      }
    }
  }

  // ==================== CONTROLE DE DROPDOWNS ====================
  
  /**
   * Fecha todos os dropdowns
   */
  function closeAllDropdowns() {
    elements.navItems.forEach(item => {
      const link = item.querySelector('.nav__link');
      const dropdown = item.querySelector('.dropdown, .mega-menu');
      
      item.classList.remove('open');
      if (link) link.setAttribute('aria-expanded', 'false');
      if (dropdown) dropdown.setAttribute('aria-hidden', 'true');
    });
    
    state.activeDropdown = null;
    clearAllTimeouts();
  }

  /**
   * Abre um dropdown específico
   */
  function openDropdown(item) {
    if (state.isTransitioning) return;
    
    const link = item.querySelector('.nav__link');
    const dropdown = item.querySelector('.dropdown, .mega-menu');
    
    // No mobile, fecha outros dropdowns antes de abrir
    if (state.isMobile) {
      elements.navItems.forEach(other => {
        if (other !== item && other.classList.contains('open')) {
          const otherLink = other.querySelector('.nav__link');
          const otherDropdown = other.querySelector('.dropdown, .mega-menu');
          other.classList.remove('open');
          if (otherLink) otherLink.setAttribute('aria-expanded', 'false');
          if (otherDropdown) otherDropdown.setAttribute('aria-hidden', 'true');
        }
      });
    }
    
    item.classList.add('open');
    if (link) link.setAttribute('aria-expanded', 'true');
    if (dropdown) dropdown.setAttribute('aria-hidden', 'false');
    
    state.activeDropdown = item;
  }

  /**
   * Fecha um dropdown específico
   */
  function closeDropdown(item) {
    if (state.isTransitioning) return;
    
    const link = item.querySelector('.nav__link');
    const dropdown = item.querySelector('.dropdown, .mega-menu');
    
    item.classList.remove('open');
    if (link) link.setAttribute('aria-expanded', 'false');
    if (dropdown) dropdown.setAttribute('aria-hidden', 'true');
    
    if (state.activeDropdown === item) {
      state.activeDropdown = null;
    }
  }

  /**
   * Alterna dropdown (abre/fecha)
   */
  function toggleDropdown(item) {
    if (item.classList.contains('open')) {
      closeDropdown(item);
    } else {
      openDropdown(item);
    }
  }

  /**
   * Limpa todos os timeouts
   */
  function clearAllTimeouts() {
    state.hoverTimeouts.forEach(timeout => clearTimeout(timeout));
    state.hoverTimeouts.clear();
  }

  // ==================== CONTROLE DO MENU MOBILE ====================
  
  /**
   * Fecha o menu mobile
   */
  function closeMobileMenu() {
    if (!state.isMenuOpen || state.isTransitioning) return;
    
    state.isTransitioning = true;
    
    // Fecha visualmente
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
    
    // Atualiza estado
    setTimeout(() => {
      state.isMenuOpen = false;
      state.isTransitioning = false;
    }, CONFIG.animationDuration);
  }

  /**
   * Abre o menu mobile
   */
  function openMobileMenu() {
    if (state.isMenuOpen || state.isTransitioning) return;
    
    state.isTransitioning = true;
    
    // Cria overlay se necessário
    createOverlay();
    
    // Mostra e anima overlay
    if (elements.navOverlay) {
      elements.navOverlay.style.display = 'block';
      setTimeout(() => {
        elements.navOverlay.classList.add('active');
        elements.navOverlay.setAttribute('aria-hidden', 'false');
      }, 10);
    }
    
    // Abre visualmente
    if (elements.navList) {
      elements.navList.classList.add('nav__list--open');
    }
    
    if (elements.hamburger) {
      elements.hamburger.classList.add('active');
      elements.hamburger.setAttribute('aria-expanded', 'true');
    }
    
    // Bloqueia scroll
    manageBodyScroll(true);
    
    // Atualiza estado
    setTimeout(() => {
      state.isMenuOpen = true;
      state.isTransitioning = false;
      
      // Foco no primeiro link para acessibilidade
      const firstLink = elements.navList.querySelector('.nav__link');
      if (firstLink) firstLink.focus();
    }, CONFIG.animationDuration);
  }

  /**
   * Alterna menu mobile
   */
  function toggleMobileMenu() {
    if (state.isTransitioning) return;
    
    if (state.isMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  // ==================== MANIPULADORES DE EVENTOS ====================
  
  /**
   * Handler para hover no desktop
   */
  function handleDesktopHover(item) {
    if (state.isMobile) return;
    
    clearTimeout(state.hoverTimeouts.get(item));
    
    const timeoutId = setTimeout(() => {
      closeAllDropdowns();
      openDropdown(item);
    }, CONFIG.hoverDelay);
    
    state.hoverTimeouts.set(item, timeoutId);
  }

  /**
   * Handler para mouse leave no desktop
   */
  function handleDesktopLeave(item) {
    if (state.isMobile) return;
    
    clearTimeout(state.hoverTimeouts.get(item));
    
    const timeoutId = setTimeout(() => {
      const dropdown = item.querySelector('.dropdown, .mega-menu');
      const isHoveringItem = item.matches(':hover');
      const isHoveringDropdown = dropdown?.matches(':hover');
      
      if (!isHoveringItem && !isHoveringDropdown) {
        closeDropdown(item);
      }
    }, CONFIG.closeDelay);
    
    state.hoverTimeouts.set(item, timeoutId);
  }

  /**
   * Handler para cliques no mobile
   */
  function handleMobileClick(e, item, hasDropdown) {
    if (!state.isMobile) return;
    
    if (hasDropdown) {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown(item);
    } else {
      // Link normal fecha o menu após um delay
      setTimeout(closeMobileMenu, 150);
    }
  }

  /**
   * Handler para cliques fora do menu
   */
  function handleOutsideClick(e) {
    const clickedInside = e.target.closest('.header__inner') || 
                         e.target.closest('.nav__list');
    const clickedHamburger = e.target.closest('#hamburger');
    
    // Mobile: fecha menu se clicar fora
    if (state.isMobile && state.isMenuOpen && !clickedInside && !clickedHamburger) {
      closeMobileMenu();
      return;
    }
    
    // Desktop: fecha dropdowns se clicar fora
    if (!state.isMobile && !clickedInside) {
      closeAllDropdowns();
    }
  }

  /**
   * Handler para tecla Escape
   */
  function handleEscapeKey(e) {
    if (e.key !== 'Escape') return;
    
    if (state.isMobile && state.isMenuOpen) {
      closeMobileMenu();
      if (elements.hamburger) elements.hamburger.focus();
    } else {
      closeAllDropdowns();
    }
  }

  /**
   * Handler para redimensionamento
   */
  const handleResize = debounce(() => {
    const wasMobile = state.isMobile;
    state.isMobile = checkMobileMode();
    
    if (wasMobile !== state.isMobile) {
      // Modo alterado - reset completo
      closeMobileMenu();
      closeAllDropdowns();
      
      // Reinicializa listeners específicos do modo
      setupNavigationItems();
    }
  }, 150);

  // ==================== CONFIGURAÇÃO ====================
  
  /**
   * Inicializa atributos ARIA
   */
  function initializeARIA() {
    // Hamburger
    if (elements.hamburger) {
      elements.hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
      elements.hamburger.setAttribute('aria-expanded', 'false');
      elements.hamburger.setAttribute('aria-controls', 'navList');
    }
    
    // Itens de navegação
    elements.navItems.forEach((item, index) => {
      const link = item.querySelector('.nav__link');
      const dropdown = item.querySelector('.dropdown, .mega-menu');
      
      if (!link) return;
      
      if (!link.id) {
        link.id = `nav-link-${index}`;
      }
      
      if (dropdown) {
        link.setAttribute('aria-haspopup', 'true');
        link.setAttribute('aria-expanded', 'false');
        
        if (!dropdown.id) {
          dropdown.id = `dropdown-${index}`;
        }
        
        dropdown.setAttribute('aria-hidden', 'true');
        dropdown.setAttribute('aria-labelledby', link.id);
      }
    });
  }

  /**
   * Configura os itens de navegação
   */
  function setupNavigationItems() {
    elements.navItems.forEach((item, index) => {
      const link = item.querySelector('.nav__link');
      const dropdown = item.querySelector('.dropdown, .mega-menu');
      const hasDropdown = !!dropdown;
      
      if (!link) return;
      
      // Remove listeners antigos
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);
      elements.navItems[index] = newItem;
      
      const newLink = newItem.querySelector('.nav__link');
      const newDropdown = newItem.querySelector('.dropdown, .mega-menu');
      
      // Desktop: hover
      if (!state.isMobile && hasDropdown) {
        newItem.addEventListener('mouseenter', () => handleDesktopHover(newItem));
        newItem.addEventListener('mouseleave', () => handleDesktopLeave(newItem));
        
        if (newDropdown) {
          newDropdown.addEventListener('mouseenter', () => {
            clearTimeout(state.hoverTimeouts.get(newItem));
          });
          
          newDropdown.addEventListener('mouseleave', () => {
            handleDesktopLeave(newItem);
          });
        }
      }
      
      // Mobile: clique
      newLink.addEventListener('click', (e) => {
        if (state.isMobile && hasDropdown) {
          e.preventDefault();
          e.stopPropagation();
          toggleDropdown(newItem);
        } else if (state.isMobile) {
          setTimeout(closeMobileMenu, 150);
        }
      });
      
      // Suporte a teclado
      newLink.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && state.isMobile && hasDropdown) {
          e.preventDefault();
          toggleDropdown(newItem);
        }
        
        // Navegação por setas no mobile
        if (state.isMobile && state.isMenuOpen) {
          const items = Array.from(elements.navItems);
          const currentIndex = items.indexOf(newItem);
          
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextItem = items[currentIndex + 1];
            if (nextItem) {
              const nextLink = nextItem.querySelector('.nav__link');
              if (nextLink) nextLink.focus();
            }
          }
          
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevItem = items[currentIndex - 1];
            if (prevItem) {
              const prevLink = prevItem.querySelector('.nav__link');
              if (prevLink) prevLink.focus();
            }
          }
        }
      });
    });
  }

  /**
   * Configura o botão hamburger
   */
  function setupHamburger() {
    if (!elements.hamburger) return;
    
    elements.hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
    
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

  /**
   * Configura listeners globais
   */
  function setupGlobalListeners() {
    // Clique fora
    document.addEventListener('click', handleOutsideClick);
    
    // Teclado
    document.addEventListener('keydown', handleEscapeKey);
    
    // Redimensionamento
    window.addEventListener('resize', handleResize);
    
    // Mudança de orientação
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 200);
    });
  }

  // ==================== INICIALIZAÇÃO ====================
  
  /**
   * Inicializa o sistema completo
   */
  function init() {
    console.log('🚀 Inicializando menu hamburger profissional...');
    
    // Cache de elementos
    elements.hamburger = document.getElementById('hamburger');
    elements.navList = document.getElementById('navList');
    elements.navItems = Array.from(document.querySelectorAll('.nav__item'));
    elements.body = document.body;
    
    // Verifica elementos essenciais
    if (!elements.hamburger || !elements.navList) {
      console.error('❌ Elementos essenciais não encontrados!');
      return;
    }
    
    // Estado inicial
    state.isMobile = checkMobileMode();
    state.isMenuOpen = false;
    
    // Inicialização
    initializeARIA();
    setupHamburger();
    setupNavigationItems();
    setupGlobalListeners();
    
    // Cria overlay (será mostrado quando necessário)
    createOverlay();
    
    console.log('✅ Menu hamburger inicializado com sucesso!');
    console.log(`📱 Modo: ${state.isMobile ? 'Mobile' : 'Desktop'}`);
  }

  // ==================== INICIALIZAÇÃO AUTOMÁTICA ====================
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
