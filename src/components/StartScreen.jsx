'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Rocket, Sprout, RotateCcw, 
  BookOpen, Languages, 
  ArrowLeft, ArrowRight, Satellite,
  Scan, Compass
} from 'lucide-react';
import { startScreenData } from '../data/startScreenData';

export default function StartScreen({ 
  onStartGame, 
  onOpenFarmPro,
  onOpenAgriBank, 
  onOpenSequenceBuilder,
  onOpenGameGuide
}) {
  const { lang, isRtl, toggleLanguage } = useLanguage();

  return (
    <div className="relative w-full h-full flex flex-col items-center overflow-y-auto select-none">
      
      {/* ── CINEMATIC SPACE BACKGROUND (Fixed, GPU Composited, Zero-glitch on RTL/LTR toggle) ── */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
        style={{
          backgroundImage: "radial-gradient(ellipse at center, rgba(1,5,16,0.3) 20%, #010510 92%), linear-gradient(to bottom, rgba(2,10,26,0.85), rgba(5,12,27,0.6), rgba(2,5,12,0.95)), url('/start_screen_bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      />

      {/* ── TOP NAV STRIP ── */}
      <div className="w-full flex items-center justify-between px-3 sm:px-6 pt-3 sm:pt-4 pb-2 shrink-0 z-20">
        {/* Badge */}
        <span className="px-2.5 py-1 bg-[#061530]/90 border border-cyan-400/35 rounded-full text-[10px] sm:text-[11px] font-mono font-bold text-cyan-300 shadow-sm backdrop-blur-md">
          {lang === 'ar' ? startScreenData.badgeAr : startScreenData.badgeEn}
        </span>

        {/* Action Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenAgriBank}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#061a33]/90 hover:bg-[#0a284e] border border-emerald-500/35 hover:border-emerald-400/60 text-[10px] sm:text-xs font-bold text-emerald-300 hover:text-white rounded-lg transition-all cursor-pointer backdrop-blur-md active:scale-95"
          >
            <Sprout className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'موسوعة المحاصيل' : 'Crops Guide'}</span>
          </button>

          <button
            onClick={onOpenGameGuide}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#061530]/90 hover:bg-[#0c2858] border border-white/10 hover:border-cyan-400/60 text-[10px] sm:text-xs font-bold text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer backdrop-blur-md active:scale-95"
          >
            <BookOpen className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">{lang === 'ar' ? startScreenData.guideBtnAr : startScreenData.guideBtnEn}</span>
          </button>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#082046]/90 hover:bg-[#103672] border border-cyan-400/40 text-[10px] sm:text-xs font-bold text-cyan-300 rounded-lg transition-all cursor-pointer backdrop-blur-md active:scale-95"
          >
            <Languages className="w-3 h-3 text-cyan-400" />
            <span>{lang === 'ar' ? 'EN' : 'ع'}</span>
          </button>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 z-10 py-2 sm:py-4 w-full max-w-lg mx-auto">
        
        {/* Logo + Title group */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          {/* Outer glow ring */}
          <div className="relative mb-4 sm:mb-5 group">
            <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/25 via-blue-600/25 to-emerald-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -inset-1 bg-gradient-to-br from-cyan-400/40 to-blue-600/40 rounded-full blur-md" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-cyan-400/90 shadow-[0_0_40px_rgba(0,180,216,0.7),inset_0_0_20px_rgba(0,0,0,0.5)] bg-[#041026] transition-transform duration-500 group-hover:scale-105">
              <img
                src="/space_hunters_badge.jpg"
                alt="Space Hunters Logo"
                className="w-full h-full object-cover scale-[2.1] object-center"
              />
            </div>
            {/* NASA badge */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#0b3d91] border-2 border-cyan-300/50 shadow-[0_0_8px_rgba(11,61,145,0.8)] flex items-center justify-center overflow-hidden">
              <span className="text-[7px] font-black text-white z-10 relative">NASA</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-black tracking-wider text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] mb-2 leading-none">
            <span>SPACE</span>
            <span className="text-[#00b4d8] ml-2 drop-shadow-[0_0_24px_rgba(0,180,216,0.9)]">HUNTERS</span>
          </h1>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-cyan-400/60" />
            <Satellite className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] text-[#38bdf8] font-black tracking-[0.2em] uppercase">NASA Space Apps 2026</span>
            <Satellite className="w-3 h-3 text-cyan-400 scale-x-[-1]" />
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-cyan-400/60" />
          </div>

          <p className="text-xs sm:text-sm font-bold text-cyan-100/90 leading-relaxed max-w-sm drop-shadow-md">
            {lang === 'ar' ? startScreenData.taglineAr : startScreenData.taglineEn}
          </p>
        </div>

        {/* ── 2 BIG PRIMARY ACTION CARDS (ULTRA-CLEAN & INTUITIVE) ── */}
        <div className="w-full space-y-3">
          
          {/* PRIMARY 1: FARM PRO STUDIO (TARGET YOUR FARM) */}
          <button
            onClick={onOpenFarmPro}
            className="w-full py-4 px-5 bg-gradient-to-r from-indigo-700 via-purple-700 to-cyan-600 hover:from-indigo-600 hover:to-cyan-500 text-white rounded-2xl shadow-[0_0_35px_rgba(99,102,241,0.5),0_8px_20px_rgba(0,0,0,0.5)] flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer border border-indigo-400/50 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="flex items-center gap-3.5 z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/30 border border-indigo-300/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <Scan className="w-6 h-6 text-cyan-300" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black tracking-wide leading-tight text-white">
                    {lang === 'ar' ? 'حدد أرضك على الخريطة' : 'Target Your Farm'}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-400/40 font-mono font-bold">
                    PRO
                  </span>
                </div>
                <div className="text-xs text-indigo-200 font-medium mt-0.5">
                  {lang === 'ar' ? 'خريطة أقمار ناسا • اعرف حالة أرضك وأحسن زرعة ليها' : 'Real NASA Satellite Tiles • Smart Crop Advisory'}
                </div>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-indigo-500/30 border border-indigo-300/30 flex items-center justify-center shrink-0 z-10 group-hover:translate-x-1 transition-transform">
              {isRtl ? <ArrowLeft className="w-5 h-5 text-indigo-200" /> : <ArrowRight className="w-5 h-5 text-indigo-200" />}
            </div>
          </button>

          {/* PRIMARY 2: GAME MODE (PLAY & LEARN) */}
          <button
            onClick={onStartGame}
            className="w-full py-4 px-5 bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 hover:from-blue-600 hover:to-teal-500 text-white rounded-2xl shadow-[0_0_30px_rgba(0,120,220,0.4),0_8px_20px_rgba(0,0,0,0.4)] flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer border border-cyan-400/30 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="flex items-center gap-3.5 z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform duration-300">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-base sm:text-lg font-black tracking-wide leading-tight">
                  {lang === 'ar' ? 'العب واتعلم (تحديات زراعية)' : 'Play & Learn (Field Missions)'}
                </div>
                <div className="text-xs text-cyan-100 font-medium mt-0.5">
                  {lang === 'ar' ? '٦ مهمات ممتعة لحل مشاكل الفلاحين حول العالم' : '6 Global Missions to solve real farm challenges'}
                </div>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 z-10 group-hover:translate-x-1 transition-transform">
              {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </div>
          </button>

        </div>

      </div>

      {/* ── BOTTOM SIGNATURE ── */}
      <div className="w-full flex items-center justify-center gap-2 pb-2 shrink-0 z-10">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10 max-w-[60px]" />
        <span className="text-[10px] font-mono text-slate-500">{startScreenData.teamSignature}</span>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10 max-w-[60px]" />
      </div>

    </div>
  );
}
