import React, { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, Copy, Check, Bookmark, Heart, Search, Sparkles, MessageSquare } from 'lucide-react';
import { BIBLE_VERSES } from '../data/content';
import { BibleVerse } from '../types';

export const BiblePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('tita_bible_favorites') || '[]');
    } catch {
      return [];
    }
  });
  const [userNote, setUserNote] = useState('');
  const [notesMap, setNotesMap] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('tita_bible_notes') || '{}');
    } catch {
      return {};
    }
  });

  // Filtered verses
  const filteredVerses = BIBLE_VERSES.filter((v) => {
    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesSearch =
      v.verse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeVerse: BibleVerse = filteredVerses[currentVerseIndex % Math.max(1, filteredVerses.length)] || BIBLE_VERSES[0];

  useEffect(() => {
    if (activeVerse) {
      setUserNote(notesMap[activeVerse.id] || '');
    }
  }, [activeVerse, notesMap]);

  const handleNextVerse = () => {
    if (filteredVerses.length > 0) {
      const nextIdx = (currentVerseIndex + 1) % filteredVerses.length;
      setCurrentVerseIndex(nextIdx);
    }
  };

  const handleCopy = () => {
    if (!activeVerse) return;
    const text = `"${activeVerse.verse}" - ${activeVerse.reference}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleFavorite = (id: string) => {
    const newFavs = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('tita_bible_favorites', JSON.stringify(newFavs));
  };

  const handleSaveNote = () => {
    if (!activeVerse) return;
    const updated = { ...notesMap, [activeVerse.id]: userNote };
    setNotesMap(updated);
    localStorage.setItem('tita_bible_notes', JSON.stringify(updated));
  };

  const isFav = activeVerse ? favorites.includes(activeVerse.id) : false;

  const categories = [
    { id: 'all', label: 'All Verses' },
    { id: 'strength', label: 'Strength 💪' },
    { id: 'peace', label: 'Peace 🕊️' },
    { id: 'hope', label: 'Hope ⚓' },
    { id: 'comfort', label: 'Comfort 🤗' },
    { id: 'love', label: 'Love ❤️' },
  ];

  return (
    <div className="min-h-screen pt-12 pb-28 px-4 max-w-3xl mx-auto flex flex-col items-center">
      {/* Header */}
      <div className="flex items-center gap-2 bg-[#F0EAD6] text-[#6C584C] px-4 py-1.5 rounded-full text-xs font-medium mb-6 border border-[#ADC178]/30 shadow-2xs">
        <BookOpen className="w-4 h-4 text-[#ADC178]" />
        <span>📖 Daily Word & Scripture Comfort</span>
      </div>

      {/* Category Pills & Search */}
      <div className="w-full mb-6 space-y-3">
        <div className="flex items-center bg-white rounded-full border border-[#ADC178]/30 px-3 py-1.5 shadow-2xs">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentVerseIndex(0);
            }}
            placeholder="Search verses by keyword or book (e.g. Psalm, peace)..."
            className="w-full text-xs text-[#6C584C] bg-transparent focus:outline-none placeholder-gray-400"
          />
        </div>

        <div className="flex items-center justify-center flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentVerseIndex(0);
              }}
              className={`text-xs px-3.5 py-1.5 rounded-full transition-all font-medium ${
                selectedCategory === cat.id
                  ? 'bg-[#ADC178] text-white shadow-xs'
                  : 'bg-[#F0EAD6]/60 text-[#6C584C] hover:bg-[#F0EAD6]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verse Card */}
      {filteredVerses.length > 0 ? (
        <div className="w-full bg-[#FCFBF7] border border-[#ADC178]/40 shadow-xl rounded-3xl p-8 text-center relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ADC178] via-[#D4A373] to-[#ADC178]" />

          <div className="flex items-center justify-between mb-6">
            <span className="text-[11px] font-semibold text-[#ADC178] uppercase tracking-wider bg-[#ADC178]/10 px-3 py-1 rounded-full">
              Category: {activeVerse.category}
            </span>

            <button
              onClick={() => toggleFavorite(activeVerse.id)}
              className={`p-2 rounded-full transition-colors ${
                isFav ? 'bg-rose-100 text-rose-500' : 'bg-gray-100 text-gray-400 hover:text-rose-500'
              }`}
              title={isFav ? 'Saved in Favorites' : 'Bookmark Verse'}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>

          <blockquote className="font-serif italic text-lg sm:text-2xl text-[#6C584C] leading-relaxed mb-6 font-semibold">
            "{activeVerse.verse}"
          </blockquote>

          <p className="font-sans font-semibold text-sm text-[#ADC178] tracking-wide mb-8">
            — {activeVerse.reference}
          </p>

          {/* User Prayer / Note Box */}
          <div className="mt-4 pt-4 border-t border-[#ADC178]/20 text-left">
            <label className="text-xs font-semibold text-[#6C584C] flex items-center gap-1.5 mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-[#ADC178]" />
              <span>Personal Reflection / Note for this verse:</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder="Write a prayer or reflection..."
                className="w-full bg-white border border-[#ADC178]/30 rounded-xl px-3 py-2 text-xs text-[#6C584C] focus:outline-none focus:ring-1 focus:ring-[#ADC178]"
              />
              <button
                onClick={handleSaveNote}
                className="bg-[#ADC178] text-white px-3 py-2 rounded-xl text-xs font-medium hover:bg-[#6C584C] transition-colors whitespace-nowrap"
              >
                Save
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={handleNextVerse}
              className="bg-[#ADC178] hover:bg-[#6C584C] text-white px-6 py-3 rounded-2xl text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Get New Verse</span>
            </button>

            <button
              onClick={handleCopy}
              className="bg-[#F0EAD6] text-[#6C584C] hover:bg-[#ADC178] hover:text-white px-4 py-3 rounded-2xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'Copied!' : 'Copy Verse'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full bg-white p-8 rounded-3xl border text-center text-gray-500">
          No verses found matching your query. Try clearing search filters.
        </div>
      )}

      {/* Bookmarked Favorites Drawer */}
      {favorites.length > 0 && (
        <div className="w-full mt-8 bg-white/80 backdrop-blur-md border border-[#ADC178]/30 rounded-3xl p-6 shadow-sm">
          <h4 className="font-serif font-bold text-[#6C584C] text-sm mb-3 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#ADC178]" />
            <span>Bookmarked Verses ({favorites.length})</span>
          </h4>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {BIBLE_VERSES.filter((v) => favorites.includes(v.id)).map((fav) => (
              <div key={fav.id} className="bg-[#F0EAD6]/40 p-3 rounded-2xl border border-[#ADC178]/20 text-xs text-[#6C584C] flex justify-between items-start gap-2">
                <div>
                  <p className="font-serif italic font-medium">"{fav.verse}"</p>
                  <p className="font-semibold text-[#ADC178] text-[10px] mt-1">— {fav.reference}</p>
                </div>
                <button
                  onClick={() => toggleFavorite(fav.id)}
                  className="text-gray-400 hover:text-rose-500 text-[10px] underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
