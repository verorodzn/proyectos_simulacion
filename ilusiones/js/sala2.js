// Ilusiones de la Sala 2

const illusionsSala2 = [
  {
    label: "Sala 2 · Ilusiones Mágicas",
    artworks: [
      // 9. DESTELLO DE BRILLO
      {
        title: "Destello de Brillo",
        num: "Nº 009",
        draw(canvas) {
          const ctx = canvas.getContext("2d");
          const W = canvas.width;
          const H = canvas.height;

          ctx.clearRect(0, 0, W, H);

          const centerX = W / 2;
          const centerY = H / 2;

          ctx.strokeStyle = "#f9d423";
          ctx.lineWidth = 1;
          ctx.beginPath();

          const step = 10;

          for (let i = 0; i <= centerX; i += step) {
            // Cuadrante Superior Derecho
            ctx.moveTo(centerX, centerY - i);
            ctx.lineTo(centerX + (centerX - i), centerY);

            // Cuadrante Superior Izquierdo
            ctx.moveTo(centerX, centerY - i);
            ctx.lineTo(centerX - (centerX - i), centerY);

            // Cuadrante Inferior Derecho
            ctx.moveTo(centerX, centerY + i);
            ctx.lineTo(centerX + (centerX - i), centerY);

            // Cuadrante Inferior Izquierdo
            ctx.moveTo(centerX, centerY + i);
            ctx.lineTo(centerX - (centerX - i), centerY);
          }

          ctx.stroke();
        },
      },

      // 10. ROMBO
      {
        title: "Rombo",
        num: "Nº 010",
        draw(canvas) {
          const ctx = canvas.getContext("2d");
          const W = canvas.width;
          const H = canvas.height;

          ctx.clearRect(0, 0, W, H);

          const centerX = W / 2;
          const centerY = H / 2;

          ctx.strokeStyle = "#b47ee7";
          ctx.lineWidth = 1;
          ctx.beginPath();

          const step = 10;

          for (let size = 0; size <= Math.max(W, H) / 2; size += step) {
            ctx.moveTo(centerX, centerY - size);
            ctx.lineTo(centerX + size, centerY);
            ctx.lineTo(centerX, centerY + size);
            ctx.lineTo(centerX - size, centerY);
            ctx.lineTo(centerX, centerY - size);
          }

          ctx.stroke();
        },
      },

      // 11. MALLA DE LA PERDICIÓN
      {
        title: "Malla de la Perdición",
        num: "Nº 011",
        draw(canvas) {
          const ctx = canvas.getContext("2d");
          const W = canvas.width;
          const H = canvas.height;
          const centerX = W / 2;
          const centerY = H / 2;

          ctx.clearRect(0, 0, W, H);
          ctx.strokeStyle = "#2aa2dd";
          ctx.lineWidth = 1;
          ctx.beginPath();

          // Diagonales principales
          ctx.moveTo(0, 0);
          ctx.lineTo(W, H);
          ctx.moveTo(0, H);
          ctx.lineTo(W, 0);

          const step = 10;
          for (let i = 0; i <= centerX; i += step) {
            // Arriba
            ctx.moveTo(centerX, i);
            ctx.lineTo(i, 0);
            ctx.moveTo(centerX, i);
            ctx.lineTo(W - i, 0);

            // Abajo
            ctx.moveTo(centerX, H - i);
            ctx.lineTo(i, H);
            ctx.moveTo(centerX, H - i);
            ctx.lineTo(W - i, H);
          }

          const totalPasos = centerX / step;
          for (let i = 0; i <= totalPasos; i++) {
            const t = i / totalPasos;

            // Arco izquierdo
            ctx.moveTo(t * centerX, t * centerY);
            ctx.lineTo((1 - t) * centerX, centerY + t * (H - centerY));

            // Arco derecho
            ctx.moveTo(W - t * centerX, t * centerY);
            ctx.lineTo(W - (1 - t) * centerX, centerY + t * (H - centerY));
          }

          ctx.stroke();
        },
      },

      // 12. FLOR CON PÉTALOS CURVOS
      {
        title: "Flor con Pétalos Curvos",
        num: "Nº 012",
        draw(canvas) {
          const ctx = canvas.getContext("2d");
          const W = canvas.width;
          const H = canvas.height;

          ctx.clearRect(0, 0, W, H);
          const centerX = W / 2;
          const centerY = H / 2;

          ctx.strokeStyle = "#ff7eb3";
          ctx.lineWidth = 1;
          ctx.beginPath();

          const step = 10;
          for (let i = 0; i <= centerX; i += step) {
            ctx.moveTo(centerX, i);
            ctx.lineTo(i, 0);
            ctx.moveTo(centerX, i);
            ctx.lineTo(W - i, 0);

            ctx.moveTo(centerX, H - i);
            ctx.lineTo(i, H);
            ctx.moveTo(centerX, H - i);
            ctx.lineTo(W - i, H);

            ctx.moveTo(i, centerY);
            ctx.lineTo(0, i);
            ctx.moveTo(i, centerY);
            ctx.lineTo(0, H - i);

            ctx.moveTo(W - i, centerY);
            ctx.lineTo(W, i);
            ctx.moveTo(W - i, centerY);
            ctx.lineTo(W, H - i);
          }
          ctx.stroke();
        },
      },

      // 13. COMPOSICIÓN DE HILOS
      {
        title: "Composición de Hilos",
        num: "Nº 013",
        draw(canvas) {
          const ctx = canvas.getContext("2d");
          const W = canvas.width;
          const H = canvas.height;

          ctx.clearRect(0, 0, W, H);
          ctx.strokeStyle = "#f9d423";
          ctx.lineWidth = 1;

          function drawStitch(p1, p2, p3, steps) {
            for (let i = 0; i <= steps; i++) {
              const t = i / steps;
              const x1 = p1.x + (p2.x - p1.x) * t;
              const y1 = p1.y + (p2.y - p1.y) * t;
              const x2 = p2.x + (p3.x - p2.x) * t;
              const y2 = p2.y + (p3.y - p2.y) * t;

              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();
            }
          }

          const steps = 14;
          const center = { x: W / 2, y: H * 0.65 };
          const topTip = { x: W / 2, y: 0 };
          const leftTip = { x: 0, y: H };
          const rightTip = { x: W, y: H };

          drawStitch(topTip, center, leftTip, steps);
          drawStitch(leftTip, center, rightTip, steps);
          drawStitch(rightTip, center, topTip, steps);

          drawStitch({ x: 0, y: H * 0.4 }, { x: 0, y: 0 }, { x: W * 0.5, y: 0 }, steps);
          drawStitch({ x: W * 0.5, y: 0 }, { x: W, y: 0 }, { x: W, y: H * 0.4 }, steps);

          const bottomMid = { x: W / 2, y: H };
          drawStitch({ x: W * 0.3, y: H }, bottomMid, { x: W / 2, y: H * 0.75 }, 12);
          drawStitch({ x: W * 0.7, y: H }, bottomMid, { x: W / 2, y: H * 0.75 }, 12);
        },
      },

      // 14. CUADRADOS CONCÉNTRICOS
      {
        title: "Cuadros Concéntricos",
        num: "Nº 014",
        draw(canvas) {
          const ctx = canvas.getContext("2d");
          const W = canvas.width;
          const H = canvas.height;
          const centerX = W / 2;
          const centerY = H / 2;

          ctx.clearRect(0, 0, W, H);
          ctx.strokeStyle = "#ff9a3d";
          ctx.lineWidth = 1;

          let currentSide = Math.min(W, H) - 20;
          const spacing = 6;

          while (currentSide > 0) {
            const x = centerX - currentSide / 2;
            const y = centerY - currentSide / 2;
            ctx.strokeRect(x, y, currentSide, currentSide);
            currentSide -= 2 * spacing;
          }
        },
      },

      // 15. TRIÁNGULOS CONCÉNTRICOS
      {
        title: "Triángulos Concéntricos",
        num: "Nº 015",
        draw(canvas) {
          const ctx = canvas.getContext("2d");
          const W = canvas.width;
          const H = canvas.height;

          ctx.clearRect(0, 0, W, H);
          ctx.strokeStyle = "#8be063";
          ctx.lineWidth = 1;

          const margin = 20;
          const topV_init = { x: W / 2, y: margin };
          const leftV_init = { x: margin, y: H - margin };
          const rightV_init = { x: W - margin, y: H - margin };

          const targetY = margin + (H - 2 * margin) * 0.55;
          const targetV = { x: W / 2, y: targetY };

          const N = 15;

          for (let i = 0; i <= N; i++) {
            const t = i / N;
            const newTopY = topV_init.y + t * (targetV.y - topV_init.y);
            const newBottomY = leftV_init.y + t * (targetV.y - leftV_init.y);
            const newLeftX = leftV_init.x + t * (targetV.x - leftV_init.x);
            const newRightX = rightV_init.x + t * (targetV.x - rightV_init.x);

            ctx.beginPath();
            ctx.moveTo(W / 2, newTopY);
            ctx.lineTo(newLeftX, newBottomY);
            ctx.lineTo(newRightX, newBottomY);
            ctx.closePath();
            ctx.stroke();
          }
        },
      },

      // 16. CÍRCULOS
      {
        title: "Círculos Concéntricos",
        num: "Nº 016",
        draw(canvas) {
          const ctx = canvas.getContext("2d");
          const W = canvas.width;
          const H = canvas.height;
          const centerX = W / 2;
          const centerY = H / 2;

          ctx.clearRect(0, 0, W, H);
          ctx.strokeStyle = "#2aa2dd";
          ctx.lineWidth = 1;

          let radius = Math.min(W, H) / 2;
          const step = 4;

          while (radius > 0) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
            radius -= step;
          }
        },
      }
    ]
  }
];