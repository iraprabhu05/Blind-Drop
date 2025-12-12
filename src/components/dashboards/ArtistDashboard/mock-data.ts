export const artistProfile = {
  name: "SPECTRA",
  avatar: "https://placehold.co/100x100/1a1a1a/ffffff?text=S",
  banner: "https://placehold.co/1200x400/1a1a1a/ffffff?text=Banner",
  bio: "Synthesizing the future of electronic music. Based in Neo-Kyoto.",
  genre: "Cyber-Funk",
  socials: {
    twitter: "https://twitter.com/spectra",
    instagram: "https://instagram.com/spectra",
    spotify: "https://spotify.com/artist/spectra",
  },
};

export const overviewStats = {
  totalPlays: "2.8M",
  totalLikes: "120.3K",
  followers: "45.1K",
  monthlyListeners: "350.7K",
};

export const topTracks = [
  {
    id: 1,
    title: "Chrome Heart",
    cover: "https://placehold.co/300x300/A78BFA/ffffff?text=CH",
    plays: "450K",
    likes: "22K",
    date: "2023-11-01",
  },
  {
    id: 2,
    title: "Midnight Drive",
    cover: "https://placehold.co/300x300/EC4899/ffffff?text=MD",
    plays: "320K",
    likes: "18K",
    date: "2023-10-15",
  },
  {
    id: 3,
    title: "Data Stream",
    cover: "https://placehold.co/300x300/3B82F6/ffffff?text=DS",
    plays: "280K",
    likes: "15K",
    date: "2023-09-22",
  },
  {
    id: 4,
    title: "Replicant's Dream",
    cover: "https://placehold.co/300x300/F59E0B/ffffff?text=RD",
    plays: "210K",
    likes: "12K",
    date: "2023-08-30",
  },
  {
    id: 5,
    title: "Neo-Kyoto",
    cover: "https://placehold.co/300x300/10B981/ffffff?text=NK",
    plays: "180K",
    likes: "10K",
    date: "2023-07-19",
  },
];

export const allTracks = [
  ...topTracks,
  {
    id: 6,
    title: "Glass Matrix",
    cover: "https://placehold.co/300x300/6366F1/ffffff?text=GM",
    plays: "150K",
    likes: "9K",
    date: "2023-06-25",
  },
  {
    id: 7,
    title: "Vapor Trails",
    cover: "https://placehold.co/300x300/8B5CF6/ffffff?text=VT",
    plays: "120K",
    likes: "7.5K",
    date: "2023-05-12",
  },
  {
    id: 8,
    title: "Gridlock",
    cover: "https://placehold.co/300x300/D946EF/ffffff?text=G",
    plays: "100K",
    likes: "6K",
    date: "2023-04-18",
  },
  {
    id: 9,
    title: "First Light",
    cover: "https://placehold.co/300x300/F472B6/ffffff?text=FL",
    plays: "85K",
    likes: "5K",
    date: "2023-03-29",
  },
];

export const analyticsData = {
  playsOverTime: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    data: [80, 90, 120, 150, 180, 220, 250, 280, 320, 350, 380, 420],
  },
  listenerDemographics: {
    labels: ["18-24", "25-34", "35-44", "45+"],
    data: [55, 30, 10, 5],
  },
  trackComparison: {
    labels: [
      "Chrome Heart",
      "Midnight Drive",
      "Data Stream",
      "Replicant's Dream",
      "Neo-Kyoto",
    ],
    data: [450, 320, 280, 210, 180],
  },
};
