/* ---------- MOBILE NAV ---------- */
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
  });
}

/* ---------- ACTIVE NAV LINK ---------- */
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  if (link.getAttribute('href') === currentPath) {
    link.classList.add('active');
  }
});

/* ---------- FOOTER SCROLL ---------- */
const footer = document.querySelector('.site-footer');
if (footer) {
  const showFooter = () => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const isScrollable = docHeight > viewportHeight + 100;
    const nearBottom = scrollY + viewportHeight >= docHeight - 200;
    footer.classList.toggle('visible', isScrollable && nearBottom);
  };
  window.addEventListener('scroll', showFooter);
  window.addEventListener('resize', showFooter);
  showFooter();
}

/* ---------- YOUTUBE TITLE FETCHER ---------- */
document.querySelectorAll('.amv-card[data-yt-id]').forEach(card => {
  const videoId = card.getAttribute('data-yt-id');
  const titleEl = card.querySelector('.yt-title');
  if (videoId && titleEl) {
    titleEl.classList.add('skeleton');
    fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
      .then(res => res.json())
      .then(data => {
        titleEl.classList.remove('skeleton');
        titleEl.textContent = data.title || 'AMV Video';
      })
      .catch(() => {
        titleEl.classList.remove('skeleton');
        titleEl.textContent = 'AMV Video';
      });
  }
});

/* ---------- DISCORD LANYARD API ---------- */
const discordProfile = document.getElementById('discord-profile');
if (discordProfile) {
  const statusDot = document.getElementById('discord-status-dot');
  const statusText = document.getElementById('discord-status-text');
  const avatarEl = document.getElementById('discord-avatar');
  const usernameEl = document.getElementById('discord-username');
  const statusMap = { 'online': 'Online', 'idle': 'Away', 'dnd': 'Do Not Disturb', 'offline': 'Offline' };

  // Calls your Worker proxy – User ID is hidden server-side
  fetch('/api/discord')
    .then(res => res.json())
    .then(data => {
      if (data.success && data.data) {
        const user = data.data;
        const rawStatus = user.discord_status || 'offline';
        statusDot.className = 'discord-status-dot ' + rawStatus;
        let displayStatus = statusMap[rawStatus] || 'Offline';
        if (user.activities && user.activities.length > 0) {
          displayStatus += ' - ' + user.activities[0].name;
        }
        statusText.textContent = displayStatus;
        if (user.discord_user && user.discord_user.avatar) {
          avatarEl.style.background = `url(https://cdn.discordapp.com/avatars/${user.discord_user.id}/${user.discord_user.avatar})`;
          avatarEl.style.backgroundColor = 'transparent';
        }
        if (user.discord_user) {
          usernameEl.textContent = user.discord_user.global_name || user.discord_user.username;
        }
      } else {
        statusText.textContent = 'Offline';
        statusDot.className = 'discord-status-dot offline';
      }
    })
    .catch(() => {
      statusText.textContent = 'Offline';
      statusDot.className = 'discord-status-dot offline';
    });
}

/* ---------- FLOATING PARTICLES ---------- */
const particlesContainer = document.querySelector('.particles-container');
if (particlesContainer) {
  const particleCount = 25;
  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = (Math.random() * 15 + 10) + 's';
    p.style.animationDelay = (Math.random() * 20) + 's';
    p.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
    particlesContainer.appendChild(p);
  }
}

/* ---------- TYPING EFFECT ---------- */
const typingElement = document.querySelector('.typing-text');
if (typingElement) {
  const texts = ['Anime Edits', 'AMV Creator', 'Zenari'];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const type = () => {
    const currentText = texts[textIndex];
    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      setTimeout(type, 2000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(type, 500);
    } else {
      setTimeout(type, isDeleting ? 50 : 100);
    }
  };

  type();
}
