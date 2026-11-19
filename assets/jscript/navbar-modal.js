// 1. Control del botón hamburguesa al hacer Scroll en PC
function actualizarBotonScroll() {
    const hamburgerBtn = document.getElementById('ngHamburgerBtn');
    const sidebar = document.getElementById('ngSidebar');
    const sidebarOverlay = document.getElementById('ngSidebarOverlay');

    if (!hamburgerBtn) return;

    if (window.innerWidth > 768) {
        const scrollActual = window.scrollY || document.documentElement.scrollTop;
        if (scrollActual > 120) {
            hamburgerBtn.classList.add('visible');
        } else {
            hamburgerBtn.classList.remove('visible');
            if (sidebar) sidebar.classList.remove('active');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        }
    }
}

window.addEventListener('scroll', actualizarBotonScroll);
window.addEventListener('resize', actualizarBotonScroll);
window.addEventListener('load', actualizarBotonScroll);

// 2. Funciones auxiliares para cambiar pestañas del Modal
function mostrarLogin() {
    document.getElementById('ngTabLogin').classList.add('active');
    document.getElementById('ngTabRegistro').classList.remove('active');
    document.getElementById('ngFormLogin').classList.remove('ng-modal-oculto');
    document.getElementById('ngFormRegistro').classList.add('ng-modal-oculto');
}

function mostrarRegistro() {
    document.getElementById('ngTabRegistro').classList.add('active');
    document.getElementById('ngTabLogin').classList.remove('active');
    document.getElementById('ngFormRegistro').classList.remove('ng-modal-oculto');
    document.getElementById('ngFormLogin').classList.add('ng-modal-oculto');
}

// 3. Eventos de clic en toda la página
document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('ngSidebar');
    const sidebarOverlay = document.getElementById('ngSidebarOverlay');
    const modal = document.getElementById('ngAuthModal');

    // A) Abrir menú lateral
    if (e.target.closest('#ngHamburgerBtn')) {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    }

    // B) Cerrar menú lateral
    if (e.target.closest('#ngCloseSidebar') || e.target.id === 'ngSidebarOverlay') {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    }

    // C) Abrir Modal de Autenticación
    if (
        e.target.closest('#ngMobileUserBtn') ||
        e.target.closest('#ngSidebarAuthLink') ||
        e.target.closest('.js-open-auth-modal')
    ) {
        e.preventDefault();
        if (sidebar) sidebar.classList.remove('active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        if (modal) modal.classList.remove('ng-modal-oculto');
    }

    // D) Cerrar Modal (X, fondo oscuro o enlaces "Volver al inicio")
    if (
        e.target.closest('#ngCloseModal') ||
        e.target.closest('#ngCloseModalLink1') ||
        e.target.closest('#ngCloseModalLink2') ||
        e.target.id === 'ngAuthModal'
    ) {
        if (e.target.tagName === 'A') e.preventDefault();
        if (modal) modal.classList.add('ng-modal-oculto');
    }

    // E) Cambiar a Iniciar Sesión (desde pestaña o enlace inferior)
    if (e.target.closest('#ngTabLogin') || e.target.closest('#ngSwitchToLogin')) {
        e.preventDefault();
        mostrarLogin();
    }

    // F) Cambiar a Registrarse (desde pestaña o enlace inferior)
    if (e.target.closest('#ngTabRegistro') || e.target.closest('#ngSwitchToRegister')) {
        e.preventDefault();
        mostrarRegistro();
    }
});