// Footer (S5). In Framer the footer switches from "Off" to "On" when it scrolls into view; then:
// the logo drops in from 40px above (spring 1.4s, bounce 0.2), the title reveals letter by letter
// (10px up, 10px blur, spring 1.4s, 0.05s apart), and the email and social rows rise 20px
// (spring 0.7s, bounce 0.2) at 0s, 0.3s, 0.6s.
(function () {
  const footer = document.querySelector("[data-footer]");
  if (!footer || !window.FX) return;
  const { reduce, spring, appear, onView } = window.FX;
  const M = window.Motion;

  const logo = footer.querySelector('[data-fx="footer-logo"]');
  const title = footer.querySelector('[data-fx="footer-title"]');
  const rows = [...footer.querySelectorAll('[data-fx="footer-row"]')];

  // Split the title into letters (keeps the red ":)" span). Each word's letters sit in a
  // no-wrap group, so on narrow screens the title wraps between words, never inside one.
  const letters = [];
  const letter = (ch) => {
    const s = document.createElement("span");
    s.className = "split-word";
    s.textContent = ch;
    if (ch === " ") s.style.whiteSpace = "pre";
    letters.push(s);
    return s;
  };
  const split = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
          const word = document.createElement("span");
          word.style.whiteSpace = "nowrap";
          [...part].forEach((ch) => word.appendChild(letter(ch)));
          frag.appendChild(word);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) split(child);
    });
  };
  title.setAttribute("aria-label", title.textContent.replace(/\s+/g, " ").trim());
  split(title);
  letters.forEach((l) => l.setAttribute("aria-hidden", "true"));

  if (reduce || !M) { [logo, title, ...rows].forEach((el) => (el.style.opacity = 1)); return; }
  M.animate(letters, { opacity: 0, y: 10, filter: "blur(10px)" }, { duration: 0 });

  onView(footer, () => {
    appear(logo, { y: -40, transition: spring(1.4, 0.2) });
    title.style.opacity = 1;
    M.animate(letters, { opacity: 1, y: 0, filter: "blur(0px)" }, { ...spring(1.4, 0), delay: M.stagger(0.05) });
    rows.forEach((row, i) => appear(row, { y: 20, transition: spring(0.7, 0.2, Math.min(i, 2) * 0.3) }));
  }, 0.3);
})();
