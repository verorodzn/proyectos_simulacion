/* ----------------------------------------------------------------
   1. ESTADO DEL JUEGO
   queens[] es el corazón del juego.
   queens[fila] = columna donde está la reina, ó -1 si no hay ninguna.
   Solo puede haber una reina por fila (restricción del puzzle).
---------------------------------------------------------------- */
const SIZE = 8;

// Array de 8 posiciones. Inicialmente todas vacías (-1).
let queens = Array(SIZE).fill(-1);


/* ----------------------------------------------------------------
   2. CONSTRUCCIÓN DEL TABLERO (DOM)
   En lugar de escribir 64 <div> a mano en el HTML,
   los generamos dinámicamente desde JS.
---------------------------------------------------------------- */

/**
 * Construye el tablero en el DOM:
 *  - Etiquetas de columna (a–h)
 *  - 8 filas, cada una con su etiqueta numérica y 8 celdas
 * Cada celda recibe su posición (data-row, data-col) y su color base.
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

    // Etiqueta de fila: 8 arriba, 1 abajo (como en ajedrez)
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

      // Color ajedrezado: si (fila + columna) es par → clara, si no → oscura
      setCellBaseColor(cell, row, col);

      // Evento de clic
      cell.addEventListener('click', () => handleCellClick(row, col));

      // Hover preview: muestra celdas atacadas al pasar el cursor
      cell.addEventListener('mouseenter', () => showHoverPreview(row, col));
      cell.addEventListener('mouseleave', () => clearHoverPreview());

      rowDiv.appendChild(cell);
    }

    boardEl.appendChild(rowDiv);
  }
}

/**
 * Asigna el color base (ajedrezado) a una celda.
 * Se llama al construir y al cambiar de tema.
 */
function setCellBaseColor(cell, row, col) {
  cell.style.backgroundColor = (row + col) % 2 === 0
    ? 'var(--cell-light)'
    : 'var(--cell-dark)';
}

/**
 * Devuelve el elemento DOM de la celda en (fila, columna).
 */
function getCell(row, col) {
  return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}


/* ----------------------------------------------------------------
   3. LÓGICA DE ATAQUES
   Una reina amenaza toda su fila, columna y ambas diagonales.
---------------------------------------------------------------- */

/**
 * Devuelve true si la celda (r, c) es atacada por la reina en (qr, qc).
 * Tres condiciones: misma fila, misma columna, misma diagonal.
 */
function isAttackedBy(r, c, qr, qc) {
  return (
    qr === r ||                                    // misma fila
    qc === c ||                                    // misma columna
    Math.abs(qr - r) === Math.abs(qc - c)         // misma diagonal
  );
}

/**
 * Construye una matriz 8×8 de booleanos.
 * attackMap[fila][col] = true  →  esa celda es atacada por alguna reina.
 * Las celdas con reina NO se marcan (la reina "protege" su propio casillero
 * visualmente, mostrando el emoji en lugar del indicador de ataque).
 */
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
        if (r === row && c === col) continue;       // la celda de la reina misma
        if (Math.abs(r - row) === Math.abs(c - col)) {
          map[r][c] = true;
        }
      }
    }
  });

  return map;
}


/* ----------------------------------------------------------------
   4b. HOVER PREVIEW
   Al pasar el cursor sobre una celda libre, calcula y resalta
   con parpadeo naranja las celdas que SERÍAN atacadas si se
   colocara una reina ahí. Al salir, limpia el resaltado.
   No afecta celdas que ya tienen reina ni celdas bloqueadas.
---------------------------------------------------------------- */

/**
 * Marca con .hovered-attack todas las celdas que una reina hipotética
 * en (row, col) atacaría. Solo actúa si la celda está libre.
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

/**
 * Elimina todas las marcas de hover-preview del tablero.
 */
function clearHoverPreview() {
  document.querySelectorAll('.cell.hovered-attack')
    .forEach(c => c.classList.remove('hovered-attack'));
}


/* ----------------------------------------------------------------
   4. RENDERIZADO DEL TABLERO
---------------------------------------------------------------- */

/**
 * Lee queens[] y el mapa de ataques, actualiza el DOM.
 * Limpia también el hover-preview para que no quede "pegado".
 */
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
      // Restaurar color base (se pisa si se aplica .queen, .attacked, etc.)
      setCellBaseColor(cell, row, col);

      if (hasQueen) {
        // Reina: fondo verde definido en CSS
        cell.classList.add('queen');
      } else if (isAttacked) {
        // Atacada y sin reina: roja + bloqueada
        cell.classList.add('attacked', 'blocked');
      }
      // else: celda libre → sin clase extra, solo color ajedrezado
    }
  }

  // Actualizar UI adicional
  updateCounter();
  checkWin();
}


/* ----------------------------------------------------------------
   5. INTERACCIÓN (CLIC)
---------------------------------------------------------------- */

/**
 * Maneja el clic del usuario en la celda (row, col).
 *
 * Casos posibles:
 *   a) La celda tiene reina  → quitarla.
 *   b) La celda está bloqueada → ignorar (no se puede colocar).
 *   c) Celda libre, menos de 8 reinas → colocar reina en esta fila.
 *
 * Regla clave: solo una reina por fila.
 * Si la fila ya tiene reina en otra columna, se reemplaza.
 */
function handleCellClick(row, col) {
  const cell = getCell(row, col);

  if (cell.classList.contains('queen')) {
    // Caso a: quitar la reina
    queens[row] = -1;

  } else if (cell.classList.contains('blocked')) {
    // Caso b: celda bloqueada → no hacer nada
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


/* ----------------------------------------------------------------
   6. CONTADOR Y BARRA DE PROGRESO
---------------------------------------------------------------- */

/**
 * Actualiza el número visible de reinas y la barra de progreso.
 */
function updateCounter() {
  const count = queens.filter(c => c !== -1).length;

  document.getElementById('queenCount').textContent = count;

  // Barra de progreso: ancho = (count / 8) * 100%
  document.getElementById('progressBar').style.width = `${(count / SIZE) * 100}%`;
}


/* ----------------------------------------------------------------
   7. DETECCIÓN DE VICTORIA
   Condición: exactamente 8 reinas colocadas y ningún par se ataca.
---------------------------------------------------------------- */

/**
 * Verifica si la posición actual es una solución válida.
 * Si lo es, muestra el mensaje de victoria; si no, lo oculta.
 */
function checkWin() {
  const placedQueens = queens
    .map((col, row) => ({ row, col }))
    .filter(q => q.col !== -1); // solo las filas con reina

  // Necesitamos exactamente 8 reinas
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


/* ----------------------------------------------------------------
   8. TEMAS VISUALES
   Cambia la clase del <body>; las variables CSS del tema
   se activan automáticamente (ver :root y body.bee / body.mouse / etc.)
---------------------------------------------------------------- */

/**
 * Activa un tema visual y re-renderiza el tablero.
 * @param {string} theme  - 'bee' | 'sweet' | 'cloud'
 * @param {HTMLElement} btn - el botón clickeado (para marcar .active)
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


/* ----------------------------------------------------------------
   9. SOLUCIONES PREDEFINIDAS
   Cada solución es un array de 8 números:
     solution[fila] = columna donde va la reina de esa fila.

   Ejemplo: [0, 4, 7, 5, 2, 6, 1, 3] significa:
     Fila 0 → col 0
     Fila 1 → col 4
     Fila 2 → col 7
     ...y así sucesivamente.
---------------------------------------------------------------- */

/**
 * Aplica una solución al tablero con animación escalonada:
 * las reinas aparecen de una en una con 120ms de separación.
 * @param {number[]} solution - array de columnas (una por fila)
 */
function applySolution(solution) {
  // Primero limpiar el tablero
  queens = Array(SIZE).fill(-1);
  renderBoard();

  // Colocar cada reina con un pequeño delay escalonado
  solution.forEach((col, row) => {
    setTimeout(() => {
      queens[row] = col;
      renderBoard();
    }, row * 130); // 130ms entre cada reina → animación fluida
  });
}


/* ----------------------------------------------------------------
  10. REINICIO
---------------------------------------------------------------- */

/**
 * Limpia completamente el tablero: quita todas las reinas.
 */
function resetBoard() {
  queens = Array(SIZE).fill(-1);
  renderBoard();
}


/* ----------------------------------------------------------------
  11. INICIALIZACIÓN
  Se ejecuta cuando el script carga (el HTML ya está parseado
  porque el <script> está al final del <body>).
---------------------------------------------------------------- */
buildBoard();   // Construir las celdas en el DOM
renderBoard();  // Pintar el tablero inicial (todo libre)