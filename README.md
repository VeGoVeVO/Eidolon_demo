# Eidolon Frontend Presentation

This repository contains the Vite + React client that powers the Eidolon virtual try-on experience. It omits proprietary backend services, cloud integrations, and automation so the code can be shared for the Mobile Application course deliverable.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
4. Preview the production build locally:
   ```bash
   npm run preview
   ```

## Testing & Linting

- `npm test` runs the unit test suite with Vitest.
- `npm run lint` runs ESLint on the source folder.
- `npm run format` formats JS/JSX/CSS inside `src/` using Prettier.

## Project Structure

- `src/`  Application source organized by feature (pages, components, contexts, services, utils).
- `public/`  Static assets served as-is.
- `vite.config.js`  Vite configuration.
- `tailwind.config.js` & `postcss.config.js`  Styling pipeline settings.
- `vitest.config.js`  Unit test configuration.

Backend endpoints are still referenced (e.g., `/api/...`) so the UI flows remain realistic. Replace those URLs or mock them as needed for demonstrations.
