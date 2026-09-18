'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import StepperHeader from './StepperHeader';
import ResultsSidebar, { RESULTS_NAV_TABS } from './results/ResultsSidebar';
import ResultsEvaluationPanel from './results/ResultsEvaluationPanel';
import OverviewTab from './results/tabs/OverviewTab';
import MetricsTab from './results/tabs/MetricsTab';
import ImpactTab from './results/tabs/ImpactTab';
import NasaDataTab from './results/tabs/NasaDataTab';
import LessonsTab from './results/tabs/LessonsTab';
import { ratingTiers } from '../data/decisionFeedbackData';
import { ChevronRight, ChevronLeft, ArrowRight, ArrowLeft, Globe } from 'lucide-react';

export default function ResultsDashboardScreen({ 
  mission, 
  playerChoice, 
  playerCustomSequence, 
  onBackToMap, 
  onNextMission 
}) {
  const { t, lang, isRtl } = useLanguage();
  const [activeSideTab, setActiveSideTab] = useState('overview');

  // Compute completely DYNAMIC Results & Certification Grade based on player's chosen sequence
  const dynamicResults = useMemo(() => {
    const c1 = mission.crops.find(c => c.id === playerCustomSequence?.season1) || mission.crops[0];
    const c2 = mission.crops.find(c => c.id === playerCustomSequence?.season2) || mission.crops[1];
    const c3 = mission.crops.find(c => c.id === playerCustomSequence?.season3) || mission.crops[2];

    const hasLegume = [c1.id, c2.id, c3.id].some(id => 
      id.includes('legume') || id.includes('faba') || id.includes('soy') || id.includes('chickpea')
    );
    const hasSorghumOrResilient = [c1.id, c2.id, c3.id].some(id => 
      id.includes('sorghum') || id.includes('millet') || id.includes('brachiaria')
    );
    const uniqueIds = new Set([c1.id, c2.id, c3.id]);
    const isStrictMonoculture = uniqueIds.size === 1;
    const isPartialMonoculture = uniqueIds.size === 2;

    // Dynamic scoring formula
    let score = 75;
    let waterSavedPercent = 25;
    let yieldChangePercent = 22;
    let soilHealthChangePercent = 20;
    let climateRiskChangePercent = -20;

    if (hasLegume) {
      score += 15;
      soilHealthChangePercent += 18;
      waterSavedPercent += 8;
      yieldChangePercent += 6;
    } else {
      score -= 10;
      soilHealthChangePercent -= 15;
    }

    if (hasSorghumOrResilient) {
      score += 8;
      waterSavedPercent += 12;
      climateRiskChangePercent -= 8;
    }

    if (isStrictMonoculture) {
      score = 42;
      waterSavedPercent = -18;
      yieldChangePercent = -15;
      soilHealthChangePercent = -35;
      climateRiskChangePercent = 35;
    } else if (isPartialMonoculture) {
      score -= 12;
      waterSavedPercent -= 8;
      yieldChangePercent -= 5;
    }

    score = Math.max(30, Math.min(99, score));

    // Determine Dynamic Grade Letter & Evaluation Rating from Data Tier
    let tier = ratingTiers.tierAPlus;
    if (score >= 90) {
      tier = ratingTiers.tierAPlus;
    } else if (score >= 80) {
      tier = ratingTiers.tierA;
    } else if (score >= 70) {
      tier = ratingTiers.tierB;
    } else if (score >= 60) {
      tier = ratingTiers.tierC;
    } else {
      tier = ratingTiers.tierF;
    }

    const grade = tier.grade;
    const ratingAr = tier.ratingAr;
    const ratingEn = tier.ratingEn;
    const gradeColor = tier.gradeColor;

    // Dynamic Checklist based on choices
    const checks = [
      { text: t.gradeCheck1, passed: score >= 65 },
      { text: t.gradeCheck2, passed: hasLegume },
      { text: t.gradeCheck3, passed: waterSavedPercent >= 15 },
      { text: t.gradeCheck4, passed: !isStrictMonoculture },
    ];

    const cropYieldChange = yieldChangePercent >= 0 ? `+${yieldChangePercent}%` : `${yieldChangePercent}%`;
    const waterSavedChange = waterSavedPercent >= 0 ? `-${waterSavedPercent}%` : `+${Math.abs(waterSavedPercent)}%`;
    const soilHealthChange = soilHealthChangePercent >= 0 ? `+${soilHealthChangePercent}%` : `${soilHealthChangePercent}%`;
    const climateRiskChange = climateRiskChangePercent <= 0 ? `${climateRiskChangePercent}%` : `+${climateRiskChangePercent}%`;

    return {
      score,
      grade,
      ratingAr,
      ratingEn,
      gradeColor,
      checks,
      hasLegume,
      isStrictMonoculture,
      isPartialMonoculture,
      cropYieldChange,
      waterSavedChange,
      soilHealthChange,
      climateRiskChange,
      yieldChangePercent,
      waterSavedPercent,
      soilHealthChangePercent,
      climateRiskChangePercent,
      c1, c2, c3,
      sequenceNameAr: `${c1.nameAr} ➔ ${c2.nameAr} ➔ ${c3.nameAr}`,
      sequenceNameEn: `${c1.nameEn} ➔ ${c2.nameEn} ➔ ${c3.nameEn}`,
    };
  }, [mission.crops, playerCustomSequence, t]);

  // Current active tab index for step-by-step navigation
  const currentIndex = RESULTS_NAV_TABS.findIndex(tab => tab.id === activeSideTab);
  const prevTab = currentIndex > 0 ? RESULTS_NAV_TABS[currentIndex - 1] : null;
  const nextTab = currentIndex < RESULTS_NAV_TABS.length - 1 ? RESULTS_NAV_TABS[currentIndex + 1] : null;

  const handlePrevPage = () => {
    if (prevTab) setActiveSideTab(prevTab.id);
  };

  const handleNextPage = () => {
    if (nextTab) setActiveSideTab(nextTab.id);
  };

  return (
    <div className="w-full max-w-[1650px] mx-auto px-2 sm:px-6 py-1.5 sm:py-2 flex flex-col gap-2.5 flex-1 min-h-0 overflow-y-auto lg:overflow-hidden">
      
      {/* 1. Stepper Header at Top */}
      <div className="shrink-0">
        <StepperHeader currentStep={3} />
      </div>

      {/* 🧭 Navigation Pages on Mobile & Sidebar on Desktop */}
      <ResultsSidebar 
        mission={mission}
        activeSideTab={activeSideTab}
        setActiveSideTab={setActiveSideTab}
      />

      {/* 2. Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0 items-stretch overflow-y-auto lg:overflow-hidden">
        
        {/* 📊 Center Dynamic Content Panel */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col justify-between gap-3 min-h-0 overflow-y-auto custom-scrollbar">
          
          {/* Active Tab Page Content */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            {activeSideTab === 'overview' && (
              <OverviewTab mission={mission} dynamicResults={dynamicResults} />
            )}

            {activeSideTab === 'results' && (
              <MetricsTab dynamicResults={dynamicResults} />
            )}

            {activeSideTab === 'impact' && (
              <ImpactTab mission={mission} />
            )}

            {activeSideTab === 'nasa' && (
              <NasaDataTab />
            )}

            {activeSideTab === 'lessons' && (
              <LessonsTab />
            )}

            {activeSideTab === 'evaluation' && (
              <div className="flex flex-col gap-3">
                <ResultsEvaluationPanel
                  mission={mission}
                  dynamicResults={dynamicResults}
                  onBackToMap={onBackToMap}
                />
              </div>
            )}
          </div>

          {/* 📄 Page-by-Page Navigation Footer */}
          <div className="p-2.5 bg-[#061633]/95 border border-cyan-500/30 rounded-xl flex items-center justify-between gap-2 shrink-0 shadow-lg backdrop-blur-md">
            {/* Previous Page Button */}
            {prevTab ? (
              <button
                onClick={handlePrevPage}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-black border border-slate-600/40 transition-all active:scale-95 cursor-pointer"
              >
                {isRtl ? <ChevronRight className="w-4 h-4 text-cyan-400" /> : <ChevronLeft className="w-4 h-4 text-cyan-400" />}
                <span className="hidden xs:inline">{t[prevTab.key]}</span>
                <span className="xs:hidden">{t.prevPage}</span>
              </button>
            ) : (
              <button
                onClick={onBackToMap}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-800/50 text-slate-400 text-xs font-bold border border-slate-700/30 transition-all hover:text-white cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px]">{t.backToMap}</span>
              </button>
            )}

            {/* Page Dots & Numbers */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-mono text-cyan-300 font-bold hidden sm:inline">
                {t.pageIndicator} {currentIndex + 1} {t.ofPages} {RESULTS_NAV_TABS.length}
              </span>
              <div className="flex items-center gap-1">
                {RESULTS_NAV_TABS.map((tab, idx) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSideTab(tab.id)}
                    title={t[tab.key]}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeSideTab === tab.id
                        ? 'w-6 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                        : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Next Page Button or Return to Map on Last Page */}
            {nextTab ? (
              <button
                onClick={handleNextPage}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-black border border-cyan-400/40 shadow-md shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
              >
                <span className="hidden xs:inline">{t[nextTab.key]}</span>
                <span className="xs:hidden">{t.nextPage}</span>
                {isRtl ? <ChevronLeft className="w-4 h-4 text-white" /> : <ChevronRight className="w-4 h-4 text-white" />}
              </button>
            ) : (
              <button
                onClick={onBackToMap}
                className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black border border-emerald-400/40 shadow-md shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
              >
                <span>{t.backToMap}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            )}
          </div>

        </div>

        {/* 🏆 Right Panel: Mission Evaluation & Grade Badge (Desktop Only lg:flex) */}
        <div className="hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col min-h-0">
          <ResultsEvaluationPanel
            mission={mission}
            dynamicResults={dynamicResults}
            onBackToMap={onBackToMap}
          />
        </div>

      </div>

    </div>
  );
}
