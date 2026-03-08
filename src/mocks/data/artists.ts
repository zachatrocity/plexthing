/**
 * Mock artists data for Plex API
 * Based on real Plex API format
 * Type 8 = Music library (artists)
 */

export const mockArtists = {
  MediaContainer: {
    size: 5,
    totalSize: 5,
    Metadata: [
      {
        ratingKey: '100',
        key: '/library/metadata/100',
        guid: 'plex://artist/5d07baf7403c640290f26c79',
        title: 'Radiohead',
        titleSort: 'Radiohead',
        thumb: '/library/metadata/100/thumb/1709856000',
        art: '/library/metadata/100/art/1709856000',
        summary: 'Radiohead are an English rock band formed in Abingdon, Oxfordshire, in 1985.',
        type: 'artist',
        addedAt: 1709856000,
        updatedAt: 1709942400,
        index: 1,
        viewCount: 42,
        lastViewedAt: 1709942400,
      },
      {
        ratingKey: '101',
        key: '/library/metadata/101',
        guid: 'plex://artist/5d07baf7403c640290f26c7a',
        title: 'Pink Floyd',
        titleSort: 'Pink Floyd',
        thumb: '/library/metadata/101/thumb/1709856000',
        art: '/library/metadata/101/art/1709856000',
        summary: 'Pink Floyd were an English rock band formed in London in 1965.',
        type: 'artist',
        addedAt: 1709856100,
        updatedAt: 1709942500,
        index: 2,
        viewCount: 38,
        lastViewedAt: 1709942300,
      },
      {
        ratingKey: '102',
        key: '/library/metadata/102',
        guid: 'plex://artist/5d07baf7403c640290f26c7b',
        title: 'The Beatles',
        titleSort: 'Beatles, The',
        thumb: '/library/metadata/102/thumb/1709856000',
        art: '/library/metadata/102/art/1709856000',
        summary: 'The Beatles were an English rock band formed in Liverpool in 1960.',
        type: 'artist',
        addedAt: 1709856200,
        updatedAt: 1709942600,
        index: 3,
        viewCount: 56,
        lastViewedAt: 1709942200,
      },
      {
        ratingKey: '103',
        key: '/library/metadata/103',
        guid: 'plex://artist/5d07baf7403c640290f26c7c',
        title: 'Daft Punk',
        titleSort: 'Daft Punk',
        thumb: '/library/metadata/103/thumb/1709856000',
        art: '/library/metadata/103/art/1709856000',
        summary: 'Daft Punk were a French electronic music duo formed in 1993 in Paris.',
        type: 'artist',
        addedAt: 1709856300,
        updatedAt: 1709942700,
        index: 4,
        viewCount: 31,
        lastViewedAt: 1709942100,
      },
      {
        ratingKey: '104',
        key: '/library/metadata/104',
        guid: 'plex://artist/5d07baf7403c640290f26c7d',
        title: 'Kendrick Lamar',
        titleSort: 'Lamar, Kendrick',
        thumb: '/library/metadata/104/thumb/1709856000',
        art: '/library/metadata/104/art/1709856000',
        summary: 'Kendrick Lamar Duckworth is an American rapper and songwriter.',
        type: 'artist',
        addedAt: 1709856400,
        updatedAt: 1709942800,
        index: 5,
        viewCount: 27,
        lastViewedAt: 1709942000,
      },
    ],
  },
};

// Empty artists response for edge case testing
export const mockEmptyArtists = {
  MediaContainer: {
    size: 0,
    totalSize: 0,
    Metadata: [],
  },
};
