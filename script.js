(() => {
  "use strict";

  const subjects = Array.isArray(window.PESQUISA_MARTE) ? window.PESQUISA_MARTE : [];
  const tabs = document.querySelector("#subject-tabs");
  const panel = document.querySelector("#subject-panel");
  const search = document.querySelector("#site-search");
  const results = document.querySelector("#search-results");
  const topbar = document.querySelector(".topbar");
  const menuButton = document.querySelector(".menu-button");
  const mobileMenu = document.querySelector("#mobile-menu");
  const planet = document.querySelector("#mars-planet");
  const panorama = document.querySelector(".panorama");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentSubject = subjects[0]?.id;
  let pointerX = 0;
  let pointerY = 0;

  const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const isPlaceholder = (text = "") => /^\s*\[.*\]\s*$/s.test(text);

  const formatInline = (value = "") => escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>");

  function formatText(value = "") {
    const lines = String(value).replace(/\r\n?/g, "\n").split("\n");
    const blocks = [];
    let paragraph = [];
    let unordered = [];
    let ordered = [];

    const flushParagraph = () => {
      if (!paragraph.length) return;
      blocks.push(`<p>${formatInline(paragraph.join(" "))}</p>`);
      paragraph = [];
    };

    const flushUnordered = () => {
      if (!unordered.length) return;
      blocks.push(`<ul>${unordered.map((item) => `<li>${formatInline(item)}</li>`).join("")}</ul>`);
      unordered = [];
    };

    const flushOrdered = () => {
      if (!ordered.length) return;
      blocks.push(`<ol>${ordered.map((item) => `<li>${formatInline(item)}</li>`).join("")}</ol>`);
      ordered = [];
    };

    const flushAll = () => {
      flushParagraph();
      flushUnordered();
      flushOrdered();
    };

    lines.forEach((line) => {
      const heading = line.match(/^\s*#{2,4}\s+(.+)$/);
      const bullet = line.match(/^\s*[-•*]\s+(.+)$/);
      const number = line.match(/^\s*\d+[.)]\s+(.+)$/);

      if (heading) {
        flushAll();
        blocks.push(`<h5>${formatInline(heading[1])}</h5>`);
      } else if (bullet) {
        flushParagraph();
        flushOrdered();
        unordered.push(bullet[1]);
      } else if (number) {
        flushParagraph();
        flushUnordered();
        ordered.push(number[1]);
      } else if (!line.trim()) {
        flushAll();
      } else {
        flushUnordered();
        flushOrdered();
        paragraph.push(line.trim());
      }
    });

    flushAll();
    return blocks.join("");
  }

  function renderVisualization(type = "") {
    if (type !== "transferencia-hohmann") return "";

    return `
      <figure class="mission-visual hohmann-visual">
        <div class="visual-header">
          <span>MODELO ORBITAL SIMPLIFICADO</span>
          <strong>Transferência de Hohmann</strong>
        </div>
        <svg viewBox="0 0 760 430" role="img" aria-labelledby="hohmann-title hohmann-desc">
          <title id="hohmann-title">Diagrama da transferência de Hohmann entre a Terra e Marte</title>
          <desc id="hohmann-desc">O Sol aparece no centro, cercado pelas órbitas da Terra e de Marte. A nave percorre uma trajetória elíptica da órbita terrestre até a órbita marciana. Um marcador mostra Marte aproximadamente quarenta e quatro graus à frente da Terra no lançamento.</desc>
          <defs>
            <linearGradient id="transfer-gradient" x1="0" x2="1">
              <stop offset="0" stop-color="#8fb8ff"/>
              <stop offset="1" stop-color="#ff6b3d"/>
            </linearGradient>
            <filter id="sun-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="12" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <marker id="route-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#ff8a5f"/>
            </marker>
          </defs>

          <circle class="orbit orbit-earth" cx="380" cy="215" r="96"/>
          <circle class="orbit orbit-mars" cx="380" cy="215" r="166"/>

          <line class="phase-line" x1="380" y1="215" x2="284" y2="215"/>
          <line class="phase-line" x1="380" y1="215" x2="261" y2="99"/>
          <path class="phase-arc" d="M331 215 A49 49 0 0 1 345 181"/>
          <text class="phase-text" x="304" y="174">≈ 44°</text>
          <text class="phase-note" x="198" y="73">MARTE NO LANÇAMENTO</text>

          <path class="transfer-path" d="M284 215 C305 394 512 394 546 215" marker-end="url(#route-arrow)"/>
          <circle class="route-dot" cx="355" cy="329" r="4"/>
          <circle class="route-dot" cx="451" cy="333" r="4"/>
          <text class="route-label" x="351" y="382">≈ 259 DIAS</text>

          <circle class="sun-glow" cx="380" cy="215" r="34"/>
          <circle class="sun" cx="380" cy="215" r="19" filter="url(#sun-glow)"/>
          <text class="body-label" x="366" y="258">SOL</text>

          <circle class="earth" cx="284" cy="215" r="11"/>
          <circle class="earth-light" cx="280" cy="211" r="3"/>
          <text class="body-label earth-label" x="252" y="245">TERRA</text>

          <circle class="mars-ghost" cx="261" cy="99" r="9"/>
          <circle class="mars" cx="546" cy="215" r="13"/>
          <circle class="mars-light" cx="542" cy="211" r="3"/>
          <text class="body-label mars-label" x="524" y="249">MARTE</text>
          <text class="arrival-note" x="565" y="205">ENCONTRO</text>

          <g class="legend" transform="translate(34 350)">
            <line x1="0" y1="0" x2="28" y2="0" class="legend-orbit"/>
            <text x="39" y="4">ÓRBITAS MÉDIAS</text>
            <line x1="0" y1="27" x2="28" y2="27" class="legend-transfer"/>
            <text x="39" y="31">TRAJETÓRIA DA NAVE</text>
          </g>
        </svg>
        <figcaption>Representação didática, fora de escala. A nave encontra Marte onde o planeta estará ao final da transferência — não onde ele estava na partida.</figcaption>
      </figure>`;
  }

  function renderTabs() {
    tabs.innerHTML = subjects.map((subject, index) => `
      <button
        class="subject-tab"
        id="tab-${escapeHtml(subject.id)}"
        type="button"
        role="tab"
        aria-selected="${index === 0}"
        aria-controls="subject-panel"
        data-subject="${escapeHtml(subject.id)}">
        <span class="tab-number">${escapeHtml(subject.numero)}</span>
        <span class="tab-icon" aria-hidden="true">${escapeHtml(subject.icone)}</span>
        <span class="tab-name">${escapeHtml(subject.nome)}</span>
      </button>`).join("");
  }

  function renderSubject(subjectId, updateHash = true) {
    const subject = subjects.find((item) => item.id === subjectId) || subjects[0];
    if (!subject) return;
    currentSubject = subject.id;

    document.querySelectorAll(".subject-tab").forEach((tab) => {
      tab.setAttribute("aria-selected", String(tab.dataset.subject === subject.id));
    });

    const topics = (subject.topicos || []).map((topic, index) => {
      const placeholder = isPlaceholder(topic.texto);
      const topicNumber = String(index + 1).padStart(2, "0");
      const imageTag = `<img src="${escapeHtml(topic.imagem)}" alt="${escapeHtml(topic.legenda || topic.titulo)}" loading="lazy">`;
      const image = topic.imagem ? `
        <figure class="topic-image">
          ${topic.fonte ? `<a href="${escapeHtml(topic.fonte)}" target="_blank" rel="noopener" aria-label="Abrir a fonte desta imagem">${imageTag}</a>` : imageTag}
          ${topic.legenda ? `<figcaption>${escapeHtml(topic.legenda)}</figcaption>` : ""}
        </figure>` : "";
      const visualization = renderVisualization(topic.visualizacao);
      return `
        <details class="topic-card" data-topic-index="${index}" ${index === 0 ? "open" : ""}>
          <summary class="topic-summary">
            <span class="topic-number" aria-hidden="true">${topicNumber}</span>
            <h4>${escapeHtml(topic.titulo)}</h4>
            <span class="topic-toggle" aria-hidden="true"></span>
          </summary>
          <div class="topic-content">
            ${placeholder ? `<p class="placeholder">${escapeHtml(topic.texto)}</p>` : formatText(topic.texto)}
            ${visualization}
            ${image}
          </div>
        </details>`;
    }).join("");

    const references = (subject.referencias || []).map((reference) => {
      const title = typeof reference === "string" ? reference : reference.titulo;
      const url = typeof reference === "object" ? reference.url : "";
      return url
        ? `<li><a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(title)} <span aria-hidden="true">↗</span></a></li>`
        : `<li>${escapeHtml(title)}</li>`;
    }).join("");

    panel.innerHTML = `
      <header class="subject-hero">
        <div>
          <div class="subject-title-row"><span aria-hidden="true">${escapeHtml(subject.icone)}</span><h3>${escapeHtml(subject.nome)}</h3></div>
          <p>${escapeHtml(subject.resumo)}</p>
          <p class="responsibles">RESPONSÁVEIS · ${escapeHtml(subject.responsaveis)}</p>
        </div>
        <span class="subject-number" aria-hidden="true">${escapeHtml(subject.numero)}</span>
      </header>
      <div class="topic-toolbar" aria-label="Controles dos tópicos">
        <span>${subject.topicos?.length || 0} tópicos</span>
        <div>
          <button type="button" data-topic-action="expand">Expandir todos</button>
          <button type="button" data-topic-action="collapse">Recolher todos</button>
        </div>
      </div>
      <div class="topic-list">${topics}</div>
      <details class="references-box">
        <summary><span>Referências desta disciplina</span><small>${subject.referencias?.length || 0} fontes</small></summary>
        <ul>${references}</ul>
      </details>`;

    panel.setAttribute("aria-labelledby", `tab-${subject.id}`);
    if (updateHash && location.hash.startsWith("#disciplina-")) {
      history.replaceState(null, "", `#disciplina-${subject.id}`);
    }
  }

  function chooseSubject(subjectId, focusPanel = false, topicIndex = null) {
    renderSubject(subjectId, false);
    history.replaceState(null, "", `#disciplina-${subjectId}`);
    document.querySelector("#pesquisa").scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth", block: "start" });
    if (focusPanel) {
      const delay = prefersReducedMotion.matches ? 0 : 450;
      setTimeout(() => {
        const topic = Number.isInteger(topicIndex) ? panel.querySelector(`[data-topic-index="${topicIndex}"]`) : null;
        if (topic) {
          topic.open = true;
          topic.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth", block: "center" });
        } else {
          panel.focus({ preventScroll: true });
        }
      }, delay);
    }
  }

  function initializeSubjects() {
    renderTabs();
    const hashSubject = location.hash.replace("#disciplina-", "");
    const initial = subjects.some((item) => item.id === hashSubject) ? hashSubject : subjects[0]?.id;
    renderSubject(initial, false);

    tabs.addEventListener("click", (event) => {
      const button = event.target.closest(".subject-tab");
      if (!button) return;
      renderSubject(button.dataset.subject, false);
      history.replaceState(null, "", `#disciplina-${button.dataset.subject}`);
    });

    tabs.addEventListener("keydown", (event) => {
      const buttons = [...tabs.querySelectorAll(".subject-tab")];
      const index = buttons.indexOf(document.activeElement);
      if (index < 0 || !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const direction = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
      const next = buttons[(index + direction + buttons.length) % buttons.length];
      next.focus();
      next.click();
    });

    panel.addEventListener("click", (event) => {
      const control = event.target.closest("[data-topic-action]");
      if (!control) return;
      const shouldOpen = control.dataset.topicAction === "expand";
      panel.querySelectorAll(".topic-card").forEach((topic) => { topic.open = shouldOpen; });
    });
  }

  function plainText(value = "") {
    return String(value).replace(/\s+/g, " ").trim();
  }

  function runSearch(query) {
    const term = plainText(query).toLocaleLowerCase("pt-BR");
    if (!term) {
      results.hidden = true;
      results.innerHTML = "";
      return;
    }

    const matches = [];
    subjects.forEach((subject) => {
      (subject.topicos || []).forEach((topic, topicIndex) => {
        const haystack = `${subject.nome} ${subject.resumo} ${topic.titulo} ${topic.texto}`.toLocaleLowerCase("pt-BR");
        if (haystack.includes(term)) matches.push({ subject, topic, topicIndex });
      });
    });

    results.hidden = false;
    results.innerHTML = matches.length ? `
      <h3>${matches.length} resultado${matches.length === 1 ? "" : "s"} para “${escapeHtml(query)}”</h3>
      ${matches.map(({ subject, topic, topicIndex }) => `
        <article class="result-item" tabindex="0" data-result="${escapeHtml(subject.id)}" data-topic-index="${topicIndex}">
          <small>${escapeHtml(subject.nome)}</small>
          <div><strong>${escapeHtml(topic.titulo)}</strong><p>${escapeHtml(plainText(topic.texto).slice(0, 150))}${topic.texto.length > 150 ? "…" : ""}</p></div>
        </article>`).join("")}` : `<p class="no-results">Nenhum resultado encontrado. Tente outra palavra.</p>`;
  }

  function initializeSearch() {
    search.addEventListener("input", (event) => runSearch(event.target.value));
    search.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        search.value = "";
        runSearch("");
        search.blur();
      }
    });
    results.addEventListener("click", (event) => {
      const item = event.target.closest("[data-result]");
      if (item) chooseSubject(item.dataset.result, true, Number(item.dataset.topicIndex));
    });
    results.addEventListener("keydown", (event) => {
      const item = event.target.closest("[data-result]");
      if (item && ["Enter", " "].includes(event.key)) {
        event.preventDefault();
        chooseSubject(item.dataset.result, true, Number(item.dataset.topicIndex));
      }
    });
  }

  function initializeMenu() {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menuButton.setAttribute("aria-label", open ? "Abrir menu" : "Fechar menu");
      mobileMenu.hidden = open;
      document.body.classList.toggle("menu-open", !open);
    });
    mobileMenu.addEventListener("click", (event) => {
      if (!event.target.matches("a")) return;
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menu");
      mobileMenu.hidden = true;
      document.body.classList.remove("menu-open");
    });
  }

  function initializeReveal() {
    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
  }

  function initializeStarfield() {
    const canvas = document.querySelector("#starfield");
    const context = canvas.getContext("2d");
    let stars = [];
    let animationFrame;

    function resize() {
      const density = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(innerWidth * density);
      canvas.height = Math.floor(innerHeight * density);
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      context.setTransform(density, 0, 0, density, 0, 0);
      stars = Array.from({ length: Math.min(160, Math.floor(innerWidth * innerHeight / 9000)) }, () => ({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: Math.random() * 1.1 + .15,
        a: Math.random() * .6 + .14,
        s: Math.random() * .004 + .001
      }));
    }

    function draw(time = 0) {
      context.clearRect(0, 0, innerWidth, innerHeight);
      stars.forEach((star, index) => {
        const alpha = prefersReducedMotion.matches ? star.a : star.a * (.65 + Math.sin(time * star.s + index) * .35);
        context.beginPath();
        context.fillStyle = `rgba(255,255,255,${Math.max(.05, alpha)})`;
        context.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        context.fill();
      });
      if (!prefersReducedMotion.matches) animationFrame = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", () => {
      cancelAnimationFrame(animationFrame);
      resize();
      draw();
    }, { passive: true });
  }

  function updateMotion() {
    const scrollY = window.scrollY;
    topbar.classList.toggle("scrolled", scrollY > 18);
    if (!prefersReducedMotion.matches) {
      const rotation = scrollY * .018 + pointerX * 1.2;
      const translateX = pointerX * 7;
      const translateY = pointerY * 7;
      planet.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotation}deg)`;
      if (panorama) panorama.style.transform = `translate3d(0, ${Math.max(-65, Math.min(65, (scrollY - panorama.offsetTop) * .04))}px, 0) scale(1.1)`;
    }
  }

  function initializeMotion() {
    let ticking = false;
    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { updateMotion(); ticking = false; });
    };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("pointermove", (event) => {
      pointerX = (event.clientX / innerWidth - .5);
      pointerY = (event.clientY / innerHeight - .5);
      requestUpdate();
    }, { passive: true });
    updateMotion();
  }

  function initializeActiveNavigation() {
    const links = [...document.querySelectorAll(".desktop-nav a")];
    const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-35% 0px -55%", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }

  initializeSubjects();
  initializeSearch();
  initializeMenu();
  initializeReveal();
  initializeStarfield();
  initializeMotion();
  initializeActiveNavigation();
})();
