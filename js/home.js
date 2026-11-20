// Home page motion. Every value comes from the Framer file; the codes (H1, P2…) match ANIMATIONS.md.
(function () {
  const { reduce, spring, tween, splitReveal, appear, onView, scrollSpring } = window.FX;
  const M = window.Motion;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  window.FX.smoothScroll();   // S1
  window.FX.cursor();         // S2

  // ===================== Hero =====================
  // H1: "Hi! I'm Ahmed…" word by word, 4px blur, spring 0.4s, 0.07s apart
  splitReveal($('[data-fx="hello"]'), { y: 10, blur: 4, transition: spring(0.4, 0), stagger: 0.07 });
  // H2: the big title, word by word, 4px blur, spring 1s, starts at 0.5s
  splitReveal($('[data-fx="title"]'), { y: 10, blur: 4, transition: spring(1, 0), delay: 0.5, stagger: 0.07 });
  // H4: the photo rises 30px, ease 1s, starts at 0.4s
  appear($('[data-fx="photo"]'), { y: 30, transition: tween(1, [0.12, 0.23, 0.5, 1], 0.4) });

  // H3: the red word. Reveals at 0.9s, then cycles Simple → Thoughtful → Creative.
  // Each step: holds 0.8s, then a 0.8s spring (no bounce). The new word rises from below,
  // the old one drifts up and blurs out (5px), as in the Framer component.
  (function cycle() {
    const box = $("[data-cycle]");
    if (!box) return;
    const words = $$(".cycle__word", box);
    if (reduce || !M) { words.forEach((w, i) => (w.style.opacity = i === 0 ? 1 : 0)); return; }
    const BELOW = 102, ABOVE = -68;
    const t = spring(0.8, 0);
    words.forEach((w, i) => M.animate(w, i === 0
      ? { opacity: 0, y: 10, filter: "blur(4px)" }
      : { opacity: 0, y: BELOW, filter: "blur(5px)" }, { duration: 0 }));
    M.animate(words[0], { opacity: 1, y: 0, filter: "blur(0px)" }, { ...spring(1, 0), delay: 0.9 });

    let current = 0;
    const next = () => {
      const out = words[current];
      current = (current + 1) % words.length;
      const inc = words[current];
      M.animate(out, { opacity: 0, y: ABOVE, filter: "blur(5px)" }, t);
      M.animate(inc, { opacity: [0, 1], y: [BELOW, 0], filter: ["blur(5px)", "blur(0px)"] }, t);
    };
    // First change after the reveal (0.9s) settles and holds; then every 1.6s (0.8s hold + 0.8s move)
    setTimeout(() => { next(); setInterval(next, 1600); }, 900 + 1000 + 800);
  })();

  // ===================== Section titles (P1, A1) =====================
  $$('[data-fx="section-title"]').forEach((el) => {
    const isProjects = el.id === "projects-title";
    window.FX.splitWords(el);   // words stay hidden (CSS) until the title reaches the screen
    onView(el, () => splitReveal(el, { y: 10, blur: 0, transition: spring(2, 0), delay: isProjects ? 0.2 : 0, stagger: 0.07 }), isProjects ? 0 : 0.5);
  });

  // ===================== Project cards (P3) =====================
  $$("[data-card]").forEach((card) => {
    const title = $('[data-fx="card-title"]', card);
    const desc = $('[data-fx="card-desc"]', card);
    const tags = $$('[data-fx="tag"]', card);
    onView(title, () => appear(title, { y: 25, transition: spring(1.5, 0.2) }), 0.5);
    onView(desc, () => appear(desc, { y: 18, transition: spring(1.4, 0.2, 0.3) }), 0.5);
    tags.forEach((tag, i) => onView(tag, () => appear(tag, { y: 15, transition: spring(1.4, 0.2, 0.2 + i * 0.2) }), 0));
  });

  // ===================== Stacking cards (P2) =====================
  // Each card sticks near the top and shrinks as later cards rise from the bottom of the screen:
  // card 1: 100% → 95% (card 2 arrives) → 90% (card 3 arrives); card 2: 100% → 95% (card 3 arrives).
  // Follows the scroll, smoothed by Framer's spring (stiffness 500, damping 60).
  (function stack() {
    const items = $$("[data-stack] .stack__item");
    if (!items.length || reduce) return;
    const scales = [[1, 0.95, 0.9], [1, 0.95], [1]];
    let tops = [];
    const measure = () => {
      // Natural (un-stuck) page positions: first item + (height + gap) per step
      const first = items[0];
      const prevTransform = first.style.transform; first.style.transform = "none";
      const stackTop = items[0].parentElement.getBoundingClientRect().top + window.scrollY;
      first.style.transform = prevTransform;
      const h = items[0].offsetHeight, gap = parseFloat(getComputedStyle(items[0].parentElement).rowGap) || 0;
      tops = items.map((_, i) => stackTop + i * (h + gap));
    };
    measure();
    window.addEventListener("resize", measure);

    const springs = items.map(() => scrollSpring({ stiffness: 500, damping: 60, mass: 1 }));
    const targetScale = (i) => {
      const s = scales[i];
      if (s.length < 2) return 1;
      const vh = window.innerHeight, y = window.scrollY, h = items[0].offsetHeight;
      // Measured on the live site: the card shrinks one step while each later card rises from
      // "its top touches the bottom of the screen" to "its bottom touches it", then holds.
      let v = s[0];
      for (let k = 1; k < s.length; k++) {
        const start = tops[i + k] - vh, end = start + h;
        if (y <= start) break;
        v = y >= end ? s[k] : s[k - 1] + (s[k] - s[k - 1]) * ((y - start) / h);
        if (y < end) break;
      }
      return v;
    };
    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.25, (now - last) / 1000); last = now;   // substeps keep this stable
      items.forEach((item, i) => {
        const v = springs[i].step(targetScale(i), dt);
        item.style.transform = v === 1 ? "" : `scale(${v.toFixed(4)})`;
      });
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  })();

  // ===================== My Design Approach (A2–A4) =====================
  const body = $('[data-fx="approach-body"]');
  // A4: the number and steps fade in, spring 1s, bounce 0.2, after 0.4s
  // (the column is several screens tall, so it starts as soon as any part of it is on screen)
  onView(body, () => appear(body, { transition: spring(1, 0.2, 0.4) }), 0);

  // A3: the big number follows the step on screen (01 → 04 and back), cross-fading with a 0.7s spring
  (function steps() {
    const digits = $$("[data-step-number] > span");
    const stepsEls = $$("[data-step]");
    if (!digits.length) return;
    let active = 0;
    const set = (i) => {
      if (i === active) return;
      const prev = digits[active]; active = i;
      prev.classList.remove("is-active"); digits[i].classList.add("is-active");
      if (reduce || !M) return;
      M.animate(prev, { opacity: 0 }, spring(0.7, 0.2));
      M.animate(digits[i], { opacity: 1 }, spring(0.7, 0.2));
    };
    const update = () => {
      const mid = window.innerHeight / 2;
      let idx = 0;
      stepsEls.forEach((s, i) => { if (s.getBoundingClientRect().top <= mid) idx = i; });
      set(idx);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
  })();
})();
