import React, { useState } from 'react';
import { Gamepad2, Image as ImageIcon, Heart } from 'lucide-react';
import { CatchGame } from './CatchGame';
import { PuzzleGame } from './PuzzleGame';

export const GamesPage: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'catch' | 'puzzle'>('catch');

  return (
    <div className="min-h-screen pt-12 pb-28 px-4 max-w-3xl mx-auto flex flex-col items-center">
      {/* Header Badge */}
      <div className="flex items-center gap-2 bg-[#F0EAD6] text-[#6C584C] px-4 py-1.5 rounded-full text-xs font-medium mb-6 border border-[#ADC178]/30 shadow-2xs">
        <Gamepad2 className="w-4 h-4 text-[#ADC178]" />
        <span>🎮 Play & Relax Room</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-serif italic text-[#6C584C] font-bold text-center mb-2">
        Relaxing Activities
      </h2>
      <p className="text-xs text-gray-600 text-center max-w-sm mb-6">
        Take a moment to unwind, play, and clear your mind.
      </p>

      {/* Game Selector Tabs */}
      <div className="flex items-center bg-[#F0EAD6]/70 p-1.5 rounded-full border border-[#ADC178]/30 mb-8 shadow-2xs">
        <button
          onClick={() => setActiveGame('catch')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeGame === 'catch'
              ? 'bg-[#ADC178] text-white shadow-xs'
              : 'text-[#6C584C] hover:bg-[#F0EAD6]'
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Heart Catcher</span>
        </button>

        <button
          onClick={() => setActiveGame('puzzle')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeGame === 'puzzle'
              ? 'bg-[#ADC178] text-white shadow-xs'
              : 'text-[#6C584C] hover:bg-[#F0EAD6]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Picture Puzzle</span>
        </button>
      </div>

      {/* Game Content */}
      <div className="w-full flex justify-center">
        {activeGame === 'catch' ? <CatchGame /> : <PuzzleGame />}
      </div>
    </div>
  );
};
