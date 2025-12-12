
export const mockWrappedData = {
  ratingComparison: {
    blindVoted: 78,
    visibleVoted: 65,
    insight: "You rate songs 13% higher when you listen blind. No hype, just pure sound.",
  },
  hiddenBias: {
    insights: [
      "You liked 4 of 5 unknown artists more than your top followed artists.",
      "Your blind ratings favor indie and small creators.",
      "You're more likely to skip a track from a major artist when you don't see their name.",
    ],
  },
  genrePreference: {
    blind: [
      { genre: 'Indie Pop', value: 85 },
      { genre: 'Lo-fi Beats', value: 75 },
      { genre: 'Dream Pop', value: 60 },
      { genre: 'Art Rock', value: 40 },
    ],
    visible: [
      { genre: 'Pop', value: 90 },
      { genre: 'Hip Hop', value: 80 },
      { genre: 'Indie Pop', value: 70 },
      { genre: 'Rock', value: 65 },
    ],
  },
  surpriseFavorites: [
    { id: '1', title: 'Starlight Echo', artist: 'Unknown', albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' },
    { id: '2', title: 'Midnight City Drive', artist: 'Unknown', albumArt: 'https://images.unsplash.com/photo-1510915361408-d5a637482857?w=300&h=300&fit=crop' },
    { id: '3', title: 'Lost in the Sound', artist: 'Unknown', albumArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop' },
  ],
  gamifiedStats: {
    blindGuesses: 120,
    correctGuesses: 45,
    reveals: 95,
    averageReactionTime: '2.5s',
  },
  indieDiscovery: {
    newIndieArtists: 12,
    insight: "You've discovered a dozen new independent artists through blind mode.",
  },
};
