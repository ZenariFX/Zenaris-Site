/* ============================================================
   ZENARI'S PAGE - COMPLETE SCRIPT
   Rebuilt from all HTML/CSS sources
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- THEME TOGGLE ---------- */
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
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
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    dropdown.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        dropdown.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (dropdown.classList.contains('open') && !dropdown.contains(e.target) && !menuToggle.contains(e.target)) {
        dropdown.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
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

  /* ---------- FOOTER SCROLL REVEAL ---------- */
  const footer = document.querySelector('.site-footer');
  if (footer) {
    const updateFooter = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const vh = window.innerHeight;
      const dh = document.documentElement.scrollHeight;
      const isScrollable = dh > vh + 100;
      const nearBottom = scrollY + vh >= dh - 200;
      footer.classList.toggle('visible', isScrollable && nearBottom);
    };
    window.addEventListener('scroll', updateFooter, { passive: true });
    window.addEventListener('resize', updateFooter);
    updateFooter();
  }

  /* ---------- EMBED MUTE TOGGLE ---------- */
  document.querySelectorAll('.embed-mute').forEach(btn => {
    btn.addEventListener('click', () => {
      const embedBody = btn.closest('.embed-body');
      if (!embedBody) return;
      const iframe = embedBody.querySelector('iframe');
      if (!iframe) return;

      const isMuted = btn.getAttribute('data-muted') === 'true';
      let src = iframe.src;

      if (isMuted) {
        src = src.replace('mute=1', 'mute=0');
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
      } else {
        src = src.replace('mute=0', 'mute=1');
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
      }
      iframe.src = src;
      btn.setAttribute('data-muted', String(!isMuted));
    });
  });

  /* ---------- TYPING EFFECT ---------- */
  document.querySelectorAll('.typewriter').forEach(el => {
    const text = el.getAttribute('data-text') || '';
    el.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    el.appendChild(cursor);
    let i = 0;
    const type = () => {
      if (i < text.length) {
        el.insertBefore(document.createTextNode(text.charAt(i)), cursor);
        i++;
        setTimeout(type, 45);
      }
    };
    setTimeout(type, 400);
  });

  /* ---------- FLOATING PARTICLES ---------- */
  const particlesContainer = document.querySelector('.particles-container');
  if (particlesContainer) {
    const count = 35;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 3 + 1;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDuration = (Math.random() * 8 + 6) + 's';
      p.style.animationDelay = (Math.random() * 4) + 's';
      p.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
      particlesContainer.appendChild(p);
    }
  }

  /* ---------- YOUTUBE TITLE FETCHER ---------- */
  document.querySelectorAll('.amv-card[data-yt-id]').forEach(card => {
    const videoId = card.getAttribute('data-yt-id');
    const titleEl = card.querySelector('.yt-title');
    if (!videoId || !titleEl) return;

    titleEl.classList.add('skeleton');
    fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        titleEl.classList.remove('skeleton');
        titleEl.textContent = data.title || 'AMV Video';
      })
      .catch(() => {
        titleEl.classList.remove('skeleton');
        titleEl.textContent = 'AMV Video';
      });
  });

  /* ---------- DISCORD LANYARD API (via Worker proxy) ---------- */
  const discordProfile = document.getElementById('discord-profile');
  if (discordProfile) {
    const statusDot = document.getElementById('discord-status-dot');
    const statusText = document.getElementById('discord-status-text');
    const avatarEl = document.getElementById('discord-avatar');
    const usernameEl = document.getElementById('discord-username');
    const statusMap = { online: 'Online', idle: 'Away', dnd: 'Do Not Disturb', offline: 'Offline' };

    fetch('/api/discord')
      .then(res => {
        if (!res.ok) throw new Error('Worker error');
        return res.json();
      })
      .then(data => {
        if (data.success && data.data) {
          const user = data.data;
          const rawStatus = user.discord_status || 'offline';

          if (statusDot) statusDot.className = 'discord-status-dot ' + rawStatus;

          let displayStatus = statusMap[rawStatus] || 'Offline';
          if (user.activities && user.activities.length > 0) {
            displayStatus += ' - ' + user.activities[0].name;
          }
          if (statusText) statusText.textContent = displayStatus;

          if (avatarEl && user.discord_user && user.discord_user.avatar) {
            avatarEl.style.background = `url(https://cdn.discordapp.com/avatars/${user.discord_user.id}/${user.discord_user.avatar}) center/cover no-repeat`;
            avatarEl.style.backgroundColor = 'transparent';
          }

          if (usernameEl && user.discord_user) {
            usernameEl.textContent = user.discord_user.global_name || user.discord_user.username;
          }
        } else {
          if (statusText) statusText.textContent = 'Offline';
          if (statusDot) statusDot.className = 'discord-status-dot offline';
        }
      })
      .catch(() => {
        if (statusText) statusText.textContent = 'Offline';
        if (statusDot) statusDot.className = 'discord-status-dot offline';
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
      const title = (tile.getAttribute('data-title') || '').toLowerCase();
      const category = tile.getAttribute('data-category') || '';
      const isComing = tile.getAttribute('data-coming') === 'true';

      const matchesSearch = title.includes(searchQuery.toLowerCase());
      let matchesFilter = true;

      if (activeFilter === 'recently') {
        matchesFilter = false;
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
    filterToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      filterDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (filterDropdown.classList.contains('open') && !filterDropdown.contains(e.target)) {
        filterDropdown.classList.remove('open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && filterDropdown.classList.contains('open')) {
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

  /* ---------- PAGE TRANSITION OVERLAY ---------- */
  let pageTransition = document.querySelector('.page-transition');
  if (!pageTransition) {
    pageTransition = document.createElement('div');
    pageTransition.className = 'page-transition';
    document.body.appendChild(pageTransition);
  }
  requestAnimationFrame(() => {
    setTimeout(() => {
      pageTransition.classList.add('fade-out');
      setTimeout(() => {
        if (pageTransition && pageTransition.parentNode) {
          pageTransition.parentNode.removeChild(pageTransition);
        }
      }, 350);
    }, 30);
  });

  /* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- CRITICAL FALLBACK ---------- */
  setTimeout(() => {
    const animatedEls = document.querySelectorAll('.animate-fade-up, .animate-fade-in, .animate-scale-in');
    let anyInvisible = false;
    animatedEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      if (rect.height > 0 && parseFloat(style.opacity) < 0.1) {
        anyInvisible = true;
      }
    });
    if (anyInvisible) {
      document.documentElement.classList.add('no-animate-fallback');
    }
  }, 1500);

});