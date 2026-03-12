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

const IconPrev = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
    <path d="M6 5h2v14H6zM10 12l10 7V5z" />
  </svg>
);

const IconNext = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
    <path d="M16 5h2v14h-2zM14 12L4 19V5z" />
  </svg>
);

const IconPlay = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden>
    <path d="M8 5v14l11-7z" />
  </svg>
);

const IconPause = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden>
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
  </svg>
);

const IconShuffle = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
    <path d="M17 3h4v4h-2V5.41l-4.29 4.3-1.42-1.42L17.59 4H17V3zM3 6h4.17l3.3 3.29-1.42 1.42L6.76 8H3V6zm0 10h4.17l6.42-6.42 1.41 1.42L7.59 18H3v-2zm14 0h2.59l-4.3-4.29 1.42-1.42L21 14.59V13h2v4h-4v-2z" />
  </svg>
);

const IconRepeat = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
    <path d="M17 1l4 4-4 4V6H7a3 3 0 0 0-3 3v1H2V9a5 5 0 0 1 5-5h10V1zM7 23l-4-4 4-4v3h10a3 3 0 0 0 3-3v-1h2v1a5 5 0 0 1-5 5H7v3z" />
  </svg>
);

const IconRepeatOne = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
    <path d="M17 1l4 4-4 4V6H7a3 3 0 0 0-3 3v1H2V9a5 5 0 0 1 5-5h10V1zm-5 8h-1l-2 2v1h2v5h1V9zM7 23l-4-4 4-4v3h10a3 3 0 0 0 3-3v-1h2v1a5 5 0 0 1-5 5H7v3z" />
  </svg>
);

const IconVolumeLow = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
    <path d="M3 9v6h4l5 5V4L7 9H3z" />
  </svg>
);

const IconVolumeHigh = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
    <path d="M3 9v6h4l5 5V4L7 9H3zm10.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zm2.5 0a7 7 0 0 0-4-6.32v2.18a5 5 0 0 1 0 8.28v2.18A7 7 0 0 0 16 12z" />
  </svg>
);

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
    <div className="relative h-full text-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3b0f3f] via-[#0b1a3a] to-black" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_45%)]" />

      <div className="relative z-10 h-full px-5 py-4 flex flex-col">
        {/* Artwork */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-[60%] aspect-square rounded-3xl bg-[#111] border border-[#2a2a2a] overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.08)]">
            {data.artworkUrl ? (
              <img
                src={data.artworkUrl}
                alt={`${data.album} cover`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#4a4a4a] text-3xl font-semibold">
                Album Art
              </div>
            )}
          </div>
        </div>

        {/* Track Info */}
        <div className="mt-4 text-center">
          <div className="text-base font-semibold tracking-wide truncate">{data.title}</div>
          <div className="text-sm text-[#c0c0c0] truncate">{data.artist}</div>
          <div className="text-xs text-[#8a8a8a] truncate">{data.album}</div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#f1c84b] to-[#f59c2d]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={data.durationMs || 1}
            value={data.positionMs}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full mt-2 accent-[#f1c84b]"
          />
          <div className="flex justify-between text-[11px] text-[#9a9a9a] mt-1">
            <span>{formatTime(data.positionMs)}</span>
            <span>{formatTime(data.durationMs)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-center gap-5">
          <button
            onClick={onPrev}
            className="w-11 h-11 rounded-full bg-[#171717] border border-[#2a2a2a] flex items-center justify-center text-white active:scale-95"
          >
            <IconPrev />
          </button>
          <button
            onClick={onTogglePlay}
            className="w-14 h-14 rounded-full bg-gradient-to-b from-[#f2c94c] to-[#e59b2b] text-black flex items-center justify-center active:scale-95"
          >
            {data.isPlaying ? <IconPause /> : <IconPlay />}
          </button>
          <button
            onClick={onNext}
            className="w-11 h-11 rounded-full bg-[#171717] border border-[#2a2a2a] flex items-center justify-center text-white active:scale-95"
          >
            <IconNext />
          </button>
        </div>

        {/* Volume + toggles */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            onClick={onToggleShuffle}
            className={`px-3 py-2 rounded-lg border ${
              data.shuffle
                ? 'bg-[#f2c94c] text-black border-[#f2c94c]'
                : 'bg-[#171717] text-white border-[#2a2a2a]'
            }`}
          >
            <IconShuffle />
          </button>

          <div className="flex-1 flex items-center gap-2">
            <span className="text-[#9a9a9a]"><IconVolumeLow /></span>
            <input
              type="range"
              min={0}
              max={100}
              value={data.volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="flex-1 accent-[#f1c84b]"
            />
            <span className="text-[#9a9a9a]"><IconVolumeHigh /></span>
          </div>

          <button
            onClick={onToggleRepeat}
            className={`px-3 py-2 rounded-lg border ${
              data.repeat !== 'off'
                ? 'bg-[#f2c94c] text-black border-[#f2c94c]'
                : 'bg-[#171717] text-white border-[#2a2a2a]'
            }`}
          >
            {data.repeat === 'one' ? <IconRepeatOne /> : <IconRepeat />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
