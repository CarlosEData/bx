// ============================================
// HAMBURGUER JS - CORREÇÃO DE SOBREPOSIÇÃO
// Garante que menu não bloqueie conteúdo quando fechado
// ============================================

(function () {
  'use strict';

  const CONFIG = {
    breakpoint: 900,
    animationDuration: 400
  };

  const elements = {
    hamburger: null,
    navList: null,
    navItems: [],
    navOverlay: null,
    navClose: null,
    body: document.body,
    header: document.querySelector('.header'), // Adiciona referência ao header
    mainContent: document.querySelector('.main-content, .hero, section:first-of-type') // Conteúdo principal
  };

  const state = {
    isMobile: false,
    isMenuOpen: false,
    isTransitioning: false,
    scrollPosition: 0
  };

  // ==================== FUNÇÕES CRÍTICAS PARA O PROBLEMA ====================
  
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
      background: rgba(0, 0, 0, 0.7);
      z-index: 998;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      pointer-events: none;
    `;
    
    overlay.addEventListener('click', closeMobileMenu);
    document.body.appendChild(overlay);
    elements.navOverlay = overlay;
  }

  function manageBodyScroll(lock) {
    if (lock) {
      // Salva posição do scroll
      state.scrollPosition = window.scrollY;
      
      // Aplica bloqueio com requestAnimationFrame para performance
      requestAnimationFrame(() => {
        elements.body.style.position = 'fixed';
        elements.body.style.top = `-${state.scrollPosition}px`;
        elements.body.style.width = '100%';
        elements.body.style.overflow = 'hidden';
        elements.body.classList.add('menu-open');
        elements.body.dataset.scrollPosition = state.scrollPosition;
        
        // Desativa interação com conteúdo principal
        if (elements.mainContent) {
          elements.mainContent.style.pointerEvents = 'none';
          elements.mainContent.style.userSelect = 'none';
        }
        
        // Header fica atrás
        if (elements.header) {
          elements.header.style.zIndex = '1';
        }
      });
    } else {
      // Remove bloqueio
      requestAnimationFrame(() => {
        elements.body.style.position = '';
        elements.body.style.top = '';
        elements.body.style.width = '';
        elements.body.style.overflow = '';
        elements.body.classList.remove('menu-open');
        
        // Reativa interação com conteúdo principal
        if (elements.mainContent) {
          elements.mainContent.style.pointerEvents = '';
          elements.mainContent.style.userSelect = '';
        }
        
        // Restaura z-index do header
        if (elements.header) {
          elements.header.style.zIndex = '';
        }
        
        // Restaura posição do scroll
        const savedPosition = elements.body.dataset.scrollPosition;
        if (savedPosition) {
          window.scrollTo(0, parseInt(savedPosition));
        }
        delete elements.body.dataset.scrollPosition;
      });
    }
  }

  // ==================== CONTROLE DO MENU ====================
  
  function closeMobileMenu() {
    if (!state.isMenuOpen || state.isTransitioning) return;
    
    console.log('[Menu] Fechando menu (sobreposição corrigida)');
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
        elements.navOverlay.style.pointerEvents = 'none';
      }, 300);
    }
    
    // Libera scroll e interação
    manageBodyScroll(false);
    
    // Foca no hamburguer para acessibilidade
    setTimeout(() => {
      if (elements.hamburger) {
        elements.hamburger.focus();
      }
      state.isMenuOpen = false;
      state.isTransitioning = false;
      console.log('[Menu] Menu fechado - conteúdo agora clicável');
    }, CONFIG.animationDuration);
  }

  function openMobileMenu() {
    if (state.isMenuOpen || state.isTransitioning) return;
    
    console.log('[Menu] Abrindo menu (corrigindo sobreposição)');
    state.isTransitioning = true;
    
    // Cria overlay se necessário
    createOverlay();
    
    // Mostra overlay
    if (elements.navOverlay) {
      elements.navOverlay.style.display = 'block';
      elements.navOverlay.setAttribute('aria-hidden', 'false');
      elements.navOverlay.style.pointerEvents = 'auto';
      
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
    
    // Bloqueia scroll e interação com conteúdo
    manageBodyScroll(true);
    
    // Foca no botão fechar
    setTimeout(() => {
      state.isMenuOpen = true;
      state.isTransitioning = false;
      
      if (elements.navClose) {
        elements.navClose.focus();
      }
      console.log('[Menu] Menu aberto - overlay bloqueando conteúdo de fundo');
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
  
  function handleOutsideClick(e) {
    const clickedInsideMenu = e.target.closest('.nav__list') || 
                             e.target.closest('.nav__mobile-header');
    const clickedHamburger = e.target.closest('#hamburger');
    const clickedCloseButton = e.target.closest('.nav__close');
    
    // Se clicou no overlay ou fora do menu quando aberto, fecha
    if (state.isMobile && state.isMenuOpen && !clickedInsideMenu && !clickedHamburger && !clickedCloseButton) {
      // Verifica se foi clique no overlay
      if (e.target === elements.navOverlay || e.target.classList.contains('nav-overlay')) {
        closeMobileMenu();
      }
    }
  }

  function handleEscapeKey(e) {
    if (e.key !== 'Escape') return;
    
    if (state.isMobile && state.isMenuOpen) {
      closeMobileMenu();
      if (elements.hamburger) elements.hamburger.focus();
    }
  }

  // ==================== SETUP ====================
  
  function setupHamburger() {
    if (!elements.hamburger) {
      console.error('[Menu] ERRO: Botão hamburger não encontrado (#hamburger)');
      return;
    }
    
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

  function setupCloseButton() {
    const closeBtn = document.querySelector('.nav__close');
    if (!closeBtn) {
      console.warn('[Menu] Botão fechar (.nav__close) não encontrado, criando...');
      return;
    }
    
    elements.navClose = closeBtn;
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileMenu();
    });
    
    closeBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        closeMobileMenu();
      }
    });
  }

  function setupGlobalListeners() {
    // Clique fora do menu
    document.addEventListener('click', handleOutsideClick);
    
    // Tecla Escape
    document.addEventListener('keydown', handleEscapeKey);
    
    // Redimensionamento
    window.addEventListener('resize', debounce(() => {
      const wasMobile = state.isMobile;
      state.isMobile = window.innerWidth <= CONFIG.breakpoint;
      
      if (wasMobile !== state.isMobile) {
        console.log(`[Menu] Modo alterado: ${state.isMobile ? 'Mobile' : 'Desktop'}`);
        closeMobileMenu();
      }
    }, 150));
  }

  function initializeARIA() {
    if (elements.hamburger) {
      elements.hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
      elements.hamburger.setAttribute('aria-expanded', 'false');
      elements.hamburger.setAttribute('aria-controls', 'navList');
    }
    
    const closeBtn = document.querySelector('.nav__close');
    if (closeBtn) {
      closeBtn.setAttribute('aria-label', 'Fechar menu');
    }
  }

  // ==================== INICIALIZAÇÃO ====================
  
  function init() {
    console.log('🔧 [Menu] Inicializando com correção de sobreposição...');
    
    // Cache elementos
    elements.hamburger = document.getElementById('hamburger');
    elements.navList = document.getElementById('navList');
    elements.navItems = Array.from(document.querySelectorAll('.nav__item'));
    elements.body = document.body;
    elements.header = document.querySelector('.header');
    elements.mainContent = document.querySelector('.main-content, .hero, section:first-of-type');
    
    // Verificação crítica
    if (!elements.hamburger) {
      console.error('❌ [Menu] Elemento #hamburger não encontrado no HTML');
      return;
    }
    
    if (!elements.navList) {
      console.error('❌ [Menu] Elemento #navList não encontrado no HTML');
      return;
    }
    
    // Estado inicial
    state.isMobile = window.innerWidth <= CONFIG.breakpoint;
    
    // Inicialização
    initializeARIA();
    setupHamburger();
    setupCloseButton();
    setupGlobalListeners();
    
    // Garante que menu comece fechado e não bloqueie
    if (elements.navList) {
      elements.navList.style.pointerEvents = 'none';
    }
    
    console.log('✅ [Menu] Inicializado - Sobreposição corrigida');
    console.log(`   Modo: ${state.isMobile ? 'Mobile' : 'Desktop'}`);
    console.log(`   Header encontrado: ${!!elements.header}`);
    console.log(`   Conteúdo principal: ${elements.mainContent ? 'Sim' : 'Não'}`);
  }

  // Função debounce helper
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

  // Inicia quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
