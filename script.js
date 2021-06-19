// The gameboard where all of the cards will be
const gameEle = document.querySelector("main");
// The colors that will uniquely identify each pair
let colors = [];
// Amount of card pairs for the game
let pairsNum;
// Elements to display scores
const bestScore = document.querySelector("#best-score");
const currentScore = document.querySelector("#current-score");
let currentScoreNum = 0;
let bestScoreNum = JSON.parse(localStorage.getItem("bestScore")) || 0;
bestScore.innerText = bestScoreNum;
currentScore.innerText = currentScoreNum;

// Handle form submit (game start)
const formEle = document.querySelector("form");
formEle.addEventListener("submit", e => {
  e.preventDefault();
  pairsNum = parseInt(pairsEle.value);
  addColors(pairsNum);
  makeBoard();
  formEle.remove();
});

// Handle selection of card pairs amount
const pairsEle = formEle.querySelector("#pairs-amount");
pairsEle.addEventListener("change", () => {
  pairsNum = parseInt(pairsEle.value);
  const showPairsEle = formEle.querySelector("#show-pairs");
  showPairsEle.innerText = pairsNum;
});

// Creates the colors for the pairs
function addColors(n) {
  // Adds colors into colors[]
  for (let i = 0; i < n; i++) {
    // Only nums 0-360
    const h = Math.floor(Math.random() * 360) + 1;
    // Only nums 50-100
    const s = Math.floor(Math.random() * 50) + 51;
    // Only nums 25-75
    const l = Math.floor(Math.random() * 50) + 26;
    // Matching colors for pairs
    colors.push(`hsl(${h}, ${s}%, ${l}%)`);
    colors.push(`hsl(${h}, ${s}%, ${l}%)`);
  }
}

// Mixes up the colors
function shuffleCards() {
  /*
  Code for shuffling inspired by Nitin Patel on June 18th, 2021
  https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
  */
  const mixedColors = [];
  for (let i = colors.length - 1; i > 0; i--) {
    const ranNum = Math.floor(Math.random() * i);
    // Swaps random value at index with current value of loop index
    const temp = colors[i];
    colors[i] = colors[ranNum];
    colors[ranNum] = temp;
  }
}

// Creates the cards & grid
function makeBoard() {
  // Figures out optimal amount of columns to use
  let gridColumns;
  if (pairsNum * 2 <= 4) {
    gridColumns = 2;
  } else if (pairsNum * 2 <= 9) {
    gridColumns = 3;
  } else if (pairsNum * 2 <= 16) {
    gridColumns = 4;
  } else if (pairsNum * 2 <= 25) {
    gridColumns = 5;
  } else {
    gridColumns = 6;
  }
  gameEle.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
  // Mixes the colors before looping & added them as cards
  shuffleCards();
  let id = 0;
  for (color of colors) {
    const card = document.createElement("div");
    card.dataset.color = color;
    card.dataset.id = id++;
    gameEle.append(card);
  }
}

// Keeps track of cards being clicked
const selectedCards = [];
// Handles card clicks on the board
gameEle.addEventListener("click", e => {
  // Stops execuion if not a card
  if (e.target.tagName !== "DIV") return;
  if (e.target.classList.contains("selected")) return;
  if (selectedCards.length === 0) {
    selectedCards.push(e.target);
  } else if (selectedCards.length === 1) {
    if (selectedCards[0].dataset.id !== e.target.dataset.id) {
      selectedCards.push(e.target);
      matchOperation();
    }
  }
  for (card of selectedCards) {
    card.classList.add("selected");
  }
});

// Takes care of card match process
function matchOperation() {
  // Increase the score
  currentScore.innerText = ++currentScoreNum;
  // Reveal cards
  for (card of selectedCards) {
    card.style.backgroundColor = card.dataset.color;
  }
  setTimeout(() => {
    // Handle match case
    if (selectedCards[0].dataset.color !== selectedCards[1].dataset.color) {
      // Are not matching
      selectedCards.forEach(c => {
        c.style.backgroundColor = "";
        c.classList.remove("selected");
      });
    } else {
      checkWin();
    }
    // Clears out selected cards
    selectedCards.pop();
    selectedCards.pop();
  }, 1000);
}

// Handles a gameover
function checkWin() {
  let gameover = true;
  const allCards = gameEle.querySelectorAll("div");
  for (let i = 0; i < allCards.length; i++) {
    if (!allCards[i].classList.contains("selected")) {
      gameover = false;
    }
  }
  if (gameover) {
    // Update high score
    if (currentScoreNum < bestScoreNum) {
      localStorage.setItem("bestScore", JSON.stringify(currentScoreNum));
      bestScore.innerText = currentScoreNum;
    }
    // Restart
    const restartButton = document.createElement("button");
    restartButton.innerText = "Restart";
    restartButton.addEventListener("click", () => {
      window.location.reload();
    });
    document.body.append(restartButton);
  }
}
