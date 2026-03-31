// ─── PASSWORD GATE ───
// Simple client-side password protection for preview sharing
(function() {
  const PASS_HASH = '95fc23fa'; // lightweight hash of the password
  const STORAGE_KEY = 'bt-auth';

  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return (hash >>> 0).toString(16);
  }

  // Already authenticated this session
  if (sessionStorage.getItem(STORAGE_KEY) === PASS_HASH) return;

  // Build gate UI
  const gate = document.createElement('div');
  gate.id = 'auth-gate';
  gate.innerHTML = `
    <div class="auth-inner">
      <div class="auth-brand">${typeof COMPOSER !== 'undefined' ? COMPOSER.nameFirst + ' ' + COMPOSER.nameLast : 'PRIVATE PREVIEW'}</div>
      <div class="auth-sub">Private Preview</div>
      <form class="auth-form" id="auth-form">
        <input type="password" class="auth-input" id="auth-input" placeholder="Enter password" autocomplete="off" autofocus>
        <button type="submit" class="auth-btn">Enter</button>
      </form>
      <div class="auth-error" id="auth-error"></div>
    </div>
  `;

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #auth-gate {
      position: fixed; inset: 0;
      background: #050505;
      z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Barlow', sans-serif;
    }
    .auth-inner { text-align: center; }
    .auth-brand {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(2.5rem, 8vw, 5rem);
      letter-spacing: 0.18em;
      color: #C8A96E;
      line-height: 1;
    }
    .auth-sub {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: rgba(252,250,245,0.3);
      margin-top: 8px;
      margin-bottom: 40px;
    }
    .auth-form { display: flex; gap: 0; justify-content: center; }
    .auth-input {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(200,169,110,0.3);
      border-right: none;
      color: #FCFAF5;
      font-family: 'Barlow', sans-serif;
      font-size: 0.8rem;
      letter-spacing: 0.05em;
      padding: 14px 20px;
      width: 260px;
      outline: none;
      transition: border-color 0.2s;
    }
    .auth-input:focus { border-color: rgba(200,169,110,0.6); }
    .auth-input::placeholder { color: rgba(252,250,245,0.2); }
    .auth-btn {
      background: rgba(200,169,110,0.15);
      border: 1px solid rgba(200,169,110,0.3);
      color: #C8A96E;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      padding: 14px 28px;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
    }
    .auth-btn:hover {
      background: rgba(200,169,110,0.25);
      border-color: rgba(200,169,110,0.6);
    }
    .auth-error {
      margin-top: 16px;
      font-size: 0.7rem;
      letter-spacing: 0.08em;
      color: #e74c3c;
      height: 20px;
    }
  `;

  document.head.appendChild(style);
  document.body.prepend(gate);

  // Prevent page scroll while gate is visible
  document.body.style.overflow = 'hidden';

  document.getElementById('auth-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const val = document.getElementById('auth-input').value;
    if (simpleHash(val) === PASS_HASH) {
      sessionStorage.setItem(STORAGE_KEY, PASS_HASH);
      document.body.style.overflow = '';
      gate.style.opacity = '0';
      gate.style.transition = 'opacity 0.4s';
      setTimeout(() => gate.remove(), 400);
    } else {
      document.getElementById('auth-error').textContent = 'Incorrect password';
      document.getElementById('auth-input').value = '';
      document.getElementById('auth-input').focus();
    }
  });
})();
