const AudioCtx = window.AudioContext || window.webkitAudioContext;
let _actx = null;
let _audioEnabled = (() => {
  try {
    return localStorage.getItem("saeed_audio") !== "off";
  } catch (e) {
    return true;
  }
})();
function getACtx() {
  if (!_actx) _actx = new AudioCtx();
  return _actx;
}

/* ════════════════════════════════
   🎮 INTRO / START GAME
════════════════════════════════ */
function startGame() {
  playPixelSound("intro");
  const splash = document.getElementById("intro-splash");
  splash.classList.add("fade-out");
  setTimeout(() => {
    splash.style.display = "none";
  }, 650);
}

/* ════════════════════════════════
   🏆 FINISH GAME — FINAL LEVEL
════════════════════════════════ */
let gameFinished = false;
function finishGame() {
  // 1. Mark last mission complete
  markMissionComplete("elabd");
  // 2. Play victory fanfare
  playPixelSound("victory");
  // 3. Slide in the pixel side toast
  showPixelToast();
  // 4. Smooth scroll to contact after a short delay
  setTimeout(() => {
    const contact = document.getElementById("contact-sec");
    if (contact) contact.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 600);
}

function showPixelToast() {
  if (gameFinished) return;
  gameFinished = true;
  const toast = document.getElementById("pixel-toast");
  // slide in
  toast.classList.remove("slide-out");
  toast.classList.add("slide-in");
  // auto-dismiss after 4s
  setTimeout(() => {
    toast.classList.remove("slide-in");
    toast.classList.add("slide-out");
  }, 4200);
}

function playPixelSound(type) {
  if (!_audioEnabled) return;
  try {
    const ctx = getACtx();

    if (type === "select") {
      // Two ascending tones — classic menu confirm
      [0, 0.09].forEach((t, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "square";
        o.frequency.setValueAtTime(i === 0 ? 440 : 660, ctx.currentTime + t);
        g.gain.setValueAtTime(0.15, ctx.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.13);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(ctx.currentTime + t);
        o.stop(ctx.currentTime + t + 0.14);
      });
    } else if (type === "complete") {
      // Ascending fanfare — mission cleared!
      [262, 330, 392, 523, 784].forEach((freq, i) => {
        const t = i * 0.11;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "square";
        o.frequency.setValueAtTime(freq, ctx.currentTime + t);
        g.gain.setValueAtTime(0.13, ctx.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.13);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(ctx.currentTime + t);
        o.stop(ctx.currentTime + t + 0.15);
      });
    } else if (type === "nav") {
      // Soft descending whoosh — navigating
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(660, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.18);
      g.gain.setValueAtTime(0.1, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(ctx.currentTime);
      o.stop(ctx.currentTime + 0.22);
    } else if (type === "intro") {
      // Short, smooth 8-bit start jingle (classic startup sound)
      const melody = [
        [440.0, 0, 0.08], // A4
        [554.37, 0.08, 0.08], // C#5
        [659.25, 0.16, 0.08], // E5
        [880.0, 0.24, 0.35], // A5 (held longer)
      ];

      melody.forEach(([freq, t, dur]) => {
        const osc = ctx.createOscillator();
        const ng = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + t);

        ng.gain.setValueAtTime(0, ctx.currentTime + t);
        ng.gain.linearRampToValueAtTime(0.15, ctx.currentTime + t + 0.015);
        ng.gain.setValueAtTime(0.15, ctx.currentTime + t + dur - 0.015);
        ng.gain.linearRampToValueAtTime(0, ctx.currentTime + t + dur);

        osc.connect(ng);
        ng.connect(ctx.destination);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + dur);
      });
    } else if (type === "victory") {
      // 🏆 ALL MISSIONS COMPLETE — epic fanfare
      // Lead melody: classic victory chord progression
      const melody = [262, 330, 392, 330, 392, 523, 392, 523, 784, 784];
      melody.forEach((freq, i) => {
        const t = i * 0.13;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "square";
        o.frequency.setValueAtTime(freq, ctx.currentTime + t);
        g.gain.setValueAtTime(0.12, ctx.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.14);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(ctx.currentTime + t);
        o.stop(ctx.currentTime + t + 0.16);
      });
      // Harmony layer
      const harmony = [196, 247, 294, 247, 294, 392, 294, 392, 587];
      harmony.forEach((freq, i) => {
        const t = i * 0.13;
        const o = ctx.createOscillator();
        o.type = "triangle";
        o.frequency.setValueAtTime(freq, ctx.currentTime + t);
        const hg = ctx.createGain();
        hg.gain.setValueAtTime(0.07, ctx.currentTime + t);
        hg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.14);
        o.connect(hg);
        hg.connect(ctx.destination);
        o.start(ctx.currentTime + t);
        o.stop(ctx.currentTime + t + 0.16);
      });
    }
  } catch (e) {}
}

/* ════════════════════════════════
   ✅ MISSION COMPLETE SYSTEM
════════════════════════════════ */
const completedMissions = new Set();

const allNodes = document.querySelectorAll(".level-node");
const CARD_MAP = {
  zara: allNodes[0]?.querySelector(".level-card") || null,
  wabisabi: allNodes[1]?.querySelector(".level-card") || null,
  elabd: allNodes[2]?.querySelector(".level-card") || null,
};

function markMissionComplete(slug) {
  if (!slug || completedMissions.has(slug)) return;
  completedMissions.add(slug);
  playPixelSound("complete");

  const card = CARD_MAP[slug];
  if (!card) return;

  // Green border + glow
  card.classList.add("mission-complete");

  // Add badge if not already there
  if (!card.querySelector(".mission-complete-badge")) {
    const badge = document.createElement("div");
    badge.className = "mission-complete-badge";
    badge.textContent = "✓ MISSION COMPLETE";
    card.appendChild(badge);
  }

  // Update the level badge circle
  const levelNode = card.closest(".level-node");
  if (levelNode) {
    const lb = levelNode.querySelector(".level-badge");
    if (lb) {
      lb.style.cssText +=
        ";background:rgba(74,222,128,0.2);border-color:#4ade80;color:#4ade80;box-shadow:0 0 18px rgba(74,222,128,0.7);";
    }
  }

  // Update sidebar mission progress HUD
  updateMissionProgress();
}

function updateMissionProgress() {
  const total = 3;
  const cleared = completedMissions.size;
  const pct = Math.round((cleared / total) * 100);
  const fill = document.getElementById("mission-progress-fill");
  const pctEl = document.getElementById("mission-progress-pct");
  const label = document.getElementById("mission-progress-label");
  if (fill) fill.style.width = pct + "%";
  if (pctEl) {
    pctEl.textContent = pct + "%";
    if (cleared === total) pctEl.classList.add("progress-hud-complete");
  }
  if (label) label.textContent = cleared + " / " + total;
}

/* ════════════════════════════════
   🗺️ SMOOTH NAVIGATION
════════════════════════════════ */
const PROJECT_IDS = {
  zara: "project-zara",
  wabisabi: "project-wabisabi",
  elabd: "project-elabd",
};

function goToProject(targetSlug, fromSlug) {
  playPixelSound("nav");
  if (fromSlug) markMissionComplete(fromSlug);
  setTimeout(() => {
    const el = document.getElementById(PROJECT_IDS[targetSlug]);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);
}

function returnToMap(slug) {
  playPixelSound("nav");
  markMissionComplete(slug);
  setTimeout(() => {
    const map = document.getElementById("projects-sec");
    if (map) map.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);
}

// Sound on "VIEW FULL MISSION FILE" anchor buttons
document.querySelectorAll(".goto-project-btn").forEach((btn) => {
  btn.addEventListener("click", () => playPixelSound("select"));
});

/* ════════════════════════════════
   ❤️ PIXEL HEARTS — PASSIONS
════════════════════════════════ */
const HEART_FILLED = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="4" height="4" fill="#e83a3a"/>
  <rect x="10" y="2" width="4" height="4" fill="#e83a3a"/>
  <rect x="0" y="4" width="16" height="6" fill="#e83a3a"/>
  <rect x="2" y="10" width="12" height="2" fill="#e83a3a"/>
  <rect x="4" y="12" width="8" height="2" fill="#e83a3a"/>
  <rect x="6" y="14" width="4" height="2" fill="#e83a3a"/>
  <rect x="4" y="4" width="3" height="3" fill="#ff7070"/>
</svg>`;

const HEART_EMPTY = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="4" height="4" fill="rgba(255,255,255,0.12)"/>
  <rect x="10" y="2" width="4" height="4" fill="rgba(255,255,255,0.12)"/>
  <rect x="0" y="4" width="16" height="6" fill="rgba(255,255,255,0.12)"/>
  <rect x="2" y="10" width="12" height="2" fill="rgba(255,255,255,0.12)"/>
  <rect x="4" y="12" width="8" height="2" fill="rgba(255,255,255,0.12)"/>
  <rect x="6" y="14" width="4" height="2" fill="rgba(255,255,255,0.12)"/>
</svg>`;

const HEART_HALF = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="4" height="4" fill="#e83a3a"/>
  <rect x="0" y="4" width="8" height="6" fill="#e83a3a"/>
  <rect x="2" y="10" width="6" height="2" fill="#e83a3a"/>
  <rect x="4" y="12" width="4" height="2" fill="#e83a3a"/>
  <rect x="6" y="14" width="2" height="2" fill="#e83a3a"/>
  <rect x="4" y="4" width="2" height="2" fill="#ff7070"/>
  <rect x="10" y="2" width="4" height="4" fill="rgba(255,255,255,0.12)"/>
  <rect x="8" y="4" width="8" height="6" fill="rgba(255,255,255,0.12)"/>
  <rect x="8" y="10" width="6" height="2" fill="rgba(255,255,255,0.12)"/>
  <rect x="8" y="12" width="4" height="2" fill="rgba(255,255,255,0.12)"/>
</svg>`;

function renderHearts(hearts, max) {
  let html = "";
  const full = Math.floor(hearts);
  const hasHalf = hearts % 1 >= 0.5;
  const empty = max - full - (hasHalf ? 1 : 0);
  for (let i = 0; i < full; i++) html += HEART_FILLED;
  if (hasHalf) html += HEART_HALF;
  for (let i = 0; i < empty; i++) html += HEART_EMPTY;
  return `<div class="passion-hearts">${html}</div>`;
}

const PASSIONS = [
  { name: "Fast Learner", hearts: 5, max: 5 },
  { name: "Creative", hearts: 4, max: 5 },
  { name: "Social", hearts: 3.5, max: 5 },
  { name: "Spatial Vision", hearts: 5, max: 5 },
  { name: "Hustle", hearts: 5, max: 5 },
  { name: "AI-Forward", hearts: 5, max: 5 },
];

const passionsEl = document.getElementById("preview-passions");
if (passionsEl) {
  passionsEl.innerHTML = PASSIONS.map(
    (p) => `
    <div class="passion-item">
      <span class="passion-name">${p.name}</span>
      ${renderHearts(p.hearts, p.max)}
    </div>`,
  ).join("");
}

/* ════════════════════════════════
   ✨ PIXEL CANVAS BACKGROUND
════════════════════════════════ */
(function () {
  const canvas = document.getElementById("pixel-canvas");
  const ctx = canvas.getContext("2d");
  let W,
    H,
    P = [];
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function spawn(n) {
    P = [];
    for (let i = 0; i < n; i++)
      P.push({
        x: Math.random() * W,
        y: Math.random() * H,
        s: Math.random() < 0.5 ? 2 : 4,
        o: Math.random() * 0.4 + 0.1,
        v: Math.random() * 0.3 + 0.1,
        c: ["#9566f0", "#6845b0", "#f4c842", "#b08af5"][
          Math.floor(Math.random() * 4)
        ],
      });
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    P.forEach((p) => {
      ctx.globalAlpha = p.o;
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x, p.y, p.s, p.s);
      p.y -= p.v;
      if (p.y < 0) {
        p.y = H;
        p.x = Math.random() * W;
      }
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener("resize", () => {
    resize();
    spawn(100);
  });
  resize();
  spawn(100);
  draw();
})();

/* ════════════════════════════════
   🎮 DETERMINISTIC SCORE & COINS SYSTEM
════════════════════════════════ */
let currentScore = 0;
const scoreValEl = document.getElementById("score-val");

function updateScoreDisplay() {
  if (!scoreValEl) return;
  scoreValEl.textContent = "+" + String(Math.floor(currentScore)).padStart(5, "0");
}

function addCoins(amount, sourceEl) {
  currentScore += amount;
  updateScoreDisplay();

  // Floating "+500 COINS" indicator
  const popup = document.createElement("div");
  popup.className = "coin-popup";
  popup.textContent = `+${amount} COINS!`;
  
  if (sourceEl && typeof sourceEl.getBoundingClientRect === "function") {
    const rect = sourceEl.getBoundingClientRect();
    popup.style.left = `${rect.left + rect.width / 2}px`;
    popup.style.top = `${rect.top - 10}px`;
  } else if (scoreValEl) {
    const rect = scoreValEl.getBoundingClientRect();
    popup.style.left = `${rect.left}px`;
    popup.style.top = `${rect.bottom + 5}px`;
  }
  
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 900);
}

// Initial display setup
updateScoreDisplay();


/* ════════════════════════════════
   💬 RPG TYPEWRITER
════════════════════════════════ */
function typewriter(elId, text, speed, sectionEl) {
  const el = document.getElementById(elId);
  if (!el || !sectionEl) return;
  let i = 0,
    started = false;
  const cursor = document.createElement("span");
  cursor.className = "dialogue-cursor";
  el.appendChild(cursor);
  function type() {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i++]), cursor);
      setTimeout(type, speed);
    }
  }
  const obs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        type();
        obs.disconnect();
      }
    },
    { threshold: 0.3 },
  );
  obs.observe(sectionEl);
}

typewriter(
  "about-text",
  "I am a design student focused on building work that communicates clearly and feels worth using. I care about direction, atmosphere, and whether an idea genuinely serves the person receiving it.",
  26,
  document.getElementById("about-sec"),
);

typewriter(
  "philosophy-text",
  "Anything I make has to be useful to the person receiving it, come from real conviction, and deliver its purpose without pretending.",
  30,
  document.getElementById("philosophy-sec"),
);

/* ════════════════════════════════
   🎛️ AUDIO TOGGLE
════════════════════════════════ */
const audioBtn = document.getElementById("audio-toggle");
function setAudio(enabled) {
  _audioEnabled = enabled;
  try {
    localStorage.setItem("saeed_audio", enabled ? "on" : "off");
  } catch (e) {}
  if (audioBtn) {
    audioBtn.setAttribute("aria-pressed", String(enabled));
    audioBtn.textContent = enabled ? "🔊 SFX" : "🔇 MUTE";
  }
  if (enabled) playPixelSound("select");
}
if (audioBtn) {
  setAudio(_audioEnabled); // sync UI with persisted state
  audioBtn.addEventListener("click", () => setAudio(!_audioEnabled));
}

/* ════════════════════════════════
   🎮 KONAMI CODE EASTER EGG
════════════════════════════════ */
const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
let konamiIdx = 0;
let cheatMode = false;

function showKonamiToast() {
  const t = document.getElementById("konami-toast");
  if (!t) return;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3500);
}

function activateCheatMode() {
  cheatMode = true;
  Object.keys(CARD_MAP).forEach((slug) => markMissionComplete(slug));
  const mpVal = document.querySelector(".stat-row:nth-child(3) .stat-val");
  if (mpVal) mpVal.innerHTML = '<svg class="pixel-inf-svg" viewBox="0 0 16 8" aria-hidden="true"><path d="M2,0 h4 v2 h-4 z M10,0 h4 v2 h-4 z M0,2 h2 v4 h-2 z M14,2 h2 v4 h-2 z M2,6 h4 v2 h-4 z M10,6 h4 v2 h-4 z M6,2 h4 v4 h-4 z" fill="var(--gold)" shape-rendering="crispEdges"/></svg>';
  showKonamiToast();
  playPixelSound("victory");
}

window.addEventListener("keydown", (e) => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (key === KONAMI[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI.length) {
      konamiIdx = 0;
      if (!cheatMode) activateCheatMode();
    }
  } else {
    konamiIdx = key === KONAMI[0] ? 1 : 0;
  }
});

/* ════════════════════════════════
   🔍 CERTIFICATE LIGHTBOX
════════════════════════════════ */
const CERT_DATA = {
  cucina: {
    webp: "./assets/cert-cucina.webp",
    jpg: "./assets/cert-cucina.jpg",
    name: "Cucina Factory Training",
    detail: "Furniture & Kitchen Manufacturing — May 2026",
  },
  knauf: {
    webp: "./assets/cert-knauf.webp",
    jpg: "./assets/cert-knauf.jpg",
    name: "Knauf Training Center",
    detail: "Ceilings, Partitions & Wall Systems — Sep 2025",
  },
  iti1: {
    webp: "./assets/cert-iti-1.webp",
    jpg: "./assets/cert-iti-1.jpg",
    name: "ITI — 3D Modeling for Interior Design",
    detail: "60 Hours Intensive Course — Aug 2025",
  },
  iti2: {
    webp: "./assets/cert-iti-2.webp",
    jpg: "./assets/cert-iti-2.jpg",
    name: "ITI — Advanced Training",
    detail: "Information Technology Institute",
  },
};

function openLightbox(slug) {
  const data = CERT_DATA[slug];
  if (!data) return;
  const overlay = document.getElementById("lightbox-overlay");
  const media = document.getElementById("lightbox-media");
  const cap = document.getElementById("lightbox-caption");
  if (!overlay || !media || !cap) return;
  media.innerHTML = `<picture><source srcset="${data.webp}" type="image/webp"><img src="${data.jpg}" alt="${data.name}" /></picture>`;
  cap.textContent = data.name + " — " + data.detail;
  overlay.classList.add("active");
  overlay.focus();
  document.body.style.overflow = "hidden";
  playPixelSound("select");
}

function closeLightbox() {
  const overlay = document.getElementById("lightbox-overlay");
  if (!overlay) return;
  overlay.classList.remove("active");
  document.getElementById("lightbox-media").innerHTML = "";
  document.body.style.overflow = "";
  playPixelSound("nav");
}

// Wire up cert cards
document.querySelectorAll(".cert-card[data-cert]").forEach((card) => {
  const slug = card.dataset.cert;
  card.addEventListener("click", () => openLightbox(slug));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLightbox(slug);
    }
  });
});

// Close lightbox on overlay click or Escape
const lightboxOverlay = document.getElementById("lightbox-overlay");
if (lightboxOverlay) {
  lightboxOverlay.addEventListener("click", closeLightbox);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightboxOverlay.classList.contains("active"))
      closeLightbox();
  });
}

/* ════════════════════════════════
   ✨ SCROLL REVEAL — smooth fade-up
════════════════════════════════ */
(function () {
  if (!("IntersectionObserver" in window)) return;
  // Respect reduced-motion: just show everything
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    document
      .querySelectorAll(".reveal, .reveal-stagger")
      .forEach((el) => el.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
  );
  document
    .querySelectorAll(".reveal, .reveal-stagger")
    .forEach((el) => io.observe(el));
})();

/* ════════════════════════════════
   🌌 SUBTLE PARALLAX — panels + sidebar
════════════════════════════════ */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const targets = [
    ...document.querySelectorAll(".profile-hud"),
    ...document.querySelectorAll(".tools-hud"),
    ...document.querySelectorAll(".hero-panel"),
  ];
  if (targets.length === 0) return;

  let ticking = false;
  function update() {
    ticking = false;
    const vh = window.innerHeight;
    targets.forEach((el) => {
      const r = el.getBoundingClientRect();
      // how far through the viewport the element is (-1 to 1, 0 = centered)
      const center = r.top + r.height / 2 - vh / 2;
      const t = Math.max(-1, Math.min(1, center / vh));
      // gentle offset (max ±4px)
      el.style.transform = `translateY(${(-t * 4).toFixed(2)}px)`;
    });
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
  update();
})();


/* ════════════════════════════════
   🌐 FORMAL LANGUAGE
════════════════════════════════ */
const FORMAL_COPY = {
  en: {
    "brand.name": "Ahmed Saeed",
    "brand.role": "Formal portfolio for internships and creative work",
    "nav.profile": "Profile",
    "nav.projects": "Projects",
    "nav.strengths": "Strengths",
    "nav.training": "Training",
    "nav.contact": "Contact",
    "actions.play": "Play Mode",
    "hero.eyebrow": "Formal portfolio / design student",
    "hero.name": "Ahmed Saeed",
    "hero.title":
      "A calm, <span class=\"hl-red\">professional portfolio</span> built for real opportunities.",
    "hero.copy":
      "Third-year design student at Innovation University, focused on <span class=\"hl-red\">brand identity</span>, <span class=\"hl-red\">interior spaces</span>, and <span class=\"hl-red\">spatial experience</span> projects with a clear visual direction.",
    "hero.cta.primary": "View selected work",
    "hero.cta.secondary": "Get in touch",
    "hero.kicker.1.label": "Focus",
    "hero.kicker.1.value": "Brand, interior, and spatial design",
    "hero.kicker.2.label": "Status",
    "hero.kicker.2.value": "Open to internships and selective freelance briefs",
    "hero.kicker.3.label": "Base",
    "hero.kicker.3.value": "Egypt / Innovation University",
    "hero.badge": "Available now",
    "hero.aside.title": "Creative discipline with presentation clarity.",
    "hero.aside.copy":
      "A structured overview presenting selected design work, core competencies, and technical background for professional review.",
    "hero.fact.1.label": "University",
    "hero.fact.1.value": "Innovation University",
    "hero.fact.2.label": "Current year",
    "hero.fact.2.value": "Year 03",
    "hero.fact.3.label": "Languages",
    "hero.fact.3.value": "Arabic / English",
    "profile.eyebrow": "Profile / point of view",
    "profile.title":
      "A young designer building work that feels <span class=\"hl-red\">intentional</span>, <span class=\"hl-red\">useful</span>, and well presented.",
    "profile.intro":
      "The goal of this portfolio is simple: demonstrate range, discipline, and clear design methodology across brand, interior, and spatial work.",
    "profile.panel.1.title": "How I work",
    "profile.panel.1.p1":
      "I value design that communicates efficiently with strong hierarchy, atmosphere, and fidelity to the underlying concept.",
    "profile.panel.1.p2":
      "My work bridges brand identity, interior design, and spatial experience, allowing me to build cohesive systems across 2D graphics and physical environments.",
    "profile.panel.1.p3":
      "I continuously refine presentation standards, 3D modeling accuracy, and execution precision.",
    "profile.quote.copy":
      "I aim for work that is composed, memorable, and clear enough to be understood directly.",
    "profile.quote.sign": "Ahmed Saeed / design approach",
    "projects.eyebrow": "Selected work",
    "projects.title":
      "Three projects that show <span class=\"hl-red\">visual range</span>, <span class=\"hl-red\">spatial thinking</span>, and <span class=\"hl-red\">presentation control</span>.",
    "projects.intro":
      "Each project details the core concept, role, and practical design thinking behind the final presentation.",
    "project.meta.role": "Role",
    "project.meta.focus": "Focus",
    "project.1.tag": "Brand identity / 2026",
    "project.1.title": "Zara Menswear Rebrand",
    "project.1.summary":
      "A retail identity rebrand focused on bold visual presence, refined positioning, and modern menswear character.",
    "project.1.role": "Brand direction and visual identity",
    "project.1.focus": "Positioning, logo system, retail presence",
    "project.2.tag": "Interior design / 2026",
    "project.2.title": "Wabi-Sabi Style Kitchen",
    "project.2.summary":
      "An interior concept balancing natural materials, calm textures, and minimal spatial atmosphere.",
    "project.2.role": "Concept design and spatial mood",
    "project.2.focus": "Material selection, tone, lived feeling",
    "project.3.tag": "Spatial experience / 2026",
    "project.3.title": "El Abd Booth Concept",
    "project.3.summary":
      "A 360° exhibition booth concept designed for optimal visitor flow and branded spatial experience.",
    "project.3.role": "Creative direction and concept development",
    "project.3.focus": "Visitor journey, brand moments, 360 presentation",
    "strengths.eyebrow": "Strengths / workflow",
    "strengths.title":
      "The value I bring is a mix of <span class=\"hl-red\">visual sensitivity</span>, <span class=\"hl-red\">spatial awareness</span>, and <span class=\"hl-red\">fast adaptation</span>.",
    "strengths.intro":
      "Core principles guiding the execution from initial concept to technical presentation.",
    "strength.1.title": "Visual systems",
    "strength.1.copy":
      "Building coherent direction through typography, proportion, material references, and structured visual hierarchy.",
    "strength.2.title": "Spatial thinking",
    "strength.2.copy":
      "Designing for human movement, perspective, and real-world experience across interior layouts and exhibition stands.",
    "strength.3.title": "Learning speed",
    "strength.3.copy":
      "Rapid tool acquisition paired with a focus on technical polish and high presentation standards.",
    "training.eyebrow": "Training / exposure",
    "training.title":
      "Hands-on training connecting <span class=\"hl-red\">design thinking</span> with real production and technical workflow.",
    "training.intro":
      "Practical experience gained through factory internships and technical certification programs.",
    "training.1.date": "May 2026",
    "training.1.title": "Cucina Factory Training",
    "training.1.org": "Furniture & Kitchen Manufacturing",
    "training.1.desc":
      "Direct exposure to materials, fabrication logic, assembly workflows, and manufacturing execution.",
    "training.2.date": "Sep 2025",
    "training.2.title": "Knauf Training Center",
    "training.2.org": "Ceilings, partitions, and wall systems",
    "training.2.desc":
      "Technical training on interior drywall assemblies, partition systems, and ceiling construction.",
    "training.3.date": "Aug 2025",
    "training.3.title": "ITI / 3D Modeling for Interior Design",
    "training.3.org": "Information Technology Institute / 60 hours",
    "training.3.desc":
      "Intensive technical training in interior 3D modeling, spatial rendering, and presentation workflows.",
    "training.4.date": "Aug 2025",
    "training.4.title": "ITI / Advanced Training",
    "training.4.org": "Information Technology Institute",
    "training.4.desc":
      "Advanced technical module focused on digital modeling precision and presentation polish.",
    "contact.eyebrow": "Contact / next step",
    "contact.title":
      "Open to <span class=\"hl-red\">internships</span>, <span class=\"hl-red\">collaborations</span>, and opportunities that value craft.",
    "contact.intro":
      "Direct channels to get in touch regarding professional opportunities and collaboration.",
    "contact.card.1.label": "Instagram",
    "contact.card.1.value": "@ahmed_saeed2_0",
    "contact.card.1.note": "Visual work updates and direct messaging.",
    "contact.card.2.label": "Behance",
    "contact.card.2.value": "ahmedsaeed375",
    "contact.card.2.note": "Full project presentations and design documentation.",
    "contact.card.3.label": "LinkedIn",
    "contact.card.3.value": "ahmed-saeed-682673338",
    "contact.card.3.note": "Professional profile and internship inquiries.",
    "contact.cta":
      "Available for internships, freelance briefs, and portfolio inquiries through any preferred channel.",
    "footer.name": "Ahmed Saeed",
    "footer.tag": "Formal portfolio mode",
    "footer.copy":
      "Professional design portfolio.",
  },
  ar: {
    "brand.name": "أحمد سعيد",
    "brand.role": "معرض الأعمال الرسمي / تصميم داخلي وهوية بصرية",
    "nav.profile": "الملف",
    "nav.projects": "المشاريع",
    "nav.strengths": "نقاط القوة",
    "nav.training": "التدريب",
    "nav.contact": "التواصل",
    "actions.play": "وضع اللعب",
    "hero.eyebrow": "معرض رسمي / طالب تصميم",
    "hero.name": "أحمد سعيد",
    "hero.title":
      "معرض أعمال مهني يركز على <span class=\"hl-red\">جودة الفكرة</span> و<span class=\"hl-red\">الدقة التنفيذية</span>.",
    "hero.copy":
      "طالب تصميم بالسنة الثالثة بجامعة Innovation University، متخصص في <span class=\"hl-red\">الهوية البصرية</span>، <span class=\"hl-red\">التصميم الداخلي</span>، و<span class=\"hl-red\">التجارب المكانية</span>.",
    "hero.cta.primary": "مشاهدة الأعمال المختارة",
    "hero.cta.secondary": "التواصل المباشر",
    "hero.kicker.1.label": "التخصص",
    "hero.kicker.1.value": "هوية بصرية، تصميم داخلي، وتجارب مكانية",
    "hero.kicker.2.label": "الحالة",
    "hero.kicker.2.value": "متاح لفرص التدريب والتعاون الإبداعي",
    "hero.kicker.3.label": "الموقع",
    "hero.kicker.3.value": "مصر / Innovation University",
    "hero.badge": "متاح الآن",
    "hero.aside.title": "انضباط بصري ووضوح في العرض.",
    "hero.aside.copy":
      "استعراض منظم للمشاريع المختارة والمهارات الفنية بخطوط واضحة وتفاصيل مباشرة.",
    "hero.fact.1.label": "الجامعة",
    "hero.fact.1.value": "Innovation University",
    "hero.fact.2.label": "السنة الدراسية",
    "hero.fact.2.value": "السنة الثالثة",
    "hero.fact.3.label": "اللغات",
    "hero.fact.3.value": "العربية / الإنجليزية",
    "profile.eyebrow": "الملف المهني / منهجية العمل",
    "profile.title":
      "مصمم يهدف إلى تقديم أعمال تتسم بـ <span class=\"hl-red\">التوازن</span>، <span class=\"hl-red\">الفاعلية</span>، و<span class=\"hl-red\">الدقة الفنية</span>.",
    "profile.intro":
      "تقديم رؤية شمولية واضحة لطريقة التفكير والتطبيق عبر مجالات التصميم المختلفة.",
    "profile.panel.1.title": "منهجية العمل",
    "profile.panel.1.p1":
      "الاهتمام بالتصميم الذي يوصل الفكرة بكفاءة عالية مع الامتثال للهيراركي والتوازن العام وصحة المفهوم.",
    "profile.panel.1.p2":
      "الربط بين الهوية البصرية والتصميم الداخلي والتجارب المكانية لبناء أنظمة متكاملة في المساحات الثنائية والثلاثية الأبعاد.",
    "profile.panel.1.p3":
      "التطوير المستمر لجودة العرض الفني، وكفاءة النمذجة ثلاثية الأبعاد، والارتقاء بالتفاصيل التنفيذية.",
    "profile.quote.copy":
      "الهدف هو تقديم أعمال متماسكة وواضحة تعبر عن الفكرة بقوة وتترك انطباعا مهنيا ثابتا.",
    "profile.quote.sign": "أحمد سعيد / منهجية التصميم",
    "projects.eyebrow": "أعمال مختارة",
    "projects.title":
      "ثلاثة مشاريع تعكس <span class=\"hl-red\">التنوع البصري</span>، <span class=\"hl-red\">التفكير المكاني</span>، و<span class=\"hl-red\">جودة العرض</span>.",
    "projects.intro":
      "استعراض مباشر للمفهوم، الدور التنفيذي، والتفكير التصميمي لكل مشروع.",
    "project.meta.role": "الدور",
    "project.meta.focus": "التركيز",
    "project.1.tag": "هوية بصرية / 2026",
    "project.1.title": "إعادة هوية Zara Menswear",
    "project.1.summary":
      "مشروع تطوير هوية بصرية لعلامة تجارية رجالية يركز على الحضور البصري القوي والتموضع الحديث.",
    "project.1.role": "التوجيه البصري وتصميم الهوية",
    "project.1.focus": "التموضع، نظام الشعار، حضور المتجر",
    "project.2.tag": "تصميم داخلي / 2026",
    "project.2.title": "مطبخ بطابع Wabi-Sabi",
    "project.2.summary":
      "تصميم داخلي قائم على التوازن بين الخامات الطبيعية، الملمس الهادئ، والمود المكاني البسيط.",
    "project.2.role": "تصميم المفهوم والمود المكاني",
    "project.2.focus": "اختيار الخامات، التوازن البصري، الإحساس المعيشي",
    "project.3.tag": "تجربة مكانية / 2026",
    "project.3.title": "جناح عرض El Abd",
    "project.3.summary":
      "مفهوم تفاعلي لجناح عرض 360 درجة يركز على حركة الزائر والتجربة المكانية للعلامة التجارية.",
    "project.3.role": "التوجيه الإبداعي وتطوير الفكرة",
    "project.3.focus": "رحلة الزائر، نقاط التفاعل، عرض 360",
    "strengths.eyebrow": "نقاط القوة / أسلوب العمل",
    "strengths.title":
      "مزيج من <span class=\"hl-red\">الوعي البصري</span>، <span class=\"hl-red\">التفكير المكاني</span>، و<span class=\"hl-red\">سرعة التكيف</span>.",
    "strengths.intro":
      "المرتكزات الأساسية التي أعتمد عليها في تحويل المفاهيم إلى مشاريع واقعية.",
    "strength.1.title": "الأنظمة البصرية",
    "strength.1.copy":
      "بناء اتجاه بصري متماسك يعتمد على التناسب، اختيار الخامات، والتدرج الهرمي الواضح.",
    "strength.2.title": "التفكير المكاني",
    "strength.2.copy":
      "التركيز على حركة الزائر، المنظور، والتجربة الميدانية الحقيقية داخل المساحات.",
    "strength.3.title": "الاستيعاب والتطوير",
    "strength.3.copy":
      "سرعة استيعاب أدوات العمل التقنية والتزام أعلى معايير الجودة والإخراج.",
    "training.eyebrow": "التدريب والخبرة العملية",
    "training.title":
      "تدريب عملي يربط <span class=\"hl-red\">التفكير التصميمي</span> بالإنتاج الحقيقي والـworkflow التقني.",
    "training.intro":
      "خبرات ميدانية وبرامج تخصصية تربط التصميم بأساليب التنفيذ والإنتاج.",
    "training.1.date": "مايو 2026",
    "training.1.title": "تدريب مصنع Cucina",
    "training.1.org": "تصنيع الأثاث والمطابخ",
    "training.1.desc":
      "معايشة عملية لخطوط التصنيع، ومنطق التنفيذ، وخطوات تحويل المخططات إلى منتجات واقعية.",
    "training.2.date": "سبتمبر 2025",
    "training.2.title": "مركز تدريب Knauf",
    "training.2.org": "الأسقف والقواطيع وأنظمة الحوائط",
    "training.2.desc":
      "تدريب تقني على أنظمة الأسقف المعلقة والقواطيع الجدارية وفق المعايير القياسية.",
    "training.3.date": "أغسطس 2025",
    "training.3.title": "ITI / النمذجة ثلاثية الأبعاد للتصميم الداخلي",
    "training.3.org": "معهد تكنولوجيا المعلومات / 60 ساعة",
    "training.3.desc":
      "تدريب متقدم على طرق النمذجة ثلاثية الأبعاد والإخراج التقني للتصميم الداخلي.",
    "training.4.date": "أغسطس 2025",
    "training.4.title": "ITI / التدريب المتقدم",
    "training.4.org": "معهد تكنولوجيا المعلومات",
    "training.4.desc":
      "مرحلة تقدمية تناولت دقة النمذجة الرقمية وتقنيات العرض الفني.",
    "contact.eyebrow": "التواصل / الخطوة القادمة",
    "contact.title":
      "متاح لـ <span class=\"hl-red\">فرص التدريب</span>، التعاون الإبداعي، والفرص التي تقيّم الحرفة.",
    "contact.intro":
      "للتواصل المباشر بشأن فرص التدريب أو التعاون الإبداعي.",
    "contact.card.1.label": "إنستجرام",
    "contact.card.1.value": "@ahmed_saeed2_0",
    "contact.card.1.note": "التحديثات البصرية والرسائل المباشرة.",
    "contact.card.2.label": "بيهانس",
    "contact.card.2.value": "ahmedsaeed375",
    "contact.card.2.note": "أرشيف المشاريع الكاملة والتوثيق البصري.",
    "contact.card.3.label": "لينكد إن",
    "contact.card.3.value": "ahmed-saeed-682673338",
    "contact.card.3.note": "الملف المهني ومحادثات فرص التدريب.",
    "contact.cta":
      "متاح لفرص التدريب ومراجعة الأعمال عبر أي من قنوات التواصل.",
    "footer.name": "أحمد سعيد",
    "footer.tag": "معرض الأعمال الرسمي",
    "footer.copy":
      "المعرض الرسمي للمصمم أحمد سعيد.",
  },
};

const formalContent = document.getElementById("formal-content");
const formalTopbar = document.getElementById("formal-topbar");
const formalLangEnBtn = document.getElementById("formal-lang-en");
const formalLangArBtn = document.getElementById("formal-lang-ar");

function applyFormalLanguage(lang) {
  const nextLang = FORMAL_COPY[lang] ? lang : "en";
  const bundle = FORMAL_COPY[nextLang];
  document.body.setAttribute("data-formal-lang", nextLang);
  if (formalContent) {
    formalContent.lang = nextLang === "ar" ? "ar" : "en";
    formalContent.dir = nextLang === "ar" ? "rtl" : "ltr";
  }
  if (formalTopbar) {
    formalTopbar.lang = nextLang === "ar" ? "ar" : "en";
    formalTopbar.dir = nextLang === "ar" ? "rtl" : "ltr";
  }
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (bundle[key]) el.innerHTML = bundle[key];
  });
  if (formalLangEnBtn)
    formalLangEnBtn.setAttribute("aria-pressed", String(nextLang === "en"));
  if (formalLangArBtn)
    formalLangArBtn.setAttribute("aria-pressed", String(nextLang === "ar"));
  try {
    localStorage.setItem("saeed_formal_lang", nextLang);
  } catch (e) {}
}

(function initFormalLanguage() {
  let lang = "en";
  try {
    lang = localStorage.getItem("saeed_formal_lang") || "en";
  } catch (e) {}
  applyFormalLanguage(lang);
})();

if (formalLangEnBtn)
  formalLangEnBtn.addEventListener("click", () => applyFormalLanguage("en"));
if (formalLangArBtn)
  formalLangArBtn.addEventListener("click", () => applyFormalLanguage("ar"));

/* ════════════════════════════════
   🎭 MODE ROUTER — Pixel Play ↔ Formal Pro
════════════════════════════════ */
const MODE_FORMAL = "formal";
const MODE_PLAY = "play";
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
const transitionCanvas = document.getElementById("transition-canvas");
const transitionLayer = document.getElementById("mode-transition");
const tctx = transitionCanvas ? transitionCanvas.getContext("2d") : null;
const playTopbar = document.getElementById("play-topbar");
let modeTransitionFrame = null;
let isTransitioning = false;

function resizeTransitionCanvas() {
  if (!transitionCanvas || !tctx) return;
  const dpr = window.devicePixelRatio || 1;
  transitionCanvas.width = Math.round(window.innerWidth * dpr);
  transitionCanvas.height = Math.round(window.innerHeight * dpr);
  transitionCanvas.style.width = window.innerWidth + "px";
  transitionCanvas.style.height = window.innerHeight + "px";
  tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
if (transitionCanvas) {
  resizeTransitionCanvas();
  window.addEventListener("resize", resizeTransitionCanvas);
}

function playModeTransformSound(toFormal) {
  if (!_audioEnabled) return;
  try {
    const ctx = getACtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const filt1 = ctx.createBiquadFilter();
    const gain1 = ctx.createGain();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(toFormal ? 82 : 56, now);
    osc1.frequency.exponentialRampToValueAtTime(
      toFormal ? 205 : 125,
      now + 0.52,
    );
    filt1.type = "lowpass";
    filt1.frequency.setValueAtTime(260, now);
    filt1.frequency.exponentialRampToValueAtTime(2200, now + 0.46);
    filt1.Q.value = 10;
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.16, now + 0.05);
    gain1.gain.linearRampToValueAtTime(0.001, now + 0.82);
    osc1.connect(filt1);
    filt1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.85);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(toFormal ? 760 : 620, now);
    osc2.frequency.exponentialRampToValueAtTime(
      toFormal ? 1400 : 1100,
      now + 0.36,
    );
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.07, now + 0.08);
    gain2.gain.linearRampToValueAtTime(0.001, now + 0.68);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.72);
  } catch (e) {}
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getModeFromUrl() {
  const hash = (window.location.hash || "").toLowerCase();
  if (hash.startsWith("#formal")) return MODE_FORMAL;
  return MODE_PLAY;
}

function setMode(mode, options = {}) {
  const { skipScroll = false, pushState = true } = options;
  document.body.setAttribute("data-mode", mode);
  if (pushState) {
    const nextHash = mode === MODE_FORMAL ? "#formal" : "#play";
    if (window.location.hash !== nextHash) {
      history.pushState({ mode }, "", nextHash);
    }
  }
  if (formalTopbar) formalTopbar.hidden = mode !== MODE_FORMAL;
  if (playTopbar) playTopbar.hidden = mode !== MODE_PLAY;
  const splash = document.getElementById("intro-splash");
  if (mode === MODE_FORMAL && splash) splash.style.display = "none";
  if (!skipScroll) window.scrollTo({ top: 0, behavior: "smooth" });
}

function getTransitionOrigin(triggerEl) {
  if (triggerEl && typeof triggerEl.getBoundingClientRect === "function") {
    const rect = triggerEl.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }
  return { x: window.innerWidth / 2, y: 72 };
}

function createTransitionField(origin, toMode) {
  const palette =
    toMode === MODE_FORMAL
      ? ["#05040b", "#1a1230", "#5d4a88", "#b89337", "#f9f2e6"]
      : ["#05040b", "#170f29", "#6845b0", "#9566f0", "#4ade80"];
  const count = 22;
  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const radius =
      Math.max(window.innerWidth, window.innerHeight) *
      (0.62 + Math.random() * 0.38);
    particles.push({
      angle,
      radius,
      orb: 18 + Math.random() * 42,
      line: 3 + Math.random() * 8,
      color: palette[i % palette.length],
      swing: 25 + Math.random() * 95,
      delay: Math.random() * 0.18,
    });
  }
  return { origin, particles, palette, toMode };
}

function renderTransitionField(ctx, state, progress) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  ctx.clearRect(0, 0, width, height);

  const cover =
    progress < 0.56
      ? easeOutCubic(progress / 0.56)
      : 1 - easeOutCubic((progress - 0.56) / 0.44);
  const veilAlpha = Math.max(0, Math.min(0.96, cover * 0.96));
  ctx.fillStyle = `rgba(4, 4, 10, ${veilAlpha})`;
  ctx.fillRect(0, 0, width, height);

  const halo = ctx.createRadialGradient(
    state.origin.x,
    state.origin.y,
    0,
    state.origin.x,
    state.origin.y,
    Math.max(width, height) * 0.7,
  );
  halo.addColorStop(
    0,
    progress < 0.56 ? "rgba(255,255,255,0.24)" : "rgba(255,255,255,0.12)",
  );
  halo.addColorStop(
    0.2,
    state.toMode === MODE_FORMAL
      ? "rgba(184,147,55,0.16)"
      : "rgba(149,102,240,0.18)",
  );
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);

  state.particles.forEach((particle, index) => {
    const local = Math.max(
      0,
      Math.min(1, (progress - particle.delay) / (1 - particle.delay)),
    );
    const reach =
      progress < 0.56
        ? easeOutCubic(Math.min(1, local / 0.56))
        : 1 - easeInOutCubic(Math.min(1, (progress - 0.56) / 0.44));
    const swing =
      Math.sin(progress * Math.PI * 3 + index) *
      particle.swing *
      (progress < 0.56 ? 1 : 0.35);
    const x =
      state.origin.x +
      Math.cos(particle.angle) * particle.radius * reach +
      Math.cos(particle.angle + Math.PI / 2) * swing * 0.18;
    const y =
      state.origin.y +
      Math.sin(particle.angle) * particle.radius * reach +
      Math.sin(particle.angle + Math.PI / 2) * swing * 0.18;

    ctx.save();
    ctx.strokeStyle = particle.color;
    ctx.lineWidth = particle.line * (progress < 0.56 ? 1.2 : 0.7);
    ctx.globalAlpha = 0.55 * cover;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(state.origin.x, state.origin.y);
    ctx.quadraticCurveTo(
      state.origin.x + Math.cos(particle.angle + 0.8) * particle.radius * 0.32,
      state.origin.y + Math.sin(particle.angle + 0.8) * particle.radius * 0.32,
      x,
      y,
    );
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = 0.95 * cover;
    ctx.beginPath();
    ctx.arc(x, y, particle.orb * (0.35 + reach * 0.9), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  ctx.save();
  ctx.fillStyle =
    state.toMode === MODE_FORMAL
      ? "rgba(255, 247, 234, 0.92)"
      : "rgba(212, 191, 255, 0.92)";
  ctx.globalAlpha = cover;
  ctx.beginPath();
  ctx.arc(
    state.origin.x,
    state.origin.y,
    18 + Math.max(width, height) * 0.075 * cover,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.restore();
}

function cleanupTransition() {
  if (modeTransitionFrame) {
    cancelAnimationFrame(modeTransitionFrame);
    modeTransitionFrame = null;
  }
  if (transitionLayer) transitionLayer.classList.remove("active");
  if (tctx) tctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  isTransitioning = false;
}

function runModeTransition(toMode, triggerEl) {
  if (isTransitioning) return;
  const currentMode = document.body.getAttribute("data-mode") || MODE_PLAY;
  if (currentMode === toMode) return;

  if (prefersReducedMotion.matches || !tctx || !transitionLayer) {
    setMode(toMode);
    return;
  }

  isTransitioning = true;
  setTimeout(() => {
    if (isTransitioning) cleanupTransition();
  }, 1300);
  playModeTransformSound(toMode === MODE_FORMAL);
  const field = createTransitionField(getTransitionOrigin(triggerEl), toMode);
  const startedAt = performance.now();
  const duration = 1180;
  let swapped = false;

  transitionLayer.classList.add("active");

  function step(now) {
    const elapsed = now - startedAt;
    const progress = Math.min(1, elapsed / duration);
    renderTransitionField(tctx, field, progress);

    if (!swapped && progress >= 0.46) {
      swapped = true;
      setMode(toMode, { skipScroll: true });
    }

    if (progress < 1) {
      modeTransitionFrame = requestAnimationFrame(step);
      return;
    }

    cleanupTransition();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  modeTransitionFrame = requestAnimationFrame(step);
}

function switchMode(toMode, triggerEl) {
  const currentMode = document.body.getAttribute("data-mode") || MODE_PLAY;
  if (currentMode === toMode) return;
  runModeTransition(toMode, triggerEl);
}

(function initMode() {
  const mode = getModeFromUrl();
  setMode(mode, { skipScroll: true, pushState: false });
})();

window.addEventListener("hashchange", () => {
  const nextMode = getModeFromUrl();
  const currentMode = document.body.getAttribute("data-mode") || MODE_PLAY;
  if (nextMode !== currentMode && !isTransitioning) {
    setMode(nextMode, { pushState: false });
  }
});

window.addEventListener("popstate", () => {
  const nextMode = getModeFromUrl();
  setMode(nextMode, { pushState: false });
});

function setupModeButton(btnId, targetMode) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    switchMode(targetMode, btn);
  });
}
setupModeButton("enter-play-mode", MODE_PLAY);
setupModeButton("enter-play-mode-footer", MODE_PLAY);
setupModeButton("enter-formal-mode", MODE_FORMAL);

const pressStartBtn = document.getElementById("press-start-btn");
if (pressStartBtn) {
  pressStartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    playSfx(880, 0.12, "square");
    const target = document.getElementById("about-sec");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
}

/* ════════════════════════════════
   🎇 CLICK PARTICLE EXPLOSION
════════════════════════════════ */
document.addEventListener("click", (e) => {
  if (document.body.getAttribute("data-mode") === MODE_FORMAL) return;
  
  const numParticles = 6 + Math.floor(Math.random() * 4);
  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement("div");
    particle.className = "pixel-particle";
    
    particle.style.left = `${e.clientX}px`;
    particle.style.top = `${e.clientY}px`;
    
    const tx = (Math.random() - 0.5) * 100;
    const ty = (Math.random() - 0.5) * 100;
    particle.style.setProperty("--tx", `${tx}px`);
    particle.style.setProperty("--ty", `${ty}px`);
    
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 600);
  }
});

/* ════════════════════════════════
   ❤️ FLOATING HEARTS PROGRESS BAR
════════════════════════════════ */
(function initHeartsBar() {
  const heartsBar = document.getElementById("hearts-bar");
  if (!heartsBar) return;
  
  const slots = heartsBar.querySelectorAll(".heart-slot");
  const countEl = heartsBar.querySelector(".hearts-bar-count");
  const collected = new Set();
  let heartsBarShown = false;

  function showHeartsBar() {
    if (heartsBarShown) return;
    heartsBarShown = true;
    heartsBar.classList.add("visible");
  }

  function playHeartCollectSound() {
    if (!_audioEnabled) return;
    try {
      const ctx = getACtx();
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, i) => {
        const t = i * 0.07;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "square";
        o.frequency.setValueAtTime(freq, ctx.currentTime + t);
        g.gain.setValueAtTime(0.12, ctx.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.15);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(ctx.currentTime + t);
        o.stop(ctx.currentTime + t + 0.16);
      });
    } catch (e) { /* silent */ }
  }

  function playAllCollectedFanfare() {
    if (!_audioEnabled) return;
    try {
      const ctx = getACtx();
      const melody = [523.25, 659.25, 783.99, 1046.5];
      melody.forEach((freq, i) => {
        const t = i * 0.12;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "square";
        o.frequency.setValueAtTime(freq, ctx.currentTime + t);
        g.gain.setValueAtTime(0.15, ctx.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.25);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(ctx.currentTime + t);
        o.stop(ctx.currentTime + t + 0.28);
      });
    } catch (e) { /* silent */ }
  }

  const SECTION_COINS = {
    "about-sec": 500,
    "skills-sec": 750,
    "projects-sec": 1000,
    "certs-sec": 500,
    "contact-sec": 750,
  };

  function collectHeart(sectionId) {
    if (collected.has(sectionId)) return;
    collected.add(sectionId);

    const slot = heartsBar.querySelector(`.heart-slot[data-section="${sectionId}"]`);
    if (!slot) return;

    const svg = slot.querySelector(".heart-svg");
    svg.classList.remove("empty");
    svg.classList.add("filled", "collecting");

    const glow = document.createElement("div");
    glow.className = "heart-glow";
    slot.appendChild(glow);

    playHeartCollectSound();

    const reward = SECTION_COINS[sectionId] || 250;
    addCoins(reward, slot);

    setTimeout(() => {
      svg.classList.remove("collecting");
    }, 600);
    setTimeout(() => {
      glow.remove();
    }, 800);

    countEl.textContent = `${collected.size}/5`;

    if (collected.size === 5) {
      heartsBar.classList.add("all-collected");
      setTimeout(() => showQuestComplete(), 400);
    }
  }

  function showQuestComplete() {
    playAllCollectedFanfare();

    const overlay = document.createElement("div");
    overlay.className = "quest-complete-overlay";
    overlay.innerHTML = `
      <div class="quest-complete-banner">
        <div class="quest-complete-title">★ QUEST COMPLETE ★</div>
        <div class="quest-complete-sub">ALL 5 HEARTS &amp; +${Math.floor(currentScore).toLocaleString()} COINS COLLECTED!</div>
        <div class="quest-complete-hearts">
          ${Array(5).fill(`<svg viewBox="0 0 16 16"><rect x="2" y="2" width="4" height="4"/><rect x="10" y="2" width="4" height="4"/><rect x="0" y="4" width="16" height="6"/><rect x="2" y="10" width="12" height="2"/><rect x="4" y="12" width="8" height="2"/><rect x="6" y="14" width="4" height="2"/></svg>`).join("")}
        </div>
        <div class="quest-complete-dismiss">▶ CLICK TO CONTINUE</div>
      </div>
    `;
    document.body.appendChild(overlay);

    requestAnimationFrame(() => overlay.classList.add("active"));

    // Gold pixel particles shower
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const p = document.createElement("div");
        p.className = "pixel-particle";
        p.style.left = `${Math.random() * window.innerWidth}px`;
        p.style.top = `${Math.random() * window.innerHeight * 0.5}px`;
        p.style.setProperty("--tx", `${(Math.random() - 0.5) * 120}px`);
        p.style.setProperty("--ty", `${Math.random() * 80 + 40}px`);
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 600);
      }, i * 40);
    }

    overlay.addEventListener("click", () => {
      overlay.classList.remove("active");
      setTimeout(() => overlay.remove(), 400);
    });
  }

  const sectionIds = ["about-sec", "skills-sec", "projects-sec", "certs-sec", "contact-sec"];
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && document.body.getAttribute("data-mode") !== MODE_FORMAL) {
        showHeartsBar();
        collectHeart(entry.target.id);
      }
    });
  }, { threshold: 0.3 });

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
})();

