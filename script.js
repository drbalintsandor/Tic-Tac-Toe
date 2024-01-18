const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const resultDisplay = document.getElementById("result");
const playerNameInput = document.getElementById("playerName") || { value: "Player" };
const computerNameInput = document.getElementById("computerName") || { value: "Computer" };
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
        if (player === "O") {
            resultDisplay.textContent = `${computerNameInput.value} wins!`;
        } else {
            resultDisplay.textContent = `Player ${player} wins!`;
        }
        updateScore(player);
    } else if (isBoardFull()) {
        resultDisplay.textContent = "It's a draw!";
        resetGame(); // Start a new game immediately after a draw
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
    const winningMove = getWinningMove();
    const blockingMove = getBlockingMove();

    // Priority: Winning move > Blocking move > Random move
    if (winningMove !== null) {
        makeMove(winningMove, "O");
    } else if (blockingMove !== null) {
        makeMove(blockingMove, "O");
    } else {
        // If no winning or blocking move, make a random move
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
}

// Helper function to find a winning move
function getWinningMove() {
    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === "") {
            // Simulate making the move and check for a win
            gameBoard[i] = "O";
            if (checkWinner()) {
                gameBoard[i] = ""; // Reset the move
                return i;
            }
            gameBoard[i] = ""; // Reset the move
        }
    }
    return null;
}

// Helper function to find a blocking move
function getBlockingMove() {
    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === "") {
            // Simulate making the move and check for a player win
            gameBoard[i] = "X";
            if (checkWinner()) {
                gameBoard[i] = ""; // Reset the move
                return i;
            }
            gameBoard[i] = ""; // Reset the move
        }
    }
    return null;
}

// Function to update the score and start a new game
function updateScore(player) {
    if (player === "X") {
        playerScore++;
        playerScoreDisplay.textContent = `${playerNameInput.value}: ${playerScore}`;
    } else if (player === "O") {
        computerScore++;
        computerScoreDisplay.textContent = `${computerNameInput.value}: ${computerScore}`;
    }

    // Reset the game for a new round after a delay
    setTimeout(() => {
        currentPlayer = "X";
        gameBoard = ["", "", "", "", "", "", "", "", ""];
        gameOver = false;
        cells.forEach((cell) => {
            cell.textContent = "";
        });
        resultDisplay.textContent = "";

        // If the computer starts, make its move
        if (currentPlayer === "O") {
            computerMove();
            currentPlayer = "X";
        }
    }, 1000); // Adjust the delay time as needed
}

// Function to reset the game and scores
function resetGame() {
    currentPlayer = "X";
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    cells.forEach((cell) => {
        cell.textContent = "";
    });
    resultDisplay.textContent = "";
    playerScore = 0;
    computerScore = 0;
    playerScoreDisplay.textContent = `${playerNameInput.value}: 0`;
    computerScoreDisplay.textContent = `${computerNameInput.value}: 0`;

    // If the computer starts, make its move
    if (currentPlayer === "O") {
        computerMove();
        currentPlayer = "X";
    }
}
