document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 40);
  });

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
      const icon = menuToggle.querySelector('i');
      icon?.classList.remove('fa-times');
      icon?.classList.add('fa-bars');
    };

    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active', open);
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !open);
        icon.classList.toggle('fa-times', open);
      }
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  }

  const canvas = document.getElementById('neural-canvas');
  const ctx = canvas?.getContext('2d');
  if (canvas && ctx) {
    let width = 0;
    let height = 0;
    let particles = [];
    let connectionDistance = 120;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      connectionDistance = width < 768 ? 80 : 120;
      const count = width < 768 ? 28 : 58;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .45,
        vy: (Math.random() - .5) * .45,
        r: Math.random() * 1.3 + .8
      }));
    };

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34,211,166,.45)';
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const distance = Math.hypot(dx, dy);
          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56,189,248,${(1 - distance / connectionDistance) * .5})`;
            ctx.lineWidth = .5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize);
    loop();
  }

  const demoForm = document.getElementById('demo-form');
  if (demoForm) {
    demoForm.addEventListener('submit', event => {
      event.preventDefault();
      const form = new FormData(demoForm);
      const solution = form.get('solucion') || 'Solución GL Minds';
      const subject = `Solicitud de información - ${solution}`;
      const body = [
        'Hola GL Minds, me interesa conocer más sobre sus soluciones.',
        '',
        `Nombre: ${form.get('nombre') || ''}`,
        `Negocio: ${form.get('negocio') || ''}`,
        `Solución de interés: ${solution}`,
        `WhatsApp: ${form.get('whatsapp') || ''}`,
        `Necesidad: ${form.get('necesidad') || 'No especificada'}`
      ].join('\n');
      window.location.href = `mailto:contacto@glminds.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
});