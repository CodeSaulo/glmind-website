# glminds.com

Sitio público de GL Minds: empresa de desarrollo web, SaaS e IA.

## Estructura

| Ruta | Qué es |
|---|---|
| `/` | Inicio: servicios, productos, proceso, contacto |
| `/one/` | Página de producto de GL Minds One (consultorios) |
| `/aviso-de-privacidad/`, `/terminos/` | Legales |

## Editar

Las páginas se escriben en `src/pages/*.html` (solo el contenido de `<main>` más un bloque de metadatos).
La cabecera, el pie, los iconos, el SEO (canonical, Open Graph, JSON-LD, FAQ) y el `sitemap.xml` se generan con:

```bash
python3 tools/build.py
```

Después de editar, corre el script y sube **también** los `index.html` generados: el hosting sirve archivos estáticos, sin paso de build.

Estilos: `assets/css/site.css` · Scripts: `assets/js/site.js` · Fuentes autoalojadas en `assets/fonts/`.
