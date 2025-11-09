document.addEventListener('DOMContentLoaded', () => {
    
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

    // --- CÓDIGO DEL SLIDER DE COMPARACIÓN "ANTES Y DESPUÉS" ---
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
        
        // --- ¡NUEVA LÓGICA PARA OCULTAR ETIQUETA "ANTES"! ---
        const labelBefore = slider.querySelector('.slider-label--before');
        if (percent > 98) { // Si el slider está casi al final
            labelBefore.style.opacity = '0';
        } else {
            labelBefore.style.opacity = '1';
        }
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
        slider.addEventListener('touchstart', (e) => {
            isDragging = true;
            if (e.cancelable) e.preventDefault();
        }, { passive: false });
        slider.addEventListener('touchend', () => isDragging = false);
        slider.addEventListener('touchcancel', () => isDragging = false);
        slider.addEventListener('touchmove', (e) => {
            if (isDragging) {
                moveSlider(e, slider);
            }
        }, { passive: false });
    });


    // --- CÓDIGO PARA TRANSICIÓN DE LADRILLOS ---
    const triggerLinks = document.querySelectorAll('.transition-trigger');

    triggerLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const destinationUrl = this.href;
            const card = this.closest('.service-card');

            // Si no encuentra la tarjeta, navega normalmente
            if (!card) {
                window.location.href = destinationUrl;
                return;
            }

            const cardRect = card.getBoundingClientRect();

            const overlay = document.createElement('div');
            overlay.classList.add('card-explosion-overlay');
            
            overlay.style.top = `${cardRect.top + window.scrollY}px`;
            overlay.style.left = `${cardRect.left + window.scrollX}px`;
            overlay.style.width = `${cardRect.width}px`;
            overlay.style.height = `${cardRect.height}px`;

            const brickCount = 40; // 5x8 grid
            for (let i = 0; i < brickCount; i++) {
                const brick = document.createElement('div');
                brick.classList.add('explosion-brick');
                overlay.appendChild(brick);
            }

            document.body.appendChild(overlay);
            card.style.visibility = 'hidden';

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
            }, 10); // Un retraso mínimo es suficiente

            // Navegar después de que la animación termine
            setTimeout(() => {
                window.location.href = destinationUrl;
            }, 1200); // Debe coincidir con la duración de la transición en el CSS
        });
    });

});