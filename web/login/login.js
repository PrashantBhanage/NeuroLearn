// Login Page JavaScript - NeuroLearn Dark Theme

document.addEventListener('DOMContentLoaded', function() {
  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');
  const signUpPill = document.getElementById('signUpPill');
  const signInPill = document.getElementById('signInPill');
  const showRegister = document.getElementById('showRegister');
  const showLogin = document.getElementById('showLogin');
  const messageDiv = document.getElementById('message');
  const regMessageDiv = document.getElementById('regMessage');

  // Check if user is already logged in
  const userData = localStorage.getItem('neurolearn_user');
  if (userData) {
    window.location.href = '/index.html';
    return;
  }

  // Toggle between login and register forms
  function showSignUp() {
    signInForm.style.display = 'none';
    signUpForm.style.display = 'block';
    signInPill.classList.remove('active');
    signUpPill.classList.add('active');
    messageDiv.style.display = 'none';
    regMessageDiv.style.display = 'none';
  }

  function showSignIn() {
    signUpForm.style.display = 'none';
    signInForm.style.display = 'block';
    signUpPill.classList.remove('active');
    signInPill.classList.add('active');
    messageDiv.style.display = 'none';
    regMessageDiv.style.display = 'none';
  }

  signUpPill.addEventListener('click', showSignUp);
  signInPill.addEventListener('click', showSignIn);
  showRegister.addEventListener('click', function(e) {
    e.preventDefault();
    showSignUp();
  });
  showLogin.addEventListener('click', function(e) {
    e.preventDefault();
    showSignIn();
  });

  // Password Toggle Functionality
  function setupPasswordToggle(toggleBtnId, inputId) {
    const toggleBtn = document.getElementById(toggleBtnId);
    const input = document.getElementById(inputId);
    const eyeOpen = toggleBtn.querySelector('.eye-open');
    const eyeClosed = toggleBtn.querySelector('.eye-closed');

    toggleBtn.addEventListener('click', function() {
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
      
      if (type === 'text') {
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = 'block';
      } else {
        eyeOpen.style.display = 'block';
        eyeClosed.style.display = 'none';
      }
    });
  }

  // Setup password toggles
  setupPasswordToggle('togglePassword', 'password');
  setupPasswordToggle('toggleRegPassword', 'regPassword');

  // Handle Sign In
  signInForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = signInForm.querySelector('.submit-btn');

    // Show loading state
    submitBtn.classList.add('loading');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing in...';
    messageDiv.style.display = 'none';

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      });

      const data = await response.json();

      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem('neurolearn_user', JSON.stringify(data.user));
        
        messageDiv.className = 'message success';
        messageDiv.textContent = 'Welcome back! Redirecting...';
        messageDiv.style.display = 'block';

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = '/index.html';
        }, 1000);
      } else {
        messageDiv.className = 'message error';
        messageDiv.textContent = data.error || 'Invalid credentials';
        messageDiv.style.display = 'block';
      }
    } catch (error) {
      messageDiv.className = 'message error';
      messageDiv.textContent = 'Connection error. Please try again.';
      messageDiv.style.display = 'block';
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.textContent = originalText;
    }
  });

  // Handle Sign Up
  signUpForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const submitBtn = signUpForm.querySelector('.submit-btn');

    // Show loading state
    submitBtn.classList.add('loading');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating account...';
    regMessageDiv.style.display = 'none';

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      });

      const data = await response.json();

      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem('neurolearn_user', JSON.stringify(data.user));
        
        regMessageDiv.className = 'message success';
        regMessageDiv.textContent = 'Account created! Redirecting...';
        regMessageDiv.style.display = 'block';

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = '/index.html';
        }, 1000);
      } else {
        regMessageDiv.className = 'message error';
        regMessageDiv.textContent = data.error || 'Registration failed';
        regMessageDiv.style.display = 'block';
      }
    } catch (error) {
      regMessageDiv.className = 'message error';
      regMessageDiv.textContent = 'Connection error. Please try again.';
      regMessageDiv.style.display = 'block';
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.textContent = originalText;
    }
  });
});
