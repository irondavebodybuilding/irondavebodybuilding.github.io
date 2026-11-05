/* Malocher Tasse – Vorschau.
   Öffentliche PayPal-Live-Client-ID. Sie darf nicht benutzt werden, um
   Bestellungen im Browser anzulegen oder zu capturen. PayPal verlangt dafür
   einen Server (Orders v2) oder eine hostedButtonId aus dem PayPal-Dashboard.
   Dieses Skript ruft paypal.com nicht auf. */
(function () {
  var PAYPAL_CLIENT_ID = 'BAAG5dmVN6MbhUyAXvdMZhw3sdEJ5oiZcynFPOUBZ89m3bQmrB_0WHT63tzsr71GzK_-LnUlZbI0rgseDo';
  var UNIT_CENTS = 1495;
  var SHIP_FEW_CENTS = 419;
  var SHIP_MANY_CENTS = 590;
  var EMAIL = 'iron.dave.bodybuilding@gmail.com';

  var qtyInput = document.getElementById('mug-qty');
  var goods = document.getElementById('mug-goods');
  var ship = document.getElementById('mug-ship');
  var total = document.getElementById('mug-total');
  var email = document.getElementById('mug-email');
  var slot = document.getElementById('paypal-slot');
  if (!qtyInput || !goods || !ship || !total || !email) return;

  if (slot) slot.setAttribute('data-paypal-client-id', PAYPAL_CLIENT_ID);

  function euro(cents) {
    var whole = Math.floor(cents / 100);
    var rest = String(cents % 100).padStart(2, '0');
    return whole + ',' + rest + ' €';
  }

  function quote(qty) {
    var shipping = qty <= 2 ? SHIP_FEW_CENTS : SHIP_MANY_CENTS;
    return { qty: qty, goods: qty * UNIT_CENTS, shipping: shipping, total: qty * UNIT_CENTS + shipping };
  }

  function readQty() {
    var qty = parseInt(qtyInput.value, 10);
    if (!Number.isFinite(qty) || qty < 1) qty = 1;
    if (qty > 99) qty = 99;
    return qty;
  }

  function mailto(q) {
    var body = [
      'Hallo Dave,',
      '',
      'ich möchte die Malocher Tasse per Überweisung bestellen.',
      '',
      'Anzahl: ' + q.qty,
      'Warenwert: ' + euro(q.goods),
      'Versand: ' + euro(q.shipping),
      'Gesamt: ' + euro(q.total),
      '',
      'Mein Name:',
      'Lieferadresse:',
      '',
      'Viele Grüße'
    ].join('\n');
    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Malocher Tasse – Bestellung per Überweisung') + '&body=' + encodeURIComponent(body);
  }

  function render() {
    var q = quote(readQty());
    goods.textContent = euro(q.goods);
    ship.textContent = euro(q.shipping);
    total.textContent = euro(q.total);
    email.href = mailto(q);
  }

  qtyInput.addEventListener('input', render);
  qtyInput.addEventListener('change', function () {
    qtyInput.value = String(readQty());
    render();
  });
  render();
})();
