# DESIGN.md

Direction document for this portfolio. It exists so that visual decisions have a
written reason instead of falling back to defaults. When a rule here conflicts
with a quick fix, this file wins or gets amended on purpose.

> **Author's note:** every value below was transcribed from what already exists
> in this codebase plus one explicit owner decision (ENERGY 3). Nothing here was
> invented to fill a template.

---

## Design Read

> Reading this as: **a personal developer portfolio** for people evaluating
> skill and taste (recruiters, clients, peers), in an **expressive editorial**
> visual language, dial **ENERGY 3 / RHYTHM 2 / MOTION 2**.

| Dial       | Value | Meaning here                                                                                      | Evidence it is already true                                                                                               |
| ---------- | ----- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **ENERGY** | **3** | The design says hello. Typography carries personality, not just information.                      | Delargo DT Cond **Bold** at `text-5xl → text-7xl`, a WebGL light source behind the hero                                   |
| **RHYTHM** | **2** | Sections vary, but the page stays one system. Two deliberate breaks, not eight different layouts. | Lazy-loaded sections with different compositions (logo loop, project grid, timeline), joined by a shared container + fade |
| **MOTION** | **2** | Motion reveals and orients. It never performs.                                                    | `BlurText` entrance, `LightRays` drift, scroll reveal, `Orb` on desktop only                                              |

Owner decision (2026-10-20): **ENERGY 3** was chosen explicitly over ENERGY 2.
The existing display font and WebGL layer already implied it; this file records
it so it is not re-litigated every session.

---

## Identity

**One sentence:** a developer who builds things that work, presented with the
confidence of an editorial cover rather than the politeness of a corporate deck.

**What must stay true:**

- Display type is **Delargo DT Condensed Bold**. It is the identity motif.
- The brand hue is **red**. It is the only accent.
- Both themes ship and both must look deliberate.

**What this is not:** a SaaS landing page. No pricing tiers, no "trusted by"
logo wall, no feature-card grid, no fake metrics.

---

## Typography

| Role                  | Face                                 | Size / weight                          | Why                                                                                                                       |
| --------------------- | ------------------------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Display (hero title)  | **Delargo DT Condensed** Bold        | `text-5xl` mobile → `text-7xl` desktop | Condensed bold reads as an editorial masthead, not a product headline. It gives the page a voice that Inter/Geist cannot. |
| Display (alt weights) | Delargo DT Condensed Regular / Black | on demand                              | Shipped alongside Bold; use only when a hierarchy step needs it.                                                          |
| Body / UI             | **Geist** sans                       | `text-base` body, `text-lg` greeting   | Neutral, highly legible at small sizes, and keeps the display font as the only loud voice.                                |

**Rule:** display face is for the hero title only. Everything else is Geist.
Two loud voices on one screen cancel each other out.

> **Open item (antislop R-06):** Geist is flagged by the antislop core as an
> AI-default sans. It is kept here **with this reason**: it is a body/UI face
> that must disappear behind Delargo, and swapping it would add a fourth voice
> without adding identity. If the body face ever needs to carry personality,
> revisit this row rather than silently changing the import.

---

## Color

Defined in `app/globals.css` as Tailwind v4 `@theme` tokens.

### Brand (the only accent)

| Token         | Value     | Use                                 |
| ------------- | --------- | ----------------------------------- |
| `primary-600` | `#dc2626` | CTA fill, active states             |
| `primary-700` | `#b91c1c` | CTA hover (see contrast rule below) |
| `primary-500` | `#ef4444` | Light-mode rays tint                |
| `primary-100` | `#fee2e2` | Tinted backgrounds, chips (light)   |

### Neutrals

| Theme | Page surface         | Primary text | Secondary text          |
| ----- | -------------------- | ------------ | ----------------------- |
| Dark  | `gray-950` `#030712` | `white`      | `gray-200` / `gray-300` |
| Light | `white` `#ffffff`    | `gray-900`   | `gray-600`              |

### Accent rule

**Red is the only accent.** One accent used at the key moment reads as intent;
the same accent on every element reads as a default. Concretely:

- Red belongs to: the primary CTA, the hero light source, the one active nav/hover state.
- Red does **not** belong to: body copy, borders on neutral cards, icon fills at rest.
- `secondary-*` (green) exists in the token file but is **not** part of this
  palette. Do not reach for it as a second accent unless this document is amended.

> **Open item (antislop R-29):** the Experience section's `Orb` is rendered with
> `hue={206}` (blue), which is a second accent outside this palette. It predates
> this document. Either bring it onto the brand red, drop it, or amend this file
> with a written reason for blue. Until then it is a known conflict, not an
> approved choice.

---

## Contrast (non-negotiable)

Verified with `antislop-human/contrast-check.py` against WCAG AA
(4.5:1 normal text, 3:1 large text).

| Pairing                                | Ratio      | Verdict                                   |
| -------------------------------------- | ---------- | ----------------------------------------- |
| white on `primary-600` `#dc2626`       | 4.83:1     | PASS (resting CTA)                        |
| white on `primary-700` `#b91c1c`       | 6.47:1     | PASS (CTA hover)                          |
| white on `primary-500` `#ef4444`       | **3.76:1** | **FAIL for 16px text**                    |
| white on CTA sheen, `primary-400` @14% | 4.53:1     | PASS — this is the shipped value          |
| white on CTA sheen, `white` @22%       | **3.64:1** | **FAIL — never do this**                  |
| white on CTA sheen, `white` @8%        | **4.43:1** | **FAIL — white sheens are unusable here** |

**Rule:** CTA hover darkens to `primary-700`. Never hover to `primary-500` for
text at `text-base` or smaller. If a lighter red is ever needed behind white
text, it must be large text (18px+ / 14px bold) or the text colour changes.

**Rule:** any translucent layer placed over the CTA fill counts as a background
for contrast. Compute the blended colour first, then check white against it.
A white sheen cannot be tuned to pass at any opacity that is still visible —
tint it with `primary-400` instead.

---

## Light sources and glow (dose caps)

The hero uses a real WebGL light source (`LightRays`), so light is part of the
composition, not decoration. That makes restraint more important, not less.

| Element                | Allowed | Reason                                                                                                                   |
| ---------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| `LightRays` background | ✅      | It _is_ the hero's subject. Dark = `#ffffff`; light = `#ef4444` at `saturation 0.55`, tighter `lightSpread`/`rayLength`. |
| Primary CTA shadow     | ✅      | Elevation marker (R-12): it lifts the one action off the page.                                                           |
| Social icon buttons    | ❌ flat | They sit over the rays. Adding shadow would compete with the CTA and triplicate the glow.                                |
| Cards, badges, borders | ❌      | No glow.                                                                                                                 |

**Dose cap:** at most **2** glow sources on the hero (rays + CTA). Cap is
deliberate — glow everywhere amplifies nothing.

### Glass

Glass is an **accent**, and the page spends exactly **two** blur elements' worth
of it: the floating navbar and its mobile overlay. That is the cap.

- **Allowed:** the floating navbar (`backdrop-blur`, the one sanctioned exception
  because it overlays scrolling content and genuinely needs to separate from it).
- **Not allowed in the hero as a fill:** both the CTA and the social icon buttons
  are solid. The social chips sit on a smooth gradient with no texture behind
  them, so blur produced no visible refraction while still costing a compositing
  layer each.
- **Allowed in the hero as a casing:** the CTA carries a translucent _edge_ —
  inset highlight/shadow bevel, a top sheen, and a brand halo — while its fill
  stays opaque. This is not a backdrop filter, so the R-10 count is unaffected.
- **Not allowed:** cards, modals, the main content container.

> **Amended 2026-10-20:** the social icon cluster was originally specified as the
> hero's glass accent. Measurement showed 3 blurred elements in the hero plus the
> navbar put the page over the R-10 cap, and the blur had no optical effect on a
> flat gradient. They are now solid tinted chips.

> **Amended 2026-10-20 (CTA casing):** the CTA is a solid brand core wrapped in a
> translucent casing. The split follows the rule stated by liqui.design — "glass
> is for a surface you act through, a solid fill is for something that carries
> meaning. A tinted lens contradicts itself." A tinted glass fill would also be
> optically dead here: nothing but flat background sits behind the button, so the
> blur would resolve to a grey box. The core keeps the meaning; the casing carries
> the material.
>
> **The casing sheen must be brand-tinted, not white.** Measured: a white sheen at
> 22% over `#dc2626` resolves to `rgb(228,86,86)` — it lifts green and blue by 48
> and turns the red pink — and drops white text to **3.64:1**, failing AA. Even
> white at 8% only reaches 4.43:1. `primary-400` at 14% resolves to
> `rgb(224,48,48)`, holds the hue, and keeps **4.53:1**. Rule: sheen opacity is
> chosen against the contrast table below, never by eye.

> **Open item (R-10, global):** certificate cards previously used
> `bg-card/50 backdrop-blur-sm` and were made solid for the same reason. Any
> remaining `backdrop-blur` on near-opaque surfaces (`bg-white/95`) is legacy and
> should be removed when that code is next touched.

---

## Shape

Radius communicates function, not decoration.

| Element             | Radius                                          | Why                                                                           |
| ------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------- |
| Primary CTA         | `rounded-full`                                  | One generous pill, reserved for the single most important action on the page. |
| Social icon buttons | `rounded-full`                                  | They are icon-only circles; a circle is the correct shape for a single glyph. |
| Buttons elsewhere   | `rounded-md` / `rounded-lg` (`Button` defaults) | Everything else stays conventional, so the hero CTA's pill reads as a choice. |
| Cards               | `rounded-xl` and up                             |                                                                               |

**Rule:** pill shape is reserved for the hero CTA and icon-only controls. If
every button, input, and badge is a pill, the shape stops signalling anything.

---

## Section rhythm

Current order, driven by content and by what a visitor needs to know first:

```
Hero → About → Certificates → Projects → Experience
```

This is not a template order. Each section answers a question:

| Section      | Question it answers                     |
| ------------ | --------------------------------------- |
| Hero         | Who is this?                            |
| About        | What is their stack and shape of skill? |
| Certificates | Is the skill credentialed?              |
| Projects     | Can they ship?                          |
| Experience   | Have they done it professionally?       |

**Rule (RHYTHM 2):** adjust composition between sections, not just background
colour. Alternating backgrounds alone is not rhythm.

---

## Motion

MOTION 2. Every animation must answer "what does this help the visitor
understand?"

| Motion                   | Purpose                                                  | Constraint                                                                      |
| ------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `BlurText` hero entrance | Directs attention to the one-sentence pitch              | Runs once; gated so it never replays over a painted title                       |
| `LightRays` drift        | Makes the light source feel alive, not a static gradient | Pauses when hidden or out of viewport; DPR capped at 1.5                        |
| Scroll reveal            | Orients the reader as new sections arrive                | Skipped entirely at `width <= 767px` (`use-mobile-width`); plays once on mobile |
| `Orb` (Experience)       | Ambient depth on large screens                           | Desktop only (`!isMobileWidth`); never on phone                                 |

**Not allowed:** simultaneous Fade Up + Float + Scale + Bounce on every element.
That is the template-animation pattern, not motion design.

`prefers-reduced-motion: reduce` skips WebGL initialisation and settles all
reveals. This is a requirement, not an enhancement.

---

## Theme

Both themes ship, and both must look deliberate (R-34).

- Default is dark (a developer portfolio is a legitimate dark-default context).
- Light mode is not a fallback: the light source re-tints to brand red, text
  stays `gray-900`/`gray-600`, borders drop to low-opacity black.
- A change that only works in one theme is a defect.

---

## Copy voice

- Specific over clever. Say what was built, not how impressive it is.
- No buzzwords: no "seamless", "next-generation", "powerful", "cutting-edge".
- No em dashes in UI text.
- CTAs name the action: "See My CV" beats "Learn More".

---

## Enforcement checklist

Run before shipping any visual change:

- [ ] Does every colour trace back to a token listed above?
- [ ] Is red still the only accent?
- [ ] Is the CTA still the only opaque, glowing, pill-shaped action?
- [ ] Is glass still limited to the social icon cluster?
- [ ] Do both themes render correctly?
- [ ] Does any hover/focus state fail WCAG AA via `contrast-check.py`?
- [ ] Does the motion have a stated purpose, and does it respect `prefers-reduced-motion`?

If a change cannot pass this list, either fix it or amend this document with the
reason in one line. A decision whose reason cannot be written in one line is not
a decision yet.
