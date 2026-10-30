document.querySelectorAll('.menu-toggle').forEach(button => {
  const nav = document.getElementById(button.getAttribute('aria-controls'));
  if (!nav) return;
  const close = () => { button.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); };
  button.addEventListener('click', () => { const open = button.getAttribute('aria-expanded') !== 'true'; button.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
  nav.addEventListener('keydown', event => { if (event.key === 'Escape') { close(); button.focus(); } });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
});
const privacy = document.getElementById('datenschutz');
const openPrivacy = () => { if (privacy && location.hash === '#datenschutz') privacy.open = true; };
document.getElementById('privacy-link')?.addEventListener('click', () => { if (privacy) privacy.open = true; });
window.addEventListener('hashchange', openPrivacy);
openPrivacy();
const copyButton = document.getElementById('copy');
copyButton?.addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try { await navigator.clipboard.writeText('iron10'); status.textContent = 'Code iron10 kopiert.'; copyButton.querySelector('span').textContent = 'Kopiert ✓'; }
  catch { status.textContent = 'Dein Code: iron10 – bitte markieren und kopieren.'; }
});
// Mobile: Kennenlernen-Button erst nach dem Hero einblenden
const mobileCta = document.querySelector('.mobile-cta');
if (mobileCta) { const toggleCta = () => mobileCta.classList.toggle('show', window.scrollY > 480); window.addEventListener('scroll', toggleCta, { passive: true }); toggleCta(); }
