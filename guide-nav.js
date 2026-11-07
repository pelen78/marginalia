/* Marginalia · índice de la guía y botón "Continuar donde me quedé".
   Funciona con la estructura común de las guías:
   .bar (progreso) · #map > .group > h2.g-title · .card[id^="card-"] (.is-done al explorarla) · section.block[id]
   No guarda nada propio: lee el progreso que la página ya guarda en las tarjetas.
   Para usarlo en otra guía basta con cargar <script src="guide-nav.js" defer></script>. */
(() => {
  'use strict';
  const map = document.getElementById('map');
  const bar = document.querySelector('.bar');
  if (!map || !bar || document.querySelector('.mg-toc')) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clean = s => s.replace(/\s+/g, ' ').trim();
  const after = el => map.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING;

  /* ---------- Partes de la guía ---------- */
  const parts = [];
  map.querySelectorAll(':scope > .group').forEach((group, i) => {
    const h = group.querySelector('.g-title');
    if (!h) return;
    const n = clean(h.querySelector('.g-n')?.textContent || String(i + 1));
    const full = clean([...h.childNodes].filter(x => !(x.classList && x.classList.contains('g-n'))).map(x => x.textContent).join(''));
    if (!group.id) group.id = 'parte-' + n;
    /* "Parte I · El cerebro emocional" → "El cerebro emocional"; "Principios fundamentales · Capítulos 1–3" → "Principios fundamentales". */
    const bits = full.split(' · ');
    const title = bits.length > 1 && /^(Parte|Cap[ií]tulos?)\b/i.test(bits[0]) ? bits.slice(1).join(' · ') : bits[0];
    parts.push({ el: group, heading: h, n, title, full, cards: [...group.querySelectorAll('.card[id^="card-"]')] });
  });
  document.querySelectorAll('section.block[id]').forEach(block => {
    const h = block.querySelector('h2');
    if (!h || !after(block)) return;
    parts.push({ el: block, heading: h, n: '', title: clean(h.textContent), full: clean(h.textContent), cards: [] });
  });
  if (parts.length < 3) return;

  const allCards = () => [...map.querySelectorAll('.card[id^="card-"]')];
  const nextCard = () => allCards().find(c => !c.classList.contains('is-done') && c.offsetParent !== null);
  const cardTitle = c => clean(c.querySelector('h3')?.textContent || '');

  /* ---------- Estilos ---------- */
  const css = document.createElement('style');
  css.id = 'mg-guide-nav-style';
  css.textContent = `
.mg-toc{max-width:980px;margin:-4px auto 40px;display:grid;gap:18px}
.mg-toc-resume{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px 18px}
.mg-resume{display:inline-flex;align-items:center;gap:10px;min-height:44px;border:0;cursor:pointer;background:var(--ink);color:var(--bg);border-radius:999px;padding:0 22px;font-family:var(--f-mono);font-size:.8125rem;letter-spacing:.08em;text-transform:uppercase;transition:transform .16s ease-out,background-color .16s ease-out}
.mg-resume:hover{transform:translateY(-1px);background:var(--terra-ink,var(--accent))}
.mg-resume:active{transform:scale(.98)}
.mg-resume:focus-visible,.mg-toc a:focus-visible,.mg-toc summary:focus-visible,.mg-toc-fab:focus-visible{outline:2px solid var(--terra-ink,var(--accent));outline-offset:3px}
.mg-resume svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.mg-resume-next{margin:0;font-style:italic;color:var(--muted);font-size:1rem;line-height:1.4;text-align:center}
.mg-resume-next b{font-weight:400;font-style:normal;color:var(--ink)}
.mg-toc-list{border-block:1px dashed var(--line)}
.mg-toc-list>summary{cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:center;gap:12px;padding:12px 0;border-radius:10px}
.mg-toc-list>summary::-webkit-details-marker{display:none}
.mg-toc-h{font-family:var(--f-hand);font-size:1.6rem;line-height:1;color:var(--terra-ink,var(--accent))}
.mg-toc-m{font-family:var(--f-mono);font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.mg-toc-list>summary svg{width:16px;height:16px;stroke:var(--muted);fill:none;stroke-width:1.8;stroke-linecap:round;transition:transform .2s ease-out}
.mg-toc-list[open]>summary svg{transform:rotate(180deg)}
.mg-toc ol{list-style:none;margin:0;padding:2px 0 14px;columns:2 320px;column-gap:44px}
.mg-toc li{break-inside:avoid}
.mg-toc li a{display:grid;grid-template-columns:2rem 1fr auto;align-items:center;min-height:40px;gap:10px;padding:9px 8px;border-radius:10px;color:var(--ink);text-decoration:none;font-size:1rem;line-height:1.3;transition:background-color .16s ease-out}
.mg-toc li a:hover{background:color-mix(in srgb,var(--accent) 9%,transparent)}
.mg-toc .n{font-family:var(--f-hand);font-size:1.3rem;line-height:1;color:var(--terra-ink,var(--accent));text-align:center}
.mg-toc .mg-x .n svg{display:block;margin:auto;width:14px;height:14px;stroke:var(--terra-ink,var(--accent));fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.mg-toc .c{font-family:var(--f-mono);font-size:.75rem;letter-spacing:.04em;color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.mg-toc .mg-done .c{color:var(--terra-ink,var(--accent))}
.mg-toc .c svg{width:14px;height:14px;vertical-align:-2px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.mg-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.mg-toc-fab{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));z-index:60;display:inline-flex;align-items:center;gap:10px;min-height:44px;padding:0 16px 0 14px;border:1px solid var(--line);border-radius:999px;background:var(--paper);color:var(--ink);box-shadow:0 12px 26px -16px rgba(40,25,10,.6);font-family:var(--f-mono);font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;opacity:0;visibility:hidden;transform:translateY(14px);pointer-events:none;transition:opacity .22s ease-out,transform .22s ease-out,visibility .22s}
.mg-toc-fab.is-on{opacity:1;visibility:visible;transform:none;pointer-events:auto}
.mg-toc-fab svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round}
.mg-toc-fab .p{color:var(--muted);font-variant-numeric:tabular-nums;letter-spacing:.02em}
.mg-toc-panel{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:calc(max(16px,env(safe-area-inset-bottom)) + 58px);z-index:61;width:min(380px,calc(100vw - 32px));max-height:min(72vh,600px);overflow:auto;overscroll-behavior:contain;margin:0;padding:18px 12px 8px;background:var(--paper);border:1px solid var(--line);border-radius:22px;box-shadow:0 28px 50px -26px rgba(40,25,10,.7)}
.mg-toc-panel .mg-toc-resume{justify-content:flex-start;padding:0 8px 14px;border-bottom:1px dashed var(--line);margin-bottom:6px}
.mg-toc-panel .mg-resume-next{text-align:left}
.mg-toc-panel ol{columns:1;padding-bottom:6px}
.map>.group,section.block[id]{scroll-margin-top:var(--mg-toc-offset,96px)}
@media (max-width:760px){.mg-toc{margin-bottom:28px}.mg-toc-resume{flex-direction:column}}
@media (prefers-reduced-motion:reduce){.mg-resume,.mg-toc-fab,.mg-toc-list>summary svg{transition:none}}
@media print{.mg-toc,.mg-toc-fab,.mg-toc-panel{display:none!important}}`;
  document.head.appendChild(css);

  /* ---------- Marcado ---------- */
  const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const pencil = '<svg viewBox="0 0 24 24"><path d="M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3"/></svg>';
  const check = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const listHTML = () => '<ol>' + parts.map((p, i) => `
    <li class="${p.n ? 'mg-part' : 'mg-x'}" data-i="${i}"><a href="#${p.el.id}" title="${p.full.replace(/"/g, '&quot;')}">
      <span class="n" aria-hidden="true">${p.n || pencil}</span><span class="t">${p.title}</span><span class="c"></span>
    </a></li>`).join('') + '</ol>';
  const resumeHTML = '<div class="mg-toc-resume"><button type="button" class="mg-resume"><span class="l">Empezar la guía</span>' + arrow + '</button><p class="mg-resume-next"></p></div>';

  const groupsCount = parts.filter(p => p.n).length;
  const extras = parts.length - groupsCount;
  const meta = `${groupsCount} partes${extras ? ` · ${extras} ${extras === 1 ? 'actividad' : 'actividades'}` : ''}`;

  const nav = document.createElement('nav');
  nav.className = 'mg-toc';
  nav.setAttribute('aria-label', 'Índice de la guía');
  nav.innerHTML = resumeHTML + `<details class="mg-toc-list"${matchMedia('(min-width: 761px)').matches ? ' open' : ''}>
    <summary><span class="mg-toc-h">índice</span><span class="mg-toc-m">${meta}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary>${listHTML()}</details>`;
  bar.after(nav);

  const fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'mg-toc-fab';
  fab.setAttribute('aria-expanded', 'false');
  fab.setAttribute('aria-controls', 'mg-toc-panel');
  fab.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg><span>Índice</span><span class="p"></span>';
  const panel = document.createElement('nav');
  panel.className = 'mg-toc mg-toc-panel';
  panel.id = 'mg-toc-panel';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Índice de la guía');
  panel.innerHTML = resumeHTML + listHTML();
  document.body.append(panel, fab);

  /* ---------- Estado ---------- */
  function refresh() {
    const cards = allCards();
    const done = cards.filter(c => c.classList.contains('is-done')).length;
    const next = nextCard();
    document.querySelectorAll('.mg-toc li[data-i]').forEach(li => {
      const p = parts[+li.dataset.i];
      const c = li.querySelector('.c');
      if (!p.cards.length) { c.textContent = ''; return; }
      const d = p.cards.filter(x => x.classList.contains('is-done')).length;
      const all = d === p.cards.length;
      li.classList.toggle('mg-done', all);
      c.innerHTML = (all ? check : `<span aria-hidden="true">${d}/${p.cards.length}</span>`) +
        `<span class="mg-sr">${all ? 'parte completa' : `${d} de ${p.cards.length} tarjetas exploradas`}</span>`;
    });
    document.querySelectorAll('.mg-toc-resume').forEach(r => {
      r.hidden = !next;
      if (!next) return;
      r.querySelector('.l').textContent = done ? 'Continuar donde me quedé' : 'Empezar la guía';
      r.querySelector('.mg-resume-next').innerHTML = `${done ? 'Sigue' : 'Primera tarjeta'}: <b></b>`;
      r.querySelector('.mg-resume-next b').textContent = cardTitle(next);
    });
    fab.querySelector('.p').textContent = `${done}/${cards.length}`;
  }
  let raf = 0;
  const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(refresh); };
  new MutationObserver(schedule).observe(map, { subtree: true, attributes: true, attributeFilter: ['class'] });
  refresh();

  /* ---------- Acciones ---------- */
  const setOffset = () => {
    const top = document.querySelector('.mg-nav');
    document.documentElement.style.setProperty('--mg-toc-offset', ((top ? top.offsetHeight : 64) + 18) + 'px');
  };
  setOffset();
  addEventListener('resize', setOffset, { passive: true });

  function closePanel(focusFab) {
    if (panel.hidden) return;
    panel.hidden = true;
    fab.setAttribute('aria-expanded', 'false');
    if (focusFab) fab.focus();
  }
  function goTo(part) {
    closePanel(false);
    part.el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (!part.heading.hasAttribute('tabindex')) part.heading.setAttribute('tabindex', '-1');
    part.heading.focus({ preventScroll: true });
    history.replaceState(history.state, '', '#' + part.el.id);
  }
  function resume() {
    const card = nextCard();
    if (!card) return;
    closePanel(false);
    card.scrollIntoView({ behavior: 'auto', block: 'center' });
    card.click();
  }

  document.addEventListener('click', e => {
    const link = e.target.closest('.mg-toc li a');
    if (link) { e.preventDefault(); goTo(parts[+link.parentElement.dataset.i]); return; }
    if (e.target.closest('.mg-resume')) { resume(); return; }
    if (e.target.closest('.mg-toc-fab')) {
      const open = panel.hidden;
      panel.hidden = !open;
      fab.setAttribute('aria-expanded', String(open));
      if (open) (panel.querySelector('.mg-toc-resume:not([hidden]) .mg-resume') || panel.querySelector('a'))?.focus();
      return;
    }
    if (!panel.hidden && !e.target.closest('#mg-toc-panel')) closePanel(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) closePanel(true); });

  /* El botón flotante aparece cuando el índice de arriba ya no se ve, y se esconde al llegar al final. */
  let navAbove = false, endVisible = false;
  const show = () => {
    const on = navAbove && !endVisible;
    fab.classList.toggle('is-on', on);
    if (!on) closePanel(false);
  };
  new IntersectionObserver(([en]) => { navAbove = !en.isIntersecting && en.boundingClientRect.top < 0; show(); }).observe(nav);
  const end = document.querySelector('.mg-pager') || document.querySelector('footer');
  if (end) new IntersectionObserver(([en]) => { endVisible = en.isIntersecting; show(); }).observe(end);
})();
