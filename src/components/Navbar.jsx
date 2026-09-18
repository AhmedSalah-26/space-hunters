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
    <header className="relative w-full bg-[#030914]/98 backdrop-blur-xl border-b border-cyan-500/20 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
      {/* Ambient top glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      
      {/* Background Ambient Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-cyan-400 rounded-full" />
        <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-blue-300 rounded-full" />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          DESKTOP NAVBAR (Visible on md:flex)
          ═══════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex max-w-[1850px] mx-auto items-center justify-between gap-3 lg:gap-6 relative z-10 px-3 sm:px-6 lg:px-10 py-1.5 sm:py-2.5">
        
        {/* ── 1. BRANDING SECTION ── */}
        <div
          className="flex items-center gap-2 sm:gap-3 lg:gap-4 cursor-pointer select-none shrink-0 group"
          onClick={onGoHome}
        >
          <div className="relative w-12 h-12 lg:w-16 lg:h-16 rounded-full overflow-hidden border-2 sm:border-3 border-[#00b4d8] shadow-[0_0_20px_rgba(0,180,216,0.8)] shrink-0 transition-transform duration-300 group-hover:scale-105 bg-[#071326]">
            <img
              src="/space_hunters_badge.jpg"
              alt="NASA Space Apps Space Hunters"
              className="w-full h-full object-cover scale-[2.2] sm:scale-[2.4] object-center"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-xl lg:text-[22px] font-black tracking-wider leading-none font-sans">
                <span className="text-white drop-shadow-md">SPACE</span>
                <span className="text-[#00b4d8] ml-1 drop-shadow-[0_0_12px_rgba(0,180,216,0.8)]">HUNTERS</span>
              </h1>
              <span className="text-emerald-400 text-base sm:text-xl shrink-0 animate-pulse">🌱</span>
            </div>
            <p className="text-[8.5px] sm:text-[9.5px] lg:text-[10px] text-[#38bdf8] font-black tracking-[0.14em] uppercase mt-1 drop-shadow">
              ADAPTING FARMS WITH NASA DATA
            </p>
          </div>
        </div>

        {/* ── Angled Parallelogram Divider Cut 1 + Diamond Node ── */}
        <div className="hidden lg:flex items-center gap-1.5 opacity-60">
          <div className="w-[1.5px] h-10 bg-gradient-to-b from-transparent via-cyan-400 to-transparent transform -skew-x-[20deg]" />
          <div className="w-1.5 h-1.5 bg-cyan-400 rotate-45 shadow-[0_0_8px_#38bdf8]" />
        </div>

        {/* ── 2. CENTER NAVIGATION SECTION ── */}
        <div className="flex-1 max-w-[700px] flex justify-center py-0.5">
          <div
            className="relative p-1 bg-[#051833]/90 backdrop-blur-md shadow-[0_0_20px_rgba(0,140,220,0.3)] border border-cyan-400/40"
            style={{
              clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)',
            }}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-0.5">
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
                    className={`relative flex flex-col items-center justify-center px-3 sm:px-5 py-1.5 transition-all duration-300 shrink-0 cursor-pointer ${
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
                    <span className="text-[10.5px] sm:text-xs font-black tracking-tight whitespace-nowrap">{label}</span>
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

        {/* ── 3. RIGHT NASA INFORMATION SECTION ── */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-[#092244] hover:bg-[#10305e] border border-cyan-400/40 text-[10.5px] sm:text-xs font-black text-cyan-300 transition-all hover:scale-105 shadow-sm cursor-pointer"
            style={{
              clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
            }}
            title={mapControlsData.switchLangTooltip}
          >
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
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

            {/* Slogan Text */}
            <div className="text-right hidden xl:block leading-tight">
              <p className="text-[9px] text-[#38bdf8] font-black tracking-[0.14em] uppercase">EARTH OBSERVATIONS</p>
              <p className="text-[9px] text-white font-bold tracking-wider mt-0.5">A BRIGHTER</p>
              <p className="text-[9px] text-slate-300 font-medium tracking-wide">MORE RESILIENT TOMORROW</p>
            </div>
          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE NAVBAR — Ultra-Clean & Non-overlapping
          ═══════════════════════════════════════════════════════════ */}
      <div className="md:hidden relative z-10 px-2 py-1.5 bg-[#030914]/98">
        <div className="flex items-center gap-1.5">

          {/* Logo */}
          <div
            onClick={onGoHome}
            className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-[#00b4d8] shadow-[0_0_10px_rgba(0,180,216,0.7)] shrink-0 bg-[#071326] cursor-pointer active:scale-90 transition-transform"
          >
            <img
              src="/space_hunters_badge.jpg"
              alt="Space Hunters"
              className="w-full h-full object-cover scale-[2.2] object-center"
            />
          </div>

          {/* Nav Tabs — 4 items strictly distributed */}
          <div className="flex-1 grid grid-cols-4 gap-1 bg-[#041220]/90 border border-cyan-500/25 p-0.5 rounded-xl backdrop-blur-md min-w-0">
            {[
              { id: 'map',         label: lang === 'ar' ? 'الخريطة' : 'Map',         icon: Home },
              { id: 'agriBank',    label: lang === 'ar' ? 'البنك' : 'Bank',          icon: Database },
              { id: 'gameGuide',   label: lang === 'ar' ? 'الدليل' : 'Guide',        icon: BookOpen },
              { id: 'leaderboard', label: lang === 'ar' ? 'الأوائل' : 'Leaders',      icon: Trophy },
            ].map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => { setActiveTab(id); if (id === 'map') onGoHome?.(); }}
                  className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-all duration-200 cursor-pointer active:scale-95 min-w-0 ${
                    isActive
                      ? 'bg-gradient-to-b from-blue-500 to-cyan-600 text-white shadow-[0_0_10px_rgba(0,180,256,0.5)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/8'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 mb-0.5 shrink-0 ${isActive ? 'text-white drop-shadow' : 'text-slate-400'}`} />
                  <span className={`text-[9px] font-black truncate max-w-full text-center leading-none ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 py-1.5 bg-[#0a1e3f] hover:bg-[#112d5c] border border-cyan-400/40 text-[9.5px] font-black text-cyan-300 rounded-lg shrink-0 active:scale-90 transition-transform cursor-pointer shadow-sm"
          >
            <Languages className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

        </div>
      </div>
    </header>
  );
}
