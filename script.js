const board = document.getElementById('board');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const currentLevelDisplay = document.getElementById('currentLevel');
const winnerMessage = document.getElementById('winnerMessage');
const restartButton = document.getElementById('restartButton');
const messageContainer = document.getElementById('messageContainer');

let currentPlayer = 'X';
let level = 1;

function createBoard(size) {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', handleClick);
        board.appendChild(cell);
    }
}

function checkWin(player) {
    const cells = Array.from(board.children);
    const size = Math.sqrt(cells.length);

    for (let i = 0; i < size; i++) {
        if (cells.slice(i * size, i * size + size).every(cell => cell.textContent === player)) return true;
        if (cells.filter((_, idx) => idx % size === i).every(cell => cell.textContent === player)) return true;
    }
    if (cells.filter((_, idx) => idx % (size + 1) === 0).every(cell => cell.textContent === player)) return true;
    if (cells.filter((_, idx) => idx % (size - 1) === 0 && idx !== 0 && idx !== cells.length - 1).every(cell => cell.textContent === player)) return true;

    return false;
}

function endGame(draw) {
    if (draw) {
        winnerMessage.textContent = '¡Empate!';
    } else {
        if (currentPlayer === 'X') {
            winnerMessage.textContent = `¡Has ganado el Nivel ${level}!`;
            level++;
            currentLevelDisplay.textContent = level;
            createBoard(level + 2); // Incrementa el tamaño del tablero
        } else {
            winnerMessage.textContent = '¡La máquina gana! Iniciando de nuevo desde el nivel 1.';
            level = 1;
            currentLevelDisplay.textContent = level;
            createBoard(3); // Reinicia el juego al nivel 1
        }
    }
    messageContainer.classList.remove('hidden');
}

function handleClick(e) {
    const cell = e.target;
    cell.textContent = currentPlayer;
    cell.classList.add('taken');

    if (checkWin(currentPlayer)) {
        endGame(false);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        currentPlayerDisplay.textContent = currentPlayer;

        if (currentPlayer === 'O') {
            playAI();
        }
    }
}

function playAI() {
    const cells = Array.from(board.children);
    const availableCells = cells.filter(cell => cell.textContent === '');
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];

    randomCell.textContent = 'O';
    randomCell.classList.add('taken');

    if (checkWin('O')) {
        endGame(false);
    } else {
        currentPlayer = 'X';
        currentPlayerDisplay.textContent = currentPlayer;
    }
}

restartButton.addEventListener('click', () => {
    createBoard(level + 2);
    currentPlayer = 'X';
    currentPlayerDisplay.textContent = currentPlayer;
    messageContainer.classList.add('hidden');
});

// Inicializar el tablero
createBoard(3);