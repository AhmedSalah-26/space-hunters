'use client';

import React from 'react';
import StepperHeader from './StepperHeader';
import BriefingTelemetrySidebar from './briefing/BriefingTelemetrySidebar';
import BriefingDialogue from './briefing/BriefingDialogue';
import BriefingStoryPanel from './briefing/BriefingStoryPanel';
import { useLanguage } from '../context/LanguageContext';

export default function MissionBriefingScreen({ mission, onContinue, onOpenFarmData }) {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = React.useState('dialogue');

  return (
    <div className="w-full max-w-[1650px] mx-auto px-2 sm:px-6 py-2 flex flex-col gap-2 flex-1 h-full min-h-0 overflow-y-auto lg:overflow-hidden">

      {/* 1. Stepper Header at Top */}
      <div className="shrink-0">
        <StepperHeader currentStep={1} />
      </div>

      <p role="note" className="shrink-0 rounded-lg border border-amber-500/30 bg-amber-950/30 px-2 py-1 text-[10px] text-amber-100">
        {lang === 'ar' ? 'بيانات المهمة والحوار سيناريوهات تعليمية توضيحية، وليست قياسات NASA أو إرشادات صادرة عنها.' : 'Mission metrics and dialogue are illustrative learning scenarios, not NASA measurements or NASA-issued guidance.'}
      </p>

      {/* One consistent panel switcher keeps the briefing focused at every size. */}
      <div role="tablist" aria-label={lang === 'ar' ? 'محتوى الإحاطة' : 'Briefing content'} className="p-1 bg-[#061633]/95 border border-white/10 rounded-xl grid grid-cols-3 gap-1 shrink-0">
        {[
          { id: 'dialogue', label: lang === 'ar' ? '💬 المحادثة' : '💬 Dialogue' },
          { id: 'telemetry', label: lang === 'ar' ? '🛰️ مرجع المهمة' : '🛰️ Scenario data' },
          { id: 'story', label: lang === 'ar' ? '📋 القصة' : '📋 Story' },
        ].map((tab, index, tabs) => (
          <button
            key={tab.id}
            role="tab"
            id={`briefing-tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`briefing-panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
              event.preventDefault();
              const direction = event.key === 'ArrowRight' ? 1 : -1;
              const nextTab = tabs[(index + direction + tabs.length) % tabs.length];
              setActiveTab(nextTab.id);
              document.getElementById(`briefing-tab-${nextTab.id}`)?.focus();
            }}
            onClick={() => setActiveTab(tab.id)}
            className={`py-1.5 px-1 rounded-lg text-[10.5px] font-black whitespace-nowrap transition-all cursor-pointer text-center ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeTab === 'dialogue' && <section role="tabpanel" id="briefing-panel-dialogue" aria-labelledby="briefing-tab-dialogue" className="mx-auto flex min-h-full w-full max-w-4xl flex-col"><BriefingDialogue mission={mission} onContinue={onContinue} /></section>}
        {activeTab === 'telemetry' && <section role="tabpanel" id="briefing-panel-telemetry" aria-labelledby="briefing-tab-telemetry" className="mx-auto w-full max-w-4xl"><BriefingTelemetrySidebar mission={mission} onOpenFarmData={onOpenFarmData} /></section>}
        {activeTab === 'story' && <section role="tabpanel" id="briefing-panel-story" aria-labelledby="briefing-tab-story" className="mx-auto w-full max-w-4xl"><BriefingStoryPanel mission={mission} /></section>}
      </div>

    </div>
  );
}
