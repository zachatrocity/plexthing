/**
 * Plex Media Server API Types
 * Based on official Plex API documentation
 */

// === Library Sections ===

export interface PlexLibrary {
  allowSync: boolean;
  art: string;
  composite: string;
  filters: boolean;
  refreshing: boolean;
  thumb: string;
  key: string;
  type: 'artist' | 'movie' | 'show' | 'photo'; // 'artist' for music
  title: string;
  agent: string;
  scanner: string;
  language: string;
  uuid: string;
  updatedAt: number;
  createdAt: number;
  scannedAt: number;
  hidden: number;
  Location: PlexLibraryLocation[];
}

export interface PlexLibraryLocation {
  id: number;
  path: string;
}

export interface PlexLibrarySectionsResponse {
  MediaContainer: {
    size: number;
    allowSync: boolean;
    identifier: string;
    mediaTagPrefix: string;
    mediaTagVersion: number;
    title1: string;
    Directory: PlexLibrary | PlexLibrary[];
  };
}

// === Artists ===

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
  genre?: PlexTag[];
  style?: PlexTag[];
  mood?: PlexTag[];
  country?: PlexTag[];
}

export interface PlexTag {
  tag: string;
}

export interface PlexArtistsResponse {
  MediaContainer: {
    size: number;
    allowSync: boolean;
    art: string;
    identifier: string;
    librarySectionID: number;
    librarySectionTitle: string;
    librarySectionUUID: string;
    mediaTagPrefix: string;
    mediaTagVersion: number;
    nocache: boolean;
    thumb: string;
    title1: string;
    title2: string;
    viewGroup: 'artist';
    Metadata: PlexArtist | PlexArtist[];
  };
}

// === Albums ===

export interface PlexAlbum {
  ratingKey: string;
  key: string;
  parentRatingKey: string;
  guid: string;
  parentGuid: string;
  studio: string;
  type: 'album';
  title: string;
  parentKey: string;
  parentTitle: string;
  summary: string;
  index: number;
  parentIndex: number;
  parentThumb: string;
  thumb: string;
  art: string;
  addedAt: number;
  updatedAt: number;
  originallyAvailableAt: string;
  parentYear: number;
  genre?: PlexTag[];
  style?: PlexTag[];
}

export interface PlexAlbumsResponse {
  MediaContainer: {
    size: number;
    allowSync: boolean;
    art: string;
    identifier: string;
    librarySectionID: number;
    librarySectionTitle: string;
    librarySectionUUID: string;
    mediaTagPrefix: string;
    mediaTagVersion: number;
    nocache: boolean;
    parentIndex: number;
    parentTitle: string;
    parentTag: string;
    parentType: string;
    parentYear: number;
    thumb: string;
    title1: string;
    title2: string;
    viewGroup: 'album';
    Metadata: PlexAlbum | PlexAlbum[];
  };
}

// === Tracks ===

export interface PlexTrack {
  ratingKey: string;
  key: string;
  parentRatingKey: string;
  grandparentRatingKey: string;
  guid: string;
  parentGuid: string;
  grandparentGuid: string;
  studio: string;
  type: 'track';
  title: string;
  grandparentKey: string;
  parentKey: string;
  grandparentTitle: string;
  parentTitle: string;
  summary: string;
  index: number;
  parentIndex: number;
  grandparentThumb: string;
  parentThumb: string;
  thumb: string;
  art: string;
  duration: number;
  addedAt: number;
  updatedAt: number;
  Media?: PlexMedia[];
}

export interface PlexMedia {
  id: number;
  duration: number;
  bitrate: number;
  audioChannels: number;
  audioCodec: string;
  container: string;
  Part: PlexMediaPart;
}

export interface PlexMediaPart {
  id: number;
  key: string;
  duration: number;
  file: string;
  size: number;
  container: string;
}

export interface PlexTracksResponse {
  MediaContainer: {
    size: number;
    allowSync: boolean;
    art: string;
    identifier: string;
    librarySectionID: number;
    librarySectionTitle: string;
    librarySectionUUID: string;
    mediaTagPrefix: string;
    mediaTagVersion: number;
    nocache: boolean;
    parentIndex: number;
    parentThumb: string;
    parentTitle: string;
    parentType: string;
    parentYear: number;
    summary: string;
    thumb: string;
    title1: string;
    title2: string;
    viewGroup: 'track';
    Metadata: PlexTrack | PlexTrack[];
  };
}

// === Clients / Players ===

export interface PlexPlayer {
  name: string;
  host: string;
  product: string;
  device: string;
  platform: string;
  platformVersion: string;
  version: string;
  machineIdentifier: string;
  local: boolean;
  relayed: boolean;
  publicAddress: string;
  secure: boolean;
  protocol: string;
  port: number;
  address: string;
}

export interface PlexClientsResponse {
  MediaContainer: {
    size: number;
    Server: PlexPlayer | PlexPlayer[];
  };
}

// === Timeline ===

export interface PlexTimeline {
  type: 'music' | 'video' | 'photo';
  state: 'stopped' | 'paused' | 'playing' | 'buffering' | 'error';
  time?: number;
  duration?: number;
  ratingKey?: string;
  key?: string;
  containerKey?: string;
  machineIdentifier?: string;
  address?: string;
  port?: number;
  protocol?: string;
  volume?: number;
  shuffle?: boolean;
  repeat?: boolean;
  controllable?: string;
  playQueueID?: number;
  playQueueItemID?: number;
  playQueueVersion?: number;
}

export interface PlexTimelineResponse {
  MediaContainer: {
    commandID: number;
    Timeline: PlexTimeline | PlexTimeline[];
  };
}

// === API Errors ===

export class PlexAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'PlexAPIError';
  }
}

// === Config ===

export interface PlexConfig {
  baseUrl: string;
  token: string;
  deviceName?: string;
}
