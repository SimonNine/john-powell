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

  // Skip splash on returning visits (same browser session)
  if (sessionStorage.getItem('bt-visited')) {
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
    sessionStorage.setItem('bt-visited', '1');
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
