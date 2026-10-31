(function () {
  var END = Date.parse('2026-11-04T22:59:59Z');
  var SESSION_KEY = 'idb-evo-halloween-2026';
  var CLOSED_KEY = 'idb-evo-halloween-2026-closed';
  var DAY = 24 * 60 * 60 * 1000;
  var CODE = 'IRON10';
  var badge = document.getElementById('evo-halloween-badge');

  if (Date.now() > END) {
    if (badge) badge.hidden = true;
    return;
  }

  if (sessionSeen() || closedRecently()) return;

  var root = null;
  var previousFocus = null;

  function sessionSeen() {
    try { return sessionStorage.getItem(SESSION_KEY) === '1'; }
    catch (error) { return false; }
  }

  function markSession() {
    try { sessionStorage.setItem(SESSION_KEY, '1'); }
    catch (error) {}
  }

  function closedRecently() {
    try {
      var stored = Number(localStorage.getItem(CLOSED_KEY));
      return Number.isFinite(stored) && Date.now() - stored < DAY;
    } catch (error) { return false; }
  }

  function markClosed() {
    try { localStorage.setItem(CLOSED_KEY, String(Date.now())); }
    catch (error) {}
  }

  function focusable() {
    return Array.prototype.filter.call(root.querySelectorAll('a[href], button:not([disabled])'), function (el) {
      return !el.closest('[hidden]');
    });
  }

  function onKey(event) {
    if (!root || root.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    var items = focusable();
    if (!items.length) {
      event.preventDefault();
      return;
    }
    var first = items[0];
    var last = items[items.length - 1];
    var active = document.activeElement;
    var dialog = root.querySelector('.promo-dialog');
    if (event.shiftKey && (active === first || active === dialog || !root.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !root.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  }

  function open() {
    if (!root || !root.hidden || sessionSeen()) return;
    markSession();
    previousFocus = document.activeElement;
    root.hidden = false;
    document.documentElement.classList.add('promo-open');
    document.body.classList.add('promo-open');
    root.querySelector('.promo-dialog').focus();
    document.addEventListener('keydown', onKey);
  }

  function close() {
    if (!root || root.hidden) return;
    root.hidden = true;
    document.documentElement.classList.remove('promo-open');
    document.body.classList.remove('promo-open');
    document.removeEventListener('keydown', onKey);
    markClosed();
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  }

  function markCopied(button) {
    button.textContent = 'Kopiert ✓';
  }

  function fallbackCopy(button) {
    var area = document.createElement('textarea');
    area.value = CODE;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.left = '-999px';
    document.body.appendChild(area);
    area.select();
    try {
      if (document.execCommand('copy')) markCopied(button);
    } catch (error) {}
    area.remove();
  }

  root = document.createElement('div');
  root.className = 'promo';
  root.hidden = true;
  root.innerHTML = '<div class="promo-dialog" role="dialog" aria-modal="true" aria-labelledby="promo-ad-label" tabindex="-1"><div class="promo-head"><p class="promo-ad" id="promo-ad-label">Anzeige · Werbung</p><button class="promo-close" type="button" aria-label="Schließen">×</button></div><picture class="promo-picture"><source srcset="assets/img/evo-halloween-2026.webp" type="image/webp"><img class="promo-banner" src="assets/img/evo-halloween-2026.jpg" width="608" height="1080" alt="EVO PEPTIDE Halloween Special: Aktion bis 4. November 2026, 23:59 Uhr"></picture><div class="promo-code"><p>Dein Code: <strong>IRON10</strong></p><button class="promo-copy" type="button">Code kopieren</button></div><a class="cta" href="https://evo-peptide.com/" target="_blank" rel="sponsored noopener">Zu EVO-PEPTIDE</a><a class="promo-more" href="partner.html">Alle Partner &amp; Codes</a></div>';
  document.body.appendChild(root);
  root.addEventListener('click', function (event) {
    if (event.target === root) close();
  });
  root.querySelector('.promo-close').addEventListener('click', close);
  root.querySelector('.promo-copy').addEventListener('click', function (event) {
    var button = event.currentTarget;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(CODE).then(function () { markCopied(button); }).catch(function () { fallbackCopy(button); });
    } else {
      fallbackCopy(button);
    }
  });
  window.setTimeout(open, 2500);
})();
