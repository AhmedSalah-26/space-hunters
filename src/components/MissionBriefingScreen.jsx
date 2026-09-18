'use client';

import React from 'react';
import StepperHeader from './StepperHeader';
import BriefingTelemetrySidebar from './briefing/BriefingTelemetrySidebar';
import BriefingDialogue from './briefing/BriefingDialogue';
import BriefingStoryPanel from './briefing/BriefingStoryPanel';

export default function MissionBriefingScreen({ mission, onBack, onContinue }) {
  return (
    <div className="w-full max-w-[1650px] mx-auto px-3 sm:px-6 py-2 flex flex-col gap-2.5 flex-1 min-h-0 overflow-hidden">

      {/* 1. Stepper Header at Top */}
      <div className="shrink-0">
        <StepperHeader currentStep={1} />
      </div>

      {/* 2. Main 3-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0 items-stretch overflow-hidden">

        {/* 🛰️ PANEL 1: NASA Current Telemetry (3 Cols) */}
        <BriefingTelemetrySidebar mission={mission} />

        {/* 🏞️ PANEL 2: Main Briefing & Interactive Two-Way Chat (6 Cols) */}
        <BriefingDialogue mission={mission} onContinue={onContinue} />

        {/* 👨‍🌾 PANEL 3: Story, Perspectives & Objectives (3 Cols) */}
        <BriefingStoryPanel mission={mission} onBack={onBack} />

      </div>

    </div>
  );
}
