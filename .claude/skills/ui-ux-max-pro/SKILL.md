---
name: ui-ux-max-pro
description: High-end UI/UX execution standard for this Task Manager app (Next.js + React + framer-motion, "Charcoal & Ember" design system in src/app/globals.css). Load this BEFORE writing or editing ANY component, page, layout, or style in this repo — building a new feature UI, redesigning a screen, "improving"/"polishing"/"making it look better", adding hover/transition/animation, fixing spacing or alignment, or reviewing someone else's UI work. Trigger on these even when the user doesn't say "UI/UX" explicitly: "build a component", "redesign this", "polish the design", "add animation", "make this look better/cleaner/more premium", "fix the layout", "this looks off", "add a modal/card/button/empty state". Pushes for production-grade visual hierarchy, consistent use of the existing design tokens, accessible contrast, responsive layout, purposeful framer-motion micro-interactions, and real empty/loading/error states instead of placeholder stubs.
---

# UI/UX Max Pro

You're working inside Taskit, a dark-first SaaS task manager with a deliberate
"Charcoal & Ember" identity (near-black surfaces, a single vivid orange accent,
glassmorphism cards). The design system already exists as CSS custom
properties in [src/app/globals.css](../../../src/app/globals.css) — color,
spacing, radius, shadow, and easing tokens are all defined there for both dark
and light mode. The single biggest failure mode in UI work on this repo is
inventing new one-off values (a random `#333`, an untokenized `border-radius:
12px`, an ad-hoc `ease-in-out`) instead of reusing what's already there. Read
the relevant block of globals.css before styling anything, and reuse its
tokens (`var(--bg-card)`, `var(--radius-lg)`, `var(--shadow-md)`,
`var(--transition)`, etc.) rather than hardcoding values. If a value you need
genuinely doesn't exist yet, add it as a token near its siblings instead of
inlining a magic number — that keeps dark/light theming and future redesigns
centralized.

Treat every UI task as shipping a real product surface, not a sketch. Before
you call the work done, walk through the checks below — not as a checklist to
recite back, but as the lens to actually look at what you built through.

## Visual hierarchy and layout

Every screen should have one clear focal point; everything else recedes.
Group related elements with proximity and shared containers rather than
borders/dividers everywhere. Use the existing scale of surfaces
(`--bg-app` → `--bg-surface` → `--bg-card`) to express elevation instead of
arbitrary shadows. Check alignment on a real grid — if paddings or gaps look
close-but-not-quite, they're wrong; pick one spacing value and apply it
consistently rather than eyeballing slightly different numbers in sibling
elements.

Always design for the responsive range, not just the viewport you're staring
at. Check how a layout degrades at narrow widths (sidebar collapse, card
stacking, truncated text with proper `text-overflow`) — a component that only
works at desktop width isn't finished.

## Color and contrast

This app's whole identity rests on orange being *rare and meaningful* —
primary actions, active states, focus rings. If multiple things on a screen
are orange, the accent has stopped meaning anything; demote secondary actions
to `--text-secondary` / `--border-color` treatments. Check text-on-background
contrast against WCAG AA (4.5:1 body text, 3:1 large text/UI components) —
`--text-muted` in particular is easy to misuse on low-contrast surfaces.
Never let color alone carry a status (todo/in-progress/completed,
priority levels) — pair it with an icon, label, or shape so the UI still
works for color-blind users and in a quick glance.

## Typography and spacing

Reuse `--font-family` and keep a clear, limited type scale: not every heading
needs a new font-size. Line-height should loosen as text gets smaller
(tight for large headings, airier for body copy). Spacing should come from a
consistent step scale, not arbitrary pixel values — if you're about to write
`margin-top: 13px`, stop and ask whether `8px`/`12px`/`16px`/`24px` (or this
repo's token equivalents) already covers it.

## Motion (framer-motion is already installed — use it with intent)

Animation here should clarify state changes, not decorate. Good targets:
entrance/exit for cards, modals, and list items (`AnimatePresence` +
`layout`), hover/tap feedback on interactive elements, and smooth transitions
between loading/loaded/empty states. Reuse `--transition`'s cubic-bezier feel
(snappy-but-soft) rather than linear or bouncy defaults that clash with the
rest of the app. Keep durations short (150–300ms for micro-interactions,
slightly longer for layout shifts) — animation that makes the user wait is a
regression, not polish. Respect `prefers-reduced-motion` for anything beyond
subtle opacity/color transitions. Avoid animating properties that aren't
GPU-cheap (`transform`/`opacity` yes; animating `width`/`top`/`box-shadow`
directly, no — animate a transform or use `layout` instead).

## States you're not done without

A component isn't finished when the happy path looks good. Before considering
UI work complete, explicitly handle:
- **Empty state** — not a blank area; something that explains what goes here
  and how to add the first item, styled consistently with the rest of the app.
- **Loading state** — skeletons or a spinner that matches the surface it sits
  on, not a layout jump when data arrives.
- **Error state** — a real message with a recovery action, not a silently
  broken UI or a raw thrown error.
- **Interactive states** — hover, focus-visible (keyboard focus rings matter —
  don't strip `outline` without replacing it), active/pressed, and disabled
  should all be visually distinct and use `--border-focus`/`--primary-*`
  tokens consistently.

## Reviewing existing UI work

When asked to review rather than build, go through the same lenses above and
call out concrete instances (file + line) rather than generic praise or
vague "could be more polished" notes. Prioritize: broken contrast/accessibility
> inconsistent tokens/hardcoded values > missing states > motion/micro-interaction
polish. Suggest the specific token or pattern to use instead, pointing at
where it's already used elsewhere in the codebase when possible.
