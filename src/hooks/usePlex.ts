import { useState, useEffect, useCallback } from 'react';
import { DeskThing } from '@deskthing/client';

// Types matching the server-side Plex types
export interface PlexArtist {
  ratingKey: string;
  key: string;
  guid: string;
  title: string;
  titleSort: string;
  thumb: string;
  art: string;
  banner?: string;
  summary: string;
  type: 'artist';
  addedAt: number;
  updatedAt: number;
  lastViewedAt?: number;
  viewCount?: number;
}

export interface PlexLibrary {
  key: string;
  type: 'artist' | 'movie' | 'show' | 'photo';
  title: string;
  thumb: string;
}

type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

interface UsePlexOptions {
  autoFetch?: boolean;
}

export function usePlex<T>(requestType: string, payload?: unknown, options: UsePlexOptions = {}) {
  const { autoFetch = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setStatus('loading');
    setError(null);
    DeskThing.send({ type: requestType, payload });
  }, [requestType, payload]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data?.type) return;

      // Map request type to response type
      const responseType = requestType.replace('get', '').toLowerCase();
      
      if (data.type === `plex:${responseType}`) {
        setData(data.payload as T);
        setStatus('success');
      } else if (data.type === 'error') {
        setError(data.payload?.message || 'An error occurred');
        setStatus('error');
      }
    };

    window.addEventListener('message', handleMessage);

    if (autoFetch) {
      fetch();
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [requestType, payload, autoFetch, fetch]);

  return { data, status, error, refetch: fetch };
}

// Hook specifically for artists
export function useArtists(libraryId: string | null) {
  const [artists, setArtists] = useState<PlexArtist[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<PlexArtist[]>([]);
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchArtists = useCallback(() => {
    if (!libraryId) return;
    
    setStatus('loading');
    setError(null);
    DeskThing.send({ type: 'plex:getArtists', payload: { libraryId } });
  }, [libraryId]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data?.type) return;

      if (data.type === 'plex:artists') {
        const fetchedArtists = Array.isArray(data.payload) ? data.payload : [];
        setArtists(fetchedArtists);
        
        // Sort by addedAt to get recently added
        const sorted = [...fetchedArtists].sort((a, b) => b.addedAt - a.addedAt);
        setRecentlyAdded(sorted.slice(0, 10));
        
        setStatus(fetchedArtists.length === 0 ? 'idle' : 'success');
      } else if (data.type === 'error') {
        setError(data.payload?.message || 'Failed to load artists');
        setStatus('error');
      }
    };

    window.addEventListener('message', handleMessage);

    if (libraryId && autoFetch) {
      fetchArtists();
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [libraryId, fetchArtists]);

  return { 
    artists, 
    recentlyAdded, 
    status, 
    error, 
    refetch: fetchArtists,
    isLoading: status === 'loading',
    isError: status === 'error',
    isEmpty: status === 'success' && artists.length === 0
  };
}

// Hook for libraries
export function useLibraries() {
  const [libraries, setLibraries] = useState<PlexLibrary[]>([]);
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchLibraries = useCallback(() => {
    setStatus('loading');
    setError(null);
    DeskThing.send({ type: 'plex:getLibraries', payload: {} });
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data?.type) return;

      if (data.type === 'plex:libraries') {
        const libs = Array.isArray(data.payload) ? data.payload : [];
        setLibraries(libs);
        setStatus('success');
      } else if (data.type === 'error') {
        setError(data.payload?.message || 'Failed to load libraries');
        setStatus('error');
      }
    };

    window.addEventListener('message', handleMessage);
    fetchLibraries();

    return () => window.removeEventListener('message', handleMessage);
  }, [fetchLibraries]);

  // Get first music library
  const firstMusicLibrary = libraries.find(lib => lib.type === 'artist');

  return { 
    libraries, 
    firstMusicLibrary,
    status, 
    error, 
    refetch: fetchLibraries,
    isLoading: status === 'loading',
    isError: status === 'error'
  };
}
