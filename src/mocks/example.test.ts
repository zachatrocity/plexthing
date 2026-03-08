/**
 * Example test demonstrating MSW usage with Plex API
 * 
 * Run with: npm test
 */

import { describe, it, expect, vi } from 'vitest';
import { mockLibraries, mockArtists } from '@/mocks/data';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

describe('Plex API Mocks', () => {
  describe('Library Endpoints', () => {
    it('should return mock libraries data', () => {
      expect(mockLibraries.MediaContainer.size).toBe(3);
      expect(mockLibraries.MediaContainer.Directory).toHaveLength(3);
      
      // Check music library exists
      const musicLib = mockLibraries.MediaContainer.Directory.find(
        lib => lib.type === 'artist'
      );
      expect(musicLib).toBeDefined();
      expect(musicLib?.title).toBe('Music');
    });

    it('should have correct library structure', () => {
      const musicLib = mockLibraries.MediaContainer.Directory[0];
      expect(musicLib).toHaveProperty('key');
      expect(musicLib).toHaveProperty('type');
      expect(musicLib).toHaveProperty('title');
      expect(musicLib).toHaveProperty('thumb');
    });
  });

  describe('Artists Endpoints', () => {
    it('should return mock artists data', () => {
      expect(mockArtists.MediaContainer.size).toBe(5);
      expect(mockArtists.MediaContainer.Metadata).toHaveLength(5);
    });

    it('should have at least 5 sample artists with realistic data', () => {
      const artists = mockArtists.MediaContainer.Metadata;
      
      // Check we have 5 artists
      expect(artists).toHaveLength(5);
      
      // Verify each artist has required fields
      artists.forEach(artist => {
        expect(artist).toHaveProperty('ratingKey');
        expect(artist).toHaveProperty('title');
        expect(artist).toHaveProperty('type', 'artist');
        expect(artist).toHaveProperty('addedAt');
        expect(artist).toHaveProperty('updatedAt');
        expect(typeof artist.addedAt).toBe('number');
        expect(typeof artist.updatedAt).toBe('number');
      });
      
      // Check specific artist names
      const artistNames = artists.map(a => a.title);
      expect(artistNames).toContain('Radiohead');
      expect(artistNames).toContain('Pink Floyd');
      expect(artistNames).toContain('The Beatles');
      expect(artistNames).toContain('Daft Punk');
      expect(artistNames).toContain('Kendrick Lamar');
    });
  });

  describe('MSW Override Example', () => {
    it('should allow overriding handlers for specific tests', async () => {
      // Override the handler to return error
      server.use(
        http.get('*/library/sections', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const response = await fetch('http://localhost:32400/library/sections');
      expect(response.status).toBe(500);
    });

    it('should restore default handlers after override', async () => {
      // After the previous test, handlers are reset by afterEach
      // So this should return the default mock data
      const response = await fetch('http://localhost:32400/library/sections');
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.MediaContainer.size).toBe(3);
    });
  });
});
