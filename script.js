const board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const message = document.getElementById('message');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart');

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
];

function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');

    if (board[index] !== '' || !gameActive) return;

    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add('active');

    if (checkWinner()) {
        message.textContent = `🎉 Player ${currentPlayer} WON!`;
        gameActive = false;
        return;
    }

    if (board.includes('')) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        message.textContent = `Player ${currentPlayer}'s Turn`;
    } else {
        message.textContent = '🤝 It\'s a DRAW!';
        gameActive = false;
    }
}

function checkWinner() {
    return winningConditions.some(combination => {
        return combination.every(index => board[index] === currentPlayer);
    });
}

function restartGame() {
    board.fill('');
    currentPlayer = 'X';
    gameActive = true;

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('active');
    });

    message.textContent = `Player ${currentPlayer}'s Turn`;
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);

message.textContent = `Player ${currentPlayer}'s Turn`;
