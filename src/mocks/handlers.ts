/**
 * MSW Mock Handlers for Plex API endpoints
 * 
 * Endpoints mocked:
 * - GET /library/sections - Returns library sections
 * - GET /library/sections/{id}/all?type=8 - Returns artists for music library
 */

import { http, HttpResponse } from 'msw';
import { mockLibraries } from './data/libraries';
import { mockArtists, mockEmptyArtists } from './data/artists';

const API_BASE_URL = process.env.VITE_PLEX_SERVER_URL || 'http://localhost:32400';

export const handlers = [
  /**
   * GET /library/sections
   * Returns all library sections
   */
  http.get(`${API_BASE_URL}/library/sections`, () => {
    return HttpResponse.json(mockLibraries);
  }),

  /**
   * GET /library/sections/:id/all
   * Returns items from a library section
   * Query param type=8 returns artists (for music libraries)
   */
  http.get(`${API_BASE_URL}/library/sections/:id/all`, ({ request, params }) => {
    const { id } = params;
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    // Type 8 = artists in Plex API
    if (type === '8') {
      // Return artists for music library (id=1)
      if (id === '1') {
        return HttpResponse.json(mockArtists);
      }
      
      // Return empty for non-music libraries
      return HttpResponse.json(mockEmptyArtists);
    }

    // Default response for other types
    return HttpResponse.json(mockEmptyArtists);
  }),

  /**
   * GET /library/metadata/:id
   * Returns metadata for a specific item
   */
  http.get(`${API_BASE_URL}/library/metadata/:id`, ({ params }) => {
    const { id } = params;
    
    // Find artist by ratingKey
    const artist = mockArtists.MediaContainer.Metadata.find(
      (a) => a.ratingKey === id
    );

    if (artist) {
      return HttpResponse.json({
        MediaContainer: {
          size: 1,
          totalSize: 1,
          Metadata: [artist],
        },
      });
    }

    // Return 404 if artist not found
    return new HttpResponse(null, { status: 404 });
  }),

  /**
   * GET /photo/:/transcode
   * Returns placeholder for image transcode requests
   */
  http.get(`${API_BASE_URL}/photo/:/transcode`, () => {
    // Return a simple 1x1 transparent PNG
    const transparentPixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    return new HttpResponse(transparentPixel, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  }),

  /**
   * GET /library/metadata/:id/thumb/:time
   * Returns placeholder for thumbnail requests
   */
  http.get(`${API_BASE_URL}/library/metadata/:id/thumb/:time`, () => {
    // Return a simple 1x1 transparent PNG
    const transparentPixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    return new HttpResponse(transparentPixel, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  }),

  /**
   * GET /library/metadata/:id/art/:time
   * Returns placeholder for art/background requests
   */
  http.get(`${API_BASE_URL}/library/metadata/:id/art/:time`, () => {
    // Return a simple 1x1 transparent PNG
    const transparentPixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    return new HttpResponse(transparentPixel, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  }),
];
