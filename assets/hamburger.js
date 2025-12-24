// ============================================
// HAMBURGUER JS - VERSÃO PROFISSIONAL INSTITUCIONAL
// Navegação mobile com acordeão multinível (padrão corporativo)
// ============================================

(function () {
  'use strict';

  // ==================== CONFIGURAÇÃO ====================
  const CONFIG = {
    breakpoint: 900,
    hoverDelay: 200,
    closeDelay: 300,
    animationDuration: 300,
    enableAnimations: true,
    accordionBehavior: true // TRUE: Comportamento de acordeão no mobile
  };

  // ==================== CACHE DE ELEMENTOS ====================
  const elements = {
    hamburger: null,
    navList: null,
    navItems: [],
    body: document.body,
    navOverlay: null,
    html: document.documentElement
  };

  // ==================== ESTADO GLOBAL ====================
  const state = {
    isMobile: false,
    isMenuOpen: false,
    activeDropdown: null,
    isTransitioning: false,
    resizeTimeout: null,
    hoverTimeouts: new Map(),
    scrollPosition: 0
  };

  // ==================== FUNÇÕES UTILITÁRIAS ====================
  
  /**
   * Debounce para eventos de resize/scroll
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
   * Cria overlay escuro para o menu mobile
   */
  function createOverlay() {
    if (elements.navOverlay) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.setAttribute('role', 'presentation');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.display = 'none';
    
    // Fecha menu ao clicar no overlay
    overlay.addEventListener('click', closeMobileMenu);
    overlay.addEventListener('touchstart', closeMobileMenu);
    
    document.body.appendChild(overlay);
    elements.navOverlay = overlay;
  }

  /**
   * Gerencia o scroll do body quando menu aberto
   */
  function manageBodyScroll(lock) {
    if (lock) {
      // Salva posição atual do scroll
      state.scrollPosition = window.scrollY;
      
      // Aplica estilos para bloquear scroll
      elements.body.style.position = 'fixed';
      elements.body.style.top = `-${state.scrollPosition}px`;
      elements.body.style.width = '100%';
      elements.body.style.overflow = 'hidden';
      elements.body.classList.add('menu-open');
      
      // Salva posição para restaurar depois
      elements.body.setAttribute('data-scroll-position', state.scrollPosition);
    } else {
      // Remove estilos de bloqueio
      elements.body.style.position = '';
      elements.body.style.top = '';
      elements.body.style.width = '';
      elements.body.style.overflow = '';
      elements.body.classList.remove('menu-open');
      
      // Restaura posição do scroll
      const savedPosition = elements.body.getAttribute('data-scroll-position');
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition));
      }
      elements.body.removeAttribute('data-scroll-position');
    }
  }

  /**
   * Limpa todos os timeouts de hover
   */
  function clearAllTimeouts() {
    state.hoverTimeouts.forEach(timeout => clearTimeout(timeout));
    state.hoverTimeouts.clear();
  }

  // ==================== CONTROLE DE ACORDEÃO (MOBILE) ====================
  
  /**
   * Fecha todos os dropdowns (acordeão)
   */
  function closeAllDropdowns() {
    console.log('[Menu] Fechando todos os dropdowns');
    
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
   * Abre um dropdown específico (comportamento de acordeão no mobile)
   */
  function openDropdown(item) {
    if (state.isTransitioning) return;
    
    const link = item.querySelector('.nav__link');
    const dropdown = item.querySelector('.dropdown, .mega-menu');
    
    // NO MOBILE: Fecha outros dropdowns antes de abrir (comportamento de acordeão)
    if (state.isMobile && CONFIG.accordionBehavior) {
      elements.navItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          const otherLink = otherItem.querySelector('.nav__link');
          const otherDropdown = otherItem.querySelector('.dropdown, .mega-menu');
          
          otherItem.classList.remove('open');
          if (otherLink) otherLink.setAttribute('aria-expanded', 'false');
          if (otherDropdown) otherDropdown.setAttribute('aria-hidden', 'true');
        }
      });
    }
    
    // Abre o dropdown atual
    item.classList.add('open');
    if (link) link.setAttribute('aria-expanded', 'true');
    if (dropdown) dropdown.setAttribute('aria-hidden', 'false');
    
    state.activeDropdown = item;
    
    // No mobile, foca no primeiro link do submenu para acessibilidade
    if (state.isMobile && dropdown) {
      setTimeout(() => {
        const firstLink = dropdown.querySelector('a');
        if (firstLink) {
          firstLink.focus();
          console.log('[Menu] Foco movido para o primeiro link do submenu');
        }
      }, CONFIG.animationDuration);
    }
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
   * Alterna dropdown (abre/fecha) - Comportamento principal
   */
  function toggleDropdown(item) {
    if (state.isTransitioning) return;
    
    const isOpening = !item.classList.contains('open');
    
    if (isOpening) {
      openDropdown(item);
    } else {
      closeDropdown(item);
    }
  }

  // ==================== CONTROLE DO MENU MOBILE ====================
  
  /**
   * Fecha o menu mobile completamente
   */
  function closeMobileMenu() {
    if (!state.isMenuOpen || state.isTransitioning) return;
    
    console.log('[Menu] Fechando menu mobile');
    state.isTransitioning = true;
    
    // Fecha visualmente o menu
    if (elements.navList) {
      elements.navList.classList.remove('nav__list--open');
    }
    
    if (elements.hamburger) {
      elements.hamburger.classList.remove('active');
      elements.hamburger.setAttribute('aria-expanded', 'false');
    }
    
    // Fecha overlay com animação
    if (elements.navOverlay) {
      elements.navOverlay.classList.remove('active');
      setTimeout(() => {
        elements.navOverlay.style.display = 'none';
        elements.navOverlay.setAttribute('aria-hidden', 'true');
      }, 400);
    }
    
    // Libera scroll do body
    manageBodyScroll(false);
    
    // Fecha todos os dropdowns
    closeAllDropdowns();
    
    // Retorna foco para o botão hamburger
    if (elements.hamburger) {
      setTimeout(() => elements.hamburger.focus(), 50);
    }
    
    // Atualiza estado após animação
    setTimeout(() => {
      state.isMenuOpen = false;
      state.isTransitioning = false;
      console.log('[Menu] Menu mobile fechado');
    }, CONFIG.animationDuration);
  }

  /**
   * Abre o menu mobile
   */
  function openMobileMenu() {
    if (state.isMenuOpen || state.isTransitioning) return;
    
    console.log('[Menu] Abrindo menu mobile');
    state.isTransitioning = true;
    
    // Cria overlay se necessário
    createOverlay();
    
    // Mostra e anima overlay
    if (elements.navOverlay) {
      elements.navOverlay.style.display = 'block';
      elements.navOverlay.setAttribute('aria-hidden', 'false');
      
      // Pequeno delay para trigger da animação
      setTimeout(() => {
        elements.navOverlay.classList.add('active');
      }, 10);
    }
    
    // Abre visualmente o menu
    if (elements.navList) {
      elements.navList.classList.add('nav__list--open');
    }
    
    if (elements.hamburger) {
      elements.hamburger.classList.add('active');
      elements.hamburger.setAttribute('aria-expanded', 'true');
    }
    
    // Bloqueia scroll do body
    manageBodyScroll(true);
    
    // Atualiza estado após animação
    setTimeout(() => {
      state.isMenuOpen = true;
      state.isTransitioning = false;
      
      // Foco no primeiro item para acessibilidade
      const firstLink = elements.navList.querySelector('.nav__link');
      if (firstLink) {
        firstLink.focus();
        console.log('[Menu] Menu mobile aberto - foco no primeiro link');
      }
    }, CONFIG.animationDuration);
  }

  /**
   * Alterna entre abrir/fechar menu mobile
   */
  function toggleMobileMenu() {
    if (state.isTransitioning) return;
    
    console.log('[Menu] Alternando menu, estado atual:', state.isMenuOpen);
    
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
   * Handler para cliques em links no mobile
   */
  function handleMobileClick(e, item, hasDropdown) {
    if (!state.isMobile) return;
    
    // Se tem dropdown, alterna o acordeão
    if (hasDropdown) {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown(item);
    } else {
      // Link normal - fecha o menu após delay
      console.log('[Menu] Link regular clicado, fechando menu');
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
   * Handler para teclas de seta (navegação por teclado)
   */
  function handleArrowKeys(e, item) {
    if (!state.isMobile || !state.isMenuOpen) return;
    
    const items = Array.from(elements.navItems);
    const currentIndex = items.indexOf(item);
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextItem = items[currentIndex + 1];
      if (nextItem) {
        const nextLink = nextItem.querySelector('.nav__link');
        if (nextLink) nextLink.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevItem = items[currentIndex - 1];
      if (prevItem) {
        const prevLink = prevItem.querySelector('.nav__link');
        if (prevLink) prevLink.focus();
      }
    } else if (e.key === 'ArrowRight' && item.classList.contains('open')) {
      // Seta direita entra no submenu
      e.preventDefault();
      const dropdown = item.querySelector('.dropdown, .mega-menu');
      if (dropdown) {
        const firstSubLink = dropdown.querySelector('a');
        if (firstSubLink) firstSubLink.focus();
      }
    } else if (e.key === 'ArrowLeft') {
      // Seta esquerda volta para o item pai ou fecha submenu
      e.preventDefault();
      if (item.classList.contains('open')) {
        closeDropdown(item);
      } else {
        // Tenta encontrar item pai se estiver em submenu
        const parentItem = item.closest('.nav__item');
        if (parentItem) {
          const parentLink = parentItem.querySelector('.nav__link');
          if (parentLink) parentLink.focus();
        }
      }
    }
  }

  /**
   * Handler para redimensionamento da janela
   */
  const handleResize = debounce(() => {
    const wasMobile = state.isMobile;
    state.isMobile = checkMobileMode();
    
    console.log(`[Menu] Resize: ${wasMobile ? 'Mobile' : 'Desktop'} → ${state.isMobile ? 'Mobile' : 'Desktop'}, Largura: ${window.innerWidth}px`);
    
    // Se mudou de modo, reseta tudo
    if (wasMobile !== state.isMobile) {
      console.log(`[Menu] Modo alterado para: ${state.isMobile ? 'MOBILE' : 'DESKTOP'}`);
      
      // Fecha menu e dropdowns
      closeMobileMenu();
      closeAllDropdowns();
      
      // Reconfigura os listeners específicos do modo
      setupNavigationItems();
    }
  }, 150);

  // ==================== CONFIGURAÇÃO E INICIALIZAÇÃO ====================
  
  /**
   * Inicializa atributos ARIA para acessibilidade
   */
  function initializeARIA() {
    console.log('[Menu] Inicializando atributos ARIA');
    
    // Configura botão hamburger
    if (elements.hamburger) {
      elements.hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
      elements.hamburger.setAttribute('aria-expanded', 'false');
      elements.hamburger.setAttribute('aria-controls', 'navList');
    }
    
    // Configura cada item de navegação
    elements.navItems.forEach((item, index) => {
      const link = item.querySelector('.nav__link');
      const dropdown = item.querySelector('.dropdown, .mega-menu');
      
      if (!link) return;
      
      // Garante ID único se não existir
      if (!link.id) {
        link.id = `nav-link-${index}`;
      }
      
      // Configura atributos para dropdowns
      if (dropdown) {
        link.setAttribute('aria-haspopup', 'true');
        link.setAttribute('aria-expanded', 'false');
        
        if (!dropdown.id) {
          dropdown.id = `dropdown-${index}`;
        }
        
        dropdown.setAttribute('aria-hidden', 'true');
        dropdown.setAttribute('aria-labelledby', link.id);
        link.setAttribute('aria-controls', dropdown.id);
      }
    });
    
    console.log('[Menu] ARIA inicializado com sucesso');
  }

  /**
   * Configura os itens de navegação com listeners apropriados
   */
  function setupNavigationItems() {
    console.log('[Menu] Configurando itens de navegação no modo:', state.isMobile ? 'MOBILE' : 'DESKTOP');
    
    // Primeiro, remove todos os listeners antigos clonando os itens
    elements.navItems.forEach((item, index) => {
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);
      elements.navItems[index] = newItem;
      
      const link = newItem.querySelector('.nav__link');
      const dropdown = newItem.querySelector('.dropdown, .mega-menu');
      const hasDropdown = !!dropdown;
      
      if (!link) return;
      
      // ===== DESKTOP: Hover interactions =====
      if (!state.isMobile && hasDropdown) {
        // Mouse enter com delay
        newItem.addEventListener('mouseenter', () => handleDesktopHover(newItem));
        
        // Mouse leave com delay
        newItem.addEventListener('mouseleave', () => handleDesktopLeave(newItem));
        
        // Mantém dropdown aberto se mouse estiver sobre ele
        if (dropdown) {
          dropdown.addEventListener('mouseenter', () => {
            clearTimeout(state.hoverTimeouts.get(newItem));
          });
          
          dropdown.addEventListener('mouseleave', () => {
            handleDesktopLeave(newItem);
          });
        }
        
        // Foco pelo teclado
        link.addEventListener('focus', () => {
          if (!state.isMobile) {
            clearAllTimeouts();
            closeAllDropdowns();
            openDropdown(newItem);
          }
        });
      }
      
      // ===== MOBILE: Touch/click interactions =====
      // Handler principal de clique
      link.addEventListener('click', (e) => {
        handleMobileClick(e, newItem, hasDropdown);
      });
      
      // Navegação por teclado no mobile
      link.addEventListener('keydown', (e) => {
        // Enter ou Espaço em item com dropdown
        if ((e.key === 'Enter' || e.key === ' ') && state.isMobile && hasDropdown) {
          e.preventDefault();
          toggleDropdown(newItem);
        }
        
        // Navegação por setas
        handleArrowKeys(e, newItem);
        
        // Escape fecha dropdown ou menu
        if (e.key === 'Escape') {
          if (newItem.classList.contains('open')) {
            e.preventDefault();
            closeDropdown(newItem);
            link.focus();
          } else if (state.isMobile && state.isMenuOpen) {
            closeMobileMenu();
          }
        }
      });
      
      // ===== SUBMENUS: Configura links internos =====
      if (hasDropdown) {
        const subLinks = dropdown.querySelectorAll('a');
        subLinks.forEach(subLink => {
          // Links normais fecham o menu
          if (!subLink.closest('.dropdown, .mega-menu')) {
            subLink.addEventListener('click', () => {
              if (state.isMobile) {
                setTimeout(closeMobileMenu, 150);
              }
            });
          }
          
          // Navegação por teclado nos submenus
          subLink.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isMobile) {
              e.preventDefault();
              closeDropdown(newItem);
              link.focus();
            }
          });
        });
      }
    });
  }

  /**
   * Configura o botão hamburger
   */
  function setupHamburger() {
    if (!elements.hamburger) {
      console.error('[Menu] ERRO: Botão hamburger não encontrado!');
      return;
    }
    
    console.log('[Menu] Configurando botão hamburger');
    
    // Clique/touch
    elements.hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
    
    // Navegação por teclado
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
    console.log('[Menu] Configurando listeners globais');
    
    // Clique fora do menu
    document.addEventListener('click', handleOutsideClick);
    
    // Tecla Escape
    document.addEventListener('keydown', handleEscapeKey);
    
    // Redimensionamento
    window.addEventListener('resize', handleResize);
    
    // Mudança de orientação (mobile)
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 200);
    });
    
    // Previne scroll em touch no menu iOS
    if (elements.navList) {
      let startY = 0;
      
      elements.navList.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
      }, { passive: true });
      
      elements.navList.addEventListener('touchmove', (e) => {
        const currentY = e.touches[0].clientY;
        const scrollTop = elements.navList.scrollTop;
        const scrollHeight = elements.navList.scrollHeight;
        const clientHeight = elements.navList.clientHeight;
        
        // Previne overscroll/bounce
        if ((scrollTop <= 0 && currentY > startY) || 
            (scrollTop + clientHeight >= scrollHeight && currentY < startY)) {
          e.preventDefault();
        }
      }, { passive: false });
    }
  }

  /**
   * Inicializa todo o sistema de navegação
   */
  function init() {
    console.log('🚀 [Menu] Inicializando sistema de navegação hamburger...');
    
    // 1. Cache de elementos DOM
    elements.hamburger = document.getElementById('hamburger');
    elements.navList = document.getElementById('navList');
    elements.navItems = Array.from(document.querySelectorAll('.nav__item'));
    elements.body = document.body;
    elements.html = document.documentElement;
    
    // 2. Verifica elementos essenciais
    if (!elements.hamburger || !elements.navList) {
      console.error('❌ [Menu] ERRO CRÍTICO: Elementos essenciais não encontrados!');
      console.error('- Botão hamburger (#hamburger):', elements.hamburger ? 'OK' : 'NÃO ENCONTRADO');
      console.error('- Lista de navegação (#navList):', elements.navList ? 'OK' : 'NÃO ENCONTRADO');
      return;
    }
    
    // 3. Define estado inicial
    state.isMobile = checkMobileMode();
    state.isMenuOpen = false;
    state.isTransitioning = false;
    
    console.log(`[Menu] Estado inicial: ${state.isMobile ? 'MOBILE' : 'DESKTOP'} (${window.innerWidth}px)`);
    
    // 4. Inicializa ARIA (acessibilidade)
    initializeARIA();
    
    // 5. Configura botão hamburger
    setupHamburger();
    
    // 6. Configura itens de navegação
    setupNavigationItems();
    
    // 7. Configura listeners globais
    setupGlobalListeners();
    
    // 8. Cria overlay (será mostrado quando necessário)
    createOverlay();
    
    console.log('✅ [Menu] Sistema de navegação inicializado com sucesso!');
    console.log(`   Modo: ${state.isMobile ? 'Mobile' : 'Desktop'}`);
    console.log(`   Itens de menu: ${elements.navItems.length}`);
    console.log(`   Animação: ${CONFIG.enableAnimations ? 'Ativada' : 'Desativada'}`);
    console.log(`   Acordeão mobile: ${CONFIG.accordionBehavior ? 'Ativado' : 'Desativado'}`);
  }

  // ==================== INICIALIZAÇÃO AUTOMÁTICA ====================
  
  // Inicia quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM já está pronto
    init();
  }
  
  // Expõe funções públicas para controle externo (opcional)
  window.MobileMenu = {
    open: openMobileMenu,
    close: closeMobileMenu,
    toggle: toggleMobileMenu,
    closeAllDropdowns: closeAllDropdowns,
    isOpen: () => state.isMenuOpen,
    isMobile: () => state.isMobile
  };
  
})();
