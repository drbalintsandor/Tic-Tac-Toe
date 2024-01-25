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
let lastWinningMove = null;

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
        lastWinningMove = index;
        if (player === "O") {
            resultDisplay.textContent = `${computerNameInput.value} wins!`;
        } else {
            resultDisplay.textContent = `Player ${player} wins!`;
        }
        updateScore(player);
        setTimeout(() => {
            startNewGame();
        }, 1000);
    } else if (isBoardFull()) {
        resultDisplay.textContent = "It's a draw!";
        setTimeout(() => {
            startNewGame(); 
        }, 1000);
    }
}

// Function to check for a winner
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
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
            
            gameBoard[i] = "O";
            if (checkWinner()) {
                gameBoard[i] = ""; 
                return i;
            }
            gameBoard[i] = ""; /
        }
    }
    return null;
}

// Helper function to find a blocking move
function getBlockingMove() {
    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === "") {
            gameBoard[i] = "X";
            if (checkWinner()) {
                gameBoard[i] = ""; 
                return i;
            }
            gameBoard[i] = ""; 
        }
    }
    return null;
}

// Function to update the score
function updateScore(player) {
    if (player === "X") {
        playerScore++;
        playerScoreDisplay.textContent = `${playerNameInput.value}: ${playerScore}`;
        if (playerScore === 5) {
            
            showCongratulationsMessage();
        }
    } else if (player === "O") {
        computerScore++;
        computerScoreDisplay.textContent = `${computerNameInput.value}: ${computerScore}`;
        if (computerScore === 5) {
        
            showLoserMessage();
        }
    }
}

// Function to show congratulations message
function showCongratulationsMessage() {
    Swal.fire({
        title: "Congratulations, you won!",
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff url(/images/trees.png)",
        backdrop: `
            rgba(0,0,123,0.4)
            url("/images/nyan-cat.gif")
            left top
            no-repeat
        `,
    });
}

// Function to show loser message
function showLoserMessage() {
    Swal.fire({
        title: "You Lost!Loser!",
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff url(/images/trees.png)",
        backdrop: `
            rgba(0,0,123,0.4)
            url("/images/nyan-cat.gif")
            left top
            no-repeat
        `,
    });
}

// Function to reset the game and scores
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    playerScoreDisplay.textContent = `${playerNameInput.value}: 0`;
    computerScoreDisplay.textContent = `${computerNameInput.value}: 0`;
    startNewGame();
}

// Function to start a new game
function startNewGame() {
    currentPlayer = "X";
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    lastWinningMove = null;
    cells.forEach((cell) => {
        cell.textContent = "";
    });
    resultDisplay.textContent = "";
}
