const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const progressBar = document.getElementById("progress-bar");
const questionContainer = document.getElementById("question-container");
const timeDisplay = document.getElementById("time");
const difficultyLabel = document.getElementById("difficulty-label");
const scoreText = document.getElementById("score-text");
const highScoreSection = document.getElementById("high-score-section");
const usernameInput = document.getElementById("username");
const highscoreModal = document.getElementById("highscore-modal");
const highscoreList = document.getElementById("highscore-list");

const startBtn = document.getElementById("start-btn");
const playAgainBtn = document.getElementById("play-again");
const viewScoresBtn = document.getElementById("view-scores");
const saveScoreBtn = document.getElementById("save-score");
const closeModalBtn = document.getElementById("close-modal");

let questions = [];
let currentIndex = 0;
let score = 0;
let timeLeft = 90;
let timer;
let selectedDifficulty = "easy";

document.querySelectorAll(".difficulty .btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    selectedDifficulty = e.target.dataset.difficulty;
    document
      .querySelectorAll(".difficulty .btn")
      .forEach((b) => b.classList.remove("selected"));
    e.target.classList.add("selected");
  });
});

startBtn.addEventListener("click", startQuiz);

function startQuiz() {
  startScreen.classList.add("hide");
  quizScreen.classList.remove("hide");
  difficultyLabel.textContent = `Difficulty: ${
    selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)
  }`;
  loadQuestions();
  startTimer();
  showQuestion();
}

function loadQuestions() {
  questions = [
    {
      question: "Which animal says 'moo'?",
      options: ["Dog", "Cat", "Cow", "Sheep"],
      answer: 2,
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      answer: 1,
    },
    {
      question: "What color is the sky?",
      options: ["Green", "Blue", "Yellow", "Red"],
      answer: 1,
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Venus", "Jupiter"],
      answer: 1,
    },
    {
      question: "What do bees produce?",
      options: ["Milk", "Honey", "Juice", "Water"],
      answer: 1,
    },
  ];
}

function showQuestion() {
  if (currentIndex >= questions.length) {
    return endQuiz();
  }

  const q = questions[currentIndex];
  questionContainer.innerHTML = `
    <h3>Question ${currentIndex + 1} of ${questions.length}</h3>
    <p>${q.question}</p>
    ${q.options
      .map(
        (opt, i) =>
          `<button class="option btn" onclick="selectAnswer(${i})">${opt}</button>`
      )
      .join("")}
  `;
  updateProgress();
}

function selectAnswer(index) {
  const correct = questions[currentIndex].answer;
  if (index === correct) score++;
  currentIndex++;
  showQuestion();
}

function updateProgress() {
  const progress = (currentIndex / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    let minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    let seconds = String(timeLeft % 60).padStart(2, "0");
    timeDisplay.textContent = `${minutes}:${seconds}`;
    if (timeLeft <= 0) endQuiz();
  }, 1000);
}

function endQuiz() {
  clearInterval(timer);
  quizScreen.classList.add("hide");
  resultScreen.classList.remove("hide");

  const percent = Math.round((score / questions.length) * 100);
  scoreText.innerHTML = `Your Score: ${score} / ${questions.length} <br> ${percent}% <br> Difficulty: ${selectedDifficulty}`;

  // Show high score input if score ≥ 60%
  if (percent >= 60) {
    highScoreSection.classList.remove("hide");
  } else {
    highScoreSection.classList.add("hide");
  }
}

// Save High Score
saveScoreBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (!username) return alert("Please enter your name!");

  const percent = Math.round((score / questions.length) * 100);
  const newScore = {
    name: username,
    score: percent,
  };

  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScores.push(newScore);

  // Sort by highest score
  highScores.sort((a, b) => b.score - a.score);

  // Keep only top 5
  highScores.splice(5);

  localStorage.setItem("highScores", JSON.stringify(highScores));

  alert("High score saved successfully!");
  usernameInput.value = "";
});

// View High Scores
viewScoresBtn.addEventListener("click", () => {
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highscoreList.innerHTML = highScores.length
    ? highScores
        .map((s, i) => `<li>${i + 1}. ${s.name} — ${s.score}%</li>`)
        .join("")
    : "<li>No high scores yet!</li>";

  highscoreModal.classList.remove("hide");
});

// Close High Score Modal
closeModalBtn.addEventListener("click", () => {
  highscoreModal.classList.add("hide");
});

// Play Again
playAgainBtn.addEventListener("click", () => {
  location.reload();
});
