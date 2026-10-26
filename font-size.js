/* Text-size control shared by every page of the site.
   Adds a small panel (smaller / reset / larger) and remembers the chosen size
   across pages and visits. The pages set their sizes in px, so the whole page
   is scaled with CSS zoom. Include in <head>:
   <script src="font-size.js"></script>
   A page may hold an element with id="fs-slot"; the panel is then placed inside it
   (used by the question viewers, whose bottom bar has the navigation buttons).
   Otherwise the panel floats in the bottom-left corner. */
(function () {
  var KEY = 'learn_sql-text-size';
  var STEPS = [0.85, 1, 1.15, 1.3, 1.5, 1.75, 2];
  var root = document.documentElement;

  function load() {
    try { var v = parseFloat(localStorage.getItem(KEY)); if (STEPS.indexOf(v) > -1) return v; } catch (e) {}
    return 1;
  }
  function save(v) { try { localStorage.setItem(KEY, String(v)); } catch (e) {} }

  var size = load();

  var css = document.createElement('style');
  css.textContent =
    'body{zoom:var(--text-zoom,1)}' +
    '.fs-ctl{display:flex;align-items:center;gap:2px;direction:rtl;' +
      'background:var(--paper,var(--page,var(--sheet,#fff)));border:1px solid var(--line,#d6dbe3);border-radius:99px;padding:3px;' +
      'font-family:var(--f-body,var(--font-body,Arial,sans-serif))}' +
    '.fs-float{position:fixed;left:16px;bottom:16px;z-index:50;box-shadow:0 2px 8px rgba(0,0,0,.18)}' +
    '.fs-ctl button{all:unset;cursor:pointer;min-width:32px;height:32px;border-radius:99px;display:grid;place-items:center;' +
      'color:var(--accent,#2457c5);font-weight:700;line-height:1;padding:0 6px;box-sizing:border-box}' +
    '.fs-ctl button:hover{background:var(--accent-soft,var(--head,#e4e9f1))}' +
    '.fs-ctl button:focus-visible{outline:2px solid var(--accent,#2457c5);outline-offset:1px}' +
    '.fs-ctl button[disabled]{opacity:.35;cursor:default;background:none}' +
    '.fs-ctl .fs-sm{font-size:14px}.fs-ctl .fs-lg{font-size:19px}' +
    '.fs-ctl .fs-val{font-size:13px;color:var(--muted,#556074);min-width:46px;font-variant-numeric:tabular-nums}' +
    '@media print{.fs-ctl{display:none}body{zoom:1}}';
  (document.head || root).appendChild(css);

  var ctl, bDown, bUp, bVal;
  function render() {
    root.style.setProperty('--text-zoom', size);
    if (!ctl) return;
    var i = STEPS.indexOf(size);
    bDown.disabled = i <= 0;
    bUp.disabled = i >= STEPS.length - 1;
    bVal.textContent = Math.round(size * 100) + '%';
  }
  function step(d) {
    var i = STEPS.indexOf(size) + d;
    if (i < 0 || i >= STEPS.length) return;
    size = STEPS[i]; save(size); render();
  }
  function btn(cls, text, label, fn) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.textContent = text;
    b.setAttribute('aria-label', label); b.title = label;
    b.addEventListener('click', fn);
    return b;
  }
  function build() {
    var slot = document.getElementById('fs-slot');
    ctl = document.createElement('div');
    ctl.className = 'fs-ctl' + (slot ? '' : ' fs-float');
    ctl.setAttribute('role', 'group');
    ctl.setAttribute('aria-label', 'גודל טקסט');
    bUp = btn('fs-lg', 'א+', 'הגדלת טקסט', function () { step(1); });
    bVal = btn('fs-val', '100%', 'איפוס גודל טקסט', function () { size = 1; save(size); render(); });
    bDown = btn('fs-sm', 'א−', 'הקטנת טקסט', function () { step(-1); });
    ctl.appendChild(bUp); ctl.appendChild(bVal); ctl.appendChild(bDown);
    (slot || document.body).appendChild(ctl);
    render();
  }
  render();
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);

  /* keep other open tabs of the site in sync */
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) { size = load(); render(); }
  });
})();
