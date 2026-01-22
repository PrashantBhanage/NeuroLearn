const icons = {
  maths: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="#38a169" stroke-width="2">
      <rect x="4" y="2" width="16" height="20" rx="2"/>
      <line x1="8" y1="6" x2="16" y2="6"/>
      <line x1="8" y1="10" x2="16" y2="10"/>
    </svg>`,

  science: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="#3182ce" stroke-width="2">
      <path d="M9 3h6v6l4 8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2l4-8V3z"/>
    </svg>`,

  english: `
  <svg xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 24 24"
       fill="none"
       stroke="#805ad5"
       stroke-width="2"
       stroke-linecap="round"
       stroke-linejoin="round">

    <!-- diamond pen -->
    <path d="M12 3l8 8-8 8-8-8 8-8z"/>

    <!-- center hole -->
    <circle cx="12" cy="11" r="1.6"/>

    <!-- ink drop -->
    <path d="M9 19c0-1 1.5-2.5 2-3 0.5.5 2 2 2 3a2 2 0 0 1-4 0z"/>
  </svg>`

,

  art: `
  <svg xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 24 24"
       fill="none"
       stroke="#dd6b20"
       stroke-width="2"
       stroke-linecap="round"
       stroke-linejoin="round">
    <path d="M12 3a9 9 0 1 0 9 9c0 2-1 3-3 3h-2a2 2 0 0 0-2 2 2 2 0 0 1-2 2"/>
    <circle cx="8" cy="10" r="1"/>
    <circle cx="12" cy="7" r="1"/>
    <circle cx="16" cy="10" r="1"/>
  </svg>`,

  reading: `
  <svg xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 24 24"
       fill="none"
       stroke="#d53f8c"
       stroke-width="2"
       stroke-linecap="round"
       stroke-linejoin="round">
    <path d="M4 19a2 2 0 0 1 2-2h14"/>
    <path d="M6 3h12v16H6z"/>
    <line x1="9" y1="7" x2="15" y2="7"/>
    <line x1="9" y1="11" x2="15" y2="11"/>
  </svg>`,

 geography: `
  <svg xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 24 24"
       fill="none"
       stroke="#38a169"
       stroke-width="2"
       stroke-linecap="round"
       stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 0 20"/>
    <path d="M12 2a15.3 15.3 0 0 0 0 20"/>
  </svg>`

};

fetch('/api/subjects')
  .then(res => res.json())
  .then(subjects => {
    const grid = document.getElementById('subjectsGrid');

    subjects.forEach(s => {
      const css = s.subject_name.toLowerCase();
      const card = document.createElement('div');

      card.className = `subject-card ${css}`;
      card.innerHTML = `
        <div class="icon-wrapper">
          ${icons[css]}
        </div>
        <h3>${s.subject_name}</h3>
      `;

      card.onclick = () => {
        card.classList.add('clicked');
        setTimeout(() => {
          window.location.href =
            `/subjects/subjectLessons.html?subjectId=${s.subject_id}`;
        }, 300);
      };

      grid.appendChild(card);
    });
  });
