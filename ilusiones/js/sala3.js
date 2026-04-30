// Ilusiones de la Sala 3

const illusionsSala3 = [

  // 17. ESPIRAL CUADRADA
  {
    title: "Espiral Cuadrada",
    num: "Nº 017",
    draw(canvas) {
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "#f9d423";
      ctx.lineWidth = 1;

      let x = W / 2, y = H / 2;
      const step = 4;
      let len = 4;
      let dir = 0;
      const dx = [1, 0, -1, 0];
      const dy = [0, 1, 0, -1];

      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let seg = 0; seg < 80; seg++) {
        for (let rep = 0; rep < 2; rep++) {
          for (let i = 0; i < len; i++) {
            x += dx[dir] * step;
            y += dy[dir] * step;
            ctx.lineTo(x, y);
          }
          dir = (dir + 1) % 4;
        }
        len += 4;
      }

      ctx.stroke();
    },
  },

  // 18. TELARAÑA
  {
    title: "Telaraña",
    num: "Nº 018",
    draw(canvas) {
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const spokes = 12;
      const rings = 10;

      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "#ff7eb3";
      ctx.lineWidth = 1;
      ctx.beginPath();

      // Radios
      for (let s = 0; s < spokes; s++) {
        const a = s * Math.PI * 2 / spokes;
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * cx, cy + Math.sin(a) * cy);
      }

      // Anillos
      for (let r = 1; r <= rings; r++) {
        const rad = r * (Math.min(W, H) / 2) / rings;
        ctx.moveTo(cx + rad, cy);
        for (let s = 0; s <= spokes; s++) {
          const a = s * Math.PI * 2 / spokes;
          ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
        }
      }

      ctx.stroke();
    },
  },

  // 19. OLAS DE MOIRÉ
  {
    title: "Olas de Moiré",
    num: "Nº 019",
    draw(canvas) {
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "#6ecfff";
      ctx.lineWidth = 1;

      const step = 8;
      ctx.beginPath();

      for (let y = 0; y < H; y += step) {
        ctx.moveTo(0, y);
        for (let x = 0; x < W; x += 2) {
          const wave = Math.sin(x * 0.05) * 20 + Math.sin(x * 0.03 + y * 0.04) * 10;
          ctx.lineTo(x, y + wave);
        }
      }

      ctx.stroke();
    },
  },

  // 20. PANAL INFINITO
{
  title: "Panal Infinito",
  num: "Nº 020",
  draw(canvas) {
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = "#a8e063";
    ctx.lineWidth = 1;
    ctx.beginPath();

    function hexagon(x, y, r) {
      for (let k = 0; k < 6; k++) {
        const a = k * Math.PI / 3 - Math.PI / 6;
        const nx = x + Math.cos(a) * r;
        const ny = y + Math.sin(a) * r;
        k === 0 ? ctx.moveTo(nx, ny) : ctx.lineTo(nx, ny);
      }
      ctx.closePath();
    }

    const baseR = 12;
    const colStep = baseR * Math.sqrt(3);
    const rowStep = baseR * 1.5;

    for (let row = -8; row <= 8; row++) {
      for (let col = -8; col <= 8; col++) {
        const x = cx + col * colStep + (row % 2) * colStep / 2;
        const y = cy + row * rowStep;
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        const scale = 1 - dist / (Math.max(W, H) * 0.72);
        if (scale > 0.08) {
          hexagon(x, y, baseR * scale);
        }
      }
    }

    ctx.stroke();
  },
},

  // 21. CUADRÍCULA CÓNCAVA
  {
    title: "Cuadrícula Cóncava",
    num: "Nº 021",
    draw(canvas) {
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const N = 10;

      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "#c9a0f0";
      ctx.lineWidth = 1;
      ctx.beginPath();

      // Líneas horizontales deformadas
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        for (let j = 0; j <= N; j++) {
          const s = j / N;
          const bx = (t - 0.5) * W;
          const by = (s - 0.5) * H;
          const dist = Math.sqrt(bx * bx + by * by) / (Math.sqrt(2) * W / 2);
          const pull = 1 - dist * 0.45;
          const x = cx + bx * pull;
          const y = cy + by * pull;
          j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
      }

      // Líneas verticales deformadas
      for (let j = 0; j <= N; j++) {
        const s = j / N;
        for (let i = 0; i <= N; i++) {
          const t = i / N;
          const bx = (t - 0.5) * W;
          const by = (s - 0.5) * H;
          const dist = Math.sqrt(bx * bx + by * by) / (Math.sqrt(2) * W / 2);
          const pull = 1 - dist * 0.45;
          const x = cx + bx * pull;
          const y = cy + by * pull;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    },
  },

  // 22. ESTRELLA INFINITA
  {
    title: "Estrella Infinita",
    num: "Nº 022",
    draw(canvas) {
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;

      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "#f9d423";
      ctx.lineWidth = 1;

      for (let r = 5; r < cx; r += 8) {
        ctx.beginPath();
        for (let k = 0; k <= 12; k++) {
          const a = k * Math.PI * 2 / 6;
          const rr = k % 2 === 0 ? r : r * 0.5;
          k === 0
            ? ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr)
            : ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
        }
        ctx.closePath();
        ctx.stroke();
      }
    },
  },

  // 23. VÓRTICE
  {
    title: "Vórtice",
    num: "Nº 023",
    draw(canvas) {
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const N = 36;

      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "#ff9a3d";
      ctx.lineWidth = 1;

      for (let i = 0; i < N; i++) {
        const a0 = i * Math.PI * 2 / N;
        const a1 = a0 + Math.PI + 0.4;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a0) * cx * 0.95, cy + Math.sin(a0) * cy * 0.95);
        ctx.lineTo(cx + Math.cos(a1) * 3, cy + Math.sin(a1) * 3);
        ctx.stroke();
      }
    },
  },

  // 24. LABERINTO RADIAL
  {
    title: "Laberinto Radial",
    num: "Nº 024",
    draw(canvas) {
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const rings = 9;
      const spokes = 16;
      const maxR = Math.min(W, H) / 2;

      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "#8be063";
      ctx.lineWidth = 1;
      ctx.beginPath();

      // Arcos con huecos alternados
      for (let r = 1; r <= rings; r++) {
        const rad = r * maxR / rings;
        const skip = r % 2 === 0 ? [2, 9] : [5, 12];
        for (let s = 0; s < spokes; s++) {
          if (skip.includes(s)) continue;
          const a0 = s * Math.PI * 2 / spokes;
          const a1 = (s + 1) * Math.PI * 2 / spokes;
          ctx.moveTo(cx + Math.cos(a0) * rad, cy + Math.sin(a0) * rad);
          ctx.arc(cx, cy, rad, a0, a1);
        }
      }

      // Radios con huecos alternados
      for (let s = 0; s < spokes; s++) {
        const a = s * Math.PI * 2 / spokes;
        const skip = s % 3 === 0 ? [3, 6] : [1, 4, 7];
        for (let r = 1; r <= rings; r++) {
          if (skip.includes(r)) continue;
          const r0 = (r - 1) * maxR / rings;
          const r1 = r * maxR / rings;
          ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
          ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
        }
      }

      ctx.stroke();
    },
  },

];