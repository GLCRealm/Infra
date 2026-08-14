/* InfraEdge 360 — Portfolio page logic (gallery data + category filtering) */
/* Particle-streak canvas setup lives in the shared assets/js/main.js */

// ============ PORTFOLIO DATA ============
// Drop your own files into these folders using the same filenames
// to replace the placeholders below.
const PORTFOLIO_ITEMS = [
  { type:'image', category:'media',    title:'Courtside Coverage',        src:'imgvid/images/portfolio/01.jpg', size:'wide' },
  { type:'video', category:'events',   title:'Launch Night Recap',        src:'imgvid/video/portfolio/01.mp4',  poster:'imgvid/images/portfolio/02.jpg', size:'tall' },
  { type:'image', category:'creative', title:'Brand Identity — Rewild',   src:'imgvid/images/portfolio/03.jpg' },
  { type:'image', category:'web',      title:'Product Site — Orbit',      src:'imgvid/images/portfolio/04.jpg' },
  { type:'image', category:'business', title:'Strategy Workshop',         src:'imgvid/images/portfolio/05.jpg' },
  { type:'image', category:'media',    title:'Studio Lighting Setup',     src:'imgvid/images/portfolio/06.jpg' },
  { type:'video', category:'media',    title:'Behind the Lens',           src:'imgvid/video/portfolio/02.mp4',  poster:'imgvid/images/portfolio/07.jpg' },
  { type:'image', category:'events',   title:'Activation Setup',          src:'imgvid/images/portfolio/08.jpg', size:'wide' },
  { type:'image', category:'creative', title:'Packaging — Kite',          src:'imgvid/images/portfolio/09.jpg' },
  { type:'image', category:'events',   title:'Crowd &amp; Stage'.replace('&amp;','&'), src:'imgvid/images/portfolio/10.jpg', size:'tall' },
  { type:'image', category:'web',      title:'Dashboard UI — Pulse',      src:'imgvid/images/portfolio/11.jpg' },
  { type:'image', category:'media',    title:'Athlete Portrait Series',   src:'imgvid/images/portfolio/12.jpg' },
  { type:'video', category:'creative', title:'Campaign Teaser — Vertex',  src:'imgvid/video/portfolio/03.mp4',  poster:'imgvid/images/portfolio/13.jpg', size:'wide' },
  { type:'image', category:'business', title:'Founder Consultation',      src:'imgvid/images/portfolio/14.jpg' },
  { type:'image', category:'media',    title:'Sideline Production',       src:'imgvid/images/portfolio/15.jpg' },
  { type:'image', category:'creative', title:'Social Templates — Lumen',  src:'imgvid/images/portfolio/16.jpg' },
  { type:'image', category:'events',   title:'Backstage Prep',            src:'imgvid/images/portfolio/17.jpg' },
  { type:'image', category:'web',      title:'Mobile App — Nimbus',       src:'imgvid/images/portfolio/18.jpg', size:'tall' },
  { type:'video', category:'business', title:'Client Testimonial',        src:'imgvid/video/portfolio/04.mp4',  poster:'imgvid/images/portfolio/19.jpg' },
  { type:'image', category:'media',    title:'Field Crew Wide Shot',      src:'imgvid/images/portfolio/20.jpg', size:'wide' }
];

const CATEGORY_LABELS = {
  media:'Media', events:'Events', creative:'Creative', web:'Web', business:'Business'
};

const grid = document.getElementById('galleryGrid');

function playIconSVG(){
  return `<svg viewBox="0 0 24 24" fill="none"><path d="M6 4L20 12L6 20V4Z" fill="#eaf1ff"/></svg>`;
}
function expandIconSVG(){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="#eaf1ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>`;
}

PORTFOLIO_ITEMS.forEach((item, i) => {
  const tile = document.createElement('div');
  tile.className = 'tile' + (item.size === 'wide' ? ' tile--wide' : '') + (item.size === 'tall' ? ' tile--tall' : '');
  tile.dataset.category = item.category;
  tile.dataset.index = i;
  tile.style.animationDelay = (i * 0.04) + 's';

  let mediaEl;
  if(item.type === 'video'){
    mediaEl = `<video class="tile-media" muted loop playsinline preload="metadata" poster="${item.poster || ''}">
                 <source src="${item.src}" type="video/mp4">
               </video>
               <div class="tile-play">${playIconSVG()}</div>`;
  } else {
    mediaEl = `<img class="tile-media" src="${item.src}" alt="${item.title}" loading="lazy">
               <div class="tile-expand">${expandIconSVG()}</div>`;
  }

  tile.innerHTML = `
    ${mediaEl}
    <div class="tile-overlay">
      <div class="tile-cat">${CATEGORY_LABELS[item.category]}</div>
      <div class="tile-title">${item.title}</div>
    </div>
  `;

  // Hover-preview for video tiles
  if(item.type === 'video'){
    const vid = tile.querySelector('video');
    tile.addEventListener('mouseenter', () => { vid.currentTime = 0; vid.play().catch(()=>{}); });
    tile.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
  }

  tile.addEventListener('click', () => openLightbox(i));

  grid.appendChild(tile);
});

// ============ FILTERING ============
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.tile').forEach(tile => {
      const match = filter === 'all' || tile.dataset.category === filter;
      tile.classList.toggle('hidden', !match);
      if(match){
        tile.style.animation = 'none';
        void tile.offsetWidth;
        tile.style.animation = 'tile-in .45s cubic-bezier(.2,.8,.2,1) forwards';
      }
    });
  });
});

// ============ LIGHTBOX ============
const lightbox = document.getElementById('lightbox');
const lbMediaWrap = document.getElementById('lbMediaWrap');
const lbCat = document.getElementById('lbCat');
const lbTitle = document.getElementById('lbTitle');
let currentIndex = 0;

function getVisibleIndices(){
  const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
  return PORTFOLIO_ITEMS
    .map((item, i) => ({ item, i }))
    .filter(({item}) => activeFilter === 'all' || item.category === activeFilter)
    .map(({i}) => i);
}

function openLightbox(index){
  currentIndex = index;
  renderLightbox();
  lightbox.classList.add('open');
  document.documentElement.style.overflow = 'hidden';
}

function closeLightbox(){
  lightbox.classList.remove('open');
  document.documentElement.style.overflow = '';
  lbMediaWrap.innerHTML = '';
}

function renderLightbox(){
  const item = PORTFOLIO_ITEMS[currentIndex];
  lbMediaWrap.innerHTML = '';
  if(item.type === 'video'){
    const v = document.createElement('video');
    v.src = item.src;
    v.controls = true;
    v.autoplay = true;
    v.playsInline = true;
    if(item.poster) v.poster = item.poster;
    lbMediaWrap.appendChild(v);
  } else {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.title;
    lbMediaWrap.appendChild(img);
  }
  lbCat.textContent = CATEGORY_LABELS[item.category];
  lbTitle.textContent = item.title;
}

function step(dir){
  const visible = getVisibleIndices();
  const pos = visible.indexOf(currentIndex);
  let next;
  if(pos === -1){ next = visible[0] ?? currentIndex; }
  else { next = visible[(pos + dir + visible.length) % visible.length]; }
  currentIndex = next;
  renderLightbox();
}

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => step(-1));
document.getElementById('lbNext').addEventListener('click', () => step(1));

lightbox.addEventListener('click', (e) => {
  if(e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if(!lightbox.classList.contains('open')) return;
  if(e.key === 'Escape') closeLightbox();
  if(e.key === 'ArrowLeft') step(-1);
  if(e.key === 'ArrowRight') step(1);
});