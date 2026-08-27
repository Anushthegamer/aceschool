# Edison OS

A student productivity *WebOS* — a full desktop environment that runs in the browser. Built for the Stardance WebOS 1 hackathon.

**Live demo:** deploy with `npm run build && npm run preview`

---

## What is this?

Edison OS is a browser-based operating system for students. It has:

- A real desktop with wallpaper, clock, desktop icons, and a dock
- **22 apps** that each open in their own draggable, resizable window
- All data stored client-side in `localStorage` — no account, no backend
- No login wall. It just works.

It started life as "The Planner," a Supabase-backed school productivity app. This version strips out the auth, the server, and the routing, and rebuilds everything as a windowed desktop.

## Apps

| Category | Apps |
|----------|------|
| Productivity | Dashboard, Notes, Focus Timer, Flashcards, Study Planner, Calendar |
| School | Grades, Report Card, GPA Projector, Schedule, Assignments, Assessments, Goals |
| School life | Hall Pass, Locker, Bus Tracker, Lunch Menu, Clubs, Time Blocks, Resources |
| System | Calculator, Settings |

## Stack

- React 18 + Vite 5 + TypeScript
- Tailwind CSS (custom space-themed design)
- Radix UI primitives + lucide icons
- sonner for toast notifications

## Running it

```sh
npm install
npm run dev
```

Build for production:

```sh
npm run build
npm run preview
```

## How windows work

The core is `WindowManagerContext` (`src/contexts/WindowManagerContext.tsx`). It keeps an array of open windows — position, size, z-index, minimize/maximize state. The `Window` component in `src/components/window/Window.tsx` handles dragging (title bar) and resizing (bottom-right corner).

Every app lives in `src/components/apps/` and is registered in `src/components/desktop/DesktopIcon.tsx`. Adding a new app = one component + one registry entry.

## Devlogs

- [Devlog 1 — Converting a Lovable App into a WebOS](devlog-01.md)
- [Devlog 2 — Building All 22 Apps and the Desktop Experience](devlog-02.md)
- [Devlog 3 — Cleaning House: Rewriting for Real](devlog-03.md)

## Author

Ramskandh Thirandasu ([@Anushthegamer](https://github.com/Anushthegamer))