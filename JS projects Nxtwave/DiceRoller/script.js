const dice = document.getElementById("dice");
const rollBtn = document.getElementById("rollBtn");
const historyDiv = document.getElementById("history");

const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
let rollHistory = [];

function rollDice() {
  const randomIndex = Math.floor(Math.random() * 6);
  const rolledFace = diceFaces[randomIndex];

  // show current roll
  dice.textContent = rolledFace;

  // add to history (most recent on top)
  rollHistory.unshift(rolledFace);

  // update display
  updateHistory();
}

function updateHistory() {
  historyDiv.innerHTML = ""; // clear old content

  rollHistory.forEach((face, index) => {
    const rollNumber = rollHistory.length - index; // correct numbering
    const item = document.createElement("div");
    item.classList.add("history-item");
    item.innerHTML = `<span>Roll ${rollNumber}:</span> <span>${face}</span>`;
    historyDiv.appendChild(item);
  });
}

rollBtn.addEventListener("click", rollDice);
