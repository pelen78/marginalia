/* Marginalia · aviso de spoilers para novelas
   Uso: <script src="spoiler-gate.js" data-key="jardin" defer></script>
   Se muestra solo la primera vez que alguien abre la guía.
   Un solo botón: "Enterado". */
(() => {
  'use strict';
  const me = document.currentScript || document.querySelector('script[src$="spoiler-gate.js"]');
  const key = 'mg-spoiler-ok-' + ((me && me.dataset.key) || location.pathname);
  try { if (localStorage.getItem(key)) return; } catch (_) {}
  if (location.hash === '#spoilers') return;

  const title = (document.querySelector('.hero cite') || {}).textContent || 'esta novela';
  const css = document.createElement('style');
  css.textContent = `
#mg-spoiler-gate{width:min(480px,calc(100vw - 32px));padding:28px 26px 24px;border:1px solid var(--line);border-radius:18px;background:var(--paper);color:var(--ink);box-shadow:0 24px 80px -20px rgba(0,0,0,.45);text-align:center}
#mg-spoiler-gate::backdrop{background:rgba(20,22,19,.55);backdrop-filter:blur(4px)}
#mg-spoiler-gate .sg-tag{font-family:var(--f-mono,monospace);font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:var(--accent)}
#mg-spoiler-gate h2{font-family:var(--f-display,Georgia,serif);font-weight:400;font-size:1.8rem;line-height:1.15;margin:8px 0 10px}
#mg-spoiler-gate p{margin:0 0 20px;color:var(--muted);line-height:1.6}
#mg-spoiler-gate .sg-actions{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
#mg-spoiler-gate button{cursor:pointer;border-radius:999px;padding:11px 18px;font-family:var(--f-mono,monospace);font-size:.74rem;letter-spacing:.08em;text-transform:uppercase;min-height:44px}
#mg-spoiler-gate .sg-main{border:0;background:var(--ink);color:var(--bg)}
#mg-spoiler-gate .sg-main:hover{background:var(--accent);color:#fff}`;
  document.head.appendChild(css);

  const d = document.createElement('dialog');
  d.id = 'mg-spoiler-gate';
  d.setAttribute('aria-labelledby', 'sg-title');
  d.setAttribute('aria-describedby', 'sg-text');
  d.innerHTML = `
    <div class="sg-tag">Antes de empezar</div>
    <h2 id="sg-title">Esta guía tiene spoilers</h2>
    <p id="sg-text">Aquí se cuentan los hechos principales de <cite></cite>. El final y las grandes revelaciones están ocultos hasta que tú decidas verlos.</p>
    <div class="sg-actions">
      <button class="sg-main" type="button">Enterado</button>
    </div>`;
  d.querySelector('cite').textContent = title.trim();
  document.body.appendChild(d);

  const remember = () => { try { localStorage.setItem(key, '1'); } catch (_) {} };
  d.addEventListener('cancel', remember);
  d.querySelector('.sg-main').addEventListener('click', () => { remember(); d.close(); });
  d.showModal();
  d.querySelector('.sg-main').focus();
})();
