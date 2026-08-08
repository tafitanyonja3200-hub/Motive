import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, Sparkles, SkipForward, FolderPlus, Upload, Heart } from 'lucide-react';
import { AUDIO_TRACKS } from '../data/content';
import { AudioTrack } from '../types';

interface AudioPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  autoPlayTriggered?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  isPlaying,
  onTogglePlay,
}) => {
  const [tracks, setTracks] = useState<AudioTrack[]>(AUDIO_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [showTrackMenu, setShowTrackMenu] = useState(false);
  const [isVideoMinimized, setIsVideoMinimized] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthOscsRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);
  const synthTimerRef = useRef<number | null>(null);

  const track = tracks[currentTrackIndex] || tracks[0];

  // Web Audio Synth Generator for romantic Bruno Mars style chord progression
  const startSyntheticAudio = () => {
    stopSyntheticAudio();
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.value = isMuted ? 0 : volume * 0.18;
      masterGain.connect(ctx.destination);

      const chordFrequencies = [
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [130.81, 164.81, 196.00, 246.94], // Cmaj7
        [146.83, 174.61, 220.00, 261.63], // Dm7
        [116.54, 146.83, 174.61, 220.00]  // Bbmaj7
      ];
      let chordIndex = 0;

      const playGentleArpeggio = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const currentChord = chordFrequencies[chordIndex % chordFrequencies.length];

        currentChord.forEach((freq, i) => {
          setTimeout(() => {
            if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
            const osc = ctx.createOscillator();
            const noteGain = ctx.createGain();

            osc.type = i === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq * 2, ctx.currentTime);

            noteGain.gain.setValueAtTime(0, ctx.currentTime);
            noteGain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.8);
            noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.8);

            osc.connect(noteGain);
            noteGain.connect(masterGain);

            osc.start();
            osc.stop(ctx.currentTime + 4.0);

            synthOscsRef.current.push({ osc, gain: noteGain });
          }, i * 280);
        });

        chordIndex = (chordIndex + 1) % chordFrequencies.length;
      };

      playGentleArpeggio();
      synthTimerRef.current = window.setInterval(playGentleArpeggio, 2800);
    } catch {
      // AudioContext fallback
    }
  };

  const stopSyntheticAudio = () => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    synthOscsRef.current.forEach(({ osc, gain }) => {
      try {
        gain.gain.linearRampToValueAtTime(0, 0.2);
        osc.stop();
      } catch {
        // ignore
      }
    });
    synthOscsRef.current = [];
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        // ignore
      }
      audioCtxRef.current = null;
    }
  };

  useEffect(() => {
    // Stop synthetic synth audio when playing YouTube tracks or standard MP3s
    if (!track.isSynthetic || !isPlaying) {
      stopSyntheticAudio();
    }

    if (track.youtubeId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopSyntheticAudio();
      return;
    }

    if (track.isSynthetic) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (isPlaying) {
        startSyntheticAudio();
      } else {
        stopSyntheticAudio();
      }
    } else {
      stopSyntheticAudio();
      if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : volume;
        if (isPlaying) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Ignore play restrictions without fallback noise
            });
          }
        } else {
          audioRef.current.pause();
        }
      }
    }

    return () => {
      stopSyntheticAudio();
    };
  }, [isPlaying, currentTrackIndex, isMuted, volume, tracks]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleNextTrack = () => {
    const next = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(next);
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setShowTrackMenu(false);
    if (!isPlaying) {
      onTogglePlay();
    }
  };

  // Import Song from folder / local disk
  const handleImportFolderSong = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newTracks: AudioTrack[] = [];
    (Array.from(files) as File[]).forEach((file, i) => {
      if (file.type.startsWith('audio/') || file.name.endsWith('.mp3') || file.name.endsWith('.wav') || file.name.endsWith('.m4a') || file.name.endsWith('.ogg')) {
        const objectUrl = URL.createObjectURL(file);
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        newTracks.push({
          id: `custom-file-${Date.now()}-${i}`,
          name: cleanName,
          description: `Imported from local folder (${(file.size / (1024 * 1024)).toFixed(1)} MB)`,
          src: objectUrl,
          isSynthetic: false
        });
      }
    });

    if (newTracks.length > 0) {
      setTracks((prev) => [...newTracks, ...prev]);
      setCurrentTrackIndex(0); // Switch directly to the first imported song
      if (!isPlaying) {
        onTogglePlay();
      }
      setShowTrackMenu(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/95 backdrop-blur-md border border-[#ADC178]/50 shadow-md rounded-full px-3 py-1.5 transition-all hover:shadow-lg">
      <button
        onClick={onTogglePlay}
        className="w-8 h-8 rounded-full bg-[#ADC178] text-white flex items-center justify-center hover:bg-[#6C584C] transition-colors focus:outline-none shadow-xs"
        title={isPlaying ? "Pause Theme Music" : "Play Theme Music"}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      <div className="hidden sm:flex flex-col text-left max-w-[130px]">
        <span className="text-xs font-bold text-[#6C584C] truncate flex items-center gap-1">
          <Heart className="w-3 h-3 text-rose-500 fill-current" />
          {track.name}
        </span>
        <span className="text-[10px] text-gray-500 truncate">{track.description}</span>
      </div>

      <button
        onClick={handleNextTrack}
        className="p-1 text-gray-600 hover:text-[#6C584C] rounded-full transition-colors"
        title="Next Track"
      >
        <SkipForward className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={toggleMute}
        className="p-1 text-gray-600 hover:text-[#6C584C] rounded-full transition-colors"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={isMuted ? 0 : volume}
        onChange={(e) => {
          setVolume(parseFloat(e.target.value));
          if (isMuted) setIsMuted(false);
        }}
        className="w-12 h-1 bg-gray-200 accent-[#ADC178] rounded-lg cursor-pointer hidden md:block"
        title="Volume"
      />

      <button
        onClick={() => setShowTrackMenu(!showTrackMenu)}
        className="text-xs px-2.5 py-1 text-[#6C584C] bg-[#F0EAD6] rounded-full hover:bg-[#ADC178] hover:text-white transition-colors font-medium flex items-center gap-1 shadow-2xs"
      >
        <Sparkles className="w-3 h-3 text-amber-500" />
        <span>Playlist</span>
      </button>

      {/* Hidden File Input for Importing local Audio files */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFolderSong}
        accept="audio/*,.mp3,.wav,.m4a,.ogg"
        multiple
        className="hidden"
      />

      {/* Track Selection & Import Menu Dropdown */}
      {showTrackMenu && (
        <div className="absolute top-12 right-0 bg-white border border-[#ADC178]/40 shadow-xl rounded-2xl p-2 w-64 text-left text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 font-bold text-[#6C584C] border-b border-gray-100 mb-1 flex items-center justify-between">
            <span>🎵 Bruno Mars & Audio Themes</span>
            <span className="text-[10px] text-[#ADC178] font-normal">Bruno Mars Special</span>
          </div>

          {/* Import Song From Folder Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full text-left my-1 px-3 py-2 bg-[#E8F0DC] hover:bg-[#ADC178] text-[#6C584C] hover:text-white rounded-xl font-semibold transition-all flex items-center gap-2 border border-[#ADC178]/30 shadow-2xs cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-[#ADC178] group-hover:text-white" />
            <div className="flex flex-col">
              <span>Import Song from Folder 📁</span>
              <span className="text-[9px] font-normal opacity-80">Add your own MP3 / Audio files</span>
            </div>
          </button>

          <div className="max-h-60 overflow-y-auto space-y-1 mt-2">
            {tracks.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => selectTrack(idx)}
                className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex flex-col gap-0.5 ${
                  currentTrackIndex === idx ? 'bg-[#F0EAD6] text-[#6C584C] font-bold border-l-3 border-[#ADC178]' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate max-w-[170px]">{t.name}</span>
                  {t.id.includes('bruno-mars') && (
                    <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full font-semibold">
                      Bruno Theme
                    </span>
                  )}
                  {t.id.includes('custom-file') && (
                    <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">
                      Local MP3
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 truncate">{t.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* HTML5 Audio Tag (Only for direct MP3 files, NOT YouTube tracks or synthetic) */}
      {!track.isSynthetic && !track.youtubeId && (
        <audio
          ref={audioRef}
          src={track.src}
          loop
          preload="auto"
        />
      )}

      {/* Embedded Real YouTube Audio & Video Player Widget */}
      {track.youtubeId && isPlaying && (
        <div className={`fixed bottom-20 right-4 z-40 bg-white border border-[#ADC178]/50 shadow-2xl rounded-2xl p-2.5 transition-all duration-300 ${
          isVideoMinimized ? 'w-56 h-12 overflow-hidden' : 'w-72 sm:w-80'
        }`}>
          <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 mb-1.5">
            <span className="text-xs font-bold text-[#6C584C] flex items-center gap-1 truncate max-w-[190px]">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>{track.name}</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsVideoMinimized(!isVideoMinimized)}
                className="text-[10px] text-[#ADC178] hover:text-[#6C584C] bg-[#F0EAD6] px-2 py-0.5 rounded-full font-semibold cursor-pointer"
              >
                {isVideoMinimized ? 'Expand' : 'Mini Player'}
              </button>
            </div>
          </div>

          {!isVideoMinimized && (
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-inner bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${track.youtubeId}?autoplay=1&mute=0&enablejsapi=1&rel=0`}
                title={track.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

