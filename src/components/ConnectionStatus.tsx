import React from 'react';

interface ConnectionStatusProps {
  connected: boolean;
  serverName?: string;
  error?: string;
  onRetry: () => void;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  connected,
  serverName,
  error,
  onRetry,
}) => {
  if (connected) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-green-900/50 rounded-lg border border-green-800">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-400">Connected</p>
          {serverName && (
            <p className="text-xs text-green-300">{serverName}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-red-900/50 rounded-lg border border-red-800">
      <div className="w-2 h-2 bg-red-500 rounded-full" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-red-400">Not Connected</p>
        {error && (
          <p className="text-xs text-red-300 truncate">{error}</p>
        )}
      </div>
      <button
        onClick={onRetry}
        className="px-2 py-1 text-xs bg-red-800 hover:bg-red-700 text-red-200 rounded transition-colors"
      >
        Retry
      </button>
    </div>
  );
};

export default ConnectionStatus;
