// Referencias al DOM
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let puntos = []; // Array de vértices del polígono (coordenadas x, y)
let actual; // Posición actual del punto que se mueve en cada paso
let intervalo = null; // Referencia al setInterval activo (null si está parado)
let n = 3; // Número de vértices del polígono
let proporcion = 0.5; // Fracción del camino que se avanza hacia el vértice (r)
let velocidad = 50; // Puntos dibujados por tick del intervalo
let iteraciones = 0; // Contador de puntos totales generados
let corriendo = false; // Estado

// Genera los vértices del polígono regular
// Distribuye n puntos en un círculo centrado en el canvas,
// empezando desde la parte superior (−π/2).

function generarVertices() {
  puntos = [];
  const cx = 250,
    cy = 250,
    r = 215; // Centro y radio del polígono
  for (let i = 0; i < n; i++) {
    const ang = (i * 2 * Math.PI) / n - Math.PI / 2;
    puntos.push({ x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) });
  }
}

// Animación visual del dado
// Muestra el número lanzado y añade la clase "flash" brevemente

function flashDado(val) {
  const el = document.getElementById("dado");
  el.textContent = val;
  el.classList.add("flash");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("flash"), 100);
}

// Un paso del Juego del Caos (la función central que se repite en el intervalo):
// 1. Se lanza un dado de 6 caras
// 2. El resultado selecciona un vértice (módulo n, para cubrir cualquier n ≤ 6)
// 3. El punto actual avanza una fracción (proporcion) hacia ese vértice
// 4. Se dibuja un píxel de color en la nueva posición

function paso() {
  const dado = Math.floor(Math.random() * 6) + 1; // 1 a 6

  // Solo actualiza la UI del dado cada 20 iteraciones (evita thrashing del DOM)
  if (iteraciones % 20 === 0) flashDado(dado);

  // Selecciona el vértice correspondiente al resultado del dado
  const indice = (dado - 1) % puntos.length;
  const v = puntos[indice];

  // Mueve el punto actual hacia el vértice elegido
  actual.x += (v.x - actual.x) * proporcion;
  actual.y += (v.y - actual.y) * proporcion;

  // Pinta el punto con un color distinto por vértice
  ctx.fillStyle = `hsl(${200 + indice * 25}, 75%, 68%)`;
  ctx.fillRect(actual.x, actual.y, 1, 1);

  // Incrementa el contador y actualiza la pantalla
  iteraciones++;
  document.getElementById("iter").textContent =
    iteraciones.toLocaleString("es-MX");
}

// Actualiza el indicador de estado Y el texto del botón toggle
// Se llama cada vez que el estado cambia (al iniciar, detener o limpiar).

function setEstado(running) {
  corriendo = running;

  // Actualiza el puntito de estado (verde = corriendo, gris = detenido)
  const dot = document.getElementById("statusDot");
  const txt = document.getElementById("statusText");
  if (running) {
    dot.classList.add("running");
    txt.textContent = "corriendo";
  } else {
    dot.classList.remove("running");
    txt.textContent = "detenido";
  }

  // Actualiza el botón toggle según el nuevo estado:
  // - Si está corriendo → muestra "Detener"
  // - Si está detenido → muestra "Iniciar"
  const btn = document.getElementById("btnToggle");
  btn.textContent = running ? "⏹ Detener" : "▶ Iniciar";
}

// Toggle: alterna entre iniciar y detener
// Esta es la función que llama el botón al hacer clic.
// Revisa la bandera "corriendo" y decide qué hacer:
// - Si está corriendo → llama a detener()
// - Si está detenido  → llama a iniciar()

function toggleIniciar() {
  if (corriendo) {
    detener();
  } else {
    iniciar();
  }
}

// Inicia el bucle de animación
// Crea un setInterval que ejecuta "velocidad" pasos cada 10 ms.
// El guard "if (intervalo) return" evita crear dos intervalos a la vez.

function iniciar() {
  if (intervalo) return;
  intervalo = setInterval(() => {
    for (let i = 0; i < velocidad; i++) paso();
  }, 10);
  setEstado(true);
}

// Detiene el bucle de animación
// clearInterval cancela el setInterval y lo ponemos en null
// para que el guard de iniciar() sepa que ya no hay intervalo activo.

function detener() {
  clearInterval(intervalo);
  intervalo = null;
  setEstado(false);
}

// Limpia el canvas y reinicia el estado

function limpiar() {
  detener();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  iteraciones = 0;
  document.getElementById("iter").textContent = "0";
  document.getElementById("dado").textContent = "–";
  generarVertices();
  // Punto inicial aleatorio dentro del canvas
  actual = { x: Math.random() * 500, y: Math.random() * 500 };
}

// Cambia el número de vértices y reinicia

function cambiarN() {
  n = parseInt(document.getElementById("n").value);
  document.getElementById("valorN").textContent = n;
  limpiar(); // Limpia y regenera con el nuevo n
}

// Actualiza la proporción de avance en tiempo real
function cambiarProporcion() {
  proporcion = parseFloat(document.getElementById("proporcion").value);
  document.getElementById("valorP").textContent = proporcion.toFixed(2);
}

// Cambia la velocidad y actualiza el botón activo
function setVelocidad(v, btn) {
  velocidad = v;
  document
    .querySelectorAll(".seg-btn")
    .forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
}

// Inicialización
// Llama a cambiarN() para generar los vértices y el punto inicial al cargar
cambiarN();
