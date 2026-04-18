# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (opens browser automatically)
npm run build      # Build SSR production bundle → dist/ssr/
npm run start      # Run the built SSR server locally (cd dist/ssr && npm i && npm start)
```

No lint or test scripts are configured.

## Architecture

**Stack:** Vue 3 + Quasar v2 + TypeScript, built as an **SSR app** via `@quasar/app-vite`. The SSR server is Express (`src-ssr/server.ts`). Router uses **hash mode**.

**Backend:** All API calls hit `https://platamx-backend-1cvg.onrender.com/`. Two Axios instances are exported from `src/boot/axios.ts`:
- `apiNoAuth` — unauthenticated requests
- `apiAuth()` — factory that attaches the JWT from `localStorage.plataMX` (JSON `{ token: "..." }`) via request interceptor; emits a `auth-expired` custom DOM event on 401

**Auth flow:** Token stored in `localStorage.plataMX`. `MainLayout.vue` listens for `auth-expired`, `cart-updated`, `cart-optimistic`, and `user-logout` custom DOM events — this is the cross-component communication pattern used instead of a Pinia/Vuex store.

**Global state:** `src/stores/globalCollections.ts` is a plain Vue `ref` (not Pinia) holding the product collections prefetched at boot time by `src/boot/collections.ts`.

**Boot order** (declared in `quasar.config.js`): `collections` → `i18n` → `axios`

**Routing:** All routes live under `/:lang(es|en)/...` — every `router.push` must include `params: { lang: route.params.lang || 'es' }`.

**i18n:** Two locales — `src/i18n/es-MX/` and `src/i18n/en-US/`. The `LanguageSelector` component switches locale and updates the URL lang param. Menu items use `title` (Spanish) / `title_en` (English) fields.

**SSR guard pattern:** Any browser-only code (localStorage, window events, DOM) must be wrapped with `if (typeof window !== 'undefined')` or placed inside `onMounted()`.

**Quasar plugins in use:** `Notify`, `LocalStorage`, `Loading`, `Meta`

**Fonts:** Playfair Display (Google Fonts) + Switzer Variable (local WOFF2/WOFF/TTF in `src/css/fonts/`). Defined in `src/css/app.scss`.

**Validation:** `src/rules.js` exports a `validationRules()` factory used in all forms.

**Error parsing:** `src/utils/error.ts` exports `getBackendError(error, fallback)` — normalizes Axios errors into a display string.
