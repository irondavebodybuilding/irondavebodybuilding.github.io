/* Verkaufsseite /start
   Platzhalter, die vor dem Livegang ersetzt werden:
   - META_PIXEL_ID ist 1796427091588386.
     Das Skript wird erst geladen, wenn die Einwilligung "marketing" ist.
   - Die sieben Buchungslinks zeigen auf #copecart-basis-3, #copecart-basis-6, #copecart-basis-12,
     #copecart-plus-6, #copecart-plus-12, #copecart-elite-6 und #copecart-elite-12.
     Sobald ein href mit http:// oder https:// beginnt, haengt dieses Skript
     utm_source, utm_medium, utm_campaign, utm_content, utm_term und fbclid
     aus der Seiten-URL an. Hash-Platzhalter bleiben unveraendert.
   - ELITE_SEATS_LEFT ist der Platzhalter fuer freie ELITE-Plaetze (Vorschau: 10).
     Sichtbar wird "Noch N von 10 Plaetzen frei". Bei 0 verschwinden die ELITE-Buchungsbuttons,
     stattdessen steht "Aktuell ausgebucht – schreib mir per WhatsApp".
   Einwilligung: localStorage-Schluessel idbb-start-consent, Werte "necessary" oder "marketing".
   Das Pixel-Skript wird erst nach "marketing" ins Dokument gesetzt. Es gibt kein noscript-Bild.
*/
(function () {
  'use strict';

  var META_PIXEL_ID = '1796427091588386';
  var ELITE_SEATS_LEFT = 10;
  var CONSENT_KEY = 'idbb-start-consent';
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];
  var pixelStarted = false;
  var viewContentSent = false;

  function query() {
    return new URLSearchParams(window.location.search);
  }

  function applyHook() {
    var hook = query().get('hook') === '2' ? '2' : '1';
    document.documentElement.setAttribute('data-hook', hook);
    var visible = document.querySelector(hook === '2' ? '.hook-2' : '.hook-1');
    var hidden = document.querySelectorAll(hook === '2' ? '.hook-1' : '.hook-2');
    if (visible && visible.tagName === 'H1') visible.id = 'hook-title';
    for (var i = 0; i < hidden.length; i += 1) {
      if (hidden[i].id === 'hook-title') hidden[i].removeAttribute('id');
    }
  }

  function newYearOpen(now) {
    var start = new Date('2026-12-14T00:00:00+01:00');
    var end = new Date('2027-01-17T23:59:59+01:00');
    return now >= start && now <= end;
  }

  function applyNewYear() {
    var preview = query().get('neujahr') === '1';
    var show = preview || newYearOpen(new Date());
    var banner = document.getElementById('ny-banner');
    var extra = document.getElementById('faq-neujahr');
    if (banner) banner.hidden = !show;
    if (extra) extra.hidden = !show;
  }

  function applySeats() {
    var seats = ELITE_SEATS_LEFT;
    var card = document.getElementById('elite-seats-card');
    var line = document.getElementById('elite-seats');
    if (card) card.textContent = 'Noch ' + seats + ' von 10 Plätzen frei.';
    if (line) line.textContent = 'ELITE: Noch ' + seats + ' von 10 Plätzen frei.';
    var sold = seats === 0;
    var note = document.getElementById('elite-soldout');
    var buttons = document.getElementById('elite-buttons');
    if (note) note.hidden = !sold;
    if (buttons) buttons.hidden = sold;
  }

  function readConsent() {
    try {
      return window.localStorage.getItem(CONSENT_KEY);
    } catch (error) {
      return null;
    }
  }

  function writeConsent(value) {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch (error) {
      /* Speicher kann gesperrt sein. Dann bleibt die Wahl nur fuer diesen Aufruf. */
    }
  }

  function pixelIdReady() {
    return /^\d{5,}$/.test(META_PIXEL_ID);
  }

  function loadPixel() {
    if (window.fbq) return;
    /* Meta-Basiscode. Wird ausschliesslich von loadPixel aufgerufen. */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  }

  function track(eventName, payload) {
    if (readConsent() !== 'marketing' || !pixelStarted || typeof window.fbq !== 'function') return;
    window.fbq('track', eventName, payload || {});
  }

  function watchPackages() {
    var target = document.getElementById('pakete');
    if (!target || viewContentSent || readConsent() !== 'marketing') return;
    function send() {
      if (viewContentSent) return;
      viewContentSent = true;
      track('ViewContent', { content_name: 'Pakete', content_type: 'product_group' });
    }
    if (!('IntersectionObserver' in window)) {
      send();
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        send();
        observer.disconnect();
      });
    }, { threshold: 0.3 });
    observer.observe(target);
  }

  function startPixel() {
    if (pixelStarted || readConsent() !== 'marketing' || !pixelIdReady()) return;
    pixelStarted = true;
    loadPixel();
    window.fbq('consent', 'grant');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
    watchPackages();
  }

  function stopFurtherEvents() {
    if (typeof window.fbq === 'function') {
      window.fbq('consent', 'revoke');
    }
  }

  function withUtm(href) {
    var url;
    try {
      url = new URL(href, window.location.href);
    } catch (error) {
      return href;
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return href;
    if (url.origin === window.location.origin) return href;
    var incoming = query();
    UTM_KEYS.forEach(function (key) {
      var value = incoming.get(key);
      if (value) url.searchParams.set(key, value);
    });
    return url.toString();
  }

  function wireCheckout() {
    var links = document.querySelectorAll('a[data-checkout]');
    for (var i = 0; i < links.length; i += 1) {
      (function (link) {
        var current = link.getAttribute('href') || '';
        var next = withUtm(current);
        if (next !== current) link.setAttribute('href', next);
        link.addEventListener('click', function () {
          track('InitiateCheckout', {
            content_name: (link.getAttribute('data-package') || '') + ' ' + (link.getAttribute('data-months') || '') + ' Monate',
            content_category: link.getAttribute('data-package') || '',
            content_type: 'product'
          });
        });
      })(links[i]);
    }
  }

  function wireWhatsApp() {
    var links = document.querySelectorAll('a[data-contact="whatsapp"]');
    for (var i = 0; i < links.length; i += 1) {
      links[i].addEventListener('click', function () {
        track('Contact', { content_name: 'WhatsApp' });
      });
    }
  }

  function showBanner(show) {
    var banner = document.getElementById('consent');
    if (!banner) return;
    banner.hidden = !show;
    document.body.classList.toggle('consent-open', show);
  }

  function setConsent(value) {
    writeConsent(value);
    showBanner(false);
    if (value === 'marketing') startPixel();
    else stopFurtherEvents();
  }

  function initConsent() {
    var necessary = document.getElementById('consent-necessary');
    var marketing = document.getElementById('consent-marketing');
    var reopen = document.getElementById('consent-reopen');
    if (necessary) necessary.addEventListener('click', function () { setConsent('necessary'); });
    if (marketing) marketing.addEventListener('click', function () { setConsent('marketing'); });
    if (reopen) reopen.addEventListener('click', function () { showBanner(true); });
    var current = readConsent();
    if (current === 'marketing') {
      showBanner(false);
      startPixel();
    } else if (current === 'necessary') {
      showBanner(false);
    } else {
      showBanner(true);
    }
  }

  applyHook();
  applyNewYear();
  applySeats();
  wireCheckout();
  wireWhatsApp();
  initConsent();
})();
