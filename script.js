import { portfolioContent } from "./data/content.js";

const byId = (id) => document.getElementById(id);

function fillTextContent() {
  byId("about-en").textContent = portfolioContent.person.aboutEn;
  byId("about-ar").textContent = portfolioContent.person.aboutAr;
  byId("philosophy-en").textContent = portfolioContent.person.philosophyEn;
  byId("philosophy-ar").textContent = portfolioContent.person.philosophyAr;
}

function renderHeroStats() {
  const container = byId("hero-stats");
  container.innerHTML = portfolioContent.person.stats
    .map(
      (stat) => `
        <article class="stat-card">
          <div class="stat-value">${stat.value}</div>
          <div class="stat-label">${stat.label}</div>
        </article>
      `
    )
    .join("");
}

function renderHeroMeta() {
  const container = byId("hero-meta");
  container.innerHTML = portfolioContent.person.meta
    .map(
      (item) => `
        <div class="meta-row">
          <span class="meta-label">${item.label}</span>
          <span class="meta-value">${item.value}</span>
        </div>
      `
    )
    .join("");
}

function renderProjects() {
  const container = byId("projects-grid");
  container.innerHTML = portfolioContent.projects
    .map(
      (project, index) => `
        <article class="project-card" id="${project.slug}">
          <div class="project-copy">
            <div class="project-head">
              <div>
                <p class="project-label">MISSION 0${index + 1}</p>
                <h3 class="project-title">
                  ${project.titleEn}
                  <span lang="ar" dir="rtl">${project.titleAr}</span>
                </h3>
              </div>
              <span class="status-badge">${project.status}</span>
            </div>

            <p>${project.summaryEn}</p>
            <p lang="ar" dir="rtl">${project.summaryAr}</p>

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
              ${project.images
                .map((item) => `<div class="thumb" aria-label="${item}" title="${item}"></div>`)
                .join("")}
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderSocials() {
  const container = byId("social-links");
  container.innerHTML = portfolioContent.socials
    .map(
      (item) => `
        <a class="social-link" href="${item.href}" target="_blank" rel="noreferrer">
          <p class="social-link-title">${item.title}</p>
          <span class="social-link-arrow">OPEN</span>
        </a>
      `
    )
    .join("");
}

fillTextContent();
renderHeroStats();
renderHeroMeta();
renderProjects();
renderSocials();
