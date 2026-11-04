'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Check, MapPinned, Satellite, Sprout, Scale, ShieldAlert, CircleHelp, ClipboardCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWorkingSession } from '../context/WorkingSessionContext';
import FarmProStudio from './farmPro/FarmProStudio';
import RotationStrategyWorkbench from './rotation/RotationStrategyWorkbench';
import ResultsDashboardScreen from './ResultsDashboardScreen';

const FLOW = [
  { id: 0, icon: MapPinned, label: 'Farm location & area', labelAr: 'موقع المزرعة ومساحتها', view: 'farm' },
  { id: 1, icon: Satellite, label: 'Environmental overview', labelAr: 'نظرة بيئية', view: 'environment' },
  { id: 2, icon: Sprout, label: 'Farm & crop information', labelAr: 'معلومات المزرعة والمحاصيل', view: 'inputs' },
  { id: 3, icon: Scale, label: 'Compare rotations', labelAr: 'مقارنة الدورات', view: 'comparison' },
  { id: 4, icon: ShieldAlert, label: 'Risks & trade-offs', labelAr: 'المخاطر والمقايضات', view: 'review' },
  { id: 5, icon: CircleHelp, label: 'Uncertainty & limits', labelAr: 'عدم اليقين والقيود', view: 'review' },
  { id: 6, icon: ClipboardCheck, label: 'Decision summary', labelAr: 'ملخص القرار', view: 'summary' },
];

export default function MissionTerminal({ onBackHome, onOpenGame, initialStep = 0 }) {
  const { lang, isRtl } = useLanguage();
  const { session, updateSession } = useWorkingSession();
  const ar = lang === 'ar';
  const [step, setStep] = useState(initialStep);
  const [decision, setDecision] = useState(null);
  const evaluation = session.analysisResults?.rotationEvaluation || decision?.evaluation || null;
  const selectedStrategyId = session.analysisResults?.selectedStrategyId || decision?.strategyId || evaluation?.baselineId;
  const mission = {
    countryEn: session.farmLocation?.label || 'Selected farm',
    countryAr: session.farmLocation?.label || 'المزرعة المحددة',
    code: 'LOCAL',
  };

  useEffect(() => { setStep(initialStep); }, [initialStep]);
  useEffect(() => {
    if (step === 1) document.getElementById('environmental-analysis')?.scrollIntoView({ block: 'start' });
    if (step === 2) document.getElementById('rotation-inputs')?.scrollIntoView({ block: 'start' });
    if (step === 3) document.getElementById('rotation-comparison')?.scrollIntoView({ block: 'start' });
    if (step === 4) document.getElementById('rotation-tradeoffs')?.scrollIntoView({ block: 'start' });
    if (step === 5) document.getElementById('rotation-uncertainty')?.scrollIntoView({ block: 'start' });
  }, [step]);

  const activeView = FLOW[step]?.view || 'farm';
  const completed = useMemo(() => ({
    farm: Boolean(session.farmLocation),
    environment: Boolean(session.environmentalObservations?.length),
    rotation: Boolean(evaluation?.strategies?.length === 3),
    decision: Boolean(decision || session.analysisResults?.selectedStrategyId),
  }), [session.farmLocation, session.environmentalObservations, evaluation, decision, session.analysisResults]);

  const handleDecision = (strategyId, sequence, nextEvaluation) => {
    setDecision({ strategyId, sequence, evaluation: nextEvaluation });
    updateSession({ analysisResults: { ...(session.analysisResults || {}), rotationEvaluation: nextEvaluation, selectedStrategyId: strategyId, selectedSequence: sequence } });
    setStep(6);
  };

  const focusForStep = step === 2 ? 'inputs' : step === 3 ? 'comparison' : step === 4 ? 'tradeoffs' : step === 5 ? 'uncertainty' : null;

  return <div dir={isRtl ? 'rtl' : 'ltr'} className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#040915] text-slate-100">
    <header className="shrink-0 border-b border-cyan-900/60 bg-[#061327] px-3 py-2 sm:px-5">
      <div className="mb-2 flex items-center justify-between gap-3"><div><div className="text-[9px] font-bold uppercase tracking-[.18em] text-cyan-300">Space Hunters · Field Shift</div><h1 className="text-sm font-black sm:text-base">{ar ? 'مركز مهمة تكيّف المزارع' : 'Farm Adaptation Mission Terminal'}</h1></div><div className="flex gap-2"><button type="button" onClick={onBackHome} className="rounded-lg border border-slate-600 px-2.5 py-1.5 text-[10px]">{ar ? 'الرئيسية' : 'Home'}</button><button type="button" onClick={onOpenGame} className="rounded-lg border border-cyan-700/60 px-2.5 py-1.5 text-[10px] text-cyan-200">{ar ? 'المهام التعليمية' : 'Learning missions'}</button></div></div>
      <nav aria-label={ar ? 'خطوات سير العمل' : 'Workflow steps'} className="flex gap-1 overflow-x-auto pb-1">{FLOW.map(({ id, icon: Icon, label, labelAr, view }) => {
        const active = id === step;
        const done = id === 0 ? completed.farm : id === 1 ? completed.environment : id < 4 ? completed.rotation : id === 6 ? completed.decision : completed.rotation;
        const disabled = id === 6 && !completed.decision;
        return <button key={id} type="button" disabled={disabled} aria-current={active ? 'step' : undefined} onClick={() => setStep(id)} className={`flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1.5 text-[9px] transition-colors sm:text-[10px] ${active ? 'border-cyan-400 bg-cyan-950/60 text-white' : 'border-white/5 bg-white/[.03] text-slate-400 hover:text-white'} disabled:cursor-not-allowed disabled:opacity-40`}><Icon className="h-3 w-3" />{done && !active && <Check className="h-3 w-3 text-emerald-400" />}<span>{ar ? labelAr : label}</span></button>;
      })}</nav>
    </header>

    <div className="min-h-0 flex-1 overflow-hidden">
      {(activeView === 'farm' || activeView === 'environment') && <FarmProStudio onBackToHome={onBackHome} onOpenGame={onOpenGame} onOpenRotationBuilder={() => setStep(2)} focusEnvironmental={activeView === 'environment'} />}
      {(activeView === 'inputs' || activeView === 'comparison' || activeView === 'review') && <RotationStrategyWorkbench focusSection={focusForStep} onBack={() => setStep(0)} onDecisionSubmit={handleDecision} />}
      {activeView === 'summary' && evaluation && <ResultsDashboardScreen mission={mission} playerChoice={selectedStrategyId} playerEvaluation={evaluation} onBackToMap={() => setStep(4)} onNextMission={onOpenGame} backLabel={ar ? 'المخاطر والمقايضات' : 'Risks & trade-offs'} nextLabel={ar ? 'العودة إلى المهام التعليمية' : 'Open learning missions'} />}
    </div>
    <footer className="flex shrink-0 justify-between border-t border-white/5 bg-[#030712] px-3 py-1 text-[8px] text-slate-500 sm:px-5"><span>{ar ? 'جلسة مؤقتة على هذا الجهاز · لا يلزم تسجيل' : 'Temporary session on this device · no sign-in required'}</span><span>{ar ? `الخطوة ${step + 1} من ${FLOW.length}` : `Step ${step + 1} of ${FLOW.length}`}</span></footer>
  </div>;
}
