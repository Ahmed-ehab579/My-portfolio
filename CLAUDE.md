# Project Instructions

## Scope
- Ahmed's portfolio site, coded from the approved Framer design.
- Plain HTML, CSS and JavaScript, like the BSS site. No framework and no build step.
- Animation uses Motion (`assets/vendor/motion-12.23.12.js`), the same engine Framer uses, so Framer's spring and tween values carry over exactly.

## Design source
- Framer project "New portfolio" (id `YhUEhOD6tpTRZku5M8Ns`). Pages: Home `/` and the Recita case study `/project`.
- Live reference: https://next-features-904898.framer.app/ . Compare every section and animation against it.
- `ANIMATIONS.md` lists every animation with its exact values. Build from it, and keep it updated.
- Desktop layout rule (measured on the live site): the page column, header and footer content are a **fixed 1242px, centred at every screen width**. Nothing shrinks on narrower screens; only the side margins change.
- Phone layout (under 810px, Framer's phone breakpoint) is built for Home only, approved 2026-11-22, revised 2026-11-23: hero in Ahmed's own layout (approved 2026-11-27, Framer design page "Home hero – Phone (390)": one bordered card, title 41px in five lines, photo bottom right bleeding off the edge), stacking cards with text on top and scaled screenshots, Approach as a pinned number beside step cards, dropdown menu, stacked footer. Rules live in `@media (max-width: 809px)` blocks in each CSS file. The Recita page has a first phone build (2026-11-23: pinned Index bar, one short line per step, stacked cards). Tablet (810–1241px) is not designed yet: propose before building.

## Copying a section from Framer: required checks
Work one section at a time. Before saying a section "matches", do all of these:
1. **List every state in the Framer file**: every component variant (including unnamed ones), hover/pressed states, and every effect (appear, scroll, scroll-direction, scroll-variant, sticky, loop). Never assume a variant or effect is unused: prove it on the live site, or ask Ahmed.
2. **Exercise the live site fully**: load the page fresh; scroll slowly down the *whole* page **and back up**; stop at several points; hover, press and click every interactive element; open and close every menu or accordion. Record what changes and at which scroll position or time.
3. **Keep the browser tab in front and visible while measuring.** A hidden or background tab pauses animations and scroll events, so "nothing happened" there proves nothing. Re-test in front before concluding.
4. **Measure, don't eyeball**: compare sizes, positions, colours, timings and switch points on both sites with the same script, then compare screenshots of each state (load, scrolled, scrolled back, hovered, open). Also compare **layer order**: wherever images or elements overlap, check which one is on top (hit-test a grid of points on both sites). Measure each element after its appear animation has finished.
5. **Report honestly**: list what was verified, what could not be measured, and any guess (mark it "to confirm with Ahmed"). Show Ahmed before publishing.

## Quality bar
- For every task, follow current best practice for that kind of work, and check how the top benchmark websites handle the same thing.
- When designing, building, enhancing or deciding anything, measure it against the best Framer Marketplace portfolio templates that fit this site: https://www.framer.com/marketplace/templates/categories/portfolio/
- If someone else has done something better (a feature, an animation, an interaction…), suggest it, with a link or example. Suggestions follow the approval rules below: propose first, build only once approved.
- Use these rules with judgment: decide when a benchmark check or a suggestion is worth it, and ask when unsure. Small best-practice details can go straight in; never make a big change without Ahmed's confirmation.

## Approval rules
- Copy the design faithfully. Before changing a design decision (layout, copy, motion), explain the issue and the proposed fix, then wait for approval.
- Ordinary coding fixes that do not change the approved design may proceed.
- Do not modify the Framer project or deploy anything without approval.

## Communication
- Keep responses brief.
