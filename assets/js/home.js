/* InfraEdge 360 — Homepage interactions (background particle canvas, counters, marquee, tabs) */

// Lightweight particle streak canvas setup
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
      len: (20 + Math.random()*90) * devicePixelRatio,
      speed: (0.6 + Math.random()*2.4) * devicePixelRatio,
      angle: (-0.5 + Math.random()*0.3),
      alpha: 0.08 + Math.random()*0.35,
      width: (0.6 + Math.random()*1.6) * devicePixelRatio
    });
  }
  return arr;
}

function init(){
  resize();
  particles = makeParticles(Math.floor((w*h)/38000));
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
