// ============================================================
//  rooms.js — Definición de las salas del museo
//
//  Sala I  → usa illusionsSala1 (definido en illusions.js)
//  Sala II → marcos vacíos: agrega tus ilusiones aquí
//  Sala III→ marcos vacíos: agrega tus ilusiones aquí
//
//  Para agregar una ilusión en Sala II o III:
//  1. Cambia empty: true  →  empty: false
//  2. Agrega una función draw(canvas) { ... }
// ============================================================

const rooms = {

  // ── SALA I: Ilusiones ya implementadas ──────────────────
  1: {
    label: "✨ Colección Permanente · Sala I ✨",
    artworks: illusionsSala1   // viene de illusions.js
  },

  // ── SALA II: Espacios vacíos para tus ilusiones ─────────
  2: {
    label: "🎨 Sala II · Próximamente...",
    artworks: [
      {
        title: "Tu ilusión aquí",
        num: "Nº 007 · —",
        empty: true,
        draw(canvas) {}
      },
      {
        title: "Tu ilusión aquí",
        num: "Nº 008 · —",
        empty: true,
        draw(canvas) {}
      },
      {
        title: "Tu ilusión aquí",
        num: "Nº 009 · —",
        empty: true,
        draw(canvas) {}
      },
      {
        title: "Tu ilusión aquí",
        num: "Nº 010 · —",
        empty: true,
        draw(canvas) {}
      },
      {
        title: "Tu ilusión aquí",
        num: "Nº 011 · —",
        empty: true,
        draw(canvas) {}
      },
      {
        title: "Tu ilusión aquí",
        num: "Nº 012 · —",
        empty: true,
        draw(canvas) {}
      },
    ]
  },

  // ── SALA III: Espacios vacíos para tus ilusiones ────────
  3: {
    label: "🌟 Sala III · Próximamente...",
    artworks: [
      {
        title: "Tu ilusión aquí",
        num: "Nº 013 · —",
        empty: true,
        draw(canvas) {}
      },
      {
        title: "Tu ilusión aquí",
        num: "Nº 014 · —",
        empty: true,
        draw(canvas) {}
      },
      {
        title: "Tu ilusión aquí",
        num: "Nº 015 · —",
        empty: true,
        draw(canvas) {}
      },
      {
        title: "Tu ilusión aquí",
        num: "Nº 016 · —",
        empty: true,
        draw(canvas) {}
      },
      {
        title: "Tu ilusión aquí",
        num: "Nº 017 · —",
        empty: true,
        draw(canvas) {}
      },
      {
        title: "Tu ilusión aquí",
        num: "Nº 018 · —",
        empty: true,
        draw(canvas) {}
      },
    ]
  }

};