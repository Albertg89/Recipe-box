# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Recipe Box is a full-stack SPA for browsing, saving, and creating recipes. The frontend is React 19 + Vite (in `Recipe_Box/`); the backend is Supabase (PostgreSQL + Auth), managed via the Supabase CLI in `supabase/`. Recipe browsing uses the external MealDB API.

## Commands

All commands run from `Recipe_Box/`:

```bash
npm run dev       # start dev server with HMR (localhost:5173)
npm run build     # production build → dist/
npm run preview   # serve the dist/ build locally
npm run lint      # ESLint check
```

Supabase CLI commands run from `supabase/` (uses npx):

```bash
npx supabase db push          # push local migrations to linked project
npx supabase status           # show linked project info
```

The Supabase project is already linked (ref: `gbatqjmnqlrxaqgjuyik`, name: Recipe_box).

There is no test framework configured — no Jest, Vitest, or React Testing Library.

## Architecture

### Routing (`src/App.jsx`)
React Router v7. All routes except `/` and `/auth` are wrapped in `<ProtectedRoute>`, which redirects unauthenticated users to `/auth`. Auth state comes from `AppContext`. Catch-all `*` renders `ErrorPage`.

### State management (`src/context/AppContext.jsx`)
Single React context (`AppContext`) holds the entire app state: `user`, `favorites`, `myRecipes`, and `registeredUsers`. Exposes functions for auth (`register`, `login`, `logout`), profile (`updateProfile`, `deleteAccount`), favorites (`addFavorite`, `removeFavorite`, `isFavorite`), and user recipes (`createRecipe`, `updateRecipe`, `deleteRecipe`).

Consume via the `useApp()` hook (exported from `AppContext.jsx`) — do not use `useContext(AppContext)` directly.

**Current state:** Auth is in-memory + localStorage (no Supabase Auth SDK). Data reads/writes use `src/services/api.js` — an Axios instance that calls the Supabase REST API directly. Supabase Auth integration is still pending.

### Database schema (`supabase/reference/testing_schema.sql`)
Three tables:
- `users` — mirrors Supabase Auth users, stores profile fields
- `recipes` — user-authored recipes (`user_id` FK → `users`)
- `favorites` — saved MealDB recipes, keyed by `mealdb_id` string (`user_id` FK → `users`)

### Component conventions
Each page in `src/pages/` has a paired `.css` file. Shared components live in `src/components/` (also paired `.css`). `PageShell` wraps authenticated pages with the `Nav` bar.

### Design rules
- Color palette is fixed — do not deviate from `skeleton/pages/Design_colors.png`
- All destructive actions (delete, remove) must show a confirmation modal (`ConfirmModal`) before executing
- Error messages must be human-readable; never expose raw technical details
- Error/success feedback uses local `useState` with string prefix convention: `"error: ..."` or `"ok: ..."` for conditional styling

### Data sources
- **MealDB API** — external read-only API for Browse/RecipeDetail pages
- **Supabase** — target backend for auth, favorites, and user-created recipes
- `src/data/mockRecipes.js` — local mock data (100+ recipes) for development

### Wireframes
Page wireframes are in `skeleton/pages/`. The full user journey is in `skeleton/user_journey.md`. Consult both when building or modifying pages.
