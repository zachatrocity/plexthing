import { DeskThing } from '@deskthing/server';
import { DESKTHING_EVENTS, SETTING_TYPES } from '@deskthing/types';
import { createPlexClient, getPlexClient } from './plex/index.js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

// Load .env file for local development
// Try multiple possible locations since the server may run from different directories
const envPaths = [
  resolve(process.cwd(), '.env'),
  resolve(process.cwd(), '..', '.env'),
  resolve(process.cwd(), '..', '..', '.env'),
];

for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    console.log(`Loading .env from: ${envPath}`);
    config({ path: envPath });
    break;
  }
}

// Track if settings have been initialized to prevent loops
let settingsInitialized = false;

// Settings keys
const SETTINGS = {
  PLEX_SERVER_URL: 'plex_server_url',
  PLEX_TOKEN: 'plex_token',
  PLAYER_IDENTIFIER: 'player_identifier',
  PLEX_LIBRARY: 'plex_library',
} as const;

// Default values that indicate "not configured" - we should use env fallback for these
const DEFAULT_VALUES = {
  [SETTINGS.PLEX_SERVER_URL]: 'http://localhost:32400',
  [SETTINGS.PLEX_TOKEN]: '',
  [SETTINGS.PLAYER_IDENTIFIER]: '',
  [SETTINGS.PLEX_LIBRARY]: '',
} as const;

/**
 * Get setting value with .env fallback for local development
 * Env vars take priority if set, allowing easy local development override
 */
const getSettingWithEnvFallback = (
  settings: Record<string, { value: unknown }> | null | undefined,
  settingKey: string,
  envKey: string
): string => {
  const envValue = process.env[envKey];
  const settingValue = settings?.[settingKey]?.value as string | undefined;
  const defaultValue = DEFAULT_VALUES[settingKey as keyof typeof DEFAULT_VALUES];
  
  // If env var is set, prefer it (allows local dev override)
  if (envValue && envValue.trim() !== '') {
    return envValue;
  }
  
  // Otherwise use setting value if it's not the default
  if (settingValue && settingValue.trim() !== '' && settingValue !== defaultValue) {
    return settingValue;
  }
  
  // Fall back to setting value even if it's default (better than nothing)
  return settingValue || '';
};

/**
 * Initialize Plex client with current settings
 * Falls back to .env values for local development
 */
const initializePlexClient = async (): Promise<boolean> => {
  const settings = await DeskThing.getSettings();

  // Get settings with .env fallbacks
  const baseUrl = getSettingWithEnvFallback(settings, SETTINGS.PLEX_SERVER_URL, 'PLEX_SERVER_URL');
  const token = getSettingWithEnvFallback(settings, SETTINGS.PLEX_TOKEN, 'PLEX_TOKEN');

  // Log if using env fallbacks (helpful for debugging)
  if (process.env.PLEX_SERVER_URL || process.env.PLEX_TOKEN) {
    console.log('Using .env values for Plex configuration');
  }

  if (!baseUrl || !token) {
    console.log('Plex not configured. Please set server URL and token in settings or .env file.');
    DeskThing.send({
      type: 'plex:connection',
      payload: { connected: false, error: 'Not configured' },
    });
    return false;
  }

  try {
    const client = createPlexClient({ baseUrl, token });
    const result = await client.testConnection();
    const libraries = await client.getMusicLibraries();

    if (result.success) {
      console.log(`Connected to Plex server: ${result.serverName}, libraries: ${JSON.stringify(libraries)}`);
      DeskThing.send({
        type: 'plex:connection',
        payload: { connected: true, serverName: result.serverName, library: libraries.find(l => l.title == SETTINGS.PLEX_LIBRARY) },
      });
      return true;
    } else {
      console.log(`Failed to connect to Plex: ${result.error}`);
      DeskThing.send({
        type: 'plex:connection',
        payload: { connected: false, error: result.error },
      });
      return false;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`Error initializing Plex client: ${message}`);
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
        console.log(`Unknown request type: ${request.type}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`Error handling request ${request.type}: ${message}`);
    DeskThing.send({
      type: 'error',
      payload: { type: request.type, message },
    });
  }
};

/**
 * Initialize settings with defaults if not set
 */
const initializeSettings = () => {
  if (settingsInitialized) {
    return;
  }

  console.log('Initializing PlexThing settings...');
  settingsInitialized = true;

  // Initialize settings in DeskThing - this creates the settings UI
  DeskThing.initSettings({
    [SETTINGS.PLEX_SERVER_URL]: {
      id: SETTINGS.PLEX_SERVER_URL,
      type: SETTING_TYPES.STRING,
      label: 'Plex Server URL',
      description: 'URL to your Plex Media Server (e.g., http://192.168.0.1:32400 or https://plex.yourdomain.com)',
      value: 'http://localhost:32400',
    },
    [SETTINGS.PLEX_TOKEN]: {
      id: SETTINGS.PLEX_TOKEN,
      type: SETTING_TYPES.STRING,
      label: 'Plex Token',
      description: 'Your Plex authentication token. Get it from Settings → Account → Plex Token',
      value: '',
    },
    [SETTINGS.PLAYER_IDENTIFIER]: {
      id: SETTINGS.PLAYER_IDENTIFIER,
      type: SETTING_TYPES.STRING,
      label: 'Target Player',
      description: 'Client identifier of the Plex player to control. Leave empty for auto-discovery.',
      value: '',
    },
  });
};

/**
 * App startup
 */
const start = async () => {
  console.log('PlexThing server starting...');

  // Initialize settings first
  initializeSettings();

  // Listen for requests from the frontend
  DeskThing.on(DESKTHING_EVENTS.DATA, handleRequest);

  // Initialize Plex connection
  await initializePlexClient();
};

/**
 * App shutdown
 */
const stop = async () => {
  console.log('PlexThing server stopping...');
};

// Main entry point
DeskThing.on(DESKTHING_EVENTS.START, start);

// Main exit point
DeskThing.on(DESKTHING_EVENTS.STOP, stop);
