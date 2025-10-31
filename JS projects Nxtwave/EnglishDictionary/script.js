// Elements
const input = document.getElementById("searchInput");
const btn = document.getElementById("searchBtn");
const output = document.getElementById("output");
const status = document.getElementById("status");
const errBox = document.getElementById("error");

// Helper to show/hide loading and errors
function showLoading(show = true) {
  status.style.display = show ? "flex" : "none";
  output.style.display = "none";
  errBox.style.display = "none";
}

function showError(message) {
  errBox.textContent = message;
  errBox.style.display = "block";
  status.style.display = "none";
  output.style.display = "none";
}

// Format and render results to DOM
function render(data) {
  status.style.display = "none";
  errBox.style.display = "none";
  output.style.display = "block";
  output.innerHTML = "";

  const entry = data[0];
  const word = entry.word || "";
  const phoneticObj = (entry.phonetics || []).find((p) => p.text) || {};
  const audioObj =
    (entry.phonetics || []).find((p) => p.audio && p.audio.trim()) || {};

  const wordRow = document.createElement("div");
  wordRow.className = "word-row";
  wordRow.innerHTML = `
    <div>
      <div class="word">${sanitize(word)}</div>
      <div class="phonetic">${sanitize(phoneticObj.text || "")}</div>
    </div>
  `;

  const audioBtn = document.createElement("button");
  audioBtn.className = "audio-btn";
  audioBtn.type = "button";
  audioBtn.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11 5 L6 9 H2 v6 h4 l5 4 V5 z" stroke="#000" stroke-width="1" fill="none"/></svg><span>Play</span>';
  audioBtn.onclick = () => playAudio(word, audioObj.audio);

  wordRow.appendChild(audioBtn);
  output.appendChild(wordRow);

  const meanings = entry.meanings || [];
  const defsContainer = document.createElement("div");
  defsContainer.className = "definitions";

  for (const meaning of meanings) {
    const part = document.createElement("div");
    part.className = "part";
    part.textContent = meaning.partOfSpeech || "";
    defsContainer.appendChild(part);

    const definitions = meaning.definitions || [];
    for (const def of definitions) {
      const box = document.createElement("div");
      box.className = "definition";
      let html = `<div>${sanitize(def.definition || "")}</div>`;
      if (def.example)
        html += `<div style="margin-top:6px;color:var(--muted);font-size:13px;">Example: "${sanitize(
          def.example
        )}"</div>`;
      if (def.synonyms && def.synonyms.length)
        html += `<div style="margin-top:6px;color:var(--muted);font-size:13px;">Synonyms: ${def.synonyms.join(
          ", "
        )}</div>`;
      box.innerHTML = html;
      defsContainer.appendChild(box);
    }
  }

  output.appendChild(defsContainer);

  const source = document.createElement("div");
  source.style.marginTop = "12px";
  source.style.fontSize = "12px";
  source.style.color = "rgba(0,0,0,0.6)";
  source.innerHTML = `Source: <a href="https://dictionaryapi.dev/" target="_blank">dictionaryapi.dev</a>`;
  output.appendChild(source);
}

function sanitize(str) {
  if (!str) return "";
  return String(str).replace(
    /[&<>"']/g,
    (s) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[s])
  );
}

function playAudio(word, audioUrl) {
  if (audioUrl) {
    try {
      const a = new Audio(audioUrl);
      a.play().catch(() => speak(word));
    } catch {
      speak(word);
    }
  } else {
    speak(word);
  }
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    alert(
      "No audio available and your browser does not support speechSynthesis."
    );
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

async function lookup(word) {
  if (!word || !word.trim()) {
    showError("Please enter a word to search.");
    return;
  }
  word = word.trim();
  showLoading(true);

  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
    word
  )}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) {
        showError(`Word "${word}" not found.`);
        return;
      } else {
        throw new Error(`API error (${res.status})`);
      }
    }
    const data = await res.json();
    render(data);
  } catch (err) {
    if (err instanceof TypeError) {
      showError("Network error or CORS issue. Check your internet connection.");
    } else {
      showError("An unexpected error occurred.");
    }
    console.error(err);
  }
}

btn.addEventListener("click", () => lookup(input.value));
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") lookup(input.value);
});

// Optional word of the day
(function wordOfTheDay() {
  const sample = "hello";
  input.value = sample;
})();
