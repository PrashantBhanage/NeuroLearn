const params = new URLSearchParams(window.location.search);
const lessonId = params.get("lessonId");

const container = document.querySelector(".quiz-container");

fetch(`/api/quiz?lessonId=${lessonId}`)
    .then(res => res.json())
    .then(data => {

        container.innerHTML = `<h2>Quiz</h2>`;

        data.forEach((q, index) => {
            const div = document.createElement("div");
            div.innerHTML = `
                <p><b>${index + 1}. ${q.question}</b></p>
                <label><input type="radio" name="q${index}"> ${q.a}</label><br>
                <label><input type="radio" name="q${index}"> ${q.b}</label><br>
                <label><input type="radio" name="q${index}"> ${q.c}</label><br>
                <label><input type="radio" name="q${index}"> ${q.d}</label><br><br>
            `;
            container.appendChild(div);
        });

    });
