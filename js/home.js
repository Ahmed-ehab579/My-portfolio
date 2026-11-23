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
  // Phones: card 1 (the tallest) shrinks a little more (93% → 88%) so its bottom stays hidden behind card 2.
  const phone = window.matchMedia("(max-width: 809px)").matches;
  window.FX.stackScale($$("[data-stack] .stack__item"), phone ? [[1, 0.93, 0.88], [1, 0.95], [1]] : [[1, 0.95, 0.9], [1, 0.95], [1]]);

  // Phones: each card shows the right-hand part of its desktop composition (x 540–1242, 702px wide)
  // scaled to the card's width (css/home.css reads --s). Harmless on desktop, where it's unused.
  (function fitShots() {
    const cards = $$("[data-card]");
    const items = $$("[data-stack] .stack__item");
    const fit = () => {
      cards.forEach((c) => c.style.setProperty("--s", (c.clientWidth / 702).toFixed(4)));
      // Phones: cards stick 80, 94, 108px from the top (each peeks 14px below the one before),
      // or higher when a card is taller than the screen, so its bottom is seen before the next covers it.
      items.forEach((it, i) => it.style.setProperty("--sticky-top-m",
        `${Math.round(Math.min(80 + i * 14, window.innerHeight - it.offsetHeight - 16))}px`));
    };
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("load", fit);
    if (document.fonts) document.fonts.ready.then(fit);
  })();

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
    const pin = $(".approach__number");
    const digits = $$("[data-step-number] > span");
    const stepsEls = $$("[data-step]");
    if (!box || !pin || !digits.length || !stepsEls.length) return;
    const phoneMQ = window.matchMedia("(max-width: 809px)");
    const isPhone = () => phoneMQ.matches;
    const DIM = 0.35, SHIFT = 20, t = spring(0.7, 0.2);
    // Phones (Ahmed, 2026-11-23): a slower, softer change — 32px slide with a 6px blur, spring 1.1s, no bounce
    const P_SHIFT = 32, tP = spring(1.1, 0), tCard = tween(0.8, [0.65, 0, 0.35, 1]);
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
      if (isPhone()) {
        M.animate(prevDigit, { opacity: 0, y: -P_SHIFT * dir, filter: "blur(6px)" }, tP);
        M.animate(digits[i], { opacity: [0, 1], y: [P_SHIFT * dir, 0], filter: ["blur(6px)", "blur(0px)"] }, tP);
        M.animate(prevStep, { opacity: DIM }, tCard);
        M.animate(stepsEls[i], { opacity: 1 }, tCard);
        return;
      }
      M.animate(prevDigit, { opacity: 0, y: -SHIFT * dir }, t);
      M.animate(digits[i], { opacity: [0, 1], y: [SHIFT * dir, 0] }, t);
      M.animate(prevStep, { opacity: DIM }, t);
      M.animate(stepsEls[i], { opacity: 1 }, t);
    };

    let gliding = false;   // phones: true while the page glides to the next card (the number follows the target)
    const update = () => {
      if (gliding) return;
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

    // ---------- Phones: one card per swipe (Ahmed, 2026-11-23) ----------
    // Each card has a resting point where its text is centred on the pinned number. Once the first
    // card has arrived, each swipe (or wheel flick) glides the page to the next or previous card
    // (0.9s, ease in-out); swiping on from card 04 (or back from 01) leaves the section as normal.
    // A fling that runs into the section stops on card 01 (or 04 coming back up), and a scroll that
    // ends between two cards settles on the nearer one.
    if (reduce || !M) return;
    const root = document.documentElement;
    let Y = [], anim = null, touching = false, startY = 0, restIdx = -1, swipeDir = 0;
    let lastY = window.scrollY, settleT = 0, wheelBlock = 0;
    const measure = () => {
      const pinCentre = parseFloat(getComputedStyle(pin).top) + pin.offsetHeight / 2;
      Y = stepsEls.map((s) => {
        const top = s.firstElementChild.getBoundingClientRect().top, bottom = s.lastElementChild.getBoundingClientRect().bottom;
        return Math.round((top + bottom) / 2 + window.scrollY - pinCentre);
      });
    };
    const atRest = () => Y.findIndex((y) => Math.abs(window.scrollY - y) < 3);
    const glideTo = (i) => {
      i = Math.max(0, Math.min(Y.length - 1, i));
      gliding = true; set(i);
      root.style.overflow = "hidden";           // also stops any fling still running
      if (window.FX.lenis) window.FX.lenis.stop();
      if (anim) anim.stop();
      const from = window.scrollY, to = Y[i];
      anim = M.animate(from, to, {
        duration: Math.abs(to - from) < 2 ? 0.01 : 0.9, ease: [0.65, 0, 0.35, 1],
        onUpdate: (v) => window.scrollTo({ top: v, behavior: "instant" }),
        onComplete: () => {
          root.style.overflow = "";
          if (window.FX.lenis) window.FX.lenis.start();
          gliding = false; anim = null; lastY = window.scrollY;
        },
      });
      wheelBlock = performance.now() + 1150;
    };
    const settle = () => {
      if (!isPhone() || touching || gliding) return;
      measure();
      const y = window.scrollY;
      if (y <= Y[0] + 2 || y >= Y[Y.length - 1] - 2 || atRest() >= 0) return;
      let k = 0;
      Y.forEach((v, i) => { if (Math.abs(v - y) < Math.abs(Y[k] - y)) k = i; });
      glideTo(k);
    };

    window.addEventListener("scroll", () => {
      if (!isPhone() || gliding) { lastY = window.scrollY; return; }
      measure();
      const y = window.scrollY, first = Y[0], last = Y[Y.length - 1];
      // (only when it lands among the cards: a jump right past them, e.g. to the footer, is left alone)
      if (!touching && lastY < first - 2 && y >= first && y < last) glideTo(0);
      else if (!touching && lastY > last + 2 && y <= last && y > first) glideTo(Y.length - 1);
      lastY = y;
      clearTimeout(settleT); settleT = setTimeout(settle, 140);
    }, { passive: true });

    window.addEventListener("touchstart", (e) => {
      if (!isPhone()) return;
      touching = true; swipeDir = 0;
      startY = e.touches[0].clientY;
      measure(); restIdx = gliding ? -1 : atRest();
    }, { passive: true });
    window.addEventListener("touchmove", (e) => {
      if (!isPhone()) return;
      if (gliding) { if (e.cancelable) e.preventDefault(); return; }
      if (restIdx < 0) return;
      const dy = startY - e.touches[0].clientY;
      if (!swipeDir && Math.abs(dy) < 4) return;
      const dir = swipeDir || (dy > 0 ? 1 : -1);
      const next = restIdx + dir;
      if (next < 0 || next >= Y.length) return;   // leaving the section: scroll as normal
      if (e.cancelable) { e.preventDefault(); swipeDir = dir; }
    }, { passive: false });
    window.addEventListener("touchend", (e) => {
      if (!isPhone()) return;
      touching = false;
      if (swipeDir) {
        const dy = startY - e.changedTouches[0].clientY;
        if (Math.abs(dy) > 20 && Math.sign(dy) === swipeDir) glideTo(restIdx + swipeDir);
        swipeDir = 0;
      } else { clearTimeout(settleT); settleT = setTimeout(settle, 140); }
    }, { passive: true });

    // Mouse wheel / trackpad in a narrow window: the same one-card steps (capture: runs before Lenis)
    window.addEventListener("wheel", (e) => {
      if (!isPhone()) return;
      const now = performance.now();
      if (gliding || now < wheelBlock) {
        if (gliding || atRest() >= 0) { e.preventDefault(); wheelBlock = Math.max(wheelBlock, now + 250); }
        return;
      }
      measure();
      const r = atRest();
      if (r < 0 || Math.abs(e.deltaY) < 2) return;
      const next = r + (e.deltaY > 0 ? 1 : -1);
      if (next < 0 || next >= Y.length) return;
      e.preventDefault();
      glideTo(next);
    }, { passive: false, capture: true });
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
      // Phones (css/home.css): the part of card 04 below the trimmed end is added back to the space before the footer
      list.closest(".approach").style.setProperty("--tail-fix", `${Math.max(0, -tail)}px`);
    };
    fit();
    window.addEventListener("resize", fit);
    if (document.fonts) document.fonts.ready.then(fit);
  })();
})();
