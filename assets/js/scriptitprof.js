// ===== Banner de progreso suave (revelado de imagen) =====
const bannerFill = document.getElementById('scrollBannerFill');

function getScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 1;
  const y = window.pageYOffset || document.documentElement.scrollTop || 0;
  return Math.min(1, Math.max(0, y / max));
}

let target = 0;      // destino (0..1) según scroll
let current = 0;     // valor suavizado mostrado (0..1)
let rafId = null;

function animate() {
  // Interpolación hacia el destino para movimiento fluido
  const alpha = 0.18; // ajusta 0.1..0.3 para más/menos suavidad
  current += (target - current) * alpha;

  // Evitar oscilación final
  if (Math.abs(target - current) < 0.001) current = target;

  // Aplicar ancho suavizado
  bannerFill.style.width = (current * 100).toFixed(2) + '%';

  // Umbrales 33.33 / 66.66 / 99.99 con histéresis
  checkThresholds(current);

  if (current !== target) {
    rafId = requestAnimationFrame(animate);
  } else {
    rafId = null;
  }
}

function setTargetFromScroll() {
  target = getScrollProgress();
  if (rafId == null) rafId = requestAnimationFrame(animate);
}

window.addEventListener('scroll', setTargetFromScroll, { passive: true });
window.addEventListener('resize', setTargetFromScroll);

// ===== Sticky layers (tu lógica original, intacta) =====
const chapters = Array.from(document.querySelectorAll('.chapter'));
const layerA = document.getElementById('layerA');
const layerB = document.getElementById('layerB');
const layerC = document.getElementById('layerC');
let currentLayer = 'A';

function swapLayer(key){
  layerA.classList.remove('on');
  layerB.classList.remove('on');
  layerC.classList.remove('on');
  if(key==='A') layerA.classList.add('on');
  else if(key==='B') layerB.classList.add('on');
  else if(key==='C') layerC.classList.add('on');
}

const chapterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    const idx = chapters.indexOf(entry.target);
    let key = 'A';
    if(idx === 0) key = 'A';
    else if(idx === 1) key = 'B';
    else if(idx === 2) key = 'C';
    if(key !== currentLayer){
      currentLayer = key;
      swapLayer(key);
    }
  });
}, { rootMargin: '-40% 0px -60% 0px' });

chapters.forEach(c => chapterObserver.observe(c));

// ===== Umbrales para 33.33 / 66.66 / 99.99 (opcional) =====
const thresholds = [
  { value: 0.3333, hit: false, name: '33.33%' },
  { value: 0.6666, hit: false, name: '66.66%' },
  { value: 0.9999, hit: false, name: '99.99%' },
];

function checkThresholds(v) {
  const margin = 0.002; // histéresis para evitar re-disparos
  thresholds.forEach(t => {
    if (!t.hit && v >= t.value - margin) {
      t.hit = true;
      // Aquí puedes disparar acciones sincronizadas con el progreso:
      // if (t.value === 0.3333) swapLayer('A');
      // if (t.value === 0.6666) swapLayer('B');
      // if (t.value === 0.9999) swapLayer('C');
      // console.log('Cruzado', t.name);
    }
    if (t.hit && v < t.value - 0.05) t.hit = false;
  });
}

// ===== Inicialización =====
document.addEventListener('DOMContentLoaded', () => {
  // Fuerza un primer cálculo
  setTargetFromScroll();
});
