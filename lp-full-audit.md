# VOYAGE HOLISTIQUE — Full Landing Page Audit
**Date:** 2026-07-01  
**Auditor roles:** Senior Luxury LP Auditor · CRO Expert · Mobile UX Specialist · Front-End Lead  
**Files audited:** index.html · styles.css (3740 lines) · script.js (264 lines)

---

## SCORES

| Dimension | Score |
|---|---|
| **Overall** | **54 / 100** |
| Desktop UX | 63 / 100 |
| Mobile UX | 51 / 100 |
| CRO | 40 / 100 |
| Luxury Visual | 60 / 100 |
| Technical Front-End | 48 / 100 |

---

## TOP 10 FIXES (Priority Order)

1. **[CRITICAL] Fix the WhatsApp message date** — script.js sends "du 6 au 13 août" but the page advertises "10–17 août". Every person who clicks WhatsApp gets the wrong dates.
2. **[CRITICAL] Add the programme / activities section** — 8 days with zero activities listed. The visitor has no idea what they are paying for.
3. **[CRITICAL] State the price** — Nowhere on the page does it say what this retreat costs. The form only asks for a "budget" range, which signals uncertainty and friction.
4. **[HIGH] Add social proof** — No testimonials, no participant photos, no Instagram posts, no before/after. A women's holistic retreat sells entirely on trust.
5. **[HIGH] Purge dead CSS** — ~800 lines of CSS reference sections (.why, .testimonial-grid, .philosophy, .luxury-gallery, .gallery, .scarcity, .included, .masonry, .benefit-grid, .activity-grid) that do not exist in the HTML.
6. **[HIGH] Consolidate the duplicate CSS architecture** — Five separate CSS layers override each other. 11 selectors are defined 2–3 times. This makes every future edit a hazard.
7. **[HIGH] Replace the ocean teal palette with a brand-consistent one** — #2BAFD9 / #32C6C6 (ocean tech blue) on CTA buttons and links conflicts with the forest-green-and-gold luxury retreat brand.
8. **[HIGH] Add `scroll-margin-top` to all anchor sections** — Nav links scroll every section behind the fixed header. Only `.value-prop` has `scroll-margin-top`.
9. **[MEDIUM] Restore hero copy and trust pills on mobile** — Both are `display: none` on mobile. The visitor sees a title and two buttons, nothing in between. The value proposition is invisible.
10. **[MEDIUM] Add FAQ content that handles real objections** — Price, programme, transport, cancellation, languages, what to bring — none of these are answered.

---

## SECTION-BY-SECTION DIAGNOSIS

---

### SECTION 1 — HERO

#### Desktop
**What works:**
- The two-column grid (content left, offer card right) is a well-proven layout.
- The parallax background zoom (`heroZoom` animation) creates cinematic depth.
- The staggered `heroFadeUp` entrance animations are premium.
- The glassmorphism offer card is elegant.
- Typography hierarchy is correct: eyebrow → h1 → copy → trust pills → CTAs.

**Problems:**

| # | Problem | Why it hurts | Priority |
|---|---|---|---|
| H1 | The hero h1 desktop font-size is `clamp(3.8rem, 5.6vw, 6rem)` via a `min-width: 761px` override, but the base `.hero h1` is already `clamp(4.5rem, 6.15vw, 5rem)` and then another rule sets it to `clamp(3.65rem, 7.2vw, 8.1rem)`. Three definitions cascade. The final value on a 1280px screen is ~3.8rem. That is not a luxury headline — it is small. | Weak first impression. A luxury retreat h1 should be 5–7rem at 1280px. | High |
| H2 | The btn-primary color on the hero is `#2BAFD9` (ocean blue) on white. This reads as a SaaS product button, not a luxury holistic retreat. | Brand mismatch, undermines luxury feeling. | High |
| H3 | The hero-offer-card on desktop shows duplicate content: location, dates, group size are all already in the hero-content left column. The card adds zero new information. | Cognitive redundancy. The card should show price or exclusivity signal. | Medium |
| H4 | `background-attachment: fixed` is set in the hero redesign. On iOS Safari, `fixed` background-attachment causes visible repaint jank during scroll, even on desktop Safari. | Performance and polish. | Medium |

#### Mobile
**What works:**
- Full-height layout with vertical column flow is correct.
- `display: none !important` on hero-offer-card correctly removes the card.
- The stacked CTAs fill full width — good touch targets.

**Problems:**

| # | Problem | Why it hurts | Priority |
|---|---|---|---|
| M1 | `.hero-copy { display: none }` — The "8 jours pour retrouver votre équilibre" copy is hidden. Mobile visitors get: label + date + h1 + buttons. No value proposition text at all. | On mobile, copy converts. The tagline alone does not sell the retreat. | High |
| M2 | `.hero-trust { display: none }` — The trust pills ("8 jours · 7 nuits", "20 places", "10–17 août") are hidden. | The scarcity signal ("20 places maximum") is invisible on the device most likely to browse first. | High |
| M3 | Mobile h1 is `clamp(1.35rem, 6.8vw, 2.5rem)`. At 390px viewport this gives ≈26px — three lines of small text. For a premium retreat, the h1 should dominate. | Poor luxury feeling. | Medium |
| M4 | The mobile hero overlay at line 2015–2019 is a second `background:` rule inside the 760px query, overriding another `background:` rule 30 lines earlier (lines 1946–1950). The final overlay is a vertical top-dark gradient. The strong teal tint in the base overlay (line 3428–3432) also applies. Three overlays stack. Result is unpredictable. | Visual inconsistency, potential legibility issues. | Medium |
| M5 | Hero bottom padding is `48px`. CTA is `margin-top: auto`. If the viewport is very short (≤640px), content may overflow below the CTA. | Content clipping risk on short phones. | Low |

---

### SECTION 2 — TRUST BAND

**What works:**
- Glassmorphism floating card overlapping the hero is a strong premium signal.
- "8 / jours", "10–17 / août 2026", "20 max / participantes" are clear and relevant.

**Problems:**

| # | Problem | Why it hurts | Priority |
|---|---|---|---|
| TB1 | On mobile (760px), the trust band becomes a 2-column grid. The third item ("20 max") wraps to its own row under columns 1 and 2, creating an asymmetric 2+1 layout. | Looks broken. | Medium |
| TB2 | `.trust-band { box-shadow: var(--shadow) }` — `--shadow` is never defined in `:root`. It defaults to `none`. No shadow renders. | Minor visual regression. | Low |

---

### SECTION 3 — "POUR QUI" (Value Prop)

**What works:**
- 6-card grid with icon illustrations is a solid pattern.
- Reassurance block ("Vous n'avez besoin d'aucune expérience") is a good objection handler.
- The WhatsApp secondary CTA below the primary is smart.

**Problems:**

| # | Problem | Why it hurts | Priority |
|---|---|---|---|
| VP1 | On mobile, value-grid is `minmax(0, 1fr)` — a single column of 6 cards. That is a very long scroll before the user reaches any other content. | Loss of mobile visitors before they reach the expert or location sections. | High |
| VP2 | Card h3 titles ("Charge mentale", "Fatigue persistante") match perfectly. But the card text is in second person ("Vous pensez...") while the h3 is abstract. Slight tonal inconsistency. | Low — but worth noting for conversion polish. | Low |
| VP3 | Value card hover adds `box-shadow: inset 0 3px 0 #32C6C6` (teal top border) via the final CSS override at line 3530–3532. This teal appears from nowhere in a cream-and-gold page. | Brand inconsistency. | Medium |

---

### SECTION 4 — EXPERTISE

**What works:**
- The concept (targeting specific situations) is good CRO.
- 4-card grid with italic emphasis on pain points is readable.

**Problems:**

| # | Problem | Why it hurts | Priority |
|---|---|---|---|
| E1 | Background is `#D8C5B9` (rose-beige). This is the only section with this background. It creates a jarring visual break between the cream/white sections above and below. | Lacks section consistency. | Medium |
| E2 | `border-radius: 64px` on the section creates pill-shaped visual container. On mobile it reduces to 40px. The surrounding margin (`margin: 0 clamp(16px, 3vw, 40px)`) is fine but the pill shape feels disconnected from the rest of the page's rectangular card aesthetic. | Style inconsistency. | Low |
| E3 | Cards hover with `border-color: var(--summer-orange)` — which resolves to `#C9A227` (gold). Fine. But other section card hovers use the `#32C6C6` teal border via the palette override. Inconsistent hover language. | Micro-inconsistency. | Low |

---

### SECTION 5 — DR. LAILA (Expert Section)

**What works:**
- Sticky image column on desktop (`position: sticky; top: 110px`) — WAIT, this is overridden. See problem below.
- 2×2 feature card grid is clean.
- Gold-left-border blockquote is premium.
- Photo cropped to center top is correct for a portrait shot.

**Problems:**

| # | Problem | Why it hurts | Priority |
|---|---|---|---|
| EX1 | `.expert-container` is defined twice: lines 2370–2377 (`minmax(0, 0.9fr) minmax(0, 1.1fr)`) and lines 2640–2648 (`42% 58%`). The second wins. The first is dead code. The second has a wider right column which is actually better — but the conflict is a maintenance trap. | Technical debt, future-edit hazard. | Medium |
| EX2 | `.expert-image-wrapper` is defined twice: first with `position: sticky; top: 110px` (lines 2383–2385), then overridden to `position: relative` (line 2670). The sticky behavior is completely dead — the photo does not stick on scroll. | Lost premium UX opportunity. On a long text section, sticky portrait photo would be elegant. | High |
| EX3 | `.expert-title` has `font-size` set with `!important` at line 2692. This is a sign the cascade is broken — someone forced a value through. | Code smell, maintenance hazard. | Low |
| EX4 | `@media (max-width: 992px)` responsive override for expert (line 3232) coexists with a `@media (max-width: 900px)` override (line 2456). At a viewport of 901px–992px, only the first responsive rule applies, giving a single-column layout but with a max-height on the image. At 900px the second rule also kicks in. Two overlapping breakpoints. | Gap risk at 901px–992px range. | Medium |
| EX5 | On tablet (992px), the expert image switches to `order: -1` (image first). This contradicts the desktop layout where image is on the left. Actually on desktop the image is column 1 (left), so on tablet `order: -1` is correct. But the section-heading also changes to `text-align: center`. Text is centered but the blockquote override says `text-align: left`. Mixed alignment on tablet. | Inconsistent tablet layout. | Low |

---

### SECTION 6 — LIEU / GALLERY (Location Section)

**What works:**
- The 3-column animated gallery (scrollUp/scrollDown columns) is genuinely premium and unique.
- The gold vertical divider is an elegant luxury touch.
- The text content (3 sub-topics with Serif h3) is well structured.
- Mobile conversion to horizontal carousel with arrows is smart.

**Problems:**

| # | Problem | Why it hurts | Priority |
|---|---|---|---|
| L1 | On mobile (≤760px), `.location { background: var(--beige) }` is set in the mobile spacing section (line 2627–2629). But on desktop the location background is `var(--cream)`. Cream and beige are close but this means the section background color actually changes between mobile and desktop. | Subtle inconsistency. May cause visible flash if orientation changes. | Low |
| L2 | The gallery mobile breakpoint is `768px` (lines 2951, 3314) while all other mobile breakpoints use `760px`. At viewports 761px–768px: gallery shows mobile carousel mode (overflow-x, snap) but the surrounding location text is still in the desktop single-column mode (from 1120px breakpoint). The carousel breaks out of the section with `margin-inline: calc(50% - 50vw)` and there's no arrow-button positioning since the 760px mobile section spacing applies different padding. | Broken layout at 761px–768px. Likely never tested. | High |
| L3 | `location-cta` (the "Réserver ma place" button inside the location text) has no responsive hide rule. On mobile, a second CTA appears below the text. This is actually positive for CRO — but the spacing may be awkward since `.location-text { gap: clamp(24px...) }` creates the spacing and the CTA sits inside that same flex column. | Minor layout concern. | Low |
| L4 | The gallery hover-pause (`mirleft-gallery-scroll:hover .mirleft-gallery-track { animation-play-state: paused }`) only works on devices with hover. Touch devices see continuously moving images with no pause affordance. | Mobile UX concern. | Low |
| L5 | `@media (max-width: 1120px)` for location-container is defined TWICE: lines 2927–2948 and lines 3293–3306. Both set `grid-template-columns: minmax(0, 1fr)` and hide the divider. The second is dead duplicate code. | Technical debt. | Medium |

---

### SECTION 7 — FAQ

**What works:**
- Clean accordion with `+` icon rotation on open.
- Font size is `clamp(1.2rem, 1.8vw, 1.55rem)` — readable and premium.
- Serif font on question text is elegant.

**Problems:**

| # | Problem | Why it hurts | Priority |
|---|---|---|---|
| F1 | There are TWO completely different CSS accordion implementations in the file. The first (lines 2492–2575) uses `max-height: 0 → 400px` for open/close. The second (lines 3152–3229) uses `grid-template-rows: 0fr → 1fr`. The `.accordion-item` selector is defined in both blocks with different styles. The HTML uses `.accordion-item.open .accordion-content { max-height: 400px }` logic (JS at script.js adds/removes `.open` class). The second `grid-template-rows` accordion block completely overrides `.accordion-content` — so the max-height transition is now dead, replaced by the grid transition. The JS adds `.open` which triggers `grid-template-rows: 1fr` — but also sets `max-height: 400px` on a now-grid-animated container. Mixed animation signals. | May cause jarring expand animation on some browsers. Maintenance nightmare. | High |
| F2 | The FAQ has only 5 questions. Key buying objections go unanswered: What is the price? What activities are included? What should I bring? How do I get to Mirleft? What is the cancellation policy? Is English/Arabic spoken? | Direct conversion damage. Unanswered objections = lost sales. | Critical |
| F3 | The `.faq` section has `background: var(--cream)` (same as most other sections). It visually blends into the reservation section above. No visual break. | Weak section delineation. | Low |

---

### SECTION 8 — RÉSERVATION (Form)

**What works:**
- Background image with dark overlay creates drama before the form.
- Full-width single column on mobile prevents overflow.
- The submit button triggers WhatsApp redirect — clever for low-friction follow-up.
- Field validation with `aria-invalid` is correct.

**Problems:**

| # | Problem | Why it hurts | Priority |
|---|---|---|---|
| R1 | `.reservation::before` (lines 3604–3609) adds a pseudo-element overlay on top of `.reservation-overlay` (the existing overlay div). Two overlays stack. The result is unpredictable double-darkening of the background image. | Visual quality issue. The image may appear too dark. | Medium |
| R2 | The form has 7 fields (name, phone, email, city, budget, guests, message). This is significant friction for a "first contact" form. Industry standard for retreat inquiry forms: 3–4 fields maximum (name, phone/email, message). | High friction = lower form completion rate. | High |
| R3 | The "Budget" dropdown has 5 options from "Moins de 8 000 DH" to "Plus de 15 000 DH". Asking for a budget BEFORE telling the visitor the price is psychologically backwards. It primes the visitor to choose low-budget before they know if the retreat is worth it. | Undermines perceived value, reduces budget range selected. | High |
| R4 | The form submission sends data to Google Sheets via `GOOGLE_SCRIPT_URL` and then redirects to WhatsApp. If the Google Script request fails or is slow, the WhatsApp redirect may happen before data is saved. The JS likely fires WhatsApp redirect on success only (not audited deeper), but the UX of leaving the page mid-form is jarring. | Trust concern. | Medium |
| R5 | `background-attachment: fixed` on the reservation section (line 2583) causes severe performance issues on iOS Safari. The background image repaints on every scroll frame. | Major performance degradation on iPhone, which is likely 60%+ of this audience. | High |
| R6 | No price anywhere in the reservation section. The eyebrow says "Votre place vous attend" but no price confirmation. A visitor filling the form has no idea what they are committing to. | Abandonment risk. | Critical |

---

### SECTION 9 — MISSING SECTIONS (Critical CRO Gap)

The HTML is missing entire sections that the CSS was written for. These sections must be built.

| Missing Section | CSS Exists | CRO Impact |
|---|---|---|
| Programme / Activities (8 jours, que fait-on ?) | Yes (`.activities-grid`, `.activity-card`) | **Critical** — visitors can't commit to 8 days without knowing what happens |
| Testimonials (previous participants) | Yes (`.testimonial-grid`, `.testimonial-card`) | **Critical** — zero social proof on the page |
| What's included (meals, accommodation, activities) | Yes (`.included-grid`, `.included-item`) | **High** — price without inclusion list is meaningless |
| Price display | No | **Critical** — hiding the price increases bounce rate |

---

### SECTION 10 — FOOTER

**What works:**
- 4-column layout is comprehensive.
- Social links, WhatsApp, email, and legal links are all present.
- Legal modals (privacy + mentions légales) are properly implemented.

**Problems:**

| # | Problem | Why it hurts | Priority |
|---|---|---|---|
| FT1 | Footer `padding-bottom: 100px` desktop, `110px` mobile. This is to avoid sticky button overlap. But on desktop there are no sticky buttons overlapping the footer — the sticky reserve button disappears when the reservation section is in view (no JS controls this). The 100px bottom padding is pure waste on desktop. | Excess whitespace at the bottom. | Low |
| FT2 | Social link `href="#"` on Instagram and Facebook. Dead links visible to all visitors. | Trust damage if clicked. | Medium |
| FT3 | Footer on mobile is a 1-column stack of 4 sections. Each section shows full link lists. The total scroll length in the footer alone is ~600px on mobile. | Not a conversion issue (footer is discovery territory) but poor density. | Low |

---

### SECTION 11 — STICKY BUTTONS

**What works:**
- Sticky reserve + WhatsApp pair is a proven pattern.
- Bottom-right positioning avoids content obstruction.

**Problems:**

| # | Problem | Why it hurts | Priority |
|---|---|---|---|
| S1 | On mobile, `.sticky-reserve` is `left: 14px; right: 78px; bottom: 14px`. The `.sticky-whatsapp` is `right: 14px; bottom: 14px`. This means the sticky reserve button is almost full-width (screen_width - 14px left - 78px right). It overlaps the page content from 14px off the left edge. At 375px viewport: button is 375 - 14 - 78 = 283px wide. That is very aggressive. | Content overlap at bottom of each section on mobile. | High |
| S2 | The sticky reserve button color is controlled by a deeply nested `:not(.btn):not(.brand):not(.social-link)` rule chain at lines 3732–3739. This is because the global `a:not(.btn)...` color rule overrides it to `#2BAFD9`. The `:not` chain is fragile — adding a new ancestor class can break it. | Maintenance hazard. | Low |
| S3 | No JS controls sticky button visibility. The button is always visible, even when the user is already on the reservation section. This is redundant and creates visual noise. | Minor UX concern. | Low |

---

## TECHNICAL FRONT-END DIAGNOSIS

### T1 — CRITICAL: WhatsApp URL has wrong dates
**File:** script.js, line 3–4  
**Problem:** `WHATSAPP_URL` encodes "du 6 au 13 août" but the event is "10–17 août 2026".  
**Impact:** Every WhatsApp contact receives incorrect dates. This is a live production bug.  
**Fix:** Change `%206%20au%2013%20ao` to `%2010%20au%2017%20ao`.

### T2 — CRITICAL: Duplicate CSS — 5 architectural layers
**File:** styles.css  
**Problem:** The file has been extended 4 times without removing old code. Five layers are identifiable:
1. Base styles (lines 1–764) 
2. Component styles (lines 764–1566)
3. Hero redesign overrides (lines 1566–2060, comment: "Hero redesign overrides 2026-06-30")
4. New section CSS (lines 2062–2900)
5. "Ocean summer palette refresh" overrides (lines 3343–3740)

This means: `.hero-overlay` has 4 different background definitions. `.btn-primary` has 3 color definitions. `.accordion-header` has 3 complete block definitions. Every change requires understanding which layer wins.

### T3 — HIGH: Dead CSS for non-existent sections
CSS defined for HTML that does not exist:
- `.why`, `.benefit-grid`, `.benefit-card` (lines 820–898)
- `.philosophy`, `.philosophy-image`, `.philosophy-panel` (lines 777–983)
- `.luxury-gallery` (lines 982–998)
- `.map-card` (lines 1000–1019)
- `.included`, `.included-grid`, `.included-item` (lines 1021–1048)
- `.testimonial-grid`, `.testimonial-card`, `.video-card` (lines 1050–1107)
- `.gallery`, `.masonry`, `.gallery-item` (lines 1109–1131)
- `.accordion details` / `summary` (old native accordion, lines 1132–1156)
- `.scarcity`, `.scarcity-panel`, `.price-highlight` (lines 910–955)
- `.activity-grid` (old 4-col grid, lines 959–963)

**Estimated dead CSS:** ~550 lines (15% of file).  
**Impact:** Page load, maintenance, cascade confusion.

### T4 — HIGH: Duplicate responsive breakpoints
`@media (max-width: 1120px)` for `.location-container` appears at lines 2927 and 3293 — identical rules.  
`@media (max-width: 768px)` for location appears at lines 2951 and 3314 — partially overlapping rules.  
`@media (max-width: 760px)` appears 9 times in the file. Some blocks override properties set by blocks earlier in the same breakpoint file.

### T5 — HIGH: Breakpoint inconsistency (760 vs 768 vs 767)
- Most mobile rules: `max-width: 760px`
- Gallery mobile mode: `max-width: 768px`
- Hero offer card dead block: `max-width: 767px`
- Activities grid: `max-width: 480px`

At 761px–768px: gallery enters mobile carousel mode but hero and section spacing remain in desktop mode. The gallery carousel blows out (`margin-inline: calc(50% - 50vw)`) with no scroll-margin protection.

### T6 — MEDIUM: `prefers-reduced-motion` gallery rule fires animations
Lines 2911–2925: the `@media (prefers-reduced-motion: reduce) and (min-width: 769px)` block applies `animation: scrollUp 34s linear infinite !important`. This KEEPS the animation running for users who requested reduced motion. The intent is correct (infinite loop needs to keep running for seamless track) but the `!important` on a `prefers-reduced-motion` block is semantically incorrect — it should pause, not force.  
**Fix:** Use `animation-play-state: paused` or remove the block entirely (browser default is to not override unless `!important` is used).

### T7 — MEDIUM: `will-change: transform` on 3 gallery tracks
Each `.mirleft-gallery-track` has `will-change: transform`. Three tracks run simultaneously. This creates 3 GPU compositor layers promoted simultaneously. On mid-range Android devices (the 40%+ of this audience's device pool), this creates memory pressure.  
**Fix:** Keep `will-change` but remove it on mobile (where tracks don't animate).

### T8 — MEDIUM: Dual overlay on `.reservation`
The `.reservation-overlay` div (position: absolute) provides the dark overlay. Lines 3604–3609 also add a `::before` pseudo-element with an identical overlay. Both stack. The background image gets double-darkened.  
**Fix:** Remove the `reservation::before` rule from the ocean-summer palette block.

### T9 — MEDIUM: `scroll-margin-top` only on `.value-prop`
`.value-prop { scroll-margin-top: 120px }` (line 504). All other sections (`#expert`, `#accommodation`, `#faq`, `#reservation`) have no `scroll-margin-top`. Clicking any nav link scrolls the section heading under the fixed header (~70px).  
**Fix:** Add `scroll-margin-top: 100px` to all sections with anchor IDs.

### T10 — LOW: Meta Pixel not configured
`META_PIXEL_ID = "PASTE_META_PIXEL_ID_HERE"` — the pixel never fires. All `fbq()` calls are silently dropped. If this page is running paid ads (Facebook/Instagram for a women's retreat in Morocco — almost certainly yes), conversion data is lost.

### T11 — LOW: `--shadow` variable undefined
`.trust-band { box-shadow: var(--shadow) }` and other elements reference `--shadow`. This variable is not in `:root`. CSS degrades to `box-shadow: none`.

### T12 — LOW: Hero `background-attachment: fixed` + iOS Safari
Line 1641: `background-attachment: fixed` on `.hero`. This causes the infamous iOS Safari repaint bug — background image repaints on every pixel of scroll, causing frame drops.  
**Fix:** Already handled for mobile with `background-attachment: scroll` in the 760px query, but the threshold should also cover tablets (up to 1024px) and use feature detection.

---

## WHAT SHOULD BE KEPT UNCHANGED

- The animated 3-column gallery (scrollUp/scrollDown) — genuinely premium and unique
- The hero two-column layout with glassmorphism offer card on desktop
- The staggered `heroFadeUp` entrance animations
- The sticky image for Dr. Laila's portrait (once properly restored with `position: sticky`)
- The accordion design (once the duplicate implementation is resolved)
- The gold vertical divider in the location section
- The legal modal implementation (privacy/mentions légales)
- The scroll progress bar at the top
- The parallax effect on the hero background (`--hero-parallax` CSS variable)
- The `@keyframes heroZoom` slow background zoom — very premium
- The trust band floating card overlapping the hero
- The exit intent modal concept (needs email capture option added)
- The WhatsApp sticky button
- Dr. Laila's section structure (image + features grid + blockquote)

---

## WHAT SHOULD BE IMPROVED

- Hero h1 size on desktop (too small — push to 5–6.5rem at 1280px)
- Hero copy and trust pills visibility on mobile (currently hidden)
- Button colors: replace `#2BAFD9` teal on CTA buttons with either forest green `#1F3D36` or pure white with gold accent — consistent with the retreat brand
- Mobile h1 size (2.5rem max is too small for luxury impact)
- Form field count (reduce from 7 to 4: name, phone/email, guests, message)
- Budget field: remove it or move after a price reveal — asking for budget before showing price anchors low
- Add `scroll-margin-top: 100px` to all sections
- Expert sticky image (fix the overridden position: sticky)
- Trust band 3rd item on mobile (needs to span or the layout needs a 3-column row)
- FAQ content (minimum 8 questions covering the full purchase journey)
- Footer social links (replace `href="#"` with real URLs)
- Sticky reserve button width on mobile (currently nearly full width, too invasive)
- Replace all `var(--shadow)` references with defined shadow values

---

## WHAT SHOULD BE REMOVED

- Dead CSS for non-existent sections: `.why`, `.benefit-grid`, `.philosophy`, `.luxury-gallery`, `.testimonial-grid`, `.video-card`, `.gallery`, `.masonry`, `.included`, `.scarcity`, `.price-highlight`, `.activity-grid` (old), `.map-card`, `.play-button`, `.accordion details/summary` (~550 lines)
- The "Hero redesign overrides 2026-06-30" comment block — merge properly instead
- Duplicate `.location-container` responsive block at lines 3293–3306 (exact duplicate of 2927–2940)
- The dead `@media (max-width: 767px)` hero-offer-card block (lines 393–397) with its commented code
- The `reservation::before` dual overlay (lines 3604–3609)
- The `<comment>` in the dead hero-offer-card block that says "REMOVED FOR MOBILE FIX" — misleading since the element is still hidden at line 2011
- Orphaned `.mini-form` CSS (references a mini form that does not exist in HTML)
- The `prefers-reduced-motion` gallery block that incorrectly forces animations with `!important`
- `.accordion details` / `.accordion summary` / `.accordion p` native accordion CSS (the HTML uses the `div/button` pattern)
- The CSS for `.luxury-badge`, `.brand-mark` (referenced in CSS but not in HTML)

---

## FINAL RECOMMENDATION

This page has **a strong visual foundation with a critical content gap**. The design language (serif typography, animated gallery, glassmorphism hero, gold accents) is appropriate for a premium women's retreat. The hero on desktop is genuinely beautiful.

However, **the page cannot convert at its current state** for three reasons:

1. **The visitor cannot understand what they are buying.** There is no programme, no daily schedule, no activities description. 8 days is a significant time commitment. The visitor will bounce to find more information and not come back.

2. **There is no social proof.** A women's holistic retreat in Morocco run by a doctor requires testimonials, participant photos, or at minimum a quote from a previous edition. Without this, the only trust signal is the doctor's biography.

3. **The price is hidden and the WhatsApp message sends wrong dates.** These are hard blockers. A visitor who clicks WhatsApp gets the wrong event information. A visitor who completes the form has no idea what they are agreeing to financially.

**Immediate production fixes (before any traffic):**
1. Fix the WhatsApp date (1 minute, 1 line of code)
2. Add the price (or price range with inclusions)
3. Add a programme section describing the 8-day experience

**Short-term structural work:**
4. Add 3–5 testimonials or participant quotes
5. Expand the FAQ to cover real objections
6. Purge dead CSS and consolidate the 5-layer cascade

**Brand consistency work:**
7. Remove the teal `#2BAFD9` / `#32C6C6` from CTA buttons and card hovers — replace with forest green and gold to match the Mirleft, Morocco, nature aesthetic
