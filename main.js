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

    // 2. Neural Network Canvas Background
    // Este código genera puntos y líneas conectadas que se mueven suavemente
    const canvas = document.getElementById('neural-canvas');
    const ctx = canvas.getContext('2d');

    let w, h, particles;
    let particleCount = 60; // Cantidad de nodos
    const connectionDistance = 120; // Distancia para conectar líneas

    // Ajustar canvas al tamaño de la ventana
    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
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
});