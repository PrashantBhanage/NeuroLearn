// Subject Lessons JavaScript

// Lesson icons mapping
const lessonIcons = {
  'Reading': '📖',
  'Math': '🔢',
  'Science': '🔬',
  'English': '📜',
  'Geography': '🌍',
  'Art': '🎨',
  'Music': '🎵',
  'History': '📚',
  'default': '📚'
};

// Lesson color classes
const lessonColors = {
  'Reading': 'reading',
  'Math': 'math',
  'Science': 'science',
  'English': 'english',
  'Geography': 'geography',
  'Art': 'art',
  'Music': 'music',
  'History': 'history',
  'default': 'default'
};

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const userData = localStorage.getItem('neurolearn_user');
  if (!userData) {
    window.location.href = '/login/login.html';
    return;
  }

  // Initialize dark mode
  initDarkMode();

  // Load lessons
  loadLessons();
});

function loadLessons() {
  const urlParams = new URLSearchParams(window.location.search);
  const subjectId = urlParams.get('subject') || urlParams.get('subjectId');

  if (!subjectId) {
    showError('No subject selected');
    return;
  }

  // Fetch lessons for this subject
  fetch(`/api/lessons?subject_id=${subjectId}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        displayLessons(data.lessons, data.subject_name);
      } else {
        showError(data.error || 'Failed to load lessons');
      }
    })
    .catch(error => {
      console.error('Error loading lessons:', error);
      showError('Connection error. Please try again.');
    });
}

function displayLessons(lessons, subjectName) {
  const grid = document.getElementById('lessonGrid');
  
  if (lessons.length === 0) {
    grid.innerHTML = '<div class="no-lessons">No lessons available for this subject yet.</div>';
    return;
  }

  grid.innerHTML = lessons.map(lesson => {
    const icon = lessonIcons[lesson.title] || lessonIcons[subjectName] || lessonIcons['default'];
    const colorClass = lessonColors[lesson.title] || lessonColors[subjectName] || lessonColors['default'];
    
    return `
      <a href="/lesson/lessonView.html?lessonId=${lesson.lesson_id}" 
         class="lesson-tile ${colorClass}" 
         onclick="handleTileClick(this)">
        <div class="lesson-icon-wrapper">
          <span class="lesson-icon">${icon}</span>
        </div>
        <h3>${lesson.title}</h3>
      </a>
    `;
  }).join('');
}

function handleTileClick(tile) {
  tile.classList.add('clicked');
  setTimeout(() => {
    tile.classList.remove('clicked');
  }, 500);
}

function showError(message) {
  const grid = document.getElementById('lessonGrid');
  grid.innerHTML = `<div class="error-message">${message}</div>`;
}

// Initialize dark mode
function initDarkMode() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('dark-mode');
  }
}
