// Function to update progress
function updateProgress(newProgress) {
  const userData = localStorage.getItem('neurolearn_user');
  if (!userData) return;
  
  const currentUser = JSON.parse(userData);
  currentUser.progress = newProgress;
  localStorage.setItem('neurolearn_user', JSON.stringify(currentUser));
  
  // Sync with server
  fetch('/api/update-progress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `user_id=${currentUser.user_id}&progress=${newProgress}`
  });
}

// Time tracking variables
let lessonStartTime = Date.now();
let timeSpentSeconds = 0;

// Function to track time spent on lesson
function trackTimeSpent() {
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - lessonStartTime) / 1000);
  timeSpentSeconds = elapsedSeconds;
  
  // Update time in localStorage every second
  const userData = localStorage.getItem('neurolearn_user');
  if (userData) {
    const currentUser = JSON.parse(userData);
    if (!currentUser.totalTimeSpent) {
      currentUser.totalTimeSpent = 0;
    }
    // Add 1 second to total
    currentUser.totalTimeSpent += 1;
    localStorage.setItem('neurolearn_user', JSON.stringify(currentUser));
  }
}

// Start time tracking - update every 1 second for accuracy
setInterval(trackTimeSpent, 1000);

// Also save time when user leaves the page
window.addEventListener('beforeunload', function() {
  const userData = localStorage.getItem('neurolearn_user');
  if (userData) {
    const currentUser = JSON.parse(userData);
    if (!currentUser.totalTimeSpent) {
      currentUser.totalTimeSpent = 0;
    }
    // Add remaining time
    const now = Date.now();
    const remainingSeconds = Math.floor((now - lessonStartTime) / 1000) - timeSpentSeconds;
    if (remainingSeconds > 0) {
      currentUser.totalTimeSpent += remainingSeconds;
      localStorage.setItem('neurolearn_user', JSON.stringify(currentUser));
    }
  }
});


// Function to update streak based on 24-hour periods
function updateStreak() {
  const userData = localStorage.getItem('neurolearn_user');
  if (!userData) return;
  
  const currentUser = JSON.parse(userData);
  const now = new Date();
  const today = now.toDateString();
  
  // Initialize streak data if not exists
  if (!currentUser.streakData) {
    currentUser.streakData = {
      lastActiveDate: null,
      currentStreak: 0
    };
  }
  
  const lastDate = currentUser.streakData.lastActiveDate;
  
  // If first time or different day
  if (lastDate !== today) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if last active was yesterday (consecutive day)
    if (lastDate === yesterday.toDateString()) {
      currentUser.streakData.currentStreak += 1;
    } else if (lastDate !== today) {
      // Reset streak if gap more than 1 day
      currentUser.streakData.currentStreak = 1;
    }
    
    currentUser.streakData.lastActiveDate = today;
    localStorage.setItem('neurolearn_user', JSON.stringify(currentUser));
  }
}

// Function to mark lesson as completed
function markLessonCompleted(lessonId) {

  const userData = localStorage.getItem('neurolearn_user');
  if (!userData) return;
  
  const currentUser = JSON.parse(userData);
  
  // Initialize completedLessons array if it doesn't exist
  if (!currentUser.completedLessons) {
    currentUser.completedLessons = [];
  }
  
  // Check if lesson is already completed
  if (!currentUser.completedLessons.includes(lessonId)) {
    // Add lesson to completed list
    currentUser.completedLessons.push(lessonId);
    
    // Calculate new progress based on completed lessons (20 lessons total = 100%)
    const totalLessons = 20;
    const completedCount = currentUser.completedLessons.length;
    const newProgress = Math.min(Math.round((completedCount / totalLessons) * 100), 100);
    
    currentUser.progress = newProgress;
    localStorage.setItem('neurolearn_user', JSON.stringify(currentUser));
    
    // Sync with server
    fetch('/api/update-progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `user_id=${currentUser.user_id}&progress=${newProgress}`
    });
  }
}


const params = new URLSearchParams(window.location.search);
const lessonId = params.get("lessonId") || params.get("lesson_id");

if (!lessonId) {
  document.getElementById("lessonTitle").innerText = "Error: No lesson ID provided";
  console.error("No lesson ID found in URL");
} else {
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
  })
  .catch(err => {

    console.error("Error loading lesson:", err);
    document.getElementById("lessonTitle").innerText = "Error loading lesson";
  });
}

// Show quiz prompt after user clicks "I'm Done Watching"

// The quiz prompt will appear as a button below the video
function showQuizPrompt() {
  document.getElementById("quizPrompt").style.display = "block";
  document.getElementById("doneWatchingBtn").style.display = "none";
  
  // Update streak (24-hour based)
  updateStreak();
  
  // Mark lesson as completed (only counts once)
  if (lessonId) {
    markLessonCompleted(lessonId);
  }
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
