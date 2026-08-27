
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const intro = document.querySelector('.intro');

if (!reduced) {
  window.addEventListener('load', () => setTimeout(() => intro?.classList.add('hide'), 1150));
} else {
  intro?.classList.add('hide');
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const modal = document.getElementById('appointment-modal');
let lastFocus = null;
function openModal(){
  lastFocus = document.activeElement;
  modal?.classList.add('open');
  modal?.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  setTimeout(()=>modal?.querySelector('.modal-close')?.focus(),50);
}
function closeModal(){
  modal?.classList.remove('open');
  modal?.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
  lastFocus?.focus?.();
}
document.querySelectorAll('[data-open-modal]').forEach(b=>b.addEventListener('click',openModal));
document.querySelectorAll('[data-close-modal]').forEach(b=>b.addEventListener('click',closeModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal?.classList.contains('open'))closeModal()});

document.querySelectorAll('[data-marquee]').forEach((viewport,index)=>{
  const track = viewport.querySelector('.brand-track');
  let x = index ? -160 : 0;
  let speed = index ? .22 : -.26;
  let dragging = false;
  let prev = 0;
  let dragSpeed = 0;
  let last = performance.now();

  const wrap = ()=>{
    const half = track.scrollWidth/2;
    if(!half) return;
    if(x < -half) x += half;
    if(x > 0) x -= half;
  };

  function frame(now){
    const dt = Math.min(32, now-last); last=now;
    if(!dragging && !reduced){
      x += speed*(dt/16.67);
      speed += ((index ? .22 : -.26)-speed)*.01;
      wrap();
      track.style.transform=`translate3d(${x}px,0,0)`;
    }
    requestAnimationFrame(frame);
  }

  viewport.addEventListener('pointerdown',e=>{
    dragging=true; prev=e.clientX; dragSpeed=0;
    viewport.setPointerCapture?.(e.pointerId);
  });
  viewport.addEventListener('pointermove',e=>{
    if(!dragging)return;
    const d=e.clientX-prev; prev=e.clientX;
    x+=d; dragSpeed=d*.55; wrap();
    track.style.transform=`translate3d(${x}px,0,0)`;
  });
  const release=()=>{if(!dragging)return;dragging=false;speed=dragSpeed};
  viewport.addEventListener('pointerup',release);
  viewport.addEventListener('pointercancel',release);
  viewport.addEventListener('pointerleave',()=>dragging&&release());
  requestAnimationFrame(frame);
});
