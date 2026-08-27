# Devlog 2 — Building All 22 Apps and the Desktop Experience

**Date:** August 26, 2026
**Time spent:** ~2 hours
**Mood:** in the zone

## What I did

After the first pass, I had 12 apps working as windows. But the original Planner had 24 pages — and I wanted every single one to be a windowed app. No features left behind.

### The missing 10

I went through every original page and converted them:

**Hall Pass** — Originally used Supabase to store pass records. Rewrote it to use localStorage with a live timer. The timer was the tricky part — had to use `setInterval` to update the display every second while a pass is active.

**Locker** — Dead simple. Just stores locker number and combination in localStorage. Added an eye toggle to show/hide the combination. Added a privacy notice since this is the only app that stores "sensitive" data.

**Bus Tracker** — This was a mock/demo page in the original app. I kept the demo data but made the progress bar animate smoothly. It auto-loops through the route.

**Lunch Menu** — Static data, no persistence needed. Just renders the weekly menu with dietary tags (veg, hot). Simple grid layout.

**Clubs** — CRUD page. Originally used Supabase `clubs` table. Converted to localStorage. Added a color picker — each club can have a custom color stripe.

**Time Blocks** — Time-blocking planner. Originally Supabase `time_blocks`. Now localStorage. Has a date picker, time range inputs, and a completion toggle. Shows total minutes planned vs done.

**Report Card** — Hardcoded demo data. Shows a printable grades table with 7 subjects, 4 marking periods, and an overall GPA badge. Added a print button.

**GPA Projector** — Interactive calculator. Students drag sliders for 7 subjects and see the projected GPA update in real time. Pure client-side math.

**Calendar** — Monthly grid with event dots. Shows a side panel with events for the selected day. Hardcoded sample events but the UI works.

**Assessments** — Test prep tracker. Lists upcoming assessments sorted by date. Each one has study topics, resources, notes, and a preparation progress bar.

### The desktop redesign

The original desktop was just a gradient background with icons. I wanted it to feel like a real OS. So I:

- Added a space wallpaper with stars (CSS radial gradients — no images needed)
- Put a big clock widget at the top center with a greeting
- Redesigned the taskbar as a centered dock with frosted glass
- Made the start menu a full app grid overlay instead of a sidebar list
- Added SVG icons for every app (hand-drawn, not icon libraries)

### Window polish

- Added scale+fade animation when windows open
- Made the resize handle a visual indicator (two little lines in the corner)
- Added an active window indicator dot on the taskbar tab
- Frosted glass title bars with backdrop blur

## What I learned

- Converting Supabase apps to localStorage is mostly just deleting `supabase.from()` calls and wrapping state in `useLocalStorage`. The hardest part was the Hall Pass timer — needed to think about how to update a live timer without re-rendering the whole component tree.
- SVG icons are better than icon libraries for a custom design. They're tiny, they scale perfectly, and they look like you actually designed the app.
- The dock with centered glass effect looks way better than a full-width taskbar. Learned this from looking at macOS screenshots.

## Commits

- `c6221d5` — 10 new apps + desktop redesign + window polish
