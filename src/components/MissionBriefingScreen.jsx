'use client';

import React from 'react';
import StepperHeader from './StepperHeader';
import BriefingTelemetrySidebar from './briefing/BriefingTelemetrySidebar';
import BriefingDialogue from './briefing/BriefingDialogue';
import BriefingStoryPanel from './briefing/BriefingStoryPanel';

export default function MissionBriefingScreen({ mission, onBack, onContinue }) {
  const [mobileTab, setMobileTab] = React.useState('dialogue'); // 'dialogue' | 'telemetry' | 'story'

  return (
    <div className="w-full max-w-[1650px] mx-auto px-2 sm:px-6 py-1.5 sm:py-2 flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto lg:overflow-hidden">

      {/* 1. Stepper Header at Top */}
      <div className="shrink-0">
        <StepperHeader currentStep={1} />
      </div>

      {/* Mobile Tab Switcher (Visible on < lg screens) */}
      <div className="lg:hidden p-1.5 bg-[#061633]/95 border border-cyan-500/30 rounded-xl flex items-center gap-1 shrink-0 overflow-x-auto no-scrollbar">
        {[
          { id: 'dialogue', label: '💬 المحادثة والتشخيص' },
          { id: 'telemetry', label: '🛰️ بيانات ناسا' },
          { id: 'story', label: '📋 قصة المهمة والأهداف' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMobileTab(tab.id)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
              mobileTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. Main 3-Column Content Layout (Desktop) / Tab-Activated on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0 items-stretch overflow-y-auto lg:overflow-hidden">

        {/* 🛰️ PANEL 1: NASA Current Telemetry (3 Cols) */}
        <div className={`lg:col-span-3 flex flex-col min-h-0 ${mobileTab === 'telemetry' ? 'block' : 'hidden lg:flex'}`}>
          <BriefingTelemetrySidebar mission={mission} />
        </div>

        {/* 🏞️ PANEL 2: Main Briefing & Interactive Two-Way Chat (6 Cols) */}
        <div className={`lg:col-span-6 flex flex-col min-h-0 ${mobileTab === 'dialogue' ? 'flex flex-1 min-h-0' : 'hidden lg:flex'}`}>
          <BriefingDialogue mission={mission} onContinue={onContinue} />
        </div>

        {/* 👨‍🌾 PANEL 3: Story, Perspectives & Objectives (3 Cols) */}
        <div className={`lg:col-span-3 flex flex-col min-h-0 ${mobileTab === 'story' ? 'block' : 'hidden lg:flex'}`}>
          <BriefingStoryPanel mission={mission} onBack={onBack} />
        </div>

      </div>

    </div>
  );
}
