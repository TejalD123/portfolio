# Tejal Dalvi — Portfolio Frontend

React + Tailwind CSS frontend for the Data Science / ML portfolio, built to work with the
Express + MongoDB backend you already have.

## Stack

- React 19 + Vite
- Tailwind CSS (custom color tokens, light/dark theme via CSS variables)
- React Router (public site + hidden admin routes)
- Framer Motion (scroll reveals, hero motion, micro-interactions)
- Axios (talks to your Express API)
- lucide-react (icons)

## Getting started

```bash
npm install
cp .env.example .env   # then edit values if needed
npm run dev
```

The dev server runs on `http://localhost:5173` by default. Make sure your backend
(`portfolio-backend`) is running — default expected at `http://localhost:5000`.

## Environment variables (`.env`)

| Variable          | Description                                                             |
|--------------------|---------------------------------------------------------------------------|
| `VITE_API_URL`     | Base URL of your Express backend, no trailing slash.                     |
| `VITE_ADMIN_PATH`  | The hidden admin URL path. Keep this secret — never linked publicly.     |

## Public site

Everything visitors see lives at `/`:

- **Hero** — name, title, bio, availability badge, social links, profile photo
- **About** — headline + bio + quick stats, pulled from your Profile data
- **Tech Stack** — full-bleed plum-tinted section, grouped skill pills
- **Projects** — grid of project cards pulled from `/api/projects`
- **Case Studies** — auto-generated from any project that has case-study content filled in
- **Contact** — working contact form that posts to `/api/contact`, plus footer

Individual project pages live at `/projects/:id` with the full case-study write-up
(problem statement, approach, dataset, results, learnings) and gallery images.

If no data exists yet in MongoDB, the site still renders cleanly with sensible
placeholder copy so it never looks broken.

## Admin panel (hidden, no public links)

The whole admin area lives under whatever you set `VITE_ADMIN_PATH` to
(default: `/xk9-manage-portfolio-2026`). It is **not linked from any public page** —
you have to type the URL directly. Treat that URL like a password.

- `.../login` — sign in, or create the first admin account (needs `ADMIN_REGISTER_SECRET`
  from your backend `.env`)
- `...` (root) — dashboard with quick stats
- `.../projects` — list, edit, delete projects
- `.../projects/new` / `.../projects/:id/edit` — full project form (case study fields,
  thumbnail + gallery upload, tech stack, links)
- `.../profile` — edit your bio, skills, socials, profile photo, resume PDF
- `.../messages` — inbox for contact form submissions, mark as read / delete

Auth uses the JWT your backend issues; the token is stored in `localStorage` and
attached automatically to admin requests.

## Changing the theme colors

All theme colors are CSS variables in `src/index.css` (`:root` for light, `.dark` for
dark) plus matching Tailwind tokens in `tailwind.config.js`. Update both places if you
want to swap the palette.

## A note on the hidden admin URL

Changing `VITE_ADMIN_PATH` is the main way to keep the admin area private. For real
production use, also make sure:

- `ADMIN_REGISTER_SECRET` on the backend is a long, random value known only to you
- You register your own admin account once, then avoid leaving the register form
  reachable/guessable
- You're serving the frontend over HTTPS so the JWT isn't sent in plaintext
