import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Trophy, Sparkles, Heart, Star, Pause } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CatchItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: 'heart' | 'star' | 'clover' | 'tea' | 'letter';
  char: string;
  points: number;
  size: number;
}

export const CatchGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('tita_catch_highscore') || '0', 10);
  });
  const [gameState, setGameState] = useState<'start' | 'playing' | 'paused' | 'gameover'>('start');
  const [milestoneMessage, setMilestoneMessage] = useState<string | null>(null);
  const [basketX, setBasketX] = useState(150);

  const itemsRef = useRef<CatchItem[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const scoreRef = useRef(0);
  scoreRef.current = score;

  const ITEM_TYPES = [
    { type: 'heart', char: '❤️', points: 10 },
    { type: 'star', char: '⭐', points: 15 },
    { type: 'clover', char: '🍀', points: 20 },
    { type: 'tea', char: '☕', points: 25 },
    { type: 'letter', char: '💌', points: 30 }
  ];

  // Milestone triggers
  useEffect(() => {
    if (score > 0 && score % 100 === 0) {
      setMilestoneMessage(`Awesome! ${score} points! Tita is so proud! ❤️`);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => setMilestoneMessage(null), 3000);
    }
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('tita_catch_highscore', score.toString());
    }
  }, [score, highScore]);

  const startGame = () => {
    setScore(0);
    itemsRef.current = [];
    setGameState('playing');
    setMilestoneMessage('Catch the falling warmth!');
    setTimeout(() => setMilestoneMessage(null), 2000);
  };

  const pauseGame = () => {
    if (gameState === 'playing') setGameState('paused');
    else if (gameState === 'paused') setGameState('playing');
  };

  // Main Canvas loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isComponentMounted = true;

    const update = (timestamp: number) => {
      if (!isComponentMounted) return;

      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Basket / Paddle
      const bWidth = 70;
      const bHeight = 16;
      const bY = canvas.height - 30;

      // Soft gradient basket
      const grad = ctx.createLinearGradient(basketX - bWidth / 2, bY, basketX + bWidth / 2, bY + bHeight);
      grad.addColorStop(0, '#ADC178');
      grad.addColorStop(1, '#6C584C');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(basketX - bWidth / 2, bY, bWidth, bHeight, 10);
      ctx.fill();

      // Basket label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🧺 Tita Basket', basketX, bY + 11);

      // Spawn Items
      if (timestamp - lastSpawnRef.current > 700) {
        const randomItem = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
        itemsRef.current.push({
          id: Math.random(),
          x: Math.random() * (canvas.width - 40) + 20,
          y: -20,
          speed: 1.8 + Math.random() * 2.2,
          type: randomItem.type as CatchItem['type'],
          char: randomItem.char,
          points: randomItem.points,
          size: 24
        });
        lastSpawnRef.current = timestamp;
      }

      // Move & render items
      for (let i = itemsRef.current.length - 1; i >= 0; i--) {
        const item = itemsRef.current[i];
        item.y += item.speed;

        // Draw item emoji
        ctx.font = `${item.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(item.char, item.x, item.y);

        // Check catch by basket
        const caughtByBasket =
          item.y >= bY - 10 &&
          item.y <= bY + bHeight + 10 &&
          item.x >= basketX - bWidth / 2 - 10 &&
          item.x <= basketX + bWidth / 2 + 10;

        if (caughtByBasket) {
          itemsRef.current.splice(i, 1);
          setScore(prev => prev + item.points);
          continue;
        }

        // Off screen
        if (item.y > canvas.height + 30) {
          itemsRef.current.splice(i, 1);
        }
      }

      if (gameState === 'playing') {
        animFrameRef.current = requestAnimationFrame(update);
      }
    };

    animFrameRef.current = requestAnimationFrame(update);

    return () => {
      isComponentMounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, basketX]);

  // Handle Canvas Tap / Click to catch item directly
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing' || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    setBasketX(mx);

    // Direct click tap catch
    for (let i = itemsRef.current.length - 1; i >= 0; i--) {
      const item = itemsRef.current[i];
      const dist = Math.hypot(item.x - mx, item.y - my);
      if (dist < 35) {
        itemsRef.current.splice(i, 1);
        setScore(prev => prev + item.points);
        break;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    setBasketX(Math.max(35, Math.min(canvasRef.current.width - 35, mx)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || e.touches.length === 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    setBasketX(Math.max(35, Math.min(canvasRef.current.width - 35, touchX)));
  };

  return (
    <div className="w-full flex flex-col items-center bg-white/80 backdrop-blur-md border border-[#ADC178]/30 shadow-lg rounded-3xl p-6 relative">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-[#ADC178]/20">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-current animate-pulse" />
          <h3 className="font-serif text-lg font-bold text-[#6C584C]">Heart & Star Catcher</h3>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1 bg-[#F0EAD6] px-3 py-1 rounded-full text-[#6C584C]">
            <Sparkles className="w-3.5 h-3.5 text-[#ADC178]" />
            <span>Score: <strong className="text-sm text-[#ADC178]">{score}</strong></span>
          </div>

          <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Best: {highScore}</span>
          </div>
        </div>
      </div>

      {/* Milestone popup banner */}
      {milestoneMessage && (
        <div className="absolute top-16 z-20 bg-[#ADC178] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-md animate-bounce">
          {milestoneMessage}
        </div>
      )}

      {/* Game Canvas Box */}
      <div className="relative w-full max-w-[360px] h-[380px] bg-gradient-to-b from-[#FAF8F5] to-[#F0EAD6]/40 rounded-2xl border-2 border-[#ADC178]/40 shadow-inner overflow-hidden flex flex-col items-center justify-center">
        {gameState === 'start' && (
          <div className="flex flex-col items-center gap-4 p-6 text-center z-10 bg-white/90 rounded-2xl border border-[#ADC178]/30 shadow-md">
            <div className="text-4xl animate-bounce">🧺❤️⭐</div>
            <h4 className="font-serif text-lg font-bold text-[#6C584C]">Catch Tita's Warmth</h4>
            <p className="text-xs text-gray-600 max-w-xs">
              Move your basket with mouse or finger to catch hearts, stars, clovers, and warm tea!
            </p>
            <button
              onClick={startGame}
              className="bg-[#ADC178] hover:bg-[#6C584C] text-white font-semibold px-6 py-2.5 rounded-full text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Catching!</span>
            </button>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 z-20 bg-black/30 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
            <span className="text-white font-serif text-lg font-bold">Game Paused</span>
            <button
              onClick={pauseGame}
              className="bg-white text-[#6C584C] font-semibold px-5 py-2 rounded-full text-xs shadow-md hover:bg-[#F0EAD6]"
            >
              Resume Game
            </button>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={360}
          height={380}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="w-full h-full cursor-crosshair touch-none"
        />
      </div>

      {/* Control Buttons */}
      <div className="mt-4 flex items-center gap-3 text-xs">
        {gameState === 'playing' && (
          <button
            onClick={pauseGame}
            className="flex items-center gap-1 bg-[#F0EAD6] text-[#6C584C] px-3 py-1.5 rounded-full font-medium hover:bg-[#ADC178] hover:text-white transition-colors"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause</span>
          </button>
        )}

        <button
          onClick={startGame}
          className="flex items-center gap-1 bg-[#F0EAD6] text-[#6C584C] px-3 py-1.5 rounded-full font-medium hover:bg-[#ADC178] hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart</span>
        </button>

        <span className="text-[11px] text-gray-400">Tip: Tap or drag to move basket!</span>
      </div>
    </div>
  );
};
