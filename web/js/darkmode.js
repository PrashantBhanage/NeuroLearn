// Dark Mode Toggle Script - Include on all pages
function initDarkMode() {
  // Check for saved preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Initialize on page load
initDarkMode();
