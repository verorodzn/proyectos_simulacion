// Lógica de renderizado y navegación entre salas

const CANVAS_SIZE = 210;

const FRAME_COLORS       = ['#f4a800','#ff7eb3','#6ecfff','#a8e063','#ffb347','#c9a0f0'];
const FRAME_COLORS_EMPTY = ['#ffe8b0','#ffc8dc','#b8e8ff','#c8f0a0','#ffd8a0','#e0c8ff'];

let currentRoom = 1;

// Construye una tarjeta de obra 
function buildArtwork(artwork, index) {
  const wrapper = document.createElement('div');
  wrapper.className = 'artwork-wrapper';

  // Colgador
  const hanger = document.createElement('div');
  hanger.className = 'hanger';
  hanger.innerHTML = '<div class="nail-head"></div><div class="wire"></div>';

  // Marco
  const frame = document.createElement('div');
  frame.className = 'frame';

  if (artwork.empty) {
    // Marco vacío: color pastel
    frame.style.background = FRAME_COLORS_EMPTY[index % FRAME_COLORS_EMPTY.length];

    const inner = document.createElement('div');
    inner.className = 'frame-inner empty';
    inner.innerHTML = '<span class="empty-label">Próximamente</span>';
    frame.appendChild(inner);

  } else {
    // Marco con ilusión: color vivo
    frame.style.background = FRAME_COLORS[index % FRAME_COLORS.length];

    const inner = document.createElement('div');
    inner.className = 'frame-inner';

    const canvas = document.createElement('canvas');
    canvas.width  = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    inner.appendChild(canvas);
    frame.appendChild(inner);

    // Dibujar la ilusión
    artwork.draw(canvas);
  }

  // Placa
  const plaque = document.createElement('div');
  plaque.className = 'plaque';
  plaque.innerHTML = `
    <div class="plaque-title">${artwork.title}</div>
    <div class="plaque-num">${artwork.num}</div>
  `;

  wrapper.appendChild(hanger);
  wrapper.appendChild(frame);
  wrapper.appendChild(plaque);

  return wrapper;
}

// Renderiza la sala activa
function renderRoom(roomNumber) {
  const grid  = document.getElementById('grid');
  const label = document.getElementById('room-label');
  const room  = rooms[roomNumber];

  // Limpiar grid y reanimar
  grid.innerHTML = '';
  grid.style.animation = 'none';
  grid.offsetHeight; // reflow
  grid.style.animation = '';

  // Actualizar etiqueta del header
  label.textContent = room.label;

  // Insertar obras
  room.artworks.forEach((artwork, i) => {
    grid.appendChild(buildArtwork(artwork, i));
  });
}

// Cambia de sala y actualiza botones
function changeRoom(roomNumber) {
  if (roomNumber === currentRoom) return;
  currentRoom = roomNumber;

  // Actualizar estado visual de los botones
  document.querySelectorAll('.room-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i + 1 === roomNumber);
  });

  renderRoom(roomNumber);
}

// Iniciar con la sala 1
renderRoom(1);