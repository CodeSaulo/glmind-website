document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });

        // Cerrar menú al hacer clic fuera del menú
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // 3. Neural Network Canvas Background
    // Este código genera puntos y líneas conectadas que se mueven suavemente
    const canvas = document.getElementById('neural-canvas');
    const ctx = canvas.getContext('2d');

    let w, h, particles;
    let particleCount; // Se define dinámicamente
    let connectionDistance; // Se define dinámicamente

    // Ajustar canvas al tamaño de la ventana
    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;

        // Optimización: Reducir carga en pantallas pequeñas (móviles)
        if (w < 768) {
            particleCount = 30; // Mitad de partículas para móviles
            connectionDistance = 80; // Conexiones más cortas
        } else {
            particleCount = 60;
            connectionDistance = 120;
        }
    }

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            // Velocidad aleatoria en X e Y
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 1;
        }

        update() {
            // Mover partícula
            this.x += this.vx;
            this.y += this.vy;

            // Rebotar en los bordes
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 242, 255, 0.5)'; // Color Cian de tus acentos
            ctx.fill();
            ctx.closePath();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        loop();
    }

    // Bucle de animación principal
    function loop() {
        ctx.clearRect(0, 0, w, h);
        
        // Actualizar y dibujar partículas
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Dibujar líneas de conexión si están cerca
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    // La opacidad de la línea depende de la distancia
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(189, 0, 255, ${1 - dist / connectionDistance})`; // Color Morado
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
        requestAnimationFrame(loop); // Solicitar siguiente frame
    }

    // Inicializar y manejar redimensionamiento
    window.addEventListener('resize', resize);
    init();

    // 4. Funcionalidad Modal "Agendar Consultoría"
    // Inyectamos el HTML del modal dinámicamente
    const modalHTML = `
        <div class="modal-overlay" id="schedule-modal">
            <div class="modal-content">
                <h2 class="gradient-text" style="margin-bottom: 15px;">Agenda tu Sesión</h2>
                <p style="color: var(--text-secondary); margin-bottom: 20px;">Déjanos tus datos y te contactaremos para coordinar la consultoría.</p>
                
                <form id="consultation-form" style="display: flex; flex-direction: column; gap: 15px;">
                    <input type="text" class="modal-input" placeholder="Nombre completo" required>
                    <input type="email" class="modal-input" placeholder="Correo electrónico" required>
                    <textarea class="modal-input" rows="3" placeholder="Cuéntanos brevemente sobre tu proyecto" required></textarea>
                    
                    <button type="submit" class="btn btn-primary btn-glow" style="justify-content: center;">
                        <i class="fas fa-paper-plane"></i> Enviar Solicitud
                    </button>
                </form>

                <button class="btn btn-secondary close-modal-btn" style="justify-content: center; border-color: rgba(255,255,255,0.1); margin-top: 15px; width: 100%;">
                        Cerrar
                </button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('schedule-modal');
    const closeBtn = modal.querySelector('.close-modal-btn');
    const form = document.getElementById('consultation-form');

    // Detectar clics en cualquier enlace que apunte a #agendar
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a');
        if (target && target.getAttribute('href') === '#agendar') {
            e.preventDefault();
            modal.classList.add('open');

            // NUEVO: Cerrar menú móvil si está abierto al abrir el modal
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        }
    });

    // Cerrar modal
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
    });

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            modal.classList.remove('open');
        }
    });

    // Manejar envío del formulario (Simulación)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        // Simular petición al servidor
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
            setTimeout(() => {
                modal.classList.remove('open');
                btn.innerHTML = originalText;
                form.reset();
            }, 1500);
        }, 1500);
    });
});