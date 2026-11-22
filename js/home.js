// Home page motion. Every value comes from the Framer file; the codes (H1, P2…) match ANIMATIONS.md.
(function () {
  const { reduce, spring, tween, splitReveal, appear, onView } = window.FX;
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
    // Start offset (as Framer does), so "half on screen" is measured from the same place
    if (!reduce && M) {
      M.animate(title, { opacity: 0, y: 25 }, { duration: 0 });
      M.animate(desc, { opacity: 0, y: 18 }, { duration: 0 });
      tags.forEach((tag) => M.animate(tag, { opacity: 0, y: 15 }, { duration: 0 }));
    }
    onView(title, () => appear(title, { y: 25, transition: spring(1.5, 0.2) }), 0.5);
    onView(desc, () => appear(desc, { y: 18, transition: spring(1.4, 0.2, 0.3) }), 0.5);
    tags.forEach((tag, i) => onView(tag, () => appear(tag, { y: 15, transition: spring(1.4, 0.2, 0.2 + i * 0.2) }), 0));
  });

  // ===================== Stacking cards (P2) =====================
  // Each card sticks near the top and shrinks as later cards rise from the bottom of the screen:
  // card 1: 100% → 95% (card 2 arrives) → 90% (card 3 arrives); card 2: 100% → 95% (card 3 arrives).
  // Follows the scroll, smoothed by Framer's spring (stiffness 500, damping 60).
  window.FX.stackScale($$("[data-stack] .stack__item"), [[1, 0.95, 0.9], [1, 0.95], [1]]);

  // ===================== My Design Approach (A2–A4) =====================
  const body = $('[data-fx="approach-body"]');
  // A4: the number and steps fade in, spring 1s, bounce 0.2, after 0.4s
  // (the column is several screens tall, so it starts as soon as any part of it is on screen)
  onView(body, () => appear(body, { transition: spring(1, 0.2, 0.4) }), 0);

  // A3: the big number follows the step on screen (01 → 04 and back). Approved 2026-11-22 (options A + B):
  // - it changes when the next step's title reaches the bottom edge of the number, so the number
  //   and the text arrive together (scrolling back up, it changes back at the same point);
  // - the number slides 20px in the scroll direction as it cross-fades (spring 0.7s, bounce 0.2);
  // - the step beside the number is full strength, the others are dimmed to 35%.
  (function steps() {
    const box = $("[data-step-number]");
    const digits = $$("[data-step-number] > span");
    const stepsEls = $$("[data-step]");
    if (!box || !digits.length || !stepsEls.length) return;
    const DIM = 0.35, SHIFT = 20, t = spring(0.7, 0.2);
    let active = 0;
    stepsEls.forEach((s, i) => (s.style.opacity = i === 0 ? 1 : DIM));

    const set = (i) => {
      if (i === active) return;
      const dir = i > active ? 1 : -1;   // 1 = scrolling down (text moving up)
      const prevDigit = digits[active], prevStep = stepsEls[active];
      active = i;
      prevDigit.classList.remove("is-active"); digits[i].classList.add("is-active");
      if (reduce || !M) {
        stepsEls.forEach((s, k) => (s.style.opacity = k === i ? 1 : DIM));
        return;
      }
      M.animate(prevDigit, { opacity: 0, y: -SHIFT * dir }, t);
      M.animate(digits[i], { opacity: [0, 1], y: [SHIFT * dir, 0] }, t);
      M.animate(prevStep, { opacity: DIM }, t);
      M.animate(stepsEls[i], { opacity: 1 }, t);
    };

    const update = () => {
      const line = box.getBoundingClientRect().bottom;   // bottom edge of the sticky number
      let idx = 0;
      stepsEls.forEach((s, i) => {
        const title = s.querySelector("h3") || s;
        if (title.getBoundingClientRect().top <= line) idx = i;
      });
      set(idx);
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  })();

  // End the Approach section exactly when step 04's text is centred on the pinned number, so the
  // number and title let go while 04 is aligned (and no extra empty space is left before the footer).
  (function trimApproachEnd() {
    const list = $(".approach__steps");
    const box = $(".approach__number");
    const last = list && list.lastElementChild;
    if (!list || !box || !last) return;
    const fit = () => {
      const first = last.firstElementChild, end = last.lastElementChild;
      const stepTop = last.getBoundingClientRect().top;
      const textCentre = (first.getBoundingClientRect().top + end.getBoundingClientRect().bottom) / 2 - stepTop;
      const tail = textCentre + box.offsetHeight / 2 - last.offsetHeight;   // negative: trims space under 04
      list.style.marginBottom = `${tail}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    if (document.fonts) document.fonts.ready.then(fit);
  })();
})();
