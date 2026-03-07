import React, { useState, useEffect } from 'react';
import { DeskThing } from '@deskthing/client';
import ConnectionStatus from './components/ConnectionStatus';

type View = 'home' | 'library' | 'player';

interface AppState {
  view: View;
  connected: boolean;
  serverName?: string;
  error?: string;
}

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [connected, setConnected] = useState(false);
  const [serverName, setServerName] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data?.type) return;

      switch (data.type) {
        case 'plex:connection': {
          const { connected: conn, error: err, serverName: name } = data.payload;
          setConnected(conn);
          setError(err);
          setServerName(name);
          setIsLoading(false);
          break;
        }
        case 'plex:libraries': {
          console.log('Libraries:', data.payload);
          break;
        }
        case 'plex:artists': {
          console.log('Artists:', data.payload);
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
    setIsLoading(true);
    setError(undefined);
    DeskThing.send({ type: 'plex:testConnection', payload: {} });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-[#E5A00D] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-[#a0a0a0] text-lg">Connecting to Plex...</p>
          </div>
        </div>
      );
    }

    switch (view) {
      case 'home':
      default:
        return (
          <div className="p-5 space-y-5">
            {/* Logo/Title Section */}
            <div className="text-center py-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#E5A00D] to-[#f5b020] bg-clip-text text-transparent">
                PlexThing
              </h1>
              <p className="text-[#707070] text-sm mt-1">Plex Music for DeskThing</p>
            </div>

            <ConnectionStatus
              connected={connected}
              serverName={serverName}
              error={error}
              onRetry={handleRetryConnection}
            />

            {/* Main Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setView('library')}
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