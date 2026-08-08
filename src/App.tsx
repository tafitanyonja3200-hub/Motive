import React, { useState } from 'react';
import { PageType } from './types';
import { AudioPlayer } from './components/AudioPlayer';
import { Navbar } from './components/Navbar';
import { IntroPage } from './components/IntroPage';
import { LetterPage } from './components/LetterPage';
import { GamesPage } from './components/GamesPage';
import { BiblePage } from './components/BiblePage';
import { WarmthJar } from './components/WarmthJar';
import { MemoriesPage } from './components/MemoriesPage';

export default function App() {
  const [activePage, setActivePage] = useState<PageType>('intro');
  const [recipient, setRecipient] = useState<string>('My love');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleStartApp = (customRecipient: string) => {
    if (customRecipient && customRecipient.trim()) {
      setRecipient(customRecipient.trim());
    }
    setIsPlayingAudio(true);
    setActivePage('letter');
  };

  const handlePageChange = (page: PageType) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C2C2C] font-sans relative selection:bg-[#ADC178]/30 selection:text-[#6C584C]">
      {/* Floating Audio Player Control (visible across all pages once started or toggled) */}
      <AudioPlayer
        isPlaying={isPlayingAudio}
        onTogglePlay={() => setIsPlayingAudio(!isPlayingAudio)}
      />

      {/* Pages */}
      <main className="w-full">
        {activePage === 'intro' && (
          <IntroPage onStart={handleStartApp} />
        )}

        {activePage === 'letter' && (
          <LetterPage recipient={recipient} />
        )}

        {activePage === 'memories' && (
          <MemoriesPage />
        )}

        {activePage === 'games' && (
          <GamesPage />
        )}

        {activePage === 'bible' && (
          <BiblePage />
        )}

        {activePage === 'jar' && (
          <WarmthJar />
        )}
      </main>

      {/* Bottom Floating Navigation Bar */}
      <Navbar activePage={activePage} onPageChange={handlePageChange} />
    </div>
  );
}
