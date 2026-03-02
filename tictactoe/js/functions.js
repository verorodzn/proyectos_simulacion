let player1Avatar = null; // ID del ingrediente elegido por J1 (ej: 'carrot'). Null = no eligió.
let player1Emoji = "";    // El emoji de J1 que aparece en el tablero (ej: '🥕').

let player2Avatar = null;
let player2Emoji = "";
// IMPORTANTE: en modo 1 jugador este emoji nunca se muestra en pantalla,
// solo se usa para que el algoritmo pueda simular los movimientos de la IA.

let p1Wins = 0; // Contador de puntos del Jugador 1
let p2Wins = 0;

let selectedTime = null; // Duración elegida en segundos (0 = sin límite, null = no eligió).
let gameMode = null; // Modo de juego: 'one_player' o 'two_players'. Null = no eligió.
let turn = true; // Turno actual: true = J1, false = J2 o IA.

let timerInterval = null; // Guarda el ID del setInterval para poder detenerlo con clearInterval().
let timeRemaining = 0; // Segundos que quedan en la ronda actual.

let iaThinking = false; // Semáforo: true mientras la IA calcula su movimiento.
                        // Evita que el usuario haga clic antes de que la IA termine.

// Cargamos el sonido de selección una sola vez al inicio para no crearlo en cada clic.
const selectSound = new Audio('audio/click.mp3');

/* 
    * playSelectSound()
    * Reproduce el sonido de selección cuando el jugador elige un ingrediente o un modo.
*/

function playSelectSound() {
    selectSound.currentTime = 0; // Reinicia el audio por si se hace clic rápido
    selectSound.volume = 0.8;
    selectSound.play().catch(error => console.log("Error de audio:", error)); // Si el navegador bloquea la reproducción automática, atrapamos el error para evitar que rompa el juego.
}


/* ==========================================================================
    CONFIGURACIÓN
   ========================================================================== */

/*
 * setGameMode(mode, element)
 * Se llama cuando el jugador elige "1 Chefcito" o "2 Chefcitos".
 *
 * Parámetros:
 *   mode    → el string 'one_player' o 'two_players'
 *   element → el botón que se hizo clic (para ponerle el estilo de seleccionado)
 *
 * Qué hace:
 *   1. Guarda el modo elegido en la variable global gameMode.
 *   2. Marca visualmente el botón seleccionado.
 *   3. Resetea completamente el estado de ambos jugadores para que cambiar
 *      de modo nunca deje datos "sucios" del modo anterior.
 *   4. Muestra 🤖 para J2 si es 1 jugador, o ? si son 2 jugadores.
 *   5. Actualiza el texto de instrucción y revisa si ya se puede jugar.
 */

function setGameMode(mode, element) {
    playSelectSound();
    gameMode = mode;

    // Quitamos el estilo "seleccionado" de todos los botones de modo
    // y se lo ponemos solo al que se acaba de hacer clic.
    document.querySelectorAll('.mode_selection button').forEach(btn => btn.classList.remove('selected_mode'));
    element.classList.add('selected_mode');

    // Reseteo completo: borramos avatares, emojis y estilos de ambos jugadores.
    // Esto es importante para que cambiar de modo no cause bugs.
    player1Avatar = null;
    player1Emoji = "";
    player2Avatar = null;
    player2Emoji = "";
    document.getElementById("p1_avatar").innerText = "?";
    document.getElementById("p2_avatar").innerText = mode === 'one_player' ? "🤖" : "?";

    // Quitamos estilos de ingredientes seleccionados y los volvemos a activar todos.
    document.querySelectorAll('.select_btn').forEach(btn => {
        btn.classList.remove('selected_player1', 'selected_player2');
        btn.style.opacity = "1";
        btn.style.pointerEvents = "auto";
    });

    // Actualizamos la instrucción del h4 para guiar al jugador al siguiente paso.
    const instruccion = document.querySelector(".options_page h4.subtitle");
    if (instruccion) instruccion.innerText = "Jugador 1: Elige tu ingrediente";

    checkReadyToPlay();
}

/*
 * checkReadyToPlay()
 * Revisa si ya se cumplieron TODAS las condiciones para poder jugar:
 *   - Modo elegido
 *   - J1 eligió ingrediente
 *   - J2 eligió ingrediente (o es la IA)
 *   - Duración elegida
 *
 * Si todo está listo → muestra el botón "¡A Cocinar!" y cambia el h4.
 * Si falta algo      → oculta el botón y actualiza el h4 con la instrucción correcta.
 *
 */

function checkReadyToPlay() {
    const instruccion = document.querySelector(".options_page h4.subtitle");

    const todoListo = player1Avatar !== null
                   && player2Avatar !== null
                   && selectedTime !== null
                   && gameMode !== null;

    if (todoListo) {
        document.getElementById("btn_jugar").style.display = "block";
        if (instruccion) instruccion.innerText = "¡Todo listo para cocinar! 🍲";
    } else {
        document.getElementById("btn_jugar").style.display = "none";

        // Mostramos la instrucción del paso que falta según el estado actual.
        if (instruccion) {
            if (gameMode === null) {
                instruccion.innerText = "Elige Modo de Juego";
            } else if (player1Avatar === null) {
                instruccion.innerText = "Jugador 1: Elige tu ingrediente";
            } else if (player2Avatar === null && gameMode === 'two_players') {
                instruccion.innerText = "Jugador 2: Elige tu ingrediente";
            } else if (selectedTime === null) {
                instruccion.innerText = "Ahora elige la duración";
            }
        }
    }
}

/*
 * setTimer(seconds, element)
 * Se llama cuando el jugador elige la duración de la ronda.
 *
 * Parámetros:
 *   seconds → duración en segundos (0 significa "sin límite")
 *   element → el botón que se hizo clic
 *
 * Qué hace:
 *   1. Guarda los segundos en selectedTime.
 *   2. Marca el botón elegido.
 *   3. Actualiza el reloj de la pantalla de juego.
 *   4. Llama a checkReadyToPlay para ver si ya se puede jugar.
 */

function setTimer(seconds, element) {
    playSelectSound();
    selectedTime = seconds;

    // Solo un botón de timer puede estar seleccionado a la vez.
    document.querySelectorAll('.timer_selection button').forEach(btn => btn.classList.remove('selected_timer'));
    element.classList.add('selected_timer');

    // Calculamos minutos y actualizamos el reloj visible en pantalla.
    const mins = Math.floor(seconds / 60);
    const display = document.getElementById("display_time_game");
    if (display) {
        display.innerText = (seconds === 0) ? "Sin Límite" : mins + ":00";
    }

    checkReadyToPlay();
}

/*
 * setAvatar(avatarClass, element)
 * Se llama cuando el jugador hace clic en un ingrediente.
 *
 * Parámetros:
 *   avatarClass → el ID del ingrediente (ej: 'carrot')
 *   element     → el botón del ingrediente que se eligió
 *
 * Qué hace:
 *   - Si no hay modo elegido → sacude los botones de modo.
 *   - Si J1 toca su propio ingrediente → lo deselecciona.
 *   - Si J2 toca su propio ingrediente (modo 2 jugadores) → lo deselecciona.
 *   - Si J1 no ha elegido → este ingrediente es para J1.
 *     · En modo 1 jugador: la IA elige su ingrediente automáticamente.
 *   - Si J1 ya eligió y J2 no (modo 2 jugadores) → este ingrediente es para J2.
 */

function setAvatar(avatarClass, element) {

    // Bloqueo: si no hay modo elegido, sacudimos los botones de modo.
    if (gameMode === null) {
        const modeContainer = document.querySelector('.mode_selection');
        modeContainer.classList.add('shake');
        // Quitamos la clase después de 500ms para que la animación pueda repetirse en el futuro.
        setTimeout(() => modeContainer.classList.remove('shake'), 500);
        return;
    }

    playSelectSound();

    // DESELECCIONAR J1
    // Si J1 toca el ingrediente que ya eligió, lo deseleccionamos (toggle).
    if (avatarClass === player1Avatar) {
        player1Avatar = null;
        player1Emoji = "";
        element.classList.remove("selected_player1");
        document.getElementById("p1_avatar").innerText = "?";

        // En modo 1 jugador, la IA también pierde su selección automática.
        if (gameMode === 'one_player') {
            player2Avatar = null;
            player2Emoji = "";
            document.getElementById("p2_avatar").innerText = "🤖";
        }

        updateButtonsState();
        checkReadyToPlay();
        return;
    }

    // DESELECCIONAR J2 (solo en modo 2 jugadores)
    if (avatarClass === player2Avatar && gameMode === 'two_players') {
        player2Avatar = null;
        player2Emoji = "";
        element.classList.remove("selected_player2");
        document.getElementById("p2_avatar").innerText = "?";
        updateButtonsState();
        checkReadyToPlay();
        return;
    }

    // SELECCIONAR J1
    if (player1Avatar === null) {
        player1Avatar = avatarClass;
        player1Emoji = element.innerText;
        document.getElementById("p1_avatar").innerText = player1Emoji;
        element.classList.add("selected_player1");

        // En modo 1 jugador: marcamos a la IA como J2.
        // player2Emoji ya no se necesita porque la IA siempre usa "🤖" en el tablero,
        // en el marcador y en el indicador de turno. El Minimax también compara con "🤖".
        if (gameMode === 'one_player') {
            player2Avatar = "IA";
            player2Emoji = "🤖";
            document.getElementById("p2_avatar").innerText = "🤖";
        }
    }

    // SELECCIONAR J2 (solo en modo 2 jugadores)
    else if (player2Avatar === null && gameMode === 'two_players') {
        // Evitamos que J2 elija el mismo ingrediente que J1.
        if (avatarClass === player1Avatar) return;
        player2Avatar = avatarClass;
        player2Emoji = element.innerText;
        document.getElementById("p2_avatar").innerText = player2Emoji;
        element.classList.add("selected_player2");
    }

    updateButtonsState();
    checkReadyToPlay();
}

/*
 * updateButtonsState()
 * Controla si los botones de ingredientes están activos o desactivados.
 *
 * Regla: cuando ambos jugadores ya tienen ingrediente → opacar y bloquear
 * los botones que nadie eligió (para que no haya confusión).
 * Cuando alguno está libre → todos los botones vuelven a estar disponibles.
 */

function updateButtonsState() {
    const allButtons = document.querySelectorAll('.select_btn');

    if (player1Avatar !== null && player2Avatar !== null) {
        // Bloqueamos todos excepto los dos elegidos.
        allButtons.forEach(btn => {
            if (!btn.classList.contains('selected_player1') && !btn.classList.contains('selected_player2')) {
                btn.style.opacity = "0.5";
                btn.style.pointerEvents = "none";
            }
        });
    } else {
        // Si alguno deseleccionó, volvemos a activar todos.
        allButtons.forEach(btn => {
            btn.style.opacity = "1";
            btn.style.pointerEvents = "auto";
        });
    }
}

/* ==========================================================================
   LÓGICA DEL TIMER
   ========================================================================== */

/*
 * startTimer()
 * Inicia el cronómetro para la ronda actual.
 * Se llama al empezar la partida y al reiniciar cada ronda.
 *
 * Si selectedTime es 0 (sin límite), no hace nada.
 * Crea un setInterval que resta 1 segundo cada 1000ms.
 * Cuando llega a 0, llama a handleTimeOut().
 */

function startTimer() {
    if (selectedTime === 0) return; // Sin límite → no arrancamos ningún timer.

    timeRemaining = selectedTime;
    updateTimerDisplay();

    // Limpiamos cualquier timer previo para evitar que corran dos a la vez.
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            handleTimeOut();
        }
    }, 1000);
}

/*
 * updateTimerDisplay()
 * Actualiza el texto del reloj en pantalla con formato M:SS.
 * Ejemplo: 65 segundos → "1:05"
 *
 * padStart(2, '0') agrega un cero a la izquierda si el número tiene un solo dígito.
 * Ej: 5 → "05", 12 → "12"
 */

function updateTimerDisplay() {
    const display = document.getElementById("display_time_game");
    if (!display) return;
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    display.innerText = `${mins}:${secs.toString().padStart(2, '0')}`;
}

/*
 * handleTimeOut()
 * Se llama cuando el timer llega a 0.
 * Bloquea todo el tablero y avisa que fue empate por tiempo.
 */

function handleTimeOut() {
    document.querySelectorAll(".board input").forEach(btn => btn.disabled = true);
    showAlert("Empate 🙊", "¡La sopa se quedó en la estufa demasiado tiempo!");
}


/* ==========================================================================
   FLUJO DEL JUEGO
   ========================================================================== */

/*
 * showBoard()
 * Transición de la pantalla de configuración a la pantalla de juego.
 *
 * Oculta el panel de opciones, muestra el marcador y el tablero,
 * llena los emojis del marcador, actualiza el indicador de turno
 * e inicia el timer.
 */

function showBoard() {
    playSelectSound();

    document.getElementById("options_page").style.display = "none";
    document.getElementById("status_page").style.display = "flex";
    document.getElementById("setup_section").style.display = "none";
    document.getElementById("game_section").style.display = "block";

    // En modo 1 jugador mostramos 🤖 en el marcador, no el ingrediente secreto de la IA.
    document.getElementById("p1_emoji_status").innerText = player1Emoji;
    document.getElementById("p2_emoji_status").innerText = gameMode === 'one_player' ? "🤖" : player2Emoji;

    updateTurnIndicator();
    startTimer();
}

/*
 * updateTurnIndicator()
 * Actualiza el cuadrito que muestra de quién es el turno.
 *
 * En modo 1 jugador, cuando es turno de la IA muestra 🤖.
 * En modo 2 jugadores muestra el emoji del ingrediente del jugador.
 */

function updateTurnIndicator() {
    const indicator = document.getElementById("active_player_indicator");
    if (turn) {
        indicator.innerText = player1Emoji;
        indicator.className = "player_avatar1 player_avatar";
    } else {
        indicator.innerText = gameMode === 'one_player' ? "🤖" : player2Emoji;
        indicator.className = "player_avatar2 player_avatar";
    }
}

/*
 * active(button, isItIA)
 * Se ejecuta cada vez que se hace clic en una celda del tablero.
 * También la llama la IA directamente cuando decide su movimiento.
 *
 * Parámetros:
 *   button  → el input[type=button] de la celda donde se hizo clic (o que la IA quiere jugar).
 *   isItIA  → false por defecto (clic de usuario). La IA lo pasa como true
 *               para no bloquearse a sí misma con los turnos del usuario.
 *
 * Qué hace:
 *   1. Validaciones: ¿celda vacía? ¿es turno correcto? ¿IA pensando?
 *   2. Pone el emoji correcto en la celda (🥕 para J1, 🤖 para la IA, emoji de J2 para 2 jugadores).
 *   3. Verifica si hubo ganador.
 *   4. Revisa si fue empate (tablero lleno sin ganador).
 *   5. Cambia el turno y, si es modo 1 jugador, dispara el movimiento de la IA.
 */

function active(button, isItIA = false) {
    // Evita ejecutar la jugada si:
    // 1. La casilla ya está ocupada
    // 2. Es modo de un jugador y no es el turno del jugador
    // 3. La IA está "pensando" y aún no ha hecho su jugada
    if (button.value !== ""
        || (!isItIA && gameMode === 'one_player' && !turn)
        || (!isItIA && iaThinking)) return;

    // Sonido de colocar emoji.
    const effect = document.getElementById('clickSound');
    effect.currentTime = 0.03;
    effect.play();

    // Ponemos el emoji en la celda:
    // - Si es turno de J1 (turn = true) → emoji de J1
    // - Si es turno de la IA (turn = false, modo 1 jugador) → 🤖
    // - Si es turno de J2 humano (turn = false, modo 2 jugadores) → emoji de J2
    if (turn) {
        button.value = player1Emoji;
    } else if (gameMode === 'one_player') {
        button.value = "🤖"; // La IA siempre pone robotcitos en el tablero 🤖
    } else {
        button.value = player2Emoji;
    }
    button.disabled = true; // Deshabilitamos la celda para que no se pueda volver a tocar.

    // Revisamos si este movimiento fue ganador.
    const over = verifyWinner();
    if (!over) {
        // Si no hubo ganador, revisamos si fue empate (todas las celdas llenas).
        const empty = Array.from(document.querySelectorAll(".board input:not(:disabled)"));
        if (empty.length === 0) {
            clearInterval(timerInterval);
            showAlert("Empate 🙊", "¡Uh oh! La sopa se revolvió demasiado. Nadie gana esta ronda.");
            return;
        }

        // Cambiamos el turno y actualizamos el indicador.
        turn = !turn;
        updateTurnIndicator();

        // Si ahora es turno de la IA, la bloqueamos para el humano y la mandamos a pensar.
        if (gameMode === 'one_player' && !turn) {
            iaThinking = true;
            setTimeout(iaMove, 600); // 600ms de pausa
        }
    }
}


/* ==========================================================================
   INTELIGENCIA ARTIFICIAL (Algoritmo Minimax)
   
   El algoritmo Minimax es una técnica clásica para juegos de dos jugadores.
   La idea es: antes de jugar, la IA imagina TODOS los movimientos posibles
   (propios y del humano) hasta que el juego termine, y elige el camino
   que le da el mejor resultado.
   
   Funciona así:
   - Cuando es turno de la IA (isMaximizing = true) → busca el puntaje MÁS ALTO.
   - Cuando simula el turno del humano (isMaximizing = false) → asume que el humano
     jugará lo mejor posible, o sea busca el puntaje MÁS BAJO.
   
   Puntajes finales: +1 si la IA gana, -1 si el humano gana, 0 si empate.
   
   ========================================================================== */

/*
 * minimax(boardState, isMaximizing)
 * Se llama a sí mismo para explorar todos los futuros posibles.
 *
 * Parámetros:
 *   boardState    → array de 9 elementos que representa el tablero simulado.
 *                   Cada elemento es "" (vacío), player1Emoji, o player2Emoji.
 *   isMaximizing  → true si es el turno de la IA en esta simulación, false si es el humano.
 *
 * Retorna: el mejor puntaje posible desde este estado del tablero.
 *
 * Las simulaciones usan player2Emoji ("🤖") igual que el tablero real,
 * así que ambos mundos son consistentes.
 */
 
function minimax(boardState, isMaximizing) {
    // Caso base: revisamos si el juego ya terminó en este estado simulado.
    const result = checkWinnerForMinimax(boardState);
    if (result !== null) return result; // +1, -1 o 0

    if (isMaximizing) {
        // Turno de la IA: probamos cada celda vacía y nos quedamos con el mayor puntaje.
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === "") {
                boardState[i] = player2Emoji;           // Simulamos jugada de la IA.
                const score = minimax(boardState, false); // Ahora le toca al humano.
                boardState[i] = "";                       // Deshacemos (solo era simulación).
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        // Turno del humano: asumimos que jugará lo mejor posible → menor puntaje para la IA.
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === "") {
                boardState[i] = player1Emoji;            // Simulamos jugada del humano.
                const score = minimax(boardState, true);  // Ahora le toca a la IA.
                boardState[i] = "";                        // Deshacemos.
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

/*
 * checkWinnerForMinimax(boardState)
 * Versión interna de la lógica de ganar, usada solo por las simulaciones del Minimax.
 * Trabaja con el array boardState (no con el DOM).
 *
 * Retorna:
 *   +1   si la IA (player2Emoji) ganó en este estado simulado
 *   -1   si el humano (player1Emoji) ganó
 *    0   si es empate (todas las celdas llenas sin ganador)
 *   null si el juego todavía puede continuar
 */

function checkWinnerForMinimax(boardState) {
    const combos = [
        [0,1,2], [3,4,5], [6,7,8], // Filas
        [0,3,6], [1,4,7], [2,5,8], // Columnas
        [0,4,8], [2,4,6]           // Diagonales
    ];

    for (const [a, b, c] of combos) {
        if (boardState[a] !== "" && boardState[a] === boardState[b] && boardState[b] === boardState[c]) {
            if (boardState[a] === player2Emoji) return 1;  // IA gana → puntaje positivo
            if (boardState[a] === player1Emoji) return -1; // Humano gana → puntaje negativo
        }
    }

    // Si no hay tres iguales y no quedan celdas vacías → empate.
    if (boardState.every(cell => cell !== "")) return 0;

    return null; // El juego sigue.
}

/*
 * iaMove()
 * Decide qué celda jugar usando los puntajes del Minimax.
 *
 * Qué hace:
 *   1. Lee el estado actual del tablero del DOM.
 *   2. Prueba cada celda vacía: simula jugar ahí y pide a minimax() el puntaje.
 *   3. Guarda el índice de la celda con el mejor puntaje.
 *   4. Libera el bloqueo (iaThinking = false).
 *   5. Llama a active() con isItIA = true para que la IA no se bloquee sola.
 */

function iaMove() {
    const buttons = document.querySelectorAll(".board input");

    // Leemos el tablero real: convertimos los botones a un array de strings.
    // Celda vacía → "", celda ocupada → el emoji que tiene.
    const boardState = Array.from(buttons).map(btn => btn.value);

    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
        if (boardState[i] === "") {
            boardState[i] = player2Emoji;            // Simulamos que la IA juega aquí.
            const score = minimax(boardState, false); // ¿Qué tan bueno es este movimiento?
            boardState[i] = "";                       // Deshacemos la simulación.

            if (score > bestScore) {
                bestScore = score;
                bestMove = i; // Este es el mejor movimiento encontrado hasta ahora.
            }
        }
    }

    // Liberamos el semáforo ANTES de llamar a active(), para que no haya bloqueos.
    iaThinking = false;

    if (bestMove !== -1) {
        active(buttons[bestMove], true); // isItIA = true → la IA no se bloquea sola.
    }
}


/* ==========================================================================
   REINICIO
   ========================================================================== */

/*
 * resetBoard()
 * Prepara el tablero para una nueva ronda sin salir del juego.
 *
 * - Detiene el timer.
 * - Limpia todas las celdas.
 * - Devuelve el turno a J1.
 * - Reinicia el timer.
 */

function resetBoard() {
    playSelectSound();
    clearInterval(timerInterval);
    iaThinking = false; // Limpiamos por si acaso la IA estaba pensando al reiniciar.

    document.querySelectorAll(".board input").forEach(btn => {
        btn.value = "";
        btn.disabled = false;
        // Quitamos las clases de animación ganadora para que el tablero quede limpio.
        btn.classList.remove("celda_ganadora_p1", "celda_ganadora_p2");
    });

    turn = true;
    updateTurnIndicator();
    startTimer();
}


/* ==========================================================================
   LÓGICA DE GANAR
   ========================================================================== */

/*
 * animateWinnerCells(indices, isPlayer1)
 * Agrega la clase CSS de animación a las 3 celdas ganadoras.
 *
 * Parámetros:
 *   indices   → array con los 3 índices del tablero que forman la línea ganadora (ej: [0,4,8])
 *   isPlayer1 → true si ganó J1 (animación roja), false si ganó J2/IA (animación azul)
 */

function animateWinnerCells(indices, isPlayer1) {
    const buttons = document.querySelectorAll(".board input");
    const clase = isPlayer1 ? "celda_ganadora_p1" : "celda_ganadora_p2";

    // Agregamos la clase a cada una de las 3 celdas ganadoras con un pequeño retraso
    // entre ellas (0ms, 100ms, 200ms) para que se iluminen en cascada, no todas juntas.
    indices.forEach((idx, i) => {
        setTimeout(() => {
            buttons[idx].classList.add(clase);
        }, i * 100);
    });
}

/*
 * verifyWinner()
 * Revisa las 8 combinaciones ganadoras del tablero REAL (con el DOM).
 * Se llama después de cada movimiento.
 *
 * Si encuentra tres iguales en línea:
 *   - Detiene el timer.
 *   - Anima las 3 celdas ganadoras.
 *   - Espera 800ms para que la animación se vea antes del alert.
 *   - Suma el punto al marcador del ganador.
 *   - Muestra un alert con el mensaje correcto.
 *   - Bloquea todas las celdas para que nadie siga jugando.
 *   - Retorna true (el juego terminó).
 *
 * Si no hay ganador → retorna false (el juego continúa).
 */

function verifyWinner() {
    const buttons = document.querySelectorAll(".board input");
    const combinations = [
        [0,1,2], [3,4,5], [6,7,8], // Filas
        [0,3,6], [1,4,7], [2,5,8], // Columnas
        [0,4,8], [2,4,6]           // Diagonales
    ];

    for (const [a, b, c] of combinations) {
        const val = buttons[a].value;
        if (val !== "" && val === buttons[b].value && val === buttons[c].value) {

            clearInterval(timerInterval); // Detenemos el timer: ya terminó la ronda.
            buttons.forEach(btn => btn.disabled = true); // Bloqueamos el tablero de inmediato.

            const ganoJ1 = val === player1Emoji;

            // Primero animamos las celdas ganadoras...
            animateWinnerCells([a, b, c], ganoJ1);

            // ...y después de 800ms mostramos el alert y sumamos el punto.
            // Esto da tiempo para que el jugador vea la animación antes del popup.
            setTimeout(() => {
                if (ganoJ1) {
                    p1Wins++;
                    document.getElementById("p1_wins").innerText = p1Wins;
                    
                    showAlert("¡Punto para J1! 🎉", "¡Felicidades, has ganado un punto!");
                } else {
                    // Ganó J2 o la IA.
                    p2Wins++;
                    document.getElementById("p2_wins").innerText = p2Wins;
                    showAlert(gameMode === 'one_player' ? "¡La IA anotó un punto! 🤖" : "¡Punto para J2! 🎉", gameMode === 'one_player' ? "La IA ha ganado un punto." : "J2 ha ganado un punto.");
                }
            }, 800);

            return true;
        }
    }

    return false; // Nadie ganó todavía.
}


/* ==========================================================================
   AUDIO Y EVENTOS GLOBALES
   ========================================================================== */

/*
 * DOMContentLoaded
 * Este evento se dispara cuando el HTML ya cargó completamente.
 * Lo usamos para agregar el sonido de hover a los botones del menú.
 * Si lo hiciéramos antes, los botones todavía no existirían en el DOM.
 */
document.addEventListener("DOMContentLoaded", () => {
    const hoverSound = new Audio('audio/hover.mp3');

    const btns = document.querySelectorAll('.select_btn, .timer_selection button, .btn_jugar, .mode_selection button');
    btns.forEach(b => {
        b.addEventListener('mouseenter', () => {
            // Solo reproducimos si el botón está activo (no bloqueado).
            if (b.style.pointerEvents !== "none") {
                hoverSound.currentTime = 0;
                hoverSound.play().catch(e => {});
            }
        });
    });
});

/*
 * Primer clic en la ventana → arrancamos la música de fondo.
 * Los navegadores bloquean el audio automático hasta que el usuario
 * interactúa con la página. Por eso esperamos el primer clic.
 * { once: true } hace que este listener se elimine solo después del primer disparo.
 */
window.addEventListener('click', () => {
    const music = document.getElementById('bgMusic');
    if (music.paused) {
        music.volume = 0.3;
        music.play().catch(e => {});
    }
}, { once: true });

/*
* showAlert(title, message)
* Muestra un modal con el título y mensaje dados.
*/

function showAlert(title, message) {
    document.getElementById("modal_title").innerText = title;
    document.getElementById("modal_message").innerText = message;
    document.getElementById("custom_modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("custom_modal").style.display = "none";
}

window.onclick = function(event) {
    let modal = document.getElementById("custom_modal");
    if (event.target == modal) {
        closeModal();
    }
}