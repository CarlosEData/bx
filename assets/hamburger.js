// ============================================
// HAMBURGUER JS - VERSÃO FINAL REVISADA
// Controle preciso de hierarquia e sobreposição
// ============================================

(function () {
  'use strict';

  // ==================== CONFIGURAÇÃO PRECISA ====================
  const CONFIG = {
    breakpoint: 900,
    hoverDelay: 200,
    closeDelay: 300,
    animationDuration: 300,
    enableAnimations: true,
    accordionBehavior: true,
    touchDelay: 50 // Delay para evitar toques acidentais
  };

  // ==================== SISTEMA DE CACHE ORGANIZADO ====================
  const elements = {
    // Elementos principais
    hamburger: null,
    navList: null,
    navItems: [],
    
    // Containers hierárquicos
    navItemsContainer: null,
    
    // Elementos de overlay
    navOverlay: null,
    
    // Elementos de estado
    body: document.body,
    html: document.documentElement,
    
    // Cache de dimensões para evitar reflows
    dimensions: {
      headerHeight: 0,
      viewportHeight: 0,
      viewportWidth: 0
    }
  };

  // ==================== ESTADO GLOBAL CONTROLADO ====================
  const state = {
    // Estado de navegação
    isMobile: false,
    isMenuOpen: false,
    activeDropdown: null,
    
    // Estado de transição
    isTransitioning: false,
    isAnimating: false,
    
    // Estado de interação
    lastInteraction: 0,
    pendingInteraction: false,
    
    // Cache de timeouts
    resizeTimeout: null,
    hoverTimeouts: new Map(),
    interactionTimeouts: new Map(),
    
    // Posição de scroll
    scrollPosition: 0,
    
    // Registro de eventos para cleanup
    eventListeners: new Map()
  };

  // ==================== SISTEMA DE UTILITÁRIOS ====================
  
  /**
   * Debounce otimizado para performance
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
   * Throttle para eventos de scroll/resize
   */
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Verifica modo mobile com margem de segurança
   */
  function checkMobileMode() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Atualiza cache de dimensões
    elements.dimensions.viewportWidth = width;
    elements.dimensions.viewportHeight = height;
    
    // Modo mobile com breakpoint
    return width <= CONFIG.breakpoint;
  }

  /**
   * Atualiza dimensões do header
   */
  function updateHeaderDimensions() {
    const header = document.querySelector('.header');
    if (header) {
      elements.dimensions.headerHeight = header.offsetHeight;
    }
  }

  // ==================== SISTEMA DE OVERLAY ====================
  
  /**
   * Cria overlay com gestão de z-index
   */
  function createOverlay() {
    if (elements.navOverlay) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.setAttribute('role', 'presentation');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 399;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      backdrop-filter: blur(4px);
    `;
    
    // Adiciona eventos com namespace para fácil remoção
    addEventListener(overlay, 'click', 'overlay-click', closeMobileMenu);
    addEventListener(overlay, 'touchstart', 'overlay-touch', closeMobileMenu);
    
    document.body.appendChild(overlay);
    elements.navOverlay = overlay;
  }

  // ==================== GESTÃO DE SCROLL ====================
  
  /**
   * Gerencia scroll do body de forma não-bloqueante
   */
  function manageBodyScroll(lock) {
    if (lock) {
      // Salva posição atual
      state.scrollPosition = window.scrollY;
      
      // Aplica bloqueio
      requestAnimationFrame(() => {
        elements.body.style.position = 'fixed';
        elements.body.style.top = `-${state.scrollPosition}px`;
        elements.body.style.width = '100%';
        elements.body.style.overflow = 'hidden';
        elements.body.classList.add('menu-open');
        
        // Salva para restauração
        elements.body.dataset.scrollPosition = state.scrollPosition;
      });
    } else {
      // Remove bloqueio
      requestAnimationFrame(() => {
        elements.body.style.position = '';
        elements.body.style.top = '';
        elements.body.style.width = '';
        elements.body.style.overflow = '';
        elements.body.classList.remove('menu-open');
        
        // Restaura posição
        const savedPosition = elements.body.dataset.scrollPosition;
        if (savedPosition) {
          window.scrollTo(0, parseInt(savedPosition));
          delete elements.body.dataset.scrollPosition;
        }
      });
    }
  }

  // ==================== SISTEMA DE ACORDEÃO HIERÁRQUICO ====================
  
  /**
   * Fecha todos os dropdowns com animação controlada
   */
  function closeAllDropdowns() {
    if (state.isAnimating) return;
    
    state.isAnimating = true;
    
    elements.navItems.forEach((item, index) => {
      if (item.classList.contains('open')) {
        // Animação de fechamento com delay progressivo
        setTimeout(() => {
          const link = item.querySelector('.nav__link');
          const dropdown = item.querySelector('.dropdown, .mega-menu');
          
          item.classList.remove('open');
          if (link) link.setAttribute('aria-expanded', 'false');
          if (dropdown) dropdown.setAttribute('aria-hidden', 'true');
        }, index * 20); // Delay escalonado
      }
    });
    
    state.activeDropdown = null;
    clearAllTimeouts();
    
    // Reset estado de animação
    setTimeout(() => {
      state.isAnimating = false;
    }, CONFIG.animationDuration);
  }

  /**
   * Abre dropdown específico com gestão hierárquica
   */
  function openDropdown(item) {
    if (state.isTransitioning || state.isAnimating) return;
    
    const link = item.querySelector('.nav__link');
    const dropdown = item.querySelector('.dropdown, .mega-menu');
    
    if (!link || !dropdown) return;
    
    state.isAnimating = true;
    
    // COMPORTAMENTO DE ACORDEÃO NO MOBILE
    if (state.isMobile && CONFIG.accordionBehavior) {
      // Fecha outros dropdowns primeiro
      elements.navItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          const otherLink = otherItem.querySelector('.nav__link');
          const otherDropdown = otherItem.querySelector('.dropdown, .mega-menu');
          
          otherItem.classList.remove('open');
          if (otherLink) otherLink.setAttribute('aria-expanded', 'false');
          if (otherDropdown) otherDropdown.setAttribute('aria-hidden', 'true');
        }
      });
      
      // Pequeno delay para animação de fechamento
      setTimeout(() => {
        item.classList.add('open');
        link.setAttribute('aria-expanded', 'true');
        dropdown.setAttribute('aria-hidden', 'false');
        state.activeDropdown = item;
        
        // Scroll suave para o item aberto
        if (state.isMobile && elements.navList) {
          const itemTop = item.offsetTop;
          const containerHeight = elements.navList.clientHeight;
          const itemHeight = item.offsetHeight;
          
          if (itemTop > containerHeight / 2) {
            elements.navList.scrollTo({
              top: itemTop - (containerHeight / 2) + (itemHeight / 2),
              behavior: 'smooth'
            });
          }
        }
        
        // Foco no primeiro link para acessibilidade
        setTimeout(() => {
          const firstLink = dropdown.querySelector('a');
          if (firstLink && state.isMobile) {
            firstLink.focus();
          }
          state.isAnimating = false;
        }, 100);
      }, 100);
    } else {
      // Comportamento padrão (desktop)
      item.classList.add('open');
      link.setAttribute('aria-expanded', 'true');
      dropdown.setAttribute('aria-hidden', 'false');
      state.activeDropdown = item;
      state.isAnimating = false;
    }
  }

  /**
   * Fecha dropdown específico
   */
  function closeDropdown(item) {
    if (state.isTransitioning || state.isAnimating) return;
    
    state.isAnimating = true;
    
    const link = item.querySelector('.nav__link');
    const dropdown = item.querySelector('.dropdown, .mega-menu');
    
    item.classList.remove('open');
    if (link) link.setAttribute('aria-expanded', 'false');
    if (dropdown) dropdown.setAttribute('aria-hidden', 'true');
    
    if (state.activeDropdown === item) {
      state.activeDropdown = null;
    }
    
    setTimeout(() => {
      state.isAnimating = false;
    }, CONFIG.animationDuration);
  }

  /**
   * Alterna dropdown com controle de interação
   */
  function toggleDropdown(item) {
    // Previne interações muito rápidas
    const now = Date.now();
    if (now - state.lastInteraction < CONFIG.touchDelay) return;
    state.lastInteraction = now;
    
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
    
    state.interactionTimeouts.forEach(timeout => clearTimeout(timeout));
    state.interactionTimeouts.clear();
  }

  // ==================== CONTROLE DO MENU MOBILE ====================
  
  /**
   * Fecha menu mobile com animação completa
   */
  function closeMobileMenu() {
    if (!state.isMenuOpen || state.isTransitioning) return;
    
    console.log('[Menu] Fechando menu mobile');
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
      }, 300);
    }
    
    // Libera scroll
    manageBodyScroll(false);
    
    // Fecha todos os dropdowns
    closeAllDropdowns();
    
    // Retorna foco para hamburguer
    setTimeout(() => {
      if (elements.hamburger) {
        elements.hamburger.focus();
      }
      state.isMenuOpen = false;
      state.isTransitioning = false;
      console.log('[Menu] Menu mobile fechado');
    }, CONFIG.animationDuration);
  }

  /**
   * Abre menu mobile com inicialização completa
   */
  function openMobileMenu() {
    if (state.isMenuOpen || state.isTransitioning) return;
    
    console.log('[Menu] Abrindo menu mobile');
    state.isTransitioning = true;
    
    // Cria overlay se necessário
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
    
    // Atualiza estado
    setTimeout(() => {
      state.isMenuOpen = true;
      state.isTransitioning = false;
      
      // Foco no primeiro item
      const firstLink = elements.navList?.querySelector('.nav__link');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 50);
      }
      console.log('[Menu] Menu mobile aberto');
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

  // ==================== SISTEMA DE EVENTOS ====================
  
  /**
   * Adiciona event listener com namespace
   */
  function addEventListener(element, event, namespace, handler) {
    const namespacedHandler = (e) => {
      handler(e);
    };
    
    element.addEventListener(event, namespacedHandler);
    
    // Armazena para remoção posterior
    if (!state.eventListeners.has(element)) {
      state.eventListeners.set(element, []);
    }
    state.eventListeners.get(element).push({ event, handler: namespacedHandler, namespace });
  }

  /**
   * Remove event listeners por namespace
   */
  function removeEventListeners(element, namespace) {
    if (!state.eventListeners.has(element)) return;
    
    const listeners = state.eventListeners.get(element);
    const remaining = [];
    
    listeners.forEach(listener => {
      if (listener.namespace === namespace) {
        element.removeEventListener(listener.event, listener.handler);
      } else {
        remaining.push(listener);
      }
    });
    
    if (remaining.length > 0) {
      state.eventListeners.set(element, remaining);
    } else {
      state.eventListeners.delete(element);
    }
  }

  /**
   * Handler para hover desktop
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
   * Handler para mouse leave desktop
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
   * Handler para clique mobile
   */
  function handleMobileClick(e, item, hasDropdown) {
    if (!state.isMobile) return;
    
    if (hasDropdown) {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown(item);
    } else {
      // Link normal - fecha menu
      setTimeout(closeMobileMenu, 150);
    }
  }

  /**
   * Handler para clique fora
   */
  function handleOutsideClick(e) {
    const clickedInside = e.target.closest('.header__inner') || 
                         e.target.closest('.nav__list');
    const clickedHamburger = e.target.closest('#hamburger');
    
    if (state.isMobile && state.isMenuOpen && !clickedInside && !clickedHamburger) {
      closeMobileMenu();
      return;
    }
    
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
   * Handler para setas do teclado
   */
  function handleArrowKeys(e, item) {
    if (!state.isMobile || !state.isMenuOpen) return;
    
    const items = Array.from(elements.navItems);
    const currentIndex = items.indexOf(item);
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextItem = items[currentIndex + 1];
        if (nextItem) {
          const nextLink = nextItem.querySelector('.nav__link');
          if (nextLink) nextLink.focus();
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        const prevItem = items[currentIndex - 1];
        if (prevItem) {
          const prevLink = prevItem.querySelector('.nav__link');
          if (prevLink) prevLink.focus();
        }
        break;
        
      case 'ArrowRight':
        if (item.classList.contains('open')) {
          e.preventDefault();
          const dropdown = item.querySelector('.dropdown, .mega-menu');
          if (dropdown) {
            const firstSubLink = dropdown.querySelector('a');
            if (firstSubLink) firstSubLink.focus();
          }
        }
        break;
        
      case 'ArrowLeft':
        e.preventDefault();
        if (item.classList.contains('open')) {
          closeDropdown(item);
        } else {
          const parentItem = item.closest('.nav__item');
          if (parentItem) {
            const parentLink = parentItem.querySelector('.nav__link');
            if (parentLink) parentLink.focus();
          }
        }
        break;
    }
  }

  /**
   * Handler para resize otimizado
   */
  const handleResize = debounce(() => {
    const wasMobile = state.isMobile;
    state.isMobile = checkMobileMode();
    
    if (wasMobile !== state.isMobile) {
      console.log(`[Menu] Modo alterado: ${wasMobile ? 'Mobile' : 'Desktop'} → ${state.isMobile ? 'Mobile' : 'Desktop'}`);
      
      closeMobileMenu();
      closeAllDropdowns();
      setupNavigationItems();
      updateHeaderDimensions();
    }
  }, 150);

  // ==================== INICIALIZAÇÃO SISTEMÁTICA ====================
  
  /**
   * Inicializa ARIA com verificação completa
   */
  function initializeARIA() {
    console.log('[Menu] Inicializando ARIA...');
    
    // Hamburguer
    if (elements.hamburger) {
      elements.hamburger.setAttribute('aria-label', 'Menu de navegação');
      elements.hamburger.setAttribute('aria-expanded', 'false');
      elements.hamburger.setAttribute('aria-controls', 'navList');
    }
    
    // Itens de navegação
    elements.navItems.forEach((item, index) => {
      const link = item.querySelector('.nav__link');
      const dropdown = item.querySelector('.dropdown, .mega-menu');
      
      if (!link) {
        console.warn(`[Menu] Item ${index} sem link .nav__link`);
        return;
      }
      
      // IDs únicos
      if (!link.id) link.id = `nav-link-${index}`;
      
      // Atributos ARIA para dropdowns
      if (dropdown) {
        link.setAttribute('aria-haspopup', 'true');
        link.setAttribute('aria-expanded', 'false');
        
        if (!dropdown.id) dropdown.id = `dropdown-${index}`;
        
        dropdown.setAttribute('aria-hidden', 'true');
        dropdown.setAttribute('aria-labelledby', link.id);
        link.setAttribute('aria-controls', dropdown.id);
        
        // Verifica hierarquia interna
        const subLinks = dropdown.querySelectorAll('a');
        subLinks.forEach((subLink, subIndex) => {
          if (!subLink.id) subLink.id = `${dropdown.id}-item-${subIndex}`;
        });
      }
    });
    
    console.log('[Menu] ARIA inicializado com sucesso');
  }

  /**
   * Configura itens de navegação com gestão hierárquica
   */
  function setupNavigationItems() {
    console.log('[Menu] Configurando itens no modo:', state.isMobile ? 'MOBILE' : 'DESKTOP');
    
    // Remove listeners antigos
    elements.navItems.forEach(item => {
      removeEventListeners(item, 'navigation');
    });
    
    // Configura novos listeners
    elements.navItems.forEach((item, index) => {
      const link = item.querySelector('.nav__link');
      const dropdown = item.querySelector('.dropdown, .mega-menu');
      const hasDropdown = !!dropdown;
      
      if (!link) {
        console.warn(`[Menu] Ignorando item ${index}: sem link .nav__link`);
        return;
      }
      
      // ===== DESKTOP =====
      if (!state.isMobile && hasDropdown) {
        addEventListener(item, 'mouseenter', 'navigation', () => handleDesktopHover(item));
        addEventListener(item, 'mouseleave', 'navigation', () => handleDesktopLeave(item));
        
        if (dropdown) {
          addEventListener(dropdown, 'mouseenter', 'navigation', () => {
            clearTimeout(state.hoverTimeouts.get(item));
          });
          addEventListener(dropdown, 'mouseleave', 'navigation', () => {
            handleDesktopLeave(item);
          });
        }
      }
      
      // ===== MOBILE =====
      // Clique principal
      addEventListener(link, 'click', 'navigation', (e) => {
        handleMobileClick(e, item, hasDropdown);
      });
      
      // Teclado
      addEventListener(link, 'keydown', 'navigation', (e) => {
        // Enter/Espaço para dropdowns
        if ((e.key === 'Enter' || e.key === ' ') && state.isMobile && hasDropdown) {
          e.preventDefault();
          toggleDropdown(item);
        }
        
        // Navegação por setas
        handleArrowKeys(e, item);
        
        // Escape
        if (e.key === 'Escape') {
          if (item.classList.contains('open')) {
            e.preventDefault();
            closeDropdown(item);
            link.focus();
          }
        }
      });
      
      // ===== SUBMENUS =====
      if (hasDropdown) {
        const subLinks = dropdown.querySelectorAll('a');
        subLinks.forEach(subLink => {
          addEventListener(subLink, 'keydown', 'navigation', (e) => {
            if (e.key === 'Escape' && state.isMobile) {
              e.preventDefault();
              closeDropdown(item);
              link.focus();
            }
          });
        });
      }
    });
  }

  /**
   * Configura hamburguer com prevenção de duplo clique
   */
  function setupHamburger() {
    if (!elements.hamburger) {
      console.error('[Menu] ERRO: #hamburger não encontrado');
      return;
    }
    
    // Remove listeners antigos
    removeEventListeners(elements.hamburger, 'hamburger');
    
    // Adiciona novos listeners
    addEventListener(elements.hamburger, 'click', 'hamburger', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
    
    addEventListener(elements.hamburger, 'keydown', 'hamburger', (e) => {
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
    addEventListener(document, 'click', 'global', handleOutsideClick);
    
    // Teclado
    addEventListener(document, 'keydown', 'global', handleEscapeKey);
    
    // Resize
    addEventListener(window, 'resize', 'global', handleResize);
    
    // Orientation change
    addEventListener(window, 'orientationchange', 'global', () => {
      setTimeout(handleResize, 200);
    });
    
    // Previne scroll no iOS
    if (elements.navList) {
      let startY = 0;
      
      addEventListener(elements.navList, 'touchstart', 'global', (e) => {
        startY = e.touches[0].clientY;
      }, { passive: true });
      
      addEventListener(elements.navList, 'touchmove', 'global', (e) => {
        const currentY = e.touches[0].clientY;
        const scrollTop = elements.navList.scrollTop;
        const scrollHeight = elements.navList.scrollHeight;
        const clientHeight = elements.navList.clientHeight;
        
        if ((scrollTop <= 0 && currentY > startY) || 
            (scrollTop + clientHeight >= scrollHeight && currentY < startY)) {
          e.preventDefault();
        }
      }, { passive: false });
    }
  }

  /**
   * Inicialização completa do sistema
   */
  function init() {
    console.log('🔧 [Menu] Iniciando sistema de navegação...');
    
    // 1. Cache de elementos
    elements.hamburger = document.getElementById('hamburger');
    elements.navList = document.getElementById('navList');
    elements.navItems = Array.from(document.querySelectorAll('.nav__item'));
    elements.navItemsContainer = document.querySelector('.nav__items-container');
    elements.body = document.body;
    elements.html = document.documentElement;
    
    // 2. Verificação rigorosa
    if (!elements.hamburger) {
      console.error('❌ [Menu] Elemento #hamburger não encontrado');
      return;
    }
    
    if (!elements.navList) {
      console.error('❌ [Menu] Elemento #navList não encontrado');
      return;
    }
    
    if (elements.navItems.length === 0) {
      console.warn('⚠️ [Menu] Nenhum item .nav__item encontrado');
    }
    
    // 3. Estado inicial
    state.isMobile = checkMobileMode();
    state.isMenuOpen = false;
    state.isTransitioning = false;
    
    // 4. Dimensões
    updateHeaderDimensions();
    
    // 5. Inicialização sequencial
    initializeARIA();
    setupHamburger();
    setupNavigationItems();
    setupGlobalListeners();
    
    // 6. Cria overlay
    createOverlay();
    
    console.log('✅ [Menu] Sistema inicializado com sucesso');
    console.log(`   Modo: ${state.isMobile ? 'Mobile' : 'Desktop'}`);
    console.log(`   Itens: ${elements.navItems.length}`);
    console.log(`   Dimensões: ${elements.dimensions.viewportWidth}x${elements.dimensions.viewportHeight}`);
  }

  // ==================== INICIALIZAÇÃO CONTROLADA ====================
  
  // Aguarda DOM pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Pequeno delay para garantir que todos os elementos estejam renderizados
    setTimeout(init, 50);
  }
  
  // API pública para controle externo
  window.MobileMenu = {
    open: openMobileMenu,
    close: closeMobileMenu,
    toggle: toggleMobileMenu,
    closeAllDropdowns: closeAllDropdowns,
    isOpen: () => state.isMenuOpen,
    isMobile: () => state.isMobile,
    refresh: () => {
      setupNavigationItems();
      updateHeaderDimensions();
    }
  };
})();
