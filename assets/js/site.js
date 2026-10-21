// GL Minds — interacciones del sitio. Sin dependencias.
(function () {
  "use strict";
  var WA = "525517601312";

  // Cabecera: borde al hacer scroll
  var head = document.querySelector(".site-head");
  if (head) {
    var onScroll = function () { head.classList.toggle("scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Menú móvil
  var btn = document.querySelector(".menu-btn");
  var nav = document.getElementById("nav");
  if (btn && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      btn.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
    };
    btn.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setOpen(false); btn.focus(); } });
  }

  // Comparador antes / después
  var frame = document.getElementById("compare");
  if (frame) {
    var range = frame.querySelector("input[type=range]");
    var set = function () { frame.style.setProperty("--pos", range.value + "%"); };
    range.addEventListener("input", set);
    set();
  }

  // Formulario: arma el mensaje y abre WhatsApp
  var form = document.getElementById("lead-form");
  if (form) {
    var err = form.querySelector(".form-error");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var missing = [];
      if (!String(d.get("nombre") || "").trim()) missing.push("tu nombre");
      if (!String(d.get("negocio") || "").trim()) missing.push("tu negocio");
      if (!d.get("servicio")) missing.push("qué necesitas");
      if (missing.length) {
        err.textContent = "Falta " + missing.join(", ") + ".";
        err.hidden = false;
        var first = form.querySelector(":invalid");
        if (first) first.focus();
        return;
      }
      err.hidden = true;
      var lines = [
        "Hola GL Minds, soy " + d.get("nombre").trim() + " de " + d.get("negocio").trim() + ".",
        "Me interesa: " + d.get("servicio") + "."
      ];
      var extra = String(d.get("detalle") || "").trim();
      if (extra) lines.push(extra);
      window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
    });
  }
})();
