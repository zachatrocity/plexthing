import { DeskThing } from '@deskthing/server';
import { DESKTHING_EVENTS } from '@deskthing/types';
import { createPlexClient, getPlexClient, PlexAPI } from './plex/index.js';

// Settings keys
const SETTINGS = {
  PLEX_SERVER_URL: 'plex_server_url',
  PLEX_TOKEN: 'plex_token',
  PLAYER_IDENTIFIER: 'player_identifier',
} as const;

/**
 * Initialize Plex client with current settings
 */
const initializePlexClient = async (): Promise<boolean> => {
  const settings = await DeskThing.getSettings();
  
  const baseUrl = settings?.[SETTINGS.PLEX_SERVER_URL]?.value as string;
  const token = settings?.[SETTINGS.PLEX_TOKEN]?.value as string;
  
  if (!baseUrl || !token) {
    DeskThing.sendLog('Plex not configured. Please set server URL and token in settings.');
    DeskThing.send({
      type: 'plex:connection',
      payload: { connected: false, error: 'Not configured' },
    });
    return false;
  }

  try {
    const client = createPlexClient({ baseUrl, token });
    const result = await client.testConnection();
    
    if (result.success) {
      DeskThing.sendLog(`Connected to Plex server: ${result.serverName}`);
      DeskThing.send({
        type: 'plex:connection',
        payload: { connected: true, serverName: result.serverName },
      });
      return true;
    } else {
      DeskThing.sendLog(`Failed to connect to Plex: ${result.error}`);
      DeskThing.send({
        type: 'plex:connection',
        payload: { connected: false, error: result.error },
      });
      return false;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    DeskThing.sendLog(`Error initializing Plex client: ${message}`);
    DeskThing.send({
      type: 'plex:connection',
      payload: { connected: false, error: message },
    });
    return false;
  }
};

/**
 * Handle requests from the React frontend
 */
const handleRequest = async (request: { type: string; payload?: unknown }) => {
  const client = getPlexClient();
  
  if (!client) {
    DeskThing.send({
      type: 'error',
      payload: { message: 'Plex not connected' },
    });
    return;
  }

  try {
    switch (request.type) {
      case 'plex:getLibraries': {
        const libraries = await client.getMusicLibraries();
        DeskThing.send({
          type: 'plex:libraries',
          payload: libraries,
        });
        break;
      }

      case 'plex:getArtists': {
        const { libraryId } = request.payload as { libraryId: string };
        const artists = await client.getArtists(libraryId);
        DeskThing.send({
          type: 'plex:artists',
          payload: artists,
        });
        break;
      }

      case 'plex:getAlbums': {
        const { artistId } = request.payload as { artistId: string };
        const albums = await client.getAlbums(artistId);
        DeskThing.send({
          type: 'plex:albums',
          payload: albums,
        });
        break;
      }

      case 'plex:getTracks': {
        const { albumId } = request.payload as { albumId: string };
        const tracks = await client.getTracks(albumId);
        DeskThing.send({
          type: 'plex:tracks',
          payload: tracks,
        });
        break;
      }

      case 'plex:getClients': {
        const players = await client.getClients();
        DeskThing.send({
          type: 'plex:clients',
          payload: players,
        });
        break;
      }

      case 'plex:search': {
        const { query, libraryId } = request.payload as { query: string; libraryId?: string };
        const results = await client.search(query, libraryId);
        DeskThing.send({
          type: 'plex:searchResults',
          payload: results,
        });
        break;
      }

      case 'plex:playMedia': {
        // This would need player URL from selected player
        // For now, just acknowledge
        DeskThing.send({
          type: 'plex:ack',
          payload: { action: 'playMedia' },
        });
        break;
      }

      case 'plex:testConnection': {
        await initializePlexClient();
        break;
      }

      default:
        DeskThing.sendLog(`Unknown request type: ${request.type}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    DeskThing.sendLog(`Error handling request ${request.type}: ${message}`);
    DeskThing.send({
      type: 'error',
      payload: { type: request.type, message },
    });
  }
};

/**
 * App startup
 */
const start = async () => {
  DeskThing.sendLog('PlexThing server starting...');
  
  // Listen for requests from the frontend
  DeskThing.on(DESKTHING_EVENTS.DATA, handleRequest);
  
  // Initialize Plex connection
  await initializePlexClient();
};

/**
 * App shutdown
 */
const stop = async () => {
  DeskThing.sendLog('PlexThing server stopping...');
};

// Main entry point
DeskThing.on(DESKTHING_EVENTS.START, start);

// Main exit point
DeskThing.on(DESKTHING_EVENTS.STOP, stop);

// Handle settings changes
DeskThing.on(DESKTHING_EVENTS.SETTINGS, async () => {
  DeskThing.sendLog('Settings updated, reinitializing Plex connection...');
  await initializePlexClient();
});
