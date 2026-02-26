// Profile Page JavaScript

let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const userData = localStorage.getItem('neurolearn_user');
  if (!userData) {
    window.location.href = '/login/login.html';
    return;
  }

  currentUser = JSON.parse(userData);
  
  // Load user data
  loadUserProfile();

  // Initialize dark mode
  initDarkMode();

  // Event Listeners
  setupEventListeners();
});

function loadUserProfile() {
  if (!currentUser) return;

  document.getElementById('username').textContent = currentUser.username;
  document.getElementById('email').textContent = currentUser.email;
  document.getElementById('progress').textContent = currentUser.progress + '%';
  document.getElementById('progressFill').style.width = currentUser.progress + '%';
  
  // Set profile picture
  const profileImage = document.getElementById('profileImage');
  if (currentUser.profile_picture && currentUser.profile_picture !== 'default.png') {
    profileImage.src = '/images/' + currentUser.profile_picture;
  } else {
    profileImage.src = '/images/default-avatar.png';
  }
  
  // Calculate and display learning stats
  calculateLearningStats();
  
  // Check for 100% progress celebration
  if (currentUser.progress >= 100) {
    showCelebration();
  }
}

function calculateLearningStats() {
  // Get actual completed lessons from user data
  const completedLessons = currentUser.completedLessons || [];
  const lessonsCompleted = completedLessons.length;
  
  // Calculate progress based on actual completed lessons (20 lessons total = 100%)
  const totalLessons = 20;
  const actualProgress = Math.min(Math.round((lessonsCompleted / totalLessons) * 100), 100);
  
  // Update progress display to match actual completed lessons
  document.getElementById('progress').textContent = actualProgress + '%';
  document.getElementById('progressFill').style.width = actualProgress + '%';
  
  // Get actual streak from streakData (24-hour based)
  let streakDays = 0;
  if (currentUser.streakData) {
    streakDays = currentUser.streakData.currentStreak || 0;
  }
  
  // Get actual time spent from tracked data (in seconds)
  const totalTimeSeconds = currentUser.totalTimeSpent || 0;
  
  // Format time display based on actual seconds spent
  let timeDisplay;
  if (totalTimeSeconds < 60) {
    // Less than 1 minute - show seconds
    timeDisplay = totalTimeSeconds + 's';
  } else if (totalTimeSeconds < 3600) {
    // Less than 1 hour - show minutes and seconds
    const minutes = Math.floor(totalTimeSeconds / 60);
    const seconds = totalTimeSeconds % 60;
    timeDisplay = seconds > 0 ? minutes + 'm ' + seconds + 's' : minutes + 'm';
  } else {
    // 1 hour or more - show hours, minutes, seconds
    const hours = Math.floor(totalTimeSeconds / 3600);
    const remainingSeconds = totalTimeSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    
    if (minutes > 0 && seconds > 0) {
      timeDisplay = hours + 'h ' + minutes + 'm ' + seconds + 's';
    } else if (minutes > 0) {
      timeDisplay = hours + 'h ' + minutes + 'm';
    } else if (seconds > 0) {
      timeDisplay = hours + 'h ' + seconds + 's';
    } else {
      timeDisplay = hours + 'h';
    }
  }
  
  // Determine level based on actual completed lessons
  let level = 'Beginner';
  if (lessonsCompleted >= 5) level = 'Novice';
  if (lessonsCompleted >= 10) level = 'Intermediate';
  if (lessonsCompleted >= 15) level = 'Advanced';
  if (lessonsCompleted >= 20) level = 'Expert';
  
  // Update the DOM with actual values
  document.getElementById('lessonsCompleted').textContent = lessonsCompleted;
  document.getElementById('streakDays').textContent = streakDays;
  document.getElementById('timeSpent').textContent = timeDisplay;
  document.getElementById('currentLevel').textContent = level;
}

function setupEventListeners() {
  // Change Avatar Button
  document.getElementById('changeAvatarBtn').addEventListener('click', function() {
    document.getElementById('avatarInput').click();
  });

  // Avatar Input Change
  document.getElementById('avatarInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      // Convert file to Base64 and upload
      const reader = new FileReader();
      reader.onload = function(event) {
        const base64Image = event.target.result;
        updateProfilePicture(file.name, base64Image);
      };
      reader.readAsDataURL(file);
    }
  });

  // Edit Username Button
  document.getElementById('editUsernameBtn').addEventListener('click', function() {
    document.getElementById('newUsername').value = currentUser.username;
    document.getElementById('editModal').style.display = 'flex';
  });

  // Save Username
  document.getElementById('saveUsernameBtn').addEventListener('click', function() {
    const newUsername = document.getElementById('newUsername').value.trim();
    if (newUsername && newUsername !== currentUser.username) {
      updateUsername(newUsername);
    } else {
      closeModal();
    }
  });

  // Cancel Edit
  document.getElementById('cancelEditBtn').addEventListener('click', closeModal);

  // Logout Button
  document.getElementById('logoutBtn').addEventListener('click', logout);
}

function closeModal() {
  document.getElementById('editModal').style.display = 'none';
}

async function updateProfilePicture(fileName, base64Image) {
  try {
    const response = await fetch('/api/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `user_id=${currentUser.user_id}&profile_picture=${encodeURIComponent(fileName)}&image_data=${encodeURIComponent(base64Image)}`
    });

    const data = await response.json();

    if (data.success) {
      // Update local storage
      currentUser.profile_picture = data.user.profile_picture;
      localStorage.setItem('neurolearn_user', JSON.stringify(currentUser));
      
      // Update UI with the new image (use the returned path or the base64)
      document.getElementById('profileImage').src = '/images/' + data.user.profile_picture;
      
      showMessage('Profile picture updated!', 'success');
    } else {
      showMessage(data.error || 'Failed to update profile picture', 'error');
    }
  } catch (error) {
    showMessage('Connection error. Please try again.', 'error');
  }
}

async function updateUsername(newUsername) {
  try {
    const response = await fetch('/api/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `user_id=${currentUser.user_id}&username=${encodeURIComponent(newUsername)}`
    });

    const data = await response.json();

    if (data.success) {
      // Update local storage
      currentUser.username = data.user.username;
      localStorage.setItem('neurolearn_user', JSON.stringify(currentUser));
      
      // Update UI
      document.getElementById('username').textContent = newUsername;
      
      closeModal();
      showMessage('Username updated!', 'success');
    } else {
      showMessage(data.error || 'Failed to update username', 'error');
    }
  } catch (error) {
    showMessage('Connection error. Please try again.', 'error');
  }
}

function logout() {
  // Clear localStorage
  localStorage.removeItem('neurolearn_user');
  
  // Redirect to login page
  window.location.href = '/login/login.html';
}

function showMessage(text, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = text;
  messageDiv.className = 'message ' + type;
  messageDiv.style.display = 'block';

  // Hide after 3 seconds
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 3000);
}

// Celebration Modal for 100% Progress
function showCelebration() {
  // Check if already celebrated in this session
  if (sessionStorage.getItem('celebrationShown')) {
    return;
  }
  
  // Create celebration modal
  const modal = document.createElement('div');
  modal.className = 'celebration-modal';
  modal.innerHTML = `
    <div class="celebration-content">
      <div class="celebration-icon">🎉</div>
      <h2>Congratulations!</h2>
      <p>You've completed all lessons and reached <strong>100% progress!</strong></p>
      <p class="celebration-message">You're a NeuroLearn Champion! 🏆</p>
      <p class="celebration-quote">"Thank you for learning with us. Keep exploring, keep growing!" 🌟</p>
      <div class="celebration-buttons">
        <button class="celebrate-btn secondary" onclick="resetProgress()">Start Over</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  sessionStorage.setItem('celebrationShown', 'true');
  
  // Add confetti effect
  createConfetti();
}

function closeCelebration() {
  const modal = document.querySelector('.celebration-modal');
  if (modal) {
    modal.remove();
  }
}

function resetProgress() {
  closeCelebration();
  if (confirm('Are you sure you want to reset your progress to 0%?')) {
    updateProgress(0);
    showMessage('Progress reset! Start learning again!', 'success');
  }
}

// Simple confetti effect
function createConfetti() {
  const colors = ['#f6ad55', '#68d391', '#63b3ed', '#f687b3', '#f6e05e'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    confetti.style.animationDelay = Math.random() * 2 + 's';
    document.body.appendChild(confetti);
    
    // Remove after animation
    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}

// Function to update progress (can be called from other pages)
function updateProgress(newProgress) {
  currentUser.progress = newProgress;
  document.getElementById('progress').textContent = newProgress + '%';
  document.getElementById('progressFill').style.width = newProgress + '%';
  
  // Save to localStorage
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
