var counter = 0;
var tipoReina = "2";

function cellClick(cell) {
    if (cell.innerHTML === "") {
        if (counter < 8) {
            if (tipoReina === "1") {
                cell.innerHTML = "♛";
            } else if (tipoReina === "2") {
                cell.innerHTML = "♕";
            } else if (tipoReina === "3") {
                cell.innerHTML = "♚";
            }
            counter++;
            updateCounter();
        }
    } else {
        cell.innerHTML = "";
        counter--;
        updateCounter();
    }
}

function selectQueen(type, btn) {
    tipoReina = type;
    document.querySelectorAll('.button-group button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function updateCounter() {
    document.getElementById('queenCount').textContent = counter;
}

function updateColors() {
    const color1 = document.getElementById('color1').value;
    const color2 = document.getElementById('color2').value;
    
    const table = document.getElementById('chessboard');
    const rows = table.getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        for (let j = 0; j < cells.length; j++) {
            if ((i + j) % 2 === 0) {
                cells[j].style.backgroundColor = color1;
            } else {
                cells[j].style.backgroundColor = color2;
            }
        }
    }
}

function resetBoard() {
    const cells = document.getElementsByTagName('td');
    for (let cell of cells) {
        cell.innerHTML = "";
    }
    counter = 0;
    updateCounter();
    updateColors();
}

function cambiar(r,c){
    var tabla=document.getElementById("chessboard");
    var r1 = r;
    var c1 = c;
    var r2 = r;
    var c2 = c;
    var r3 = r;
    var c3 = c;
    var r4 = r;
    var c4 = c;

    for (let i = 0; i < 8; i++) {
        tabla.rows[r].cells[i].style.backgroundColor = "#FF0000";
        tabla.rows[i].cells[c].style.backgroundColor = "#FF0000";
    }
}

function limpiar(){
    var cells = document.getElementsByTagName('td');
    for (let i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = "";
    }
}