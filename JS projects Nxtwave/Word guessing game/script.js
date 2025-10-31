const words = [
  { word: "apple", hint: "A red or green fruit" },
  { word: "elephant", hint: "The largest land animal" },
  { word: "computer", hint: "Used for coding and browsing" },
  { word: "river", hint: "Flows from mountains to the sea" },
  { word: "guitar", hint: "A musical instrument with strings" },
];

let chosenWordObj, chosenWord, displayWord, guessedLetters;

// Elements
const hintEl = document.getElementById("hint");
const wordDisplayEl = document.getElementById("wordDisplay");
const message = document.getElementById("message");
const guessedLettersDisplay = document.getElementById("guessedLetters");
const letterInput = document.getElementById("letterInput");
const guessBtn = document.getElementById("guessBtn");

// Create Play Again button
const playAgainBtn = document.createElement("button");
playAgainBtn.textContent = "🔄 Play Again";
playAgainBtn.style.marginTop = "15px";
playAgainBtn.style.display = "none";
playAgainBtn.style.background = "#2ecc71";
playAgainBtn.style.color = "#fff";
playAgainBtn.style.padding = "10px 16px";
playAgainBtn.style.border = "none";
playAgainBtn.style.borderRadius = "8px";
playAgainBtn.style.cursor = "pointer";
playAgainBtn.style.fontSize = "16px";
document.querySelector(".game-container").appendChild(playAgainBtn);

playAgainBtn.addEventListener("click", startNewGame);

function startNewGame() {
  // Pick a random word
  chosenWordObj = words[Math.floor(Math.random() * words.length)];
  chosenWord = chosenWordObj.word.toLowerCase();
  displayWord = Array(chosenWord.length).fill("_");
  guessedLetters = [];

  // Reset UI
  hintEl.textContent = "💡 Hint: " + chosenWordObj.hint;
  wordDisplayEl.textContent = displayWord.join(" ");
  guessedLettersDisplay.textContent = "";
  message.textContent = "";
  letterInput.value = "";
  letterInput.disabled = false;
  guessBtn.disabled = false;
  playAgainBtn.style.display = "none";
}

// Game start
startNewGame();

// Event listeners
guessBtn.addEventListener("click", handleGuess);
letterInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleGuess();
});

function handleGuess() {
  const guess = letterInput.value.toLowerCase();
  message.textContent = "";

  // Validation: single alphabet
  if (!/^[a-zA-Z]$/.test(guess)) {
    message.textContent = "❌ Please enter a single alphabet letter!";
    letterInput.value = "";
    return;
  }

  // Check for repeated guess
  if (guessedLetters.includes(guess)) {
    message.textContent = "⚠️ You already guessed that letter!";
    letterInput.value = "";
    return;
  }

  guessedLetters.push(guess);
  guessedLettersDisplay.textContent =
    "Guessed Letters: " + guessedLetters.join(", ");

  // Update display
  if (chosenWord.includes(guess)) {
    for (let i = 0; i < chosenWord.length; i++) {
      if (chosenWord[i] === guess) displayWord[i] = guess;
    }
    wordDisplayEl.textContent = displayWord.join(" ");
  } else {
    message.textContent = "❌ Wrong guess!";
  }

  // Win condition
  if (!displayWord.includes("_")) {
    message.textContent = `🎉 Congratulations! You guessed the word: ${chosenWord.toUpperCase()}`;
    letterInput.disabled = true;
    guessBtn.disabled = true;
    playAgainBtn.style.display = "inline-block";
  }

  letterInput.value = "";
}
