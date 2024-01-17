const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const resultDisplay = document.getElementById("result");
const playerNameInput = document.getElementById("playerName");
const computerNameInput = document.getElementById("computerName");
const playerScoreDisplay = document.getElementById("playerScore");
const computerScoreDisplay = document.getElementById("computerScore");

let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;

let playerScore = 0;
let computerScore = 0;

// Event listener for each cell
cells.forEach((cell) => {
    cell.addEventListener("click", () => {
        const index = cell.dataset.index;
        if (gameBoard[index] === "" && !gameOver) {
            makeMove(index, currentPlayer);
            if (!checkWinner() && !isBoardFull()) {
                currentPlayer = "O";
                setTimeout(() => {
                    computerMove();
                    currentPlayer = "X";
                }, 500);
            }
        }
    });
});

// Event listener for the "Reset Game" button
document.getElementById("resetButton").addEventListener("click", resetGame);

// Function to make a move
function makeMove(index, player) {
    gameBoard[index] = player;
    cells[index].textContent = player;
    if (checkWinner()) {
        resultDisplay.textContent = `Player ${player} wins!`;
        updateScore(player);
        gameOver = true;
    } else if (isBoardFull()) {
        resultDisplay.textContent = "It's a draw!";
        gameOver = true;
    }
}

// Function to check for a winner
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] !== "" && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return true;
        }
    }

    return false;
}

// Function to check if the board is full
function isBoardFull() {
    return !gameBoard.includes("");
}

// Function for the computer's move
function computerMove() {
    const availableMoves = gameBoard.reduce((acc, cell, index) => {
        if (cell === "") {
            acc.push(index);
        }
        return acc;
    }, []);

    if (availableMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const computerIndex = availableMoves[randomIndex];
        makeMove(computerIndex, "O");
    }
}

// Function to update the score
function updateScore(player) {
    if (player === "X") {
        playerScore++;
        playerScoreDisplay.textContent = `${playerNameInput.value}: ${playerScore}`;
    } else if (player === "O") {
        computerScore++;
        computerScoreDisplay.textContent = `${computerNameInput.value}: ${computerScore}`;
    }
}

// Function to reset the game
function resetGame() {
    currentPlayer = "X";
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    cells.forEach((cell) => {
        cell.textContent = "";
    });
    resultDisplay.textContent = "";
}
