import React, { useState } from 'react';
import { Heart, Sparkles, ArrowRight, Music, Sun } from 'lucide-react';

interface IntroPageProps {
  onStart: (customName: string) => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onStart }) => {
  const [recipient, setRecipient] = useState('My love');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#F9F6F0] via-[#F0EAD6]/40 to-[#E8F0DC]/50 overflow-hidden text-center">
      {/* Decorative botanical floating elements */}
      <div className="absolute top-12 left-12 text-[#ADC178]/30 animate-bounce duration-1000">
        <Sun className="w-16 h-16" />
      </div>
      <div className="absolute bottom-16 right-12 text-[#ADC178]/25 animate-pulse">
        <Heart className="w-20 h-20 fill-current" />
      </div>
      <div className="absolute top-1/3 right-1/4 text-[#6C584C]/10 rotate-12">
        <span className="text-8xl">🌿</span>
      </div>
      <div className="absolute bottom-1/3 left-1/4 text-[#ADC178]/20 -rotate-12">
        <span className="text-7xl">🌸</span>
      </div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-md border border-[#ADC178]/30 shadow-xl rounded-3xl p-8 sm:p-10 z-10 flex flex-col items-center gap-6 transition-all transform hover:scale-[1.01]">
        <div className="w-16 h-16 rounded-full bg-[#E8F0DC] flex items-center justify-center text-[#ADC178] shadow-inner mb-2 animate-pulse">
          <Heart className="w-8 h-8 fill-[#ADC178]" />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#ADC178] bg-[#ADC178]/10 px-3 py-1 rounded-full inline-block">
            Warm Encapsulation of Love
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif italic text-[#6C584C] leading-tight">
            From Your Tita to Warm Your Heart...
          </h1>
          <p className="text-sm text-gray-600 font-light leading-relaxed">
            A quiet sanctuary created especially for you whenever life feels a little heavy, or when you need a gentle reminder of how deeply you are loved.
          </p>
        </div>

        {/* Personalized Name Selector */}
        <div className="w-full bg-[#F0EAD6]/50 rounded-2xl p-3 border border-[#ADC178]/20 text-xs text-[#6C584C] flex flex-col items-center gap-1.5">
          <span className="text-[11px] text-gray-500">Prepared for:</span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="bg-white border border-[#ADC178] rounded-lg px-2 py-1 text-sm text-[#6C584C] text-center focus:outline-none focus:ring-1 focus:ring-[#ADC178]"
                placeholder="Enter name..."
                autoFocus
              />
              <button
                onClick={() => setIsEditing(false)}
                className="bg-[#ADC178] text-white px-2 py-1 rounded-lg text-xs font-medium"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="font-serif italic text-base text-[#6C584C] font-semibold">"{recipient}"</span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-[10px] text-[#ADC178] underline hover:text-[#6C584C]"
              >
                (Change)
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => onStart(recipient)}
          className="w-full group relative inline-flex items-center justify-center gap-2 bg-[#ADC178] hover:bg-[#6C584C] text-white font-semibold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-200 fill-current animate-spin" />
          <span>Click to Start & Play Bruno Mars Music ⭐🌿</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="flex items-center gap-2 text-[11px] text-[#6C584C]/70">
          <Music className="w-3.5 h-3.5 text-[#ADC178] animate-spin duration-3000" />
          <span>Includes comforting ambient music & interactive games</span>
        </div>
      </div>

      <footer className="mt-8 text-xs text-[#6C584C]/60 flex items-center gap-1">
        <span>Made with endless love & prayers</span>
        <Sparkles className="w-3 h-3 text-[#ADC178]" />
      </footer>
    </div>
  );
};
