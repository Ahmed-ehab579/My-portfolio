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
| S2 | Custom cursor | Replaces the mouse arrow with a 16px white dot drawn in "difference" mode: dark on the light page, light on dark areas (photo, footer). It is its own layer so the blend reaches the page. While the mouse button is held it shrinks to 10×11 (Framer "Primary / pressed"). Over a project card it grows into a pill (Framer "Circle Cursor 2"): **VIEW** on Recita (99×46px) or **🔒 LOCKED** on e& and Woman in Islam (159×50px, 24px lock icon, 10px gap). `Surface hover` fill, 1px rgb(34,34,34) outline, Satoshi 23px/20px capitals, padding 14/18/12, centred on the pointer | Spring 0.4s, bounce 0.2. Off on touch screens |
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
| P3 | Card content (title, text, tags) | In view (title and text: half on screen; tags: any part) | Title 25px below, text 18px, tags 15px; they start offset, so the trigger point matches Framer | Title spring 1.5s; text spring 1.4s after 0.3s; tags spring 1.4s after 0.2s and 0.4s; bounce 0.2 |
| P4 | Hover on card | Mouse over | Cursor becomes the **View** pill (Recita) or the **Locked** pill (e&, Woman in Islam) (S2) | Spring 0.4s, bounce 0.2 |

### My Design Approach
| # | What | Trigger | Behaviour | Timing |
|---|---|---|---|---|
| A1 | "My Design Approach" title | In view, word by word | 10px below | Spring 2s, bounce 0 |
| A2 | Left column and the big number | Sticky | Stays pinned while the four steps scroll past | — |
| A3 | Big number **01 → 02 → 03 → 04** and step focus | Scroll-linked | Changes when the next step's **title reaches the bottom edge of the number**, and back at the same point when you scroll up (approved 2026-11-22, replaces Framer's switch point). The number cross-fades and slides 20px in the scroll direction. The step beside the number is full strength, the others are dimmed to 35% | Spring 0.7s, bounce 0.2 |
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
| R5 | **Side index** (Overview, Problem, Solution, Design process, Design decisions, Outcomes, Reflections) | Sticky. The active item turns red and grows from 20px to 21px. **Switch rule (measured 2026-11-23, down and up):** a section becomes current when its top reaches the **bottom edge of the screen** (Framer "threshold 1"), the last one reached wins. Targets: Overview, Problem, Solution, the first step row of Design process (not its heading), Design decisions, Outcomes, Reflections. Nothing is highlighted above the first. Items are links that glide to their section |
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
| R17 | Line illustrations next to the steps | **Draw themselves** once (no replay). Measured on the live site, 2026-11-23: each line starts when its step row's top reaches the **middle of the screen** (Research row at scroll 3300, MVP row at about 5405). Research line: about 3.2s, ease (0.12, 0.23, 0.5, 1), fast start. MVP line: about 3s, slow start and end (ease in-out) | As listed |
| R18 | **Key insights**: left column sticky, the 3 cards stack over each other while scrolling | Sticky at 0px and 40px | — |
| R19 | Insight card numbers | **Count up** from 20 to 80 / 70 / 92 | About 2.1s |
| R20 | Planning phone | Slides in from the right, 30px. Video plays inside | Spring 1.4s, bounce 0.2 |
| R21 | Planning illustration | Grows from 90% **every time** it enters the screen | Spring 1.1s, bounce 0.2 |

### Design decisions
| # | What | Behaviour | Timing |
|---|---|---|---|
| R22 | **Six stacking decision cards**, each with a video | Each sticks 20px from the top and **shrinks** as later cards slide over it. Final scales (measured): card 1 75%, card 2 75%, card 3 80%, card 4 85%, card 5 90%, card 6 100%. When the last card arrives, cards 2–4 step down at once to their second-to-last value, then ease to the final one as it rises. Key insights cards: the stack lets go 160px earlier than the cards' end (160px padding below as well as above) | Spring (stiffness 500, damping 60) |
| R23 | Card title and text | Title rises 25px, text 18px | Spring 1.5s / 1.4s, bounce 0.2 |

### Outcomes and Reflections
| # | What | Behaviour | Timing |
|---|---|---|---|
| R24 | Intro paragraph | Rises 18px | Spring 1.4s, bounce 0.2, after 0.3s |
| R25 | 5 stat cards | Rise 30px, one after another; numbers **count up** from 20 to 92 / 88 / 85 / 90 / 80 | Spring 1.4s, bounce 0.2, at 0, 0.2, 0.4, 0.6, 0.6s. Count about 2s |
| R26 | Reflections accordion (3 items) | Items rise in one after another, then expand and collapse when clicked (keyboard accessible) | Measured 2026-11-23: open and close both about **0.2s**, ease (0.12, 0.23, 0.5, 1). Closed row 98px, open 349px: the title slides 13px down (27 → 40px), the inner box (radius 30, padding 30) starts 30px under it, 40px below the box. No fade. The two chevrons swap to the opposite ones at once (no slide), stroke 2.5 |
| R27 | "Next story" link | Slides in from the left, 90px | Spring 1.2s, bounce 0.2 |

---

## Decisions (approved by Ahmed, 2026-11-20)

1. **Red hero word:** keep it as the live design shows it. Correction: it **does cycle** (Simple → Thoughtful → Creative). My first check ran while the preview was hidden, which paused it. Built as H3.
2. **Hidden layers:** the hidden second hero and the two hidden "Line Mask Split" headings are left out.
3. **Custom cursor:** keep it (S2). It is off on touch screens.
4. **"Made in Framer" badge:** not coded.
5. **"My Design Approach" spacing** (updated 2026-11-22): each step is about half a screen (55vh, kept between 420 and 560px) plus an 80px gap (Ahmed asked for 25% more space between steps), so the next step peeks in as the current one leaves; the big number is right-aligned like the Framer site, so its right edge stays 47px from the text for 01–04; the first and last steps stay centred on the sticky number. The number switches when a step passes the middle of the screen (down and back up). The Framer file uses 100vh steps + 100px gaps.
6. **Typos:** correct them: "Designer", "Design Process", "Design Decisions", "design decisions", "Analytics Dashboard". The app's name is **Recita** everywhere ("Recite is…" becomes "Recita is…").
7. **Text:** use what the live site shows. Suggest a better wording only where it matters.
8. **Recita page, kept different from the live Framer page (approved by Ahmed, 2026-11-23):** (a) the Research and Planning titles, text and tags animate as they reach the screen; on live Framer fires them at page load, so they never visibly animate. (b) "Next Story" is a link to Home's Projects with an arrow nudge on hover; on live it is plain text with no link or hover.

## Phones (under 810px) — Home, approved 2026-11-22
- Same entrance animations as desktop (hello and title word by word, photo rises 30px, cards' text rises, footer letters).
- Hero title is three lines, as on desktop (updated 2026-11-23): the red word rolls after "ideas into" on line 2, clipped to that line; line height 1.35; 40px between the text and the photo.
- Project cards stack and shrink as on desktop (updated 2026-11-23): they stick 80 / 94 / 108px from the top (higher when a card is taller than the screen, so it is seen in full first), shrink toward their top edge, and card 1 goes 100% → 93% → 88% (card 2: 100% → 95%) so only the top edges peek.
- Approach (updated 2026-11-23, from the Framer idea node LitTxiHke): a red 64px number, left-aligned with the title and 24px from the cards, pinned mid-screen beside a column of step cards 40px apart. **One card per swipe:** once card 01 is centred on the number, each swipe (or wheel flick) glides the page to the next or previous card (0.9s, ease in-out [0.65, 0, 0.35, 1]); swiping on from 04 (or back from 01) leaves the section normally; a fling into the section stops on 01 (or 04 coming back up); a scroll ending between cards settles on the nearer one. The number changes as the glide starts: 32px slide in the scroll direction, 6px blur, cross-fade, spring 1.1s, no bounce. The card beside it fades to full strength, the others to 35% (0.8s, same ease). The pin ends when card 04 is centred on the number.
- Menu opens as a dropdown panel (fade + 8px slide, 0.25s): 240px wide, 8px under the header bar, right edge aligned with the header, card surface colour, 0.7px lines in the border colour between links. Tapping outside closes it. (Updated 2026-11-23.)
- Menu icon morphs between ☰ and ✕ (updated 2026-11-23): the outer lines slide to the middle (0.2s) while the middle line shrinks away, then rotate ±45° with a soft overshoot (0.35s, cubic-bezier(0.34, 1.56, 0.64, 1)); closing plays it backwards. Desktop keeps Framer's instant swap.
- Footer: "Let's Work Together :)" stays on one line (sized to the screen, about 35px at 390px); LinkedIn, Behance, Dribbble on one line, 18px, 20px apart.
- No custom cursor on touch screens.

## Recita page: changes Ahmed asked for on 2026-11-23 (these differ on purpose from the Framer original)
- **Side index:** the current item is heavier (weight 400 → 500).
- **Hand-drawn lines in Design process (R17):** exactly as in Framer (Ahmed: keep them): timed draw as measured on the live site, same size, same position, nothing stretched. Checked 2026-11-23: both lines, the step rows and the Key insights block have the same size and position as the live page (research line 77/3907/276×1661, MVP line −177/6184/109×463, MVP row 5855, Key insights 1604px).
- **Problem dashed lines (R9):** move WITH THE SCROLL instead of a timer. Each glides in from its side (60px) and fades up while its place travels from 95% to 55% down the screen; stops when scrolling stops, glides out when scrolling back. Spring stiffness 90, damping 19.
- **Step numbers 01/02/03:** clipped at the left and top like the Framer frame (a wrapper clips, the number still slides in under it).
- **Key insights:** the card stack stops with its middle on the middle of the screen, and the text sits 12px below centre so "Key insights" is on the same line as the "92 %" of the finished stack (measured, 372.8 vs 373.5). The block keeps Framer's 1604px. To have all four cards stacked before the text leaves, the cards sit closer together (box heights 239/289/288/248px, top padding 150px, bottom 374px) so they all arrive by scroll 4918 and all leave at 4918, together with the text (measured: title and "92 %" 373/373 and 331/331 after release).
- **Design decision cards:** 639px tall (Framer 900px), 36px above and below the phone (Framer 166px); the wide first card 662px. Never taller than the screen minus 50px (20px under the top, 30px gap at the bottom), so the bottom edge always shows.
- **Reflections accordion (R26):** starts as a stack (row 1 in front, rows 2 and 3 behind it, 13px strips showing) and spreads to the 36px gap when the section's top reaches mid-screen, tween 0.3s (0.12, 0.23, 0.5, 1). Read from the Framer component "main drop down menu" (variants Closed / Opened). Plays once.
