'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Check, MapPinned, Satellite, Sprout, Scale, ShieldAlert, CircleHelp, ClipboardCheck, ChevronRight, ChevronLeft } from 'lucide-react';
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

export default function MissionTerminal({ onOpenGame, onWorkflowStepChange, initialStep = 0 }) {
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
    navigateStep(6);
  };

  const focusForStep = step === 2 ? 'inputs' : step === 3 ? 'comparison' : step === 4 ? 'tradeoffs' : step === 5 ? 'uncertainty' : null;
  const canAdvance = step < 5 || (step === 5 && completed.decision);
  const PreviousIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;
  const navigateStep = (nextStep) => {
    const resolvedStep = typeof nextStep === 'function' ? nextStep(step) : nextStep;
    setStep(resolvedStep);
    onWorkflowStepChange?.(resolvedStep);
  };

  return <div dir={isRtl ? 'rtl' : 'ltr'} className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#040915] text-slate-100">
    <header className="shrink-0 border-b border-cyan-900/60 bg-[#061327] px-3 py-2.5 sm:px-5">
      <div className="mb-2.5 min-w-0"><h2 className="type-card-title truncate font-black text-white">{ar ? 'مركز مهمة تكيّف المزارع' : 'Farm Adaptation Mission Terminal'}</h2></div>
      <nav aria-label={ar ? 'خطوات سير العمل' : 'Workflow steps'} className="hidden gap-1 overflow-x-auto pb-1 sm:flex">{FLOW.map(({ id, icon: Icon, label, labelAr }) => {
        const active = id === step;
        const done = id === 0 ? completed.farm : id === 1 ? completed.environment : id < 4 ? completed.rotation : id === 6 ? completed.decision : completed.rotation;
        const disabled = id === 6 && !completed.decision;
        return <button key={id} type="button" disabled={disabled} aria-current={active ? 'step' : undefined} onClick={() => navigateStep(id)} className={`flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border px-2.5 text-[13px] font-semibold transition-colors ${active ? 'border-cyan-400 bg-cyan-950/60 text-white' : 'border-white/5 bg-white/[.03] text-slate-300 hover:text-white'} disabled:cursor-not-allowed disabled:opacity-40`}><Icon className="h-4 w-4" />{done && !active && <Check className="h-3.5 w-3.5 text-emerald-400" />}<span>{ar ? labelAr : label}</span></button>;
      })}</nav>
      <div className="sm:hidden">
        <div className="mb-1 flex items-center justify-between gap-2">
          <button type="button" disabled={step === 0} onClick={() => navigateStep((value) => Math.max(0, value - 1))} className="app-nav-button flex w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-200 disabled:opacity-40" aria-label={ar ? 'الخطوة السابقة' : 'Previous workflow step'}><PreviousIcon aria-hidden="true" className="h-5 w-5" /></button>
          <label className="sr-only" htmlFor="mission-workflow-step">{ar ? 'اختر خطوة سير العمل' : 'Choose workflow step'}</label>
          <select id="mission-workflow-step" value={step} onChange={(event) => navigateStep(Number(event.target.value))} className="min-h-11 min-w-0 flex-1 rounded-xl border border-cyan-700/50 bg-[#081a32] px-3 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">
            {FLOW.map(({ id, label, labelAr }) => <option key={id} value={id} disabled={id === 6 && !completed.decision}>{ar ? labelAr : label}</option>)}
          </select>
          <button type="button" disabled={!canAdvance} onClick={() => navigateStep((value) => Math.min(FLOW.length - 1, value + 1))} className="app-nav-button flex w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-200 disabled:opacity-40" aria-label={ar ? 'الخطوة التالية' : 'Next workflow step'}><NextIcon aria-hidden="true" className="h-5 w-5" /></button>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-700" role="progressbar" aria-label={ar ? 'تقدم سير العمل' : 'Workflow progress'} aria-valuemin={1} aria-valuemax={FLOW.length} aria-valuenow={step + 1}><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-[width]" style={{ width: `${((step + 1) / FLOW.length) * 100}%` }} /></div>
          <span className="shrink-0 text-xs font-semibold text-slate-300">{ar ? `الخطوة ${step + 1} من ${FLOW.length}` : `Step ${step + 1} of ${FLOW.length}`}</span>
        </div>
      </div>
    </header>

    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {(activeView === 'farm' || activeView === 'environment') && <FarmProStudio onOpenRotationBuilder={() => navigateStep(2)} focusEnvironmental={activeView === 'environment'} />}
      {(activeView === 'inputs' || activeView === 'comparison' || activeView === 'review') && <RotationStrategyWorkbench focusSection={focusForStep} onDecisionSubmit={handleDecision} />}
      {activeView === 'summary' && evaluation && <ResultsDashboardScreen mission={mission} playerChoice={selectedStrategyId} playerEvaluation={evaluation} onNextMission={onOpenGame} nextLabel={ar ? 'العودة إلى المهام التعليمية' : 'Open learning missions'} />}
    </div>
    <footer className="hidden shrink-0 justify-end gap-2 border-t border-white/5 bg-[#030712] px-3 py-1.5 text-xs text-slate-400 sm:flex sm:px-5"><span>{ar ? `الخطوة ${step + 1} من ${FLOW.length}` : `Step ${step + 1} of ${FLOW.length}`}</span></footer>
  </div>;
}
