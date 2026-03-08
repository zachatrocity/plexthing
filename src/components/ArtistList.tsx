import React from 'react';
import { useArtists, PlexArtist } from '../hooks/useArtists';

// Re-export PlexArtist for backward compatibility
export type { PlexArtist };

export interface PlexLibrary {
  key: string;
  type: string;
  title: string;
  thumb: string;
}

interface ArtistListProps {
  libraryId?: string;
  onArtistSelect?: (artist: PlexArtist) => void;
  baseUrl?: string;
  token?: string;
}

const ArtistList: React.FC<ArtistListProps> = ({ libraryId, onArtistSelect, baseUrl, token }) => {
  const { artists, recentlyAdded, loadingState, error, refetch } = useArtists({
    libraryId: libraryId || null,
    baseUrl,
    token,
  });

  const handleRetry = () => {
    refetch();
  };

  const formatAddedDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Loading skeleton component
  const ArtistSkeleton = () => (
    <div className="flex flex-col items-center">
      <div className="w-full aspect-square bg-[#1a1a1a] rounded-lg animate-pulse" />
      <div className="w-3/4 h-4 bg-[#1a1a1a] rounded mt-2 animate-pulse" />
    </div>
  );

  // Render loading state
  if (loadingState === 'loading' && artists.length === 0) {
    return (
      <div className="h-full overflow-y-auto p-4 space-y-6">
        {/* Recently Added skeleton */}
        <section>
          <div className="h-4 bg-[#1a1a1a] rounded animate-pulse w-32 mb-3" />
          <div className="flex gap-3 overflow-x-auto pb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-24">
                <div className="w-full aspect-square bg-[#1a1a1a] rounded-xl animate-pulse" />
                <div className="w-3/4 h-3 bg-[#1a1a1a] rounded mt-2 animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        </section>
        
        {/* All Artists skeleton */}
        <section>
          <div className="h-4 bg-[#1a1a1a] rounded animate-pulse w-24 mb-3" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <ArtistSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Render error state
  if (loadingState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Artists</h3>
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

  // Render empty state
  if (loadingState === 'empty') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-6xl mb-4">🎵</div>
        <h3 className="text-lg font-semibold text-white mb-2">No Artists Found</h3>
        <p className="text-sm text-[#a0a0a0]">
          This music library doesn't have any artists yet.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {/* Recently Added Section */}
      {recentlyAdded.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-[#E5A00D] uppercase tracking-wider mb-3">
            Recently Added
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {recentlyAdded.map(artist => (
              <button
                key={`recent-${artist.ratingKey}`}
                onClick={() => onArtistSelect?.(artist)}
                className="flex-shrink-0 w-24 group"
              >
                <div className="relative aspect-square bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#333] group-hover:border-[#E5A00D] transition-colors">
                  {artist.thumb ? (
                    <img
                      src={artist.thumb}
                      alt={artist.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]">
                      🎵
                    </div>
                  )}
                </div>
                <p className="text-xs text-white font-medium mt-2 text-center truncate px-1">
                  {artist.title}
                </p>
                <p className="text-[10px] text-[#707070] text-center">
                  {formatAddedDate(artist.addedAt)}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* All Artists Grid */}
      <section>
        <h2 className="text-sm font-bold text-[#E5A00D] uppercase tracking-wider mb-3">
          All Artists
        </h2>
        {loadingState === 'loading' ? (
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ArtistSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {artists.map(artist => (
              <button
                key={artist.ratingKey}
                onClick={() => onArtistSelect?.(artist)}
                className="flex flex-col items-center group"
              >
                <div className="relative w-full aspect-square bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#333] group-hover:border-[#E5A00D] transition-colors">
                  {artist.thumb ? (
                    <img
                      src={artist.thumb}
                      alt={artist.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]">
                      🎵
                    </div>
                  )}
                </div>
                <p className="text-xs text-white font-medium mt-2 text-center truncate w-full px-1 group-hover:text-[#E5A00D] transition-colors">
                  {artist.title}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Footer spacing for scroll */}
      <div className="h-4" />
    </div>
  );
};

export default ArtistList;
