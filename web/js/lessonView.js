const params = new URLSearchParams(window.location.search);
const lessonId = params.get("lessonId");

fetch(`/api/lesson?lessonId=${lessonId}`)
  .then(res => res.json())
  .then(lesson => {
    document.getElementById("lessonTitle").innerText =
      lesson.lesson_title;

    document.getElementById("lessonText").innerText =
      lesson.lesson_text;
  });

document.getElementById("startQuiz").onclick = () => {
  window.location.href =
    `/quiz/quiz.html?lessonId=${lessonId}`;
};
