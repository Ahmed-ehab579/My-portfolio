// Recita case study motion. Values from the Framer file; codes (R1, R5…) match ANIMATIONS.md.
(function () {
  const { reduce, spring, splitReveal, appear, onView, replay, countUp, draw, stackScale } = window.FX;
  const M = window.Motion;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const num = (el, key, fallback) => (el.dataset[key] !== undefined ? parseFloat(el.dataset[key]) : fallback);

  window.FX.smoothScroll();
  window.FX.cursor();

  // ===================== Intro (R1–R3) =====================
  appear($('[data-fx="r1"]'), { y: 15, transition: spring(1.5, 0.2) });
  appear($('[data-fx="r2"]'), { y: 15, transition: spring(1.5, 0.2, 0.4) });
  // R3: each fact rises in turn (the outer impact block shows at once, its lines follow)
  $$('[data-fx="fact"]').forEach((el) => {
    if (el.querySelector('[data-fx="fact"]')) { el.style.opacity = 1; return; }
    appear(el, { y: 15, transition: spring(1, 0.2, num(el, "delay", 0)) });
  });

  // Phones: the info card shows the key facts first; "See more details" opens the rest
  (function factsMore() {
    const btn = $("[data-facts-more]"), card = $(".facts");
    if (!btn || !card) return;
    const label = $("[data-facts-label]", btn);
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      card.classList.toggle("is-open", open);
      label.textContent = open ? "Show less" : "See more details";
      if (open) $$(".facts__item--more", card).forEach((el, i) => appear(el, { y: 15, transition: spring(1, 0.2, i * 0.1) }));
    });
  })();

  // ===================== R5: index follows the section on screen =====================
  (function index() {
    const links = $$("[data-index] a");
    // Framer's scroll target for "Design process" is the first step row, not the section heading
    const sections = links.map((a) => (a.getAttribute("href") === "#process" ? document.querySelector(".cs-research") : document.querySelector(a.getAttribute("href"))));
    let active = -1;
    const update = () => {
      // Framer "threshold 1": a section is current once its top reaches the bottom edge of the screen (measured on the live site)
      const line = window.innerHeight;
      let idx = -1; // none highlighted until the first section's top reaches the bottom of the screen
      sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top <= line) idx = i; });
      if (idx === active) return;
      active = idx;
      links.forEach((a, i) => (i === idx ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
    };
    window.addEventListener("scroll", update, { passive: true });
    update();

    // Phones: a round button in the bottom-right corner. A ring around it fills as you read; tap opens the list of
    // sections (done / current / next). When the section changes, a pill peeks out for 2.4s with its name.
    // It shows once the hero is passed and steps away when the footer arrives.
    const toggle = $("[data-index-toggle]"), label = $("[data-index-label]"), ring = $("[data-index-progress]"), index = $(".cs-index"), body = $(".cs-body"), scrim = $("[data-index-scrim]");
    if (!toggle) return;
    const setOpen = (open) => { index.classList.toggle("is-open", open); toggle.setAttribute("aria-expanded", String(open)); if (open) index.classList.remove("is-peek"); };
    toggle.addEventListener("click", () => setOpen(!index.classList.contains("is-open")));
    scrim.addEventListener("click", () => setOpen(false));
    links.forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    let lastText = null, peekTimer = 0;
    const paint = () => {
      const vh = window.innerHeight, r = body.getBoundingClientRect();
      index.classList.toggle("is-active", r.top < vh * 0.4 && r.bottom > vh * 0.7);
      const curIdx = links.findIndex((a) => a.getAttribute("aria-current") === "true");
      links.forEach((a, i) => a.classList.toggle("is-done", i < curIdx));
      const text = curIdx >= 0 ? links[curIdx].textContent : "Index";
      if (text !== lastText) {
        label.textContent = text;
        if (lastText !== null && curIdx >= 0 && !index.classList.contains("is-open")) {
          index.classList.add("is-peek");
          clearTimeout(peekTimer);
          peekTimer = setTimeout(() => index.classList.remove("is-peek"), 2400);
        }
        lastText = text;
      }
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
      ring.style.strokeDashoffset = String((1 - p).toFixed(4));
    };
    window.addEventListener("scroll", paint, { passive: true });
    window.addEventListener("resize", paint);
    paint();
  })();

  // ===================== Section intros (R6) =====================
  $$('[data-fx="badge"]').forEach((el) => onView(el, () => appear(el, { y: 50, transition: spring(1.5, 0.2) }), 0.5));
  // Framer's inner Badge replays: each time it comes back fully on screen it rises 10px again
  $$('[data-fx="badge"]').forEach((el) => onView(el, () => setTimeout(() => replay(el, { y: 10, transition: spring(0.8, 0.2) }, 1), 1600), 0.5));
  $$('[data-fx="intro-title"]').forEach((el) => onView(el, () => appear(el, { y: 25, transition: spring(1.5, 0.2) }), 0.5));

  // ===================== Line-by-line paragraphs (R7, R10, R11) =====================
  $$('[data-fx="lines"]').forEach((el) => {
    window.FX.splitWords(el);
    onView(el, () => splitReveal(el, {
      by: "line", y: num(el, "y", 20), stagger: 0.05, delay: num(el, "delay", 0),
      transition: spring(num(el, "dur", 2), num(el, "bounce", 0)),
    }), 0.5);
  });

  // ===================== Problem (R8, R9) and Solution images (R12) =====================
  $$('[data-fx="problem-img"]').forEach((el) => onView(el, () => appear(el, { y: 10, transition: spring(1.4, 0.2, 0.4) }), 0.5));
  // The three dashed lines in Problem move WITH THE SCROLL (Ahmed's request, replacing the timed slide): each glides
  // in from its side (60px) and fades up while its place travels from 95% to 55% down the screen. Scrolling stops, they
  // stop; scrolling back, they glide out again. A soft spring keeps the move slow and smooth.
  (function dashesOnScroll() {
    const dashes = $$('[data-fx="dash"]');
    if (!dashes.length) return;
    if (reduce || !window.FX.scrollSpring) { dashes.forEach((el) => (el.style.opacity = 1)); return; }
    const state = dashes.map((el) => {
      const from = el.dataset.from;   // x60 | y-60 | x-60
      return { el, axis: from[0], dist: parseFloat(from.slice(1)), sp: window.FX.scrollSpring({ stiffness: 90, damping: 19, mass: 1 }), top: 0 };
    });
    // SVG elements have no offsetTop: the section is the positioned parent, so add the CSS top by hand
    const measure = () => state.forEach((s) => { s.top = s.el.parentElement.getBoundingClientRect().top + window.scrollY + (parseFloat(getComputedStyle(s.el).top) || 0); });
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.25, (now - last) / 1000); last = now;
      const y = window.scrollY, vh = window.innerHeight;
      state.forEach((s) => {
        const p = Math.min(1, Math.max(0, (vh * 0.95 - (s.top - y)) / (vh * 0.4)));
        const v = s.sp.step(p, dt);
        const off = (1 - v) * s.dist;
        s.el.style.opacity = String(v);
        s.el.style.translate = s.axis === "x" ? `${off}px 0` : `0 ${off}px`;
      });
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  })();
  // Phones: the Problem section's dashed lines fill with the scroll, like water running through a pipe (Ahmed's
  // request). A faint dashed line is always there; the full-strength dashes appear along it as the line travels up the
  // screen (its "water front" sits 75% down), and drain again when scrolling back. Same soft spring as desktop.
  (function pipes() {
    const boxes = $$("[data-flow]");
    if (!boxes.length) return;
    const NS = "http://www.w3.org/2000/svg";
    const make = (tag, attrs, parent) => {
      const el = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      parent.appendChild(el);
      return el;
    };
    const pipes = boxes.map((box, i) => {
      const holder = box.firstElementChild, svg = make("svg", {}, holder);
      const mask = make("mask", { id: `pipe-${i}`, maskUnits: "userSpaceOnUse" }, svg);
      const water = make("path", { pathLength: "1", class: "pflow__water" }, mask);
      const empty = make("path", { class: "pflow__empty" }, svg);
      const full = make("path", { class: "pflow__full", mask: `url(#pipe-${i})` }, svg);
      const build = () => {
        const w = holder.clientWidth, h = holder.clientHeight;
        const d = box.dataset.flow === "corner" ? `M2 2 V${h - 2} H${w - 2}` : `M2 2 V${h - 2}`;
        svg.setAttribute("viewBox", `0 0 ${Math.max(w, 4)} ${Math.max(h, 4)}`);
        ["x", "y"].forEach((k) => mask.setAttribute(k, "-10"));
        mask.setAttribute("width", w + 24); mask.setAttribute("height", h + 24);
        [water, empty, full].forEach((p) => p.setAttribute("d", d));
      };
      return { holder, water, build, sp: window.FX.scrollSpring({ stiffness: 90, damping: 19, mass: 1 }), shown: -1 };
    });
    const build = () => pipes.forEach((p) => p.build());
    build();
    window.addEventListener("resize", build);
    window.addEventListener("load", build);
    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.25, (now - last) / 1000); last = now;
      const vh = window.innerHeight;
      pipes.forEach((p) => {
        const r = p.holder.getBoundingClientRect();
        if (!r.height) return;   // hidden (desktop)
        const goal = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height + 80)));
        const v = reduce ? 1 : Math.min(1, Math.max(0, p.sp.step(goal, dt)));
        if (Math.abs(v - p.shown) < 0.0005) return;
        p.shown = v;
        p.water.style.strokeDashoffset = String(1 - v);
        p.water.style.opacity = v > 0.001 ? "1" : "0";
      });
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  })();

  // Phones: decision cards 2–6 show the start of the text; "…..show more" opens the rest (Ahmed's Framer frame)
  (function showMore() {
    $$(".decision-wrap").slice(1).forEach((wrap) => {
      const p = $(".decision__body", wrap);
      if (!p) return;
      const words = p.textContent.trim().split(/\s+/);
      let cut = 0, len = 0;
      while (cut < words.length && len + words[cut].length + (cut ? 1 : 0) <= 110) { len += words[cut].length + (cut ? 1 : 0); cut++; }
      if (cut >= words.length) return;
      const rest = document.createElement("span"), btn = document.createElement("button");
      rest.className = "dec-rest"; rest.textContent = " " + words.slice(cut).join(" ");
      btn.className = "dec-more"; btn.type = "button";
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = "…..show more";
      p.textContent = words.slice(0, cut).join(" ");
      p.append(rest, " ", btn);
      btn.addEventListener("click", () => {
        const open = p.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(open));
        btn.textContent = open ? "show less" : "…..show more";
        // an open card can be taller than the screen: let it stick by its bottom edge so all of it can be read
        wrap.style.top = "";
        if (open) {
          const top = parseFloat(getComputedStyle(wrap).top) || 0, fit = window.innerHeight - wrap.offsetHeight - 16;
          if (fit < top) wrap.style.top = `${fit}px`;
        }
        window.dispatchEvent(new Event("resize"));   // the card stack re-measures
      });
    });
  })();

  $$(".avatar-gap").forEach((el) => onView(el, () => appear(el, { y: 30, transition: spring(1.4, 0.2, 0.2) }), 0.5));   // phones: the inline pictures rise in like the desktop ones
  $$('[data-fx="avatar"]').forEach((el) => onView(el, () => appear(el, { y: 30, transition: spring(1.4, 0.2, 0.2) }), 0.5));

  // ===================== Design process (R13–R17, R20, R21) =====================
  $$('[data-fx="step-num"]').forEach((el) => onView(el, () => appear(el, { x: -50, transition: spring(1.4, 0.2, 0.2) }), 0.5));
  // Framer: the step numbers replay too
  $$('[data-fx="step-num"]').forEach((el) => onView(el, () => setTimeout(() => replay(el, { x: -50, transition: spring(1.4, 0.2, 0.2) }, 0.5, el.parentElement), 1700), 0.5));
  $$('[data-fx="step-title"]').forEach((el) => onView(el, () => appear(el, { x: 60, transition: spring(1.4, 0.2, 0.2) }), 0.5));
  $$('[data-fx="step-text"]').forEach((el) => onView(el, () => appear(el, { y: 18, transition: spring(1.4, 0.2, 0.3) }), 0.5));
  $$('[data-fx="pill"]').forEach((el) => onView(el, () => appear(el, { y: num(el, "y", 25), transition: spring(1.4, 0.2, num(el, "delay", 0.2)) }), 0));

  // R17: the hand-drawn lines draw themselves (kept as measured on the live site, 2026-11-23): each line starts when
  // its step row's top reaches the middle of the screen. Research line: about 3.2s, ease (0.12, 0.23, 0.5, 1).
  // MVP line: about 3s, slow start and end (ease in-out). Plays once.
  $$("[data-draw]").forEach((svg) => {
    const path = svg.querySelector("path");
    const research = svg.classList.contains("cs-line--research");
    const step = svg.classList.contains("cs-line--step");   // phones: the short line per step draws when it reaches mid-screen
    const target = step ? svg : document.querySelector(research ? ".cs-research" : ".cs-mvp");
    const opts = step ? { duration: num(svg, "duration", 1.2) } : research ? { duration: 3.2 } : { duration: 3, ease: [0.45, 0, 0.55, 1] };
    let done = false;
    const check = () => {
      if (done || target.getBoundingClientRect().top > window.innerHeight * 0.5) return;
      done = true;
      window.removeEventListener("scroll", check);
      draw(path, opts);
    };
    window.addEventListener("scroll", check, { passive: true });
    check();
  });

  // R18 wrapper fade (Framer: the key-insights block rises 59px)
  const insights = $('[data-fx="insights"]');
  onView(insights, () => appear(insights, { y: 59, transition: spring(1.4, 0.2) }), 0);

  // R19 / R25: numbers count up from 20 when they reach the screen
  $$("[data-count]").forEach((el) => onView(el, () => countUp(el, num(el, "from", 20), num(el, "count", 0), num(el, "speed", 2)), 0.5));

  // R20: planning phone slides in from the right; R21: the flow diagram grows from 90% every time it enters
  const phone = $('[data-fx="planning-phone"]');
  onView(phone, () => appear(phone, { x: 30, transition: spring(1.4, 0.2) }), 0.5);
  const flows = $('[data-fx="flows"]');
  if (flows && !reduce && M) {
    M.inView(flows, () => {
      appear(flows, { scale: 0.9, transition: spring(1.1, 0.2) });
      return () => M.animate(flows, { opacity: 0, scale: 0.9 }, { duration: 0 });   // replays next time
    }, { amount: 0.5 });
  } else if (flows) flows.style.opacity = 1;

  // ===================== Design decisions (R22, R23) =====================
  // Six cards stick 20px from the top and shrink as the later cards arrive (same rule as Home's cards)
  const phoneScreen = matchMedia("(max-width: 809px)").matches;
  const shrink = (row) => row.map((v) => (phoneScreen ? 1 - (1 - v) * 0.5 : v));   // phones: half the shrink
  stackScale($$("[data-decisions] .decision-wrap"), [
    [1, 0.9, 0.85, 0.85, 0.8, 0.75],
    [1, 0.9, 0.85, 0.85, 0.8, 0.75],
    [1, 0.9, 0.9, 0.85, 0.8],
    [1, 0.9, 0.9, 0.85],
    [1, 0.9],
    [1],
  ].map(shrink), [[1, 2, 3, 4, 5], [2, 3, 4, 5, 5], [3, 4, 5, 5], [4, 5, 4], [5], []]);
  $$('[data-fx="dec-title"]').forEach((el) => onView(el, () => appear(el, { y: 25, transition: spring(1.5, 0.2) }), 0.5));
  $$('[data-fx="dec-body"]').forEach((el) => onView(el, () => appear(el, { y: 18, transition: spring(1.4, 0.2, 0.3) }), 0.3));

  // ===================== Outcomes (R24, R25) =====================
  const lead = $('[data-fx="outcomes-lead"]');
  onView(lead, () => appear(lead, { y: 18, transition: spring(1.4, 0.2, 0.3) }), 0.5);
  $$('[data-fx="stat"]').forEach((el) => onView(el, () => appear(el, { y: num(el, "y", 30), transition: spring(1.4, 0.2, num(el, "delay", 0)) }), 0.3));

  // ===================== Reflections (R26): an accordion =====================
  // The three rows start as a stack (Framer "Closed" variant): row 1 in front, rows 2 and 3 tucked behind it with only
  // a 13px strip showing. When the section's top reaches the middle of the screen they slide down into place
  // (Framer "Opened" variant, tween 0.3s, ease 0.12 / 0.23 / 0.5 / 1). Plays once.
  (function accordionDeck() {
    const faq = $("[data-faq]"), items = $$('[data-fx="faq-item"]'), section = $("#reflections");
    items.forEach((el) => (el.style.opacity = 1));
    if (!faq || reduce || !M || items.length < 2) return;
    // each tucked row sits 13px below the one in front: step = that row's height + the gap - 13 (121px on desktop)
    const gap = parseFloat(getComputedStyle(faq).rowGap) || 0;
    const steps = items.map((el, i) => (i ? `${-(items[i - 1].offsetHeight + gap - 13)}px` : "0px"));
    items.forEach((el, i) => el.style.setProperty("--deck", steps[i]));
    faq.classList.add("faq--deck");
    items.slice(1).forEach((el) => el.setAttribute("inert", ""));   // rows behind the front one can't be reached until they spread
    let done = false;
    const check = () => {
      if (done || section.getBoundingClientRect().top > window.innerHeight * 0.5) return;
      done = true;
      window.removeEventListener("scroll", check);
      const rest = items.slice(1);
      Promise.all(rest.map((el, i) => M.animate(el, { marginTop: [steps[i + 1], "0px"] }, window.FX.tween(0.3)))).then(() => {
        faq.classList.remove("faq--deck");
        rest.forEach((el) => { el.style.marginTop = ""; el.removeAttribute("inert"); });
      });
    };
    window.addEventListener("scroll", check, { passive: true });
    check();
  })();
  $$(".faq__head").forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      if (reduce || !M) { panel.hidden = !open; return; }
      if (open) {
        panel.style.height = "0px";   // start closed so the first frame doesn't flash the full height
        panel.hidden = false;
        const h = panel.scrollHeight;
        M.animate(panel, { height: [0, h] }, window.FX.tween(0.2)).then(() => (panel.style.height = "auto"));
      } else {
        M.animate(panel, { height: [panel.offsetHeight, 0] }, window.FX.tween(0.2)).then(() => (panel.hidden = true));
      }
    });
  });

  // ===================== R27: Next story slides in from the left =====================
  const next = $('[data-fx="next-story"]');
  onView(next, () => appear(next, { x: -90, transition: spring(1.2, 0.2) }), 1);

  // ===================== Videos: play only while on screen (saves data and battery) =====================
  $$("video[data-autoplay]").forEach((v) => {
    if (!("IntersectionObserver" in window)) { v.play().catch(() => {}); return; }
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { v.preload = "auto"; v.play().catch(() => {}); } else v.pause();
    }, { rootMargin: "200px 0px" }).observe(v);
  });
})();
