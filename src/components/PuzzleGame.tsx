import React, { useState, useEffect } from 'react';
import { Upload, Eye, RotateCcw, Sparkles, Check, Image as ImageIcon, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PUZZLE_PRESETS } from '../data/content';

export const PuzzleGame: React.FC = () => {
  const [selectedPresetUrl, setSelectedPresetUrl] = useState(PUZZLE_PRESETS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [moves, setMoves] = useState(0);
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);

  // Puzzle indices [0..8] shuffled
  const [tiles, setTiles] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8]);

  const activeImage = customImageUrl || selectedPresetUrl;

  const shuffleTiles = () => {
    let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    // Fisher Yates Shuffle ensuring it's not solved initially
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Check if randomly shuffled to solved state
    if (arr.every((val, index) => val === index)) {
      [arr[0], arr[1]] = [arr[1], arr[0]];
    }
    setTiles(arr);
    setMoves(0);
    setSelectedTileIndex(null);
    setIsSolved(false);
  };

  useEffect(() => {
    shuffleTiles();
  }, [activeImage]);

  // Tile swap action
  const handleTileClick = (index: number) => {
    if (isSolved) return;

    if (selectedTileIndex === null) {
      setSelectedTileIndex(index);
    } else {
      if (selectedTileIndex === index) {
        // Deselect
        setSelectedTileIndex(null);
        return;
      }

      // Swap tile array
      const newTiles = [...tiles];
      const temp = newTiles[selectedTileIndex];
      newTiles[selectedTileIndex] = newTiles[index];
      newTiles[index] = temp;

      setTiles(newTiles);
      setSelectedTileIndex(null);
      setMoves(prev => prev + 1);

      // Check win
      const checkWin = newTiles.every((val, idx) => val === idx);
      if (checkWin) {
        setIsSolved(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  // Image File Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex flex-col items-center bg-white/80 backdrop-blur-md border border-[#ADC178]/30 shadow-lg rounded-3xl p-6 relative">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-[#ADC178]/20">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-[#ADC178]" />
          <h3 className="font-serif text-lg font-bold text-[#6C584C]">Memory Picture Puzzle</h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="bg-[#F0EAD6] px-3 py-1 rounded-full text-[#6C584C]">
            Moves: <strong className="text-sm text-[#ADC178]">{moves}</strong>
          </div>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1 bg-[#E8F0DC] text-[#6C584C] hover:bg-[#ADC178] hover:text-white px-3 py-1 rounded-full transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showPreview ? 'Hide Hint' : 'View Image'}</span>
          </button>
        </div>
      </div>

      {/* Preset & Custom Image selector */}
      <div className="w-full mb-4 flex flex-wrap items-center justify-center gap-2">
        {PUZZLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              setCustomImageUrl(null);
              setSelectedPresetUrl(preset.url);
            }}
            className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium flex items-center gap-1.5 ${
              !customImageUrl && selectedPresetUrl === preset.url
                ? 'bg-[#ADC178] text-white shadow-xs'
                : 'bg-[#F0EAD6]/50 text-[#6C584C] hover:bg-[#F0EAD6]'
            }`}
          >
            <span>{preset.name}</span>
          </button>
        ))}

        <label className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 cursor-pointer font-medium flex items-center gap-1 transition-colors">
          <Upload className="w-3.5 h-3.5" />
          <span>{customImageUrl ? 'Uploaded Custom Photo' : 'Upload Your Photo'}</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
      </div>

      {/* Preview Modal Overlay */}
      {showPreview && (
        <div className="mb-4 p-2 bg-[#F0EAD6] rounded-2xl border border-[#ADC178]/40 shadow-md animate-in fade-in zoom-in-95">
          <p className="text-[11px] text-[#6C584C] text-center font-medium mb-1">Original Complete Picture:</p>
          <img src={activeImage} alt="Puzzle Target" className="w-48 h-48 object-cover rounded-xl mx-auto shadow-xs" />
        </div>
      )}

      {/* Puzzle Board Grid (3x3) */}
      <div className="relative w-[300px] h-[300px] bg-[#F0EAD6] p-1.5 rounded-2xl border-2 border-[#ADC178]/50 shadow-inner grid grid-cols-3 grid-rows-3 gap-1 mb-4 overflow-hidden">
        {tiles.map((pos, currentIdx) => {
          // Calculate original position coordinates for background
          const x = (pos % 3) * 100;
          const y = Math.floor(pos / 3) * 100;

          const isSelected = selectedTileIndex === currentIdx;

          return (
            <div
              key={currentIdx}
              onClick={() => handleTileClick(currentIdx)}
              style={{
                backgroundImage: `url(${activeImage})`,
                backgroundSize: '300px 300px',
                backgroundPosition: `-${x}px -${y}px`
              }}
              className={`w-full h-full rounded-xl cursor-pointer transition-all duration-200 relative shadow-2xs hover:opacity-90 ${
                isSelected ? 'ring-4 ring-[#E07A5F] scale-95 z-10' : ''
              } ${isSolved ? 'ring-1 ring-emerald-400' : ''}`}
            >
              <span className="absolute bottom-1 right-1 text-[9px] bg-black/40 text-white px-1.5 py-0.5 rounded-full font-mono opacity-50">
                {currentIdx + 1}
              </span>
            </div>
          );
        })}

        {/* Solved Banner Overlay */}
        {isSolved && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-amber-400 text-white flex items-center justify-center mb-2 animate-bounce">
              <Trophy className="w-6 h-6 fill-current" />
            </div>
            <h4 className="text-xl font-serif font-bold text-white mb-1">Puzzle Solved! 🎉</h4>
            <p className="text-xs text-amber-100 mb-3">Completed in {moves} moves. Beautiful work!</p>
            <button
              onClick={shuffleTiles}
              className="bg-[#ADC178] hover:bg-[#6C584C] text-white font-semibold px-4 py-2 rounded-full text-xs shadow-md"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3 text-xs">
        <button
          onClick={shuffleTiles}
          className="flex items-center gap-1.5 bg-[#F0EAD6] text-[#6C584C] px-4 py-2 rounded-full font-medium hover:bg-[#ADC178] hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reshuffle Board</span>
        </button>

        <span className="text-[11px] text-gray-400">Click any 2 pieces to swap them!</span>
      </div>
    </div>
  );
};
