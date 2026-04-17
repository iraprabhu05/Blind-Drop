const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'artist' | 'admin';
  avatarUrl: string;
}

export const authApi = {
  register: (data: { username: string; email: string; password: string; role?: string }) =>
    request<AuthUser>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<AuthUser>('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  logout: () =>
    request<{ success: boolean }>('/api/auth/logout', { method: 'POST' }),

  me: () =>
    request<AuthUser>('/api/auth/me'),
};

// ─── Songs (blind-safe) ──────────────────────────────────────────────────────

export interface SafeSong {
  id: number;
  genre: string;
  tags: string[];
  avgRating: number;
  ratingCount: number;
}

export const songsApi = {
  getAll: (genre?: string) => {
    const params = genre && genre !== 'All' ? `?genre=${encodeURIComponent(genre)}` : '';
    return request<SafeSong[]>(`/api/songs${params}`);
  },

  stream: (songId: number) =>
    request<{ audioUrl: string }>(`/api/songs/${songId}/stream`),
};

// ─── Rating ──────────────────────────────────────────────────────────────────

export const ratingApi = {
  submit: (songId: number, rating: number) =>
    request<{ success: boolean; alreadyRated: boolean; rating?: number }>(
      '/api/rate',
      { method: 'POST', body: JSON.stringify({ songId, rating }) }
    ),
};

// ─── Reveal ──────────────────────────────────────────────────────────────────

export interface RevealData {
  id: number;
  title: string;
  artist: string;
  genre: string;
  albumArtUrl: string;
  avgRating: number;
  ratingCount: number;
  userScore: number;
}

export const revealApi = {
  get: (songId: number) =>
    request<RevealData>(`/api/reveal/${songId}`),
};

// ─── Upload ──────────────────────────────────────────────────────────────────

export const uploadApi = {
  song: (data: {
    title: string;
    artist: string;
    audio: string;
    genre: string;
    tags?: string[];
    albumArtUrl?: string;
  }) => request('/api/upload', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Profile ─────────────────────────────────────────────────────────────────

export interface RatedSongEntry {
  songId: number;
  userRating: number;
  ratedAt: string;
  title: string;
  artist: string;
  genre: string;
  albumArtUrl: string;
  avgRating: number;
  ratingCount: number;
}

export interface ProfileData {
  user: AuthUser & { createdAt: string };
  stats: { totalRated: number; avgScore: number };
  ratedSongs: RatedSongEntry[];
}

export const profileApi = {
  get: () => request<ProfileData>('/api/profile'),
};

// ─── Recommend ───────────────────────────────────────────────────────────────

export const recommendApi = {
  get: (songId: number, rating: number) =>
    request<SafeSong | null>('/api/recommend', {
      method: 'POST',
      body: JSON.stringify({ songId, rating }),
    }),
};
