// ============================================
// HAMBURGUER JS - COM VERIFICAÇÃO DE TEXTO
// ============================================

(function () {
  'use strict';
  
  console.log('🚀 Iniciando menu hamburguer...');
  
  // ============ ELEMENTOS ============
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.nav-overlay');
  const closeButton = document.querySelector('.mobile-menu__close');
  const menuItems = document.querySelectorAll('.mobile-menu__item');
  const body = document.body;
  
  // ============ VERIFICAÇÕES ============
  if (!hamburger) {
    console.error('❌ Botão hamburger não encontrado (#hamburger)');
    return;
  }
  
  if (!mobileMenu) {
    console.error('❌ Menu mobile não encontrado (.mobile-menu)');
    return;
  }
  
  console.log('✅ Elementos encontrados:', {
    hamburger: !!hamburger,
    mobileMenu: !!mobileMenu,
    overlay: !!overlay,
    closeButton: !!closeButton,
    menuItems: menuItems.length
  });
  
  // ============ DEBUG: VERIFICAR TEXTO ============
  function checkTextVisibility() {
    console.log('🔍 Verificando visibilidade do texto...');
    
    const links = document.querySelectorAll('.mobile-menu__link, .mobile-menu__sublink');
    links.forEach((link, index) => {
      const computedStyle = window.getComputedStyle(link);
      const color = computedStyle.color;
      const visibility = computedStyle.visibility;
      const opacity = computedStyle.opacity;
      const display = computedStyle.display;
      
      console.log(`  Link ${index + 1}:`, {
        text: link.textContent.trim(),
        color: color,
        visibility: visibility,
        opacity: opacity,
        display: display,
        hasText: link.textContent.trim().length > 0
      });
    });
  }
  
  // ============ ESTADO ============
  let isMenuOpen = false;
  let isMobile = window.innerWidth <= 900;
  
  // ============ FUNÇÕES PRINCIPAIS ============
  
  // ABRIR MENU
  function openMenu() {
    console.log('📱 Abrindo menu...');
    
    if (isMenuOpen) return;
    
    // Abre menu
    mobileMenu.classList.add('mobile-menu--open');
    hamburger.classList.add('active');
    
    // Mostra overlay
    if (overlay) {
      overlay.style.display = 'block';
      setTimeout(() => {
        overlay.classList.add('active');
      }, 10);
    }
    
    // Bloqueia scroll
    body.classList.add('menu-open');
    
    isMenuOpen = true;
    
    // Verifica texto após abrir
    setTimeout(checkTextVisibility, 100);
    
    console.log('✅ Menu aberto');
  }
  
  // FECHAR MENU
  function closeMenu() {
    console.log('📱 Fechando menu...');
    
    if (!isMenuOpen) return;
    
    // Fecha menu
    mobileMenu.classList.remove('mobile-menu--open');
    hamburger.classList.remove('active');
    
    // Esconde overlay
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 300);
    }
    
    // Libera scroll
    body.classList.remove('menu-open');
    
    // Fecha todos os submenus
    menuItems.forEach(item => {
      item.classList.remove('open');
    });
    
    isMenuOpen = false;
    console.log('✅ Menu fechado');
  }
  
  // ALTERNAR MENU
  function toggleMenu() {
    console.log('🔄 Alternando menu...');
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }
  
  // ABRIR/FECHAR SUBMENU
  function toggleSubmenu(item) {
    console.log('📂 Alternando submenu:', item.querySelector('.mobile-menu__link')?.textContent?.trim());
    
    const isOpening = !item.classList.contains('open');
    
    // Fecha outros submenus
    if (isOpening) {
      menuItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
        }
      });
    }
    
    // Alterna este
    item.classList.toggle('open');
    
    console.log('✅ Submenu', item.classList.contains('open') ? 'aberto' : 'fechado');
  }
  
  // ============ EVENT LISTENERS ============
  
  // 1. BOTÃO HAMBURGUER
  hamburger.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    toggleMenu();
  });
  
  // 2. BOTÃO FECHAR
  if (closeButton) {
    closeButton.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      closeMenu();
    });
  }
  
  // 3. OVERLAY
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeMenu();
      }
    });
  }
  
  // 4. ITENS DO MENU (para abrir submenus)
  menuItems.forEach(item => {
    const link = item.querySelector('.mobile-menu__link');
    const hasDropdown = item.querySelector('.mobile-menu__dropdown');
    
    if (link) {
      // Verifica se tem dropdown
      if (hasDropdown) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          toggleSubmenu(item);
        });
      } else {
        // Link sem dropdown fecha o menu
        link.addEventListener('click', function(e) {
          if (isMobile && isMenuOpen) {
            e.preventDefault();
            setTimeout(closeMenu, 200);
          }
        });
      }
    }
  });
  
  // 5. TECLA ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  });
  
  // 6. REDIMENSIONAMENTO
  window.addEventListener('resize', function() {
    const nowMobile = window.innerWidth <= 900;
    
    if (isMobile !== nowMobile) {
      isMobile = nowMobile;
      console.log(`📱 Modo alterado: ${isMobile ? 'Mobile' : 'Desktop'}`);
      
      // Fecha menu se mudou para desktop
      if (!isMobile && isMenuOpen) {
        closeMenu();
      }
    }
  });
  
  // ============ INICIALIZAÇÃO ============
  console.log('✅ Menu hamburguer inicializado');
  console.log(`📱 Modo: ${isMobile ? 'Mobile' : 'Desktop'}`);
  console.log(`📏 Largura: ${window.innerWidth}px`);
  
  // Verifica texto na inicialização
  setTimeout(checkTextVisibility, 500);
})();
