import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Upload, Heart, Sparkles, Trash2, Eye, Sliders, Image as ImageIcon, Check, Film } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MemoryItem } from '../types';
import { DEFAULT_MEMORIES } from '../data/content';

export const FILTER_PRESETS = [
  { id: 'none', name: 'Original', css: 'none' },
  { id: 'sage', name: 'Sage Warmth', css: 'sepia(0.25) hue-rotate(35deg) contrast(1.05) brightness(1.03)' },
  { id: 'vintage', name: 'Soft Vintage', css: 'sepia(0.4) contrast(0.95) brightness(1.08) saturate(0.85)' },
  { id: 'warm', name: 'Golden Glow', css: 'sepia(0.25) saturate(1.25) brightness(1.06) contrast(1.02)' },
  { id: 'sepia', name: 'Sepia Dream', css: 'sepia(0.7) contrast(1.1) brightness(0.95)' },
  { id: 'noir', name: 'B&W Nostalgia', css: 'grayscale(1) contrast(1.2) brightness(1.02)' },
];

export const MemoriesPage: React.FC = () => {
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('tita_memories_album');
      return saved ? JSON.parse(saved) : DEFAULT_MEMORIES;
    } catch {
      return DEFAULT_MEMORIES;
    }
  });

  const [activeFilter, setActiveFilter] = useState(FILTER_PRESETS[1]); // Default Sage
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedTag, setSelectedTag] = useState('Special Moment');
  const [lightboxMemory, setLightboxMemory] = useState<MemoryItem | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Save album to LocalStorage
  const saveMemoriesToStorage = (updated: MemoryItem[]) => {
    setMemories(updated);
    try {
      localStorage.setItem('tita_memories_album', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraOn(true);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unable to access camera';
      setCameraError(`Camera access denied or unavailable: ${errorMsg}`);
      setIsCameraOn(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Snap Photo
  const takeSnapshot = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Apply CSS filter directly onto Canvas
      ctx.filter = activeFilter.css;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);

      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#ADC178', '#F0EAD6', '#E07A5F']
      });
    }
  };

  // File Upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Memory to Album
  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capturedImage) return;

    const newMem: MemoryItem = {
      id: `mem-${Date.now()}`,
      imageUrl: capturedImage,
      caption: caption.trim() || 'A sweet cherished moment 🌿',
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' }),
      filter: activeFilter.name,
      tag: selectedTag,
      liked: true
    };

    const updated = [newMem, ...memories];
    saveMemoriesToStorage(updated);

    setCapturedImage(null);
    setCaption('');

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const toggleLikeMemory = (id: string) => {
    const updated = memories.map((m) => (m.id === id ? { ...m, liked: !m.liked } : m));
    saveMemoriesToStorage(updated);
  };

  const deleteMemory = (id: string) => {
    const updated = memories.filter((m) => m.id !== id);
    saveMemoriesToStorage(updated);
    if (lightboxMemory?.id === id) {
      setLightboxMemory(null);
    }
  };

  const tags = ['Special Moment', 'Family Love', 'Peace & Rest', 'Daily Blessing', 'Warm Thoughts'];

  return (
    <div className="min-h-screen pt-12 pb-28 px-4 max-w-4xl mx-auto flex flex-col items-center">
      {/* Header Badge */}
      <div className="flex items-center gap-2 bg-[#F0EAD6] text-[#6C584C] px-4 py-1.5 rounded-full text-xs font-medium mb-4 border border-[#ADC178]/30 shadow-2xs">
        <Camera className="w-4 h-4 text-[#ADC178]" />
        <span>📸 Memory Camera & Vintage Filters Studio</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-serif italic text-[#6C584C] font-bold text-center mb-2">
        Capture Warmth & Memories
      </h2>
      <p className="text-xs text-gray-600 text-center max-w-md mb-8">
        Take a keepsake photo with warm aesthetic filters, add your thoughts, and save them in Tita's Memory Album.
      </p>

      {/* Camera & Filter Capture Box */}
      <div className="w-full bg-white/90 backdrop-blur-md border border-[#ADC178]/40 shadow-xl rounded-3xl p-6 mb-12 flex flex-col items-center">
        {/* Live Viewfinder / Image Canvas */}
        <div className="relative w-full max-w-md aspect-video sm:aspect-4/3 bg-gray-900 rounded-2xl overflow-hidden shadow-inner flex flex-col items-center justify-center border-2 border-[#ADC178]/40 mb-4">
          {capturedImage ? (
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Captured Snapshot"
                style={{ filter: activeFilter.css }}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setCapturedImage(null)}
                className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full text-xs font-semibold hover:bg-black transition-colors"
                title="Retake Snapshot"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          ) : isCameraOn ? (
            <video
              ref={videoRef}
              playsInline
              muted
              style={{ filter: activeFilter.css }}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center p-6 text-center text-gray-300 gap-3">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-[#ADC178]">
                <Camera className="w-7 h-7" />
              </div>
              <p className="text-xs max-w-xs text-gray-300">
                Turn on your camera to capture live filtered photos, or upload an existing photo from your device.
              </p>
              {cameraError && <p className="text-[11px] text-rose-300 bg-rose-900/50 p-2 rounded-xl">{cameraError}</p>}
              <button
                onClick={startCamera}
                className="bg-[#ADC178] hover:bg-[#6C584C] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Start Camera Feed</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter Selection Bar */}
        <div className="w-full max-w-md mb-6">
          <label className="text-xs font-semibold text-[#6C584C] flex items-center gap-1.5 mb-2">
            <Sliders className="w-3.5 h-3.5 text-[#ADC178]" />
            <span>Select Aesthetic Filter:</span>
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {FILTER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setActiveFilter(preset)}
                className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all font-medium ${
                  activeFilter.id === preset.id
                    ? 'bg-[#ADC178] text-white shadow-xs'
                    : 'bg-[#F0EAD6]/60 text-[#6C584C] hover:bg-[#F0EAD6]'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Shutter / Upload Buttons */}
        <div className="flex items-center justify-center gap-3 w-full max-w-md mb-6">
          {isCameraOn && !capturedImage && (
            <button
              onClick={takeSnapshot}
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer animate-pulse"
            >
              <Camera className="w-4 h-4" />
              <span>Snap Photo 📸</span>
            </button>
          )}

          {isCameraOn && (
            <button
              onClick={stopCamera}
              className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-3 rounded-2xl text-xs font-semibold transition-colors"
            >
              Close Camera
            </button>
          )}

          <label className="bg-[#F0EAD6] text-[#6C584C] hover:bg-[#ADC178] hover:text-white px-4 py-3 rounded-2xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Caption & Save Form (When image is captured) */}
        {capturedImage && (
          <form onSubmit={handleSaveMemory} className="w-full max-w-md bg-[#F0EAD6]/40 p-4 rounded-2xl border border-[#ADC178]/30 space-y-3 animate-in fade-in">
            <h4 className="text-xs font-bold text-[#6C584C]">Add Memory Details:</h4>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a warm memory caption..."
              className="w-full bg-white border border-[#ADC178]/40 rounded-xl px-3 py-2 text-xs text-[#6C584C] focus:outline-none focus:ring-1 focus:ring-[#ADC178]"
              required
            />

            <div className="flex flex-wrap gap-1.5">
              {tags.map((tg) => (
                <button
                  type="button"
                  key={tg}
                  onClick={() => setSelectedTag(tg)}
                  className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                    selectedTag === tg ? 'bg-[#ADC178] text-white' : 'bg-white text-gray-600 border border-gray-200'
                  }`}
                >
                  {tg}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-[#ADC178] hover:bg-[#6C584C] text-white py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Memory to Album 🖼️</span>
            </button>
          </form>
        )}
      </div>

      {/* Memories Photo Album Scrapbook Gallery */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#ADC178]/30">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-[#ADC178]" />
            <h3 className="font-serif text-xl font-bold text-[#6C584C]">Memories Album ({memories.length})</h3>
          </div>
          <span className="text-xs text-gray-400 font-serif italic">Polaroid Keepsakes</span>
        </div>

        {memories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {memories.map((mem) => {
              const matchedFilter = FILTER_PRESETS.find((f) => f.name === mem.filter) || FILTER_PRESETS[0];

              return (
                <div
                  key={mem.id}
                  className="bg-white border border-[#ADC178]/30 p-3.5 pb-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col group"
                >
                  {/* Image Polaroid Frame */}
                  <div
                    onClick={() => setLightboxMemory(mem)}
                    className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3 cursor-pointer group-hover:opacity-95"
                  >
                    <img
                      src={mem.imageUrl}
                      alt={mem.caption}
                      style={{ filter: matchedFilter.css }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-[9px] px-2 py-0.5 rounded-full backdrop-blur-xs font-medium">
                      {mem.filter}
                    </div>
                  </div>

                  {/* Caption & Date */}
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <p className="font-serif italic text-xs text-[#6C584C] font-semibold leading-snug mb-1">
                        "{mem.caption}"
                      </p>
                      <span className="text-[10px] text-gray-400 font-medium">{mem.date}</span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[9px] bg-[#F0EAD6] text-[#6C584C] px-2 py-0.5 rounded-full font-semibold">
                        {mem.tag || 'Memory'}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleLikeMemory(mem.id)}
                          className={`p-1.5 rounded-full transition-colors ${
                            mem.liked ? 'text-rose-500 bg-rose-50' : 'text-gray-400 hover:text-rose-500'
                          }`}
                          title="Like Memory"
                        >
                          <Heart className={`w-3.5 h-3.5 ${mem.liked ? 'fill-current' : ''}`} />
                        </button>

                        <button
                          onClick={() => deleteMemory(mem.id)}
                          className="p-1.5 rounded-full text-gray-300 hover:text-rose-600 transition-colors"
                          title="Delete Memory"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/80 p-8 rounded-3xl border text-center text-gray-500">
            No memory photos saved yet. Snap or upload your first photo above!
          </div>
        )}
      </div>

      {/* Lightbox Full Size Modal */}
      {lightboxMemory && (
        <div
          onClick={() => setLightboxMemory(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-5 max-w-lg w-full border border-[#ADC178] shadow-2xl flex flex-col items-center space-y-4"
          >
            <div className="w-full aspect-4/3 rounded-2xl overflow-hidden bg-black">
              <img
                src={lightboxMemory.imageUrl}
                alt={lightboxMemory.caption}
                style={{
                  filter: (FILTER_PRESETS.find((f) => f.name === lightboxMemory.filter) || FILTER_PRESETS[0]).css
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center space-y-1">
              <p className="font-serif italic text-base text-[#6C584C] font-semibold">
                "{lightboxMemory.caption}"
              </p>
              <p className="text-xs text-gray-400">{lightboxMemory.date} • Filter: {lightboxMemory.filter}</p>
            </div>
            <button
              onClick={() => setLightboxMemory(null)}
              className="bg-[#ADC178] text-white px-6 py-2 rounded-full text-xs font-semibold hover:bg-[#6C584C]"
            >
              Close Memory
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
