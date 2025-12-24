// ============================================
// HAMBURGUER JS - SISTEMA DE CONTROLE DE ESTADO
// Processo documentado, sem retrabalho
// ============================================

(function () {
  'use strict';

  // ==================== CONFIGURAÇÃO ====================
  const CONFIG = {
    breakpoint: 900,
    animationDuration: 400
  };

  // ==================== SISTEMA DE ELEMENTOS ====================
  const elements = {
    hamburger: null,
    navList: null,
    navOverlay: null,
    navClose: null,
    body: document.body
  };

  // ==================== SISTEMA DE ESTADO ====================
  const state = {
    isMobile: false,
    isMenuOpen: false,
    isTransitioning: false,
    scrollPosition: 0
  };

  // ==================== PROCESSO: INICIALIZAÇÃO ====================
  function initialize() {
    console.log('🔧 [PROCESSO] Inicializando sistema de menu...');
    
    // PASSO 1: Cache de elementos
    cacheElements();
    
    // PASSO 2: Verificação crítica
    if (!validateElements()) return;
    
    // PASSO 3: Estado inicial
    setInitialState();
    
    // PASSO 4: Configuração
    setupEventListeners();
    
    // PASSO 5: Criação de elementos dinâmicos
    createOverlay();
    
    console.log('✅ [PROCESSO] Sistema inicializado com sucesso');
    logState();
  }

  // ==================== SUBPROCESSO 1: CACHE DE ELEMENTOS ====================
  function cacheElements() {
    console.log('📦 [SUBPROCESSO] Fazendo cache de elementos...');
    
    elements.hamburger = document.getElementById('hamburger');
    elements.navList = document.getElementById('navList');
    elements.navClose = document.querySelector('.nav__close');
    elements.body = document.body;
    
    console.log('   ✅ Hamburguer:', elements.hamburger ? 'OK' : 'NÃO ENCONTRADO');
    console.log('   ✅ NavList:', elements.navList ? 'OK' : 'NÃO ENCONTRADO');
    console.log('   ✅ Botão Fechar:', elements.navClose ? 'OK' : 'NÃO ENCONTRADO');
  }

  // ==================== SUBPROCESSO 2: VALIDAÇÃO ====================
  function validateElements() {
    console.log('🔍 [SUBPROCESSO] Validando elementos...');
    
    if (!elements.hamburger) {
      console.error('❌ [ERRO] Elemento #hamburger não encontrado');
      console.error('   Solução: Adicione <button id="hamburger"> ao seu HTML');
      return false;
    }
    
    if (!elements.navList) {
      console.error('❌ [ERRO] Elemento #navList não encontrado');
      console.error('   Solução: Adicione <ul id="navList"> ao seu HTML');
      return false;
    }
    
    console.log('   ✅ Todos os elementos essenciais encontrados');
    return true;
  }

  // ==================== SUBPROCESSO 3: ESTADO INICIAL ====================
  function setInitialState() {
    console.log('⚙️ [SUBPROCESSO] Definindo estado inicial...');
    
    // 1. Verifica se está no modo mobile
    state.isMobile = window.innerWidth <= CONFIG.breakpoint;
    
    // 2. Menu começa FECHADO
    state.isMenuOpen = false;
    state.isTransitioning = false;
    
    // 3. Remove qualquer classe residual que possa estar abrindo o menu
    if (elements.navList) {
      elements.navList.classList.remove('nav__list--open');
    }
    
    if (elements.hamburger) {
      elements.hamburger.classList.remove('active');
      elements.hamburger.setAttribute('aria-expanded', 'false');
    }
    
    console.log('   ✅ Estado inicial definido:', {
      isMobile: state.isMobile,
      isMenuOpen: state.isMenuOpen,
      width: window.innerWidth + 'px'
    });
  }

  // ==================== SUBPROCESSO 4: CONFIGURAÇÃO DE EVENTOS ====================
  function setupEventListeners() {
    console.log('🎯 [SUBPROCESSO] Configurando event listeners...');
    
    // 1. Hamburguer
    elements.hamburger.addEventListener('click', handleHamburgerClick);
    elements.hamburger.addEventListener('keydown', handleHamburgerKeydown);
    
    // 2. Botão fechar
    if (elements.navClose) {
      elements.navClose.addEventListener('click', handleCloseClick);
    }
    
    // 3. Eventos globais
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);
    window.addEventListener('resize', debounce(handleResize, 150));
    
    console.log('   ✅ Event listeners configurados');
  }

  // ==================== SUBPROCESSO 5: CRIAÇÃO DE OVERLAY ====================
  function createOverlay() {
    console.log('🎨 [SUBPROCESSO] Criando overlay...');
    
    // Só cria se não existir
    if (document.querySelector('.nav-overlay')) {
      console.log('   ⚠️ Overlay já existe, reutilizando');
      elements.navOverlay = document.querySelector('.nav-overlay');
      return;
    }
    
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
    
    overlay.addEventListener('click', closeMenu);
    document.body.appendChild(overlay);
    elements.navOverlay = overlay;
    
    console.log('   ✅ Overlay criado e configurado');
  }

  // ==================== PROCESSO: ABRIR MENU ====================
  function openMenu() {
    console.log('🚪 [PROCESSO] Abrindo menu...');
    
    // Verificação de estado
    if (state.isMenuOpen || state.isTransitioning || !state.isMobile) {
      console.log('   ⚠️ Abortando: estado inválido', {
        isMenuOpen: state.isMenuOpen,
        isTransitioning: state.isTransitioning,
        isMobile: state.isMobile
      });
      return;
    }
    
    state.isTransitioning = true;
    
    // PASSO 1: Mostrar overlay
    if (elements.navOverlay) {
      elements.navOverlay.style.display = 'block';
      elements.navOverlay.setAttribute('aria-hidden', 'false');
      elements.navOverlay.style.pointerEvents = 'auto';
      
      // Pequeno delay para acionar animação CSS
      requestAnimationFrame(() => {
        elements.navOverlay.classList.add('active');
      });
    }
    
    // PASSO 2: Abrir menu
    elements.navList.classList.add('nav__list--open');
    elements.hamburger.classList.add('active');
    elements.hamburger.setAttribute('aria-expanded', 'true');
    
    // PASSO 3: Bloquear scroll
    blockBodyScroll(true);
    
    // PASSO 4: Atualizar estado
    setTimeout(() => {
      state.isMenuOpen = true;
      state.isTransitioning = false;
      
      // Foco no botão fechar para acessibilidade
      if (elements.navClose) {
        elements.navClose.focus();
      }
      
      console.log('   ✅ Menu aberto com sucesso');
      logState();
    }, CONFIG.animationDuration);
  }

  // ==================== PROCESSO: FECHAR MENU ====================
  function closeMenu() {
    console.log('🚪 [PROCESSO] Fechando menu...');
    
    // Verificação de estado
    if (!state.isMenuOpen || state.isTransitioning) {
      console.log('   ⚠️ Abortando: menu já fechado ou em transição');
      return;
    }
    
    state.isTransitioning = true;
    
    // PASSO 1: Fechar menu visualmente
    elements.navList.classList.remove('nav__list--open');
    elements.hamburger.classList.remove('active');
    elements.hamburger.setAttribute('aria-expanded', 'false');
    
    // PASSO 2: Fechar overlay
    if (elements.navOverlay) {
      elements.navOverlay.classList.remove('active');
      
      setTimeout(() => {
        elements.navOverlay.style.display = 'none';
        elements.navOverlay.setAttribute('aria-hidden', 'true');
        elements.navOverlay.style.pointerEvents = 'none';
      }, 300);
    }
    
    // PASSO 3: Liberar scroll
    blockBodyScroll(false);
    
    // PASSO 4: Atualizar estado
    setTimeout(() => {
      state.isMenuOpen = false;
      state.isTransitioning = false;
      
      // Retornar foco para hamburguer
      elements.hamburger.focus();
      
      console.log('   ✅ Menu fechado com sucesso');
      logState();
    }, CONFIG.animationDuration);
  }

  // ==================== FUNÇÕES AUXILIARES ====================
  function blockBodyScroll(shouldBlock) {
    if (shouldBlock) {
      state.scrollPosition = window.scrollY;
      elements.body.style.position = 'fixed';
      elements.body.style.top = `-${state.scrollPosition}px`;
      elements.body.style.width = '100%';
      elements.body.style.overflow = 'hidden';
      elements.body.classList.add('menu-open');
    } else {
      elements.body.style.position = '';
      elements.body.style.top = '';
      elements.body.style.width = '';
      elements.body.style.overflow = '';
      elements.body.classList.remove('menu-open');
      
      // Restaurar posição do scroll
      window.scrollTo(0, state.scrollPosition);
    }
  }

  function toggleMenu() {
    console.log('🔄 [AÇÃO] Alternando menu...');
    if (state.isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // ==================== HANDLERS DE EVENTOS ====================
  function handleHamburgerClick(e) {
    e.stopPropagation();
    toggleMenu();
  }

  function handleHamburgerKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
    if (e.key === 'Escape' && state.isMenuOpen) {
      closeMenu();
    }
  }

  function handleCloseClick(e) {
    e.stopPropagation();
    closeMenu();
  }

  function handleOutsideClick(e) {
    // Se clicou fora do menu quando ele está aberto
    if (state.isMenuOpen && 
        !e.target.closest('.nav__list') && 
        !e.target.closest('#hamburger') &&
        !e.target.closest('.nav__close')) {
      closeMenu();
    }
  }

  function handleEscapeKey(e) {
    if (e.key === 'Escape' && state.isMenuOpen) {
      closeMenu();
    }
  }

  function handleResize() {
    const wasMobile = state.isMobile;
    state.isMobile = window.innerWidth <= CONFIG.breakpoint;
    
    if (wasMobile !== state.isMobile) {
      console.log('📱 [SISTEMA] Modo alterado:', 
        wasMobile ? 'Mobile' : 'Desktop', 
        '→', 
        state.isMobile ? 'Mobile' : 'Desktop'
      );
      
      // Fecha menu se mudou de modo
      if (state.isMenuOpen) {
        closeMenu();
      }
    }
  }

  // ==================== UTILITÁRIOS ====================
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

  function logState() {
    console.log('📊 [ESTADO ATUAL]', {
      isMobile: state.isMobile,
      isMenuOpen: state.isMenuOpen,
      isTransitioning: state.isTransitioning,
      width: window.innerWidth + 'px'
    });
  }

  // ==================== INICIALIZAÇÃO CONTROLADA ====================
  console.log('========================================');
  console.log('🚀 SISTEMA DE MENU HAMBURGUER - INICIANDO');
  console.log('========================================');
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    // Pequeno delay para garantir que todos os elementos estejam renderizados
    setTimeout(initialize, 50);
  }
})();
