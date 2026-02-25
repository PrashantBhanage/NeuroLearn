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
      // For simplicity, we'll just use the file name
      // In a real app, you'd upload the file to a server
      const fileName = file.name;
      updateProfilePicture(fileName);
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

async function updateProfilePicture(profilePicture) {
  try {
    const response = await fetch('/api/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `user_id=${currentUser.user_id}&profile_picture=${encodeURIComponent(profilePicture)}`
    });

    const data = await response.json();

    if (data.success) {
      // Update local storage
      currentUser.profile_picture = data.user.profile_picture;
      localStorage.setItem('neurolearn_user', JSON.stringify(currentUser));
      
      // Update UI
      document.getElementById('profileImage').src = '/images/' + profilePicture;
      
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

