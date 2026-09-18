'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import StepperHeader from './StepperHeader';
import DecisionTelemetryPanel from './decision/DecisionTelemetryPanel';
import SeasonColumn from './decision/SeasonColumn';
import DecisionGauges from './decision/DecisionGauges';
import { 
  ArrowRight, ArrowLeft,
  Award, RefreshCw
} from 'lucide-react';
import { 
  farmerMoodFeedback, 
  decisionSeasonHeaders, 
  decisionScreenLabels 
} from '../data/decisionFeedbackData';

export default function DecisionMatrixScreen({ mission, onBack, onDecisionSubmit }) {
  const { t, lang, isRtl } = useLanguage();

  // Custom Sequence Builder State (Season 1, Season 2, Season 3)
  const [customSequence, setCustomSequence] = useState({
    season1: mission.crops[0]?.id || "wheat",
    season2: mission.crops[1]?.id || "legumes_faba",
    season3: mission.crops[2]?.id || "corn",
  });

  // Compute Custom Sequence Metrics dynamically with NASA sensor correlation
  const customMetrics = useMemo(() => {
    const c1 = mission.crops.find(c => c.id === customSequence.season1) || mission.crops[0];
    const c2 = mission.crops.find(c => c.id === customSequence.season2) || mission.crops[1];
    const c3 = mission.crops.find(c => c.id === customSequence.season3) || mission.crops[2];

    const hasLegume = [c1.id, c2.id, c3.id].some(id => id.includes('legume') || id.includes('faba') || id.includes('soy'));
    const hasSorghum = [c1.id, c2.id, c3.id].some(id => id.includes('sorghum') || id.includes('millet'));
    const isMonoculture = (c1.id === c2.id && c2.id === c3.id) || (c1.id === c2.id);

    let waterSaved = 25;
    let nBalance = 15;
    let resilience = 80;

    if (hasLegume) {
      nBalance += 25;
      waterSaved += 10;
      resilience += 8;
    }
    if (hasSorghum) {
      waterSaved += 15;
      resilience += 10;
    }
    if (isMonoculture) {
      waterSaved -= 35;
      nBalance -= 45;
      resilience -= 40;
    }

    // Dynamic Farmer Feedback loaded from data layer
    let moodConfig = farmerMoodFeedback.optimal;
    if (isMonoculture) {
      moodConfig = farmerMoodFeedback.monoculture;
    } else if (!hasLegume) {
      moodConfig = farmerMoodFeedback.missingLegume;
    }

    const farmerMood = moodConfig.mood;
    const farmerFeedback = lang === 'ar' ? moodConfig.feedbackAr : moodConfig.feedbackEn;
    const farmerStatus = lang === 'ar' ? moodConfig.statusAr : moodConfig.statusEn;

    return {
      waterSaved: Math.max(5, Math.min(60, waterSaved)),
      nBalance: Math.max(-50, Math.min(50, nBalance)),
      resilience: Math.max(30, Math.min(99, resilience)),
      hasLegume,
      isMonoculture,
      farmerFeedback,
      farmerMood,
      farmerStatus,
      c1, c2, c3
    };
  }, [customSequence, mission.crops, lang]);

  const handleNext = () => {
    onDecisionSubmit?.(null, customSequence);
  };

  const handleResetSequence = () => {
    setCustomSequence({
      season1: mission.crops[0]?.id || "wheat",
      season2: mission.crops[1]?.id || "legumes_faba",
      season3: mission.crops[2]?.id || "corn",
    });
  };

  return (
    <div className="w-full max-w-[1650px] mx-auto px-3 sm:px-6 py-2 flex flex-col gap-3 flex-1 min-h-0 overflow-hidden">
      
      {/* 1. Stepper Header at Top */}
      <div className="shrink-0">
        <StepperHeader currentStep={2} />
      </div>

      {/* 2. Main 2-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-0 items-stretch overflow-hidden">
        
        {/* 🛰️ Left Panel: NASA Earth Telemetry & Field Ground Truth (4 Cols) */}
        <DecisionTelemetryPanel mission={mission} />

        {/* 🌾 Right Panel: Interactive Crop Rotation Game Matrix (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-2.5 min-h-0 overflow-hidden">
          
          {/* Dynamic Farmer Reaction & Clue Strip */}
          <div className={`p-2.5 px-3.5 bg-[#06142e]/95 border rounded-xl flex items-center gap-3 shrink-0 shadow-md transition-all ${
            customMetrics.farmerMood === 'worried' 
              ? 'border-red-500/60 shadow-red-500/20' 
              : customMetrics.farmerMood === 'thinking' 
              ? 'border-amber-500/60 shadow-amber-500/20' 
              : 'border-cyan-400/50 shadow-cyan-500/20'
          }`}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border-2 border-cyan-400/60 shrink-0 bg-black/40 shadow">
              <img 
                src={customMetrics.farmerMood === 'happy' ? (mission.farmerHappyImage || mission.farmerImage) : (mission.farmerImage || "/images/farmer_egypt.jpg")} 
                alt="Farmer" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs sm:text-sm font-black text-cyan-300">{lang === 'ar' ? mission.farmerNameAr : mission.farmerNameEn}</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                  customMetrics.farmerMood === 'happy' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' :
                  customMetrics.farmerMood === 'thinking' ? 'bg-amber-950 text-amber-300 border-amber-500/40' :
                  'bg-red-950 text-red-300 border-red-500/40'
                }`}>
                  {customMetrics.farmerStatus}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 truncate italic leading-relaxed">
                "{customMetrics.farmerFeedback}"
              </p>
            </div>

            <button
              onClick={handleResetSequence}
              title={lang === 'ar' ? decisionScreenLabels.resetTooltipAr : decisionScreenLabels.resetTooltipEn}
              className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/10 transition-all cursor-pointer shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* MAIN INTERACTIVE WORKSPACE CARD */}
          <div className="p-3.5 bg-[#06142e]/95 border border-cyan-500/40 flex-1 min-h-0 flex flex-col justify-between shadow-2xl rounded-2xl overflow-y-auto custom-scrollbar gap-3">
            
            {/* Header: Challenge Title & Real-Time Score Meter */}
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20 shrink-0 gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  {lang === 'ar' ? decisionScreenLabels.builderTitleAr : decisionScreenLabels.builderTitleEn}
                </h3>
                <p className="text-xs text-cyan-300 font-bold">
                  {lang === 'ar' ? decisionScreenLabels.builderSubtitleAr : decisionScreenLabels.builderSubtitleEn}
                </p>
              </div>

              {/* Dynamic Live Score Badge */}
              <div className="flex items-center gap-2 bg-[#040e21] px-3.5 py-1.5 border border-cyan-500/40 rounded-xl shadow-lg">
                <Award className={`w-4 h-4 ${customMetrics.resilience >= 80 ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span className="text-xs text-slate-300 font-bold">
                  {lang === 'ar' ? decisionScreenLabels.performanceIndexAr : decisionScreenLabels.performanceIndexEn}
                </span>
                <span className={`text-sm sm:text-base font-black font-['Orbitron',sans-serif] ${
                  customMetrics.resilience >= 85 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' :
                  customMetrics.resilience >= 70 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {customMetrics.resilience}/100
                </span>
              </div>
            </div>

            {/* 3 INTERACTIVE SEASON COLUMNS (CLICKABLE CARDS) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* SEASON 1: WINTER */}
              <SeasonColumn
                seasonNumber={1}
                seasonTitle={lang === 'ar' ? decisionSeasonHeaders[0].titleAr : decisionSeasonHeaders[0].titleEn}
                seasonEmoji="❄️"
                colorScheme="cyan"
                crops={mission.crops}
                selectedCropId={customSequence.season1}
                onSelectCrop={(cropId) => setCustomSequence(prev => ({ ...prev, season1: cropId }))}
                selectedCropInsight={customMetrics.c1}
              />

              {/* SEASON 2: SUMMER / N-FIXING */}
              <SeasonColumn
                seasonNumber={2}
                seasonTitle={lang === 'ar' ? decisionSeasonHeaders[1].titleAr : decisionSeasonHeaders[1].titleEn}
                seasonEmoji="☀️"
                colorScheme="emerald"
                crops={mission.crops}
                selectedCropId={customSequence.season2}
                onSelectCrop={(cropId) => setCustomSequence(prev => ({ ...prev, season2: cropId }))}
                selectedCropInsight={customMetrics.c2}
              />

              {/* SEASON 3: ROTATION / BREAK PESTS */}
              <SeasonColumn
                seasonNumber={3}
                seasonTitle={lang === 'ar' ? decisionSeasonHeaders[2].titleAr : decisionSeasonHeaders[2].titleEn}
                seasonEmoji="🍂"
                colorScheme="amber"
                crops={mission.crops}
                selectedCropId={customSequence.season3}
                onSelectCrop={(cropId) => setCustomSequence(prev => ({ ...prev, season3: cropId }))}
                selectedCropInsight={customMetrics.c3}
              />

            </div>

            {/* LIVE DYNAMIC IMPACT GAUGES */}
            <DecisionGauges customMetrics={customMetrics} />

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-2.5 border-t border-white/10 shrink-0 gap-3 mt-auto">
              <button
                onClick={onBack}
                className="py-2.5 px-5 bg-white/5 hover:bg-white/10 text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all border border-cyan-500/25 rounded-xl cursor-pointer"
              >
                {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{t.back}</span>
              </button>

              <button
                onClick={handleNext}
                className="py-2.5 px-7 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-xl shadow-blue-500/40 transition-all hover:scale-[1.02] cursor-pointer rounded-xl"
              >
                <span>{t.nextStep}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
