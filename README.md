# Free Together

Landing page for **Free Together** — a scheduling app that shows friend groups the
exact windows when everyone is free. Built from the Claude Design handoff bundle
as a React + TypeScript + Vite site.

## Tech stack

- **React 18** + **TypeScript**
- **Vite** for dev server and build
- **Plain CSS** — global design tokens in `src/styles/tokens.css`, component-scoped
  styles via CSS Modules. The design's exact tokens (the "Confetti" system: cream
  canvas, deep-plum ink, friend-colour accents, chunky outlines + hard offset
  shadows, Fredoka display type) are ported verbatim.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
  main.tsx, App.tsx           app entry + composition
  styles/tokens.css           design tokens, theme variants, base + utilities
  theme/colors.ts             friend-colour palette (CSS-var references)
  types/css.ts                CSSProperties extended with custom-property keys
  data/                       content + visual data (calendar, steps, features)
  hooks/                      useScrollReveal, useNavScrolled
  components/
    layout/                   Nav, Footer
    sections/                 Hero, HowItWorks, Features, ClosingCTA
    ui/                       Button, SectionHead, Eyebrow, Avatar, AvatarStack, Logo
    visuals/                  CalendarCard, InviteViz, ScheduleViz, OverlapViz,
                              FeatureDemo, Confetti
    icons/                    inline SVG icons
```

## Notes

- Four alternate palettes (`sunset`, `cool`, `candy`) live in `tokens.css` under
  `html[data-theme=...]` so a theme switcher can be added later. None ships today.
- The design tool's "Tweaks" panel was an authoring artifact and is intentionally
  not part of the product.
- Motion (sticker bob, free-slot pulse, scroll reveals) respects
  `prefers-reduced-motion`.
