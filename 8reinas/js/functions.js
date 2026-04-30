/* 1. ESTADO DEL JUEGO
   queens[] es el corazón del juego.
   queens[fila] = columna donde está la reina, ó -1 si no hay ninguna.
   Solo puede haber una reina por fila.
*/

const SIZE = 8;

// Array de 8 posiciones. Empieza con todas vacías (-1).
let queens = Array(SIZE).fill(-1);


/* 2. CONSTRUCCIÓN DEL TABLERO (DOM)
    - Etiquetas de columna (a–h)
    - 8 filas, cada una con su etiqueta numérica y 8 celdas
    Cada celda recibe su posición (data-row, data-col) y su color base.
 */
function buildBoard() {
  const boardEl     = document.getElementById('board');
  const colLabelsEl = document.getElementById('colLabels');

  boardEl.innerHTML     = '';
  colLabelsEl.innerHTML = '';

  // Espacio vacío para alinear etiquetas de columna con las celdas
  const spacer = document.createElement('span');
  spacer.style.width = '30px';
  colLabelsEl.appendChild(spacer);

  // Letras de columna: a b c d e f g h
  const letters = ['a','b','c','d','e','f','g','h'];
  letters.forEach(letter => {
    const span = document.createElement('span');
    span.textContent = letter;
    colLabelsEl.appendChild(span);
  });

  // Crear filas y celdas
  for (let row = 0; row < SIZE; row++) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('board-row');

    // Etiqueta de fila: 8 arriba, 1 abajo
    const rowLabel = document.createElement('div');
    rowLabel.classList.add('row-label');
    rowLabel.textContent = SIZE - row;
    rowDiv.appendChild(rowLabel);

    // 8 celdas por fila
    for (let col = 0; col < SIZE; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;

      // Color ajedrezado: si (fila + columna) es par = clara, si no = oscura
      setCellBaseColor(cell, row, col);

      // Evento de clic
      cell.addEventListener('click', () => handleCellClick(row, col));

      // Hover preview: muestra celdas atacadas al pasar el mouse
      cell.addEventListener('mouseenter', () => showHoverPreview(row, col));
      cell.addEventListener('mouseleave', () => clearHoverPreview());

      rowDiv.appendChild(cell);
    }

    boardEl.appendChild(rowDiv);
  }
}

// Asigna el color base (ajedrezado) a una celda

function setCellBaseColor(cell, row, col) {
  cell.style.backgroundColor = (row + col) % 2 === 0
    ? 'var(--cell-light)'
    : 'var(--cell-dark)';
}

// Devuelve el elemento DOM de la celda en (fila, columna).

function getCell(row, col) {
  return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}


/* 3. LÓGICA DE ATAQUES
   Una reina amenaza toda su fila, columna y ambas diagonales.
*/

function isAttackedBy(r, c, qr, qc) {
  return (
    qr === r ||
    qc === c ||
    Math.abs(qr - r) === Math.abs(qc - c)
  );
}

function computeAttackMap() {
  // Inicializar toda la matriz en false
  const map = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));

  queens.forEach((col, row) => {
    if (col === -1) return; // no hay reina en esta fila, saltar

    // Marcar toda la fila de la reina
    for (let c = 0; c < SIZE; c++) {
      if (c !== col) map[row][c] = true;
    }

    // Marcar toda la columna de la reina
    for (let r = 0; r < SIZE; r++) {
      if (r !== row) map[r][col] = true;
    }

    // Marcar las 4 diagonales
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (r === row && c === col) continue;
        if (Math.abs(r - row) === Math.abs(c - col)) {
          map[r][c] = true;
        }
      }
    }
  });

  return map;
}


/* HOVER PREVIEW
   Al pasar el cursor sobre una celda libre, calcula y resalta
   las celdas que SERÍAN atacadas si se colocara una reina ahí.
   Al salir, limpia el resaltado.
   No afecta celdas que ya tienen reina ni celdas bloqueadas.
*/

function showHoverPreview(row, col) {
  const cell = getCell(row, col);

  // No mostrar preview si la celda tiene reina o está bloqueada
  if (cell.classList.contains('queen') || cell.classList.contains('blocked')) return;

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (r === row && c === col) continue; // la celda del cursor, no marcar
      if (isAttackedBy(r, c, row, col)) {
        const target = getCell(r, c);
        // Solo marcar celdas que no tienen reina (no tapar el emoji)
        if (!target.classList.contains('queen')) {
          target.classList.add('hovered-attack');
        }
      }
    }
  }
}

// Elimina todas las marcas de hover-preview del tablero.
function clearHoverPreview() {
  document.querySelectorAll('.cell.hovered-attack')
    .forEach(c => c.classList.remove('hovered-attack'));
}


// 4. RENDERIZADO DEL TABLERO

function renderBoard() {
  clearHoverPreview();
  const attackMap = computeAttackMap();

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const cell       = getCell(row, col);
      const hasQueen   = queens[row] === col;
      const isAttacked = attackMap[row][col];

      // Limpiar estado previo antes de aplicar el nuevo
      cell.classList.remove('queen', 'attacked', 'blocked');
      // Restaurar color base
      setCellBaseColor(cell, row, col);

      if (hasQueen) {
        // Reina: fondo verde
        cell.classList.add('queen');
      } else if (isAttacked) {
        // Atacada y sin reina: roja + bloqueada
        cell.classList.add('attacked', 'blocked');
      }
      // else: celda libre
    }
  }

  // Actualizar UI adicional
  updateCounter();
  checkWin();
}


// 5. INTERACCIÓN (CLIC)

function handleCellClick(row, col) {
  const cell = getCell(row, col);

  if (cell.classList.contains('queen')) {
    // Caso a: quitar la reina
    queens[row] = -1;

  } else if (cell.classList.contains('blocked')) {
    // Caso b: celda bloqueada = no hacer nada
    return;

  } else {
    // Caso c: colocar reina
    // Contar cuántas reinas hay actualmente
    const count = queens.filter(c => c !== -1).length;

    // Si ya hay una reina en ESTA fila (en otra columna), la reemplazamos
    // Si ya hay 8 reinas y esta fila está vacía, no caben más
    if (count >= SIZE && queens[row] === -1) return;

    queens[row] = col;
  }

  renderBoard();
}


// 6. CONTADOR Y BARRA DE PROGRESO

function updateCounter() {
  const count = queens.filter(c => c !== -1).length;

  document.getElementById('queenCount').textContent = count;

  // Barra de progreso: ancho = (count / 8) * 100%
  document.getElementById('progressBar').style.width = `${(count / SIZE) * 100}%`;
}


/* 7. DETECCIÓN DE VICTORIA
   Condición: 8 reinas colocadas y ningún par se ataca.
*/

function checkWin() {
  const placedQueens = queens
    .map((col, row) => ({ row, col }))
    .filter(q => q.col !== -1); // solo las filas con reina

  // Necesitamos 8 reinas
  if (placedQueens.length < SIZE) {
    hideWin();
    return;
  }

  // Verificar que ningún par de reinas se ataque entre sí
  const isValid = placedQueens.every((q1, i) =>
    placedQueens.every((q2, j) => {
      if (i === j) return true; // la misma reina no se ataca a sí misma
      // Dos reinas distintas no deben compartir fila, columna ni diagonal
      return !isAttackedBy(q1.row, q1.col, q2.row, q2.col);
    })
  );

  if (isValid) showWin();
  else         hideWin();
}

function showWin() {
  document.getElementById('winMsg').classList.add('show');
}

function hideWin() {
  document.getElementById('winMsg').classList.remove('show');
}


/* 8. TEMAS VISUALES
   Cambia la clase del <body>; las variables CSS del tema
   se activan automáticamente
*/

function setTheme(theme, btn) {
  // Cambiar clase del body para activar variables CSS del tema
  document.body.className = theme;

  // Marcar el botón activo
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Volver a pintar el tablero con los colores del nuevo tema
  renderBoard();
}


/* 9. SOLUCIONES PREDEFINIDAS
   Cada solución es un array de 8 números.
*/

// Aplica una solución al tablero con animación escalonada:

function applySolution(solution) {
  // Primero limpiar el tablero
  queens = Array(SIZE).fill(-1);
  renderBoard();

  // Colocar las reunas
  solution.forEach((col, row) => {
    setTimeout(() => {
      queens[row] = col;
      renderBoard();
    }, row * 130);
  });
}


// 10. REINICIO

function resetBoard() {
  queens = Array(SIZE).fill(-1);
  renderBoard();
}


/* 11. INICIALIZACIÓN
   Se ejecuta cuando el script carga por primera vez. Construye el tablero
   y pinta el estado inicial (todo libre).
*/
buildBoard();   // Construir las celdas en el DOM
renderBoard();  // Pintar el tablero inicial (todo libre)