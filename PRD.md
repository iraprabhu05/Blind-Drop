# Blind Drop — Product Requirements Document (PRD)

Build this project from scratch using the exact tech stack and requirements below.
Copy and paste this entire document as your Claude Code / Claude prompt.

---

## 1. Project Overview

Blind Drop is a music discovery platform where artists upload songs anonymously and listeners discover music based purely on sound. By stripping away artist identity the platform eliminates name-recognition bias and lets the music speak for itself.

Core mechanic:
- An artist uploads a track. It enters the discovery feed with no artist name, no photo, no bio.
- During the blind phase, the track card background is a random atmospheric image from the Unsplash API — purely visual mood, zero identity clues.
- Listeners vote and rate on sound alone.
- Once a track crosses the reveal threshold (configurable, default 50 ratings) the artist name is unveiled with a Framer Motion reveal animation.

---

## 2. Tech Stack

Use exactly these tools and versions. Do not substitute alternatives.

| Tool | Version | Role |
|------|---------|------|
| Next.js | 15 (App Router) | Framework, React Server Components, Server Actions |
| TypeScript | 5+ | Full type safety across the entire codebase |
| Tailwind CSS | v4 | Utility-first styling |
| CSS Modules | — | Component-scoped premium styles (animations, glows, complex effects) |
| Framer Motion | 11+ | Page transitions, reveal animations, card interactions |
| Auth.js | v5 (next-auth v5) | JWT authentication, Google OAuth + email/password credentials |
| Supabase | latest | PostgreSQL database + audio file storage |
| Upstash Redis | latest | API route rate limiting |
| Spotify Web API | v1 | Enrich uploaded tracks with BPM, key, energy, danceability metadata |
| Unsplash API | v3 | Atmospheric background images shown on track cards during blind phase |
| Plus Jakarta Sans | — | Primary display typeface — load via next/font from Google Fonts |
| Inter | — | Fallback and UI micro-text — load via next/font from Google Fonts |
| Zod | 3+ | Schema validation on every Server Action input and API route body |

No Express, no Vite, no React Router, no MongoDB, no Mongoose, no Firebase, no shadcn (build your own components). All backend logic lives in Next.js Route Handlers and Server Actions.

---

## 3. Supabase Schema (PostgreSQL)

Run these migrations in the Supabase SQL editor before starting development.

```sql
-- Profiles (extends Auth.js user records)
create table public.profiles (
  id           text primary key,           -- matches Auth.js user id (string)
  username     text unique not null,
  email        text not null,
  role         text not null default 'listener'
                 check (role in ('listener', 'artist', 'admin')),
  avatar_url   text default '',
  created_at   timestamptz default now()
);

-- Songs
create table public.songs (
  id              bigserial primary key,
  title           text not null,
  alias           text not null,           -- artist alias shown during blind phase, NOT real name
  audio_url       text not null,           -- Supabase Storage signed URL path
  album_art_url   text default '',         -- Supabase Storage public URL (revealed only post-threshold)
  unsplash_image  text default '',         -- Unsplash photo URL used during blind phase
  tags            text[]  default '{}',
  genre           text    default 'Other',
  is_published    boolean default true,
  reveal_threshold int    default 50,      -- ratings needed before artist is revealed
  is_revealed     boolean default false,
  avg_rating      numeric(4,2) default 0,
  rating_count    int default 0,
  -- Spotify enrichment fields
  spotify_bpm         numeric(6,2),
  spotify_key         int,
  spotify_energy      numeric(4,3),
  spotify_danceability numeric(4,3),
  spotify_valence     numeric(4,3),
  uploaded_by     text references public.profiles(id) on delete set null,
  created_at      timestamptz default now()
);

-- Ratings
create table public.ratings (
  id         bigserial primary key,
  song_id    bigint references public.songs(id) on delete cascade,
  user_id    text references public.profiles(id) on delete cascade,
  rating     int not null check (rating between 1 and 10),
  created_at timestamptz default now(),
  unique(user_id, song_id)
);

-- Playlists
create table public.playlists (
  id         bigserial primary key,
  user_id    text references public.profiles(id) on delete cascade,
  name       text not null,
  created_at timestamptz default now()
);

create table public.playlist_songs (
  playlist_id bigint references public.playlists(id) on delete cascade,
  song_id     bigint references public.songs(id) on delete cascade,
  added_at    timestamptz default now(),
  primary key (playlist_id, song_id)
);
```

Enable Row Level Security on every table. Policies:
- profiles: users can read all, update only their own row.
- songs: anyone can read published songs. Only the uploader can insert / update / delete.
- ratings: authenticated users can insert their own rating and read all ratings.
- playlists / playlist_songs: users can only read and modify their own.

### Supabase Storage Buckets

| Bucket | Public | Accepted types | Purpose |
|--------|--------|---------------|---------|
| audio | false | mp3, wav, ogg, flac | Uploaded song files — served via signed URLs (1 hour TTL) |
| artwork | true | jpg, png, webp | Album art revealed after threshold |
| avatars | true | jpg, png, webp | User profile pictures |

---

## 4. Authentication — Auth.js v5

Configure `auth.ts` at the project root.

Providers:
1. Google OAuth (GoogleProvider)
2. Email / password (CredentialsProvider with bcrypt hash stored in profiles table)

Strategy: JWT (not database sessions — keep it stateless).

After sign-in, upsert a row in `public.profiles` using the `signIn` callback if the profile does not already exist. Store `role` in the JWT token and in `session.user.role` via the `jwt` and `session` callbacks.

Protect routes with middleware in `middleware.ts`:
- `/upload`, `/dashboard/artist` → require role `artist`
- `/dashboard/user`, `/profile`, `/wrapped` → require any authenticated user
- All other routes are public

---

## 5. Rate Limiting — Upstash Redis

Use `@upstash/ratelimit` with `@upstash/redis`.

Apply rate limiting in Next.js middleware or at the top of Server Actions and Route Handlers:
- `POST /api/upload` → 5 requests per user per hour
- `POST /api/ratings` → 30 requests per user per 10 minutes
- `POST /api/auth/[...nextauth]` (sign-in) → 10 attempts per IP per 15 minutes

Use a sliding window algorithm. Return HTTP 429 with a `Retry-After` header when exceeded.

---

## 6. Spotify Web API Integration

When an artist uploads a track and optionally provides a Spotify track URL or ISRC code, call the Spotify API in a Server Action to fetch audio features and store them in the `songs` row.

Fields to fetch and store: `tempo` (BPM), `key`, `energy`, `danceability`, `valence`.

Display these as a visual audio fingerprint strip on the track detail page — a row of small labelled bars using Framer Motion to animate in.

Spotify API call must happen server-side only. Store the `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in environment variables and use the Client Credentials flow to get a bearer token (cache the token in Upstash Redis until it expires).

---

## 7. Unsplash API Integration

During the blind phase, every track card must show an atmospheric background photo from Unsplash — not the real album art (which would give away the artist's aesthetic).

Implementation:
- When a song is created (Server Action), query the Unsplash API using the track's genre and tags as search terms.
- Pick one result at random.
- Store the Unsplash photo URL in `songs.unsplash_image`.
- On the Discover page card, render this image as a `background-image` behind the audio player controls.
- After the track is revealed (`is_revealed = true`), swap the Unsplash image for the real `album_art_url` with a Framer Motion crossfade transition (opacity 0→1 over 0.8s).

Unsplash API key stored in `UNSPLASH_ACCESS_KEY` environment variable. All requests are server-side only.

---

## 8. Environment Variables

Create `.env.local` with these keys. Never expose SERVER_ or service-role keys to the client.

```
# Next.js public (safe for browser)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Server only
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Auth.js
AUTH_SECRET=your-auth-secret-min-32-chars
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Spotify
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret

# Unsplash
UNSPLASH_ACCESS_KEY=your-unsplash-access-key
```

---

## 9. Pages and Routes

| Route | Type | Access | Description |
|-------|------|--------|-------------|
| `/` | Server Component | Public | Landing page with hero, feature highlights, CTA |
| `/discover` | Client Component | Public | Blind track discovery feed |
| `/listen/[id]` | Server Component | Public | Single track player with Spotify metadata strip |
| `/upload` | Client Component | Artist | Track upload form |
| `/profile` | Server Component | Auth | User profile and listening stats |
| `/dashboard/artist` | Client Component | Artist | Track performance dashboard |
| `/dashboard/user` | Client Component | Auth | Listener history and playlists |
| `/auth/signin` | Client Component | Public | Sign in (Google + email/password) |
| `/auth/signup` | Client Component | Public | Register new account |
| `/artists` | Server Component | Public | Browse revealed artists |
| `/artists/[id]` | Server Component | Public | Artist profile (only visible after reveal) |
| `/wrapped` | Client Component | Auth | Year-end listening recap |
| not-found.tsx | — | Public | 404 page |

---

## 10. Project Structure

```
blind-drop/
├── app/
│   ├── layout.tsx                  # Root layout, fonts, providers
│   ├── page.tsx                    # Landing page
│   ├── not-found.tsx
│   ├── (auth)/
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   ├── discover/
│   │   └── page.tsx
│   ├── listen/
│   │   └── [id]/page.tsx
│   ├── upload/
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── dashboard/
│   │   ├── artist/page.tsx
│   │   └── user/page.tsx
│   ├── artists/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── wrapped/
│   │   └── page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── upload/route.ts
│       └── ratings/route.ts
├── components/
│   ├── GlowButton/
│   │   ├── GlowButton.tsx
│   │   └── GlowButton.module.css   # CSS-only glow ring animation
│   ├── TrackCard/
│   │   ├── TrackCard.tsx
│   │   └── TrackCard.module.css
│   ├── AudioPlayer/
│   │   ├── AudioPlayer.tsx
│   │   └── AudioPlayer.module.css
│   ├── RevealOverlay/
│   │   └── RevealOverlay.tsx       # Framer Motion artist reveal
│   ├── SpotifyFingerprint/
│   │   └── SpotifyFingerprint.tsx  # Animated audio feature bars
│   ├── Navigation/
│   │   ├── Navigation.tsx
│   │   └── Navigation.module.css
│   └── ui/                         # Small reusable primitives (Badge, Avatar, etc.)
├── actions/
│   ├── songs.ts                    # Server Actions: createSong, deleteSong, togglePublish
│   ├── ratings.ts                  # Server Actions: submitRating
│   └── profiles.ts                 # Server Actions: updateProfile
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # createBrowserClient()
│   │   └── server.ts               # createServerClient() using cookies()
│   ├── auth.ts                     # Auth.js config
│   ├── redis.ts                    # Upstash Redis client + rate limit helpers
│   ├── spotify.ts                  # Spotify Client Credentials + audio features fetch
│   ├── unsplash.ts                 # Unsplash search + pick random photo
│   └── utils.ts                    # cn(), formatDuration(), truncate()
├── types/
│   └── index.ts                    # Shared TypeScript interfaces (Song, Profile, Rating)
├── styles/
│   └── globals.css                 # Tailwind v4 @import, CSS custom properties, .btn-glow
├── middleware.ts                   # Auth.js middleware + Upstash rate limiting
├── auth.ts                         # Auth.js root config
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 11. Design System

### 11.1 Color Tokens (define in globals.css as CSS custom properties)

```css
:root {
  --color-bg:        hsl(220 25% 6%);
  --color-surface:   hsl(220 20% 10%);
  --color-border:    hsl(263 50% 25%);
  --color-primary:   hsl(263 100% 67%);   /* neon violet */
  --color-secondary: hsl(174 70% 52%);    /* teal */
  --color-text:      hsl(0 0% 91%);
  --color-muted:     hsl(220 15% 55%);
}
```

### 11.2 Typography

Load both fonts via `next/font/google` in `app/layout.tsx`:

```ts
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500'],
});
```

Apply in globals.css:
```css
body {
  font-family: var(--font-jakarta), var(--font-inter), sans-serif;
}
```

Use Plus Jakarta Sans for all headings, labels, and CTAs. Use Inter for body copy, captions, and micro-text.

### 11.3 Animated Glowing Button — CSS-Only via CSS Modules

Every primary CTA must use the GlowButton component. The animation is pure CSS — no Framer Motion on this element.

Create `components/GlowButton/GlowButton.module.css`:

```css
@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-radius: 0.75rem;
  font-family: var(--font-jakarta), sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  color: #fff;
  background: linear-gradient(
    135deg,
    hsl(263 100% 67% / 0.15),
    hsl(174 70% 52% / 0.15)
  );
  border: 1px solid hsl(263 50% 40% / 0.5);
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  text-decoration: none;
}

/* Inner blurred glow layer */
.btn::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: conic-gradient(
    from var(--angle),
    hsl(263 100% 67%)   0%,
    hsl(174 70% 52%)   25%,
    hsl(263 100% 67%)  50%,
    hsl(174 70% 52%)   75%,
    hsl(263 100% 67%) 100%
  );
  opacity: 0;
  z-index: -1;
  filter: blur(8px);
  transition: opacity 0.3s ease;
  animation: glow-spin 3s linear infinite paused;
}

/* Outer spinning ring */
.btn::after {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: conic-gradient(
    from var(--angle),
    hsl(263 100% 67% / 0)   0%,
    hsl(174 70% 52% / 0.9) 30%,
    hsl(263 100% 67% / 0.9) 60%,
    hsl(174 70% 52% / 0)  100%
  );
  opacity: 0;
  z-index: -2;
  transition: opacity 0.3s ease;
  animation: glow-spin 3s linear infinite paused;
}

.btn:hover::before,
.btn:focus-visible::before {
  opacity: 0.5;
  animation-play-state: running;
}

.btn:hover::after,
.btn:focus-visible::after {
  opacity: 1;
  animation-play-state: running;
}

.btn:hover {
  transform: translateY(-2px) scale(1.03);
  border-color: hsl(263 100% 67% / 0.7);
  box-shadow:
    0 0 20px hsl(263 100% 67% / 0.4),
    0 0 55px hsl(174 70% 52% / 0.25),
    0 8px 32px hsl(263 100% 67% / 0.2);
}

.btn:active {
  transform: translateY(0) scale(0.97);
  box-shadow:
    0 0 10px hsl(263 100% 67% / 0.3),
    0 0 25px hsl(174 70% 52% / 0.15);
}

.btn:focus-visible {
  outline: 2px solid hsl(263 100% 67% / 0.8);
  outline-offset: 3px;
}

@keyframes glow-spin {
  to { --angle: 360deg; }
}

/* Size variants */
.sm {
  padding: 0.5rem 1.25rem;
  font-size: 0.85rem;
}

.lg {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
}
```

Create `components/GlowButton/GlowButton.tsx`:

```tsx
import styles from './GlowButton.module.css';

type Props = {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
  className?: string;
};

export function GlowButton({ children, size = 'md', type = 'button', onClick, disabled, href, className }: Props) {
  const cls = [styles.btn, size !== 'md' ? styles[size] : '', className].filter(Boolean).join(' ');
  if (href) return <a href={href} className={cls}>{children}</a>;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
```

Use GlowButton for: hero CTA, upload submit, sign in / sign up, discover page CTA, reveal button.

### 11.4 Other Reusable CSS Utilities (in globals.css)

```css
.glass {
  background: hsl(220 20% 10% / 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid hsl(263 50% 25% / 0.4);
}

.gradient-text {
  background: linear-gradient(135deg, hsl(263 100% 75%), hsl(174 70% 60%));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.neon-glow {
  box-shadow:
    0 0 12px hsl(263 100% 67% / 0.4),
    0 0 30px hsl(174 70% 52% / 0.2);
}

.pulse-glow {
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 10px hsl(263 100% 67% / 0.3), 0 0 25px hsl(174 70% 52% / 0.15);
  }
  50% {
    box-shadow: 0 0 22px hsl(263 100% 67% / 0.6), 0 0 50px hsl(174 70% 52% / 0.35);
  }
}
```

---

## 12. Framer Motion Usage

Import from `framer-motion`. Use `"use client"` on any component that uses Framer Motion.

### Page Transitions

Wrap page content in a `motion.div` with:
```ts
initial={{ opacity: 0, y: 18 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
```

### Artist Reveal Animation (RevealOverlay component)

When `is_revealed` flips to true, animate:
1. The Unsplash background fades out (opacity 1→0, scale 1→1.05, duration 0.6s)
2. The real album art fades in underneath (opacity 0→1, duration 0.8s, delay 0.3s)
3. The artist name types in character by character using `staggerChildren: 0.04`
4. A radial gradient glow pulses out from center (scale 0→3, opacity 0.7→0, duration 1.2s)

### Track Card Hover

Use `whileHover={{ y: -6, scale: 1.02 }}` with `transition={{ type: 'spring', stiffness: 280, damping: 22 }}` on track cards in the discover feed.

### Spotify Fingerprint Bars

Each bar animates from height 0 to its data value on mount using `initial={{ scaleY: 0 }}`, `animate={{ scaleY: 1 }}`, `transition={{ delay: index * 0.08 }}` with `transformOrigin: 'bottom'`.

---

## 13. Server Actions

All data mutations happen via Next.js Server Actions in `actions/`. Each action must:
1. Parse and validate inputs with Zod before touching the database.
2. Verify the user session with `auth()` from Auth.js.
3. Check authorization (role, ownership).
4. Apply rate limiting via Upstash Redis.
5. Return a typed result object `{ success: true, data } | { success: false, error: string }`.

### actions/songs.ts — key actions

`createSong(formData: FormData)`:
- Zod schema: title (string, 1–100 chars), alias (string, 1–50 chars), genre (enum), tags (array of string, max 5), spotifyTrackUrl (optional URL string).
- Upload audio file to Supabase Storage `audio` bucket.
- If album art provided, upload to `artwork` bucket.
- Call `fetchSpotifyFeatures(spotifyTrackUrl)` from `lib/spotify.ts` if URL provided.
- Call `fetchUnsplashImage(genre, tags)` from `lib/unsplash.ts`.
- Insert row into `public.songs`.

`submitRating(songId: number, rating: number)`:
- Zod: songId (positive integer), rating (integer 1–10).
- Upsert into `public.ratings`.
- Recalculate `avg_rating` and `rating_count` on `public.songs`.
- If `rating_count >= reveal_threshold`, set `is_revealed = true`.

`deleteSong(songId: number)`:
- Verify caller owns the song.
- Delete audio and artwork files from Supabase Storage.
- Delete song row (cascades to ratings).

---

## 14. Zod Schemas

Define all schemas in `types/index.ts` or co-locate with actions.

```ts
import { z } from 'zod';

export const CreateSongSchema = z.object({
  title:          z.string().min(1).max(100),
  alias:          z.string().min(1).max(50),
  genre:          z.enum(['Electronic', 'Hip-Hop', 'Pop', 'Rock', 'R&B', 'Jazz', 'Classical', 'Other']),
  tags:           z.array(z.string().max(20)).max(5).default([]),
  spotifyTrackUrl: z.string().url().optional(),
});

export const RatingSchema = z.object({
  songId: z.number().int().positive(),
  rating: z.number().int().min(1).max(10),
});

export const SignUpSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  email:    z.string().email(),
  password: z.string().min(8).max(72),
});

export const UpdateProfileSchema = z.object({
  username:  z.string().min(3).max(30).optional(),
  avatarUrl: z.string().url().optional(),
  role:      z.enum(['listener', 'artist']).optional(),
});
```

---

## 15. Key Implementation Rules

1. All server-only code (Supabase service role key, Spotify secret, Unsplash key, Upstash token) must import from `server-only` package to prevent accidental client bundle inclusion.
2. Supabase has two clients: `lib/supabase/client.ts` uses `createBrowserClient` (anon key). `lib/supabase/server.ts` uses `createServerClient` with `cookies()` from `next/headers`. Always use the server client inside Server Components, Server Actions, and Route Handlers.
3. Audio files are private. Never embed a direct Supabase Storage URL for audio in the HTML. Always generate a signed URL server-side (1-hour expiry) and return it in the page props or action response.
4. The `uploaded_by` user ID must never be sent to the client while `is_revealed` is false. Strip it in the select query or use an RLS policy.
5. Tailwind v4 config: use the new `@import "tailwindcss"` syntax in globals.css. Define custom colors via `@theme` block pointing at CSS custom properties.
6. Every form must have loading, error, and success states. Use React's `useFormStatus` and `useActionState` hooks (React 19 / Next.js 15 built-ins).
7. Images: use `next/image` for all images with proper `width`, `height`, and `alt`. Set `unoptimized={false}` and add `images.remotePatterns` in `next.config.ts` for `images.unsplash.com` and your Supabase storage domain.

---

## 16. Development Setup

```bash
# Prerequisites: Node.js 20+, npm or pnpm, a Supabase project

# 1. Scaffold
npx create-next-app@latest blind-drop --typescript --tailwind --app --src-dir no --import-alias "@/*"
cd blind-drop

# 2. Install dependencies
npm install framer-motion next-auth@beta @auth/supabase-adapter @supabase/supabase-js \
  @supabase/ssr @upstash/redis @upstash/ratelimit zod bcryptjs server-only

npm install -D @types/bcryptjs

# 3. Environment
cp .env.example .env.local
# Fill in all keys from Section 8

# 4. Run Supabase migrations (Section 3) in your Supabase SQL editor

# 5. Start dev server
npm run dev   # http://localhost:3000
```

---

## 17. Out of Scope (Future)

- Native mobile app
- Live audio streaming
- Paid artist tiers
- AI-generated genre tagging
- Social graph / following system
- Comments / threaded discussion on tracks
