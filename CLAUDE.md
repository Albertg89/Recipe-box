# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Recipe Box is a personal recipe management SPA. Users browse thousands of recipes from the external MealDB API, save favorites, and author original recipes. The monorepo has two sub-projects:

- `Recipe_Box/` — React 19 + Vite frontend
- `supabase/` — Supabase CLI project (PostgreSQL schema management)

## Commands

### Frontend (`Recipe_Box/`)

```bash
npm run dev       # dev server with HMR at localhost:5173
npm run build     # production build → dist/
npm run lint      # ESLint check
npm run preview   # serve the dist/ build locally
```

### Supabase (`supabase/`)

```bash
npx supabase db push    # push migrations to linked project
npx supabase status     # show linked project info
```

Supabase project: ref `gbatqjmnqlrxaqgjuyik`, name: Recipe_box.

No test framework is configured (no Jest, Vitest, or React Testing Library).

## Architecture

### Routing (`src/App.jsx`)

React Router v7. All routes except `/` and `/auth` are protected by `<ProtectedRoute>`, which redirects unauthenticated users to `/auth`. Auth state comes from `AppContext`. Catch-all `*` renders `ErrorPage`.

### State management (`src/context/AppContext.jsx`)

Single `AppContext` holds the full app state: `user`, `favorites`, `myRecipes`, `loading` (keyed object), and `appError`. Exposes auth functions (`register`, `login`, `logout`), profile functions (`updateProfile`, `deleteAccount`), favorites functions (`addFavorite`, `removeFavorite`, `isFavorite`), and recipe functions (`createRecipe`, `updateRecipe`, `deleteRecipe`).

**Always consume via `useApp()` hook** — never call `useContext(AppContext)` directly.

### Auth — current state

Auth is **in-memory + localStorage only** — no Supabase Auth SDK. `registeredUsers` is persisted to `localStorage`. On `register()`, a UUID is generated client-side and the user is also written to the Supabase `users` table via `userService`. On `login()`, credentials are matched against `localStorage`; if found, favorites and recipes are fetched from Supabase.

### Service layer (`src/services/`)

All Supabase communication uses **Axios against the Supabase REST API** (PostgREST). There is no `@supabase/supabase-js` client.

- `api.js` — Axios instance configured with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- `recipeService.js` — CRUD for `recipes` table; `ingredients` and `instructions` are stored as JSON strings in `text` columns
- `favoritesService.js` — CRUD for `favorites` table; MealDB recipe ID stored as `mealdb_id` (string); local object shape has `supabaseId` (row PK) and `id` (parsed int from `mealdb_id`)
- `userService.js` — create/get/update `users` table rows

### Database schema (`supabase/reference/curr_db_schema.sql`)

Three tables (all in `public` schema):
- `users` — id (UUID, matches auth user), `first_name`, `last_name`, `user_name`, `email`
- `recipes` — user-authored recipes; `ingredients` + `instructions` stored as JSON strings; `cuisine` maps to the frontend `area` field
- `favorites` — saved MealDB recipes; keyed by `mealdb_id` string

### Component conventions

Each page in `src/pages/` has a paired `.css` file. Shared components in `src/components/` follow the same pattern. `PageShell` wraps authenticated pages with the `Nav` bar.

### Design rules

- Color palette is fixed — do not deviate from `app_outline/pages/Design_colors.png`
- All destructive actions must show `ConfirmModal` before executing
- Error/success feedback uses local `useState` with string prefix: `"error: ..."` or `"ok: ..."` for conditional styling

### Data sources

- **MealDB API** — external read-only API used by Browse and RecipeDetail pages
- **Supabase REST** — auth (partial), favorites, and user-created recipes
- `src/data/mockRecipes.js` — local mock data for development

### Env vars (`.env.local` in `Recipe_Box/`)

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### Wireframes

Page wireframes are in `app_outline/pages/`. Full user journey is in `app_outline/user_journey.md`.
