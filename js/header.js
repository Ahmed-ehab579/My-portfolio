// Header (S3): slides in on load, hides when scrolling down, returns when scrolling up.
// Menu (S4): opens a pill of links to the left; the icon turns ☰ into ✕.
(function () {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  // Slide in on load, like Framer (from 60px above)
  if (!window.FX?.reduce && window.Motion) {
    window.Motion.animate(header, { y: [-60, 0] }, window.FX.tween(0.4));
  }

  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (Math.abs(y - lastY) < 4) return;
    const down = y > lastY && y > 60;
    header.classList.toggle("is-hidden", down && !menu?.classList.contains("is-open"));
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  // ---------- Menu ----------
  const menu = header.querySelector("[data-menu]");
  const toggle = header.querySelector("[data-menu-toggle]");
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
  document.addEventListener("click", (e) => {
    if (menu.classList.contains("is-open") && !menu.contains(e.target)) setOpen(false);
  });
})();
