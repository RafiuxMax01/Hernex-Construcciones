document.addEventListener('DOMContentLoaded', function() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav__link');

    // Muestra u oculta el menú al hacer clic en el ícono de hamburguesa
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
        });
    }

    // Cierra el menú móvil al hacer clic en cualquiera de los enlaces
    function closeMenu() {
        navMenu.classList.remove('show-menu');
    }
    navLinks.forEach(link => link.addEventListener('click', closeMenu));
});