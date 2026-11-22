# Animation list

Every animation on Home and the Recita case study, read from the Framer project and checked on the live site
(https://next-features-904898.framer.app/). Values are Framer's own, so the coded site can match them exactly.

**How to read the values**
- **Spring 1s / bounce 0.2**: a soft spring that settles in about 1 second with a slight overshoot. Bounce 0 means no overshoot.
- **Tween 0.8s (0.4, 0, 0.2, 1)**: a fixed-length ease. The four numbers are the easing curve.
- **From**: where the item starts. It always ends at its normal place, fully visible.
- **On load**: plays when the page opens. **In view**: plays once when it scrolls into view. **Scroll-linked**: follows the scroll position.

---

## Whole site

| # | What | Behaviour | Values |
|---|---|---|---|
| S1 | Smooth scroll | Scrolling glides instead of jumping | Framer "Smooth Scroll", intensity 10 |
| S2 | Custom cursor | Replaces the mouse arrow with a 16px white dot drawn in "difference" mode (it shows dark on the light page). Over a project card it grows into a pill reading **VIEW** (99×46px, `Surface hover` fill, Jost 23px, capitals) | Spring 0.4s, bounce 0.2. Off on touch screens |
| S3b | Header switches look | At the top of the page: **Variant 1** (flat bar, logo hanging from the top edge). Once the page's first section reaches the top of the screen (130px on Home, 150px on Recita) it becomes **Variant 3**: a 71px pill with a 1px rgb(34,34,34) outline, radius 20, 30px side padding, a rounded 54×51 logo and a centred menu. Switches back above that point. Measured on the live site, 2026-11-20 | Tween 0.4s (0.12, 0.23, 0.5, 1) |
| S3 | Header | Logo and menu button. On load it slides down from 50px above (spring: stiffness 262, damping 60, mass 3). It **hides the moment you scroll down** (even 10px) by moving 60px up **and fading out**, and **returns the moment you scroll up**. Measured on the live site, 2026-11-20 | Hide/show: tween 0.4s (0.12, 0.23, 0.5, 1) |
| S4 | Menu | **Open:** the link pill (Home, Projects, Approach) grows to the left, 0 → 331px; the icon swaps **instantly** from ☰ (three 2px lines) to ✕; the button fills with Surface (236,234,227). The pill's own 1px border shows as a rounded divider before the ✕. **Close:** the links disappear instantly, the icon swaps back, and only the fill fades out. Links: hover fills rgb(230,230,220), pressed rgb(222,222,204) | Open and fill: tween 0.4s (0.12, 0.23, 0.5, 1). Link hover: 0.2s ease (0.25, 0.1, 0.25, 1) |
| S5 | Footer | Plays when the footer reaches the screen. (In Framer it is meant to switch "Off → On" on scroll, but the scroll section it listens to is not set, so the live site shows an empty gap. Built to work, approved 2026-11-20.) Logo drops in from 40px above; title reveals **letter by letter** with a 10px blur; LinkedIn, Behance and Dribbble rows rise 20px one after another | Logo spring 1.4s / 0.2. Letters spring 1.4s, 0.05s apart. Rows spring 0.7s / 0.2 at 0s, 0.3s, 0.6s |

## Home

### Hero
| # | What | Trigger | From | Timing |
|---|---|---|---|---|
| H1 | "Hi! I'm Ahmed, A UX Designer" | On load, word by word | 10px below, 4px blur | Spring 0.4s, bounce 0, words 0.07s apart |
| H2 | "Who turn complex / ideas into / product experiences" | On load, word by word | 10px below, 4px blur | Spring 1s, bounce 0, starts after 0.5s, words 0.07s apart |
| H3 | Red word, **cycling Simple → Thoughtful → Creative** (checked on the live site) | On load, then loops | First reveal: 10px below, 4px blur. Each change: the new word rises from 102px below, the old one drifts 68px up; both blur 5px while moving | Reveal: spring 1s, bounce 0, after 0.9s. Each change: holds 0.8s, then spring 0.8s, bounce 0 (about 1.6s per word) |
| H4 | Your photo | On load | 30px below, transparent | Tween 1s (0.12, 0.23, 0.5, 1), starts after 0.4s |

Values above are from the hero layers actually shown on the live site. The Framer file also holds a hidden older hero with slightly different values; it is ignored (Decision 2).

### Selected Projects
| # | What | Trigger | Behaviour | Timing |
|---|---|---|---|---|
| P1 | "Selected Projects" title | In view, word by word | 10px below | Spring 2s, bounce 0, after 0.2s |
| P2 | **Stacking cards** (Recita, e&, Woman in Islam) | Scroll-linked | Each card sticks near the top (30px, 70px, 90px) and **shrinks one step while each later card rises from the bottom of the screen** (from its top touching the bottom edge to its bottom touching it), then holds: card 1 100% → 95% → 90%, card 2 100% → 95%. Measured on the live site | Spring (stiffness 500, damping 60) |
| P3 | Card content (title, text, tags) | In view | Rises 15–25px | Spring 1.4–1.5s, bounce 0.2, tags 0.2s apart |
| P4 | Hover on card | Mouse over | Cursor becomes the **View** pill (S2) | — |

### My Design Approach
| # | What | Trigger | Behaviour | Timing |
|---|---|---|---|---|
| A1 | "My Design Approach" title | In view, word by word | 10px below | Spring 2s, bounce 0 |
| A2 | Left column and the big number | Sticky | Stays pinned while the four steps scroll past | — |
| A3 | Big number **01 → 02 → 03 → 04** | Scroll-linked | Cross-fades when a step's top passes the middle of the screen, and back when you scroll up | Spring 0.7s, bounce 0.2 |
| A4 | Step block | In view | Fades in | Spring 1s, bounce 0.2, after 0.4s |

## Recita case study (`/project`)

### Intro
| # | What | Trigger | From | Timing |
|---|---|---|---|---|
| R1 | Title "Turning a complex audio concept…" | On load | 15px below | Spring 1.5s, bounce 0.2 |
| R2 | "6 mins read" | On load | 15px below | Same, after 0.4s |
| R3 | Project facts (Project, Platform, Team, Role, Result lines) | On load, one after another | 15px below | Spring 1s, bounce 0.2, at 0, 0.1, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8s |
| R4 | Hero video | Autoplays, muted, loops, no controls | — | — |

### Page structure
| # | What | Behaviour |
|---|---|---|
| R5 | **Side index** (Overview, Problem, Solution, Design process, Design decisions, Outcomes, Reflections) | Sticky. The active item turns red and grows from 20px to 21px as you reach each section. Items are links that glide to their section |
| R6 | Section intros (badge + heading) | Badge rises 50px, heading 25px. Spring 1.5s, bounce 0.2 |

### Overview, Problem, Solution
| # | What | Behaviour | Timing |
|---|---|---|---|
| R7 | Overview paragraph | Reveals **line by line**, 25px up | Spring 0.8s, bounce 0, lines 0.05s apart |
| R8 | Problem photos | Rise 10px | Spring 1.4s, bounce 0.2, after 0.4s |
| R9 | Problem decorations | One slides in from the right (60px), one from above (60px), one from the left (60px) | Spring 1.6s, bounce 0.2, after 0.4s |
| R10 | Problem paragraphs | Line by line, 20px up | Spring 2s, bounce 0, lines 0.05s apart |
| R11 | Solution paragraphs (Seeker, Voice) | Line by line, 20px up | Spring 2s, bounce 0, after 0.2s |
| R12 | Solution images | Rise 30px | Spring 1.4s, bounce 0.2, after 0.2s |

### Design process
| # | What | Behaviour | Timing |
|---|---|---|---|
| R13 | Step numbers 01 / 02 / 03 | Slide in from the left, 50px | Spring 1.4s, bounce 0.2, after 0.2s |
| R14 | Step titles | Slide in from the right, 60px | Same |
| R15 | Step text | Rises 18px | Spring 1.4s, bounce 0.2, after 0.3s |
| R16 | Method tags (Survey, User interview…) | Rise 25–35px, one after another | Spring 1.4s, bounce 0.2, about 0.2s apart |
| R17 | Line illustrations next to the steps | **Draw themselves** when the step reaches the screen. The Framer file switches them "Off → On" (spring 0.4s); the drawing speed could not be measured on the live site, so it is set to 2.4s (long research line) and 1.2s (MVP line). **To confirm with Ahmed** | Ease (0.12, 0.23, 0.5, 1) |
| R18 | **Key insights**: left column sticky, the 3 cards stack over each other while scrolling | Sticky at 0px and 40px | — |
| R19 | Insight card numbers | **Count up** from 20 to 80 / 70 / 92 | About 2.1s |
| R20 | Planning phone | Slides in from the right, 30px. Video plays inside | Spring 1.4s, bounce 0.2 |
| R21 | Planning illustration | Grows from 90% **every time** it enters the screen | Spring 1.1s, bounce 0.2 |

### Design decisions
| # | What | Behaviour | Timing |
|---|---|---|---|
| R22 | **Six stacking decision cards**, each with a video | Each sticks 20px from the top and **shrinks** (to 90%, 85%, 80%, 75%) as later cards slide over it | Spring (stiffness 500, damping 60) |
| R23 | Card title and text | Title rises 25px, text 18px | Spring 1.5s / 1.4s, bounce 0.2 |

### Outcomes and Reflections
| # | What | Behaviour | Timing |
|---|---|---|---|
| R24 | Intro paragraph | Rises 18px | Spring 1.4s, bounce 0.2, after 0.3s |
| R25 | 5 stat cards | Rise 30px, one after another; numbers **count up** from 20 to 92 / 88 / 85 / 90 / 80 | Spring 1.4s, bounce 0.2, at 0, 0.2, 0.4, 0.6, 0.6s. Count about 2s |
| R26 | Reflections accordion (3 items) | Items rise in one after another, then expand and collapse when clicked (keyboard accessible) | Open 0.3s, close 0.5s, tween (0.12, 0.23, 0.5, 1) |
| R27 | "Next story" link | Slides in from the left, 90px | Spring 1.2s, bounce 0.2 |

---

## Decisions (approved by Ahmed, 2026-11-20)

1. **Red hero word:** keep it as the live design shows it. Correction: it **does cycle** (Simple → Thoughtful → Creative). My first check ran while the preview was hidden, which paused it. Built as H3.
2. **Hidden layers:** the hidden second hero and the two hidden "Line Mask Split" headings are left out.
3. **Custom cursor:** keep it (S2). It is off on touch screens.
4. **"Made in Framer" badge:** not coded.
5. **"My Design Approach" spacing:** tighten the gap between steps by **20%**. The sticky number (A2–A3) must still switch cleanly at each step.
6. **Typos:** correct them: "Designer", "Design Process", "Design Decisions", "design decisions", "Analytics Dashboard". The app's name is **Recita** everywhere ("Recite is…" becomes "Recita is…").
7. **Text:** use what the live site shows. Suggest a better wording only where it matters.
