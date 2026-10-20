<!-- antislop:start -->

## antislop

For UI, copy, people, mobile layout, or code comments work, read the antislop core and then the skill for the task. Skills are installed globally at `~/.copilot/skills/`:

- Core rules (R-01 to R-38 + Delivery Gate): `antislop/SKILL.md`
- UI / visual: `antislop-ui/SKILL.md`
- Copy & text: `antislop-copywriting/SKILL.md`
- People (contrast, keyboard, focus): `antislop-human/SKILL.md`
- Mobile / responsive: `antislop-layoutmobile/SKILL.md`
- Code comments: `antislop-code/SKILL.md`

**This project's design direction lives in `DESIGN.md`.** Read it before any visual change; it is the source of truth for palette, type, dials, and dose caps.

Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits.

Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.

If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept.

<!-- antislop:end -->
