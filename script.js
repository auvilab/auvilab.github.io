
const intro = document.querySelector('.intro');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced) {
  window.addEventListener('load', () => {
    window.setTimeout(() => intro?.classList.add('is-hidden'), 1350);
  });
} else {
  intro?.classList.add('is-hidden');
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const modal = document.querySelector('#appointment-modal');
const modalPanel = modal?.querySelector('.modal-panel');
let lastFocus = null;

function openModal() {
  if (!modal) return;
  lastFocus = document.activeElement;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  setTimeout(() => modal.querySelector('.modal-close')?.focus(), 80);
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  lastFocus?.focus?.();
}

document.querySelectorAll('[data-open-modal]').forEach((btn) => btn.addEventListener('click', openModal));
document.querySelectorAll('[data-close-modal]').forEach((btn) => btn.addEventListener('click', closeModal));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal?.classList.contains('is-open')) closeModal();
});

document.querySelectorAll('[data-marquee]').forEach((row, rowIndex) => {
  const viewport = row.querySelector('.marquee-viewport');
  const track = row.querySelector('.marquee-track');
  if (!viewport || !track) return;

  let x = rowIndex === 0 ? 0 : -180;
  let velocity = rowIndex === 0 ? -0.34 : 0.28;
  let dragging = false;
  let previous = 0;
  let dragVelocity = 0;
  let lastTime = performance.now();

  const wrap = () => {
    const half = track.scrollWidth / 2;
    if (!half) return;
    if (x < -half) x += half;
    if (x > 0) x -= half;
  };

  const tick = (time) => {
    const dt = Math.min(32, time - lastTime);
    lastTime = time;

    if (!dragging && !reduced) {
      x += velocity * (dt / 16.67);
      velocity += ((rowIndex === 0 ? -0.34 : 0.28) - velocity) * 0.012;
      wrap();
      track.style.transform = `translate3d(${x}px,0,0)`;
    }
    requestAnimationFrame(tick);
  };

  viewport.addEventListener('pointerdown', (e) => {
    dragging = true;
    previous = e.clientX;
    dragVelocity = 0;
    viewport.setPointerCapture?.(e.pointerId);
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const delta = e.clientX - previous;
    previous = e.clientX;
    x += delta;
    dragVelocity = delta * 0.7;
    wrap();
    track.style.transform = `translate3d(${x}px,0,0)`;
  });

  const release = () => {
    if (!dragging) return;
    dragging = false;
    velocity = dragVelocity;
  };

  viewport.addEventListener('pointerup', release);
  viewport.addEventListener('pointercancel', release);
  viewport.addEventListener('pointerleave', () => {
    if (dragging) release();
  });

  requestAnimationFrame(tick);
});
