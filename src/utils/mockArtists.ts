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

export const mockArtists: Artist[] = [
  {
    id: 1,
    name: "Celestial Echoes",
    genre: "Ambient Lo-fi",
    avatarUrl: "/placeholder.svg",
    lat: 34.0522,
    lon: -118.2437,
    topSongUrl:
      "https://storage.googleapis.com/uci-chat-models-not-for-production.appspot.com/Odesza-A-Moment-Apart.mp3",
  },
  {
    id: 2,
    name: "Neon Dreams",
    genre: "Synthwave",
    avatarUrl: "/placeholder.svg",
    lat: 34.055,
    lon: -118.25,
    topSongUrl:
      "https://storage.googleapis.com/uci-chat-models-not-for-production.appspot.com/Odesza-A-Moment-Apart.mp3",
  },
  {
    id: 3,
    name: "Rhythmic Silence",
    genre: "Minimal Techno",
    avatarUrl: "/placeholder.svg",
    lat: 34.06,
    lon: -118.24,
    topSongUrl:
      "https://storage.googleapis.com/uci-chat-models-not-for-production.appspot.com/Odesza-A-Moment-Apart.mp3",
  },
  {
    id: 4,
    name: "Velvet Groove",
    genre: "Soulful R&B",
    avatarUrl: "/placeholder.svg",
    lat: 34.1,
    lon: -118.3,
    topSongUrl:
      "https://storage.googleapis.com/uci-chat-models-not-for-production.appspot.com/Odesza-A-Moment-Apart.mp3",
  },
  {
    id: 5,
    name: "Ghostrifter",
    genre: "Chillhop",
    avatarUrl: "/placeholder.svg",
    lat: 34.04,
    lon: -118.2,
    topSongUrl:
      "https://storage.googleapis.com/uci-chat-models-not-for-production.appspot.com/Odesza-A-Moment-Apart.mp3",
  },
  {
    id: 6,
    name: "Lost Frequencies",
    genre: "Deep House",
    avatarUrl: "/placeholder.svg",
    lat: 34.05,
    lon: -118.26,
    topSongUrl:
      "https://storage.googleapis.com/uci-chat-models-not-for-production.appspot.com/Odesza-A-Moment-Apart.mp3",
  },
  {
    id: 7,
    name: "Echoes of Ether",
    genre: "Psychedelic Trance",
    avatarUrl: "/placeholder.svg",
    lat: 34.15,
    lon: -118.35,
    topSongUrl:
      "https://storage.googleapis.com/uci-chat-models-not-for-production.appspot.com/Odesza-A-Moment-Apart.mp3",
  },
  {
    id: 8,
    name: "Solar Fields",
    genre: "Ambient",
    avatarUrl: "/placeholder.svg",
    lat: 34.2,
    lon: -118.4,
    topSongUrl:
      "https://storage.googleapis.com/uci-chat-models-not-for-production.appspot.com/Odesza-A-Moment-Apart.mp3",
  },
];
