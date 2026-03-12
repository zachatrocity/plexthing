import React, { useEffect, useState } from 'react';
import { DeskThing } from '@deskthing/client';

export interface PlexAlbum {
  ratingKey: string;
  title: string;
  parentTitle: string;
  thumb: string;
  art: string;
  addedAt: number;
  updatedAt: number;
  parentYear?: number;
}

type LoadingState = 'idle' | 'loading' | 'error' | 'empty';

interface AlbumListProps {
  artistId?: string;
  onAlbumSelect?: (album: PlexAlbum) => void;
}

const AlbumList: React.FC<AlbumListProps> = ({ artistId, onAlbumSelect }) => {
  const [albums, setAlbums] = useState<PlexAlbum[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data?.type) return;

      switch (data.type) {
        case 'plex:albums': {
          const fetched = Array.isArray(data.payload) ? data.payload : [];
          if (fetched.length === 0) {
            setLoadingState('empty');
            setAlbums([]);
          } else {
            setAlbums(fetched);
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

    if (artistId) {
      fetchAlbums(artistId);
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [artistId]);

  const fetchAlbums = (id: string) => {
    setLoadingState('loading');
    setError(null);
    DeskThing.send({ type: 'plex:getAlbums', payload: { artistId: id } });
  };

  const handleRetry = () => {
    if (artistId) fetchAlbums(artistId);
  };

  const AlbumSkeleton = () => (
    <div className="flex flex-col items-center">
      <div className="w-full aspect-square bg-[#1a1a1a] rounded-lg animate-pulse" />
      <div className="w-3/4 h-4 bg-[#1a1a1a] rounded mt-2 animate-pulse" />
    </div>
  );

  if (loadingState === 'loading' && albums.length === 0) {
    return (
      <div className="h-full overflow-y-auto p-4">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <AlbumSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (loadingState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Albums</h3>
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
        <h3 className="text-lg font-semibold text-white mb-2">No Albums Found</h3>
        <p className="text-sm text-[#a0a0a0]">This artist does not have any albums.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="grid grid-cols-3 gap-4">
        {albums.map((album) => (
          <button
            key={album.ratingKey}
            onClick={() => onAlbumSelect?.(album)}
            className="flex flex-col items-center group"
          >
            <div className="relative w-full aspect-square bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#333] group-hover:border-[#E5A00D] transition-colors">
              {album.thumb ? (
                <img
                  src={album.thumb}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-[#666] bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]">
                  No Art
                </div>
              )}
            </div>
            <p className="text-xs text-white font-medium mt-2 text-center truncate w-full px-1 group-hover:text-[#E5A00D] transition-colors">
              {album.title}
            </p>
            {album.parentYear ? (
              <p className="text-[10px] text-[#707070]">{album.parentYear}</p>
            ) : null}
          </button>
        ))}
      </div>
      <div className="h-4" />
    </div>
  );
};

export default AlbumList;
