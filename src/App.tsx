import React, { useState, useEffect } from 'react';
import { DeskThing } from '@deskthing/client';
import ConnectionStatus from './components/ConnectionStatus';

type View = 'home' | 'settings' | 'library' | 'player';

interface AppState {
  view: View;
  connected: boolean;
  serverName?: string;
  error?: string;
  currentView: string;
}

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [connected, setConnected] = useState(false);
  const [serverName, setServerName] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for messages from the server
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
          // Handle libraries data
          console.log('Libraries:', data.payload);
          break;
        }

        case 'plex:artists': {
          // Handle artists data
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

    // Request initial connection status
    DeskThing.send({
      type: 'plex:testConnection',
      payload: {},
    });

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleRetryConnection = () => {
    setIsLoading(true);
    setError(undefined);
    DeskThing.send({
      type: 'plex:testConnection',
      payload: {},
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Connecting to Plex...</p>
          </div>
        </div>
      );
    }

    switch (view) {
      case 'home':
      default:
        return (
          <div className="p-4 space-y-4">
            <div className="text-center mb-6">
              <p className="text-gray-400">Plexamp for DeskThing</p>
            </div>

            <ConnectionStatus
              connected={connected}
              serverName={serverName}
              error={error}
              onRetry={handleRetryConnection}
            />

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setView('library')}
                disabled={!connected}
                className="p-4 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-white rounded-lg border border-slate-700 transition-colors"
              >
                <div className="text-2xl mb-2">🎵</div>
                <div className="text-sm font-medium">Music Library</div>
              </button>

              <button
                onClick={() => DeskThing.send({ type: 'plex:getClients', payload: {} })}
                disabled={!connected}
                className="p-4 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-white rounded-lg border border-slate-700 transition-colors"
              >
                <div className="text-2xl mb-2">🎮</div>
                <div className="text-sm font-medium">Find Players</div>
              </button>

              <button
                onClick={() => setView('player')}
                disabled={!connected}
                className="p-4 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-white rounded-lg border border-slate-700 transition-colors"
              >
                <div className="text-2xl mb-2">▶️</div>
                <div className="text-sm font-medium">Now Playing</div>
              </button>

              <button
                onClick={() => setView('settings')}
                className="p-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors"
              >
                <div className="text-2xl mb-2">⚙️</div>
                <div className="text-sm font-medium">Settings</div>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-900 w-full h-full overflow-hidden flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center px-4 py-3 border-b border-slate-800">
        <button
          onClick={() => setView('home')}
          className="text-white font-bold text-lg hover:text-blue-400 transition-colors"
        >
          PlexThing
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Footer status bar */}
      <footer className="px-4 py-2 border-t border-slate-800 text-center">
        <p className="text-xs text-gray-500">
          {connected ? `Connected to ${serverName || 'Plex'}` : 'Not connected'}
        </p>
      </footer>
    </div>
  );
};

export default App;
