import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import ArtistList, { PlexArtist } from './ArtistList';

const API_BASE_URL = process.env.VITE_PLEX_SERVER_URL || 'http://localhost:32400';

const mockArtists: PlexArtist[] = [
  {
    ratingKey: '1',
    key: '/library/metadata/1',
    guid: 'plex://artist/1',
    title: 'Radiohead',
    titleSort: 'Radiohead',
    thumb: '/library/metadata/1/thumb/123456',
    art: '/library/metadata/1/art/123456',
    summary: 'English rock band',
    type: 'artist',
    addedAt: 1704067200, // oldest - not in recently added
    updatedAt: 1704067200,
  },
  {
    ratingKey: '2',
    key: '/library/metadata/2',
    guid: 'plex://artist/2',
    title: 'Pink Floyd',
    titleSort: 'Pink Floyd',
    thumb: '/library/metadata/2/thumb/123456',
    art: '/library/metadata/2/art/123456',
    summary: 'English rock band',
    type: 'artist',
    addedAt: 1704153600,
    updatedAt: 1704153600,
  },
  {
    ratingKey: '3',
    key: '/library/metadata/3',
    guid: 'plex://artist/3',
    title: 'Daft Punk',
    titleSort: 'Daft Punk',
    thumb: '/library/metadata/3/thumb/123456',
    art: '/library/metadata/3/art/123456',
    summary: 'Electronic music duo',
    type: 'artist',
    addedAt: 1704240000, // most recent
    updatedAt: 1704240000,
  },
];

describe('ArtistList', () => {
  beforeEach(() => {
    // Reset to default handler before each test
    server.resetHandlers();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading skeleton initially when libraryId is provided', () => {
    render(<ArtistList libraryId="1" />);
    
    // Should show skeleton elements (animated pulse divs)
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays artists when data is received', async () => {
    // Override the handler for this test
    server.use(
      http.get(`${API_BASE_URL}/library/sections/1/all`, () => {
        return HttpResponse.json({
          MediaContainer: {
            size: mockArtists.length,
            totalSize: mockArtists.length,
            Metadata: mockArtists,
          },
        });
      })
    );

    render(<ArtistList libraryId="1" />);
    
    // Wait for artists to render (use findAllBy since artists appear in both sections)
    const radioheadElements = await screen.findAllByText('Radiohead');
    expect(radioheadElements.length).toBeGreaterThan(0);
    
    const pinkFloydElements = screen.getAllByText('Pink Floyd');
    expect(pinkFloydElements.length).toBeGreaterThan(0);
    
    const daftPunkElements = screen.getAllByText('Daft Punk');
    expect(daftPunkElements.length).toBeGreaterThan(0);
  });

  it('shows "Recently Added" section with most recent artists first', async () => {
    server.use(
      http.get(`${API_BASE_URL}/library/sections/1/all`, () => {
        return HttpResponse.json({
          MediaContainer: {
            size: mockArtists.length,
            totalSize: mockArtists.length,
            Metadata: mockArtists,
          },
        });
      })
    );

    render(<ArtistList libraryId="1" />);
    
    // Wait for "Recently Added" section
    expect(await screen.findByText('Recently Added')).toBeInTheDocument();
    
    // Recently added section should exist
    const recentlyAddedSection = screen.getByText('Recently Added').closest('section');
    expect(recentlyAddedSection).toBeInTheDocument();
  });

  it('shows empty state when no artists are found', async () => {
    server.use(
      http.get(`${API_BASE_URL}/library/sections/1/all`, () => {
        return HttpResponse.json({
          MediaContainer: {
            size: 0,
            totalSize: 0,
            Metadata: [],
          },
        });
      })
    );

    render(<ArtistList libraryId="1" />);
    
    // Should show empty state
    expect(await screen.findByText('No Artists Found')).toBeInTheDocument();
    expect(screen.getByText(/This music library doesn't have any artists yet/)).toBeInTheDocument();
  });

  it('shows error state when request fails', async () => {
    server.use(
      http.get(`${API_BASE_URL}/library/sections/1/all`, () => {
        return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
      })
    );

    render(<ArtistList libraryId="1" />);
    
    // Should show error state - use findBy which has built-in waiting
    const heading = await screen.findByText('Failed to Load Artists', {}, { timeout: 3000 });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('calls onArtistSelect when an artist is clicked', async () => {
    server.use(
      http.get(`${API_BASE_URL}/library/sections/1/all`, () => {
        return HttpResponse.json({
          MediaContainer: {
            size: mockArtists.length,
            totalSize: mockArtists.length,
            Metadata: mockArtists,
          },
        });
      })
    );

    const mockOnSelect = vi.fn();
    render(<ArtistList libraryId="1" onArtistSelect={mockOnSelect} />);
    
    // Wait for artists to render - use getAll since Radiohead appears in multiple places
    const radioheadElements = await screen.findAllByText('Radiohead');
    expect(radioheadElements.length).toBeGreaterThan(0);
    
    // Click on the first occurrence (should be in a button)
    const radioheadButton = radioheadElements[0].closest('button');
    expect(radioheadButton).toBeInTheDocument();
    
    if (radioheadButton) {
      fireEvent.click(radioheadButton);
      expect(mockOnSelect).toHaveBeenCalledWith(mockArtists[0]);
    }
  });

  it('retries fetching when Try Again button is clicked', async () => {
    let requestCount = 0;
    
    server.use(
      http.get(`${API_BASE_URL}/library/sections/1/all`, () => {
        requestCount++;
        if (requestCount === 1) {
          return new HttpResponse(null, { status: 500 });
        }
        return HttpResponse.json({
          MediaContainer: {
            size: mockArtists.length,
            totalSize: mockArtists.length,
            Metadata: mockArtists,
          },
        });
      })
    );

    render(<ArtistList libraryId="1" />);
    
    // Wait for error state
    await screen.findByText('Failed to Load Artists', {}, { timeout: 3000 });
    
    // Click retry button
    fireEvent.click(screen.getByText('Try Again'));
    
    // Wait for success state
    await waitFor(() => {
      expect(requestCount).toBe(2);
    });
    
    // Should now show artists (use findAllBy since artists appear in both sections)
    const radioheadElements = await screen.findAllByText('Radiohead');
    expect(radioheadElements.length).toBeGreaterThan(0);
  });

  it('does not fetch artists when libraryId is not provided', () => {
    let requestMade = false;
    
    server.use(
      http.get(`${API_BASE_URL}/library/sections/:id/all`, () => {
        requestMade = true;
        return HttpResponse.json({
          MediaContainer: { size: 0, totalSize: 0, Metadata: [] },
        });
      })
    );

    render(<ArtistList />);
    
    // Should not have made a request
    expect(requestMade).toBe(false);
  });

  it('uses provided baseUrl for API calls', async () => {
    const customBaseUrl = 'http://custom-plex-server:32400';
    let requestUrl: string | null = null;
    
    server.use(
      http.get(`${customBaseUrl}/library/sections/1/all`, ({ request }) => {
        requestUrl = request.url;
        return HttpResponse.json({
          MediaContainer: {
            size: mockArtists.length,
            totalSize: mockArtists.length,
            Metadata: mockArtists,
          },
        });
      })
    );

    render(<ArtistList libraryId="1" baseUrl={customBaseUrl} />);
    
    // Wait for artists to render
    const radioheadElements = await screen.findAllByText('Radiohead');
    expect(radioheadElements.length).toBeGreaterThan(0);
    
    // Verify the custom URL was used
    expect(requestUrl).toContain(customBaseUrl);
  });
});
