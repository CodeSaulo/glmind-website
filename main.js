document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP = '525517853980';

  // Sombra del menú al hacer scroll
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menú móvil
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    const setOpen = open => {
      links.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      const icon = toggle.querySelector('i');
      icon?.classList.toggle('fa-bars', !open);
      icon?.classList.toggle('fa-xmark', open);
    };
    toggle.addEventListener('click', () => setOpen(!links.classList.contains('active')));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  }

  // Botones de plan: preseleccionan el plan en el formulario
  const form = document.getElementById('demo-form');
  document.querySelectorAll('[data-plan]').forEach(btn => {
    btn.addEventListener('click', () => {
      const select = form?.querySelector('select[name="plan"]');
      if (select) select.value = btn.dataset.plan;
    });
  });

  // Enlaces de especialidad: preseleccionan la especialidad
  document.querySelectorAll('[data-especialidad]').forEach(btn => {
    btn.addEventListener('click', () => {
      const select = form?.querySelector('select[name="especialidad"]');
      if (select) select.value = btn.dataset.especialidad;
    });
  });

  // Formulario: abre WhatsApp con el mensaje listo
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const lines = [
      'Hola GL Minds, quiero conocer GL Minds One.',
      '',
      `Nombre: ${data.get('nombre') || ''}`,
      `Consultorio: ${data.get('negocio') || ''}`,
      `Especialidad: ${data.get('especialidad') || ''}`,
      `Plan de interés: ${data.get('plan') || 'Aún no sé'}`
    ];
    const need = (data.get('necesidad') || '').toString().trim();
    if (need) lines.push(`Quiero resolver: ${need}`);
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url; // si el navegador bloquea la ventana
  });
});
