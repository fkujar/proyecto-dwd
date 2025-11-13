// Espera a que todo el HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- DATOS DE ACCESO (SIMULACIÓN) ---
    const validEmail = 'jedi@galaxia.com';
    const validPassword = 'fuerza';

    // --- ELEMENTOS DEL DOM ---
    const loginModal = document.getElementById('login-modal');
    const closeModalButton = document.getElementById('modal-close-button');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    
    // Obtiene la página actual (ej. "index.html", "personajes.html")
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // --- FUNCIÓN PRINCIPAL: VERIFICAR ESTADO DE SESIÓN ---
    function checkSessionStatus() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

        // 1. Proteger páginas si no se ha iniciado sesión
        // --AÑADIDO 'peliculas_modernas.html'--
        if (!isLoggedIn && (currentPage === 'personajes.html' || currentPage === 'peliculas.html' || currentPage === 'peliculas_modernas.html')) {
            // Si no está logueado e intenta entrar a una página protegida,
            // lo redirigimos al inicio.
            window.location.href = 'index.html';
            return; // Detener ejecución
        }

        // 2. Construir el menú de navegación
        buildNavigationMenu(isLoggedIn);
    }

    // --- FUNCIÓN: CONSTRUIR EL MENÚ DE NAVEGACIÓN ---
    function buildNavigationMenu(isLoggedIn) {
        const navUl = document.getElementById('main-nav');
        if (!navUl) return;

        navUl.innerHTML = ''; // Limpiar menú existente

        if (isLoggedIn) {
            // --- Menú de usuario LOGUEADO ---
            // --MODIFICADO: Añadido enlace a peliculas_modernas.html y renombrado el original--
            navUl.innerHTML = `
                <li><a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}">Inicio</a></li>
                <li><a href="personajes.html" class="${currentPage === 'personajes.html' ? 'active' : ''}">Personajes</a></li>
                <li><a href="peliculas.html" class="${currentPage === 'peliculas.html' ? 'active' : ''}">Películas (I-VI)</a></li>
                <li><a href="peliculas_modernas.html" class="${currentPage === 'peliculas_modernas.html' ? 'active' : ''}">Películas (Modernas)</a></li>
                <li><a href="#" id="nav-logout-button">Cerrar Sesión</a></li>
            `;
            
            // Añadir evento al botón de cerrar sesión
            document.getElementById('nav-logout-button').addEventListener('click', handleLogout);

        } else {
            // --- Menú de usuario NO logueado ---
            // --MODIFICADO: Añadido enlace bloqueado--
            navUl.innerHTML = `
                <li><a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}">Inicio</a></li>
                <li><a href="#" class="locked" title="Inicia sesión para ver esto">Personajes (Bloqueado)</a></li>
                <li><a href="#" class="locked" title="Inicia sesión para ver esto">Películas (I-VI) (Bloqueado)</a></li>
                <li><a href="#" class="locked" title="Inicia sesión para ver esto">Películas (Modernas) (Bloqueado)</a></li>
                <li><a href="#" id="nav-login-button">Iniciar Sesión</a></li>
            `;

            // Añadir evento al botón de iniciar sesión
            document.getElementById('nav-login-button').addEventListener('click', openLoginModal);

            // (Opcional) Añadir evento a los enlaces bloqueados
            document.querySelectorAll('.locked').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    // No mostramos alerta en cada link bloqueado, solo en el de personajes
                    if (link.href.includes('personajes')) {
                         alert('Debes iniciar sesión para acceder a esta sección.');
                    }
                    openLoginModal(e); // Abrir el modal
                });
            });
        }

        // Re-asignar el evento del menú hamburguesa (siempre al final)
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                navUl.classList.toggle('active');
            });
        }
    }

    // --- FUNCIONES DEL MODAL ---
    function openLoginModal(event) {
        event.preventDefault();
        if (loginModal) loginModal.classList.remove('hidden');
    }

    function closeLoginModal() {
        if (loginError) loginError.textContent = ''; // Limpiar errores
        if (loginModal) loginModal.classList.add('hidden');
    }

    // --- FUNCIÓN: MANEJAR EL INICIO DE SESIÓN ---
    function handleLogin(event) {
        event.preventDefault(); // Evitar recarga
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email === validEmail && password === validPassword) {
            // ¡Éxito!
            sessionStorage.setItem('isLoggedIn', 'true');
            // Recargar la página actual para que el menú se reconstruya
            // y las protecciones se apliquen correctamente.
            window.location.reload(); 
        } else {
            // Error
            if (loginError) loginError.textContent = 'Email o contraseña incorrectos.';
        }
    }

    // --- FUNCIÓN: MANEJAR EL CIERRE DE SESIÓN ---
    function handleLogout(event) {
        event.preventDefault();
        sessionStorage.removeItem('isLoggedIn');
        
        // --AÑADIDO 'peliculas_modernas.html'--
        // Si está en una página protegida, redirigir al index.
        if (currentPage === 'personajes.html' || currentPage === 'peliculas.html' || currentPage === 'peliculas_modernas.html') {
            window.location.href = 'index.html';
        } else {
            // Si está en index, solo recargar la página
            window.location.reload();
        }
    }

    // --- INICIALIZACIÓN Y ASIGNACIÓN DE EVENTOS ---
    
    // 1. Evento para el formulario de login (si existe)
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // 2. Eventos para cerrar el modal
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeLoginModal);
    }
    if (loginModal) {
        // Cierra el modal si se hace clic en el fondo oscuro
        loginModal.addEventListener('click', (event) => {
            if (event.target === loginModal) {
                closeLoginModal();
            }
        });
    }

    // 3. Ejecutar la verificación principal al cargar la página
    checkSessionStatus();
});