import React, { useEffect, useState } from 'react';
import { DeskThing } from '@deskthing/client';

export interface PlexTrack {
  ratingKey: string;
  title: string;
  index: number;
  duration: number;
}

type LoadingState = 'idle' | 'loading' | 'error' | 'empty';

interface TrackListProps {
  albumId?: string;
}

const formatTime = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const TrackList: React.FC<TrackListProps> = ({ albumId }) => {
  const [tracks, setTracks] = useState<PlexTrack[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data?.type) return;

      switch (data.type) {
        case 'plex:tracks': {
          const fetched = Array.isArray(data.payload) ? data.payload : [];
          if (fetched.length === 0) {
            setLoadingState('empty');
            setTracks([]);
          } else {
            setTracks(fetched);
            setLoadingState('idle');
          }
          setError(null);
          break;
        }

        case 'error': {
          setError(data.payload?.message || 'An error occurred');
          setLoadingState('error');
          break;
        }
      }
    };

    window.addEventListener('message', handleMessage);

    if (albumId) {
      fetchTracks(albumId);
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [albumId]);

  const fetchTracks = (id: string) => {
    setLoadingState('loading');
    setError(null);
    DeskThing.send({ type: 'plex:getTracks', payload: { albumId: id } });
  };

  const handleRetry = () => {
    if (albumId) fetchTracks(albumId);
  };

  if (loadingState === 'loading' && tracks.length === 0) {
    return (
      <div className="h-full overflow-y-auto p-4 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 bg-[#1a1a1a] rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (loadingState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Tracks</h3>
        <p className="text-sm text-[#a0a0a0] mb-4">{error || 'Something went wrong'}</p>
        <button
          onClick={handleRetry}
          className="px-6 py-3 bg-[#E5A00D] hover:bg-[#f5b020] text-black font-semibold rounded-xl transition-all active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loadingState === 'empty') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">No Tracks Found</h3>
        <p className="text-sm text-[#a0a0a0]">This album does not have any tracks.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-2">
      {tracks.map((track) => (
        <div
          key={track.ratingKey}
          className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#101010] border border-[#202020]"
        >
          <div className="text-xs text-[#808080] w-6 text-right">
            {track.index}
          </div>
          <div className="flex-1 text-sm text-white truncate">{track.title}</div>
          <div className="text-xs text-[#707070]">{formatTime(track.duration)}</div>
        </div>
      ))}
      <div className="h-4" />
    </div>
  );
};

export default TrackList;
