const params = new URLSearchParams(window.location.search);
const subjectId = params.get("subjectId");

fetch(`/api/lessons?subjectId=${subjectId}`)
  .then(res => res.json())
  .then(lessons => {
    const grid = document.getElementById("lessonGrid"); // ✅ FIXED ID

    lessons.forEach(l => {
      const card = document.createElement("div");
      card.className = "lesson-card";

      card.innerHTML = `
        <h3>${l.lesson_title}</h3>
        <p>${l.lesson_text.substring(0, 120)}...</p>
        <a class="lesson-btn"
           href="/lesson/lessonView.html?lessonId=${l.lesson_id}">
           Start Lesson →
        </a>
      `;

      grid.appendChild(card);
    });
  })
  .catch(err => console.error(err));
