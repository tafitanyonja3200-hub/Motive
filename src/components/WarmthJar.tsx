import React, { useState } from 'react';
import { Heart, Sparkles, Plus, RefreshCcw, Smile, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AFFIRMATION_NOTES } from '../data/content';
import { AffirmationNote } from '../types';

export const WarmthJar: React.FC = () => {
  const [drawnNote, setDrawnNote] = useState<AffirmationNote | null>(null);
  const [customNotes, setCustomNotes] = useState<AffirmationNote[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('tita_custom_notes') || '[]');
    } catch {
      return [];
    }
  });
  const [newNoteText, setNewNoteText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const allNotes = [...AFFIRMATION_NOTES, ...customNotes];

  const drawNote = () => {
    const random = allNotes[Math.floor(Math.random() * allNotes.length)];
    setDrawnNote(random);

    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.5 },
      colors: ['#ADC178', '#F0EAD6', '#E07A5F']
    });
  };

  const handleAddCustomNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote: AffirmationNote = {
      id: `custom-${Date.now()}`,
      text: newNoteText.trim(),
      tag: 'Personal Warmth'
    };

    const updated = [newNote, ...customNotes];
    setCustomNotes(updated);
    localStorage.setItem('tita_custom_notes', JSON.stringify(updated));
    setNewNoteText('');
    setShowAddModal(false);
    setDrawnNote(newNote);
  };

  return (
    <div className="min-h-screen pt-12 pb-28 px-4 max-w-2xl mx-auto flex flex-col items-center text-center">
      <div className="flex items-center gap-2 bg-[#F0EAD6] text-[#6C584C] px-4 py-1.5 rounded-full text-xs font-medium mb-6 border border-[#ADC178]/30 shadow-2xs">
        <Heart className="w-4 h-4 text-rose-400 fill-current" />
        <span>🌿 Tita's Warmth & Affirmation Jar</span>
      </div>

      <h2 className="text-3xl font-serif italic text-[#6C584C] font-bold mb-2">
        Pick a Little Warmth
      </h2>
      <p className="text-xs text-gray-600 max-w-sm mb-8">
        Whenever you feel overwhelmed or uncertain, reach into Tita's jar to draw a sweet affirmation.
      </p>

      {/* Glass Jar Graphic */}
      <div className="relative group cursor-pointer mb-8" onClick={drawNote}>
        <div className="w-48 h-60 bg-gradient-to-b from-white/90 via-white/40 to-[#ADC178]/20 border-4 border-[#ADC178]/60 rounded-b-3xl rounded-t-xl shadow-xl backdrop-blur-md flex flex-col items-center justify-end p-4 relative overflow-hidden transition-all transform group-hover:scale-105">
          {/* Wooden Cork Lid */}
          <div className="absolute -top-3 w-32 h-5 bg-[#6C584C] rounded-full border border-amber-800 shadow-sm" />

          {/* Glowing items inside jar */}
          <div className="flex flex-wrap justify-center gap-2 mb-4 animate-pulse">
            <span className="text-2xl">🌱</span>
            <span className="text-2xl">❤️</span>
            <span className="text-2xl">⭐</span>
            <span className="text-2xl">🌸</span>
            <span className="text-2xl">☕</span>
            <span className="text-2xl">✨</span>
          </div>

          <div className="w-full bg-[#ADC178]/30 backdrop-blur-xs py-1.5 rounded-full text-[11px] font-bold text-[#6C584C] border border-[#ADC178]/40">
            Click Jar to Draw!
          </div>
        </div>
      </div>

      {/* Drawn Note Reveal */}
      {drawnNote && (
        <div className="w-full bg-[#FCFBF7] border-2 border-[#ADC178] rounded-3xl p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200 mb-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ADC178] bg-[#ADC178]/10 px-3 py-1 rounded-full mb-3 inline-block">
            {drawnNote.tag}
          </span>
          <p className="font-serif italic text-lg sm:text-xl text-[#6C584C] font-semibold leading-relaxed my-3">
            "{drawnNote.text}"
          </p>
          <p className="text-xs text-gray-400 font-serif">— Note from Tita's Jar 🌿</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={drawNote}
          className="bg-[#ADC178] hover:bg-[#6C584C] text-white px-6 py-3 rounded-2xl text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-yellow-200" />
          <span>Draw New Affirmation</span>
        </button>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#F0EAD6] text-[#6C584C] hover:bg-[#ADC178] hover:text-white px-4 py-3 rounded-2xl text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Your Note</span>
        </button>
      </div>

      {/* Modal to add custom note */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#ADC178] shadow-2xl text-left space-y-4">
            <h4 className="font-serif font-bold text-[#6C584C] text-lg flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-[#ADC178]" />
              <span>Add a Note to Tita's Jar</span>
            </h4>
            <p className="text-xs text-gray-500">
              Write a favorite reminder, goal, or comforting message to draw later.
            </p>
            <form onSubmit={handleAddCustomNote} className="space-y-3">
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Type your encouraging note here..."
                rows={3}
                className="w-full bg-[#F0EAD6]/30 border border-[#ADC178]/40 rounded-xl p-3 text-xs text-[#6C584C] focus:outline-none focus:ring-1 focus:ring-[#ADC178]"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ADC178] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#6C584C]"
                >
                  Save to Jar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
