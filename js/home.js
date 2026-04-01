// ─── HOME STATE ───
let lenisInstance        = null;
let lenisGeneration      = 0;
let currentSlideIdx      = 0;
let tickerGeneration     = 0;
let lastManualSelectTime = 0;
const MANUAL_COOLDOWN_MS = 1500;

// ─── GSAP SETUP ───
gsap.registerPlugin(ScrollTrigger);

// ─── LOADER / SPLASH ───
(function runLoader() {
  const loader   = document.getElementById('loader');
  const bar      = document.getElementById('loader-bar');
  const ll1      = document.getElementById('ll1');
  const ll2      = document.getElementById('ll2');
  const rule     = document.getElementById('loader-rule');
  const role     = document.getElementById('loader-role');
  const enterBtn = document.getElementById('loader-enter-btn');

  // Pre-fill identity from COMPOSER config immediately (before any animation or
  // page-show check) so the splash shows the correct composer name and video
  // without any flash of the previous composer's content.
  if (typeof COMPOSER !== 'undefined') {
    if (ll1) ll1.textContent = COMPOSER.nameFirst;
    if (ll2) ll2.textContent = COMPOSER.nameLast;

    const heroTitle = document.getElementById('hero-title-text');
    if (heroTitle) heroTitle.textContent = COMPOSER.nameFirst + ' ' + COMPOSER.nameLast;

    const vid = COMPOSER.splashVideoId || COMPOSER.bioVideoId;
    if (vid) {
      const vidSrc = `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&mute=1&loop=1&playlist=${vid}&controls=0&showinfo=0&rel=0&modestbranding=1&start=10`;
      const splashIframe = document.querySelector('.loader-video-bg iframe');
      if (splashIframe) splashIframe.src = vidSrc;
      const heroCardIframe = document.querySelector('#hc2-video iframe');
      if (heroCardIframe) heroCardIframe.src = vidSrc;
    }
  }

  // Skip splash on returning visits (same browser session)
  if (sessionStorage.getItem(storeKey('visited'))) {
    loader.style.display = 'none';
    initPage();
    return;
  }

  // Set initial off-screen state for word clips
  gsap.set(ll1, { y: '110%' });
  gsap.set(ll2, { y: '110%' });

  const tl = gsap.timeline({
    onComplete: () => {
      // After intro animation, show the Enter button (don't auto-dismiss)
      gsap.to(enterBtn, { opacity: 1, duration: 0.6, ease: 'power2.out' });
    }
  });

  tl
    .to(ll1,  { y: '0%',    duration: 0.75, ease: 'power3.out' })
    .to(ll2,  { y: '0%',    duration: 0.75, ease: 'power3.out' }, '-=0.55')
    .to(rule, { width: '180px', duration: 0.5, ease: 'power2.inOut' }, '-=0.2')
    .to(role, { opacity: 1, duration: 0.45, ease: 'power2.out' }, '-=0.2')
    .to(bar,  { width: '100%', duration: 0.7, ease: 'power2.inOut' }, '-=0.3');

  // Enter button click — dismiss splash and mark as visited
  enterBtn.addEventListener('click', () => {
    sessionStorage.setItem(storeKey('visited'), '1');
    gsap.to(loader, {
      opacity: 0, duration: 0.55,
      onComplete: () => {
        loader.style.display = 'none';
        initPage();
      }
    });
  });
})();

// ─── COMPOSER HOME INJECTION ───
// Fills homepage-only identity fields from COMPOSER config.
// Shared fields (logo, mini-disc, footer) are handled by initComposer() in shared.js.
function initComposerHome() {
  const c = typeof COMPOSER !== 'undefined' ? COMPOSER : null;
  if (!c) return;

  // Splash loader words
  const ll1 = document.getElementById('ll1');
  const ll2 = document.getElementById('ll2');
  if (ll1) ll1.textContent = c.nameFirst;
  if (ll2) ll2.textContent = c.nameLast;

  // Loader subtitle
  const role = document.getElementById('loader-role');
  if (role) role.textContent = c.role;

  // Spotify section blurb
  const sd = document.querySelector('.spotify-desc');
  if (sd) sd.textContent = c.spotifyBlurb;

  // Bio section — heading and paragraphs
  const bioHeading = document.querySelector('.bio-heading');
  if (bioHeading && c.bioHeading) bioHeading.innerHTML = c.bioHeading[0] + '<br>' + c.bioHeading[1];

  const bioTexts = document.querySelectorAll('.bio-text');
  c.bioParas.forEach((para, i) => {
    if (bioTexts[i]) bioTexts[i].textContent = para;
  });

  // Bio background video
  const bioIframe = document.querySelector('.bio-video-wrap iframe');
  if (bioIframe && c.bioVideoId) {
    bioIframe.src = 'https://www.youtube-nocookie.com/embed/' + c.bioVideoId +
      '?autoplay=1&mute=1&loop=1&playlist=' + c.bioVideoId + '&controls=0&showinfo=0&rel=0&modestbranding=1';
  }

  // Contact section
  const contactBtn = document.getElementById('contact-magnetic-btn');
  if (contactBtn) {
    contactBtn.href = 'mailto:' + c.email;
    const label = contactBtn.querySelector('.cmb-label');
    if (label) label.textContent = c.email;
  }
  const tagline = document.querySelector('.contact-tagline');
  if (tagline) tagline.textContent = c.contactTagline;

  // Shelf LP artwork — use first 4 films' card images
  if (typeof FILMS !== 'undefined') {
    [0, 1, 2, 3].forEach(i => {
      const el = document.getElementById('shelf-lp-' + i);
      if (el && FILMS[i] && FILMS[i].cards && FILMS[i].cards[0]) {
        el.style.backgroundImage = "url('" + FILMS[i].cards[0].img + "')";
      }
    });
  }

  // Hero card bg video — also set here for robustness on returning visits
  const heroCardIframe = document.querySelector('#hc2-video iframe');
  if (heroCardIframe && c.splashVideoId) {
    if (!heroCardIframe.src) {
      const vid = c.splashVideoId;
      heroCardIframe.src = `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&mute=1&loop=1&playlist=${vid}&controls=0&showinfo=0&rel=0&modestbranding=1&start=10`;
    }
  }
}

// ─── INIT PAGE ───
function initPage() {
  initComposer();
  initComposerHome();
  initLenis();
  initCards();
  buildTicker();
  // Always start on slide 0 (Brian Tyler).
  // The 1.5s cooldown blocks watchTickerCenter from immediately snapping
  // to whatever film happens to be at centre — the 80px guard is gone
  // so auto-detection works correctly after the cooldown expires.
  selectSlide(0);
  lastManualSelectTime = Date.now();
  buildFilmsList();
  buildTvList();
  buildVideosGrid();
  initReveal();
  initPressSection();
  initClock();
  initModeButtons();
  initFullscreen();
  initMiniDisc();
  initLPBrowser();
  initLightbox();
  initNavLinks();
  initCta();
  initContactOrb();
  initCardCursor();
  initBirthdayMode();
  initCinemaMode();
}

// ─── LENIS SMOOTH SCROLL ───
function initLenis() {
  if (lenisInstance) { lenisInstance.destroy(); lenisInstance = null; }
  lenisInstance = new Lenis({ lerp: 0.08, duration: 1.2 });
  const gen = ++lenisGeneration;
  function raf(time) {
    if (lenisGeneration !== gen) return; // discard zombie loops
    lenisInstance.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// ─── NAV SMOOTH SCROLL (intercepts same-page hash links for Lenis) ───
function initNavLinks() {
  document.querySelectorAll('.hdr-nav a').forEach(a => {
    a.addEventListener('click', e => {
      const url = new URL(a.href, window.location.href);
      // Compare base URLs without hash — avoids GitHub Pages path mismatch
      // where 'index.html' in href resolves to '/brian-tyler/index.html'
      // but window.location.pathname is '/brian-tyler/'. Strip hash from both.
      const baseHref = url.href.split('#')[0];
      const baseCurrent = window.location.href.split('#')[0];
      if (baseHref === baseCurrent && url.hash) {
        e.preventDefault();
        lenisInstance && lenisInstance.scrollTo(url.hash);
      }
    });
  });
  // Logo click → scroll to top
  const logo = document.querySelector('.hdr-logo');
  if (logo) {
    logo.addEventListener('click', e => {
      e.preventDefault();
      lenisInstance && lenisInstance.scrollTo(0);
    });
  }
}

// ─── FAN CARDS ───
function initCards() {
  const slide = INTRO_SLIDE;
  ['hc1-img', 'hc2-img', 'hc3-img'].forEach((id, i) => {
    const el = document.getElementById(id);
    el.src = slide.cards[i].img;
    el.style.objectPosition = slide.cards[i].pos;
  });

  const hc1    = document.getElementById('hc1');
  const hc2    = document.getElementById('hc2');
  const hc3    = document.getElementById('hc3');
  const spread = Math.min(Math.max(window.innerWidth * 0.13, 160), 230);

  gsap.set(hc1, { rotation: -14, x: -spread, transformOrigin: '50% 100%', opacity: 0, zIndex: 1 });
  gsap.set(hc2, { rotation: 0,   x: 0,       transformOrigin: '50% 100%', opacity: 0, zIndex: 2 });
  gsap.set(hc3, { rotation: 14,  x: spread,  transformOrigin: '50% 100%', opacity: 0, zIndex: 1 });

  gsap.timeline({ delay: 0.1 })
    .to(hc1, { opacity: 1, duration: 0.6, ease: 'power2.out' })
    .to(hc2, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4')
    .to(hc3, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4');

  // Scroll fan-out
  ScrollTrigger.create({
    trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1,
    onUpdate: self => {
      const p = self.progress;
      gsap.to(hc1, { rotation: -14 - p * 10, x: -spread - p * 40, duration: 0.1, overwrite: 'auto' });
      gsap.to(hc3, { rotation:  14 + p * 10, x:  spread + p * 40, duration: 0.1, overwrite: 'auto' });
      gsap.to(hc2, { y: p * 30,                                    duration: 0.1, overwrite: 'auto' });
    }
  });

  // Hover lift
  [hc1, hc2, hc3].forEach(card => {
    card.addEventListener('mouseenter', () => gsap.to(card, { y: -12, scale: 1.03, duration: 0.3, overwrite: 'auto' }));
    card.addEventListener('mouseleave', () => gsap.to(card, { y: 0,   scale: 1,    duration: 0.35, overwrite: 'auto' }));
    card.addEventListener('click', () => {
      if (currentSlideIdx === 0) {
        lenisInstance && lenisInstance.scrollTo('#bio');
      } else {
        window.location.href = `film.html?id=${FILMS[currentSlideIdx - 1].id}`;
      }
    });
  });
}

// ─── HERO TITLE UPDATE ───
function updateHeroTitle(idx) {
  const el = document.getElementById('hero-title-text');
  if (!el) return;
  const composerLabel = typeof COMPOSER !== 'undefined' ? COMPOSER.nameFirst + ' ' + COMPOSER.nameLast : 'COMPOSER';
  const newHtml = idx === 0 ? composerLabel : FILMS[idx - 1].ticker;
  gsap.to(el, {
    opacity: 0, duration: 0.15,
    onComplete: () => {
      el.innerHTML = newHtml;
      gsap.to(el, { opacity: 1, duration: 0.3 });
    }
  });
}

// ─── SELECT SLIDE (ticker / prev-next changes the hero cards) ───
function selectSlide(idx) {
  if (idx < 0)             idx = FILMS.length;
  if (idx > FILMS.length)  idx = 0;
  currentSlideIdx = idx;

  const slide = idx === 0 ? INTRO_SLIDE : FILMS[idx - 1];
  updateHeroTitle(idx);

  ['hc1-img', 'hc2-img', 'hc3-img'].forEach((id, i) => {
    const el = document.getElementById(id);
    gsap.to(el, {
      opacity: 0, duration: 0.25,
      onComplete: () => {
        el.src = slide.cards[i].img;
        el.style.objectPosition = slide.cards[i].pos;
        gsap.to(el, { opacity: 1, duration: 0.35 });
      }
    });
  });

  const cardVideo = document.getElementById('hc2-video');
  if (cardVideo) cardVideo.classList.toggle('active', idx === 0);

  document.querySelectorAll('.ticker-item[data-idx]').forEach(item => {
    item.classList.toggle('active', parseInt(item.dataset.idx) === idx);
  });

  // Show film-slide state: enables custom cursor + hides Brian Tyler video
  const wrap = document.getElementById('cards-wrap');
  if (wrap) wrap.classList.toggle('is-film-slide', idx > 0);

  // Hide the custom cursor when returning to the intro (Brian Tyler) slide
  if (idx === 0) {
    const cc = document.getElementById('cards-cursor');
    if (cc) cc.style.display = 'none';
  }

  updateCta(idx);
}

// ─── TICKER ───
function buildTicker() {
  const inner    = document.getElementById('ticker-inner');
  const composerLabel = typeof COMPOSER !== 'undefined' ? COMPOSER.nameFirst + ' ' + COMPOSER.nameLast : 'COMPOSER';
  const allItems = [
    { label: composerLabel, idx: 0 },
    ...FILMS.map((f, i) => ({ label: f.ticker, idx: i + 1 }))
  ];

  let html = '';
  for (let pass = 0; pass < 2; pass++) {
    allItems.forEach(item => {
      html += `<span class="ticker-item${item.idx === 0 ? ' active' : ''}" data-idx="${item.idx}">${item.label}</span>`;
      html += `<span class="ticker-div">◆</span>`;
    });
  }
  inner.innerHTML = html;

  inner.querySelectorAll('.ticker-item').forEach(el => {
    el.addEventListener('click', () => {
      lastManualSelectTime = Date.now();
      selectSlide(parseInt(el.dataset.idx));
    });
  });

  document.getElementById('ticker-prev').addEventListener('click', () => {
    lastManualSelectTime = Date.now();
    selectSlide(currentSlideIdx - 1);
  });
  document.getElementById('ticker-next').addEventListener('click', () => {
    lastManualSelectTime = Date.now();
    selectSlide(currentSlideIdx + 1);
  });

  watchTickerCenter();
}

// ─── CENTER DETECTION — auto-select whichever ticker item is closest to the overflow centre ───
function watchTickerCenter() {
  const overflow = document.querySelector('.ticker-overflow');
  // Capture this loop's generation token. If tickerGeneration is bumped
  // (by bfcache reinit or another buildTicker call) this loop self-terminates.
  const gen = ++tickerGeneration;
  // Track the closest item from the PREVIOUS frame — always updated, even
  // during cooldown. This means when the cooldown expires, we already know
  // what was at center just before, so we only fire when something genuinely
  // NEW arrives (prevents the Mario Bros jump on page load/return visit).
  let prevClosestIdx = -1;

  function tick() {
    if (tickerGeneration !== gen) return; // zombie loop from old session — die silently
    const inCooldown = Date.now() - lastManualSelectTime < MANUAL_COOLDOWN_MS;

    const overflowRect = overflow.getBoundingClientRect();
    const centerX = overflowRect.left + overflowRect.width / 2;

    let closest = null;
    let closestDist = Infinity;

    overflow.querySelectorAll('.ticker-item').forEach(el => {
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const dist = Math.abs(elCenterX - centerX);
      if (dist < closestDist) {
        closestDist = dist;
        closest = el;
      }
    });

    if (closest) {
      const idx = parseInt(closest.dataset.idx);

      // Fire only when:
      //  1. Not inside manual-click cooldown
      //  2. The item at center changed since last frame  (genuine arrival)
      //  3. The new item is different from what's already shown
      if (!inCooldown && idx !== prevClosestIdx && idx !== currentSlideIdx) {
        selectSlide(idx);
      }

      prevClosestIdx = idx; // always keep in sync, cooldown or not
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// ─── FILMS LIST ───
function buildFilmsList() {
  const list = document.getElementById('films-list');
  list.innerHTML = '';

  // Remove any existing load-more button from a previous call
  const existingBtn = list.nextElementSibling;
  if (existingBtn && existingBtn.classList.contains('load-more-btn')) existingBtn.remove();

  const initialCount = (typeof COMPOSER !== 'undefined' && COMPOSER.listInitialCount)
    ? COMPOSER.listInitialCount
    : FILMS.length;

  FILMS.forEach((film, i) => {
    const li = document.createElement('li');
    li.className = 'film-row reveal' + (i >= initialCount ? ' film-row--hidden' : '');
    const accoladesHtml = film.accolades && film.accolades.length
      ? `<span class="film-accolades">${film.accolades.map(a => `<span class="film-accolade">◆ ${a}</span>`).join('')}</span>`
      : '';
    li.innerHTML = `
      <span class="film-num">${String(i + 1).padStart(2, '0')}</span>
      <div class="film-info">
        <div class="film-title-row">
          <span class="film-name">${film.title}</span><span class="type-pill type-pill-film">Film</span>
        </div>
        ${accoladesHtml}
      </div>
      <span class="film-year">${film.year}</span>
      <span class="film-arrow">→</span>
    `;
    li.addEventListener('click', () => {
      window.location.href = `film.html?id=${film.id}`;
    });
    list.appendChild(li);
  });

  // Load More button — only shown when there are hidden rows
  if (FILMS.length > initialCount) {
    const btn = document.createElement('button');
    btn.className = 'load-more-btn';
    btn.textContent = `Load More (${FILMS.length - initialCount} more)`;
    btn.addEventListener('click', () => {
      list.querySelectorAll('.film-row--hidden').forEach(el => {
        el.classList.remove('film-row--hidden');
      });
      btn.remove();
      ScrollTrigger.refresh();
    });
    list.after(btn);
  }
}

// ─── TV LIST ───
function buildTvList() {
  const list = document.getElementById('tv-list');
  if (!list) return;
  list.innerHTML = '';

  // Hide the whole TV section if there are no shows
  const tvSection = document.getElementById('television');
  if (!TV_SHOWS || !TV_SHOWS.length) {
    if (tvSection) tvSection.style.display = 'none';
    return;
  }
  if (tvSection) tvSection.style.display = '';

  TV_SHOWS.forEach((show, i) => {
    const li = document.createElement('li');
    li.className = 'film-row reveal';
    const accoladesHtml = show.accolades && show.accolades.length
      ? `<span class="film-accolades">${show.accolades.map(a => `<span class="film-accolade">◆ ${a}</span>`).join('')}</span>`
      : '';
    li.innerHTML = `
      <span class="film-num">${String(i + 1).padStart(2, '0')}</span>
      <div class="film-info">
        <div class="film-title-row">
          <span class="film-name">${show.title}</span><span class="type-pill type-pill-tv">TV</span>
        </div>
        ${accoladesHtml}
      </div>
      <span class="film-year">${show.year}</span>
      <span class="film-arrow">→</span>
    `;
    li.addEventListener('click', () => {
      window.location.href = `film.html?id=${show.id}`;
    });
    list.appendChild(li);
  });
}

// ─── VIDEOS GRID ───
function buildVideosGrid() {
  const grid = document.getElementById('videos-grid');
  grid.innerHTML = ''; // clear before populating — prevents doubles on reinit
  VIDEOS.forEach(v => {
    const tile = document.createElement('div');
    tile.className = 'video-tile';
    tile.innerHTML = `
      <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="${v.title}" loading="lazy">
      <div class="video-tile-overlay"></div>
      <div class="video-tile-badge">
        <span class="vtb-play">▶</span>
        <span class="vtb-label">PLAY</span>
      </div>
      <span class="video-tile-title">${v.title}</span>
    `;
    tile.addEventListener('click', () => openLightbox(v.id));
    grid.appendChild(tile);
  });
}

// ─── HERO CTA ───
function initCta() {
  document.getElementById('hero-cta-btn').addEventListener('click', () => {
    if (currentSlideIdx === 0) {
      lenisInstance && lenisInstance.scrollTo('#bio');
    } else {
      window.location.href = `film.html?id=${FILMS[currentSlideIdx - 1].id}`;
    }
  });
}

function updateCta(idx) {
  const btn = document.getElementById('hero-cta-btn');
  if (!btn) return; // null check FIRST — was crashing before this was moved up
  const icon = btn.querySelector('.hero-cta-icon');
  const text = btn.querySelector('.hero-cta-text');

  // Re-trigger entry animation
  btn.classList.remove('animating');
  void btn.offsetWidth; // reflow to restart animation
  btn.classList.add('animating');

  if (idx === 0) {
    btn.classList.remove('cta-score');
    btn.classList.add('cta-discover');
    icon.textContent = '↓';
    text.textContent = 'Behind the Man';
    // Remove score arrow if present
    const arrow = btn.querySelector('.hero-cta-arrow');
    if (arrow) arrow.remove();
  } else {
    btn.classList.remove('cta-discover');
    btn.classList.add('cta-score');
    icon.textContent = '♪';
    text.textContent = 'Explore the Score';
    // Add arrow if not already there
    if (!btn.querySelector('.hero-cta-arrow')) {
      const arrow = document.createElement('span');
      arrow.className = 'hero-cta-arrow';
      arrow.textContent = '→';
      btn.appendChild(arrow);
    }
  }
}

// ─── PRESS / NEWS SECTION ───
function initPressSection() {
  const grid    = document.getElementById('press-grid');
  const loading = document.getElementById('press-loading');
  if (!grid) return;

  // Curated press — read from COMPOSER config so swapping composer needs no JS edit
  const CURATED = (typeof COMPOSER !== 'undefined' && COMPOSER.curatedPress) ? COMPOSER.curatedPress : [];

  function renderCards(items) {
    // Clear grid (removes loading spinner if present)
    while (grid.firstChild) grid.removeChild(grid.firstChild);
    items.slice(0, 6).forEach(item => {
      const card = document.createElement('a');
      // Add in-view directly so cards show without scroll-trigger delay
      card.className = 'press-card reveal in-view';
      card.href      = item.link || '#';
      card.target    = '_blank';
      card.rel       = 'noopener noreferrer';
      const blurb = (item.description || '').substring(0, 115);
      card.innerHTML = `
        <div class="press-card-meta">
          <span class="press-source">${item.source}</span>
          <span class="press-date">${item.pubDate}</span>
        </div>
        <h3 class="press-title">${item.title}</h3>
        ${blurb ? `<p class="press-blurb">${blurb}…</p>` : ''}
        <span class="press-read-more">Read more ↗</span>
      `;
      grid.appendChild(card);
    });
  }

  // Show curated cards immediately — no loading delay, always works
  renderCards(CURATED);

  // Silently attempt live Google News fetch in the background.
  // If it succeeds with relevant results, swap the grid content.
  const RELEVANT = ['composer','score','soundtrack','marvel','yellowstone','avengers',
                    'iron man','thor','fast furious','crazy rich','theme','orchestral',
                    'abbey road','capitol studios','emmy','film music'];
  function isRelevant(t, d) {
    const txt = (t + ' ' + d).toLowerCase();
    return RELEVANT.some(kw => txt.includes(kw));
  }
  function fmtDate(s) {
    try { return new Date(s).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}); }
    catch(e) { return s || ''; }
  }
  function strip(s) {
    return s ? s.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').trim() : '';
  }
  function domain(url) {
    try { return new URL(url).hostname.replace(/^www\./,''); } catch(e) { return ''; }
  }

  const query = encodeURIComponent(typeof COMPOSER !== 'undefined' ? COMPOSER.pressQuery : '"composer"');
  const rss   = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;
  const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(rss)}`;

  // Use setTimeout so fetch doesn't block page rendering
  setTimeout(() => {
    fetch(proxy)
      .then(r => r.json())
      .then(data => {
        if (!data.contents) return;
        const xml   = new DOMParser().parseFromString(data.contents, 'text/xml');
        const nodes = [...xml.querySelectorAll('item')];
        if (!nodes.length) return;
        const items = nodes.map(n => ({
          title:       strip(n.querySelector('title')?.textContent || ''),
          link:        n.querySelector('link')?.textContent || n.querySelector('guid')?.textContent || '',
          pubDate:     fmtDate(n.querySelector('pubDate')?.textContent || ''),
          source:      strip(n.querySelector('source')?.textContent || ''),
          description: strip(n.querySelector('description')?.textContent || '')
        })).filter(i => i.title);
        // Normalise missing source
        items.forEach(i => { if (!i.source) i.source = domain(i.link); });
        const live = items.filter(i => isRelevant(i.title, i.description));
        if (live.length >= 3) renderCards(live);
      })
      .catch(() => {}); // curated cards already showing — silent failure is fine
  }, 500);
}

// ─── CARD CURSOR ("Explore the Score" follows mouse over hero cards) ───
function initCardCursor() {
  const cursor = document.getElementById('cards-cursor');
  if (!cursor) return;

  const cards = ['hc1', 'hc2', 'hc3'].map(id => document.getElementById(id)).filter(Boolean);

  function moveCursor(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  }

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (currentSlideIdx === 0) return; // only on film slides
      cursor.style.display = 'flex';
    });
    card.addEventListener('mouseleave', () => {
      cursor.style.display = 'none';
    });
    card.addEventListener('mousemove', moveCursor);
  });
}

// ─── CONTACT ORB + CURSOR ───
// Orb: large ambient glow follows mouse anywhere inside the section.
// Cursor: small disk-style label replaces the pointer only while hovering
//         the email button (cursor:none on button, disk shown instead).
function initContactOrb() {
  const section = document.getElementById('contact');
  const orb     = document.getElementById('contact-orb');
  const cursor  = document.getElementById('contact-cursor');
  const btn     = document.getElementById('contact-magnetic-btn');
  if (!section || !orb) return;

  // Ambient glow tracks mouse across the whole section
  section.addEventListener('mousemove', e => {
    const rect = section.getBoundingClientRect();
    orb.style.left = (e.clientX - rect.left) + 'px';
    orb.style.top  = (e.clientY - rect.top)  + 'px';
  });

  // Disk cursor: show on button enter, hide on leave, track on move
  if (cursor && btn) {
    btn.addEventListener('mouseenter', () => { cursor.style.display = 'flex'; });
    btn.addEventListener('mouseleave', () => { cursor.style.display = 'none'; });
    btn.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });
  }
}

// ─── REVEAL ON SCROLL ───
function initReveal() {
  // Kill any stale ScrollTrigger instances before creating new ones.
  // On bfcache restore the old instances still exist but are no longer
  // connected to Lenis, causing sections to stay invisible forever.
  ScrollTrigger.getAll().forEach(t => t.kill());

  gsap.utils.toArray('.reveal').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => el.classList.add('in-view')
    });
  });
}

// ─── BFCACHE HANDLER ───
// Browsers freeze pages in the back/forward cache (bfcache) when navigating
// away. On restore (back button / clicking "← Home"), scripts don't re-run —
// but the DOM is fully intact with all event listeners still attached.
// We must NOT call initPage() here (that would double all dynamic content and
// all event listeners). Instead we do a targeted minimal reinit:
//   1. Restart Lenis (its RAF loop was killed by the freeze)
//   2. Refresh ScrollTrigger (stale instances keep .reveal sections invisible)
//   3. Bump tickerGeneration to kill any zombie watchTickerCenter loop, then
//      start a fresh one, reset to slide 0 with cooldown
//   4. Restart clock interval (_clockIntervalId dedup is handled in shared.js)
window.addEventListener('pageshow', function(e) {
  if (!e.persisted) return; // normal page load — already handled by runLoader

  // 1. Restart Lenis smooth-scroll RAF
  initLenis();

  // 2. Refresh ScrollTrigger — kill stale instances, recreate for all .reveal els
  initReveal();

  // 3. Reset ticker to Brian Tyler slide 0 and start a fresh center-watch loop.
  //    tickerGeneration bump happens inside watchTickerCenter() so any previous
  //    frozen loop self-terminates on its next RAF tick.
  currentSlideIdx      = 0;
  lastManualSelectTime = 0;
  selectSlide(0);
  lastManualSelectTime = Date.now(); // brief cooldown so auto-select doesn't immediately jump
  watchTickerCenter();

  // 4. Restart clock interval
  initClock();
});

// ─── CINEMA MODE ─── (idle easter egg)
function initCinemaMode() {
  const IDLE_MS = 10 * 1000; // <- change to 90 * 1000 for production
  const c   = typeof COMPOSER !== 'undefined' ? COMPOSER : {};
  const vid = c.splashVideoId || c.bioVideoId || '';
  if (!vid) return;

  const allVids   = (typeof VIDEOS !== 'undefined' && VIDEOS.length) ? VIDEOS : [];
  const leftVids  = allVids.slice(0, 3);
  const rightVids = allVids.slice(3, 6);

  function canisterHTML(v) {
    var thumb = 'https://img.youtube.com/vi/' + v.id + '/mqdefault.jpg';
    return '<div class="cinema-canister-wrap" data-vid="' + v.id + '">' +
      '<div class="cinema-canister" style="background-image:url(\'' + thumb + '\')"></div>' +
      '<p class="cinema-canister-title">' + v.title + '</p>' +
      '</div>';
  }

  var overlay = document.createElement('div');
  overlay.id = 'cinema-overlay';
  overlay.innerHTML =
    '<button class="cinema-exit" id="cinema-exit-btn" aria-label="Exit cinema mode">Exit</button>' +
    '<div class="cinema-layout">' +
      '<div class="cinema-reel-col reel-left">' +
        '<p class="cinema-reel-label">Select a film</p>' +
        leftVids.map(canisterHTML).join('') +
      '</div>' +
      '<div class="cinema-stage">' +
        '<div class="cinema-proscenium"></div>' +
        '<div class="cinema-screen-wrap">' +
          '<div class="cinema-screen-outer">' +
            '<div class="cinema-screen-inner">' +
              '<iframe id="cinema-iframe" src="" allow="autoplay; encrypted-media" allowfullscreen></iframe>' +
            '</div>' +
            '<div class="cinema-screen-rod"></div>' +
          '</div>' +
        '</div>' +
        '<div class="cinema-meta"><p class="cinema-headline">Click the exit sign to leave</p></div>' +
      '</div>' +
      '<div class="cinema-reel-col reel-right">' +
        '<p class="cinema-reel-label">Select a film</p>' +
        rightVids.map(canisterHTML).join('') +
      '</div>' +
    '</div>' +
    '<img class="cinema-chairs" src="files/CinemaChairs.png" alt="" aria-hidden="true">';

  document.body.appendChild(overlay);
  var iframe = document.getElementById('cinema-iframe');
  var idleTimer, active = false;

  function setVideo(videoId) {
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + videoId +
      '?autoplay=1&mute=1&loop=1&playlist=' + videoId +
      '&controls=0&showinfo=0&rel=0&modestbranding=1&start=5';
    overlay.querySelectorAll('.cinema-canister-wrap').forEach(function(el) {
      el.classList.toggle('active', el.dataset.vid === videoId);
    });
  }

  function enterCinema() {
    if (active) return;
    active = true;
    setVideo(vid);
    overlay.classList.add('cinema-visible');
    setTimeout(function() { overlay.classList.add('screen-down'); }, 200);
    setTimeout(function() { overlay.classList.add('chairs-up');  }, 350);
    setTimeout(function() { overlay.classList.add('meta-in');    }, 1400);
  }

  function exitCinema() {
    if (!active) return;
    active = false;
    overlay.style.transition = 'opacity 0.5s ease';
    overlay.style.opacity    = '0';
    overlay.style.pointerEvents = 'none';
    setTimeout(function() {
      overlay.removeAttribute('style');
      overlay.classList.remove('cinema-visible', 'screen-down', 'chairs-up', 'meta-in');
      iframe.src = '';
      resetTimer();
    }, 520);
  }

  function resetTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(enterCinema, IDLE_MS);
  }

  document.getElementById('cinema-exit-btn').addEventListener('click', exitCinema);

  overlay.querySelectorAll('.cinema-canister-wrap').forEach(function(el) {
    el.addEventListener('click', function() { setVideo(el.dataset.vid); });
  });

  ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'].forEach(function(evt) {
    document.addEventListener(evt, function() { if (!active) resetTimer(); }, { passive: true });
  });

  resetTimer();
}


// ─── BIRTHDAY MODE ─── (annual easter egg)
function initBirthdayMode() {
  const c = typeof COMPOSER !== 'undefined' ? COMPOSER : {};
  if (!c.birthday) return;

  const today = new Date();
  const mm    = String(today.getMonth() + 1).padStart(2, '0');
  const dd    = String(today.getDate()).padStart(2, '0');
  if (c.birthday !== `${mm}-${dd}`) return;

  const seenKey = typeof storeKey === 'function' ? storeKey('bday-seen') : 'bday-seen';
  if (sessionStorage.getItem(seenKey)) return;
  sessionStorage.setItem(seenKey, '1');

  const name    = c.nameDisplay || `${c.nameFirst} ${c.nameLast}`;
  const social  = c.social || {};
  const links   = [];
  if (social.twitter)   links.push(`<a href="${social.twitter}"   target="_blank" rel="noopener">Send a message on X &nbsp;↗</a>`);
  if (social.instagram) links.push(`<a href="${social.instagram}" target="_blank" rel="noopener">Instagram &nbsp;↗</a>`);

  const overlay = document.createElement('div');
  overlay.id = 'birthday-overlay';
  overlay.innerHTML = `
    <canvas id="birthday-fireworks"></canvas>
    <div class="bday-content">
      <span class="bday-icon">&#127881;</span>
      <p class="bday-eyebrow">A special occasion</p>
      <h1 class="bday-name">Happy Birthday</h1>
      <p class="bday-subtitle">${name}</p>
      <div class="bday-divider"></div>
      <p class="bday-message">Decades of extraordinary music. Scores that have defined some of cinema's greatest moments &mdash; and made countless others feel bigger than they really are.<br><br>If the music has ever moved you, today's a great day to say so.</p>
      ${links.length ? `<div class="bday-social">${links.join('')}</div>` : ''}
      <button class="bday-close">Continue to site &nbsp;&rsaquo;</button>
    </div>
  `;
  document.body.appendChild(overlay);

  // Fade in after paint
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('bday-visible')));

  // Launch fireworks
  launchBirthdayFireworks(overlay.querySelector('#birthday-fireworks'));

  // Close button
  overlay.querySelector('.bday-close').addEventListener('click', () => {
    overlay.style.transition = 'opacity 0.6s ease';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 650);
  });
}

function launchBirthdayFireworks(canvas) {
  if (!canvas) return;

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const ctx = canvas.getContext('2d');
  // Gold/warm colour palette matching the site
  const PALETTE = [
    [200, 169, 110], [220, 185, 100], [255, 215, 80],
    [230, 200, 140], [255, 240, 160], [180, 140,  80]
  ];
  const particles = [];

  function burst(x, y) {
    const n = 55 + Math.floor(Math.random() * 35);
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.4;
      const speed = 1.8 + Math.random() * 5.5;
      const col   = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      particles.push({
        x, y,
        vx:    Math.cos(angle) * speed,
        vy:    Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.010 + Math.random() * 0.012,
        size:  1.8 + Math.random() * 2.8,
        col,
        trail: []
      });
    }
  }

  // Schedule 10 auto-bursts
  let fired = 0;
  function scheduleBurst() {
    if (fired >= 10) return;
    burst(
      canvas.width  * (0.15 + Math.random() * 0.70),
      canvas.height * (0.08 + Math.random() * 0.52)
    );
    fired++;
    setTimeout(scheduleBurst, 350 + Math.random() * 650);
  }
  scheduleBurst();

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.trail.push([p.x, p.y]);
      if (p.trail.length > 6) p.trail.shift();
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.09; // gravity
      p.vx *= 0.98;
      p.alpha -= p.decay;
      if (p.alpha <= 0) { particles.splice(i, 1); continue; }
      // Trail
      p.trail.forEach(([tx, ty], ti) => {
        ctx.beginPath();
        ctx.arc(tx, ty, p.size * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${p.alpha * (ti / p.trail.length) * 0.45})`;
        ctx.fill();
      });
      // Head
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${p.alpha})`;
      ctx.fill();
    }
    if (particles.length > 0 || fired < 10) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
