// ============================================
// HAMBURGUER JS - SIMPLES E FUNCIONAL
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
  
  // ============ ESTADO ============
  let isMenuOpen = false;
  let isMobile = window.innerWidth <= 900;
  
  // ============ FUNÇÕES PRINCIPAIS ============
  
  // ABRIR MENU
  function openMenu() {
    console.log('📱 Abrindo menu...');
    
    // Abre menu
    mobileMenu.classList.add('mobile-menu--open');
    hamburger.classList.add('active');
    
    // Mostra overlay
    if (overlay) {
      overlay.classList.add('active');
    }
    
    // Bloqueia scroll
    body.classList.add('menu-open');
    
    isMenuOpen = true;
    console.log('✅ Menu aberto');
  }
  
  // FECHAR MENU
  function closeMenu() {
    console.log('📱 Fechando menu...');
    
    // Fecha menu
    mobileMenu.classList.remove('mobile-menu--open');
    hamburger.classList.remove('active');
    
    // Esconde overlay
    if (overlay) {
      overlay.classList.remove('active');
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
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }
  
  // ABRIR/FECHAR SUBMENU
  function toggleSubmenu(item) {
    console.log('📂 Alternando submenu...');
    
    // Se já está aberto, fecha
    if (item.classList.contains('open')) {
      item.classList.remove('open');
      console.log('✅ Submenu fechado');
    } else {
      // Fecha outros submenus
      menuItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
        }
      });
      
      // Abre este
      item.classList.add('open');
      console.log('✅ Submenu aberto');
    }
  }
  
  // ============ EVENT LISTENERS ============
  
  // 1. BOTÃO HAMBURGUER
  hamburger.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMenu();
  });
  
  // 2. BOTÃO FECHAR
  if (closeButton) {
    closeButton.addEventListener('click', function(e) {
      e.stopPropagation();
      closeMenu();
    });
  }
  
  // 3. OVERLAY
  if (overlay) {
    overlay.addEventListener('click', function() {
      closeMenu();
    });
  }
  
  // 4. ITENS DO MENU (para abrir submenus)
  menuItems.forEach(item => {
    const link = item.querySelector('.mobile-menu__link');
    const hasDropdown = item.querySelector('.mobile-menu__dropdown');
    
    if (link && hasDropdown) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleSubmenu(item);
      });
    } else if (link) {
      // Link sem dropdown fecha o menu
      link.addEventListener('click', function() {
        if (isMobile) {
          setTimeout(closeMenu, 200);
        }
      });
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
  console.log(`🎯 Elementos:`, {
    hamburger: !!hamburger,
    mobileMenu: !!mobileMenu,
    overlay: !!overlay,
    closeButton: !!closeButton,
    menuItems: menuItems.length
  });
})();
