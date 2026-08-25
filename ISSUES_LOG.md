# Strike — Issues & Resolutions Log

## Table of Contents
1. [Production Errors](#production-errors)
2. [UI Bugs Fixed](#ui-bugs-fixed)
3. [Code Cleanup](#code-cleanup)
4. [Feature Improvements](#feature-improvements)

---

## Production Errors

### 1. `ERR_CONNECTION_REFUSED` on deployed Render link
**Error:**
```
localhost:5000/api/auth/login:1 Failed to load resource: net::ERR_CONNECTION_REFUSED
Auth error: Object
```

**Cause:** The deployed frontend was trying to reach `http://localhost:5000/api` which doesn't exist on Render's server. The API base URL in `client/src/services/api.js` was hardcoded to `localhost:5000`.

**Resolution:** The app already had a `VITE_API_URL` env var override in `api.js`:
```js
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
```
On Render, `VITE_API_URL` must be set in the service's Environment variables pointing to the deployed backend URL. This was already configured in the user's existing Render deployment — the error appeared when the baseURL was incorrectly changed to `/api` without matching the deployment architecture.

**Lesson:** Don't change the API base URL pattern without understanding the existing deployment setup. If the frontend and backend are on different origins, you need an absolute URL (set via env var). If same-origin, `/api` works.

---

### 2. `@import must precede all other statements` (PostCSS / Vite build error)
**Error:**
```
[vite:css][postcss] @import must precede all other statements (besides @charset or empty @layer)
@import url('https://fonts.googleapis.com/css2?family=DM+Sans...')
```

**Cause:** `client/src/index.css` had `@import "tailwindcss"` on line 1 and a Google Fonts `@import url(...)` on line 2. Tailwind CSS v4 expands `@import "tailwindcss"` inline, pushing the Google Fonts import below all generated Tailwind rules. CSS spec requires `@import` before all other statements.

**Resolution:** Removed the redundant `@import url(...)` from `index.css`. The Google Fonts are already loaded via `<link>` tags in `client/index.html` (lines 9-11), which is the correct and faster approach.

**Files changed:** `client/src/index.css`

---

### 3. Google Classroom Sync — 500 Internal Server Error
**Error:**
```
:5000/api/google/sync:1 Failed to load resource: the server responded with a status of 500
Classroom.jsx:85 Error syncing: AxiosError: Request failed with status code 500
```

**Cause:** Multiple issues in `server/controllers/googleController.js`:
1. **`user` variable scope bug:** The `user` variable was declared inside the `try` block (line 85). If the error occurred before that line (e.g., missing credentials, DB error), the `catch` block referenced `user` which was `undefined`, causing a `ReferenceError` that masked the real error.
2. **Weak token expiry detection:** Only checked `error.code === 401` but Google API errors surface status at `error.response.status`, and the error messages vary (`invalid_grant`, `Token used too late`, `invalid_token`, etc.).
3. **No credential validation:** `createOAuth2Client()` silently passed `undefined` values when env vars were missing.

**Resolution:**
- Moved `user` declaration before `try` block so it's always accessible in `catch`
- Added `null` check on `user` after the query
- Expanded token expiry detection to check `error.code`, `error.response.status`, and 5 different error message patterns
- Added credential presence logging in `createOAuth2Client()`
- Added step-by-step `console.log` markers for debugging each phase of the sync
- Wrapped token cleanup in its own `try/catch` so it can't throw again

**Final outcome:** After these fixes, the sync endpoint correctly returned `"Google Classroom access expired. Please reconnect."` — meaning the stored Google OAuth tokens in the database were expired/invalid. The user needed to disconnect and reconnect Google Classroom to get fresh tokens.

**Files changed:** `server/controllers/googleController.js`

---

### 4. Switch Toggle — Visual feedback not working
**Error:** Auto-delete toggle switch functional but didn't visually show the "on" state (no colored background).

**Cause:** Tailwind CSS v4 `@theme` block in `index.css` was missing `--color-primary`. The switch used `data-[state=checked]:bg-primary` but Tailwind v4 needs `--color-*` prefix in the `@theme` block for `bg-primary` to resolve. Without it, the class had no effect.

**Resolution:** Added `--color-primary: #0d9488` and other color tokens to the `@theme` block:
```css
@theme {
  --color-primary: #0d9488;
  --color-primary-foreground: #ffffff;
  --color-background: #0f1219;
  --color-foreground: #e2e8f0;
  /* ... */
}
```

**Files changed:** `client/src/index.css`

---

## UI Bugs Fixed

### 5. Notes.jsx — Broken CSS classes
**Issue:** Three CSS `rgba()` classes had unclosed parentheses on lines 367, 395, and 449 of `Notes.jsx`.

**Resolution:** Fixed the unclosed parentheses in all three instances.

**Files changed:** `client/src/pages/Notes/Notes.jsx`

---

### 6. Notes section — Content scrolling with fixed header
**Issue:** Scrolling the notes content caused the header/navbar to scroll away.

**Resolution:** Changed the outer container from `min-h-screen` to `h-screen overflow-hidden`, added `overflow-hidden` to content panels, added `shrink-0` to headers, and made the content area `flex-1 overflow-hidden`.

**Files changed:** `client/src/pages/Notes/Notes.jsx`

---

## Code Cleanup

### 7. Invalid import in api.js
**Issue:** `useNavigate` was imported in `api.js` — a service file, not a React component.

**Resolution:** Removed the unused import.

**Files changed:** `client/src/services/api.js`

---

### 8. ~50 debug console.log/console.warn statements
**Issue:** Debug logging left in production code across client and server.

**Resolution:** Removed debug `console.log`/`console.warn` from:
- `client/src/components/editor/RichEditor.jsx` (~17 statements)
- `server/controllers/googleController.js` (8 statements)
- `server/controllers/taskController.js` (2 statements)
- `server/controllers/habitController.js` (2 statements)
- `server/server.js` (environment variable dump)

**Preserved:** Server startup logs and MongoDB connection logs (standard operational logging).

---

### 9. Unused imports across components
**Issue:** Multiple unused imports adding to bundle size.

**Resolution:** Removed:
- `StickyNote` from `Notes.jsx`
- `Zap` from `Classroom.jsx`
- `BigCalendar`, `momentLocalizer` from `Calendar.jsx`
- Duplicate `Trash2Icon` from `Tasks.jsx` (replaced usage with existing `Trash2`)

---

### 10. Deleted unused files
- `client/src/context/AuthContext.jsx` — unused context
- `client/src/App.css` — empty file

---

## Feature Improvements

### 11. Landing page redesign
**Issue:** Landing page was too basic.

**Resolution:** Complete redesign with:
- Animated gradient blobs following mouse cursor
- Floating particles
- Live dashboard preview with stat cards, progress bars, tasks
- Testimonials section
- Step-by-step "How it Works" section
- Stats bar
- Gradient CTA section
- Trust badges
- Staggered CSS animations

**Files changed:** `client/src/pages/Landing.jsx`

---

## Known Issues

### Google Classroom Sync — Tokens Expired
**Status:** Working as designed. When tokens expire, the sync returns a clear message: "Google Classroom access expired. Please reconnect." User must disconnect and reconnect via the Classroom page.

**Possible causes of token expiration:**
- User revoked access from Google account settings
- Refresh token not used for 6+ months
- Google Cloud project OAuth consent screen was reset

---

## Deployment Notes

### Render Environment Variables Required
| Variable | Value |
|----------|-------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong random string |
| `PORT` | 5000 |
| `NODE_ENV` | development |
| `CLIENT_URL` | Frontend URL |
| `VITE_API_URL` | Backend API URL (set at build time on Render) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret |
| `GOOGLE_REDIRECT_URI` | Backend URL + `/api/google/callback` |

### Key Architecture Note
- Frontend and backend are on **separate origins** — `VITE_API_URL` env var on Render points the frontend to the backend
- `VITE_API_URL` must be set **at build time** (Vite embeds it during `npm run build`)
- Local development uses the fallback `http://localhost:5000/api`
