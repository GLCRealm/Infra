/* ===================================================================
   InfraEdge 360 — Shared Site Script
   Used by: business, creative, event, legal, media, webdev, contact
   Handles: nav toggle, scroll effects, shared interactive behavior
   =================================================================== */

const canvas = document.getElementById('streaks');
const ctx = canvas.getContext('2d');
let w, h, particles;

function resize(){
  w = canvas.width = canvas.offsetWidth * devicePixelRatio;
  h = canvas.height = canvas.offsetHeight * devicePixelRatio;
}

function makeParticles(n){
  const arr = [];
  for(let i=0;i<n;i++){
    arr.push({
      x: Math.random()*w,
      y: Math.random()*h,
      len: (16 + Math.random()*70) * devicePixelRatio,
      speed: (0.5 + Math.random()*2) * devicePixelRatio,
      angle: (-0.5 + Math.random()*0.3),
      alpha: 0.06 + Math.random()*0.28,
      width: (0.6 + Math.random()*1.4) * devicePixelRatio
    });
  }
  return arr;
}

function init(){
  resize();
  particles = makeParticles(Math.floor((w*h)/42000));
}

function draw(){
  ctx.clearRect(0,0,w,h);
  ctx.strokeStyle = '#000000';
  for(const p of particles){
    ctx.globalAlpha = p.alpha;
    ctx.lineWidth = p.width;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    const ex = p.x + Math.cos(p.angle)*p.len;
    const ey = p.y + Math.sin(p.angle)*p.len;
    ctx.lineTo(ex, ey);
    ctx.stroke();

    p.x += Math.cos(p.angle)*p.speed;
    p.y += Math.sin(p.angle)*p.speed;

    if(p.x < -100 || p.x > w+100 || p.y < -100 || p.y > h+100){
      p.x = Math.random()*w;
      p.y = Math.random()*h;
    }
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}

window.addEventListener('resize', init);
init();
draw();

/* ============ NAV ACTIVE STATE ============
   Sets .active on the correct nav-item based on the current page,
   so nav.html / footer.html can be pasted identically into every
   page without manually editing an "active" class each time. */
(function setActiveNav(){
  const pageToNav = {
    'index.html': 'about',   // matches the original homepage default (About was active on load)
    '': 'about',             // root path ("/") resolves to the homepage too
    'contact.html': 'contact',
    'portfolio.html': 'portfolio',
    'business.html': 'services',
    'creative.html': 'services',
    'event.html': 'services',
    'legal.html': 'services',
    'media.html': 'services',
    'webdev.html': 'services'
  };
  const current = location.pathname.split('/').pop() || 'index.html';
  const key = pageToNav[current];
  if(!key) return;
  document.querySelectorAll('[data-nav="' + key + '"]').forEach(el => el.classList.add('active'));
})();
