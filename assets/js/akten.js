/* Neue Akte hinzufügen:
   1. PDF ablegen als akten/Akte_Fall_<NN>_<Substanz>.pdf
   2. Vorschau (~600 px breit) als assets/img/akten/Akte_Fall_<NN>_<Substanz>.webp und .jpg
   3. Eintrag in assets/data/akten.json: {nr, substanz, pdf, preview, seiten}
      preview ist der Pfad ohne Dateiendung. Höhere nr wird zuerst gezeigt.
*/
(function () {
  var grid = document.getElementById('akten-grid');
  if (!grid) return;

  function pagesLabel(count) {
    return 'PDF · ' + count + (count === 1 ? ' Seite' : ' Seiten');
  }

  function caseNumber(item) {
    var value = parseInt(String(item.nr), 10);
    return Number.isFinite(value) ? value : 0;
  }

  function fileName(path) {
    var parts = String(path).split('/');
    return parts[parts.length - 1] || 'akte.pdf';
  }

  function render(cases) {
    var list = cases.slice().sort(function (a, b) { return caseNumber(b) - caseNumber(a); });
    var fragment = document.createDocumentFragment();
    list.forEach(function (item) {
      var tile = document.createElement('article');
      tile.className = 'akten-tile';

      var open = document.createElement('a');
      open.className = 'akten-open';
      open.href = item.pdf;
      open.target = '_blank';
      open.rel = 'noopener';

      var picture = document.createElement('picture');
      var source = document.createElement('source');
      source.type = 'image/webp';
      source.srcset = item.preview + '.webp';
      var image = document.createElement('img');
      image.src = item.preview + '.jpg';
      image.alt = 'Vorschau Fall ' + item.nr + ', ' + item.substanz;
      image.width = 600;
      image.loading = 'lazy';
      image.decoding = 'async';
      picture.appendChild(source);
      picture.appendChild(image);

      var body = document.createElement('div');
      body.className = 'akten-body';
      var nr = document.createElement('p');
      nr.className = 'akten-nr';
      nr.textContent = 'Fall ' + item.nr;
      var title = document.createElement('h2');
      title.textContent = item.substanz;
      var meta = document.createElement('p');
      meta.className = 'akten-meta';
      meta.textContent = pagesLabel(item.seiten);
      body.appendChild(nr);
      body.appendChild(title);
      body.appendChild(meta);

      open.appendChild(picture);
      open.appendChild(body);

      var download = document.createElement('a');
      download.className = 'akten-download';
      download.href = item.pdf;
      download.setAttribute('download', fileName(item.pdf));
      download.textContent = 'Herunterladen';

      tile.appendChild(open);
      tile.appendChild(download);
      fragment.appendChild(tile);
    });
    grid.replaceChildren(fragment);
  }

  fetch('assets/data/akten.json')
    .then(function (response) {
      if (!response.ok) throw new Error('akten.json');
      return response.json();
    })
    .then(render)
    .catch(function () {
      var note = document.createElement('p');
      note.className = 'akten-meta';
      note.textContent = 'Die Akten konnten nicht geladen werden.';
      grid.replaceChildren(note);
    });
})();
