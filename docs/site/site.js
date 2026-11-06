// Scroll-driven scenes. Each scene's stage stays pinned while the page scrolls past it, and how far
// through it the reader is (0 to 1) moves what's on stage. Without this script, or with reduced
// motion, every scene shows its finished state and the page simply scrolls.
(() => {
  const root = document.documentElement;
  const $ = (selector, within = document) => within.querySelector(selector);
  const $$ = (selector, within = document) => [...within.querySelectorAll(selector)];

  // The main button goes to the download for this device.
  const agent = navigator.userAgent;
  const touchMac = /Macintosh/.test(agent) && navigator.maxTouchPoints > 1;
  let device = null;
  if (/iPhone|iPad|iPod/.test(agent) || touchMac) device = 'iphone';
  else if (/Android/.test(agent)) device = 'android';
  else if (/Windows/.test(agent)) device = 'windows';
  else if (/Macintosh/.test(agent)) device = 'mac';
  if (device) {
    const card = document.getElementById(device);
    const link = $('.button', card);
    const main = document.getElementById('get');
    card.classList.add('yours');
    main.href = link.href;
    main.textContent = link.dataset.main;
    if (device === 'iphone') document.getElementById('browser').hidden = true;
  }

  // Privacy's sentence lights up word by word, so it is split here rather than in the page.
  const words = $('[data-words]');
  const spans = words.textContent.trim().split(/\s+/).map((word) => {
    const span = document.createElement('span');
    span.textContent = word;
    return span;
  });
  words.replaceChildren(...spans.flatMap((span, i) => (i ? [document.createTextNode(' '), span] : [span])));

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.add('motion');

  const clamp = (value, low = 0, high = 1) => Math.min(high, Math.max(low, value));
  const part = (p, from, to) => clamp((p - from) / (to - from));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const mix = (a, b, t) => a + (b - a) * t;

  const scenes = $$('.scene').map((element) => ({ element, length: Number(element.dataset.length) || 2 }));
  const sizeScenes = () => {
    for (const scene of scenes) scene.element.style.height = `${scene.length * 100}vh`;
  };
  const progressOf = (element) => {
    const box = element.getBoundingClientRect();
    return clamp(-box.top / Math.max(1, box.height - innerHeight));
  };

  // The drag.
  const demo = $('.demo');
  const tile = $('.tile', demo);
  const result = $('.result', demo);
  const wheel = $('.wheel', demo);
  const hit = $('.hit', demo);
  const key = $('.key', demo);
  const inbox = $('.inbox', demo);
  const halo = $('.halo', demo);
  const steps = $$('.steps li');
  const at = (element, x, y) => {
    element.style.transform = `translate(${x}px, ${y}px)`;
  };
  function drag(p) {
    const toMenu = ease(part(p, 0.04, 0.24));
    const toSlice = ease(part(p, 0.36, 0.54));
    at(tile, mix(mix(70, 320, toMenu), 470, toSlice), mix(mix(410, 250, toMenu), 100, toSlice));
    tile.style.opacity = 1 - part(p, 0.58, 0.62);
    const open = ease(part(p, 0.26, 0.36));
    const gone = part(p, 0.6, 0.68);
    wheel.setAttribute('transform', `scale(${0.82 + 0.18 * open})`);
    wheel.style.opacity = open * (1 - gone);
    halo.style.opacity = 0.8 * open * (1 - gone);
    hit.style.opacity = part(p, 0.5, 0.54);
    key.classList.toggle('on', p > 0.24 && p < 0.6);
    const onward = ease(part(p, 0.7, 0.9));
    at(result, mix(442, 440, onward), mix(100, 420, onward));
    result.style.opacity = part(p, 0.62, 0.67);
    inbox.style.opacity = part(p, 0.64, 0.7);
    inbox.classList.toggle('got', onward > 0.97);
    const step = p < 0.24 ? 0 : p < 0.36 ? 1 : p < 0.62 ? 2 : 3;
    steps.forEach((li, i) => {
      li.classList.toggle('on', i === step);
      li.classList.toggle('done', i < step);
    });
  }

  // Make it fit: an example photo shrinks past each size slice.
  const sizeText = $('[data-size]');
  const fill = $('.meter-fill');
  const targets = $$('.targets li');
  const start = 4.8 * 1024 * 1024;
  const end = 92 * 1024;
  const readable = (bytes) =>
    bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
  function fit(p) {
    const bytes = Math.exp(mix(Math.log(start), Math.log(end), ease(part(p, 0.08, 0.82))));
    sizeText.textContent = readable(bytes);
    fill.style.transform = `scaleX(${Math.max(0.02, bytes / start)})`;
    for (const target of targets) target.classList.toggle('hit', bytes <= Number(target.dataset.under));
  }

  // The reel slides sideways as the page goes down.
  const reelStage = $('.reel .stage');
  const track = $('.track');
  function reel(p) {
    const room = Math.max(0, track.scrollWidth - reelStage.clientWidth);
    track.style.transform = `translateX(${-room * ease(part(p, 0.06, 0.94))}px)`;
  }

  // Format names drift past each other.
  const rows = $$('.row');
  function formats(p) {
    for (const row of rows) {
      row.style.transform = `translateX(${(p - 0.5) * Number(row.dataset.dir) * innerWidth * 0.45}px)`;
    }
  }

  // Privacy: the sentence lights up, the rings turn and the lock closes.
  const rings = $$('.vault-ring');
  const lock = $('.vault-lock');
  const proofs = $('.proofs');
  function privacy(p) {
    const lit = part(p, 0.04, 0.55) * spans.length;
    spans.forEach((span, i) => {
      span.style.opacity = 0.16 + 0.84 * clamp(lit - i);
    });
    rings.forEach((ring, i) => ring.setAttribute('transform', `rotate(${(i ? -1 : 1) * p * 140} 100 100)`));
    lock.setAttribute('transform', `translate(0 ${-10 * (1 - ease(part(p, 0.5, 0.62)))})`);
    proofs.classList.toggle('show', p > 0.6);
  }

  const opening = $('.opening-inner');
  const bar = $('.progress span');
  const scenesBy = {
    drag: drag,
    fit: fit,
    reel: reel,
    formats: formats,
    privacy: privacy,
  };

  let waiting = false;
  function frame() {
    waiting = false;
    const page = scrollY / Math.max(1, root.scrollHeight - innerHeight);
    bar.style.transform = `scaleX(${page})`;
    const leaving = clamp(scrollY / innerHeight);
    opening.style.transform = `translateY(${-leaving * 90}px) scale(${1 - leaving * 0.06})`;
    opening.style.opacity = 1 - leaving * 1.1;
    for (const { element } of scenes) {
      const box = element.getBoundingClientRect();
      if (box.bottom < -innerHeight || box.top > innerHeight * 2) continue;
      const name = Object.keys(scenesBy).find((each) => element.classList.contains(each));
      scenesBy[name](progressOf(element));
    }
  }
  const request = () => {
    if (!waiting) {
      waiting = true;
      requestAnimationFrame(frame);
    }
  };

  sizeScenes();
  frame();
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', () => {
    sizeScenes();
    request();
  });

  // Download cards rise into view once.
  const watcher = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in');
        watcher.unobserve(entry.target);
      }
    },
    { threshold: 0.2 },
  );
  $$('.rise').forEach((element) => watcher.observe(element));
})();
