import React, { useState } from 'react';
import { Heart, Volume2, VolumeX, Sparkles, Share2, Copy, Check, Type, Bookmark } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LETTER_CONTENT } from '../data/content';

interface LetterPageProps {
  recipient: string;
}

export const LetterPage: React.FC<LetterPageProps> = ({ recipient }) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [hugCount, setHugCount] = useState(0);
  const [showHugMessage, setShowHugMessage] = useState(false);

  // Text to Speech
  const toggleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const fullText = `Dear ${recipient || LETTER_CONTENT.defaultRecipient}, ${LETTER_CONTENT.paragraphs.join(' ')}`;
        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.rate = 0.88;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const triggerVirtualHug = () => {
    setHugCount(prev => prev + 1);
    setShowHugMessage(true);
    setTimeout(() => setShowHugMessage(false), 3000);

    // Heart Confetti
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ADC178', '#E07A5F', '#F0EAD6', '#F4A261', '#E9C46A'],
      shapes: ['circle']
    });
  };

  const handleCopy = () => {
    const fullText = `${LETTER_CONTENT.title}\n\nDear ${recipient || LETTER_CONTENT.defaultRecipient},\n\n${LETTER_CONTENT.paragraphs.join('\n\n')}`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const fontSizeClasses = {
    normal: 'text-sm sm:text-base leading-relaxed',
    large: 'text-base sm:text-lg leading-relaxed',
    xlarge: 'text-lg sm:text-xl leading-loose'
  };

  return (
    <div className="min-h-screen pt-12 pb-28 px-4 max-w-3xl mx-auto flex flex-col items-center">
      {/* Header Badge */}
      <div className="flex items-center gap-2 bg-[#F0EAD6] text-[#6C584C] px-4 py-1.5 rounded-full text-xs font-medium mb-6 border border-[#ADC178]/30 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-[#ADC178]" />
        <span>Personal Letter from Tita</span>
      </div>

      {/* Main Letter Container */}
      <div className="w-full bg-[#FCFBF7] border border-[#ADC178]/40 shadow-xl rounded-3xl p-6 sm:p-12 relative overflow-hidden text-[#2C2C2C] font-sans">
        {/* Top Decorative Border Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#ADC178] via-[#D4A373] to-[#ADC178]" />

        {/* Controls Toolbar */}
        <div className="flex items-center justify-between border-b border-[#ADC178]/20 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFontSize(prev => prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal')}
              className="p-2 rounded-xl bg-[#F0EAD6]/50 hover:bg-[#F0EAD6] text-[#6C584C] text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Change Text Size"
            >
              <Type className="w-4 h-4" />
              <span className="hidden sm:inline">Size: {fontSize.toUpperCase()}</span>
            </button>

            {'speechSynthesis' in window && (
              <button
                onClick={toggleSpeech}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isSpeaking ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-[#F0EAD6]/50 hover:bg-[#F0EAD6] text-[#6C584C]'
                }`}
                title="Listen to Tita's Voice"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#ADC178]" />}
                <span className="hidden sm:inline">{isSpeaking ? 'Stop Reading' : 'Listen'}</span>
              </button>
            )}
          </div>

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-[#F0EAD6]/50 hover:bg-[#F0EAD6] text-[#6C584C] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Copy Letter"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{isCopied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Salutation */}
        <div className="mb-6 space-y-1">
          <h2 className="text-2xl sm:text-3xl font-serif italic text-[#ADC178] font-bold">
            {recipient ? `${recipient},` : 'My love,'}
          </h2>
          <p className="text-xs text-gray-400 font-serif italic">Written with love, care, and warm thoughts</p>
        </div>

        {/* Paragraphs */}
        <div className={`space-y-6 text-[#3A3A3A] whitespace-pre-line ${fontSizeClasses[fontSize]}`}>
          {LETTER_CONTENT.paragraphs.map((para, index) => {
            const isHighlight = para.includes('stronger than you think') || para.includes('doing better than you think');
            return (
              <p
                key={index}
                className={
                  isHighlight
                    ? 'p-4 rounded-2xl bg-[#F0EAD6]/40 border-l-4 border-[#ADC178] text-[#6C584C] font-medium shadow-2xs'
                    : ''
                }
              >
                {para}
              </p>
            );
          })}
        </div>

        {/* Signature */}
        <div className="mt-10 pt-6 border-t border-[#ADC178]/20 flex flex-col items-end text-right">
          <p className="font-serif italic text-xl text-[#6C584C] font-bold">With endless love,</p>
          <p className="font-serif text-lg text-[#ADC178] font-semibold">Your Tita 🌿</p>
        </div>
      </div>

      {/* Virtual Hug & Reminder Section */}
      <div className="w-full mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={triggerVirtualHug}
          className="w-full sm:w-auto bg-gradient-to-r from-[#ADC178] to-[#8FA25D] hover:from-[#6C584C] hover:to-[#5A483E] text-white py-3 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium text-sm"
        >
          <Heart className="w-4 h-4 fill-current text-rose-200" />
          <span>Send Tita a Virtual Hug 🤗 ({hugCount})</span>
        </button>

        {showHugMessage && (
          <div className="text-xs font-semibold text-[#6C584C] bg-[#F0EAD6] px-4 py-2 rounded-xl animate-bounce border border-[#ADC178]/30">
            A warm hug was sent back to you! ❤️
          </div>
        )}

        <div className="text-xs text-[#6C584C] font-serif italic flex items-center gap-1.5 bg-white/80 px-4 py-2 rounded-2xl border border-[#ADC178]/20">
          <Bookmark className="w-3.5 h-3.5 text-[#ADC178]" />
          <span>Reminder: You are enough, always. 🌿</span>
        </div>
      </div>
    </div>
  );
};
