# Student portal — frontend

React + TypeScript + Tailwind. Built against your Prisma schema (User, Course,
Grade, Role). No mock data anywhere: every screen reads from your API.

## Install

```bash
npm create vite@latest student-portal -- --template react-ts
cd student-portal
npm install react-router-dom
npm install -D tailwindcss @tailwindcss/vite
```

Add the Tailwind plugin to `vite.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ plugins: [react(), tailwindcss()] });
```

Then copy the `src/` folder from here over your project's `src/`, and make a
`.env` file in the project root:

```
VITE_API_URL=http://localhost:5000
```

Make sure `src/main.tsx` imports the stylesheet:

```tsx
import './index.css';
```

## What lives where

```
src/
  types.ts              Types matching your Prisma models + the response shapes
  api/client.ts         fetch wrapper: base URL, Bearer token, error handling
  api/index.ts          every endpoint, in one object — your backend to-do list
  hooks/useFetch.ts     loading / error / data / reload for any request
  context/AuthContext   who's logged in; restores the session on refresh
  components/ui.tsx     Panel, Button, Field, GradePill, empty & error states
  layout/AppLayout      sidebar + header shell, nav changes by role
  routes/AppRoutes      auth gate and the admin-only guard
  pages/                Login, Dashboard, Courses, CourseDetail, Grades, Students
```

Only `api/client.ts` calls `fetch`. If you change how auth works, you change it
in that one file.

## The one thing to read first

`API-CONTRACT.md`. It lists every route the UI calls, what it sends, and what it
expects back. Build those in Express and nothing here needs editing.

## Things you may want to change

- **Grade scale.** `letterFor` and `bandFor` in `src/components/ui.tsx` assume
  0–100. Both are small functions at the top of the file.
- **Colours.** All of them are CSS variables in `src/index.css`.
- **Term average.** The dashboard prints whatever `average` your
  `/api/me/summary` sends. Computing it on the server keeps it identical
  everywhere it appears.

## How a page fetches data

Every page follows the same three lines:

```tsx
const { data, loading, error, reload } = useFetch(() => api.courses.list(), []);

if (loading) return <Loading />;
if (error) return <ErrorNote message={error} onRetry={reload} />;
```

After a write (create, enrol, post a grade) call `reload()` to pull fresh data
rather than editing local state by hand. Slightly more network traffic, far
fewer bugs while you're still building the backend.
