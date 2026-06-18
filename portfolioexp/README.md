# 🚀 Portfolio Platform

A production-ready, full-stack dynamic portfolio built with **Next.js 14 (App Router)**, **TypeScript**, **Prisma ORM**, **PostgreSQL**, and **Tailwind CSS**.

All content is stored in a database and manageable via a secure admin panel — zero hardcoded content.

---

## ✨ Feature Overview

| Area | Details |
|------|---------|
| **Auth** | JWT via `jose` (Edge-compatible), httpOnly cookies, bcrypt passwords |
| **Admin Panel** | Full CRUD for Profile, Projects, Skills, Experience, Blog, Messages, Settings |
| **Public Site** | Home, About, Projects (filter + detail), Experience, Blog, Contact |
| **API** | RESTful route handlers: `/api/profile`, `/api/projects`, `/api/skills`, `/api/experience`, `/api/blog`, `/api/messages`, `/api/settings` |
| **DB** | 11 Prisma models: User, Profile, Skill, Project, Experience, Education, Certification, Blog, Testimonial, Message, Settings |
| **Performance** | Server Components, ISR (`revalidate`), `next/image`, skeleton loaders |
| **Bonus** | GitHub API sync, view counter, like system, Zod validation |

---

## 🗂️ Project Structure

```
portfolio/
├── prisma/
│   ├── schema.prisma          # All 11 models
│   └── seed.ts                # Dev seed data
│
├── src/
│   ├── app/
│   │   ├── (public)/          # Public-facing pages
│   │   │   ├── page.tsx       # Home – hero, featured projects, skills
│   │   │   ├── about/         # Bio, skills breakdown, experience, education
│   │   │   ├── projects/      # Listing with filter + [slug] detail page
│   │   │   ├── experience/    # Timeline, education, certifications
│   │   │   ├── blog/          # Tag-filtered listing + [slug] reader
│   │   │   └── contact/       # Contact form + social links
│   │   │
│   │   ├── (admin)/           # Protected admin panel
│   │   │   └── admin/
│   │   │       ├── login/     # JWT login page
│   │   │       ├── dashboard/ # Stats overview + recent messages
│   │   │       ├── profile/   # Edit profile
│   │   │       ├── projects/  # CRUD projects (new / [slug]/edit)
│   │   │       ├── skills/    # Add/delete skills with live bars
│   │   │       ├── experience/# Manage work history & education
│   │   │       ├── blog/      # Write/edit/publish posts
│   │   │       ├── messages/  # Read contact submissions
│   │   │       └── settings/  # SEO & theme settings
│   │   │
│   │   └── api/               # Route handlers
│   │       ├── auth/login · logout
│   │       ├── profile/
│   │       ├── projects/ · [slug]/ · [slug]/like · sync-github
│   │       ├── skills/ · [id]
│   │       ├── experience/ · [id]
│   │       ├── blog/ · [slug]
│   │       ├── messages/ · [id]
│   │       └── settings/
│   │
│   ├── components/
│   │   ├── public/            # Navbar, Footer, ProjectCard, SkillBadge,
│   │   │                      #   ProjectFilter, ContactForm, LikeButton
│   │   ├── admin/             # AdminSidebar, AdminHeader, ProfileForm,
│   │   │                      #   ProjectForm, BlogForm, SkillsManager,
│   │   │                      #   SettingsForm, Delete* buttons
│   │   └── ui/                # Skeleton loaders
│   │
│   ├── lib/
│   │   ├── prisma.ts          # Singleton PrismaClient
│   │   ├── auth.ts            # signToken / verifyToken / cookie helpers
│   │   ├── api.ts             # ok / created / badRequest / … helpers
│   │   ├── middleware.ts      # withAuth / withAdmin wrappers
│   │   ├── validations.ts     # Zod schemas for all inputs
│   │   └── utils.ts           # cn / formatDate / slugify / truncate
│   │
│   ├── services/
│   │   └── github.ts          # fetchGitHubRepos / syncGitHubProjects
│   │
│   ├── hooks/
│   │   └── useApi.ts          # useApi<T> / useMutation<T> hooks
│   │
│   └── types/
│       └── index.ts           # Shared TS types & Prisma enum re-exports
│
├── docker-compose.yml         # Local PostgreSQL
├── .env.example               # All required env vars
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

---

## 🛠️ Quick Start

### 1 — Prerequisites
- Node.js 20+
- Docker (for local PostgreSQL) _or_ an existing PostgreSQL instance

### 2 — Clone & Install

```bash
git clone <repo-url> portfolio
cd portfolio
npm install
```

### 3 — Environment

```bash
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT_SECRET at minimum
```

### 4 — Start Database

```bash
docker compose up -d
```

### 5 — Migrate & Seed

```bash
npm run db:generate   # generate Prisma client
npm run db:migrate    # run migrations (creates tables)
npm run db:seed       # insert demo data
```

### 6 — Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — public portfolio  
Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) — admin panel

**Default credentials (from seed):**
- Email: `admin@portfolio.dev`
- Password: `admin123`

---

## 🔐 Authentication Flow

```
POST /api/auth/login
  ├── Validates email + password with Zod
  ├── Looks up user in DB
  ├── bcrypt.compare(password, hash)
  ├── Signs JWT (HS256, 7d expiry) with jose
  ├── Sets httpOnly cookie "portfolio_token"
  └── Returns { token, user }

Edge Middleware (src/middleware.ts)
  └── On every /admin/* request:
      ├── Reads "portfolio_token" cookie
      ├── Verifies JWT
      └── Redirects to /admin/login if invalid

API Route Handlers
  └── withAdmin() wraps handler:
      ├── Checks Authorization header OR cookie
      ├── Verifies JWT
      └── Calls handler with { user: JWTPayload }
```

---

## 📡 API Reference

All endpoints return `{ success: boolean, data?, error? }`.

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | Public | Login, sets cookie |
| POST | `/api/auth/logout` | Public | Clears cookie |

### Profile
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/profile` | Public | Fetch profile |
| PUT | `/api/profile` | Admin | Update profile |

### Projects
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/projects` | Public | List (pagination, filter) |
| POST | `/api/projects` | Admin | Create project |
| GET | `/api/projects/:slug` | Public | Get + increment views |
| PUT | `/api/projects/:slug` | Admin | Update |
| DELETE | `/api/projects/:slug` | Admin | Delete |
| POST | `/api/projects/:slug/like` | Public | Increment likes |
| POST | `/api/projects/sync-github` | Admin | Import from GitHub |

### Skills
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/skills?category=FRONTEND` | Public |
| POST | `/api/skills` | Admin |
| PUT | `/api/skills/:id` | Admin |
| DELETE | `/api/skills/:id` | Admin |

### Blog
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/blog?published=true&tag=typescript` | Public |
| POST | `/api/blog` | Admin |
| GET | `/api/blog/:slug` | Public |
| PUT | `/api/blog/:slug` | Admin |
| DELETE | `/api/blog/:slug` | Admin |

### Messages
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/messages` | Public (contact form) |
| GET | `/api/messages` | Admin |
| PATCH | `/api/messages/:id` | Admin (mark read) |
| DELETE | `/api/messages/:id` | Admin |

---

## 🌟 Bonus Features

### GitHub Sync
Set `GITHUB_USERNAME` and optionally `GITHUB_TOKEN` in `.env`, then:
```bash
curl -X POST http://localhost:3000/api/projects/sync-github \
  -H "Authorization: Bearer <your-jwt>"
```
Or click "Sync from GitHub" (wire up in admin dashboard).

### View Counter
Every `GET /api/projects/:slug` increments `views` atomically via Prisma `{ increment: 1 }`.

### Like System
`POST /api/projects/:slug/like` — add rate-limiting via Upstash Redis or Vercel Edge Config in production.

---

## 🚀 Production Deployment (Vercel + Supabase)

```bash
# 1. Create Supabase project → get connection string
# 2. Set env vars in Vercel dashboard
#    DATABASE_URL=postgresql://...
#    JWT_SECRET=<32+ random chars>
#    NEXT_PUBLIC_APP_URL=https://yourdomain.com

# 3. Deploy
vercel --prod

# 4. Run migrations against production DB
DATABASE_URL=<prod-url> npx prisma migrate deploy
DATABASE_URL=<prod-url> npm run db:seed
```

---

## 🧪 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **App Router + Server Components** | Zero-JS data fetching, better SEO, smaller bundles |
| **ISR (`revalidate: 3600`)** | Pages rebuild hourly — fast CDN delivery + fresh data |
| **jose over jsonwebtoken** | Edge-compatible (no Node crypto), works in middleware |
| **Zod validation** | Type-safe, co-located, gives clear API error messages |
| **Singleton Prisma client** | Prevents connection pool exhaustion on hot reloads |
| **Route Groups `(public)` / `(admin)`** | Separate layouts without affecting URL structure |
| **`withAdmin` wrapper** | DRY auth logic — one line to protect any route handler |
