import React, { useState, useEffect } from 'react';
import { DeskThing } from '@deskthing/client';
import ConnectionStatus from './components/ConnectionStatus';
import ArtistList, { PlexArtist } from './components/ArtistList';
import AlbumList, { PlexAlbum } from './components/AlbumList';
import TrackList from './components/TrackList';
import NowPlaying, { NowPlayingData } from './components/NowPlaying';

type View = 'home' | 'artists' | 'albums' | 'tracks' | 'player';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [connected, setConnected] = useState(false);
  const [serverName, setServerName] = useState<string | undefined>();
  const [libraryName, setLibraryName] = useState<string | undefined>();
  const [libraryId, setLibraryId] = useState<string | undefined>();
  const [selectedArtist, setSelectedArtist] = useState<PlexArtist | undefined>();
  const [selectedAlbum, setSelectedAlbum] = useState<PlexAlbum | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData>({
    title: 'Nothing Playing',
    artist: '—',
    album: '—',
    artworkUrl: undefined,
    durationMs: 0,
    positionMs: 0,
    isPlaying: false,
    shuffle: false,
    repeat: 'off',
    volume: 70,
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data?.type) return;

      switch (data.type) {
        case 'plex:connection': {
          const { connected: conn, error: err, serverName: name, library } = data.payload;
          setConnected(conn);
          setError(err);
          setServerName(name);
          setLibraryName(library?.title);
          setLibraryId(library?.key);

          if (conn) {
            DeskThing.send({ type: 'plex:getLibraries', payload: {} });
          }
          break;
        }
        case 'plex:libraries': {
          const libs = Array.isArray(data.payload) ? data.payload : [];
          const music = libs.find((l) => l.type === 'artist') || libs[0];
          if (music) {
            setLibraryId(music.key);
            setLibraryName(music.title);
          }
          break;
        }
        case 'plex:artists': {
          console.log('Artists:', data.payload);
          break;
        }
        case 'plex:nowPlaying': {
          setNowPlaying((prev) => ({ ...prev, ...(data.payload as Partial<NowPlayingData>) }));
          break;
        }
        case 'error': {
          console.error('Server error:', data.payload);
          setError(data.payload?.message || 'Unknown error');
          break;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    DeskThing.send({ type: 'plex:testConnection', payload: {} });

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleRetryConnection = () => {
    setError(undefined);
    DeskThing.send({ type: 'plex:testConnection', payload: {} });
  };

  const goToArtists = () => {
    setSelectedAlbum(undefined);
    setSelectedArtist(undefined);
    setView('artists');
  };

  const goToAlbums = (artist?: PlexArtist) => {
    if (artist) setSelectedArtist(artist);
    setSelectedAlbum(undefined);
    setView('albums');
  };

  const goToTracks = (album?: PlexAlbum) => {
    if (album) setSelectedAlbum(album);
    setView('tracks');
  };

  const handleSeek = (positionMs: number) => {
    setNowPlaying((prev) => ({ ...prev, positionMs }));
    // Future: DeskThing.send({ type: 'plex:seek', payload: { positionMs } });
  };

  const handleTogglePlay = () => {
    setNowPlaying((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
    // Future: DeskThing.send({ type: 'plex:playPause', payload: {} });
  };

  const handlePrev = () => {
    // Future: DeskThing.send({ type: 'plex:prev', payload: {} });
  };

  const handleNext = () => {
    // Future: DeskThing.send({ type: 'plex:next', payload: {} });
  };

  const handleVolumeChange = (volume: number) => {
    setNowPlaying((prev) => ({ ...prev, volume }));
    // Future: DeskThing.send({ type: 'plex:setVolume', payload: { volume } });
  };

  const handleToggleShuffle = () => {
    setNowPlaying((prev) => ({ ...prev, shuffle: !prev.shuffle }));
    // Future: DeskThing.send({ type: 'plex:toggleShuffle', payload: {} });
  };

  const handleToggleRepeat = () => {
    setNowPlaying((prev) => ({
      ...prev,
      repeat: prev.repeat === 'off' ? 'all' : prev.repeat === 'all' ? 'one' : 'off',
    }));
    // Future: DeskThing.send({ type: 'plex:toggleRepeat', payload: {} });
  };

  const renderContent = () => {
    switch (view) {
      case 'artists':
        return (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#222] bg-[#0f0f0f]">
              <button
                onClick={() => setView('home')}
                className="flex items-center gap-2 text-[#a0a0a0] hover:text-white transition-colors"
              >
                <span className="text-xl">←</span>
                <span className="text-sm font-medium">Back</span>
              </button>
              <h2 className="text-lg font-bold text-white ml-2">Library</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <ArtistList
                libraryId={libraryId}
                onArtistSelect={(artist) => goToAlbums(artist)}
              />
            </div>
          </div>
        );

      case 'albums':
        return (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#222] bg-[#0f0f0f]">
              <button
                onClick={() => goToArtists()}
                className="flex items-center gap-2 text-[#a0a0a0] hover:text-white transition-colors"
              >
                <span className="text-xl">←</span>
                <span className="text-sm font-medium">Back</span>
              </button>
              <h2 className="text-lg font-bold text-white ml-2 truncate">
                {selectedArtist?.title || 'Albums'}
              </h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <AlbumList
                artistId={selectedArtist?.ratingKey}
                onAlbumSelect={(album) => goToTracks(album)}
              />
            </div>
          </div>
        );

      case 'tracks':
        return (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#222] bg-[#0f0f0f]">
              <button
                onClick={() => goToAlbums()}
                className="flex items-center gap-2 text-[#a0a0a0] hover:text-white transition-colors"
              >
                <span className="text-xl">←</span>
                <span className="text-sm font-medium">Back</span>
              </button>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-white truncate">
                  {selectedAlbum?.title || 'Tracks'}
                </h2>
                {selectedArtist?.title ? (
                  <p className="text-xs text-[#707070] truncate">{selectedArtist.title}</p>
                ) : null}
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <TrackList albumId={selectedAlbum?.ratingKey} />
            </div>
          </div>
        );

      case 'player':
        return (
          <div className="h-full">
            <NowPlaying
              data={nowPlaying}
              onSeek={handleSeek}
              onTogglePlay={handleTogglePlay}
              onPrev={handlePrev}
              onNext={handleNext}
              onVolumeChange={handleVolumeChange}
              onToggleShuffle={handleToggleShuffle}
              onToggleRepeat={handleToggleRepeat}
            />
          </div>
        );

      case 'home':
      default:
        return (
          <div className="p-5 space-y-5">
            <ConnectionStatus
              connected={connected}
              serverName={serverName}
              libraryName={libraryName}
              error={error}
              onRetry={handleRetryConnection}
            />

            {/* Main Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setView('artists')}
                disabled={!connected}
                className="group flex flex-col items-center justify-center p-6 bg-[#1a1a1a] hover:bg-[#2a2a2a] disabled:bg-[#0f0f0f] disabled:text-[#505050] text-white rounded-2xl border border-[#333] transition-all active:scale-95 disabled:active:scale-100 min-h-[120px]"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎵</div>
                <div className="text-base font-semibold">Library</div>
              </button>

              <button
                onClick={() => DeskThing.send({ type: 'plex:getClients', payload: {} })}
                disabled={!connected}
                className="group flex flex-col items-center justify-center p-6 bg-[#1a1a1a] hover:bg-[#2a2a2a] disabled:bg-[#0f0f0f] disabled:text-[#505050] text-white rounded-2xl border border-[#333] transition-all active:scale-95 disabled:active:scale-100 min-h-[120px]"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎮</div>
                <div className="text-base font-semibold">Players</div>
              </button>

              <button
                onClick={() => setView('player')}
                disabled={!connected}
                className="group flex flex-col items-center justify-center p-6 bg-[#E5A00D] hover:bg-[#f5b020] disabled:bg-[#1a1a1a] disabled:text-[#505050] text-black rounded-2xl border border-[#E5A00D] transition-all active:scale-95 disabled:active:scale-100 min-h-[120px]"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">▶️</div>
                <div className="text-base font-bold">Now Playing</div>
              </button>

              <button
                onClick={() => DeskThing.send({ type: 'plex:testConnection', payload: {} })}
                className="group flex flex-col items-center justify-center p-6 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-2xl border border-[#333] transition-all active:scale-95 min-h-[120px]"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🔄</div>
                <div className="text-base font-semibold">Refresh</div>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-black w-full h-full overflow-hidden flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center px-5 py-4 border-b border-[#222]">
        <button
          onClick={() => setView('home')}
          className="text-white font-bold text-xl hover:text-[#E5A00D] transition-colors"
        >
          PlexThing
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Footer status bar */}
      <footer className="px-5 py-3 border-t border-[#222] text-center">
        <p className="text-xs text-[#505050]">
          {connected ? `Connected to ${serverName || 'Plex'}` : 'Not connected'}
        </p>
      </footer>
    </div>
  );
};

export default App;