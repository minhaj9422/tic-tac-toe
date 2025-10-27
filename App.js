let cells = document.querySelectorAll(".cell");
let statusText = document.getElementById("status");
let winSound = document.getElementById("winSound");
let popup = document.getElementById("popup");

let currentPlayer = "X";
let gameActive = true;
let gameMode = "player";
let board = ["", "", "", "", "", "", "", "", ""];
let modeSelected = false;


const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

cells.forEach(cell => {
  cell.addEventListener("click", () => handleClick(cell));
});

function setMode(mode) {
  gameMode = mode;
  modeSelected = true;
  resetGame();
  statusText.textContent = `Mode: ${mode === "computer" ? "Player vs Computer" : "Player vs Player"} | Player ${currentPlayer}'s turn`;
}


function handleClick(cell) {
  if (!modeSelected) {
    statusText.textContent = "Please select a mode to start the game!";
    return;
  }

  const index = cell.dataset.index;
  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.style.color = currentPlayer === "X" ? "#dc3545" : "#17a2b8";

  if (checkWinner()) {
    statusText.textContent = `🎉 Player ${currentPlayer} wins!`;
    highlightWinner();
    winSound.play();
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    popup.textContent = `🎉 Player ${currentPlayer} Wins!`;
    popup.classList.remove("hidden");
    gameActive = false;
  } else if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;

    if (gameMode === "computer" && currentPlayer === "O") {
      setTimeout(computerMove, 500);
    }
  }
}


function computerMove() {
  if (!gameActive) return;

  // 1. Try to win
  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    const values = [board[a], board[b], board[c]];
    if (values.filter(v => v === "O").length === 2 && values.includes("")) {
      const emptyIndex = combo.find(i => board[i] === "");
      return handleClick(cells[emptyIndex]);
    }
  }

  // 2. Try to block player
  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    const values = [board[a], board[b], board[c]];
    if (values.filter(v => v === "X").length === 2 && values.includes("")) {
      const emptyIndex = combo.find(i => board[i] === "");
      return handleClick(cells[emptyIndex]);
    }
  }

  // 3. Otherwise, pick random
  let emptyIndices = board.map((val, i) => val === "" ? i : null).filter(i => i !== null);
  if (emptyIndices.length === 0) return;

  let randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  handleClick(cells[randomIndex]);
}


function checkWinner() {
  return winningCombos.some(combo => {
    return combo.every(i => board[i] === currentPlayer);
  });
}

function highlightWinner() {
  winningCombos.forEach(combo => {
    if (combo.every(i => board[i] === currentPlayer)) {
      combo.forEach(i => {
        cells[i].style.backgroundColor = "#28a745";
        cells[i].style.color = "white";
      });
    }
  });
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  cells.forEach(cell => {
    cell.textContent = "";
    cell.style.backgroundColor = "#ffffff";
    cell.style.color = "#212529";
  });
  currentPlayer = "X";
  gameActive = true;
  popup.classList.add("hidden");
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function newGame() {
  resetGame();
  winSound.pause();
  winSound.currentTime = 0;
}
