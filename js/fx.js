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

  // ---------- Text effect: words rise and clear one after another ----------
  // o: { y, blur, transition (spring/tween without delay), delay (start), stagger }
  function splitReveal(el, o) {
    const words = splitWords(el);
    if (reduce || !M) { words.forEach((w) => (w.style.opacity = 1)); return; }
    const from = { opacity: 0, y: o.y ?? 10, filter: `blur(${o.blur ?? 0}px)` };
    M.animate(words, from, { duration: 0 });
    return M.animate(
      words,
      { opacity: 1, y: 0, filter: "blur(0px)" },
      { ...o.transition, delay: M.stagger(o.stagger ?? 0.07, { startDelay: o.delay ?? 0 }) }
    );
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
    const t = spring(0.4, 0.2);
    let shown = false, isView = false;

    window.addEventListener("pointermove", (e) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      if (!shown) { shown = true; el.style.opacity = 1; }
      const overView = !!e.target.closest('[data-cursor="view"]');
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

  window.FX = { reduce, spring, tween, splitWords, splitReveal, appear, onView, scrollSpring, smoothScroll, cursor, get lenis() { return lenis; } };
})();
