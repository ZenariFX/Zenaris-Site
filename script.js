/* ============================================================
   ZENARI'S PAGE - MAIN SCRIPT (NO PAGE TRANSITIONS)
   ============================================================ */

/* ---------- SERVICE WORKER REGISTRATION ---------- */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('SW registered'))
    .catch(() => console.log('SW registration failed'));
}

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- MENU TOGGLE ---------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const dropdown = document.querySelector('.dropdown');
  if (menuToggle && dropdown) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !dropdown.contains(e.target)) {
        menuToggle.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('open');
      }
    });
  }

  /* ---------- THEME TOGGLE ---------- */
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    themeToggle.addEventListener('click', () => {
      if (document.documentElement.getAttribute('data-theme') === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.removeItem('theme');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  /* ---------- BACK TO TOP ---------- */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- EMBED MUTE TOGGLE ---------- */
  document.querySelectorAll('.embed-mute').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.embed-card');
      const iframe = card.querySelector('iframe');
      const isMuted = btn.getAttribute('data-muted') === 'true';
      const src = iframe.src;
      if (isMuted) {
        iframe.src = src.replace('mute=1', 'mute=0');
        btn.setAttribute('data-muted', 'false');
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19 9l4 4-4 4"/></svg>`;
      } else {
        iframe.src = src.replace('mute=0', 'mute=1');
        btn.setAttribute('data-muted', 'true');
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
      }
    });
  });

  /* ---------- ANIME DROPDOWN ---------- */
  const animeDropdown = document.querySelector('.anime-dropdown');
  if (animeDropdown) {
    const toggle = animeDropdown.querySelector('.anime-dropdown-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        animeDropdown.classList.toggle('open');
      });
      document.addEventListener('click', (e) => {
        if (!animeDropdown.contains(e.target)) {
          animeDropdown.classList.remove('open');
        }
      });
    }
  }

  /* ---------- FILTER DROPDOWN ---------- */
  const filterDropdown = document.getElementById('filter-dropdown');
  if (filterDropdown) {
    const toggle = document.getElementById('filter-toggle');
    const menu = document.getElementById('filter-menu');
    if (toggle) {
      toggle.addEventListener('click', () => {
        filterDropdown.classList.toggle('open');
      });
      document.addEventListener('click', (e) => {
        if (!filterDropdown.contains(e.target)) {
          filterDropdown.classList.remove('open');
        }
      });
    }
    if (menu) {
      menu.querySelectorAll('.filter-option').forEach(opt => {
        opt.addEventListener('click', () => {
          const filter = opt.getAttribute('data-filter');
          const label = opt.textContent;
          menu.querySelectorAll('.filter-option').forEach(o => o.classList.remove('active'));
          opt.classList.add('active');
          document.getElementById('current-filter').textContent = label;
          filterDropdown.classList.remove('open');
          applyFilter(filter);
        });
      });
    }
  }

  /* ---------- SEARCH FUNCTIONALITY ---------- */
  const searchInput = document.getElementById('clip-search');
  const searchClear = document.getElementById('search-clear');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      if (searchClear) {
        searchClear.classList.toggle('visible', query.length > 0);
      }
      applySearch(query);
    });
  }
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchClear.classList.remove('visible');
      applySearch('');
      searchInput.focus();
    });
  }

  /* ---------- FILTER & SEARCH LOGIC ---------- */
  function applyFilter(filter) {
    const tiles = document.querySelectorAll('.clip-tile');
    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
    tiles.forEach(tile => {
      let show = true;
      switch (filter) {
        case 'all': show = true; break;
        case 'recently': show = tile.hasAttribute('data-recent'); break;
        case 'movies': show = tile.getAttribute('data-category') === 'movies'; break;
        case 'series': show = tile.getAttribute('data-category') === 'series'; break;
        case 'coming': show = tile.hasAttribute('data-coming'); break;
      }
      if (show && searchQuery) {
        show = tile.getAttribute('data-title').toLowerCase().includes(searchQuery);
      }
      tile.classList.toggle('hidden', !show);
    });
    updateEmptyState();
  }

  function applySearch(query) {
    const tiles = document.querySelectorAll('.clip-tile');
    const activeFilter = document.querySelector('.filter-option.active');
    const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
    tiles.forEach(tile => {
      let show = true;
      switch (filter) {
        case 'recently': show = tile.hasAttribute('data-recent'); break;
        case 'movies': show = tile.getAttribute('data-category') === 'movies'; break;
        case 'series': show = tile.getAttribute('data-category') === 'series'; break;
        case 'coming': show = tile.hasAttribute('data-coming'); break;
      }
      if (show && query) {
        show = tile.getAttribute('data-title').toLowerCase().includes(query);
      }
      tile.classList.toggle('hidden', !show);
    });
    updateEmptyState();
  }

  function updateEmptyState() {
    const visible = document.querySelectorAll('.clip-tile:not(.hidden)');
    const emptyState = document.getElementById('clips-empty');
    if (emptyState) {
      emptyState.style.display = (visible.length === 0) ? 'block' : 'none';
    }
  }

  /* ---------- SCROLL REVEAL FOR CLIP CARDS ---------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    });
  });
  document.querySelectorAll('.clip-card').forEach(card => observer.observe(card));

  /* ---------- FOOTER SCROLL VISIBILITY ---------- */
  const footer = document.querySelector('.site-footer');
  if (footer) {
    const showFooter = () => {
      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
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
    const discordUserId = '1012044681347072081';
    const statusDot = document.getElementById('discord-status-dot');
    const statusText = document.getElementById('discord-status-text');
    const avatarEl = document.getElementById('discord-avatar');
    const usernameEl = document.getElementById('discord-username');
    const statusMap = { 'online': 'Online', 'idle': 'Away', 'dnd': 'Do Not Disturb', 'offline': 'Offline' };
    fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`)
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
            avatarEl.style.background = `url(https://cdn.discordapp.com/avatars/${discordUserId}/${user.discord_user.avatar}.png) center/cover`;
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
  document.querySelectorAll('.typewriter').forEach(el => {
    const text = el.getAttribute('data-text') || el.textContent;
    const speed = parseInt(el.getAttribute('data-speed')) || 60;
    el.textContent = '';
    el.style.opacity = '1';
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    el.appendChild(cursor);
    let i = 0;
    function typeChar() {
      if (i < text.length) {
        el.insertBefore(document.createTextNode(text.charAt(i)), cursor);
        i++;
        setTimeout(typeChar, speed);
      }
    }
    // Calculate delay based on parent animation class
    let delay = 600;
    const parent = el.closest('.animate-fade-up, .animate-fade-in, .animate-scale-in');
    if (parent) {
      const animDuration = 700; // fadeUp duration in ms
      const classList = parent.classList;
      let animDelay = 0;
      if (classList.contains('d1')) animDelay = 50;
      else if (classList.contains('d2')) animDelay = 120;
      else if (classList.contains('d3')) animDelay = 200;
      else if (classList.contains('d4')) animDelay = 280;
      else if (classList.contains('d5')) animDelay = 360;
      else if (classList.contains('d6')) animDelay = 440;
      else if (classList.contains('d7')) animDelay = 520;
      else if (classList.contains('d8')) animDelay = 600;
      delay = animDelay + animDuration + 100; // start 100ms after fade completes
    }
    setTimeout(typeChar, delay);
  });


  /* ---------- DROPDOWN HOVER COLORS ---------- */
  document.querySelectorAll('.dropdown a[data-hover-color]').forEach(link => {
    const color = link.getAttribute('data-hover-color');
    link.addEventListener('mouseenter', () => {
      link.style.color = color;
    });
    link.addEventListener('mouseleave', () => {
      link.style.color = '';
    });
  });
});