'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Thermometer, Droplets, Leaf, BarChart2, 
  ArrowRight, ArrowLeft, Satellite 
} from 'lucide-react';

export default function MissionDetailCard({ selectedMission, onStartMission, className = '', isMobile = false, onCloseMobile }) {
  const { t, lang, isRtl } = useLanguage();

  const containerClasses = className || "hidden lg:flex lg:absolute lg:top-3 lg:right-3 z-20 w-[360px] max-h-[calc(100%-1.5rem)] overflow-y-auto pointer-events-auto flex-col gap-3.5 p-4 bg-[#061633]/96 border border-cyan-400/50 shadow-2xl backdrop-blur-md custom-scrollbar rounded-2xl";

  return (
    <div
      className={containerClasses}
      style={{
        clipPath: isMobile ? 'none' : 'polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)',
      }}
    >
      {/* ROW 1: Flag + Country Name & Mission Code */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl sm:text-3xl leading-none drop-shadow">{selectedMission.flag}</span>
          <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
            {lang === 'ar' ? selectedMission.countryAr : selectedMission.countryEn}
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Mission Code Pill */}
          <div className="shrink-0 bg-[#0c2147] border border-cyan-400/50 rounded-lg px-2.5 sm:px-3 py-1 text-xs font-black text-cyan-300 shadow-sm">
            {t.missionNumber}{selectedMission.code}
          </div>
          {isMobile && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 text-slate-400 hover:text-white rounded-lg bg-white/5 border border-white/10 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ROW 2: Title + Difficulty */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-black text-white leading-snug flex-1">
          {lang === 'ar' ? selectedMission.titleAr : selectedMission.titleEn}
        </h3>
        {/* Difficulty Badge */}
        <div className="shrink-0 flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/40 rounded-lg px-2.5 py-1">
          <div className="flex items-center gap-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
          </div>
          <span className="text-[10px] font-black text-amber-300">{t.difficultyMedium}</span>
        </div>
      </div>

      {/* HERO IMAGE */}
      <div
        className="w-full overflow-hidden border border-cyan-400/40 shadow-md h-36 relative"
        style={{
          clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)',
        }}
      >
        <img
          src={selectedMission.heroImage}
          alt={selectedMission.countryEn}
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 40%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* DESCRIPTION */}
      <p className="text-xs text-slate-200 leading-relaxed font-medium">
        {lang === 'ar' ? selectedMission.descriptionAr : selectedMission.descriptionEn}
      </p>

      {/* NASA DATA SECTION */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-sm">🛰️</span>
          <span className="text-xs font-black text-white">{t.keyNasaData}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            {
              icon: <Thermometer className="w-3.5 h-3.5 text-red-400" />,
              v: selectedMission.telemetry?.tempAnomaly,
              l: t.tempAnomaly,
              vc: 'text-red-400',
              border: 'border-red-500/35',
              bg: 'bg-red-950/20',
            },
            {
              icon: <Droplets className="w-3.5 h-3.5 text-sky-400" />,
              v: selectedMission.telemetry?.rainfallTrend,
              l: t.rainfallTrend,
              vc: 'text-sky-400',
              border: 'border-sky-500/35',
              bg: 'bg-sky-950/20',
            },
            {
              icon: <Leaf className="w-3.5 h-3.5 text-emerald-400" />,
              v: selectedMission.telemetry?.soilMoisture,
              l: t.soilMoisture,
              vc: 'text-emerald-400',
              border: 'border-emerald-500/35',
              bg: 'bg-emerald-950/20',
            },
            {
              icon: <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />,
              v: selectedMission.telemetry?.ndvi,
              l: t.ndviIndex,
              vc: 'text-cyan-400',
              border: 'border-cyan-500/35',
              bg: 'bg-cyan-950/20',
            },
          ].map(({ icon, v, l, vc, border, bg }) => (
            <div
              key={l}
              className={`flex flex-col items-center p-2 ${bg} border ${border} rounded-xl text-center gap-0.5`}
            >
              <div>{icon}</div>
              <span className={`text-sm font-black leading-tight ${vc}`}>{v}</span>
              <p className="text-[9.5px] text-slate-300 font-bold leading-tight truncate w-full">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col gap-2 mt-1">
        <button
          onClick={onStartMission}
          className="w-full py-3 px-4 font-black text-sm text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer shadow-lg rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-blue-500/40"
        >
          {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          <span>{t.startMission}</span>
        </button>

        <button
          onClick={onStartMission}
          className="w-full py-2 px-3 font-bold text-xs text-slate-300 flex items-center justify-center gap-1.5 border border-cyan-500/35 hover:border-cyan-400 hover:text-white bg-white/[0.04] transition-all cursor-pointer rounded-xl"
        >
          <Satellite className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.viewAllMissions}</span>
        </button>
      </div>
    </div>
  );
}
