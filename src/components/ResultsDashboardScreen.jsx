'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import StepperHeader from './StepperHeader';
import ResultsSidebar from './results/ResultsSidebar';
import ResultsEvaluationPanel from './results/ResultsEvaluationPanel';
import OverviewTab from './results/tabs/OverviewTab';
import MetricsTab from './results/tabs/MetricsTab';
import ImpactTab from './results/tabs/ImpactTab';
import NasaDataTab from './results/tabs/NasaDataTab';
import LessonsTab from './results/tabs/LessonsTab';
import { ratingTiers } from '../data/decisionFeedbackData';

export default function ResultsDashboardScreen({ 
  mission, 
  playerChoice, 
  playerCustomSequence, 
  onBackToMap, 
  onNextMission 
}) {
  const { t, lang } = useLanguage();
  const [activeSideTab, setActiveSideTab] = useState('results');

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

  return (
    <div className="w-full max-w-[1650px] mx-auto px-2 sm:px-6 py-1.5 sm:py-2 flex flex-col gap-2.5 flex-1 min-h-0 overflow-y-auto lg:overflow-hidden">
      
      {/* 1. Stepper Header at Top */}
      <div className="shrink-0">
        <StepperHeader currentStep={3} />
      </div>

      {/* 🧭 Navigation Tabs on Mobile & Sidebar on Desktop */}
      <ResultsSidebar 
        mission={mission}
        activeSideTab={activeSideTab}
        setActiveSideTab={setActiveSideTab}
      />

      {/* 2. Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0 items-stretch overflow-y-auto lg:overflow-hidden">
        
        {/* 📊 Center Dynamic Content Panel (6 Cols on desktop, full width on mobile) */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-2.5 min-h-0 overflow-y-auto custom-scrollbar">
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
        </div>

        {/* 🏆 Right Panel: Mission Evaluation & Grade Badge (3 Cols on desktop) */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col min-h-0">
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
