// Game state
const gameState = {
    currentScreen: 'welcome-screen',
    gameMode: 'classic', // 'classic' or 'twist'
    opponent: 'friend', // 'friend' or 'computer'
    difficulty: 'medium', // 'easy', 'medium', or 'impossible'
    currentPlayer: 'X',
    board: Array(9).fill(''),
    moveHistory: [], // For twist mode: track move order
    gameActive: true,
    winner: null,
    winLine: null,
    soundEnabled: true
};

// DOM Elements
const elements = {
    screens: {
        welcome: document.getElementById('welcome-screen'),
        game: document.getElementById('game-screen'),
        gameOver: document.getElementById('game-over-screen')
    },
    classicMode: document.getElementById('classic-mode'),
    twistMode: document.getElementById('twist-mode'),
    friendOpponent: document.getElementById('friend-opponent'),
    computerOpponent: document.getElementById('computer-opponent'),
    aiDifficultyContainer: document.getElementById('ai-difficulty-container'),
    difficultyOptions: document.querySelectorAll('.difficulty-option'),
    difficultySlider: document.querySelector('.difficulty-slider'),
    startGame: document.getElementById('start-game'),
    backButton: document.getElementById('back-button'),
    resetButton: document.getElementById('reset-button'),
    gameModeDisplay: document.getElementById('game-mode-display'),
    gameBoard: document.getElementById('game-board'),
    gameCells: document.querySelectorAll('.game-cell'),
    gameStatus: document.getElementById('game-status'),
    winLine: document.getElementById('win-line'),
    gridLines: document.querySelectorAll('.grid-line'),
    xMovesIndicator: document.getElementById('x-moves-indicator'),
    oMovesIndicator: document.getElementById('o-moves-indicator'),
    winnerDisplay: document.getElementById('winner-display'),
    resultMessage: document.getElementById('result-message'),
    playAgain: document.getElementById('play-again'),
    newGame: document.getElementById('new-game'),
    particles: document.getElementById('particles')
};

// Winning combinations
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Sound effects
const sounds = {
    click: {
        play: () => playSound('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDAwMD//////////////////8AAAA5TEFNRTMuMTAwAZYAAAAAAAAAABQ4JAMGQgAAQAAAsMDJYrDzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV')
    },
    place: {
        play: () => playSound('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAZIAMDAwMDAwMDAwMDAwMDAwMDBAQEBAQEBAQEBAQEBAQEBAgICAgICAgICAgICAgICA/////////////////////////////////8AAAA5TEFNRTMuMTAwAZYAAAAAAAAAABQ4JAMGQgAAQAAAkiDk8HDTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV')
    },
    win: {
        play: () => playSound('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAABAAAAeAAICAgICAgICAgICAgICAgQEBAQEBAQEBAQEBAQEBAgICAgICAgICAgICAgICAoKCgoKCgoKCgoKCgoKCgwMDAwMDAwMDAwMDAwMDA4ODg4ODg4ODg4ODg4ODg//////////////////////////8AAAA5TEFNRTMuMTAwAZYAAAAAAAAAABQ4JAMGQgAAQAAA4OAiQL9QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV')
    },
    draw: {
        play: () => playSound('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAABAAAAeAAICAgICAgICAgICAgICAgQEBAQEBAQEBAQEBAQEBAgICAgICAgICAgICAgICAoKCgoKCgoKCgoKCgoKCgwMDAwMDAwMDAwMDAwMDA4ODg4ODg4ODg4ODg4ODg//////////////////////////8AAAA5TEFNRTMuMTAwAZYAAAAAAAAAABQ4JAMGQgAAQAAA4OAiQL9QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV')
    },
    remove: {
        play: () => playSound('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAZIAMDAwMDAwMDAwMDAwMDAwMDBAQEBAQEBAQEBAQEBAQEBAgICAgICAgICAgICAgICA/////////////////////////////////8AAAA5TEFNRTMuMTAwAZYAAAAAAAAAABQ4JAMGQgAAQAAAkiDk8HDTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV')
    }
};

// Play sound function
function playSound(base64Sound) {
    if (gameState.soundEnabled) {
        const audio = new Audio(base64Sound);
        audio.volume = 0.3;
        audio.play().catch(e => console.log("Audio play failed:", e));
    }
}

// Initialize particles
function initParticles() {
    // Create particles
    for (let i = 0; i < 50; i++) {
        createParticle();
    }
}

function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // Random position
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    // Random size
    const size = Math.random() * 3 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Random color
    const colors = [
        'var(--neon-blue)',
        'var(--neon-pink)',
        'var(--neon-purple)'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;

    // Random opacity
    particle.style.opacity = Math.random() * 0.5 + 0.1;

    // Add to DOM
    elements.particles.appendChild(particle);

    // Animate
    animateParticle(particle);
}

function animateParticle(particle) {
    const duration = Math.random() * 15000 + 10000;
    const xMove = Math.random() * 100 - 50;
    const yMove = Math.random() * 100 - 50;

    particle.animate([
        { transform: 'translate(0, 0)', opacity: particle.style.opacity },
        { transform: `translate(${xMove}px, ${yMove}px)`, opacity: 0 }
    ], {
        duration: duration,
        easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
    });

    setTimeout(() => {
        if (elements.particles.contains(particle)) {
            elements.particles.removeChild(particle);
            createParticle();
        }
    }, duration);
}

// Event Listeners
function setupEventListeners() {
    // Mode selection cards
    elements.classicMode.addEventListener('click', () => {
        selectGameMode('classic');
        sounds.click.play();
    });

    elements.twistMode.addEventListener('click', () => {
        selectGameMode('twist');
        sounds.click.play();
    });

    // Opponent selection cards
    elements.friendOpponent.addEventListener('click', () => {
        selectOpponent('friend');
        sounds.click.play();
    });

    elements.computerOpponent.addEventListener('click', () => {
        selectOpponent('computer');
        sounds.click.play();
    });

    // Difficulty options
    elements.difficultyOptions.forEach((option, index) => {
        option.addEventListener('click', () => {
            selectDifficulty(option.dataset.difficulty, index);
            sounds.click.play();
        });
    });

    // Start game
    elements.startGame.addEventListener('click', () => {
        startGame();
        sounds.click.play();
    });

    // Game controls
    elements.backButton.addEventListener('click', () => {
        switchScreen('welcome-screen');
        sounds.click.play();
    });

    elements.resetButton.addEventListener('click', () => {
        resetGame();
        sounds.click.play();
    });

    // Game cells
    elements.gameCells.forEach(cell => {
        cell.addEventListener('click', () => {
            handleCellClick(cell);
        });
    });

    // Game over screen
    elements.playAgain.addEventListener('click', () => {
        resetGame();
        switchScreen('game-screen');
        sounds.click.play();
    });

    elements.newGame.addEventListener('click', () => {
        switchScreen('welcome-screen');
        sounds.click.play();
    });
}

// Select game mode
function selectGameMode(mode) {
    gameState.gameMode = mode;

    if (mode === 'classic') {
        elements.classicMode.classList.add('selected');
        elements.twistMode.classList.remove('selected');
    } else {
        elements.twistMode.classList.add('selected');
        elements.classicMode.classList.remove('selected');
    }
}

// Select opponent
function selectOpponent(opponent) {
    gameState.opponent = opponent;

    if (opponent === 'friend') {
        elements.friendOpponent.classList.add('selected');
        elements.computerOpponent.classList.remove('selected');
        elements.aiDifficultyContainer.classList.add('hidden');
    } else {
        elements.computerOpponent.classList.add('selected');
        elements.friendOpponent.classList.remove('selected');
        elements.aiDifficultyContainer.classList.remove('hidden');
    }
}

// Select difficulty
function selectDifficulty(difficulty, index) {
    gameState.difficulty = difficulty;

    // Move the slider
    elements.difficultySlider.style.left = `${index * 33.33}%`;
}

// Start game
function startGame() {
    resetGameState();
    updateGameUI();
    switchScreen('game-screen');

    // Animate grid lines
    setTimeout(() => {
        elements.gridLines.forEach(line => {
            line.classList.add('active');
        });
    }, 300);

    // If AI goes first (when AI is O)
    if (gameState.opponent === 'computer' && gameState.currentPlayer === 'O') {
        setTimeout(makeAIMove, 800);
    }
}

// Handle cell click
function handleCellClick(cell) {
    const index = parseInt(cell.dataset.index);

    // Check if cell is already filled or game is over
    if (gameState.board[index] !== '' || !gameState.gameActive) {
        return;
    }

    // Make player move
    makeMove(index);

    // If game is still active and opponent is AI, make AI move
    if (gameState.gameActive && gameState.opponent === 'computer') {
        setTimeout(makeAIMove, 800);
    }
}

// Make move
function makeMove(index) {
    // In twist mode, check if player already has 3 marks
    if (gameState.gameMode === 'twist') {
        const playerMoves = gameState.moveHistory.filter(move => move.player === gameState.currentPlayer);

        if (playerMoves.length >= 3) {
            // Remove oldest move
            const oldestMove = playerMoves[0];
            gameState.board[oldestMove.index] = '';

            // Animate removal
            const oldCell = document.querySelector(`.game-cell[data-index="${oldestMove.index}"]`);
            const marker = oldCell.querySelector('.x-marker, .o-marker');
            if (marker) {
                marker.classList.add('fade-out');
                setTimeout(() => {
                    if (oldCell.contains(marker)) {
                        oldCell.removeChild(marker);
                    }
                }, 500);
            }

            // Remove from history
            const oldMoveIndex = gameState.moveHistory.findIndex(move =>
                move.player === oldestMove.player && move.index === oldestMove.index
            );
            gameState.moveHistory.splice(oldMoveIndex, 1);

            sounds.remove.play();
        }
    }

    // Place mark
    gameState.board[index] = gameState.currentPlayer;
    gameState.moveHistory.push({
        player: gameState.currentPlayer,
        index: index
    });

    // Update UI
    const cell = document.querySelector(`.game-cell[data-index="${index}"]`);
    const marker = document.createElement('div');

    if (gameState.currentPlayer === 'X') {
        marker.classList.add('x-marker', 'x-animation');
    } else {
        marker.classList.add('o-marker', 'o-animation');
    }

    cell.appendChild(marker);
    sounds.place.play();

    // Check for win or draw
    checkGameResult();

    // Switch player if game is still active
    if (gameState.gameActive) {
        gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
        updateGameStatus();
        updateMoveIndicators();
    }
}

// AI Move
function makeAIMove() {
    if (!gameState.gameActive) return;

    let index;

    switch (gameState.difficulty) {
        case 'easy':
            index = getEasyAIMove();
            break;
        case 'medium':
            // 70% chance of optimal move, 30% chance of random move
            index = Math.random() < 0.7 ? getOptimalAIMove() : getEasyAIMove();
            break;
        case 'impossible':
            index = getOptimalAIMove();
            break;
        default:
            index = getOptimalAIMove();
    }

    makeMove(index);
}

// Easy AI - Random empty cell
function getEasyAIMove() {
    const emptyCells = gameState.board
        .map((cell, index) => cell === '' ? index : -1)
        .filter(index => index !== -1);

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Optimal AI Move using Minimax
function getOptimalAIMove() {
    // For twist mode, we need a simpler but effective strategy
    if (gameState.gameMode === 'twist') {
        return getSmartTwistMove();
    }

    // For classic mode, use minimax
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < 9; i++) {
        if (gameState.board[i] === '') {
            gameState.board[i] = 'O'; // AI is always O
            let score = minimax(gameState.board, 0, false);
            gameState.board[i] = '';

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

// Smart move for Twist mode
function getSmartTwistMove() {
    // First, check if AI can win
    for (let i = 0; i < 9; i++) {
        if (gameState.board[i] === '') {
            gameState.board[i] = 'O';
            if (checkWinner(gameState.board) === 'O') {
                gameState.board[i] = '';
                return i;
            }
            gameState.board[i] = '';
        }
    }

    // Second, block player's win
    for (let i = 0; i < 9; i++) {
        if (gameState.board[i] === '') {
            gameState.board[i] = 'X';
            if (checkWinner(gameState.board) === 'X') {
                gameState.board[i] = '';
                return i;
            }
            gameState.board[i] = '';
        }
    }

    // Take center if available
    if (gameState.board[4] === '') {
        return 4;
    }

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => gameState.board[i] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available edge
    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter(i => gameState.board[i] === '');
    if (availableEdges.length > 0) {
        return availableEdges[Math.floor(Math.random() * availableEdges.length)];
    }

    // Fallback to random move
    return getEasyAIMove();
}

// Minimax algorithm for AI
function minimax(board, depth, isMaximizing) {
    // Check terminal states
    const winner = checkWinner(board);
    if (winner === 'O') return 10 - depth; // AI wins
    if (winner === 'X') return depth - 10; // Player wins
    if (isBoardFull(board)) return 0; // Draw

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Check if board is full
function isBoardFull(board) {
    return board.every(cell => cell !== '');
}

// Check winner
function checkWinner(board) {
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

// Check game result
function checkGameResult() {
    // Check for win
    for (let i = 0; i < winPatterns.length; i++) {
        const [a, b, c] = winPatterns[i];
        if (
            gameState.board[a] &&
            gameState.board[a] === gameState.board[b] &&
            gameState.board[a] === gameState.board[c]
        ) {
            gameState.gameActive = false;
            gameState.winner = gameState.currentPlayer;
            gameState.winLine = i;

            // Draw win line
            drawWinLine(i);
            sounds.win.play();

            // Show game over screen after delay
            setTimeout(() => {
                showGameOver();
            }, 1500);

            return;
        }
    }

    // Check for draw (only in classic mode)
    if (gameState.gameMode === 'classic' && !gameState.board.includes('')) {
        gameState.gameActive = false;

        // Show game over screen after delay
        setTimeout(() => {
            showGameOver();
        }, 1000);

        sounds.draw.play();
        return;
    }
}

// Draw win line
function drawWinLine(patternIndex) {
    const pattern = winPatterns[patternIndex];
    const [a, b, c] = pattern;

    const cellSize = elements.gameCells[0].offsetWidth;
    const boardRect = elements.gameBoard.getBoundingClientRect();

    const cellA = elements.gameCells[a].getBoundingClientRect();
    const cellC = elements.gameCells[c].getBoundingClientRect();

    const winLine = elements.winLine;
    winLine.classList.remove('hidden');

    // Calculate positions relative to the game board
    const startX = cellA.left - boardRect.left + cellSize / 2;
    const startY = cellA.top - boardRect.top + cellSize / 2;
    const endX = cellC.left - boardRect.left + cellSize / 2;
    const endY = cellC.top - boardRect.top + cellSize / 2;

    // Calculate length and angle
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

    // Apply styles
    winLine.style.width = `${length}px`;
    winLine.style.left = `${startX}px`;
    winLine.style.top = `${startY}px`;
    winLine.style.transform = `rotate(${angle}deg)`;
}

// Show game over screen
function showGameOver() {
    if (gameState.winner) {
        elements.winnerDisplay.textContent = gameState.winner;
        elements.winnerDisplay.className = gameState.winner === 'X' ? 'text-6xl my-6 neon-text-blue' : 'text-6xl my-6 neon-text-pink';
        elements.resultMessage.textContent = `Victory for Player ${gameState.winner}!`;
    } else {
        elements.winnerDisplay.textContent = '=';
        elements.winnerDisplay.className = 'text-6xl my-6 neon-text-purple';
        elements.resultMessage.textContent = 'It\'s a Draw!';
    }

    switchScreen('game-over-screen');
}

// Update game status
function updateGameStatus() {
    if (gameState.opponent === 'friend') {
        elements.gameStatus.textContent = `Player ${gameState.currentPlayer}'s Turn`;
    } else {
        elements.gameStatus.textContent = gameState.currentPlayer === 'X' ? 'Your Turn' : 'AI Thinking...';
    }

    elements.gameStatus.className = gameState.currentPlayer === 'X' ?
        'text-center font-bold neon-text-blue' :
        'text-center font-bold neon-text-pink';
}

// Update move indicators
function updateMoveIndicators() {
    // Only show indicators in twist mode
    if (gameState.gameMode === 'twist') {
        elements.xMovesIndicator.classList.remove('hidden');
        elements.oMovesIndicator.classList.remove('hidden');

        // Count current moves
        const xMoves = gameState.moveHistory.filter(move => move.player === 'X').length;
        const oMoves = gameState.moveHistory.filter(move => move.player === 'O').length;

        // Update X indicators
        const xIndicators = elements.xMovesIndicator.querySelectorAll('.move-indicator');
        xIndicators.forEach((indicator, index) => {
            if (index < xMoves) {
                indicator.classList.add('x-active');
                indicator.classList.remove('inactive');
            } else {
                indicator.classList.remove('x-active');
                indicator.classList.add('inactive');
            }
        });

        // Update O indicators
        const oIndicators = elements.oMovesIndicator.querySelectorAll('.move-indicator');
        oIndicators.forEach((indicator, index) => {
            if (index < oMoves) {
                indicator.classList.add('o-active');
                indicator.classList.remove('inactive');
            } else {
                indicator.classList.remove('o-active');
                indicator.classList.add('inactive');
            }
        });
    } else {
        elements.xMovesIndicator.classList.add('hidden');
        elements.oMovesIndicator.classList.add('hidden');
    }
}

// Reset game
function resetGame() {
    resetGameState();
    updateGameUI();

    // If AI goes first
    if (gameState.opponent === 'computer' && gameState.currentPlayer === 'O') {
        setTimeout(makeAIMove, 800);
    }
}

// Reset game state
function resetGameState() {
    gameState.board = Array(9).fill('');
    gameState.moveHistory = [];
    gameState.currentPlayer = 'X';
    gameState.gameActive = true;
    gameState.winner = null;
    gameState.winLine = null;
}

// Update game UI
function updateGameUI() {
    // Update game mode display
    elements.gameModeDisplay.textContent = gameState.gameMode.charAt(0).toUpperCase() + gameState.gameMode.slice(1) + ' Mode';

    // Clear board
    elements.gameCells.forEach(cell => {
        while (cell.firstChild) {
            cell.removeChild(cell.firstChild);
        }
    });

    // Hide win line
    elements.winLine.classList.add('hidden');

    // Update status
    updateGameStatus();

    // Update move indicators
    updateMoveIndicators();
}

// Switch screen
function switchScreen(screenId) {
    // Hide all screens
    Object.values(elements.screens).forEach(screen => {
        screen.classList.remove('active');
    });

    // Show requested screen
    elements.screens[screenId.split('-')[0]].classList.add('active');
    gameState.currentScreen = screenId;
}

// Initialize game
function initGame() {
    setupEventListeners();
    initParticles();

    // Set default difficulty
    selectDifficulty('medium', 1);
}

// Start the game
initGame();