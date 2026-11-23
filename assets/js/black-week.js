(function () {
  var END = Date.parse('2026-12-01T00:00:00+01:00');
  var KEY = 'idb-black-week-2026';
  var banner = document.getElementById('bw-banner');
  var section = document.getElementById('black-week');

  function hide(el) {
    if (el) el.hidden = true;
  }

  if (Date.now() >= END) {
    hide(banner);
    hide(section);
    return;
  }

  try {
    if (window.localStorage.getItem(KEY) === '1') hide(banner);
  } catch (error) {}

  if (!banner) return;
  var close = banner.querySelector('.bw-close');
  if (!close) return;
  close.addEventListener('click', function () {
    try {
      window.localStorage.setItem(KEY, '1');
    } catch (error) {}
    hide(banner);
  });
})();
