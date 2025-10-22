// ===== Banner de progreso suave (revelado de imagen) =====
const bannerFill = document.getElementById('scrollBannerFill');

function getScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 1;
  const y = window.pageYOffset || document.documentElement.scrollTop || 0;
  return Math.min(1, Math.max(0, y / max));
}

// Estado (manteniendo tus nombres target/current/rafId)
let target = 0;      // destino 0..1
let current = 0;     // mostrado 0..1
let rafId = null;

// Variables adicionales para controlar el modo por capítulos
let lockByChapter = true;     // true = el banner lo gobierna el capítulo activo (tercios)
let chapterPercent = 0;       // porcentaje 0..99.99 dictado por capítulo activo

function animate() {
  // Si está bloqueado por capítulo, el destino es chapterPercent/100
  const desired = lockByChapter ? (chapterPercent / 100) : target;

  const alpha = 0.18; // suavidad
  current += (desired - current) * alpha;

  if (Math.abs(desired - current) < 0.001) current = desired;

  bannerFill.style.width = (current * 100).toFixed(2) + '%';

  // Umbrales 33.33 / 66.66 / 99.99 con histéresis
  checkThresholds(current);

  if (current !== desired) {
    rafId = requestAnimationFrame(animate);
  } else {
    rafId = null;
  }
}

function setTargetFromScroll() {
  // Solo actualiza target si NO está bloqueado por capítulo
  if (!lockByChapter) {
    target = getScrollProgress();
    if (rafId == null) rafId = requestAnimationFrame(animate);
  }
}

// Listeners de scroll/resize (se respetan)
window.addEventListener('scroll', setTargetFromScroll, { passive: true });
window.addEventListener('resize', setTargetFromScroll);


// ===== Sticky layers (adaptado a 12 capas) =====
const chapters = Array.from(document.querySelectorAll('.chapter'));
const layers = [
  document.getElementById('layerA'),
  document.getElementById('layerB'),
  document.getElementById('layerC'),
  document.getElementById('layerD'),
  document.getElementById('layerE'),
  document.getElementById('layerF'),
  document.getElementById('layerG'),
  document.getElementById('layerH'),
  document.getElementById('layerI'),
  document.getElementById('layerJ'),
  document.getElementById('layerK'),
  document.getElementById('layerL'),
];

function showLayerByIndex(idx) {
  layers.forEach((img, i) => {
    if (!img) return;
    if (i === idx) img.classList.add('on');
    else img.classList.remove('on');
  });
}

// Mapear capítulo (0..11) a porcentaje del banner por tercios:
// 0..3  -> 0 → 33.33, 4..7 -> 33.33 → 66.66, 8..11 -> 66.66 → 99.99
function chapterToBannerPercent(idx) {
  const group = Math.floor(idx / 4); // 0,1,2
  const inGroupPos = idx % 4;        // 0..3
  const start = group === 0 ? 0 : group === 1 ? 33.33 : 66.66;
  const end   = group === 0 ? 33.33 : group === 1 ? 66.66 : 99.99;
  const t = inGroupPos / 3; // 0, 0.333, 0.666, 1
  return start + (end - start) * t;
}

// IntersectionObserver para capítulos (un único observer para múltiples elementos)
const chapterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const idx = chapters.indexOf(entry.target);
    if (idx < 0) return;

    // 1) Cambiar imagen (0→A, 1→B, …, 11→L)
    showLayerByIndex(idx);

    // 2) Bloquear el banner por capítulo y marcar porcentaje objetivo por tercios
    lockByChapter = true;
    chapterPercent = chapterToBannerPercent(idx);

    // Lanzar animación si no está corriendo
    if (rafId == null) rafId = requestAnimationFrame(animate);
  });
}, { rootMargin: '-40% 0px -60% 0px' }); // zona activa centrada

chapters.forEach(c => chapterObserver.observe(c));


// ===== Umbrales para 33.33 / 66.66 / 99.99 (opcional) =====
const thresholds = [
  { value: 0.3333, hit: false, name: '33.33%' },
  { value: 0.6666, hit: false, name: '66.66%' },
  { value: 0.9999, hit: false, name: '99.99%' },
];

function checkThresholds(v) {
  const margin = 0.002; // histéresis
  thresholds.forEach(t => {
    if (!t.hit && v >= t.value - margin) {
      t.hit = true;
      // Aquí puedes disparar acciones sincronizadas con el progreso si lo deseas
      // console.log('Cruzado', t.name);
    }
    if (t.hit && v < t.value - 0.05) t.hit = false;
  });
}


// ===== Inicialización =====
document.addEventListener('DOMContentLoaded', () => {
  // Estado inicial: capítulo 0 (layerA) y banner al inicio del primer tercio
  showLayerByIndex(0);
  lockByChapter = true;
  chapterPercent = chapterToBannerPercent(0);
  if (rafId == null) rafId = requestAnimationFrame(animate);
});
