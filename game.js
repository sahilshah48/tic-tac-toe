class TicTacToe {
    constructor() {
        this.board = [];
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.scores = {
            X: 0,
            O: 0
        };
        this.initGame();
        this.initConfetti();
    }

    initGame() {
        const boardElement = document.querySelector('.board');
        const statusElement = document.querySelector('.status');
        const resetButton = document.querySelector('.reset-btn');
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('button');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', () => this.makeMove(cell));
            boardElement.appendChild(cell);
            this.board.push(null);
        }

        resetButton.addEventListener('click', () => this.resetGame());
        this.updateScoreDisplay();
    }

    makeMove(cellElement) {
        const index = cellElement.dataset.index;

        if (this.board[index] || this.gameOver) return;

        this.board[index] = this.currentPlayer;
        cellElement.textContent = this.currentPlayer;
        cellElement.classList.add(this.currentPlayer.toLowerCase());

        const winningCombination = this.checkWinner();
        if (winningCombination) {
            this.endGame(false, winningCombination);
        } else if (this.checkDraw()) {
            this.endGame(true);
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateStatus();
        }
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (
                this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]
            ) {
                return pattern;
            }
        }
        return null;
    }

    checkDraw() {
        return this.board.every(cell => cell !== null);
    }

    endGame(isDraw, winningCombination = null) {
        const statusElement = document.querySelector('.status');
        const cells = document.querySelectorAll('.cell');
        this.gameOver = true;

        if (isDraw) {
            statusElement.textContent = "It's a Draw!";
        } else {
            // Highlight winning cells
            winningCombination.forEach(index => {
                cells[index].classList.add('winner');
            });

            // Update score
            this.scores[this.currentPlayer]++;
            this.updateScoreDisplay();
            statusElement.textContent = `Player ${this.currentPlayer} Wins!`;
            
            // Trigger confetti
            this.triggerConfetti();
        }
    }

    updateStatus() {
        const statusElement = document.querySelector('.status');
        statusElement.textContent = `Player ${this.currentPlayer}'s Turn`;
    }

    updateScoreDisplay() {
        document.getElementById('player-x-score').textContent = this.scores['X'];
        document.getElementById('player-o-score').textContent = this.scores['O'];
    }

    resetGame() {
        const boardElement = document.querySelector('.board');
        const statusElement = document.querySelector('.status');
        const cells = document.querySelectorAll('.cell');

        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner');
        });

        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameOver = false;

        statusElement.textContent = "Player X's Turn";
    }

    initConfetti() {
        const canvas = document.querySelector('.confetti');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const confetti = [];
        const confettiCount = 200;
        const colors = ['#3498db', '#2ecc71', '#f39c12', '#e74c3c'];

        function createConfetti() {
            for (let i = 0; i < confettiCount; i++) {
                confetti.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 8 + 2,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    speedY: Math.random() * 3 + 1,
                    speedX: Math.random() * 4 - 2
                });
            }
        }

        function drawConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            confetti.forEach((piece, index) => {
                ctx.beginPath();
                ctx.fillStyle = piece.color;
                ctx.arc(piece.x, piece.y, piece.radius, 0, Math.PI * 2);
                ctx.fill();

                piece.y += piece.speedY;
                piece.x += piece.speedX;

                if (piece.y > canvas.height) {
                    confetti.splice(index, 1);
                }
            });

            if (confetti.length > 0) {
                requestAnimationFrame(drawConfetti);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        this.triggerConfetti = () => {
            confetti.length = 0;
            createConfetti();
            drawConfetti();
        };
    }
}
new TicTacToe();