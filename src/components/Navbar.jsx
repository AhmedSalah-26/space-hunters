'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Home, Database, BookOpen, Trophy, 
  Languages 
} from 'lucide-react';
import { mapControlsData } from '../data/worldMapData';

export default function Navbar({ activeTab = 'map', setActiveTab, onGoHome }) {
  const { t, lang, toggleLanguage } = useLanguage();

  return (
    <header className="relative w-full bg-[#030914]/95 backdrop-blur-xl border-b border-cyan-500/25 px-2 sm:px-6 lg:px-10 py-1.5 sm:py-2.5 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.85)]">
      {/* Background Ambient Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-cyan-400 rounded-full" />
        <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-blue-300 rounded-full" />
      </div>

      <div className="max-w-[1850px] mx-auto flex items-center justify-between gap-1.5 sm:gap-4 lg:gap-6 relative z-10">
        
        {/* ════ 1. LEFT BRANDING SECTION (Space Hunters + FIELD SHIFT) ════ */}
        <div
          className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 cursor-pointer select-none shrink-0 group"
          onClick={onGoHome}
        >
          {/* Circular NASA Space Apps "SPACE HUNTERS" Logo Badge */}
          <div className="relative w-10 h-10 sm:w-14 sm:h-14 lg:w-20 lg:h-20 rounded-full overflow-hidden border-2 sm:border-3 border-[#00b4d8] shadow-[0_0_20px_rgba(0,180,216,0.8)] shrink-0 transition-transform duration-300 group-hover:scale-105 bg-[#071326]">
            <img
              src="/space_hunters_badge.jpg"
              alt="NASA Space Apps Space Hunters"
              className="w-full h-full object-cover scale-[2.2] sm:scale-[2.4] object-center"
            />
          </div>

          {/* Title & Subtitle */}
          <div className="hidden md:flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-xl lg:text-[24px] font-black tracking-wider leading-none font-sans">
                <span className="text-white drop-shadow-md">SPACE</span>
                <span className="text-[#00b4d8] ml-1 drop-shadow-[0_0_12px_rgba(0,180,216,0.8)]">HUNTERS</span>
              </h1>
              <span className="text-emerald-400 text-base sm:text-xl shrink-0 animate-pulse">🌱</span>
            </div>
            <p className="text-[8.5px] sm:text-[9.5px] lg:text-[10.5px] text-[#38bdf8] font-black tracking-[0.14em] uppercase mt-1 drop-shadow">
              ADAPTING FARMS WITH NASA DATA
            </p>
          </div>
        </div>

        {/* ── Angled Parallelogram Divider Cut 1 + Diamond Node ── */}
        <div className="hidden lg:flex items-center gap-1.5 opacity-60">
          <div className="w-[1.5px] h-10 bg-gradient-to-b from-transparent via-cyan-400 to-transparent transform -skew-x-[20deg]" />
          <div className="w-1.5 h-1.5 bg-cyan-400 rotate-45 shadow-[0_0_8px_#38bdf8]" />
        </div>

        {/* ════ 2. CENTER NAVIGATION SECTION (Parallelogram & Rhombus) ════ */}
        <div className="flex-1 max-w-[760px] flex justify-center overflow-x-auto no-scrollbar py-0.5">
          {/* Outer Container */}
          <div
            className="relative p-1 bg-[#051833]/90 backdrop-blur-md shadow-[0_0_20px_rgba(0,140,220,0.3)] border border-cyan-400/40 rounded-xl sm:rounded-none"
            style={{
              clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)',
            }}
          >
            {/* Nav Items Grid */}
            <div className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-0.5">
              {[
                { id: 'map',         label: t.navMap,         icon: Home },
                { id: 'agriBank',    label: t.navAgriBank,    icon: Database },
                { id: 'gameGuide',   label: t.navGameGuide,   icon: BookOpen },
                { id: 'leaderboard', label: t.navLeaderboard, icon: Trophy },
              ].map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => { setActiveTab(id); if (id === 'map') onGoHome?.(); }}
                    className={`relative flex flex-col items-center justify-center px-2.5 sm:px-5 py-1.5 transition-all duration-300 shrink-0 ${
                      isActive
                        ? 'text-white scale-[1.03]'
                        : 'text-slate-300 hover:text-white hover:bg-cyan-500/15'
                    }`}
                    style={{
                      clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                      background: isActive
                        ? 'linear-gradient(180deg, rgba(0,130,220,0.95) 0%, rgba(0,70,165,0.95) 100%)'
                        : 'rgba(255,255,255,0.03)',
                      boxShadow: isActive ? 'inset 0 1px 0 rgba(255,255,255,0.4), 0 0 14px rgba(0,180,256,0.6)' : 'none',
                    }}
                  >
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mb-0.5 stroke-[2.2] ${isActive ? 'text-cyan-100 drop-shadow' : 'text-slate-300'}`} />
                    <span className="text-[10px] sm:text-xs font-black tracking-tight whitespace-nowrap">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Angled Parallelogram Divider Cut 2 + Diamond Node ── */}
        <div className="hidden lg:flex items-center gap-1.5 opacity-60">
          <div className="w-1.5 h-1.5 bg-cyan-400 rotate-45 shadow-[0_0_8px_#38bdf8]" />
          <div className="w-[1.5px] h-10 bg-gradient-to-b from-transparent via-cyan-400 to-transparent transform -skew-x-[20deg]" />
        </div>

        {/* ════ 3. RIGHT NASA INFORMATION SECTION ════ */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-[#092244] hover:bg-[#10305e] border border-cyan-400/40 text-[10.5px] sm:text-xs font-black text-cyan-300 transition-all hover:scale-105 shadow-sm cursor-pointer"
            style={{
              clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
            }}
            title={mapControlsData.switchLangTooltip}
          >
            <Languages className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
            <span>{lang === 'ar' ? mapControlsData.langLabelEn : mapControlsData.langLabelAr}</span>
          </button>

          {/* NASA Meatball Logo */}
          <div className="flex items-center gap-2 border-r border-cyan-500/20 pr-1 sm:pr-2">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0b3d91] flex items-center justify-center shadow-[0_0_12px_rgba(11,61,145,0.7)] border border-cyan-300/50 shrink-0 overflow-hidden">
              <div className="absolute inset-0 bg-[#0b3d91]" />
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 44 44">
                <path d="M 5 34 Q 22 8 39 18 Q 28 27 7 36" fill="none" stroke="#e03c31" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="9" cy="13" r="0.6" fill="white" />
                <circle cx="35" cy="29" r="0.6" fill="white" />
                <circle cx="27" cy="7" r="0.6" fill="white" />
              </svg>
              <span className="text-[9px] sm:text-[10px] font-black text-white tracking-wider z-10 font-sans">NASA</span>
            </div>

            {/* Slogan Text (Desktop only) */}
            <div className="text-right hidden xl:block leading-tight">
              <p className="text-[9px] text-[#38bdf8] font-black tracking-[0.14em] uppercase">EARTH OBSERVATIONS</p>
              <p className="text-[9px] text-white font-bold tracking-wider mt-0.5">A BRIGHTER</p>
              <p className="text-[9px] text-slate-300 font-medium tracking-wide">MORE RESILIENT TOMORROW</p>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
