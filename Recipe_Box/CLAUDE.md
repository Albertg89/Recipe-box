# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Recipe Box is a full-stack SPA for browsing, saving, and creating recipes. The frontend is React + Vite; the backend (planned) is Django + DRF with PostgreSQL. Recipe data is sourced from the MealDB external API.

## Frontend Commands

```bash
npm run dev       # start dev server with HMR
npm run build     # production build → dist/
npm run preview   # serve the dist/ build locally
npm run lint      # ESLint check
```

## Architecture

### Current state
The frontend scaffold lives in `src/`. `App.jsx` is still the Vite default template — the real page components have not been built yet. `react-router-dom` v7 is installed and ready for routing.

### Planned pages (wireframes in `skeleton/pages/`)
| Page | Purpose |
|---|---|
| Landing | Public intro, entry point for unauthenticated users |
| Sign Up / Log In | Single auth form that toggles between register and login |
| Home | Post-login hub |
| Browse Recipes | MealDB search by ingredient or meal name |
| Recipe | Full recipe detail (name, category, cuisine, ingredients, instructions) |
| Favorites | User's saved MealDB recipes |
| Create Recipe / My Recipes | User-authored recipes with full CRUD |
| Profile | View and edit user info; delete account |
| Contact Us | Support links (email, phone, GitHub, LinkedIn) |
| Error | Catch-all error state with Home button |

### Data sources
- **MealDB API** — external library for browsing/searching recipes
- **Django + DRF backend** (to be built) — handles auth, favorites, and user-created recipes stored in PostgreSQL

### Auth flow
Unauthenticated users → Landing → Auth form → Home. Logout returns the user to the Auth form.

## Design reference
Wireframe screenshots for every page are in `skeleton/pages/`. Consult them when building components. The full user journey descriptions are in `skeleton/user_journey.md`.
