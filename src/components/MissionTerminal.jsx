'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Check, MapPinned, Satellite, Sprout, Scale, ShieldAlert, CircleHelp, ClipboardCheck, List } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWorkingSession } from '../context/WorkingSessionContext';
import FarmProStudio from './farmPro/FarmProStudio';
import RotationStrategyWorkbench from './rotation/RotationStrategyWorkbench';
import ResultsDashboardScreen from './ResultsDashboardScreen';

const FLOW = [
  { id: 0, title: 'Farm Location & Area', titleAr: 'موقع المزرعة ومساحتها', icon: MapPinned },
  { id: 1, title: 'Environmental Overview', titleAr: 'نظرة بيئية', icon: Satellite },
  { id: 2, title: 'Farm Information & Crops', titleAr: 'معلومات المزرعة والمحاصيل', icon: Sprout },
  { id: 3, title: 'Rotation Strategy Comparison', titleAr: 'مقارنة استراتيجيات الدورة', icon: Scale },
  { id: 4, title: 'Risks & Trade-offs', titleAr: 'المخاطر والمقايضات', icon: ShieldAlert },
  { id: 5, title: 'Uncertainty & Limitations', titleAr: 'عدم اليقين والقيود', icon: CircleHelp },
  { id: 6, title: 'Decision Summary', titleAr: 'ملخص القرار', icon: ClipboardCheck },
];

export default function MissionTerminal({ onOpenGame, onWorkflowStepChange, initialStep = 0 }) {
  const { lang, isRtl } = useLanguage();
  const { session, updateSession } = useWorkingSession();
  const ar = lang === 'ar';
  const [step, setStep] = useState(initialStep);
  const [stepsOpen, setStepsOpen] = useState(false);
  const [decision, setDecision] = useState(null);
  const contentRef = useRef(null);
  const evaluation = session.analysisResults?.rotationEvaluation || decision?.evaluation || null;
  const selectedStrategyId = session.analysisResults?.selectedStrategyId || decision?.strategyId || evaluation?.baselineId;
  const mission = { countryEn: session.farmLocation?.label || 'Selected farm', countryAr: session.farmLocation?.label || 'المزرعة المحددة', code: 'LOCAL' };
  const completed = useMemo(() => ({ decision: Boolean(decision || session.analysisResults?.selectedStrategyId) }), [decision, session.analysisResults]);
  const navigateStep = (next) => {
    const nextStep = Math.max(0, Math.min(FLOW.length - 1, typeof next === 'function' ? next(step) : next));
    setStep(nextStep);
    setStepsOpen(false);
    onWorkflowStepChange?.(nextStep);
  };
  useEffect(() => { if (contentRef.current) contentRef.current.scrollTop = 0; }, [step]);
  const handleDecision = (strategyId, sequence, nextEvaluation) => {
    setDecision({ strategyId, sequence, evaluation: nextEvaluation });
    updateSession({ analysisResults: { ...(session.analysisResults || {}), rotationEvaluation: nextEvaluation, selectedStrategyId: strategyId, selectedSequence: sequence } });
    navigateStep(6);
  };
  const current = FLOW[step] || FLOW[0];
  const PreviousIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;
  const workbenchSection = ({ 2: 'inputs', 3: 'comparison', 4: 'tradeoffs', 5: 'uncertainty' })[step];

  return <div dir={isRtl ? 'rtl' : 'ltr'} className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#040915] text-slate-100">
    <header className="shrink-0 border-b border-cyan-900/60 bg-[#061327] px-3 py-2.5 sm:px-5">
      <div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="text-xs text-cyan-300">{ar ? `الخطوة ${step + 1} من ٧` : `Step ${step + 1} of 7`}</p><h1 className="truncate text-base font-bold sm:text-lg">{ar ? current.titleAr : current.title}</h1></div>
        <div className="relative shrink-0"><button type="button" onClick={() => setStepsOpen((open) => !open)} aria-expanded={stepsOpen} aria-label={ar ? 'عرض خطوات سير العمل' : 'Show workflow steps'} className="app-nav-button flex min-h-11 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm"><List className="h-4 w-4" /><span className="hidden sm:inline">{ar ? 'الخطوات' : 'Steps'}</span></button>
          {stepsOpen && <nav aria-label={ar ? 'خطوات سير العمل' : 'Workflow steps'} className="absolute end-0 top-full z-50 mt-2 grid max-h-[70vh] min-w-64 gap-1 overflow-y-auto rounded-xl border border-white/10 bg-[#061327] p-2 shadow-xl">{FLOW.map(({ id, icon: Icon, title, titleAr }) => { const disabled = id === 6 && !completed.decision; return <button key={id} type="button" disabled={disabled} aria-current={id === step ? 'step' : undefined} onClick={() => navigateStep(id)} className={`flex min-h-11 items-center gap-2 rounded-lg px-3 text-start text-sm ${id === step ? 'bg-cyan-900/70 text-white' : 'text-slate-300 hover:bg-white/5'} disabled:opacity-40`}><Icon className="h-4 w-4 shrink-0" />{id < step && <Check className="ms-auto h-4 w-4 text-emerald-400" />}<span>{ar ? titleAr : title}</span></button>; })}</nav>}
        </div>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800" role="progressbar" aria-label={ar ? 'تقدم سير العمل' : 'Workflow progress'} aria-valuemin={1} aria-valuemax={7} aria-valuenow={step + 1}><div className="h-full rounded-full bg-cyan-500 transition-[width]" style={{ width: `${((step + 1) / 7) * 100}%` }} /></div>
    </header>

    <main ref={contentRef} className="mobile-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <FarmProStudio activeStep={step} onContinue={() => navigateStep(1)} onEditFarm={() => navigateStep(0)} />
      {workbenchSection && <RotationStrategyWorkbench key="rotation-workbench" focusSection={workbenchSection} onDecisionSubmit={handleDecision} />}
      {step === 6 && evaluation && <ResultsDashboardScreen mission={mission} playerChoice={selectedStrategyId} playerEvaluation={evaluation} onNextMission={onOpenGame} nextLabel={ar ? 'العودة إلى المهام التعليمية' : 'Open learning missions'} />}
      {step === 6 && !evaluation && <div className="mx-auto max-w-4xl p-6 text-center"><h2 className="text-xl font-bold">{ar ? 'ملخص القرار' : 'Decision Summary'}</h2><p className="mt-2 text-sm text-slate-400">{ar ? 'اعتمد استراتيجية لعرض النتائج.' : 'Select a rotation strategy to view results.'}</p></div>}
    </main>

    <footer className="z-20 flex shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-[#061327] px-3 py-2.5 pb-[max(.625rem,env(safe-area-inset-bottom))] sm:px-5">
      <button type="button" disabled={step === 0} onClick={() => navigateStep((value) => value - 1)} className="app-nav-button flex min-h-11 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm disabled:opacity-40"><PreviousIcon className="h-4 w-4" />{ar ? 'السابق' : 'Previous'}</button>
      <span className="hidden text-xs text-slate-400 sm:inline">{ar ? `${step + 1} من ٧` : `${step + 1} of 7`}</span>
      <button type="button" disabled={step === 6 || (step === 5 && !completed.decision)} onClick={() => navigateStep((value) => value + 1)} className="app-nav-button flex min-h-11 items-center gap-2 rounded-lg bg-cyan-700 px-4 text-sm font-bold text-white disabled:opacity-40">{ar ? (step === 6 ? 'تم' : 'التالي') : (step === 6 ? 'Complete' : 'Next')}<NextIcon className="h-4 w-4" /></button>
    </footer>
  </div>;
}
