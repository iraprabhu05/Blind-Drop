# Blind Drop — Product Requirements Document (PRD)

> **Use this document as the single source of truth when building the project from scratch.**  
> Hand this entire file to Claude / any AI coding agent as the initial prompt.

---

## 1. Project Overview

**Blind Drop** is a music discovery platform where artists upload songs **anonymously** and listeners discover music based purely on sound. By stripping away artist identity, the platform eliminates name-recognition bias and lets the music speak for itself.

### Core Idea
- Artists upload a track → it appears in the discovery feed with **no name, no photo, no bio**
- Listeners vote, rate, and react purely based on what they hear
- After a track reaches a vote threshold, the artist is revealed

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 18 + TypeScript + Vite | SPA |
| Styling | Tailwind CSS v3 + shadcn/ui | Dark neon theme (violet + teal) |
| Backend | Node.js + Express.js | REST API, session-based auth |
| Database | **Supabase (PostgreSQL)** | Replaces MongoDB/Mongoose entirely |
| Auth | **Supabase Auth** | Email/password + OAuth (Google). Replaces Firebase Auth |
| File Storage | **Supabase Storage** | Audio files + album/cover art images. Replaces Unsplash |
| Email | Nodemailer (SMTP) | OTP verification emails |
| Dev Tools | GitHub Actions, ESLint, Prettier | CI/CD |

> **Important:** Do NOT use MongoDB, Mongoose, Firebase, or Unsplash. All persistence, auth, and storage goes through Supabase.

---

## 3. Supabase Schema (PostgreSQL)

### 3.1 Tables

```sql
-- Users (mirrors Supabase auth.users, extend with public profile)
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  email       text not null,
  role        text not null default 'user' check (role in ('user', 'artist', 'admin')),
  avatar_url  text default '',
  created_at  timestamptz default now()
);

-- Songs
create table public.songs (
  id            bigserial primary key,
  title         text not null,
  artist        text not null,           -- display alias, NOT the real user name
  audio_url     text not null,           -- Supabase Storage URL
  album_art_url text default '',         -- Supabase Storage URL
  tags          text[] default '{}',
  genre         text default 'Other',
  is_published  boolean default true,
  avg_rating    numeric(4,2) default 0,
  rating_count  int default 0,
  uploaded_by   uuid references public.profiles(id),
  created_at    timestamptz default now()
);

-- Ratings
create table public.ratings (
  id         bigserial primary key,
  song_id    bigint references public.songs(id) on delete cascade,
  user_id    uuid references public.profiles(id) on delete cascade,
  rating     int not null check (rating between 1 and 10),
  created_at timestamptz default now(),
  unique(user_id, song_id)              -- one rating per user per song
);

-- OTPs (for email verification fallback if needed)
create table public.otps (
  id         bigserial primary key,
  email      text not null,
  otp        text not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);
```

### 3.2 Supabase Storage Buckets

| Bucket | Public | Purpose |
|--------|--------|---------|
| `audio` | false | Uploaded song audio files (mp3, wav, ogg) |
| `artwork` | true | Album art / cover images |
| `avatars` | true | User profile pictures |

---

## 4. Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend only (service role key — never expose to frontend)
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Session
SESSION_SECRET=your-session-secret

# Email (OTP)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=noreply@blinddrop.com
EMAIL_PASS=your-email-password

# CORS
FRONTEND_URL=http://localhost:5173
```

---

## 5. Features & Pages

### 5.1 Pages

| Route | Page | Access |
|-------|------|--------|
| `/` | Landing / Home | Public |
| `/discover` | Blind discovery feed | Public |
| `/listen/:id` | Single track player | Public |
| `/upload` | Track upload form | Artist only |
| `/profile` | User profile | Authenticated |
| `/dashboard/artist` | Artist stats dashboard | Artist only |
| `/dashboard/user` | Listener dashboard | Authenticated |
| `/auth` | Sign up / Sign in | Public |
| `/artists` | Revealed artists browse | Public |
| `/wrapped` | Year-end listening recap | Authenticated |
| `*` | 404 Not Found | Public |

### 5.2 Artist Features
- Anonymous song uploads (title, audio file, cover art, genre, tags)
- Cover art uploaded to Supabase Storage `artwork` bucket
- Audio uploaded to Supabase Storage `audio` bucket
- Dashboard showing: total plays, average rating, top tracks, listener feedback
- Track management (publish / unpublish / delete)

### 5.3 Listener Features
- Browse anonymous tracks in the discovery feed
- Rate tracks 1–10 (one rating per user per track)
- React with emoji/mood reactions
- Create playlists from favourite drops
- "Reveal" artist name after a track hits the vote threshold

### 5.4 Platform Features
- Session-based authentication via Supabase Auth (email + Google OAuth)
- Real-time rating updates using Supabase Realtime subscriptions
- Role system: `user`, `artist`, `admin`
- OTP email verification
- Rate limiting on API endpoints
- Responsive dark UI

---

## 6. Design System

### 6.1 Color Palette (HSL, dark mode only)

```
Background:  hsl(220 25% 6%)
Card:        hsl(220 20% 10%)
Primary:     hsl(263 100% 67%)   ← neon violet
Secondary:   hsl(174 70% 52%)    ← teal
Foreground:  hsl(0 0% 91%)
Border:      hsl(263 50% 30%)
```

### 6.2 Typography

- **Headings**: Poppins (600–700)
- **UI / Body**: Inter (400–500)
- **Monospace / tags**: Space Grotesk (400)

### 6.3 Animated Glowing Button — CSS-Only (Required)

Every CTA button must support an animated glowing border effect on hover with **no JavaScript or animation libraries**.

#### CSS utility class: `.btn-glow`

```css
/* Register custom property for conic-gradient rotation */
@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.btn-glow {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

/* Spinning glow layer behind the button */
.btn-glow::before {
  content: "";
  position: absolute;
  inset: 0;
  background: conic-gradient(
    from var(--angle),
    hsl(263 100% 67%) 0%,
    hsl(174 70% 52%) 25%,
    hsl(263 100% 67%) 50%,
    hsl(174 70% 52%) 75%,
    hsl(263 100% 67%) 100%
  );
  border-radius: inherit;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s ease;
  animation: glow-spin 3s linear infinite paused;
  filter: blur(6px);
}

/* Outer neon ring */
.btn-glow::after {
  content: "";
  position: absolute;
  inset: -3px;
  border-radius: inherit;
  background: conic-gradient(
    from var(--angle),
    hsl(263 100% 67% / 0),
    hsl(174 70% 52% / 0.8),
    hsl(263 100% 67% / 0)
  );
  opacity: 0;
  z-index: -2;
  transition: opacity 0.3s ease;
  animation: glow-spin 3s linear infinite paused;
}

/* Activate on hover / focus */
.btn-glow:hover::before,
.btn-glow:focus-visible::before {
  opacity: 0.45;
  animation-play-state: running;
}

.btn-glow:hover::after,
.btn-glow:focus-visible::after {
  opacity: 1;
  animation-play-state: running;
}

.btn-glow:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow:
    0 0 20px hsl(263 100% 67% / 0.45),
    0 0 50px hsl(174 70% 52% / 0.3),
    0 8px 32px hsl(263 100% 67% / 0.25);
}

.btn-glow:active {
  transform: translateY(0) scale(0.98);
  box-shadow:
    0 0 10px hsl(263 100% 67% / 0.3),
    0 0 25px hsl(174 70% 52% / 0.2);
}

@keyframes glow-spin {
  to { --angle: 360deg; }
}
```

#### Usage in JSX

```tsx
// Any button — just add the class
<button className="btn-glow rounded-xl px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold">
  Start Discovering
</button>

// Or wire it into the shadcn Button variant system
<Button variant="glow-animated">Upload Track</Button>
```

All primary CTAs (hero section, upload form submit, discover CTA, auth buttons) must use `.btn-glow`.

### 6.4 Other CSS Effects

| Class | Effect |
|-------|--------|
| `.neon-glow` | Static box-shadow neon glow (violet + teal) |
| `.pulse-glow` | Breathing glow animation (3s infinite) |
| `.glass` | `backdrop-blur-md` frosted card |
| `.gradient-text` | Violet → teal gradient text fill |
| `.animate-fade-up` | Fade in from below on mount |
| `.animate-ring-pulse` | Pulsing ring animation |

---

## 7. Backend API (Express + Supabase)

All routes prefixed with `/api`. Backend uses the **Supabase service role key** (bypasses RLS for server-side operations).

### Auth Routes (`/api/auth`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Create user, insert profile row |
| POST | `/login` | Email + password sign-in via Supabase Auth |
| POST | `/logout` | Destroy session |
| GET | `/me` | Return current session user |
| POST | `/send-otp` | Send OTP email |
| POST | `/verify-otp` | Verify OTP code |

### Song Routes (`/api/songs`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Public | List published songs (paginated) |
| GET | `/:id` | Public | Get single song |
| POST | `/` | Artist | Create song (multipart: audio + artwork) |
| PUT | `/:id` | Artist | Update song metadata |
| DELETE | `/:id` | Artist | Delete song + storage files |

### Rating Routes (`/api/ratings`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | User | Submit rating (1–10) |
| GET | `/song/:id` | Public | Get ratings for a song |

### Upload Flow (Supabase Storage)

```
1. Client sends multipart/form-data to POST /api/songs
2. Server uses supabase.storage.from('audio').upload(path, audioBuffer)
3. Server uses supabase.storage.from('artwork').upload(path, imageBuffer)
4. Server inserts song row with storage URLs into public.songs
5. Server returns created song JSON
```

---

## 8. Frontend Architecture

```
src/
├── components/
│   ├── ui/              # shadcn components (Button, Card, etc.)
│   ├── dashboards/
│   │   ├── ArtistDashboard/
│   │   └── UserDashboard/
│   ├── Navigation.tsx
│   ├── Particles.tsx    # Background particle animation
│   ├── GlowRing.tsx
│   └── LoadingScreen.tsx
├── pages/
│   ├── Index.tsx        # Landing page
│   ├── Discover.tsx     # Blind discovery feed
│   ├── Listen.tsx       # Single track player
│   ├── Upload.tsx       # Track upload
│   ├── Profile.tsx
│   ├── Artists.tsx
│   ├── RealityWrapped.tsx
│   ├── Reveal.tsx
│   ├── NotFound.tsx
│   ├── auth/
│   │   └── Auth.tsx
│   └── dashboards/
│       └── UserDashboard.tsx
├── lib/
│   ├── supabaseClient.ts  # createClient(url, anonKey)
│   └── utils.ts           # cn() helper
├── hooks/
│   └── useAuth.ts         # Supabase auth state hook
├── utils/
│   └── mockWrappedData.ts # Static year-end recap data
├── index.css              # Tailwind + all custom CSS (including .btn-glow)
└── main.tsx
```

### Supabase Client (frontend)

```ts
// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

---

## 9. Key Implementation Notes

1. **No Unsplash** — all images come from Supabase Storage (`artwork` bucket). Use a default placeholder SVG if no artwork is uploaded.
2. **No MongoDB / Mongoose** — all data access uses `supabase.from('table').select/insert/update/delete`.
3. **No Firebase** — auth is handled by `supabase.auth.signInWithPassword()` / `supabase.auth.signUp()`.
4. **Realtime ratings** — use `supabase.channel('ratings').on('postgres_changes', ...)` to push live rating updates to the Discover feed.
5. **RLS** — enable Row Level Security on all Supabase tables. Backend uses the service role key to bypass RLS. Frontend uses the anon key and relies on RLS policies.
6. **Audio streaming** — generate signed URLs from the private `audio` bucket (valid 1 hour) on the backend and return them with the song response.
7. **Artist anonymity** — the `artist` column in `songs` stores an alias / handle, never exposing the real `uploaded_by` UUID to unauthenticated users.

---

## 10. Development Setup

```bash
# Prerequisites
Node.js v18+, npm or bun
A Supabase project (free tier is fine)

# Clone & install
git clone https://github.com/iraprabhu05/Blind-Drop.git
cd Blind-Drop
npm install
cd backend && npm install && cd ..

# Configure environment
cp .env.example .env
# → fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, etc.

# Run SQL migrations in Supabase SQL editor (see Section 3)

# Start dev servers
npm run dev          # Frontend on :5173
cd backend && npm run dev  # Backend on :3001
```

---

## 11. Out of Scope (Future)

- Native mobile app
- Paid tiers / subscriptions
- Live streaming
- AI-generated genre tagging
- Social graph / following system
