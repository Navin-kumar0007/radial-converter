// Scroll-driven scenes, plus Motion (vendor/motion, MIT) for springs: the orbit, the spotlight and
// tilt on cards, buttons that lean toward the pointer, and headings that blur in. Each scene's stage
// stays pinned while the page scrolls past it, and how far through it the reader is (0 to 1) moves
// what's on stage. Without this script, or with reduced motion, every scene shows its finished state.
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

  // Privacy's sentence lights up word by word, and headings blur in word by word, so both are split
  // here rather than in the page. Line breaks stay where they are.
  const splitWords = (element, className) => {
    const pieces = [];
    for (const node of [...element.childNodes]) {
      if (node.nodeType !== Node.TEXT_NODE) {
        pieces.push(node);
        continue;
      }
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          pieces.push(document.createTextNode(part));
          return;
        }
        const span = document.createElement('span');
        span.textContent = part;
        if (className) span.className = className;
        pieces.push(span);
      });
    }
    element.replaceChildren(...pieces);
    return $$('span', element);
  };
  const words = $('[data-words]');
  const spans = splitWords(words);

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.add('motion');
  const Motion = window.Motion;

  const clamp = (value, low = 0, high = 1) => Math.min(high, Math.max(low, value));
  const part = (p, from, to) => clamp((p - from) / (to - from));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const mix = (a, b, t) => a + (b - a) * t;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Scenes. Progress eases toward where the page is, rather than jumping, so scrubbing feels smooth.
  const scenes = $$('.scene').map((element) => ({
    element,
    length: Number(element.dataset.length) || 2,
    shown: 0,
  }));
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
    wheel.setAttribute('transform', `scale(${0.82 + 0.18 * open}) rotate(${(1 - open) * -24})`);
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
    for (const target of targets) {
      const passed = bytes <= Number(target.dataset.under);
      if (passed && !target.classList.contains('hit') && Motion) {
        Motion.animate(target, { scale: [1, 1.12, 1] }, { type: 'spring', stiffness: 400, damping: 14 });
      }
      target.classList.toggle('hit', passed);
    }
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
      const on = clamp(lit - i);
      span.style.opacity = 0.16 + 0.84 * on;
      span.style.filter = on < 1 ? `blur(${(1 - on) * 6}px)` : '';
    });
    rings.forEach((ring, i) => ring.setAttribute('transform', `rotate(${(i ? -1 : 1) * p * 140} 100 100)`));
    lock.setAttribute('transform', `translate(0 ${-10 * (1 - ease(part(p, 0.5, 0.62)))})`);
    proofs.classList.toggle('show', p > 0.6);
  }

  const opening = $('.opening-inner');
  const orbitWrap = $('.orbit-wrap');
  const bar = $('.progress span');
  const play = { drag, fit, reel, formats, privacy };

  let waiting = false;
  function frame() {
    waiting = false;
    const page = scrollY / Math.max(1, root.scrollHeight - innerHeight);
    bar.style.transform = `scaleX(${page})`;
    const leaving = clamp(scrollY / innerHeight);
    opening.style.transform = `translateY(${-leaving * 90}px)`;
    opening.style.opacity = 1 - leaving * 1.1;
    orbitWrap.style.transform = `translateY(${-leaving * 40}px) scale(${1 - leaving * 0.25})`;
    orbitWrap.style.opacity = 1 - leaving * 1.2;
    let moving = false;
    for (const scene of scenes) {
      const box = scene.element.getBoundingClientRect();
      const target = progressOf(scene.element);
      if (box.bottom < -innerHeight || box.top > innerHeight * 2) {
        scene.shown = target;
        continue;
      }
      const gap = target - scene.shown;
      scene.shown = Math.abs(gap) < 0.0005 ? target : scene.shown + gap * 0.16;
      if (scene.shown !== target) moving = true;
      const name = Object.keys(play).find((each) => scene.element.classList.contains(each));
      play[name](scene.shown);
    }
    if (moving) request();
  }
  function request() {
    if (!waiting) {
      waiting = true;
      requestAnimationFrame(frame);
    }
  }

  sizeScenes();
  for (const scene of scenes) scene.shown = progressOf(scene.element);
  frame();
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', () => {
    sizeScenes();
    request();
  });

  if (!Motion) return;
  const { animate, inView, stagger, motionValue, springValue } = Motion;
  const smooth = [0.16, 1, 0.3, 1];

  // The orbit turns slowly, its chips stay upright, and the app at the centre breathes.
  const outer = $('.ring.outer');
  const inner = $('.ring.inner');
  animate(outer, { rotate: 360 }, { duration: 60, repeat: Infinity, ease: 'linear' });
  animate($$('.chip > span', outer), { rotate: -360 }, { duration: 60, repeat: Infinity, ease: 'linear' });
  animate(inner, { rotate: -360 }, { duration: 38, repeat: Infinity, ease: 'linear' });
  animate($$('.chip > span', inner), { rotate: 360 }, { duration: 38, repeat: Infinity, ease: 'linear' });
  animate('.core img', { scale: [1, 1.05, 1] }, { duration: 4, repeat: Infinity, ease: 'easeInOut' });

  // The hero's light and orbit follow the pointer, on a spring.
  if (fine) {
    const stage = $('.opening .stage');
    const orbit = $('.orbit');
    const pointerX = motionValue(innerWidth * 0.7);
    const pointerY = motionValue(innerHeight * 0.4);
    const x = springValue(pointerX, { stiffness: 90, damping: 20 });
    const y = springValue(pointerY, { stiffness: 90, damping: 20 });
    const place = () => {
      stage.style.setProperty('--hx', `${x.get()}px`);
      stage.style.setProperty('--hy', `${y.get()}px`);
      orbit.style.transform = `translate(${(x.get() - innerWidth / 2) * 0.025}px, ${(y.get() - innerHeight / 2) * 0.025}px)`;
    };
    x.on('change', place);
    y.on('change', place);
    stage.addEventListener('pointermove', (event) => {
      const box = stage.getBoundingClientRect();
      pointerX.set(event.clientX - box.left);
      pointerY.set(event.clientY - box.top);
    });
  }

  // Headings blur in word by word as they come into view.
  for (const heading of $$('.split')) {
    const pieces = splitWords(heading, 'w');
    inView(
      heading,
      () => {
        animate(
          pieces,
          { opacity: [0, 1], filter: ['blur(12px)', 'blur(0px)'], y: [22, 0] },
          { duration: 0.8, delay: stagger(0.05), ease: smooth },
        );
      },
      { amount: 0.4 },
    );
  }

  // Download cards rise into view, one after another, on a spring.
  inView(
    '.platforms',
    () => {
      animate('.rise', { opacity: [0, 1], y: [48, 0] }, { type: 'spring', stiffness: 120, damping: 18, delay: stagger(0.08) });
    },
    { amount: 0.2 },
  );

  // Cards: a light follows the pointer, and they tilt a little toward it.
  for (const card of $$('.glow')) {
    card.addEventListener('pointermove', (event) => {
      const box = card.getBoundingClientRect();
      const px = event.clientX - box.left;
      const py = event.clientY - box.top;
      card.style.setProperty('--mx', `${px}px`);
      card.style.setProperty('--my', `${py}px`);
      if (!fine || card.closest('.proofs')) return;
      animate(
        card,
        { rotateX: (0.5 - py / box.height) * 7, rotateY: (px / box.width - 0.5) * 9, y: -6 },
        { type: 'spring', stiffness: 260, damping: 24 },
      );
    });
    card.addEventListener('pointerleave', () => {
      if (!fine || card.closest('.proofs')) return;
      animate(card, { rotateX: 0, rotateY: 0, y: 0 }, { type: 'spring', stiffness: 200, damping: 20 });
    });
  }

  // Main buttons lean toward the pointer.
  if (fine) {
    for (const button of $$('.magnet, .platform .button')) {
      button.addEventListener('pointermove', (event) => {
        const box = button.getBoundingClientRect();
        const dx = event.clientX - (box.left + box.width / 2);
        const dy = event.clientY - (box.top + box.height / 2);
        animate(button, { x: dx * 0.25, y: dy * 0.35 }, { type: 'spring', stiffness: 300, damping: 18 });
      });
      button.addEventListener('pointerleave', () => {
        animate(button, { x: 0, y: 0 }, { type: 'spring', stiffness: 300, damping: 15 });
      });
    }
  }
})();
