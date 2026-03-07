import { DeskThing } from '@deskthing/server';
import {
  PlexConfig,
  PlexAPIError,
  PlexLibrarySectionsResponse,
  PlexArtistsResponse,
  PlexAlbumsResponse,
  PlexTracksResponse,
  PlexClientsResponse,
  PlexTimelineResponse,
  PlexLibrary,
  PlexArtist,
  PlexAlbum,
  PlexTrack,
  PlexPlayer,
  PlexTimeline,
} from './types.js';

/**
 * Plex Media Server API Client
 * Handles authentication, retries, and type-safe requests
 */
export class PlexAPI {
  private config: PlexConfig;
  private baseUrl: string;
  private token: string;

  constructor(config: PlexConfig) {
    this.config = {
      deviceName: 'PlexThing',
      ...config,
    };
    
    // Normalize base URL (remove trailing slash)
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.token = config.token;
  }

  /**
   * Make an authenticated request to Plex API
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);
    
    // Add auth token
    url.searchParams.set('X-Plex-Token', this.token);
    
    // Add standard Plex headers
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'X-Plex-Client-Identifier': 'plexthing-deskthing-app',
      'X-Plex-Device-Name': this.config.deviceName || 'PlexThing',
      'X-Plex-Device': 'DeskThing',
      'X-Plex-Platform': 'DeskThing',
      'X-Plex-Platform-Version': '1.0',
      'X-Plex-Product': 'PlexThing',
      'X-Plex-Version': '0.1.0',
      ...((options.headers as Record<string, string>) || {}),
    };

    console.log(`[PlexThing] API Request: ${url.toString().replace(this.token, '***')}`);

    try {
      const response = await fetch(url.toString(), {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new PlexAPIError('Invalid Plex token', 401, response);
        }
        if (response.status === 404) {
          throw new PlexAPIError('Resource not found', 404, response);
        }
        throw new PlexAPIError(`HTTP ${response.status}: ${response.statusText}`, response.status, response);
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json() as T;
      }
      
      // Plex sometimes returns XML but we request JSON
      // If not JSON, return the text (for XML responses)
      const text = await response.text();
      return text as unknown as T;
    } catch (error) {
      if (error instanceof PlexAPIError) {
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new PlexAPIError(`Cannot connect to Plex server at ${this.baseUrl}. Is it running?`);
      }
      
      throw new PlexAPIError(`Request failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test connection to Plex server
   */
  async testConnection(): Promise<{ success: boolean; error?: string; serverName?: string }> {
    try {
      const response = await this.request<PlexLibrarySectionsResponse>('/library/sections');
      const serverName = response.MediaContainer.title1;
      console.log(`Successfully connected to Plex server: ${serverName}`);
      return { success: true, serverName };
    } catch (error) {
      const message = error instanceof PlexAPIError ? error.message : 'Unknown error';
      console.log(`Failed to connect to Plex: ${message}`);
      return { success: false, error: message };
    }
  }

  /**
   * Get all library sections
   */
  async getLibrarySections(): Promise<PlexLibrary[]> {
    const response = await this.request<PlexLibrarySectionsResponse>('/library/sections');
    const directories = response.MediaContainer.Directory;
    return Array.isArray(directories) ? directories : directories ? [directories] : [];
  }

  /**
   * Get music library sections only
   */
  async getMusicLibraries(): Promise<PlexLibrary[]> {
    const sections = await this.getLibrarySections();
    return sections.filter(section => section.type === 'artist');
  }

  /**
   * Get all artists from a music library
   */
  async getArtists(libraryId: string | number): Promise<PlexArtist[]> {
    const response = await this.request<PlexArtistsResponse>(`/library/sections/${libraryId}/all?type=8`);
    const metadata = response.MediaContainer.Metadata;
    return Array.isArray(metadata) ? metadata : metadata ? [metadata] : [];
  }

  /**
   * Get albums for an artist
   */
  async getAlbums(artistId: string): Promise<PlexAlbum[]> {
    const response = await this.request<PlexAlbumsResponse>(`/library/metadata/${artistId}/children`);
    const metadata = response.MediaContainer.Metadata;
    return Array.isArray(metadata) ? metadata : metadata ? [metadata] : [];
  }

  /**
   * Get tracks for an album
   */
  async getTracks(albumId: string): Promise<PlexTrack[]> {
    const response = await this.request<PlexTracksResponse>(`/library/metadata/${albumId}/children`);
    const metadata = response.MediaContainer.Metadata;
    return Array.isArray(metadata) ? metadata : metadata ? [metadata] : [];
  }

  /**
   * Search the library
   */
  async search(query: string, libraryId?: string): Promise<{
    artists: PlexArtist[];
    albums: PlexAlbum[];
    tracks: PlexTrack[];
  }> {
    const results = {
      artists: [] as PlexArtist[],
      albums: [] as PlexAlbum[],
      tracks: [] as PlexTrack[],
    };

    const sections = libraryId 
      ? [{ key: libraryId }]
      : await this.getMusicLibraries();

    for (const section of sections) {
      try {
        const response = await this.request<PlexArtistsResponse>(
          `/library/sections/${section.key}/all?type=8&title=${encodeURIComponent(query)}`
        );
        const metadata = response.MediaContainer.Metadata;
        const items = Array.isArray(metadata) ? metadata : metadata ? [metadata] : [];
        results.artists.push(...items.filter((item): item is PlexArtist => item.type === 'artist'));
      } catch {
        // Ignore errors for individual sections
      }
    }

    return results;
  }

  /**
   * Get connected Plex players/clients
   */
  async getClients(): Promise<PlexPlayer[]> {
    const response = await this.request<PlexClientsResponse>('/clients');
    const servers = response.MediaContainer.Server;
    return Array.isArray(servers) ? servers : servers ? [servers] : [];
  }

  /**
   * Subscribe to player timeline updates
   */
  async subscribeTimeline(playerUrl: string, port: number): Promise<boolean> {
    try {
      await fetch(`${playerUrl}/player/timeline/subscribe?protocol=http&port=${port}`, {
        headers: {
          'X-Plex-Client-Identifier': 'plexthing-deskthing-app',
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Poll player timeline
   */
  async pollTimeline(playerUrl: string): Promise<PlexTimeline[]> {
    try {
      const response = await fetch(`${playerUrl}/player/timeline/poll?wait=0`, {
        headers: {
          'X-Plex-Client-Identifier': 'plexthing-deskthing-app',
        },
      });
      
      if (!response.ok) {
        return [];
      }

      const data = await response.json() as PlexTimelineResponse;
      const timelines = data.MediaContainer?.Timeline;
      return Array.isArray(timelines) ? timelines : timelines ? [timelines] : [];
    } catch {
      return [];
    }
  }

  /**
   * Send playback command to player
   */
  async sendCommand(
    playerUrl: string,
    command: 'play' | 'pause' | 'stop' | 'skipNext' | 'skipPrevious',
    type: 'music' = 'music'
  ): Promise<boolean> {
    try {
      const response = await fetch(`${playerUrl}/player/playback/${command}?type=${type}`, {
        method: 'GET',
        headers: {
          'X-Plex-Client-Identifier': 'plexthing-deskthing-app',
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Seek to position
   */
  async seek(playerUrl: string, offset: number): Promise<boolean> {
    try {
      const response = await fetch(
        `${playerUrl}/player/playback/seekTo?type=music&offset=${offset}`,
        {
          headers: {
            'X-Plex-Client-Identifier': 'plexthing-deskthing-app',
          },
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Set volume
   */
  async setVolume(playerUrl: string, volume: number): Promise<boolean> {
    try {
      const response = await fetch(
        `${playerUrl}/player/playback/setParameters?type=music&volume=${volume}`,
        {
          headers: {
            'X-Plex-Client-Identifier': 'plexthing-deskthing-app',
          },
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Play a specific track
   */
  async playMedia(
    playerUrl: string,
    key: string,
    machineIdentifier: string,
    serverAddress: string,
    port: number,
    protocol: 'http' | 'https' = 'http',
    token: string
  ): Promise<boolean> {
    try {
      const params = new URLSearchParams({
        key,
        machineIdentifier,
        address: serverAddress,
        port: String(port),
        protocol,
        token,
      });
      
      const response = await fetch(
        `${playerUrl}/player/playback/playMedia?${params.toString()}`,
        {
          headers: {
            'X-Plex-Client-Identifier': 'plexthing-deskthing-app',
          },
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Singleton instance
let plexClient: PlexAPI | null = null;

export function getPlexClient(): PlexAPI | null {
  return plexClient;
}

export function setPlexClient(client: PlexAPI | null): void {
  plexClient = client;
}

export function createPlexClient(config: PlexConfig): PlexAPI {
  plexClient = new PlexAPI(config);
  return plexClient;
}
