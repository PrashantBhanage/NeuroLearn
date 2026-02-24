const params = new URLSearchParams(window.location.search);
const lessonId = params.get("lessonId");

// Load lesson data
fetch(`/api/lesson?lessonId=${lessonId}`)
  .then(res => res.json())
  .then(lesson => {
    document.getElementById("lessonTitle").innerText = lesson.lesson_title;
    
    // Set video URL
    if (lesson.video_url) {
      document.getElementById("videoFrame").src = lesson.video_url;
    }
    
    // Set notes
    if (lesson.notes) {
      document.getElementById("notesContent").innerText = lesson.notes;
    }
  });

// Show quiz prompt after user clicks "I'm Done Watching"
// The quiz prompt will appear as a button below the video
function showQuizPrompt() {
  document.getElementById("quizPrompt").style.display = "block";
  document.getElementById("doneWatchingBtn").style.display = "none";
}

// Auto-show after 2 minutes (120 seconds) as fallback
setTimeout(() => {
  showQuizPrompt();
}, 120000);

// Also show a button for users to click when done
document.getElementById("doneWatchingBtn").onclick = showQuizPrompt;

// Yes - go to quiz
document.getElementById("yesQuiz").onclick = () => {
  window.location.href = `/quiz/quiz.html?lessonId=${lessonId}`;
};

// No - go back to dashboard
document.getElementById("noQuiz").onclick = () => {
  window.location.href = "/";
};
