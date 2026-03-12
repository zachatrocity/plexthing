import React from 'react';

interface ConnectionStatusProps {
  connected: boolean;
  serverName?: string;
  libraryName?: string;
  error?: string;
  onRetry: () => void;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  connected,
  serverName,
  libraryName,
  error,
  onRetry,
}) => {
  if (connected) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] rounded-2xl border border-[#333]">
        <div className="w-3 h-3 bg-[#4ade80] rounded-full animate-pulse shadow-[0_0_10px_#4ade80] mr-2" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">Connected</p>
          {serverName && libraryName && (
            <p className="text-xs text-[#a0a0a0] truncate">{serverName} - {libraryName}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] rounded-2xl border border-[#ef4444]/30">
      <div className="w-3 h-3 bg-[#ef4444] rounded-full shadow-[0_0_10px_#ef4444]" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">Not Connected</p>
        {error && (
          <p className="text-xs text-[#a0a0a0] truncate">{error}</p>
        )}
      </div>
      <button
        onClick={onRetry}
        className="px-4 py-2 text-xs font-semibold bg-[#E5A00D] hover:bg-[#f5b020] text-black rounded-xl transition-all active:scale-95"
      >
        Retry
      </button>
    </div>
  );
};

export default ConnectionStatus;