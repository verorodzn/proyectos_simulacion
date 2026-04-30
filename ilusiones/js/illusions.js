// Ilusiones de la Sala 1

const illusionsSala1 = [

  // 1. LÍNEAS HORIZONTALES
  {
    title: "Líneas Horizontales",
    num: "Nº 001",
    draw(canvas) {
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);
      
      ctx.beginPath();
      for (let i = 0; i < H; i += 10) {
        ctx.moveTo(0, i);
        ctx.lineTo(W, i);
      }

      // Diseño de la línea
      ctx.strokeStyle = '#ff7eb3';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  },

  // 2. LÍNEAS VERTICALES
  {
  title: "Líneas Verticales",
  num: "Nº 002",
  draw(canvas) {
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    
    ctx.clearRect(0, 0, W, H);
    ctx.beginPath();
    
    // Usamos W (ancho) para el límite del bucle en verticales
    for (let i = 0; i < W; i += 10) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, H);
    }
    
    // Diseño de la línea
    ctx.strokeStyle = '#2aa2dd';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
},

  // 3. CUADRÍCULA
  {
  title: "Cuadrícula",
  num: "Nº 003",
  draw(canvas) {
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.beginPath();

    // Líneas Horizontales
    for (let i = 0; i < H; i += 10) {
      ctx.moveTo(0, i);
      ctx.lineTo(W, i);
    }

    // Líneas Verticales
    for (let j = 0; j < W; j += 10) {
      ctx.moveTo(j, 0);
      ctx.lineTo(j, H);
    }

    // Diseño de la cuadrícula
    ctx.strokeStyle = '#b47ee7';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
},

// 4. TÚNEL DE PERSPECTIVA VERTICAL
{
  title: "Túnel de Perspectiva Vertical",
  num: "Nº 004",
  draw(canvas) {
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    
    // Calcular punto central del canvas
    const centerX = W / 2;
    const centerY = H / 2;

    // Diseño de las líneas
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    ctx.beginPath();

    // Parámetro para controlar la densidad de líneas (más pequeño = más denso)
    const lineStep = 10; 
    // Líneas que van de arriba hacia el centro
    for (let x = 0; x <= W; x += lineStep) {
      ctx.moveTo(x, 0);
      ctx.lineTo(centerX, centerY);
    }

    // Líneas que van de abajo hacia el centro
    for (let x = 0; x <= W; x += lineStep) {
      ctx.moveTo(x, H);
      ctx.lineTo(centerX, centerY);
    }

    ctx.stroke();
  }
},

// 5. DIAGONALES ASCENDENTES
{
  title: "Diagonales",
  num: "Nº 005",
  draw(canvas) {
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.beginPath();

    const step = 10;
    for (let i = 0; i <= W + H; i += step) {

      ctx.moveTo(W - i, H); 
      ctx.lineTo(W, H - i);
    }

    ctx.strokeStyle = '#8be063';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
},

// 6. ARCO
{
  title: "Efecto Arco",
  num: "Nº 006",
  draw(canvas) {
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    
    ctx.clearRect(0, 0, W, H);
    ctx.beginPath();
    
    for (let i = 0; i < H; i += 10) {
      ctx.moveTo(i, 0);
      ctx.lineTo(W, i);
    }
    
    ctx.strokeStyle = '#2aa2dd';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
},

// 7. FLOR DE HILOS
{
  title: "Flor de Hilos",
  num: "Nº 007",
  draw(canvas) {
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.beginPath();
    const step = 10;

    for (let i = 0; i <= W; i += step) {
      // 1. Esquina Superior Izquierda
      ctx.moveTo(i, 0);
      ctx.lineTo(W, i);

      // 2. Esquina Superior Derecha
      ctx.moveTo(W - i, 0);
      ctx.lineTo(0, i);

      // 3. Esquina Inferior Izquierda
      ctx.moveTo(i, H);
      ctx.lineTo(W, H - i);

      // 4. Esquina Inferior Derecha
      ctx.moveTo(W - i, H);
      ctx.lineTo(0, H - i);
    }

    ctx.strokeStyle = '#ff7eb3';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
},

{
  title: "Túnel de Perspectiva Horizontal",
  num: "Nº 008",
  draw(canvas) {
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    
    // Calcular punto central del canvas
    const centerX = W / 2;
    const centerY = H / 2;

    // Diseño de las líneas
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    ctx.beginPath();

    // Parámetro para controlar la densidad de líneas
    const lineStep = 10; 

    // 1. Líneas que van desde el borde IZQUIERDO hacia el centro
    for (let y = 0; y <= H; y += lineStep) {
      ctx.moveTo(0, y);
      ctx.lineTo(centerX, centerY);
    }

    // 2. Líneas que van desde el borde DERECHO hacia el centro

    for (let y = 0; y <= H; y += lineStep) {
      ctx.moveTo(W, y);
      ctx.lineTo(centerX, centerY);
    }

    ctx.stroke();
  }
},
];