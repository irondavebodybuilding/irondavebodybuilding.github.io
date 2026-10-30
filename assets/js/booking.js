const bookingButton = document.getElementById('load-booking');
bookingButton?.addEventListener('click', () => {
  const shell = document.getElementById('booking-shell');
  if (!shell || document.getElementById('booking-frame')) return;
  const frame = document.createElement('iframe');
  frame.id = 'booking-frame';
  frame.title = 'Kostenloses 15-Minuten-Erstgespräch bei IRON DAVE buchen';
  frame.src = 'https://calendly.com/iron-dave-bodybuilding/30min';
  frame.className = 'booking-frame';
  shell.replaceChildren(frame);
  frame.focus();
});
