#!/usr/bin/env python3
"""Arma las páginas estáticas de glminds.com a partir de src/pages/*.html.

Cada página fuente empieza con un bloque de metadatos:
  <!--meta
  title: ...
  description: ...
  path: /one/
  nav: one
  schema: <JSON-LD opcional en una línea>
  -->
y el resto es el contenido de <main>. El script añade <head>, cabecera, pie,
iconos SVG y el botón de WhatsApp, y escribe el resultado en la raíz del sitio.

Uso:  python3 tools/build.py
"""
from pathlib import Path
import html, json, re

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
SITE = "https://glminds.com"
WA = "525517601312"
WA_TXT = "Hola%20GL%20Minds%2C%20quiero%20cotizar%20un%20proyecto."

ICONS = {
 "check": '<path d="M20 6 9 17l-5-5"/>',
 "arrow": '<path d="M5 12h14M13 5l7 7-7 7"/>',
 "ext": '<path d="M7 17 17 7M8 7h9v9"/>',
 "mail": '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
 "menu": '<path d="M4 6h16M4 12h16M4 18h16"/>',
 "close": '<path d="M18 6 6 18M6 6l12 12"/>',
 "code": '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
 "refresh": '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
 "layers": '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
 "bot": '<rect x="3" y="8" width="18" height="12" rx="3"/><path d="M12 8V4M8 4h8M9 14h.01M15 14h.01"/>',
 "zap": '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
 "sparkles": '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 16v5M16.5 18.5h5"/>',
 "phone": '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
 "search": '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
 "gauge": '<path d="m12 14 4-4M3.5 18a10 10 0 1 1 17 0"/>',
 "shield": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
 "eye": '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 "chart": '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
 "file": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
 "key": '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.8-9.8M17 6l3 3M14.5 8.5l2 2"/>',
 "calendar": '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 "users": '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-5-6.7"/>',
 "wallet": '<path d="M20 7H5a2 2 0 0 1 0-4h13v4"/><path d="M3 5v14a2 2 0 0 0 2 2h15V7"/><circle cx="16" cy="14" r="1.5"/>',
 "tooth": '<path d="M7 3C4.5 3 3 5 3 7.5c0 3 1.5 4.5 2 7 .5 3 1 6.5 2.5 6.5S9.5 17 12 17s3 4 4.5 4 2-3.5 2.5-6.5c.5-2.5 2-4 2-7C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3z"/>',
 "steth": '<path d="M5 3v6a5 5 0 0 0 10 0V3M3.5 3h3M13.5 3h3"/><path d="M10 14v2a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="12" r="2"/>',
 "bell": '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0"/>',
 "lock": '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
 "chat": '<path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12z"/>',
 "gift": '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v9H5v-9M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
 "userx": '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M17 8l5 5M22 8l-5 5"/>',
 "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 "grip": '<path d="m9 7-5 5 5 5M15 7l5 5-5 5"/>',
 "store": '<path d="M3 9 4.5 4h15L21 9M4 9v11h16V9M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/>',
 "globe": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
 "plug": '<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4"/>',
 "person": '<circle cx="12" cy="7" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/>',
 "list": '<path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
}
WA_PATH = ('<path fill="currentColor" stroke="none" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.82 9.82 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41"/>')

def sprite():
    syms = [f'<symbol id="i-{k}" viewBox="0 0 24 24">{v}</symbol>' for k, v in ICONS.items()]
    syms.append(f'<symbol id="i-wa" viewBox="0 0 24 24">{WA_PATH}</symbol>')
    return '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' + "".join(syms) + "</svg>"

def ico(name):
    return f'<svg class="icon" aria-hidden="true"><use href="#i-{name}"/></svg>'

NAV = [("servicios", "/#servicios", "Servicios"), ("productos", "/#productos", "Productos"),
       ("one", "/one/", "GL Minds One"), ("proceso", "/#proceso", "Cómo trabajamos"), ("faq", "/#preguntas", "Preguntas")]

def header(active):
    cur = ' aria-current="page"'
    links = "".join(
        f'<a href="{href}"{cur if key == active else ""}>{label}</a>' for key, href, label in NAV)
    return f'''<header class="site-head" id="top">
  <div class="wrap head-row">
    <a class="brand" href="/" aria-label="GL Minds, inicio"><img src="/assets/img/logo-mark.svg" alt="" width="36" height="36"><span>GL Minds<small>Software a la medida</small></span></a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav" aria-label="Abrir menú">{ico("menu")}</button>
    <nav class="nav" id="nav" aria-label="Principal">{links}<a class="btn btn-primary btn-sm" href="/#contacto">Cotizar proyecto</a></nav>
  </div>
</header>'''

FOOTER = f'''<footer class="site-foot">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="brand" href="/"><img src="/assets/img/logo-mark.svg" alt="" width="36" height="36"><span>GL Minds<small>Software a la medida</small></span></a>
        <p class="foot-about">Diseñamos y programamos sitios web, sistemas SaaS y asistentes con IA para negocios en México.</p>
      </div>
      <div><h2>Servicios</h2><ul>
        <li><a href="/#servicios">Sitios y landing pages</a></li>
        <li><a href="/#servicios">Rediseño de sitios</a></li>
        <li><a href="/#servicios">Sistemas a la medida</a></li>
        <li><a href="/#ia">Chatbots y agentes de IA</a></li>
        <li><a href="/#ia">Automatizaciones</a></li>
      </ul></div>
      <div><h2>Productos</h2><ul>
        <li><a href="/one/">GL Minds One</a></li>
        <li><a href="https://chat.glminds.com" rel="noopener">GL Minds Chat</a></li>
        <li><a href="https://agent.glminds.com" rel="noopener">GL Minds Agent</a></li>
        <li><a href="https://orders.glminds.com" rel="noopener">GL Minds Orders</a></li>
      </ul></div>
      <div><h2>Contacto</h2><ul>
        <li><a href="https://wa.me/{WA}?text={WA_TXT}" rel="noopener">WhatsApp 55 1760 1312</a></li>
        <li><a href="mailto:contacto@glminds.com">contacto@glminds.com</a></li>
        <li><a href="/aviso-de-privacidad/">Aviso de privacidad</a></li>
        <li><a href="/terminos/">Términos y condiciones</a></li>
      </ul></div>
    </div>
    <div class="foot-base"><span>© 2026 GL Minds. Hecho en México.</span><a href="#top">Volver arriba</a></div>
  </div>
</footer>
<a class="wa-float" href="https://wa.me/{WA}?text={WA_TXT}" rel="noopener" aria-label="Escríbenos por WhatsApp"><svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg></a>'''

ORG = {
  "@context": "https://schema.org", "@type": "Organization", "@id": SITE + "/#org",
  "name": "GL Minds", "url": SITE + "/", "logo": SITE + "/assets/img/logo.png",
  "email": "contacto@glminds.com", "telephone": "+52 55 1760 1312",
  "areaServed": "MX", "address": {"@type": "PostalAddress", "addressCountry": "MX"},
  "sameAs": [],
}

def page(meta, body):
    path = meta["path"]
    url = SITE + path
    title = meta["title"]
    desc = meta["description"]
    robots = meta.get("robots", "index,follow")
    schemas = [ORG]
    if meta.get("schema"):
        schemas.append(json.loads(meta["schema"]))
    if meta.get("faq") == "auto":
        qa = re.findall(r"<summary>(.*?)</summary><p>(.*?)</p>", body, re.S)
        strip = lambda t: re.sub(r"<[^>]+>", "", t).strip()
        schemas.append({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": strip(q), "acceptedAnswer": {"@type": "Answer", "text": strip(a)}} for q, a in qa]})
    ld = "\n".join(f'<script type="application/ld+json">{json.dumps(s, ensure_ascii=False)}</script>' for s in schemas)
    e = html.escape
    return f'''<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="robots" content="{robots}">
<link rel="canonical" href="{url}">
<meta name="theme-color" content="#0b8f73">
<link rel="icon" href="/assets/img/logo-mark.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/logo.png">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_MX">
<meta property="og:site_name" content="GL Minds">
<meta property="og:title" content="{e(meta.get("og_title", title))}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" href="/assets/fonts/bricolage.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/public-sans-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">
{ld}
</head>
<body>
<a class="skip" href="#main">Saltar al contenido</a>
{sprite()}
{header(meta.get("nav", ""))}
<main id="main">
{body.strip()}
</main>
{FOOTER}
<script src="/assets/js/site.js" defer></script>
</body>
</html>
'''

def parse(src):
    m = re.match(r"\s*<!--meta\n(.*?)\n-->\n(.*)", src, re.S)
    meta = {}
    for line in m.group(1).splitlines():
        k, _, v = line.partition(":")
        meta[k.strip()] = v.strip()
    body = m.group(2)
    body = re.sub(r"\{\{i:([a-z]+)\}\}", lambda x: ico(x.group(1)), body)
    body = body.replace("{{wa}}", '<svg class="icon" aria-hidden="true"><use href="#i-wa"/></svg>')
    body = body.replace("{{WA}}", WA)
    return meta, body

def main():
    urls = []
    for f in sorted((SRC / "pages").glob("*.html")):
        meta, body = parse(f.read_text(encoding="utf-8"))
        out = ROOT / meta["path"].strip("/") / "index.html" if meta["path"] != "/404" else ROOT / "404.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(page(meta, body), encoding="utf-8")
        if meta.get("robots", "index") .startswith("index"):
            urls.append((meta["path"], meta.get("priority", "0.6")))
        print("escrito", out.relative_to(ROOT))
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for p, pr in urls:
        sm.append(f"  <url><loc>{SITE}{p}</loc><priority>{pr}</priority></url>")
    sm.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(sm) + "\n", encoding="utf-8")
    print("escrito sitemap.xml")

if __name__ == "__main__":
    main()
