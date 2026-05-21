# Adil Mustafa — Portfolio (Next.js)

Professional portfolio built with **Next.js 15**, **Supabase PostgreSQL**, **Drizzle ORM**, and a password-protected **owner dashboard** at `/admin`.

## Features

- Modern dark portfolio UI with animations
- Dynamic content from PostgreSQL (projects, profile, services, skills, social links)
- Contact form messages stored in the database
- Owner dashboard: `/admin` (password protected)
  - **Site content** (`/admin/site`) — resume PDF upload, bio, Cloudinary images, social, services, skills
  - **Projects** (`/admin/projects`) — CRUD, **Active** (public) vs **Archived** (hidden), quick toggle
  - **Site content** — services, skills, and social links also support active/archived
  - View contact messages on dashboard

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in values (Supabase URL, keys, database URLs, admin password).

### 3. Database migrations

```bash
npm run db:generate   # generate SQL from schema
npm run db:migrate    # apply migrations to Supabase
```

Or push schema directly:

```bash
npm run db:push
```

### 4. Seed initial data

```bash
npm run db:seed
```

### 5. Run locally

```bash
npm run dev
```

- Portfolio: [http://localhost:3000](http://localhost:3000)
- Owner login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Admin sign-in uses `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` (or `.env.local`).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema without migration files |
| `npm run db:seed` | Seed portfolio data |

## Schema

Tables: `profile`, `projects`, `services`, `skills`, `social_links`, `contact_messages`

See `drizzle/schema.ts` for the full schema.

## Auth & routing

- Admin logic lives in **`proxy.ts`** (Next 16 convention).
- **`middleware.ts`** re-exports `proxy` for Next.js 15.5 compatibility.
- Dashboard routes also use a **server layout** guard at `app/admin/(dashboard)/layout.tsx`.

## Resume (public)

- Upload PDF in **`/admin/site`** → Cloudinary → auto-saved to database.
- Public site **Download resume** button uses **`/resume`**, which redirects to the latest stored file.

## Cloudinary uploads

Admin uploads go through `/api/admin/upload` (authenticated) into folder `adil-portfolio/`:

| Subfolder | Use |
|-----------|-----|
| `resume` | PDF resume |
| `projects` | Project screenshots |
| `avatar` / `hero` | Profile images |
| `icons` / `services` | Skill & service icons |

Set `CLOUDINARY_*` vars in `.env` (see `.env.example`).

## Visitor analytics (admin dashboard)

The owner dashboard tracks public engagement in Postgres (`analytics_events`):

| Event | When it fires |
|-------|----------------|
| Portfolio visit | Once per browser session on the home page |
| Resume download | Each hit to `/resume` |
| Load more projects | “Load more projects” button |
| Project details opened | “Read more” on a project card |
| Project link clicked | External link icon on a card |
| Contact form sent | Successful contact API submit |

Run `npm run db:push` after pulling to create the table. Counts show **all time**, **last 7 days**, and **last 30 days**, plus top projects and a recent activity feed.

## Deploy on Vercel

This app is **Next.js** (not Create React App). The build output is `.next`, not a `build/` folder.

1. **Framework preset:** In Vercel → Project → Settings → General → **Framework Preset**, choose **Next.js** (not Create React App).
2. **Output directory:** Leave **empty** or default — do not set `build`.
3. **Root `vercel.json`:** Committed with `"framework": "nextjs"` so Vercel uses the correct pipeline.
4. **Environment variables** (Production + Preview): add all keys from `.env.example`, especially:
   - `DATABASE_URL` (pooler, port 6543)
   - `DATABASE_URL` — transaction pooler (port 6543) from Supabase
   - `DIRECT_URL` (optional) — **session pooler** (port 5432). If omitted, the app derives it from `DATABASE_URL`. Do not use `db.[ref].supabase.co` on Vercel (ENOTFOUND).
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`
   - `CLOUDINARY_*`, `NEXT_PUBLIC_CLOUDINARY_*`
5. Push the latest `development` (or `main`) branch and redeploy.

If you still see `No Output Directory named "build"`, the dashboard is overriding `vercel.json` — switch Framework Preset to Next.js and clear **Output Directory**.

## Security notes

- Change `ADMIN_PASSWORD` and `SESSION_SECRET` before deploying
- Never commit `.env.local`
- Rotate Supabase keys if they were exposed
