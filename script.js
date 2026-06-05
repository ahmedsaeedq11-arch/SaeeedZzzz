import { portfolioContent } from "./data/content.js";

const byId = (id) => document.getElementById(id);

/* ══════════════════════════════════════════
   PIXEL ICONS — inline SVG (16×16 grid)
══════════════════════════════════════════ */
const PIXEL_ICONS = {
  linkedin: `
    <svg class="social-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="0"  y="0"  width="16" height="2"  fill="currentColor"/>
      <rect x="0"  y="14" width="16" height="2"  fill="currentColor"/>
      <rect x="0"  y="0"  width="2"  height="16" fill="currentColor"/>
      <rect x="14" y="0"  width="2"  height="16" fill="currentColor"/>
      <rect x="3"  y="4"  width="2"  height="2"  fill="currentColor"/>
      <rect x="3"  y="7"  width="2"  height="5"  fill="currentColor"/>
      <rect x="7"  y="7"  width="2"  height="5"  fill="currentColor"/>
      <rect x="9"  y="7"  width="3"  height="2"  fill="currentColor"/>
      <rect x="9"  y="9"  width="2"  height="3"  fill="currentColor"/>
    </svg>`,

  behance: `
    <svg class="social-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="0"  y="0"  width="16" height="2"  fill="currentColor"/>
      <rect x="0"  y="14" width="16" height="2"  fill="currentColor"/>
      <rect x="0"  y="0"  width="2"  height="16" fill="currentColor"/>
      <rect x="14" y="0"  width="2"  height="16" fill="currentColor"/>
      <rect x="3"  y="3"  width="2"  height="10" fill="currentColor"/>
      <rect x="5"  y="3"  width="3"  height="2"  fill="currentColor"/>
      <rect x="8"  y="5"  width="2"  height="2"  fill="currentColor"/>
      <rect x="5"  y="7"  width="3"  height="2"  fill="currentColor"/>
      <rect x="8"  y="9"  width="2"  height="2"  fill="currentColor"/>
      <rect x="5"  y="11" width="3"  height="2"  fill="currentColor"/>
    </svg>`,

  instagram: `
    <svg class="social-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="1"  y="1"  width="14" height="2"  fill="currentColor"/>
      <rect x="1"  y="13" width="14" height="2"  fill="currentColor"/>
      <rect x="1"  y="1"  width="2"  height="14" fill="currentColor"/>
      <rect x="13" y="1"  width="2"  height="14" fill="currentColor"/>
      <rect x="5"  y="5"  width="6"  height="2"  fill="currentColor"/>
      <rect x="5"  y="9"  width="6"  height="2"  fill="currentColor"/>
      <rect x="5"  y="5"  width="2"  height="6"  fill="currentColor"/>
      <rect x="9"  y="5"  width="2"  height="6"  fill="currentColor"/>
      <rect x="11" y="3"  width="2"  height="2"  fill="currentColor"/>
    </svg>`,

  github: `
    <svg class="social-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="5"  y="1"  width="6"  height="2"  fill="currentColor"/>
      <rect x="3"  y="3"  width="2"  height="4"  fill="currentColor"/>
      <rect x="11" y="3"  width="2"  height="4"  fill="currentColor"/>
      <rect x="5"  y="7"  width="6"  height="2"  fill="currentColor"/>
      <rect x="3"  y="9"  width="4"  height="2"  fill="currentColor"/>
      <rect x="9"  y="9"  width="4"  height="2"  fill="currentColor"/>
      <rect x="1"  y="11" width="4"  height="2"  fill="currentColor"/>
      <rect x="11" y="11" width="4"  height="2"  fill="currentColor"/>
      <rect x="1"  y="13" width="4"  height="2"  fill="currentColor"/>
      <rect x="11" y="13" width="4"  height="2"  fill="currentColor"/>
      <rect x="7"  y="11" width="2"  height="2"  fill="currentColor"/>
    </svg>`
};

/* ══════════════════════════════════════════
   PIXEL AVATAR BADGE
══════════════════════════════════════════ */
const PIXEL_AVATAR_SRC = "./assets/pixel-avatar-stand.png";

function pixelAvatar(size = 52, extraStyle = "") {
  return `<div
    class="pixel-avatar-badge"
    style="
      width:${size}px;
      height:${size}px;
      background-image:url('${PIXEL_AVATAR_SRC}');
      background-size:contain;
      background-position:center;
      background-repeat:no-repeat;
      image-rendering:pixelated;
      ${extraStyle}
    "
    role="img"
    aria-label="Saeed pixel avatar"
  ></div>`;
}

/* ══════════════════════════════════════════
   SPARK SYSTEM
   Scatter blinking pixel dots in any container
══════════════════════════════════════════ */
const SPARK_COLORS   = ["", "orange", "red", "purple"];

/**
 * Fill a spark container with randomly placed blinking pixel dots.
 * @param {Element} container  — the .section-sparks or .hero-photo-sparks div
 * @param {number}  count      — number of dots
 */
function fillSparks(container, count = 10) {
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const dot   = document.createElement("span");
    const color = SPARK_COLORS[i % SPARK_COLORS.length];
    const blink = (0.6 + Math.random() * 1.5).toFixed(2);
    dot.className = `spark-dot ${color}`;
    dot.style.cssText = `
      top:${(Math.random() * 92).toFixed(1)}%;
      left:${(Math.random() * 96).toFixed(1)}%;
      --blink:${blink}s;
      animation-delay:${(Math.random() * 1.4).toFixed(2)}s;
    `;
    container.appendChild(dot);
  }
}

/** Inject sparks into every .section-sparks element on the page */
function initAllSparks() {
  document.querySelectorAll(".section-sparks").forEach((el) => fillSparks(el, 12));
  fillSparks(document.querySelector(".hero-photo-sparks"), 8);
}

/* ══════════════════════════════════════════
   WATERMARKS — inject data-watermark attrs
══════════════════════════════════════════ */
function setWatermarks() {
  const map = {
    about:      "ABOUT",
    philosophy: "PHILOSOPHY",
    projects:   "MISSIONS",
    contact:    "CONNECT",
  };
  Object.entries(map).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute("data-watermark", text);
  });
}

/* ══════════════════════════════════════════
   PIXEL RIPPLE — on click, anywhere
══════════════════════════════════════════ */
function attachRipple(card) {
  card.addEventListener("click", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    /* main ripple square */
    const ripple = document.createElement("div");
    ripple.className = "pixel-ripple";
    ripple.style.cssText = `left:${x - 8}px;top:${y - 8}px;`;
    card.appendChild(ripple);

    /* burst spark pixels */
    for (let i = 0; i < 8; i++) {
      const s   = document.createElement("span");
      const col = SPARK_COLORS[i % SPARK_COLORS.length];
      s.className = `spark-dot ${col}`;
      s.style.cssText = `
        left:${x + (Math.random() - 0.5) * 50}px;
        top:${y + (Math.random() - 0.5) * 50}px;
        --dx:${((Math.random() - 0.5) * 70).toFixed(0)}px;
        --dy:${-(20 + Math.random() * 50).toFixed(0)}px;
        animation: pixel-drift 0.6s ease-out forwards;
        width:6px; height:6px;
        position:absolute; z-index:25;
      `;
      card.appendChild(s);
      setTimeout(() => s.remove(), 650);
    }

    ripple.addEventListener("animationend", () => ripple.remove());
  });
}

/** Attach ripple to every .pixel-card on the page */
function initRipples() {
  document.querySelectorAll(".pixel-card, .stat-card, .social-link").forEach(attachRipple);
}

/* ══════════════════════════════════════════
   INTERSECTION OBSERVER — fade-in
══════════════════════════════════════════ */
function observeCards() {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.opacity = "1";
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.1 }
  );

  document.querySelectorAll(".project-card, .info-card, .quote-card, .stat-card").forEach((el) => {
    el.style.opacity = "0";
    io.observe(el);
  });
}

/* ══════════════════════════════════════════
   FILL STATIC TEXT
══════════════════════════════════════════ */
function fillTextContent() {
  byId("about-en").textContent      = portfolioContent.person.aboutEn;
  byId("philosophy-en").textContent = portfolioContent.person.philosophyEn;
}

/* ══════════════════════════════════════════
   PIXEL WEAPON ICONS — 16×16 SVG grid
══════════════════════════════════════════ */
const PIXEL_WEAPON_ICONS = {
  sword: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="0"  width="2" height="2" fill="#f4f0f5"/>
    <rect x="12" y="2"  width="2" height="2" fill="#f4f0f5"/>
    <rect x="10" y="4"  width="2" height="2" fill="#f4f0f5"/>
    <rect x="8"  y="6"  width="2" height="2" fill="#f4f0f5"/>
    <rect x="4"  y="6"  width="8" height="2" fill="#f18b2c"/>
    <rect x="8"  y="2"  width="2" height="8" fill="#f18b2c"/>
    <rect x="4"  y="8"  width="2" height="2" fill="#d4a050"/>
    <rect x="2"  y="10" width="2" height="2" fill="#d4a050"/>
    <rect x="0"  y="12" width="2" height="4" fill="#d4a050"/>
    <rect x="0"  y="14" width="4" height="2" fill="#f8d94c"/>
  </svg>`,
  shield: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <rect x="2"  y="0"  width="12" height="2" fill="#ab83ff"/>
    <rect x="0"  y="2"  width="16" height="8" fill="#ab83ff"/>
    <rect x="2"  y="10" width="12" height="2" fill="#ab83ff"/>
    <rect x="4"  y="12" width="8"  height="2" fill="#ab83ff"/>
    <rect x="6"  y="14" width="4"  height="2" fill="#ab83ff"/>
    <rect x="2"  y="2"  width="12" height="8" fill="#3d2b63"/>
    <rect x="7"  y="2"  width="2"  height="8" fill="#f8d94c"/>
    <rect x="3"  y="5"  width="10" height="2" fill="#f8d94c"/>
  </svg>`,
  wand: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <rect x="0"  y="12" width="2" height="4" fill="#8f63ea"/>
    <rect x="2"  y="10" width="2" height="2" fill="#8f63ea"/>
    <rect x="4"  y="8"  width="2" height="2" fill="#8f63ea"/>
    <rect x="6"  y="6"  width="2" height="2" fill="#ab83ff"/>
    <rect x="8"  y="4"  width="2" height="2" fill="#ab83ff"/>
    <rect x="10" y="2"  width="2" height="2" fill="#f8d94c"/>
    <rect x="10" y="0"  width="6" height="2" fill="#f8d94c"/>
    <rect x="14" y="0"  width="2" height="6" fill="#f8d94c"/>
    <rect x="12" y="2"  width="2" height="2" fill="#fff"/>
    <rect x="4"  y="12" width="2" height="2" fill="#f18b2c"/>
    <rect x="0"  y="8"  width="2" height="2" fill="#f8d94c"/>
  </svg>`,
  scroll: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <rect x="2"  y="0"  width="12" height="2" fill="#f8d94c"/>
    <rect x="0"  y="2"  width="16" height="2" fill="#d4a050"/>
    <rect x="2"  y="4"  width="12" height="8" fill="#f4f0f5"/>
    <rect x="4"  y="5"  width="8"  height="1" fill="#4b4560"/>
    <rect x="4"  y="7"  width="6"  height="1" fill="#4b4560"/>
    <rect x="4"  y="9"  width="8"  height="1" fill="#4b4560"/>
    <rect x="4"  y="11" width="4"  height="1" fill="#4b4560"/>
    <rect x="0"  y="12" width="16" height="2" fill="#d4a050"/>
    <rect x="2"  y="14" width="12" height="2" fill="#f8d94c"/>
  </svg>`,
  star: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <rect x="6"  y="0"  width="4"  height="16" fill="#f8d94c"/>
    <rect x="0"  y="6"  width="16" height="4"  fill="#f8d94c"/>
    <rect x="2"  y="2"  width="4"  height="4"  fill="#f8d94c"/>
    <rect x="10" y="2"  width="4"  height="4"  fill="#f8d94c"/>
    <rect x="2"  y="10" width="4"  height="4"  fill="#f8d94c"/>
    <rect x="10" y="10" width="4"  height="4"  fill="#f8d94c"/>
    <rect x="6"  y="0"  width="4"  height="2"  fill="#f18b2c"/>
    <rect x="6"  y="14" width="4"  height="2"  fill="#f18b2c"/>
    <rect x="0"  y="6"  width="2"  height="4"  fill="#f18b2c"/>
    <rect x="14" y="6"  width="2"  height="4"  fill="#f18b2c"/>
    <rect x="7"  y="7"  width="2"  height="2"  fill="#fff"/>
  </svg>`
};

const HEART_FILLED = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <rect x="2"  y="2"  width="4"  height="4" fill="#e83a3a"/>
  <rect x="10" y="2"  width="4"  height="4" fill="#e83a3a"/>
  <rect x="0"  y="4"  width="16" height="6" fill="#e83a3a"/>
  <rect x="2"  y="10" width="12" height="2" fill="#e83a3a"/>
  <rect x="4"  y="12" width="8"  height="2" fill="#e83a3a"/>
  <rect x="6"  y="14" width="4"  height="2" fill="#e83a3a"/>
  <rect x="4"  y="4"  width="3"  height="3" fill="#ff7070"/>
</svg>`;

const HEART_EMPTY = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <rect x="2"  y="2"  width="4"  height="4" fill="rgba(255,255,255,0.12)"/>
  <rect x="10" y="2"  width="4"  height="4" fill="rgba(255,255,255,0.12)"/>
  <rect x="0"  y="4"  width="16" height="6" fill="rgba(255,255,255,0.12)"/>
  <rect x="2"  y="10" width="12" height="2" fill="rgba(255,255,255,0.12)"/>
  <rect x="4"  y="12" width="8"  height="2" fill="rgba(255,255,255,0.12)"/>
  <rect x="6"  y="14" width="4"  height="2" fill="rgba(255,255,255,0.12)"/>
</svg>`;

/* Half heart — left filled, right empty */
const HEART_HALF = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <!-- left half filled -->
  <rect x="2"  y="2"  width="4"  height="4" fill="#e83a3a"/>
  <rect x="0"  y="4"  width="8"  height="6" fill="#e83a3a"/>
  <rect x="2"  y="10" width="6"  height="2" fill="#e83a3a"/>
  <rect x="4"  y="12" width="4"  height="2" fill="#e83a3a"/>
  <rect x="6"  y="14" width="2"  height="2" fill="#e83a3a"/>
  <rect x="4"  y="4"  width="2"  height="2" fill="#ff7070"/>
  <!-- right half empty -->
  <rect x="10" y="2"  width="4"  height="4" fill="rgba(255,255,255,0.12)"/>
  <rect x="8"  y="4"  width="8"  height="6" fill="rgba(255,255,255,0.12)"/>
  <rect x="8"  y="10" width="6"  height="2" fill="rgba(255,255,255,0.12)"/>
  <rect x="8"  y="12" width="4"  height="2" fill="rgba(255,255,255,0.12)"/>
</svg>`;

function renderPips(level, max) {
  let html = "";
  for (let i = 0; i < max; i++) {
    html += `<span class="weapon-pip ${i < level ? "filled" : "empty"}"></span>`;
  }
  return `<div class="weapon-pips">${html}</div>`;
}

function renderHearts(hearts, max) {
  let html = "";
  const full    = Math.floor(hearts);
  const hasHalf = hearts % 1 >= 0.5;
  const empty   = max - full - (hasHalf ? 1 : 0);
  for (let i = 0; i < full;  i++) html += HEART_FILLED;
  if (hasHalf)                     html += HEART_HALF;
  for (let i = 0; i < empty; i++) html += HEART_EMPTY;
  return `<div class="passion-hearts">${html}</div>`;
}

function animateXP(target) {
  const el = document.getElementById("xp-count");
  if (!el) return;
  let current = 0;
  const steps = 60;
  const step = target / steps;
  const interval = 1400 / steps;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString();
    if (current >= target) clearInterval(timer);
  }, interval);
}

/* ══════════════════════════════════════════
   PIXEL DOG — 20×12 facing left, chasing
══════════════════════════════════════════ */
const PIXEL_DOG_SVG = `<svg viewBox="0 0 20 12" xmlns="http://www.w3.org/2000/svg" width="40" height="24" class="dog-svg">
  <!-- ear -->
  <rect x="0" y="0" width="2" height="3" fill="#c8a04a"/>
  <!-- head -->
  <rect x="0" y="3" width="5" height="5" fill="#c8a04a"/>
  <!-- eye -->
  <rect x="1" y="4" width="2" height="2" fill="#1a0800"/>
  <!-- snout -->
  <rect x="0" y="7" width="4" height="2" fill="#c8a04a"/>
  <!-- tongue -->
  <rect x="0" y="8" width="3" height="2" fill="#e05050"/>
  <!-- body -->
  <rect x="5" y="2" width="11" height="7" fill="#c8a04a"/>
  <!-- tail wag up -->
  <rect x="15" y="0" width="2" height="3" fill="#c8a04a"/>
  <rect x="17" y="0" width="2" height="2" fill="#c8a04a"/>
  <!-- legs -->
  <rect x="5"  y="9" width="2" height="3" fill="#c8a04a"/>
  <rect x="9"  y="9" width="2" height="3" fill="#c8a04a"/>
  <rect x="13" y="9" width="2" height="3" fill="#c8a04a"/>
</svg>`;

/* ══════════════════════════════════════════
   SKILLS LOADOUT RENDERER
══════════════════════════════════════════ */
function renderSkillsLoadout() {
  const container = byId("hero-skills");
  if (!container) return;
  const { tools, passions } = portfolioContent.skills;

  const weaponsHTML = tools.map((t) => `
    <div class="weapon-item">
      <span class="weapon-icon">${PIXEL_WEAPON_ICONS[t.icon] || ""}</span>
      <span class="weapon-name">${t.name}</span>
      ${renderPips(t.level, t.max)}
      <span class="weapon-level">LVL ${t.level}</span>
    </div>`).join("");

  const passionsHTML = passions.map((p) => `
    <div class="passion-item">
      <span class="passion-name">${p.name}</span>
      ${renderHearts(p.hearts, p.max)}
    </div>`).join("");

  container.innerHTML = `
    <div class="skills-loadout">
      <div class="skills-char">
        <div class="skills-char-sprite" role="img" aria-label="Saeed pixel avatar front"></div>
        <span class="skills-char-label">PLAYER 01<br>SAEED</span>
      </div>
      <div class="skills-content">
        <div class="skills-header">
          <span class="skills-title">&#9876; SKILLS CARD</span>
          <span class="xp-badge">XP: <span class="xp-number">&#8734;</span></span>
        </div>
        <div class="skills-weapons">${weaponsHTML}</div>
        <div class="skills-divider"></div>
        <div class="skills-passions">${passionsHTML}</div>
      </div>
    </div>`;
}

/* ══════════════════════════════════════════
   HERO META
══════════════════════════════════════════ */
function renderHeroMeta() {
  byId("hero-meta").innerHTML = portfolioContent.person.meta
    .map((item) => `
      <div class="meta-row">
        <span class="meta-label">${item.label}</span>
        <span class="meta-value">${item.value}</span>
      </div>`)
    .join("");
}

/* ══════════════════════════════════════════
   PROJECTS — sparks + pixel avatar badge +
              glitch title + visual-main only
══════════════════════════════════════════ */
function renderProjects() {
  byId("projects-grid").innerHTML = portfolioContent.projects
    .map((project, index) => `
      <article class="project-card pixel-card" id="${project.slug}">
        <div class="section-sparks" aria-hidden="true"></div>

        <div class="project-copy">
          <div class="project-head">
            <div class="project-head-left">
              ${pixelAvatar(48)}
              <div>
                <p class="project-label">MISSION 0${index + 1}</p>
                <h3 class="project-title-pixel" data-text="${project.titleEn}">
                  ${project.titleEn}
                </h3>
              </div>
            </div>
            <span class="status-badge">${project.status}</span>
          </div>

          <p>${project.summaryEn}</p>

          <div class="project-meta">
            <div class="meta-block">
              <strong>ROLE</strong>
              <span>${project.role}</span>
            </div>
            <div class="meta-block">
              <strong>DESIGN INTENT</strong>
              <span>${project.designIntent}</span>
            </div>
          </div>
        </div>

        <div class="project-visual">
          <div class="visual-main" data-label="${project.visualLabel}"></div>
          <div class="visual-strip">
            ${project.images.map((img) =>
              `<div class="thumb" aria-label="${img}" title="${img}"></div>`
            ).join("")}
          </div>
        </div>
      </article>`)
    .join("");

  /* fill sparks inside each project card */
  document.querySelectorAll(".project-card .section-sparks").forEach((el) =>
    fillSparks(el, 9)
  );
}

/* ══════════════════════════════════════════
   SOCIALS
══════════════════════════════════════════ */
function renderSocials() {
  byId("social-links").innerHTML = portfolioContent.socials
    .map((item) => `
      <a class="social-link pixel-card" href="${item.href}" target="_blank" rel="noreferrer">
        <span class="social-icon-wrap">${PIXEL_ICONS[item.icon] || ""}</span>
        <span class="social-link-title">${item.title}</span>
        <span class="social-link-copy">${item.copy}</span>
      </a>`)
    .join("");
}

/* ══════════════════════════════════════════
   INIT — run everything
══════════════════════════════════════════ */
fillTextContent();
renderSkillsLoadout();
renderHeroMeta();
renderProjects();
renderSocials();

setWatermarks();
initAllSparks();
initRipples();
observeCards();
