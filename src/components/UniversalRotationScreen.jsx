'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowLeft, ArrowRight, RotateCcw, 
  Sprout, Droplets, ShieldCheck, 
  Award, Sparkles, Filter, Check, 
  Globe2, Satellite, Flame, Layers
} from 'lucide-react';
import { 
  universalCropCategories, 
  universalCropsDatabase, 
  universalClimatePresets, 
  universalEngineTexts 
} from '../data/universalRotationData';

export default function UniversalRotationScreen({ onBack }) {
  const { lang, isRtl } = useLanguage();

  // Selected Climate Preset
  const [selectedPresetId, setSelectedPresetId] = useState('delta_arid');
  const activePreset = universalClimatePresets.find(p => p.id === selectedPresetId) || universalClimatePresets[0];

  // Category filter
  const [activeCategory, setActiveCategory] = useState('all');

  // 3-Season Selected Crops (Crop IDs)
  const [sequence, setSequence] = useState({
    season1: 'winter_wheat',
    season2: 'faba_beans',
    season3: 'sorghum_grain'
  });

  // Filter crops by category
  const filteredCrops = useMemo(() => {
    if (activeCategory === 'all') return universalCropsDatabase;
    return universalCropsDatabase.filter(c => c.category === activeCategory);
  }, [activeCategory]);

  // Compute Live Agronomic & NASA Telemetry Simulation
  const metrics = useMemo(() => {
    const c1 = universalCropsDatabase.find(c => c.id === sequence.season1) || universalCropsDatabase[0];
    const c2 = universalCropsDatabase.find(c => c.id === sequence.season2) || universalCropsDatabase[4];
    const c3 = universalCropsDatabase.find(c => c.id === sequence.season3) || universalCropsDatabase[8];

    // Check legume presence
    const hasLegume = [c1, c2, c3].some(c => c.category === 'legumes' || c.family === 'Fabaceae');
    // Check drought hardy presence
    const hasDroughtHardy = [c1, c2, c3].some(c => c.category === 'drought_hardy' || c.droughtTolerance >= 93);
    // Check diversity / pest break (unique families)
    const families = new Set([c1.family, c2.family, c3.family]);
    const isMonoculture = families.size === 1;
    const isPartialMonoculture = families.size === 2;

    // Total water demand (m3/ha) vs standard monoculture baseline (~1800 m3/ha)
    const totalWaterDemand = c1.waterDemand + c2.waterDemand + c3.waterDemand;
    const waterSavedPercent = Math.round(Math.max(5, Math.min(65, ((1800 - totalWaterDemand) / 1800) * 100)));

    // Nitrogen balance
    const netNitrogen = c1.nImpact + c2.nImpact + c3.nImpact;

    // Pest Break Score
    let pestBreakScore = families.size === 3 ? 95 : families.size === 2 ? 65 : 20;

    // Overall Resilience Score (0 - 100)
    let score = Math.round((c1.droughtTolerance + c2.droughtTolerance + c3.droughtTolerance) / 3);
    if (hasLegume) score += 8;
    if (hasDroughtHardy) score += 6;
    if (isMonoculture) score -= 35;
    else if (isPartialMonoculture) score -= 10;
    score = Math.max(25, Math.min(99, score));

    // Grade
    let grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : score >= 60 ? 'B' : 'D';
    let gradeColor = score >= 85 ? 'text-emerald-400 border-emerald-400 bg-emerald-950/60' :
                     score >= 70 ? 'text-cyan-400 border-cyan-400 bg-cyan-950/60' :
                     score >= 60 ? 'text-amber-400 border-amber-400 bg-amber-950/60' :
                     'text-red-400 border-red-500 bg-red-950/60';

    return {
      c1, c2, c3,
      hasLegume,
      hasDroughtHardy,
      isMonoculture,
      waterSavedPercent,
      netNitrogen,
      pestBreakScore,
      score,
      grade,
      gradeColor
    };
  }, [sequence]);

  const handleResetSequence = () => {
    setSequence({
      season1: 'winter_wheat',
      season2: 'faba_beans',
      season3: 'sorghum_grain'
    });
  };

  return (
    <div className="w-full h-full max-w-[1700px] mx-auto px-3 sm:px-6 py-2.5 flex flex-col justify-between overflow-hidden select-none">
      
      {/* ── 1. HEADER BAR ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-cyan-500/25 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2.5 py-0.5 bg-blue-950 border border-cyan-400/40 rounded-lg text-[11px] font-mono font-bold text-cyan-300">
              {lang === 'ar' ? universalEngineTexts.headerBadgeAr : universalEngineTexts.headerBadgeEn}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span>{lang === 'ar' ? universalEngineTexts.titleAr : universalEngineTexts.titleEn}</span>
          </h2>
          <p className="text-xs text-slate-300 hidden sm:block">
            {lang === 'ar' ? universalEngineTexts.subtitleAr : universalEngineTexts.subtitleEn}
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleResetSequence}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#061838] hover:bg-[#0c2a5c] border border-cyan-500/35 hover:border-cyan-400 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ar' ? universalEngineTexts.resetSequenceBtnAr : universalEngineTexts.resetSequenceBtnEn}</span>
          </button>

          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-black shadow-md transition-all hover:scale-105 cursor-pointer"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{lang === 'ar' ? universalEngineTexts.backToHomeBtnAr : universalEngineTexts.backToHomeBtnEn}</span>
          </button>
        </div>
      </div>

      {/* ── 2. NASA CLIMATE & SOIL PRESET SELECTOR ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#040e21]/90 border border-cyan-500/20 rounded-xl shrink-0 my-1">
        <div className="flex items-center gap-2 text-xs text-cyan-300 font-bold">
          <Satellite className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{lang === 'ar' ? universalEngineTexts.presetLabelAr : universalEngineTexts.presetLabelEn}</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {universalClimatePresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPresetId(preset.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedPresetId === preset.id
                  ? 'bg-blue-600 text-white border border-cyan-300 shadow-sm'
                  : 'bg-[#081730] border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              {lang === 'ar' ? preset.nameAr : preset.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. CATEGORY FILTERS ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 shrink-0">
        <span className="text-xs text-slate-400 font-bold flex items-center gap-1 shrink-0 ml-1">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
        </span>
        {universalCropCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                : 'bg-[#061838] border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {lang === 'ar' ? cat.labelAr : cat.labelEn}
          </button>
        ))}
      </div>

      {/* ── 4. MAIN 3-SEASON INTERACTIVE BUILDER COLUMNS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-0 overflow-hidden my-1">
        
        {/* SEASON 1: WINTER / PRIMARY */}
        <div className="p-3 bg-[#051329]/95 border-2 border-cyan-500/40 rounded-2xl flex flex-col justify-between min-h-0 shadow-lg">
          <div className="flex items-center justify-between pb-1.5 border-b border-cyan-500/20 text-xs font-black text-cyan-300 shrink-0">
            <span className="flex items-center gap-1.5">
              <span>❄️</span>
              <span>{lang === 'ar' ? universalEngineTexts.season1TitleAr : universalEngineTexts.season1TitleEn}</span>
            </span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400/40 text-cyan-300">
              01
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-1.5 my-2 pr-1">
            {filteredCrops.map((crop) => {
              const isSelected = sequence.season1 === crop.id;
              return (
                <button
                  key={crop.id}
                  onClick={() => setSequence(prev => ({ ...prev, season1: crop.id }))}
                  className={`w-full ${isRtl ? 'text-right' : 'text-left'} p-2 rounded-xl transition-all border flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/90 border-cyan-300 text-white shadow-md font-black ring-1 ring-cyan-300'
                      : 'bg-[#081730] border-white/10 text-slate-300 hover:bg-[#0c2650] hover:text-white font-bold'
                  }`}
                >
                  <div className="min-w-0 pr-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black truncate">{lang === 'ar' ? crop.nameAr : crop.nameEn}</span>
                    </div>
                    <div className="text-[10px] text-cyan-200 truncate flex items-center gap-2 font-normal mt-0.5">
                      <span>💧 {lang === 'ar' ? crop.waterLevelAr : crop.waterLevelEn}</span>
                      <span>•</span>
                      <span>🌱 {lang === 'ar' ? crop.nImpactAr : crop.nImpactEn}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-cyan-200 shrink-0 mx-1" />}
                </button>
              );
            })}
          </div>

          {/* Active Choice Card Summary */}
          <div className="p-2 bg-black/40 rounded-xl border border-cyan-500/20 text-xs text-slate-200 shrink-0">
            <span className="text-cyan-300 font-bold block truncate">
              🌾 {lang === 'ar' ? metrics.c1.nameAr : metrics.c1.nameEn}
            </span>
            <p className="text-[10.5px] text-slate-300 truncate mt-0.5">
              {lang === 'ar' ? metrics.c1.soilBenefitAr : metrics.c1.soilBenefitEn}
            </p>
          </div>
        </div>

        {/* SEASON 2: SUMMER / LEGUME */}
        <div className="p-3 bg-[#051329]/95 border-2 border-emerald-500/40 rounded-2xl flex flex-col justify-between min-h-0 shadow-lg">
          <div className="flex items-center justify-between pb-1.5 border-b border-emerald-500/20 text-xs font-black text-emerald-300 shrink-0">
            <span className="flex items-center gap-1.5">
              <span>☀️</span>
              <span>{lang === 'ar' ? universalEngineTexts.season2TitleAr : universalEngineTexts.season2TitleEn}</span>
            </span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-400/40 text-emerald-300">
              02
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-1.5 my-2 pr-1">
            {filteredCrops.map((crop) => {
              const isSelected = sequence.season2 === crop.id;
              const isLegume = crop.category === 'legumes' || crop.family === 'Fabaceae';
              return (
                <button
                  key={crop.id}
                  onClick={() => setSequence(prev => ({ ...prev, season2: crop.id }))}
                  className={`w-full ${isRtl ? 'text-right' : 'text-left'} p-2 rounded-xl transition-all border flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600/90 border-emerald-300 text-white shadow-md font-black ring-1 ring-emerald-300'
                      : 'bg-[#081730] border-white/10 text-slate-300 hover:bg-[#0c2650] hover:text-white font-bold'
                  }`}
                >
                  <div className="min-w-0 pr-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black truncate">{lang === 'ar' ? crop.nameAr : crop.nameEn}</span>
                      {isLegume && <span className="text-emerald-400 text-xs">🌿</span>}
                    </div>
                    <div className="text-[10px] text-emerald-200 truncate flex items-center gap-2 font-normal mt-0.5">
                      <span>🌱 {lang === 'ar' ? crop.nImpactAr : crop.nImpactEn}</span>
                      <span>•</span>
                      <span>☀️ {crop.droughtTolerance}%</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-200 shrink-0 mx-1" />}
                </button>
              );
            })}
          </div>

          {/* Active Choice Card Summary */}
          <div className="p-2 bg-black/40 rounded-xl border border-emerald-500/20 text-xs text-slate-200 shrink-0">
            <span className="text-emerald-300 font-bold block truncate">
              🌿 {lang === 'ar' ? metrics.c2.nameAr : metrics.c2.nameEn}
            </span>
            <p className="text-[10.5px] text-slate-300 truncate mt-0.5">
              {lang === 'ar' ? metrics.c2.soilBenefitAr : metrics.c2.soilBenefitEn}
            </p>
          </div>
        </div>

        {/* SEASON 3: COVER / BREAK CROP */}
        <div className="p-3 bg-[#051329]/95 border-2 border-amber-500/40 rounded-2xl flex flex-col justify-between min-h-0 shadow-lg">
          <div className="flex items-center justify-between pb-1.5 border-b border-amber-500/20 text-xs font-black text-amber-300 shrink-0">
            <span className="flex items-center gap-1.5">
              <span>🍂</span>
              <span>{lang === 'ar' ? universalEngineTexts.season3TitleAr : universalEngineTexts.season3TitleEn}</span>
            </span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-950 border border-amber-400/40 text-amber-300">
              03
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-1.5 my-2 pr-1">
            {filteredCrops.map((crop) => {
              const isSelected = sequence.season3 === crop.id;
              return (
                <button
                  key={crop.id}
                  onClick={() => setSequence(prev => ({ ...prev, season3: crop.id }))}
                  className={`w-full ${isRtl ? 'text-right' : 'text-left'} p-2 rounded-xl transition-all border flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600/90 border-amber-300 text-white shadow-md font-black ring-1 ring-amber-300'
                      : 'bg-[#081730] border-white/10 text-slate-300 hover:bg-[#0c2650] hover:text-white font-bold'
                  }`}
                >
                  <div className="min-w-0 pr-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black truncate">{lang === 'ar' ? crop.nameAr : crop.nameEn}</span>
                    </div>
                    <div className="text-[10px] text-amber-200 truncate flex items-center gap-2 font-normal mt-0.5">
                      <span>☀️ {lang === 'ar' ? crop.droughtToleranceAr : crop.droughtToleranceEn}</span>
                      <span>•</span>
                      <span>🌱 {crop.rootDepthAr}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-200 shrink-0 mx-1" />}
                </button>
              );
            })}
          </div>

          {/* Active Choice Card Summary */}
          <div className="p-2 bg-black/40 rounded-xl border border-amber-500/20 text-xs text-slate-200 shrink-0">
            <span className="text-amber-300 font-bold block truncate">
              🌽 {lang === 'ar' ? metrics.c3.nameAr : metrics.c3.nameEn}
            </span>
            <p className="text-[10.5px] text-slate-300 truncate mt-0.5">
              {lang === 'ar' ? metrics.c3.soilBenefitAr : metrics.c3.soilBenefitEn}
            </p>
          </div>
        </div>

      </div>

      {/* ── 5. LIVE TELEMETRY GAUGES & AI DIAGNOSIS BANNER ── */}
      <div className="p-3 bg-[#040e21] border border-cyan-500/35 rounded-2xl shrink-0 space-y-2 mt-1 shadow-xl">
        
        {/* 4 Gauges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          
          {/* Water Gauge */}
          <div className="p-2 bg-[#081730] border border-sky-500/30 rounded-xl text-center">
            <span className="text-[11px] text-slate-300 block font-bold">
              {lang === 'ar' ? universalEngineTexts.waterGaugeAr : universalEngineTexts.waterGaugeEn}
            </span>
            <span className="text-sm sm:text-base font-black text-sky-400 font-mono flex items-center justify-center gap-1 mt-0.5">
              <Droplets className="w-4 h-4" />
              <span>+{metrics.waterSavedPercent}%</span>
            </span>
          </div>

          {/* Nitrogen Gauge */}
          <div className="p-2 bg-[#081730] border border-emerald-500/30 rounded-xl text-center">
            <span className="text-[11px] text-slate-300 block font-bold">
              {lang === 'ar' ? universalEngineTexts.nitrogenGaugeAr : universalEngineTexts.nitrogenGaugeEn}
            </span>
            <span className={`text-sm sm:text-base font-black font-mono flex items-center justify-center gap-1 mt-0.5 ${
              metrics.netNitrogen >= 0 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              <Sprout className="w-4 h-4" />
              <span>{metrics.netNitrogen >= 0 ? `+${metrics.netNitrogen}` : metrics.netNitrogen} kg N</span>
            </span>
          </div>

          {/* Pest Break Gauge */}
          <div className="p-2 bg-[#081730] border border-amber-500/30 rounded-xl text-center">
            <span className="text-[11px] text-slate-300 block font-bold">
              {lang === 'ar' ? universalEngineTexts.pestGaugeAr : universalEngineTexts.pestGaugeEn}
            </span>
            <span className={`text-sm sm:text-base font-black font-mono flex items-center justify-center gap-1 mt-0.5 ${
              metrics.pestBreakScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              <ShieldCheck className="w-4 h-4" />
              <span>{metrics.pestBreakScore}%</span>
            </span>
          </div>

          {/* Overall Resilience Score */}
          <div className={`p-2 rounded-xl border flex items-center justify-between px-3 ${metrics.gradeColor}`}>
            <div>
              <span className="text-[10px] text-slate-200 block font-bold">
                {lang === 'ar' ? universalEngineTexts.resilienceGaugeAr : universalEngineTexts.resilienceGaugeEn}
              </span>
              <span className="text-xs font-mono font-bold">
                {metrics.score}/100
              </span>
            </div>
            <span className="text-2xl font-black font-['Orbitron',sans-serif]">
              {metrics.grade}
            </span>
          </div>

        </div>

        {/* AI Diagnostic Advice */}
        <div className="p-2 bg-[#061530] border border-white/10 rounded-xl flex items-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <p className="text-slate-200 font-medium truncate">
            {metrics.isMonoculture
              ? (lang === 'ar' ? universalEngineTexts.monocultureAlertAr : universalEngineTexts.monocultureAlertEn)
              : !metrics.hasLegume
              ? (lang === 'ar' ? universalEngineTexts.legumeMissingTipAr : universalEngineTexts.legumeMissingTipEn)
              : (lang === 'ar' ? universalEngineTexts.droughtHardyBonusAr : universalEngineTexts.droughtHardyBonusEn)}
          </p>
        </div>

      </div>

    </div>
  );
}
