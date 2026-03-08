import { useState, useEffect, useCallback } from 'react';

// Types matching the server-side Plex types
export interface PlexArtist {
  ratingKey: string;
  key: string;
  guid: string;
  title: string;
  titleSort: string;
  thumb: string;
  art: string;
  summary: string;
  type: string;
  addedAt: number;
  updatedAt: number;
}

type LoadingState = 'idle' | 'loading' | 'error' | 'empty';

interface UseArtistsResult {
  artists: PlexArtist[];
  recentlyAdded: PlexArtist[];
  loadingState: LoadingState;
  error: string | null;
  refetch: () => void;
}

interface UseArtistsOptions {
  libraryId?: string;
  baseUrl?: string;
  token?: string;
}

export function useArtists({ libraryId, baseUrl = 'http://localhost:32400', token }: UseArtistsOptions): UseArtistsResult {
  const [artists, setArtists] = useState<PlexArtist[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<PlexArtist[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchArtists = useCallback(async () => {
    if (!libraryId) {
      setLoadingState('idle');
      return;
    }

    setLoadingState('loading');
    setError(null);

    try {
      const url = new URL(`${baseUrl}/library/sections/${libraryId}/all`);
      url.searchParams.set('type', '8'); // Type 8 = artists

      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      if (token) {
        headers['X-Plex-Token'] = token;
      }

      const response = await fetch(url.toString(), { headers });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch artists: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Extract artists from Plex response
      const fetchedArtists = data?.MediaContainer?.Metadata || [];
      
      if (fetchedArtists.length === 0) {
        setLoadingState('empty');
        setArtists([]);
        setRecentlyAdded([]);
      } else {
        setArtists(fetchedArtists);
        // Sort by addedAt to get recently added (10 most recent)
        const sorted = [...fetchedArtists].sort((a: PlexArtist, b: PlexArtist) => b.addedAt - a.addedAt);
        setRecentlyAdded(sorted.slice(0, 10));
        setLoadingState('idle');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load artists';
      setError(message);
      setLoadingState('error');
    }
  }, [libraryId, baseUrl, token]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  return {
    artists,
    recentlyAdded,
    loadingState,
    error,
    refetch: fetchArtists,
  };
}

export default useArtists;
