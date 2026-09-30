/* Media playback starts synchronously inside a user gesture, including on iOS. */
window.MarginaliaIntroAudio = class {
  constructor(button, status) {
    this.button = button;
    this.status = status;
    this.media = new Audio('entrada.mp3');
    this.media.preload = 'auto';
    this.media.loop = true;
    this.enabled = true;
    this.requested = false;
    this.playing = false;
    this.pending = false;
    this.version = 0;
    this.fade = 0;
    this.button.textContent = 'Activar sonido';
    this.button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      if (this.pending || this.playing) {
        this.enabled = false;
        this.stop();
      } else {
        this.enabled = true;
        this.play();
      }
    });
    this.media.addEventListener('playing', () => {
      if (!this.enabled || !this.requested) { this.media.pause(); return; }
      this.playing = true;
      this.pending = false;
      this.button.textContent = 'Silenciar';
      this.button.setAttribute('aria-pressed', 'true');
      this.status.textContent = '';
    });
    this.media.addEventListener('pause', () => {
      this.playing = false;
      this.button.textContent = 'Activar sonido';
      this.button.setAttribute('aria-pressed', 'false');
    });
    this.media.addEventListener('error', () => {
      this.stop();
      this.status.textContent = 'No se pudo cargar la música. Puedes entrar sin sonido.';
    });
  }
  play() {
    if (!this.enabled || this.playing || this.pending) return;
    cancelAnimationFrame(this.fade);
    const attempt = ++this.version;
    this.pending = true;
    this.requested = true;
    this.button.textContent = 'Cargando sonido…';
    this.status.textContent = '';
    this.setVolume(.65);
    // Do not wait for fetch, decoding, timers or canplay before calling play().
    let request;
    try { request = this.media.play(); }
    catch (error) { this.failed(attempt, error); return; }
    Promise.resolve(request).then(() => {
      if (attempt !== this.version) return;
      this.pending = false;
    }).catch(error => this.failed(attempt, error));
  }
  failed(attempt, error) {
    if (attempt !== this.version) return;
    this.pending = false;
    this.playing = false;
    this.button.textContent = 'Activar sonido';
    this.button.setAttribute('aria-pressed', 'false');
    this.status.textContent = error.name === 'NotAllowedError'
      ? 'Toca «Activar sonido» para escuchar la música.'
      : 'No se pudo reproducir la música. Toca para reintentarlo.';
  }
  setVolume(value) {
    // iOS can leave volume control to the device; playback does not depend on it.
    try { this.media.volume = Math.max(0, Math.min(1, value)); } catch (_) {}
  }
  stop(seconds = 0) {
    ++this.version;
    this.requested = false;
    this.pending = false;
    cancelAnimationFrame(this.fade);
    const pause = () => {
      this.media.pause();
      this.playing = false;
      this.button.textContent = 'Activar sonido';
      this.button.setAttribute('aria-pressed', 'false');
    };
    if (!seconds || this.media.paused) { pause(); return; }
    const start = performance.now(), from = this.media.volume;
    const step = now => {
      const fraction = Math.min(1, (now - start) / (seconds * 1000));
      this.setVolume(from * (1 - fraction));
      if (fraction === 1) pause();
      else this.fade = requestAnimationFrame(step);
    };
    this.fade = requestAnimationFrame(step);
  }
};
