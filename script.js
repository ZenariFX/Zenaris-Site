/* ============================================================
   ZENARI'S PAGE - COMPLETE SCRIPT
   ============================================================ */

/* ---------- THEME TOGGLE ---------- */
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
  // Check saved preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* ---------- MOBILE NAV ---------- */
const menuToggle = document.querySelector('.menu-toggle');
const dropdown = document.querySelector('.dropdown');

if (menuToggle && dropdown) {
  menuToggle.addEventListener('click', () => {
    const isOpen = dropdown.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close dropdown when clicking a link
  dropdown.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      dropdown.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- BACK TO TOP ---------- */
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

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

/* ---------- EMBED MUTE TOGGLE ---------- */
document.querySelectorAll('.embed-mute').forEach(btn => {
  btn.addEventListener('click', () => {
    const iframe = btn.closest('.embed-body').querySelector('iframe');
    const isMuted = btn.getAttribute('data-muted') === 'true';
    if (iframe) {
      let src = iframe.src;
      if (isMuted) {
        src = src.replace('mute=1', 'mute=0');
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
      } else {
        src = src.replace('mute=0', 'mute=1');
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
      }
      iframe.src = src;
      btn.setAttribute('data-muted', !isMuted);
    }
  });
});

/* ---------- TYPING EFFECT ---------- */
document.querySelectorAll('.typewriter').forEach(el => {
  const text = el.getAttribute('data-text') || '';
  let i = 0;
  el.textContent = '';
  const type = () => {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, 40);
    }
  };
  // Start after a small delay so it animates in view
  setTimeout(type, 300);
});

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

/* ---------- SCROLL REVEAL ---------- */
const revealElements = document.querySelectorAll('.animate-fade-up, .animate-fade-in, .animate-scale-in');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)';
  revealObserver.observe(el);
});

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

/* ---------- DISCORD LANYARD API (via Worker proxy) ---------- */
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

/* ---------- SEARCH & FILTER (Anime Clips Page) ---------- */
const searchInput = document.getElementById('clip-search');
const searchClear = document.getElementById('search-clear');
const filterDropdown = document.getElementById('filter-dropdown');
const filterToggle = document.getElementById('filter-toggle');
const filterMenu = document.getElementById('filter-menu');
const currentFilterLabel = document.getElementById('current-filter');
const clipsGrid = document.getElementById('clips-grid');
const clipsEmpty = document.getElementById('clips-empty');

let activeFilter = 'all';
let searchQuery = '';

function filterClips() {
  if (!clipsGrid) return;
  const tiles = clipsGrid.querySelectorAll('.clip-tile');
  let visibleCount = 0;

  tiles.forEach(tile => {
    const title = tile.getAttribute('data-title') || '';
    const category = tile.getAttribute('data-category') || '';
    const isComing = tile.getAttribute('data-coming') === 'true';

    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesFilter = true;

    if (activeFilter === 'recently') {
      matchesFilter = false; // No recently added logic yet
    } else if (activeFilter === 'movies') {
      matchesFilter = category === 'movie';
    } else if (activeFilter === 'series') {
      matchesFilter = category === 'series';
    } else if (activeFilter === 'coming') {
      matchesFilter = isComing;
    }

    if (matchesSearch && matchesFilter) {
      tile.classList.remove('hidden');
      visibleCount++;
    } else {
      tile.classList.add('hidden');
    }
  });

  if (clipsEmpty) {
    clipsEmpty.style.display = visibleCount === 0 ? 'block' : 'none';
  }
}

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (searchClear) {
      searchClear.classList.toggle('visible', searchQuery.length > 0);
    }
    filterClips();
  });
}

if (searchClear) {
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    searchClear.classList.remove('visible');
    filterClips();
  });
}

if (filterToggle && filterDropdown) {
  filterToggle.addEventListener('click', () => {
    filterDropdown.classList.toggle('open');
  });

  // Close filter when clicking outside
  document.addEventListener('click', (e) => {
    if (!filterDropdown.contains(e.target)) {
      filterDropdown.classList.remove('open');
    }
  });
}

if (filterMenu) {
  filterMenu.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', () => {
      filterMenu.querySelectorAll('.filter-option').forEach(o => o.classList.remove('active'));
      option.classList.add('active');
      activeFilter = option.getAttribute('data-filter');
      if (currentFilterLabel) {
        currentFilterLabel.textContent = option.textContent;
      }
      filterClips();
      filterDropdown.classList.remove('open');
    });
  });
}

/* ---------- CUSTOM CURSOR ---------- */
const cursor = document.querySelector('.custom-cursor');
const cursorDot = document.querySelector('.custom-cursor-dot');

if (cursor && cursorDot && window.matchMedia('(hover: hover)').matches) {
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  const animateCursor = () => {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  // Expand on interactive elements
  document.querySelectorAll('a, button, .clip-tile, .socials-card, .filter-toggle').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
  });
}

/* ---------- PAGE TRANSITION ---------- */
window.addEventListener('pageshow', () => {
  document.body.classList.add('loaded');
});
