# Devlog 1 — Converting a Lovable App into a WebOS

**Date:** August 26, 2026
**Time spent:** ~3 hours
**Mood:** productive

## What I did

I started with an existing React app I'd built on Lovable — "The Planner," a school productivity suite for Edison Middle School students. It had notes, flashcards, a pomodoro timer, grades, and a bunch of other tools, all behind Supabase auth. Cool app, but it was just a normal web app with a sidebar. Not a WebOS.

The Stardance WebOS 1 hackathon requires multiple draggable windows, a custom design, and no password gate. So I needed to fundamentally change how the app worked.

### The big architectural shift

The original app used React Router with 24 routes, each page wrapped in a `ProtectedRoute` component that checked Supabase auth. I ripped all of that out. No more auth, no more routing. The entire `App.tsx` went from 84 lines of route definitions to 15 lines that just render a `<Desktop />`.

Instead of pages, everything now lives inside draggable windows. I built a `WindowManagerContext` that tracks every open window — its position, size, z-index, whether it's minimized or maximized. Clicking a window brings it to front. Dragging works by tracking mouse offsets. Resizing is a simple corner handle.

### What got built

- **WindowManagerContext** — the brain. Manages an array of `WindowState` objects. Handles open/close/focus/minimize/maximize/resize.
- **Window component** — the chrome. Title bar with close/minimize/maximize buttons, drag handle, resize corner. Has a little scale-in animation when opening.
- **Desktop** — the shell. Space-themed wallpaper with stars and aurora glows. A clock widget at the top. Desktop icons in a grid.
- **Taskbar** — the dock. macOS-style frosted glass bar at the bottom. Shows open windows, system clock, and a start menu.

### Apps converted

I kept all the original app logic but stripped out every Supabase call. Everything now uses `localStorage` through a custom `useLocalStorage` hook. If a student adds notes, they stay in the browser. No server needed.

12 apps in the first pass: Dashboard, Notes, Pomodoro, Flashcards, Study Planner, Calculator, Grades, Schedule, Assignments, Goals, Resources, Settings.

### Lessons learned

- The hardest part wasn't building the window manager — it was deciding what the "desktop" should feel like. I went through three wallpaper designs before landing on the space theme.
- `localStorage` is underrated for hackathon projects. Students don't need cloud sync for a demo. They need their data to persist when they close the tab.
- Removing auth was the right call. The original app had a login screen that blocked everything. Now it just opens. Much better UX for a hackathon demo.

## Commits

- `d3ab7ae` — initial conversion: window manager, desktop shell, 12 apps
