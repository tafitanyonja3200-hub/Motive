import React from 'react';
import { Mail, Gamepad2, BookOpen, Heart, Sparkles, Camera } from 'lucide-react';
import { PageType } from '../types';

interface NavbarProps {
  activePage: PageType;
  onPageChange: (page: PageType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, onPageChange }) => {
  if (activePage === 'intro') return null;

  const navItems = [
    { id: 'letter' as PageType, label: 'Letter', icon: Mail },
    { id: 'memories' as PageType, label: 'Memories', icon: Camera },
    { id: 'games' as PageType, label: 'Games', icon: Gamepad2 },
    { id: 'bible' as PageType, label: 'Daily Word', icon: BookOpen },
    { id: 'jar' as PageType, label: 'Warmth Jar', icon: Heart },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white/90 backdrop-blur-md border border-[#ADC178]/40 shadow-lg rounded-full px-3 py-2 flex items-center gap-1 sm:gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-[#ADC178] text-white shadow-sm scale-105'
                : 'text-[#6C584C] hover:bg-[#F0EAD6]/60 hover:text-[#6C584C]'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6C584C]'}`} />
            <span>{item.label}</span>
            {isActive && <Sparkles className="w-3 h-3 text-yellow-200 hidden sm:inline" />}
          </button>
        );
      })}
    </nav>
  );
};
