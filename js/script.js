document.addEventListener('DOMContentLoaded', function() {
    // --- CÓDIGO PARA EL MENÚ HAMBURGUESA ---
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');

    // Mostrar menú
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }

    // Ocultar menú
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }

    // --- SOLUCIÓN FINAL Y FUNCIONAL DEL SLIDER DE COMPARACIÓN ---

    // Variable global para saber qué slider está activo
    let activeSlider = null;

    // Función que se ejecuta al mover el ratón o el dedo
    function onMove(e) {
        // Si no hay ningún slider activo, no hacer nada.
        if (!activeSlider) return;

        // Prevenir el scroll en el móvil
        e.preventDefault();

        const slider = activeSlider;
        const afterImage = slider.querySelector('.slider-image--after');
        const handle = slider.querySelector('.slider-handle');
        
        const rect = slider.getBoundingClientRect();
        const clientX = e.clientX || e.touches[0].clientX;
        let x = clientX - rect.left;

        // Limitar a los bordes
        x = Math.max(0, Math.min(x, rect.width));
        
        const percentage = (x / rect.width) * 100;
        afterImage.style.width = percentage + '%';
        handle.style.left = percentage + '%';
    }

    // Función que se ejecuta al soltar
    function onStop() {
        if (activeSlider) {
            activeSlider.classList.remove('is-dragging');
        }
        // Limpiar la variable
        activeSlider = null;
    }

    // Añadir los eventos a cada slider
    document.querySelectorAll('.slider-container').forEach(slider => {
        // Cuando se PRESIONA en un slider...
        slider.addEventListener('mousedown', (e) => {
            e.preventDefault();
            // Guardar una referencia a ESTE slider
            activeSlider = slider;
            slider.classList.add('is-dragging');
        });
        slider.addEventListener('touchstart', (e) => {
            e.preventDefault();
            // Guardar una referencia a ESTE slider
            activeSlider = slider;
            slider.classList.add('is-dragging');
        }, { passive: false });
    });

    // Añadir los escuchas de movimiento y fin al DOCUMENTO entero, una sola vez.
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mouseup', onStop);
    document.addEventListener('touchend', onStop);


    // --- CÓDIGO PARA TRANSICIÓN DE LADRILLOS ---
    const triggerLinks = document.querySelectorAll('.transition-trigger');

    triggerLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const destinationUrl = this.href;
            const card = this.closest('.service-card');

            const cardRect = card.getBoundingClientRect();

            const overlay = document.createElement('div');
            overlay.classList.add('card-explosion-overlay');
            
            overlay.style.top = `${cardRect.top + window.scrollY}px`;
            overlay.style.left = `${cardRect.left + window.scrollX}px`;
            overlay.style.width = `${cardRect.width}px`;
            overlay.style.height = `${cardRect.height}px`;

            const brickCount = 40;
            for (let i = 0; i < brickCount; i++) {
                const brick = document.createElement('div');
                brick.classList.add('explosion-brick');
                overlay.appendChild(brick);
            }

            document.body.appendChild(overlay);
            card.style.visibility = 'hidden';

            // ¡ESTA ES LA MAGIA!
            // Forzamos al navegador a pintar los ladrillos antes de animarlos.
            setTimeout(() => {
                const bricks = overlay.querySelectorAll('.explosion-brick');
                bricks.forEach(brick => {
                    const randomX = (Math.random() - 0.5) * cardRect.width * 3;
                    const randomY = (Math.random() * 0.75 + 0.25) * cardRect.height * 2.5;
                    const randomRot = (Math.random() - 0.5) * 720;
                    
                    brick.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRot}deg) scale(0.1)`;
                    brick.style.opacity = '0';
                });
            }, 10); // Un retraso mínimo es suficiente (10 milisegundos)

            // Navegar después de que la animación termine
            setTimeout(() => {
                window.location.href = destinationUrl;
            }, 1200); // Debe coincidir con la duración de la transición en el CSS
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.slider-container');

    const moveSlider = (e, slider) => {
        const rect = slider.getBoundingClientRect();
        // Previene el comportamiento por defecto en eventos táctiles (como el scroll)
        if (e.cancelable) e.preventDefault();
        
        // Obtiene la coordenada X del puntero (ratón o dedo)
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        
        // Limita el movimiento dentro del contenedor
        let position = Math.max(0, Math.min(x, rect.width));
        let percent = (position / rect.width) * 100;

        // Mueve el manejador y recorta la imagen "después"
        slider.querySelector('.slider-handle').style.left = `${percent}%`;
        slider.querySelector('.slider-image--after').style.clipPath = `polygon(${percent}% 0, 100% 0, 100% 100%, ${percent}% 100%)`;
    };

    sliders.forEach(slider => {
        let isDragging = false;

        // Eventos para ratón
        slider.addEventListener('mousedown', () => isDragging = true);
        slider.addEventListener('mouseup', () => isDragging = false);
        slider.addEventListener('mouseleave', () => isDragging = false);
        slider.addEventListener('mousemove', (e) => {
            if (isDragging) {
                moveSlider(e, slider);
            }
        });

        // Eventos para dispositivos táctiles
        slider.addEventListener('touchstart', () => isDragging = true);
        slider.addEventListener('touchend', () => isDragging = false);
        slider.addEventListener('touchcancel', () => isDragging = false);
        slider.addEventListener('touchmove', (e) => {
            if (isDragging) {
                moveSlider(e, slider);
            }
        });
    });
});