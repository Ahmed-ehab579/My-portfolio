// Shared motion helpers. They reproduce Framer's effects with Motion, the same engine Framer uses,
// so the values in ANIMATIONS.md go straight in. Loaded on every page.
//
// Framer's vocabulary → here:
//   spring(duration, bounce)        Framer "Spring" with Time + Bounce
//   tween(duration, ease)           Framer "Ease" with a cubic-bezier curve
//   textEffect → FX.splitReveal()   per word or per line
//   appearEffect → FX.appear()      from an offset, on load or when in view
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const M = window.Motion;

  const spring = (duration, bounce = 0.2, delay = 0) => ({ type: "spring", duration, bounce, delay });
  const tween = (duration, ease = [0.12, 0.23, 0.5, 1], delay = 0) => ({ duration, ease, delay });

  // ---------- Split text into words (keeps <br> and inline tags such as <strong>) ----------
  function splitWords(el) {
    if (el.classList.contains("is-split")) return [...el.querySelectorAll(".split-word")];
    const words = [];
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const span = document.createElement("span");
            span.className = "split-word";
            span.textContent = part;
            frag.appendChild(span);
            words.push(span);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR") {
          walk(child);
        }
      });
    };
    walk(el);
    el.classList.add("is-split");
    return words;
  }

  // ---------- Text effect: words (or lines) rise and clear one after another ----------
  // o: { y, blur, transition (spring/tween without delay), delay (start), stagger, by: "word" | "line" }
  // By line: each word gets its line's number, so a whole line moves as one (no extra wrappers,
  // so inline tags such as <strong> stay intact).
  function lineIndex(words) {
    let line = -1, lastTop = null;
    return words.map((w) => {
      const top = Math.round(w.offsetTop);
      if (lastTop === null || Math.abs(top - lastTop) > 4) { line++; lastTop = top; }
      return line;
    });
  }
  function splitReveal(el, o) {
    const words = splitWords(el);
    if (reduce || !M) { words.forEach((w) => (w.style.opacity = 1)); return; }
    const filter = o.blur ? { filter: `blur(${o.blur}px)` } : {};
    M.animate(words, { opacity: 0, y: o.y ?? 10, ...filter }, { duration: 0 });
    const to = { opacity: 1, y: 0, ...(o.blur ? { filter: "blur(0px)" } : {}) };
    const start = o.delay ?? 0, step = o.stagger ?? 0.07;
    const delay = o.by === "line"
      ? ((lines) => (i) => start + lines[i] * step)(lineIndex(words))
      : M.stagger(step, { startDelay: start });
    return M.animate(words, to, { ...o.transition, delay });
  }

  // ---------- Count a number up (Framer "Animated Numbers") ----------
  function countUp(el, from, to, duration = 2) {
    el.textContent = reduce || !M ? to : from;
    if (reduce || !M) return;
    M.animate(from, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => (el.textContent = Math.round(v)) });
  }

  // ---------- Draw an SVG line (path needs pathLength="1") ----------
  // The SVG stays hidden (CSS) until this runs; the dash is driven as an inline style each frame.
  function draw(path, o = {}) {
    const svg = path.ownerSVGElement;
    if (reduce || !M) { if (svg) svg.style.opacity = 1; return; }
    path.style.strokeDasharray = "1 1";
    path.style.strokeDashoffset = "1";
    if (svg) svg.style.opacity = 1;
    M.animate(1, 0, {
      duration: o.duration ?? 1.4, ease: o.ease ?? [0.12, 0.23, 0.5, 1], delay: o.delay ?? 0,
      onUpdate: (v) => (path.style.strokeDashoffset = String(v)),
    });
  }

  // ---------- Appear effect: from an offset to the element's resting place ----------
  // o: { x, y, scale, opacity, transition }
  function appear(el, o) {
    if (reduce || !M) { el.style.opacity = 1; return; }
    const from = { opacity: o.opacity ?? 0, x: o.x ?? 0, y: o.y ?? 0, scale: o.scale ?? 1 };
    M.animate(el, from, { duration: 0 });
    return M.animate(el, { opacity: 1, x: 0, y: 0, scale: 1 }, o.transition);
  }

  // ---------- Run once when the element reaches the screen ----------
  // amount: how much must be visible (Framer "threshold"), 0 = any part
  function onView(el, fn, amount = 0.5) {
    if (reduce || !M) { fn(); return; }
    let done = false;
    M.inView(el, () => { if (!done) { done = true; fn(); } }, { amount: amount || "some" });
  }

  // ---------- A small spring for values that follow the scroll ----------
  // Framer's "stiffness 500, damping 60, mass 1" smoothing, run every frame.
  function scrollSpring({ stiffness = 500, damping = 60, mass = 1 } = {}) {
    let value = null, velocity = 0;
    return {
      step(target, dt) {
        if (value === null) { value = target; return value; }
        const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
        const h = dt / steps;
        for (let i = 0; i < steps; i++) {
          const force = -stiffness * (value - target) - damping * velocity;
          velocity += (force / mass) * h;
          value += velocity * h;
        }
        if (Math.abs(value - target) < 1e-4 && Math.abs(velocity) < 1e-4) { value = target; velocity = 0; }
        return value;
      },
    };
  }

  // ---------- Smooth scroll (S1): Framer "Smooth Scroll", intensity 10 ----------
  let lenis = null;
  function smoothScroll() {
    if (reduce || !window.Lenis) return null;
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    // In-page links glide too
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      const target = id.length > 1 && document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: 0 });
      history.replaceState(null, "", id);
    });
    return lenis;
  }

  // ---------- Custom cursor (S2): a dot that becomes "View" over cards ----------
  function cursor() {
    const el = document.querySelector("[data-cursor-el]");
    if (!el || !M || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    const dot = el.querySelector(".cursor__dot");
    const view = el.querySelector(".cursor__view");
    const label = view.querySelector(".cursor__label");
    const t = spring(0.4, 0.2);
    let shown = false, isView = false, kind = "";

    window.addEventListener("pointermove", (e) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      if (!shown) { shown = true; el.style.opacity = 1; }
      // data-cursor="view" → VIEW pill; data-cursor="locked" → lock icon + LOCKED (Framer "Locked" variant)
      const target = e.target.closest("[data-cursor]");
      const nextKind = target ? target.dataset.cursor : "";
      if (nextKind && nextKind !== kind && label) {
        label.textContent = nextKind === "locked" ? "Locked" : "View ";   // Framer's label has a trailing space (pill is 99px)
        view.classList.toggle("is-locked", nextKind === "locked");
      }
      kind = nextKind || kind;
      const overView = !!target;
      if (overView !== isView) {
        isView = overView;
        if (reduce) {
          dot.style.opacity = isView ? 0 : 1;
          view.style.opacity = isView ? 1 : 0;
          view.style.transform = `scale(${isView ? 1 : 0})`;
        } else {
          M.animate(dot, { scale: isView ? 0 : 1, opacity: isView ? 0 : 1 }, t);
          M.animate(view, { scale: isView ? 1 : 0, opacity: isView ? 1 : 0 }, t);
        }
      }
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", () => { el.style.opacity = 0; shown = false; });
  }

  // ---------- Cards that stick and shrink as later cards arrive (Home P2, Recita R22) ----------
  // items: the sticky wrappers; scales[i]: card i's scale before and after each later card arrives.
  // Measured on the live site: a card shrinks one step while the next card rises from "its top
  // touches the bottom of the screen" to "its bottom touches it", then holds. Spring 500 / 60.
  function stackScale(items, scales) {
    if (!items.length || reduce) return;
    let tops = [];
    const measure = () => {
      const saved = items.map((it) => it.style.transform);
      items.forEach((it) => (it.style.transform = "none"));
      // Natural (un-stuck) positions: the parent's content top, then each item's height plus the gap.
      // (Measuring the items directly would be wrong once they are stuck.)
      const parent = items[0].parentElement, cs = getComputedStyle(parent);
      const gap = parseFloat(cs.rowGap) || 0;
      let y = parent.getBoundingClientRect().top + window.scrollY + parseFloat(cs.paddingTop) + parseFloat(cs.borderTopWidth);
      tops = items.map((it) => { const t = y; y += it.offsetHeight + gap; return t; });
      items.forEach((it, i) => (it.style.transform = saved[i]));
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);

    const springs = items.map(() => scrollSpring({ stiffness: 500, damping: 60, mass: 1 }));
    const target = (i) => {
      const s = scales[i] || [1];
      const vh = window.innerHeight, y = window.scrollY;
      let v = s[0];
      for (let k = 1; k < s.length; k++) {
        const t = items[i + k];
        if (!t) break;
        const h = t.offsetHeight, start = tops[i + k] - vh, end = start + h;
        if (y <= start) break;
        v = y >= end ? s[k] : s[k - 1] + (s[k] - s[k - 1]) * ((y - start) / h);
        if (y < end) break;
      }
      return v;
    };
    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.25, (now - last) / 1000); last = now;
      items.forEach((item, i) => {
        const v = springs[i].step(target(i), dt);
        item.style.transform = v === 1 ? "" : `scale(${v.toFixed(4)})`;
      });
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  window.FX = { reduce, spring, tween, splitWords, splitReveal, appear, onView, scrollSpring, stackScale, countUp, draw, smoothScroll, cursor, get lenis() { return lenis; } };
})();
