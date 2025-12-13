export interface Artist {
  id: number;
  name: string;
  genre: string;
  avatarUrl: string;
  lat: number;
  lon: number;
  topSongUrl: string;
  distance?: number;
}

// Centered around Berlin, Germany for more realistic "nearby" distances for a wider audience.
const centerLat = 52.52;
const centerLon = 13.405;

export const mockArtists: Artist[] = [
  {
    id: 1,
    name: "Aurora Bloom",
    genre: "Dream Pop",
    avatarUrl: "https://picsum.photos/seed/41/300/300",
    lat: centerLat + 0.001,
    lon: centerLon - 0.002,
    topSongUrl:
      "https://storage.googleapis.com/uci-chat-models-not-for-production.appspot.com/Odesza-A-Moment-Apart.mp3",
  },
  {
    id: 2,
    name: "Vector Trace",
    genre: "Cyber-Funk",
    avatarUrl: "https://picsum.photos/seed/42/300/300",
    lat: centerLat - 0.002,
    lon: centerLon + 0.003,
    topSongUrl:
      "https://storage.googleapis.com/uci-chat-models-not-for-production.appspot.com/Odesza-A-Moment-Apart.mp3",
  },
  {
    id: 3,
    name: "Silent Planet",
    genre: "Cosmic Jazz",
    avatarUrl: "https://picsum.photos/seed/43/300/300",
    lat: centerLat + 0.003,
    lon: centerLon + 0.001,
    topSongUrl:
      "https://storage.googleapis.com/uci-chat-models-not-for-production.appspot.com/Odesza-A-Moment-Apart.mp3",
  },
  {
    id: 4,
    name: "Midnight Canvas",
    genre: "Nocturnal Bass",
    avatarUrl: "https://picsum.photos/seed/44/300/300",
    lat: centerLat - 0.004,
    lon: centerLon - 0.004,
    topSongUrl:
      "https://storage.googleapis.com/uci-chat-models-not-for-production.appspot.com/Odesza-A-Moment-Apart.mp3",
  },
  {
    id: 5,
    name: "Chrono Rider",
    genre: "Retro Futurist",
    avatarUrl: "https://picsum.photos/seed/45/300/300",
    lat: centerLat + 0.005,
    lon: centerLon,
    topSongUrl:
      "https://storage.googleapis.com/uci-chat-models-not-for-production.appspot.com/Odesza-A-Moment-Apart.mp3",
  },
  {
    id: 6,
    name: "Tidal Bloom",
    genre: "Aquatic Beats",
    avatarUrl: "https://picsum.photos/seed/46/300/300",
    lat: centerLat,
    lon: centerLon + 0.005,
    topSongUrl:
      "https://storage.googleapis.com/uci-chat-models-not-for-production.appspot.com/Odesza-A-Moment-Apart.mp3",
  },
  {
    id: 7,
    name: "Geomancer",
    genre: "Earthly Techno",
    avatarUrl: "https://picsum.photos/seed/47/300/300",
    lat: centerLat - 0.003,
    lon: -centerLon - 0.001,
    topSongUrl:
      "https://storage.googleapis.com/uci-chat-models-not-for-production.appspot.com/Odesza-A-Moment-Apart.mp3",
  },
  {
    id: 8,
    name: "Starlight Drifter",
    genre: "Astral Hop",
    avatarUrl: "https://picsum.photos/seed/48/300/300",
    lat: centerLat + 0.002,
    lon: -centerLon + 0.004,
    topSongUrl:
      "https://storage.googleapis.com/uci-chat-models-not-for-production.appspot.com/Odesza-A-Moment-Apart.mp3",
  },
];
