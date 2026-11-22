// Header (S3): slides down from 50px above on load (Framer spring: stiffness 262, damping 60,
// mass 3). Hides (60px up + fade, 0.4s) the moment you scroll down, and returns the moment you
// scroll up, as on the live Framer site.
// Menu (S4): opens the link pill to the left; ✕ closes it. See css/header.css.
(function () {
  const header = document.querySelector("[data-header]");
  if (!header) return;
  const menu = header.querySelector("[data-menu]");
  const toggle = header.querySelector("[data-menu-toggle]");

  if (!window.FX?.reduce && window.Motion) {
    window.Motion.animate(header, { y: [-50, 0] }, { type: "spring", stiffness: 262, damping: 60, mass: 3 });
  }

  // Variant 3 ("pill") from the point where the page's first section reaches the top of the screen,
  // as measured on the live site: 130px on Home, 150px on Recita (data-pill-at on the header).
  const pillAt = parseFloat(header.dataset.pillAt) || 130;

  let lastY = Math.max(0, window.scrollY);
  const onScroll = () => {
    const y = Math.max(0, window.scrollY);   // ignore the rubber-band bounce above the top
    header.classList.toggle("is-pill", y >= pillAt);
    if (y === lastY) return;
    header.classList.toggle("is-hidden", y > lastY && y > 0);
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  header.classList.toggle("is-pill", lastY >= pillAt);

  if (!menu || !toggle) return;
  const setOpen = (open) => {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
  });
})();
