/**
 * Mock library sections data for Plex API
 * Based on real Plex API format
 */

export const mockLibraries = {
  MediaContainer: {
    size: 3,
    totalSize: 3,
    Directory: [
      {
        key: '1',
        type: 'artist',
        title: 'Music',
        thumb: '/:/resources/artist.png',
        agent: 'com.plexapp.agents.lastfm',
        scanner: 'Plex Music',
        language: 'en',
        uuid: 'library-uuid-music-1',
        updatedAt: 1709856000,
        createdAt: 1709856000,
      },
      {
        key: '2',
        type: 'movie',
        title: 'Movies',
        thumb: '/:/resources/movie.png',
        agent: 'com.plexapp.agents.imdb',
        scanner: 'Plex Movie',
        language: 'en',
        uuid: 'library-uuid-movies-2',
        updatedAt: 1709856000,
        createdAt: 1709856000,
      },
      {
        key: '3',
        type: 'show',
        title: 'TV Shows',
        thumb: '/:/resources/show.png',
        agent: 'com.plexapp.agents.thetvdb',
        scanner: 'Plex Series Scanner',
        language: 'en',
        uuid: 'library-uuid-tv-3',
        updatedAt: 1709856000,
        createdAt: 1709856000,
      },
    ],
  },
};
