/* Marginalia · diseño de computadora para las guías.
   Se activa solo si <html> tiene la clase "desk" (la pone el script del <head> cuando la pantalla mide más de 760 px).
   No cambia el contenido ni lo que se guarda: reacomoda lo que la guía ya tiene (tarjetas, progreso, final, notas)
   dentro del diseño "cuaderno de lectura". En el celular no hace nada.
   Para usarlo en otra guía: agrega su ficha en GUIDES y las tres líneas del <head> (ver AGENTS.md). */
(() => {
  'use strict';
  const root = document.documentElement;
  if (!root.classList.contains('desk')) return;

  const GUIDES = {
    'la-paciente-silenciosa': {
      ficha: 17, cat: 'Novelas',
      img: 'assets/novedades/la-paciente-silenciosa.jpg', cap: 'fig. 1: el estudio de Alicia', why: '¿por qué calla?',
      lede: 'Alicia Berenson, una pintora de éxito, aparece junto al cuerpo de su marido, Gabriel. Desde ese día no vuelve a decir una sola palabra. Seis años después, el psicoterapeuta Theo Faber está convencido de que puede hacerla hablar y descubrir qué pasó aquella noche.',
      marks: ['Theo Faber'],
      datos: [['Género', 'Thriller psicológico'], ['Publicación', '2019'], ['Escenario', 'Londres'], ['Voces', 'Theo · Alicia'], ['Estructura', 'Prólogo + 5 partes']],
      people: 2, // id de la rejilla de personajes: #g-2
      prev: { author: 'Dan Brown', color: '#57352f' },
      next: { author: 'Diversos autores', color: '#344f4b' }
    },
    'el-jardin-de-las-mariposas': {
      ficha: 14, cat: 'Novelas',
      img: 'assets/novedades/el-jardin-de-las-mariposas.jpg', cap: 'fig. 1: la entrada al Jardín', why: '¿quién es Maya?',
      lede: 'Tras descubrir el Jardín, el FBI interroga a una joven que se hace llamar Maya, una de las chicas a las que allí llamaban mariposas. Mientras ella decide qué contar, los agentes Victor Hanoverian y Brandon Eddison intentan descubrir lo que todavía calla.',
      marks: ['Maya', 'Victor Hanoverian', 'Brandon Eddison'],
      datos: [['Género', 'Thriller psicológico'], ['Publicación', '2016'], ['Serie', 'El coleccionista, 1'], ['Voces', 'Maya · el FBI'], ['Estructura', 'Interrogatorio + recuerdos']],
      people: 5,
      quote: false, // sin la tarjeta de "Pregunta de Marginalia" en computadora
      prev: { author: 'Mel Robbins', color: '#514454' },
      next: { author: 'Matt Haig', color: '#1f2a44' }
    },
    'la-biblioteca-de-la-medianoche': {
      ficha: 15, cat: 'Novelas',
      img: 'assets/novedades/la-biblioteca-de-la-medianoche.jpg', cap: 'fig. 1: la Biblioteca a medianoche', why: '¿y si…?',
      lede: 'Nora Seed tiene treinta y cinco años, vive en Bedford y siente que su vida está llena de errores. Una noche, entre la vida y la muerte, llega a una biblioteca infinita donde cada libro es otra vida que pudo vivir si hubiera elegido distinto. Con ayuda de la señora Elm puede probarlas y buscar la vida en la que quiere quedarse.',
      marks: ['Nora Seed', 'señora Elm'],
      datos: [['Género', 'Fantasía contemporánea'], ['Publicación', '2020'], ['Escenario', 'Bedford, Inglaterra'], ['Protagonista', 'Nora Seed'], ['Estructura', 'Vida raíz + vidas posibles']],
      people: '2a',
      prev: { author: 'Dot Hutchison', color: '#1d463d' },
      next: { author: 'Dan Brown', color: '#57352f' }
    },
    'el-ultimo-secreto': {
      ficha: 16, cat: 'Novelas',
      img: 'assets/novedades/el-ultimo-secreto.jpg', cap: 'fig. 1: el puente de Carlos, Praga', why: '¿dónde vive la mente?',
      lede: 'Robert Langdon acompaña a Katherine Solomon a Praga, donde ella presenta sus investigaciones sobre la conciencia humana. Un sueño inquietante, una amenaza contra el hotel y la desaparición de un manuscrito los arrastran a una investigación mucho más peligrosa de lo que imaginaban.',
      marks: ['Robert Langdon', 'Katherine Solomon'],
      datos: [['Género', 'Thriller de misterio'], ['Publicación', '2025'], ['Escenario', 'Praga'], ['Serie', 'Robert Langdon, 6'], ['Estructura', 'Prólogo + 139 capítulos']],
      people: 7,
      prev: { author: 'Matt Haig', color: '#1f2a44' },
      next: { author: 'Alex Michaelides', color: '#d8cbb4' }
    },
    'piensalo-otra-vez': {
      ficha: 12, cat: 'Psicología',
      img: 'assets/novedades/piensalo-otra-vez.jpg', cap: 'fig. 1: de la duda a la idea', why: '¿y si me equivoco?',
      lede: 'El psicólogo Adam Grant sostiene que, en un mundo que cambia tan rápido, saber repensar y desaprender importa tanto como saber pensar. Propone pensar como un científico: tratar nuestras opiniones como hipótesis, buscar lo que podría desmentirlas y rodearnos de personas que nos cuestionen.',
      marks: ['pensar como un científico'],
      datos: [['Género', 'Psicología'], ['Publicación', '2021'], ['Autor', 'Adam Grant'], ['Idea clave', 'Pensar como científico'], ['Estructura', '11 capítulos']],
      prev: { author: 'Mark Manson', color: '#b85632' },
      next: { author: 'Mel Robbins', color: '#514454' }
    },
    'la-teoria-let-them': {
      ficha: 13, cat: 'Relaciones',
      img: 'assets/novedades/la-teoria-let-them.jpg', cap: 'fig. 1: soltar y elegir', why: '¿y si los dejo?',
      lede: 'Mel Robbins propone dos frases para recuperar la energía que gastamos en lo que no controlamos. Con “déjalos” aceptas que los demás piensen, sientan y hagan lo que quieran; con “déjame” decides cómo respondes y qué haces con tu propia vida, tus límites y tus relaciones.',
      marks: ['“déjalos”', '“déjame”'],
      datos: [['Género', 'Desarrollo personal'], ['Publicación', '2024'], ['Autora', 'Mel Robbins'], ['Idea clave', 'Déjalos + Déjame'], ['Estructura', '20 capítulos']],
      prev: { author: 'Adam Grant', color: '#2e4a5c' },
      next: { author: 'Dot Hutchison', color: '#1d463d' }
    },
    'el-sutil-arte-de-que-te-importe-un-carajo': {
      ficha: 11, cat: 'Bienestar',
      img: 'assets/novedades/el-sutil-arte-de-que-te-importe-un-carajo.jpg', cap: 'fig. 1: elegir el camino', why: '¿qué sí importa?',
      lede: 'Mark Manson sostiene que no se trata de que nada te importe, sino de elegir con cuidado qué sí merece tu energía. Con humor directo invita a aceptar que los problemas y el dolor son parte de la vida, a asumir la responsabilidad de lo que te pasa y a vivir según valores que de verdad valgan la pena.',
      marks: ['qué sí merece tu energía'],
      datos: [['Género', 'Desarrollo personal'], ['Publicación', '2016'], ['Autor', 'Mark Manson'], ['Idea clave', 'Elegir qué te importa'], ['Estructura', '9 capítulos']],
      prev: { author: 'Walter Riso', color: '#e8d4cc' },
      next: { author: 'Adam Grant', color: '#2e4a5c' }
    }
  };

  const slug = decodeURIComponent(location.pathname.split('/').pop() || '').replace(/\.html$/, '');
  const G = GUIDES[slug];
  const giveUp = () => { root.classList.remove('desk'); root.classList.add('desk-ready'); };
  if (!G) { giveUp(); return; }

  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
  const svg = {
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
    pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h8"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1zm2 0h6V7a3 3 0 0 0-6 0z"/></svg>',
    hand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11V5a1.5 1.5 0 0 1 3 0v5"/><path d="M12 10V4a1.5 1.5 0 0 1 3 0v6"/><path d="M15 10V6a1.5 1.5 0 0 1 3 0v8a7 7 0 0 1-7 7h-.5a6 6 0 0 1-4.6-2.2L3.3 15a1.6 1.6 0 0 1 2.4-2l2.3 2V8a1.5 1.5 0 0 1 3 0"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 3h6l-1 6 3 3v2h-4v7l-1 1-1-1v-7H7v-2l3-3z"/></svg>',
    pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 12v6M9 15l3 3 3-3"/></svg>'
  };

  try {
    const map = $('map'), oldHero = document.querySelector('.hero'), oldWrap = document.querySelector('body > .wrap');
    if (!map || !oldHero || !oldWrap) { giveUp(); return; }
    const cards = () => [...map.querySelectorAll('.card[id^="card-"]')];
    // Nombre de una sección sin su número ni el contador: "Personajes · quién es quién"
    const gName = g => clean([...(g.querySelector('.g-title')?.childNodes || [])]
      .filter(x => !(x.classList && (x.classList.contains('g-n') || x.classList.contains('dk-known'))))
      .map(x => x.textContent).join(''));
    const groups = [...map.querySelectorAll(':scope > .group')];
    // Personajes: la sección que contiene la rejilla #g-<people> (puede tener varias rejillas por grupo)
    const peopleGroup = document.getElementById('g-' + G.people)?.closest('.group');
    if (peopleGroup) peopleGroup.querySelectorAll('.g-grid').forEach(x => x.classList.add('dk-people'));

    /* ---------- Datos que ya tiene la página ---------- */
    const title = clean(oldHero.querySelector('h1')?.textContent);
    const subText = clean(oldHero.querySelector('.sub')?.textContent);
    const author = (subText.split('Obra de ')[1] || '').trim();
    const warn = document.querySelector('.guide-note .notice-label')?.parentElement;
    const buy = oldHero.querySelector('#book-purchase a');
    const pv = document.querySelector('.mg-pager .pv'), nx = document.querySelector('.mg-pager .nx');
    const oldLogo = document.querySelector('.mg-brand');

    /* ---------- Encabezado ---------- */
    const top = document.createElement('header');
    top.className = 'dk-top';
    top.innerHTML = `<div class="dk-top-in">
      <a class="dk-brand" href="/" aria-label="MyMarginalia, inicio"><span class="dk-logo" aria-hidden="true">${oldLogo ? oldLogo.innerHTML : 'MARGINALIA'}</span></a>
      <nav class="dk-nav" aria-label="Principal"><a href="/#libros">Guías</a><a href="/#novedades">Novedades</a><a href="/#categorias">Categorías</a><a href="/#pedidos">Pide un libro</a></nav>
      <div class="dk-tools">
        <span class="dk-count" id="dk-count"></span>
        <button class="dk-icon" id="dk-theme" type="button" aria-label="Cambiar tema">${svg.moon}</button>
        <a class="dk-notes" href="#diario">${svg.pen}<span>Mis notas</span></a>
      </div></div>`;

    /* ---------- Portada ---------- */
    const main = document.createElement('main');
    main.className = 'dk-page';
    main.id = 'inicio-guia';
    main.innerHTML = `
    <section class="dk-hero" aria-labelledby="dk-title">
      <nav class="dk-crumbs" aria-label="Ruta"><a href="/#libros">Estantería</a><span aria-hidden="true">›</span><a href="/#categorias">${esc(G.cat)}</a><span aria-hidden="true">›</span><span aria-current="page">${esc(title)}</span></nav>
      <div class="dk-hero-copy">
        <div class="dk-stamps"><span class="dk-stamp">Guía independiente</span><span class="dk-ficha">Ficha N° ${G.ficha} · ${esc(G.cat)}</span></div>
        <h1 class="book-title" id="dk-title">${esc(title)}</h1>
        <p class="dk-sub">Guía y resumen · Obra de <i>${esc(author)}</i></p>
        ${warn ? `<p class="dk-warn">${warn.innerHTML}</p>` : ''}
        <div class="dk-prog">
          <div class="dk-prog-head"><p class="dk-prog-n" aria-live="polite"><b id="dk-n">0</b> de <span id="dk-total">0</span> <i>secciones exploradas</i></p><p class="dk-hand" id="dk-hint" aria-hidden="true"></p></div>
          <div class="dk-ruler" id="dk-ruler" role="progressbar" aria-label="Progreso de la guía" aria-valuemin="0"><span class="dk-ruler-fill" id="dk-fill"></span><span class="dk-bookmark" id="dk-mark"></span></div>
          <div class="dk-prog-actions">
            <button class="dk-start" id="dk-start" type="button">Empezar la guía <i>${svg.down}</i></button>
            <button class="dk-cont" id="dk-cont" type="button">Continuar donde lo dejé</button>
            <button class="dk-reset" id="dk-reset" type="button">${svg.reset}Reiniciar</button>
          </div>
        </div>
        <div id="dk-buy-slot"></div>
      </div>
      <figure class="dk-figure">
        <div class="dk-polaroid"><span class="tape" aria-hidden="true"></span><img src="${esc(G.img)}" alt="" width="900" height="1200" decoding="async"><figcaption>${esc(G.cap)}</figcaption></div>
        <span class="dk-why" aria-hidden="true">${esc(G.why)}</span>
      </figure>
    </section>
    <div class="dk-body">
      <aside class="dk-index" aria-label="Índice de la guía"><p class="dk-kick">Índice</p><ol class="dk-toc" id="dk-toc"></ol><p class="dk-hand" aria-hidden="true">Abre cada ficha para marcarla como explorada ✓</p></aside>
      <div class="dk-content" id="dk-content"></div>
    </div>`;

    if (buy) {
      const a = document.createElement('a');
      a.className = 'dk-buy';
      a.href = buy.href; a.target = '_blank'; a.rel = buy.rel || 'sponsored noopener';
      a.setAttribute('aria-label', buy.getAttribute('aria-label') || 'Comprar el libro (abre en una pestaña nueva)');
      a.textContent = 'Comprar el libro ↗';
      main.querySelector('#dk-buy-slot').replaceWith(a);
    } else main.querySelector('#dk-buy-slot').remove();

    const content = main.querySelector('#dk-content');

    /* ---------- Secciones ---------- */
    groups.forEach((g, i) => {
      const h = g.querySelector('.g-title');
      const n = clean(h?.querySelector('.g-n')?.textContent) || String(i + 1);
      if (!g.id) g.id = 'parte-' + n;
      const tag = document.createElement('span');
      tag.className = 'dk-sec-tag'; tag.setAttribute('aria-hidden', 'true');
      tag.textContent = '§' + n.padStart(2, '0');
      g.prepend(tag);
      // "Personajes · quién es quién" → la segunda parte en cursiva
      if (h) {
        const txt = [...h.childNodes].filter(x => x.nodeType === 3);
        const last = txt[txt.length - 1];
        if (last && last.textContent.includes(' · ')) {
          const [a, ...b] = last.textContent.split(' · ');
          const em = document.createElement('span');
          em.className = 'dk-g-sub'; em.textContent = b.join(' · ');
          const hid = document.createElement('span');
          hid.className = 'dk-sep';
          hid.textContent = ' · ';
          last.replaceWith(document.createTextNode(a), hid, em);
        }
        if (g === peopleGroup) {
          const k = document.createElement('span');
          k.className = 'dk-known'; k.id = 'dk-known';
          h.append(k);
        }
      }
    });

    // Sección 1: resumen en un vistazo + datos del libro
    if (groups[0] && G.lede) {
      let lede = esc(G.lede);
      // Resalta cada nombre una vez; nunca al inicio, porque ahí va la letra capital
      (G.marks || []).forEach(m => { const k = esc(m), at = lede.indexOf(k, 1); if (at > 0) lede = lede.slice(0, at) + `<mark>${k}</mark>` + lede.slice(at + k.length); });
      const glance = document.createElement('div');
      glance.className = 'dk-glance';
      glance.innerHTML = `<p class="dk-lede">${lede}</p>
        <aside class="dk-datos" aria-label="Datos del libro"><p class="dk-kick">Datos del libro</p><dl>${G.datos.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></aside>`;
      groups[0].querySelector('.g-title').after(glance);
    }

    // Tarjetas: "Parte I · el crimen…" → etiqueta + título; personajes → nombre + papel
    cards().forEach(c => {
      const h3 = c.querySelector('h3');
      if (!h3) return;
      const t = h3.textContent;
      if (!t.includes(' · ')) return;
      const [a, ...b] = t.split(' · ');
      const rest = b.join(' · ');
      const isPerson = peopleGroup && peopleGroup.contains(c);
      if (isPerson) {
        h3.innerHTML = `${esc(a)}<span class="dk-role"><span class="dk-sep"> · </span>${esc(rest)}</span>`;
      } else if (/^(Parte|Prólogo|Cap[ií]tulo)/i.test(a)) {
        h3.innerHTML = `<span class="dk-part">${esc(a)}<span class="dk-sep"> · </span></span><span class="dk-cap">${esc(rest)}</span>`;
      }
    });

    // Pregunta de Marginalia: la tarjeta oscura con respuesta
    const quote = map.querySelector('.quote');
    if (quote && G.quote === false) quote.hidden = true;
    else if (quote) {
      const by = quote.querySelector('.by');
      if (by) quote.prepend(by);
      const ta = document.createElement('textarea');
      ta.className = 'dk-answer'; ta.id = 'dk-answer'; ta.rows = 3; ta.maxLength = 2000;
      ta.placeholder = 'Escribe tu respuesta…';
      ta.setAttribute('aria-label', 'Tu respuesta a la pregunta');
      const actions = document.createElement('div');
      actions.className = 'dk-q-actions';
      actions.innerHTML = `<button class="dk-save" id="dk-save" type="button">${svg.pin}Guardar en mis notas</button><p class="dk-q-status" id="dk-q-status" role="status" aria-live="polite"></p>`;
      const next = quote.querySelector('#next-quote');
      if (next) actions.insertBefore(next, actions.querySelector('.dk-q-status'));
      quote.querySelector('.hand')?.after(ta);
      ta.after(actions);
    }

    content.append(map);
    // Los bloques que vienen después de las tarjetas (actividades, quiz, final explicado, notas), en su orden
    const blocks = [...oldWrap.querySelectorAll(':scope > section.block[id]')];
    blocks.forEach(b => content.append(b));

    /* ---------- El final explicado ---------- */
    const q = sel => content.querySelector(sel);
    const spoil = q('#spoilers'), sp = q('#spoiler-body'), spb = q('#spoiler-btn');
    if (spoil && sp && spb) {
      const head = spoil.querySelector('.spoiler-head > div') || spoil.querySelector('.spoiler-head');
      head.insertAdjacentHTML('afterbegin', `<p class="dk-spoil-kick">${svg.lock}Contiene spoilers</p>`);
      const hold = document.createElement('button');
      hold.type = 'button'; hold.className = 'dk-hold'; hold.id = 'dk-hold';
      hold.setAttribute('aria-controls', 'spoiler-body');
      head.append(hold);
      const help = document.createElement('span');
      help.className = 'dk-hold-help'; help.id = 'dk-hold-help';
      head.append(help);
      const blur = document.createElement('div');
      blur.className = 'dk-blur'; blur.setAttribute('aria-hidden', 'true');
      blur.innerHTML = [5, 6, 5].map(k => `<div><i></i><i></i>${'<i></i>'.repeat(k - 2).replace(/<i><\/i>/g, (m, o) => `<i style="width:${92 - (o * 7) % 30}%"></i>`)}</div>`).join('');
      sp.before(blur);
      const HOLD = 900;
      let timer = null, skipClick = false;
      const isOpen = () => !sp.hidden;
      const paint = () => {
        const o = isOpen();
        hold.innerHTML = o ? `<span>Ocultar el final</span>` : `${svg.hand}<span>Mantén pulsado para abrir</span>`;
        hold.setAttribute('aria-expanded', String(o));
        help.textContent = o ? '' : 'o presiona Enter si usas el teclado';
        blur.hidden = o;
      };
      const stop = () => { clearTimeout(timer); timer = null; hold.classList.remove('holding'); };
      hold.style.setProperty('--hold', HOLD + 'ms');
      hold.addEventListener('pointerdown', e => {
        skipClick = false;
        if (isOpen() || e.button > 0) return;
        hold.classList.add('holding');
        timer = setTimeout(() => { stop(); skipClick = true; spb.click(); paint(); }, HOLD);
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => hold.addEventListener(ev, () => { if (timer) stop(); }));
      hold.addEventListener('contextmenu', e => e.preventDefault());
      hold.addEventListener('click', e => {
        if (skipClick) { skipClick = false; return; }
        if (isOpen()) { spb.click(); paint(); return; }
        if (e.detail === 0) { spb.click(); paint(); } // teclado: Enter o espacio
      });
      paint();
    }

    /* ---------- Mis notas de lectura ---------- */
    const diario = q('#diario'), field = q('#novel-notes');
    if (diario && !field && $('mg-save-pdf')) {
      // Guías de no ficción: sus preguntas de diario se quedan como están; solo se suma el botón de PDF
      const pdf = document.createElement('button');
      pdf.type = 'button'; pdf.className = 'dk-pill dk-pdf-solo';
      pdf.title = 'Se abrirá la ventana de impresión. Elige Guardar como PDF.';
      pdf.innerHTML = `${svg.pdf}Guardar mis notas en PDF`;
      pdf.addEventListener('click', () => $('mg-save-pdf').click());
      (diario.querySelector('#saved-hint') || diario.querySelector('.journal') || diario.lastElementChild).after(pdf);
    }
    if (diario && field) {
      const journal = diario.querySelector('.journal');
      const opts = ['General', ...groups.map(gName), 'El final explicado'];
      const grid = document.createElement('div');
      grid.className = 'dk-notes-grid';
      grid.innerHTML = `
        <form class="dk-new" id="dk-new" novalidate>
          <p class="dk-kick">Nueva anotación</p>
          <div class="dk-new-row">
            <label for="dk-cap">Capítulo<select id="dk-cap">${opts.map(o => `<option>${esc(o)}</option>`).join('')}</select></label>
            <label for="dk-page">Página<input id="dk-page" type="text" inputmode="numeric" maxlength="6" placeholder="—" autocomplete="off"></label>
          </div>
          <label for="dk-note">Nota<textarea id="dk-note" rows="4" maxlength="2000" placeholder="Lo que no quieres olvidar…"></textarea></label>
          <button class="dk-add" type="submit">Añadir al cuaderno</button>
          <p class="dk-new-status" id="dk-new-status" role="status" aria-live="polite"></p>
        </form>
        <div class="dk-book">
          <div class="dk-book-head"><label for="novel-notes">Mi cuaderno de lectura</label><button class="dk-pill" id="dk-pdf" type="button" title="Se abrirá la ventana de impresión. Elige Guardar como PDF.">${svg.pdf}Exportar PDF</button></div>
          <div class="dk-book-body"></div>
          <div class="dk-book-foot"></div>
        </div>`;
      const help = diario.querySelector('#notes-help'), clear = diario.querySelector('#clear-novel-notes'), hint = diario.querySelector('#saved-hint');
      const body = grid.querySelector('.dk-book-body'), foot = grid.querySelector('.dk-book-foot');
      if (help) body.append(help);
      body.append(field);
      field.placeholder = 'Escribe aquí tus anotaciones…';
      if (hint) foot.append(hint);
      if (clear) foot.append(clear);
      if (journal) journal.replaceWith(grid); else diario.append(grid);

      const addToNotes = text => {
        field.value = field.value.replace(/\s+$/, '') + (field.value.trim() ? '\n\n' : '') + text;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.scrollTop = field.scrollHeight;
      };
      grid.querySelector('#dk-new').addEventListener('submit', e => {
        e.preventDefault();
        const note = $('dk-note'), st = $('dk-new-status');
        const txt = note.value.trim();
        if (!txt) { st.textContent = 'Escribe tu nota primero.'; note.focus(); return; }
        const cap = $('dk-cap').value, pg = $('dk-page').value.trim();
        addToNotes(`[${cap}${pg ? ' · p. ' + pg : ''}] ${txt}`);
        note.value = ''; $('dk-page').value = '';
        st.textContent = 'Añadida a tu cuaderno ✓';
        setTimeout(() => { if (st.textContent.startsWith('Añadida')) st.textContent = ''; }, 3000);
      });
      grid.querySelector('#dk-pdf').addEventListener('click', () => $('mg-save-pdf')?.click());

      // Guardar la respuesta de la pregunta en el cuaderno
      const save = main.querySelector('#dk-save');
      if (save) save.addEventListener('click', () => {
        const ans = $('dk-answer'), st = $('dk-q-status');
        const txt = ans.value.trim();
        if (!txt) { st.textContent = 'Escribe tu respuesta primero.'; ans.focus(); return; }
        addToNotes(`Pregunta de Marginalia: ${clean($('quote-text')?.textContent)}\nMi respuesta: ${txt}`);
        ans.value = '';
        st.textContent = 'Guardada en tus notas ✓';
        setTimeout(() => { if (st.textContent.startsWith('Guardada')) st.textContent = ''; }, 3000);
      });
    }

    /* ---------- ¿Te sirvió esta guía? ---------- */
    const fbOpen = $('mg-feedback-open');
    if (fbOpen) {
      const fb = document.createElement('section');
      fb.className = 'dk-feedback';
      fb.setAttribute('aria-labelledby', 'dk-fb-h');
      fb.innerHTML = `<div><h2 id="dk-fb-h">¿Te sirvió esta guía?</h2><p class="dk-hand">Me gustaría saber qué piensas.</p></div>
        <div class="dk-fb-btns" role="group" aria-label="¿Qué tanto te sirvió?"><button type="button" aria-haspopup="dialog">Mucho</button><button type="button" aria-haspopup="dialog">Algo</button><button type="button" aria-haspopup="dialog">Poco</button></div>`;
      fb.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
        const msg = $('mg-feedback-message');
        if (msg && !msg.value.trim()) { msg.value = `Me sirvió: ${b.textContent}. `; msg.dispatchEvent(new Event('input', { bubbles: true })); }
        fbOpen.click();
        const dlg = $('mg-feedback-dialog');
        if (dlg) dlg.addEventListener('close', () => b.focus(), { once: true });
        if (msg) { const end = msg.value.length; msg.setSelectionRange(end, end); }
      }));
      content.append(fb);
    }

    /* ---------- Guía anterior y siguiente ---------- */
    if (pv || nx) {
      const pager = document.createElement('nav');
      pager.className = 'dk-pager';
      pager.setAttribute('aria-label', 'Otras guías');
      const item = (a, side, info) => a ? `<a class="${side}" href="${esc(a.getAttribute('href'))}">${side === 'pv' ? `<span class="dk-spine" style="--c:${info.color}"></span>` : ''}<span><small>${side === 'pv' ? '← Guía anterior' : 'Siguiente guía →'}</small><b>${esc(clean(a.querySelector('b')?.textContent))}</b>${info.author ? `<i>${esc(info.author)}</i>` : ''}</span>${side === 'nx' ? `<span class="dk-spine" style="--c:${info.color}"></span>` : ''}</a>` : '<span></span>';
      pager.innerHTML = item(pv, 'pv', G.prev || {}) + item(nx, 'nx', G.next || {}) + '<a class="home" href="/#libros">Ver toda la biblioteca</a>';
      content.append(pager);
    }

    /* ---------- Pie ---------- */
    const foot = document.createElement('footer');
    foot.className = 'dk-foot';
    foot.innerHTML = `<div class="dk-foot-in">
      <div class="dk-foot-top"><p>Hecho con lápiz, café y mucha paciencia, para leer con calma.</p>
        <nav aria-label="Pie de página"><a href="/#libros">Guías</a><a href="/#novedades">Novedades</a><a href="/#categorias">Categorías</a><a href="/#pedidos">Pide un libro</a></nav></div>
      <div class="dk-foot-legal"></div></div>`;
    const oldFoot = oldWrap.querySelector(':scope > footer');
    const legal = foot.querySelector('.dk-foot-legal');
    if (oldFoot) [...oldFoot.children].forEach(ch => legal.append(ch));

    /* ---------- Montar ---------- */
    document.body.prepend(top, main);
    main.after(foot);
    oldWrap.hidden = true;
    const oldNav = document.querySelector('body > .mg-nav');
    if (oldNav) oldNav.hidden = true;

    /* ---------- Índice ---------- */
    const toc = $('dk-toc');
    const tocItems = groups.map(g => {
      const n = clean(g.querySelector('.g-n')?.textContent);
      const t = gName(g);
      const li = document.createElement('li');
      li.innerHTML = `<a href="#${g.id}"><span class="n">${esc(n)}</span><span class="t">${esc((b => b.length > 1 && /^(Parte|Cap[ií]tulos?)\b/i.test(b[0]) ? b.slice(1).join(' · ') : b[0])(t.split(' · ')))}</span><span class="c"></span></a>`;
      toc.append(li);
      return { el: g, a: li.firstChild, c: li.querySelector('.c'), cards: [...g.querySelectorAll('.card[id^="card-"]')] };
    });
    const sepLi = document.createElement('li'); sepLi.className = 'sep'; sepLi.setAttribute('aria-hidden', 'true'); toc.append(sepLi);
    const extra = [];
    if (spoil) { const li = document.createElement('li'); li.innerHTML = `<a href="#spoilers"><span class="lock">${svg.lock}</span><span class="t">El final explicado</span><span class="c"></span></a>`; toc.append(li); extra.push({ el: spoil, a: li.firstChild }); }
    blocks.forEach(b => {
      if (b === spoil) return;
      const t = clean(b.querySelector('h2')?.textContent);
      if (!t) return;
      const li = document.createElement('li');
      li.innerHTML = `<a href="#${b.id}"><span class="dot"></span><span class="t">${esc(t)}</span><span class="c"></span></a>`;
      toc.append(li); extra.push({ el: b, a: li.firstChild });
    });
    const watched = [...tocItems, ...extra];
    if ('IntersectionObserver' in window) {
      const vis = new Map();
      const io = new IntersectionObserver(es => {
        es.forEach(en => vis.set(en.target, en.isIntersecting ? en.intersectionRect.top : null));
        let best = null;
        watched.forEach(w => { const v = vis.get(w.el); if (v != null && best == null) best = w; });
        watched.forEach(w => w.a.setAttribute('aria-current', String(w === best)));
      }, { rootMargin: '-120px 0px -55% 0px' });
      watched.forEach(w => io.observe(w.el));
    }

    /* ---------- Progreso ---------- */
    const ruler = $('dk-ruler'), hint = $('dk-hint'), cont = $('dk-cont'), start = $('dk-start');
    const nextCard = () => cards().find(c => !c.classList.contains('is-done'));
    const sync = () => {
      const all = cards(), N = all.length, n = all.filter(c => c.classList.contains('is-done')).length;
      $('dk-n').textContent = n; $('dk-total').textContent = N;
      $('dk-count').innerHTML = `<b>${n}</b> /${N} exploradas`;
      ruler.setAttribute('aria-valuemax', N); ruler.setAttribute('aria-valuenow', n);
      ruler.setAttribute('aria-valuetext', `${n} de ${N} secciones exploradas`);
      ruler.style.setProperty('--tick', `calc((100% - 1px) / ${Math.max(N - 1, 1)})`);
      const pct = N ? n / N * 100 : 0;
      $('dk-fill').style.width = pct + '%';
      $('dk-mark').style.left = `calc(${pct}% - ${pct / 100 * 14}px)`;
      hint.textContent = n === 0 ? 'empieza por la primera' : n === N ? '¡la recorriste toda!' : n < N / 2 ? 'vas por buen camino' : 'ya casi llegas';
      start.firstChild.textContent = n === 0 ? 'Empezar la guía ' : 'Ir al principio ';
      cont.disabled = n === 0;
      tocItems.forEach(t => {
        const d = t.cards.filter(c => c.classList.contains('is-done')).length;
        t.c.textContent = t.cards.length ? (d === t.cards.length ? '✓' : `${d}/${t.cards.length}`) : '';
        t.a.parentElement.classList.toggle('full', t.cards.length > 0 && d === t.cards.length);
      });
      const known = $('dk-known');
      if (known) {
        const pc = peopleGroup ? [...peopleGroup.querySelectorAll('.card[id^="card-"]')] : [];
        known.textContent = `${pc.filter(c => c.classList.contains('is-done')).length}/${pc.length} conocidos`;
      }
    };
    const pt = $('progress-text');
    if (pt) new MutationObserver(sync).observe(pt, { childList: true, characterData: true, subtree: true });
    sync();

    const goTo = el => {
      if (!el) return;
      el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
      const btn = el.querySelector('.card-open');
      if (btn) btn.focus({ preventScroll: true });
      el.classList.remove('dk-flash'); void el.offsetWidth; el.classList.add('dk-flash');
      setTimeout(() => el.classList.remove('dk-flash'), 1700);
    };
    start.addEventListener('click', () => goTo(cards()[0]));
    cont.addEventListener('click', () => { const c = nextCard(); if (c) goTo(c); else spoil?.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    $('dk-reset').addEventListener('click', () => $('reset')?.click());

    /* ---------- Tema y logo ---------- */
    $('dk-theme').addEventListener('click', () => {
      const isDark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
      root.dataset.theme = isDark ? 'light' : 'dark';
      try { localStorage.setItem('marginalia-theme', root.dataset.theme); } catch (e) {}
    });
    const brand = top.querySelector('.dk-brand'), L = [...top.querySelectorAll('.dk-logo span')], S = ['s0', 's1', 's2', 's3', 's4', 's6'];
    let tm;
    brand.addEventListener('mouseenter', () => { clearInterval(tm); tm = setInterval(() => { const l = L[Math.floor(Math.random() * L.length)]; if (!l) return; l.className = S[Math.floor(Math.random() * S.length)]; l.style.transform = `rotate(${(Math.random() * 6 - 3).toFixed(1)}deg)`; }, 260); });
    brand.addEventListener('mouseleave', () => clearInterval(tm));

    root.classList.add('desk-ready');
    if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) requestAnimationFrame(() => t.scrollIntoView()); }
  } catch (err) {
    console.error('guia-desk:', err);
    giveUp();
  }
})();
