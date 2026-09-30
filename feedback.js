(() => {
  'use strict';
  const trigger = document.getElementById('mg-feedback-open');
  if (!trigger) return;
  const book = document.querySelector('.hero cite').textContent.trim();
  const dialog = document.createElement('dialog');
  dialog.id = 'mg-feedback-dialog';
  dialog.setAttribute('aria-labelledby', 'mg-feedback-title');
  dialog.setAttribute('aria-describedby', 'mg-feedback-book');
  dialog.innerHTML = `
    <div class="mg-feedback-heading">
      <h2 id="mg-feedback-title">Tu comentario sobre esta guía</h2>
      <button id="mg-feedback-close" type="button" aria-label="Cerrar comentario">×</button>
    </div>
    <p id="mg-feedback-book"></p>
    <form id="mg-feedback-form">
      <label for="mg-feedback-message">¿Qué te gustó o qué podríamos mejorar?</label>
      <textarea id="mg-feedback-message" name="message" maxlength="1000" required placeholder="Cuéntame qué piensas…" aria-describedby="mg-feedback-note"></textarea>
      <div class="mg-feedback-meta">
        <span id="mg-feedback-note">Tu comentario llegará a la creadora de Marginalia.</span>
        <span id="mg-feedback-count">0/1000</span>
      </div>
      <button class="btn" id="mg-feedback-submit" type="submit">Enviar comentario</button>
    </form>
    <p id="mg-feedback-status" role="status" aria-live="polite" aria-atomic="true"></p>`;
  document.body.append(dialog);
  const find = id => document.getElementById(id);
  const form = find('mg-feedback-form');
  const message = find('mg-feedback-message');
  const submit = find('mg-feedback-submit');
  const status = find('mg-feedback-status');
  const count = find('mg-feedback-count');
  find('mg-feedback-book').textContent = book;
  let sending = false;
  let sent = false;

  trigger.addEventListener('click', () => {
    if (sent) {
      form.hidden = false;
      status.textContent = '';
      sent = false;
    }
    dialog.showModal();
    if (!sending) message.focus();
  });
  find('mg-feedback-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => trigger.focus());
  message.addEventListener('input', () => {
    message.setCustomValidity('');
    count.textContent = `${message.value.length}/1000`;
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    const text = message.value.trim();
    message.setCustomValidity(text ? '' : 'Escribe un comentario antes de enviarlo.');
    if (!form.reportValidity()) return;
    sending = true;
    submit.disabled = true;
    message.readOnly = true;
    form.setAttribute('aria-busy', 'true');
    submit.textContent = 'Enviando…';
    status.textContent = '';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const data = new FormData();
      data.append('message', text);
      data.append('_subject', `Marginalia · ${book}`);
      data.append('app', 'Marginalia');
      data.append('libro', book);
      data.append('pagina', location.origin + location.pathname);
      const response = await fetch('https://formspree.io/f/mrelklpw', {
        method: 'POST', body: data,
        headers: { Accept: 'application/json' }, signal: controller.signal
      });
      if (!response.ok) throw new Error('submission-failed');
      sent = true;
      form.reset();
      form.hidden = true;
      count.textContent = '0/1000';
      status.textContent = '¡Gracias! Tu comentario fue enviado.';
      if (dialog.open) find('mg-feedback-close').focus();
    } catch (_) {
      status.textContent = 'No pudimos confirmar el envío. Tu comentario sigue aquí; puedes volver a intentarlo.';
    } finally {
      clearTimeout(timeout);
      sending = false;
      submit.disabled = false;
      message.readOnly = false;
      form.removeAttribute('aria-busy');
      submit.textContent = 'Enviar comentario';
    }
  });
})();
