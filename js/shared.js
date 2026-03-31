// ─── COMPOSER DOM INJECTION (runs on every page) ───
// Reads COMPOSER config from data.js and fills in all identity elements so
// the HTML can stay blank and the same template serves any composer.
function initComposer() {
  const c = typeof COMPOSER !== 'undefined' ? COMPOSER : null;
  if (!c) return;

  const nameUpper = c.nameFirst + ' ' + c.nameLast;

  // Page title
  document.title = c.nameDisplay + ' \u2014 Film Composer';

  // Logo (both pages share the same .logo-line × 2 structure)
  const logoLines = document.querySelectorAll('.hdr-logo .logo-line');
  if (logoLines[0]) logoLines[0].textContent = c.nameFirst;
  if (logoLines[1]) logoLines[1].innerHTML   = c.nameLast + '<sup>\u00ae</sup>';

  // Mini-disc display ticker + artist label
  const mdDisplay = document.getElementById('md-display-text');
  if (mdDisplay) mdDisplay.textContent = c.miniDiscTicker;
  const mdArtist  = document.getElementById('md-artist');
  if (mdArtist)  mdArtist.textContent  = nameUpper;

  // Mini-disc Spotify artist link
  const mdSpotifyLink = document.querySelector('.md-spotify-link');
  if (mdSpotifyLink && c.spotifyArtistUri) {
    const artistId = c.spotifyArtistUri.replace('artist:', '');
    mdSpotifyLink.href = 'https://open.spotify.com/artist/' + artistId;
  }

  // Footer copyright
  const footerCopy = document.querySelector('#footer-bar > span');
  if (footerCopy) footerCopy.textContent = '\u00a9 ' + c.copyrightYear + ' ' + c.nameDisplay + '. All rights reserved.';

  // Footer social links
  const footerSocial = document.querySelector('.footer-social');
  if (footerSocial && c.social) {
    const links = [
      c.social.instagram && { label: 'Instagram', href: c.social.instagram },
      c.social.twitter   && { label: 'X',         href: c.social.twitter },
      c.social.youtube   && { label: 'YouTube',   href: c.social.youtube },
      c.social.facebook  && { label: 'Facebook',  href: c.social.facebook }
    ].filter(Boolean);
    footerSocial.innerHTML = links.map(l =>
      `<a href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`
    ).join('');
  }
}

// ─── PER-COMPOSER STORAGE KEY ───
// Namespaces localStorage/sessionStorage keys to this composer so multiple
// composer sites don't bleed into each other's saved state.
// COMPOSER.storagePrefix should be set in data.js (e.g. 'bt', 'jp').
function storeKey(suffix) {
  const prefix = (typeof COMPOSER !== 'undefined' && COMPOSER.storagePrefix)
    ? COMPOSER.storagePrefix : 'bt';
  return prefix + '-' + suffix;
}

// ─── SHARED STATE ───
let spotifyController = null;
let openLPBrowser  = () => {};
let closeLPBrowser = () => {};
let loadAlbum      = () => {};
let albumList      = [];
let currentAlbumIdx = -1;

// ─── SPOTIFY IFRAME API ───
// Must be defined before the async Spotify script fires
window.onSpotifyIframeApiReady = function(IFrameAPI) {
  const el = document.getElementById('md-spotify-embed');
  if (!el) return;
  IFrameAPI.createController(el, {
    uri: 'spotify:' + (typeof COMPOSER !== 'undefined' ? COMPOSER.spotifyArtistUri : 'artist:109FvbnDVNag1UcJDVpFlr'),
    width: '100%',
    height: '380',
  }, function(controller) {
    spotifyController = controller;
    // Restore the last-selected album into the Spotify embed.
    // Small delay lets the controller finish its own init before we call loadUri —
    // without it the call can silently fail on first page load.
    setTimeout(function() {
      try {
        const saved = JSON.parse(localStorage.getItem(storeKey('album')) || 'null');
        if (saved && saved.uri) spotifyController.loadUri('spotify:' + saved.uri);
      } catch(e) {}
    }, 800);
  });
};

// ─── CLOCK (visitor's local time, browser-native fallback + cached city) ───
let _clockIntervalId = null; // module-level so reinit can clear the old interval

function initClock() {
  // 1. Use the browser's own Intl API for timezone — always correct, no network needed.
  //    This means the TIME is always accurate even if the city name fetch fails.
  const browserTz = (function() {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; }
    catch(e) { return 'UTC'; }
  })();

  // Derive a readable city from the IANA timezone path as an immediate fallback:
  // 'Europe/London' → 'LONDON', 'America/Los_Angeles' → 'LOS ANGELES'
  const cityFromTz = browserTz.split('/').pop().replace(/_/g, ' ').toUpperCase();

  let clockTz   = browserTz;
  let clockCity = cityFromTz;

  // Clear any previous interval (handles bfcache re-init without duplicate ticks)
  if (_clockIntervalId) { clearInterval(_clockIntervalId); _clockIntervalId = null; }

  function updateDisplay() {
    const now  = new Date();
    const opts = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: clockTz };
    const str  = now.toLocaleTimeString('en-US', opts).toUpperCase();
    const el   = document.getElementById('hdr-clock');
    if (el) el.textContent = `${str} / ${clockCity}`;
  }

  updateDisplay();
  _clockIntervalId = setInterval(updateDisplay, 1000);

  // 2. Try localStorage cache for city name (avoids hammering the API on every load).
  try {
    const cached = JSON.parse(localStorage.getItem('bt-geo') || 'null');
    if (cached && cached.tz && cached.city) {
      clockTz   = cached.tz;
      clockCity = cached.city;
      updateDisplay();
      return; // have a cached answer — skip the network fetch
    }
  } catch(e) {}

  // 3. Fetch exact city from ipapi.co — if successful, cache it.
  fetch('https://ipapi.co/json/')
    .then(r => r.json())
    .then(data => {
      if (data && data.timezone) {
        clockTz   = data.timezone;
        clockCity = (data.city || data.region || cityFromTz).toUpperCase().replace(/,.*/, '').replace(/_/g, ' ');
        try { localStorage.setItem('bt-geo', JSON.stringify({ tz: clockTz, city: clockCity })); } catch(e) {}
        updateDisplay();
      }
    })
    .catch(() => {}); // browser-native timezone is already showing — silent failure is fine
}

// ─── LIGHT / DARK MODE ───
function initModeButtons() {
  const btnLight = document.getElementById('btn-light');
  const btnDark  = document.getElementById('btn-dark');
  if (!btnLight || !btnDark) return;

  const saved = localStorage.getItem('bt-mode') || 'light';
  setMode(saved);

  btnLight.addEventListener('click', () => setMode('light'));
  btnDark.addEventListener('click',  () => setMode('dark'));

  function setMode(mode) {
    document.documentElement.className = mode;
    btnLight.classList.toggle('active', mode === 'light');
    btnDark.classList.toggle('active',  mode === 'dark');
    localStorage.setItem('bt-mode', mode);
  }
}

// ─── FULLSCREEN ───
function initFullscreen() {
  const btn = document.getElementById('btn-fullscreen');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });
}

// ─── LIGHTBOX ───
// Thumbnail-first approach: shows YouTube thumbnail immediately, only injects
// the iframe src when the user explicitly clicks Play. This sidesteps YouTube's
// bot detection, which triggers when iframes auto-load without direct user input.

function openLightbox(videoId) {
  const lb        = document.getElementById('lightbox');
  const thumbWrap = document.getElementById('lightbox-thumb-wrap');
  const thumb     = document.getElementById('lightbox-thumb');
  const iframe    = document.getElementById('lightbox-iframe');

  // Reset to thumbnail state (in case previously played)
  iframe.src = '';
  iframe.style.display = 'none';
  if (thumbWrap) thumbWrap.style.display = '';

  // Set high-quality YouTube thumbnail (maxresdefault → fallback hqdefault)
  if (thumb) {
    thumb.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    thumb.onerror = function() { this.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`; };
  }

  // Store videoId for the play button handler
  lb.dataset.videoId = videoId;
  lb.classList.add('open');

  if (typeof lenisInstance !== 'undefined' && lenisInstance) {
    lenisInstance.stop();
    document.body.style.overflow = 'hidden';
  }
}

function _launchIframe(videoId) {
  const thumbWrap = document.getElementById('lightbox-thumb-wrap');
  const iframe    = document.getElementById('lightbox-iframe');
  if (thumbWrap) thumbWrap.style.display = 'none';
  iframe.style.display = '';
  // autoplay=1 is safe here — this is a true user-initiated click
  iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`;
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('open');
  document.getElementById('lightbox-iframe').src = '';
  if (typeof lenisInstance !== 'undefined' && lenisInstance) {
    lenisInstance.start();
    document.body.style.overflow = '';
  }
}

function initLightbox() {
  const lb     = document.getElementById('lightbox');
  const playBtn = document.getElementById('lightbox-play-btn');
  if (!lb) return;

  // Play button — true user gesture → safe to load iframe with autoplay
  if (playBtn) {
    playBtn.addEventListener('click', e => {
      e.stopPropagation();
      _launchIframe(lb.dataset.videoId);
    });
  }

  // Click thumbnail itself also launches iframe
  const thumb = document.getElementById('lightbox-thumb');
  if (thumb) {
    thumb.addEventListener('click', e => {
      e.stopPropagation();
      _launchIframe(lb.dataset.videoId);
    });
  }

  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lb.classList.contains('open')) closeLightbox();
  });
}

// ─── MINIDISC PLAYER ───
function initMiniDisc() {
  const player     = document.getElementById('md-player');
  const panel      = document.getElementById('md-panel');
  const disc       = document.getElementById('md-disc');
  const playBtn    = document.getElementById('md-play-btn');
  const minidisc   = document.getElementById('minidisc');
  const handle     = document.getElementById('md-handle');
  const restoreTab = document.getElementById('md-restore-tab');
  if (!player) return;

  let isOpen      = false;
  let isPlaying   = false;
  let isMinimized = false;

  function setOpen(open) {
    isOpen = open;
    panel.classList.toggle('open', open);
  }

  function setMinimized(min) {
    isMinimized = min;
    minidisc.classList.toggle('minimized', min);
    if (restoreTab) restoreTab.classList.toggle('visible', min);
  }

  function setPlaying(playing) {
    isPlaying = playing;
    disc.classList.toggle('spinning', playing);
    playBtn.innerHTML = playing ? '&#9646;&#9646;' : '&#9654;';
    if (spotifyController) {
      try { playing ? spotifyController.play() : spotifyController.pause(); } catch(e) {}
    }
  }

  // Load an album URI into the player and persist the selection
  loadAlbum = function(uri, title) {
    if (spotifyController) {
      try { spotifyController.loadUri('spotify:' + uri); } catch(e) {}
    }
    // Persist so the same album is ready on any page the user navigates to
    try { localStorage.setItem(storeKey('album'), JSON.stringify({ uri, title })); } catch(e) {}
    const displayText = document.getElementById('md-display-text');
    if (displayText) {
      displayText.textContent = title.toUpperCase() + ' \u25c6 ' + (typeof COMPOSER !== 'undefined' ? COMPOSER.nameFirst + ' ' + COMPOSER.nameLast : 'COMPOSER') + ' \u25c6\u00a0\u00a0';
    }
    if (isMinimized) setMinimized(false);
    if (!isOpen) setOpen(true);
    setPlaying(true);
  };

  // Disc click → open LP browser
  disc.addEventListener('click', e => {
    e.stopPropagation();
    openLPBrowser();
  });

  // Fan disc clicks also open LP browser
  document.querySelectorAll('.md-fan-disc').forEach(fd => {
    fd.addEventListener('click', e => {
      e.stopPropagation();
      openLPBrowser();
    });
  });

  // Drag handle — click to minimize
  if (handle) {
    handle.addEventListener('click', e => {
      e.stopPropagation();
      setMinimized(true);
    });
  }

  // Restore tab — click to bring back
  if (restoreTab) {
    restoreTab.addEventListener('click', () => setMinimized(false));
  }

  // Play/pause — opens panel on first play, restores if minimized
  playBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (isMinimized) setMinimized(false);
    if (!isPlaying) {
      if (!isOpen) setOpen(true);
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  });

  // ↓ close button — hides panel, keeps playing
  document.getElementById('md-panel-close').addEventListener('click', e => {
    e.stopPropagation();
    setOpen(false);
  });

  // Click player body to toggle panel (skip handle + disc area)
  player.addEventListener('click', e => {
    if (e.target.closest('.md-btn') || e.target.closest('a') ||
        e.target.closest('.md-handle') || e.target.closest('.md-disc-area')) return;
    if (isMinimized) { setMinimized(false); return; }
    setOpen(!isOpen);
  });

  // Prev/next cycle through the curated album crate
  document.getElementById('md-prev-btn').addEventListener('click', e => {
    e.stopPropagation();
    if (!albumList.length) return;
    currentAlbumIdx = (currentAlbumIdx <= 0 ? albumList.length : currentAlbumIdx) - 1;
    const a = albumList[currentAlbumIdx];
    loadAlbum(a.spotifyUri, a.title);
    // Mark active in LP browser if open
    document.querySelectorAll('.lp-record').forEach((r, i) => r.classList.toggle('playing', i === currentAlbumIdx));
  });
  document.getElementById('md-next-btn').addEventListener('click', e => {
    e.stopPropagation();
    if (!albumList.length) return;
    currentAlbumIdx = (currentAlbumIdx + 1) % albumList.length;
    const a = albumList[currentAlbumIdx];
    loadAlbum(a.spotifyUri, a.title);
    document.querySelectorAll('.lp-record').forEach((r, i) => r.classList.toggle('playing', i === currentAlbumIdx));
  });
}

// ─── LP BROWSER ───
function initLPBrowser() {
  const browser  = document.getElementById('lp-browser');
  const grid     = document.getElementById('lp-grid');
  const closeBtn = document.getElementById('lp-close-btn');
  if (!browser || !grid) return;

  // Gather entries with album URIs
  const albums = [];
  if (typeof FILMS    !== 'undefined') FILMS.forEach(f => { if (f.spotifyUri && f.spotifyUri.startsWith('album:')) albums.push(f); });
  if (typeof TV_SHOWS !== 'undefined') TV_SHOWS.forEach(s => { if (s.spotifyUri && s.spotifyUri.startsWith('album:')) albums.push(s); });

  // Expose album list globally for prev/next cycling
  albumList = albums;

  // Build LP records
  albums.forEach((entry, idx) => {
    const record = document.createElement('div');
    record.className = 'lp-record';
    const imgUrl = entry.cards && entry.cards[0] ? entry.cards[0].img : '';
    record.innerHTML = `
      <div class="lp-vinyl">
        <div class="lp-label" style="background-image:url('${imgUrl}')">
          <div class="lp-label-hole"></div>
        </div>
      </div>
      <div class="lp-record-title">${entry.title}</div>
      <div class="lp-record-year">${entry.year}</div>
    `;
    record.addEventListener('click', () => {
      document.querySelectorAll('.lp-record').forEach(r => r.classList.remove('playing'));
      record.classList.add('playing');
      currentAlbumIdx = idx;
      loadAlbum(entry.spotifyUri, entry.title);
      closeLPBrowser();
    });
    grid.appendChild(record);
  });

  // Restore previously-selected album (display text, idx, LP selection marker)
  try {
    const saved = JSON.parse(localStorage.getItem(storeKey('album')) || 'null');
    if (saved && saved.uri) {
      const idx = albums.findIndex(a => a.spotifyUri === saved.uri);
      if (idx >= 0) {
        currentAlbumIdx = idx;
        const displayText = document.getElementById('md-display-text');
        if (displayText) {
          const nameUpper = typeof COMPOSER !== 'undefined' ? COMPOSER.nameFirst + ' ' + COMPOSER.nameLast : 'COMPOSER';
          displayText.textContent = saved.title.toUpperCase() + ' \u25c6 ' + nameUpper + ' \u25c6\u00a0\u00a0';
        }
        document.querySelectorAll('.lp-record').forEach((r, i) => {
          r.classList.toggle('playing', i === idx);
        });
      }
    }
  } catch(e) {}

  // Wire open / close
  openLPBrowser = function() {
    browser.classList.add('open');
    browser.removeAttribute('aria-hidden');
    if (typeof lenisInstance !== 'undefined' && lenisInstance) lenisInstance.stop();
  };

  closeLPBrowser = function() {
    browser.classList.remove('open');
    browser.setAttribute('aria-hidden', 'true');
    if (typeof lenisInstance !== 'undefined' && lenisInstance) lenisInstance.start();
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLPBrowser);

  browser.addEventListener('click', e => { if (e.target === browser) closeLPBrowser(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && browser.classList.contains('open')) closeLPBrowser();
  });
}
