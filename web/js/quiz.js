(function initQuiz() {

const params = new URLSearchParams(window.location.search);
const lessonId = params.get("lessonId") || params.get("lessonid");

if (!lessonId) {
  document.getElementById("questionText").textContent =
    "Error: No lesson ID provided.";
  return;
}

let questions = [];
let currentIndex = 0;
let answered = false;

const questionText = document.getElementById("questionText");
const questionNumber = document.getElementById("questionNumber");
const optionsBox = document.getElementById("optionsBox");
const nextBtn = document.getElementById("nextBtn");

const quizBox = document.getElementById("quizBox");
const quizEndScreen = document.getElementById("quizEndScreen");

fetch(`/api/quiz?lessonId=${lessonId}`)
  .then(res => res.json())
  .then(data => {

    if (!Array.isArray(data) || data.length === 0) {
      questionText.textContent = "No questions available.";
      return;
    }

    questions = data;
    renderQuestion();
  })
  .catch(err => {
    questionText.textContent = "Error loading quiz.";
    console.error(err);
  });

/* ---------------------------
   ✅ Render Question
---------------------------- */
function renderQuestion() {

  answered = false;
  nextBtn.disabled = true;
  nextBtn.classList.remove("enabled");

  optionsBox.innerHTML = "";

  const q = questions[currentIndex];

  questionNumber.textContent =
    `🎯 Question ${currentIndex + 1} of ${questions.length}`;

  questionText.textContent = q.question;

  const options = {
    A: q.a,
    B: q.b,
    C: q.c,
    D: q.d
  };

  Object.entries(options).forEach(([key, value]) => {

    const div = document.createElement("div");
    div.className = "option";
    div.textContent = value;

    div.onclick = () => checkAnswer(div, key, q.correct);

    optionsBox.appendChild(div);
  });
}

/* ---------------------------
   ✅ Check Answer
---------------------------- */
function checkAnswer(el, selected, correct) {

  if (answered) return;
  answered = true;

  const all = document.querySelectorAll(".option");
  all.forEach(o => o.style.pointerEvents = "none");

  if (selected === correct) {

    el.classList.add("correct");

    nextBtn.disabled = false;
    nextBtn.classList.add("enabled");

  } else {

    el.classList.add("wrong");

    // Highlight correct answer
    const q = questions[currentIndex];
    all.forEach(o => {
      if (
        o.textContent ===
        (correct === "A" ? q.a :
         correct === "B" ? q.b :
         correct === "C" ? q.c :
         q.d)
      ) {
        o.classList.add("correct");
      }
    });

    // ✅ Show Retry Button
    showRetryButton();
  }
}

/* ---------------------------
   ✅ Retry Same Question Button
---------------------------- */
function showRetryButton() {

  let retryBtn = document.createElement("button");
  retryBtn.innerText = "🔁 Try Again";
  retryBtn.className = "retry-btn";

  retryBtn.onclick = () => {
    renderQuestion(); // reload same question
  };

  optionsBox.appendChild(retryBtn);
}

/* ---------------------------
   ✅ Next Button Click
---------------------------- */
nextBtn.onclick = () => {

  currentIndex++;

  if (currentIndex < questions.length) {

    renderQuestion();

  } else {

    showQuizCompleted();
  }
};

/* ---------------------------
   ✅ Quiz Completed Screen
---------------------------- */
function showQuizCompleted() {

  quizBox.style.display = "none";
  nextBtn.style.display = "none";

  quizEndScreen.style.display = "block";

  // Dashboard Button
  document.getElementById("goDashboardBtn").onclick = () => {
  window.location.href = "/";
};


  // Retry Full Quiz Button
  document.getElementById("retryQuizBtn").onclick = () => {
    window.location.reload();
  };
}

})();
