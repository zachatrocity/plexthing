import React from 'react';

export type NowPlayingData = {
  title: string;
  artist: string;
  album: string;
  artworkUrl?: string;
  durationMs: number;
  positionMs: number;
  isPlaying: boolean;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
  volume: number; // 0-100
};

type Props = {
  data: NowPlayingData;
  onSeek: (positionMs: number) => void;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
};

const formatTime = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const NowPlaying: React.FC<Props> = ({
  data,
  onSeek,
  onTogglePlay,
  onPrev,
  onNext,
  onVolumeChange,
  onToggleShuffle,
  onToggleRepeat,
}) => {
  const progressPercent = data.durationMs
    ? Math.min(100, Math.max(0, (data.positionMs / data.durationMs) * 100))
    : 0;

  return (
    <div className="flex flex-col h-full px-4 py-4 text-white">
      {/* Artwork */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-[60%] aspect-square bg-[#1a1a1a] rounded-2xl border border-[#333] overflow-hidden shadow-lg">
          {data.artworkUrl ? (
            <img
              src={data.artworkUrl}
              alt={`${data.album} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#555] text-4xl">
              🎵
            </div>
          )}
        </div>
      </div>

      {/* Track Info */}
      <div className="mt-3 text-center">
        <div className="text-lg font-bold truncate">{data.title}</div>
        <div className="text-sm text-[#b0b0b0] truncate">{data.artist}</div>
        <div className="text-xs text-[#707070] truncate">{data.album}</div>
      </div>

      {/* Progress */}
      <div className="mt-3">
        <input
          type="range"
          min={0}
          max={data.durationMs || 1}
          value={data.positionMs}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-full accent-[#E5A00D]"
        />
        <div className="flex justify-between text-xs text-[#808080] mt-1">
          <span>{formatTime(data.positionMs)}</span>
          <span>{formatTime(data.durationMs)}</span>
        </div>
        <div className="h-1 bg-[#222] rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-[#E5A00D]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          onClick={onPrev}
          className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-xl active:scale-95"
        >
          ⏮
        </button>
        <button
          onClick={onTogglePlay}
          className="w-14 h-14 rounded-full bg-[#E5A00D] text-black flex items-center justify-center text-2xl font-bold active:scale-95"
        >
          {data.isPlaying ? '⏸' : '▶️'}
        </button>
        <button
          onClick={onNext}
          className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-xl active:scale-95"
        >
          ⏭
        </button>
      </div>

      {/* Volume + toggles */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          onClick={onToggleShuffle}
          className={`px-3 py-2 rounded-lg border text-sm ${
            data.shuffle
              ? 'bg-[#E5A00D] text-black border-[#E5A00D]'
              : 'bg-[#1a1a1a] text-white border-[#333]'
          }`}
        >
          🔀
        </button>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-[#808080]">🔈</span>
          <input
            type="range"
            min={0}
            max={100}
            value={data.volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="flex-1 accent-[#E5A00D]"
          />
          <span className="text-xs text-[#808080]">🔊</span>
        </div>

        <button
          onClick={onToggleRepeat}
          className={`px-3 py-2 rounded-lg border text-sm ${
            data.repeat !== 'off'
              ? 'bg-[#E5A00D] text-black border-[#E5A00D]'
              : 'bg-[#1a1a1a] text-white border-[#333]'
          }`}
        >
          {data.repeat === 'one' ? '🔂' : '🔁'}
        </button>
      </div>
    </div>
  );
};

export default NowPlaying;
