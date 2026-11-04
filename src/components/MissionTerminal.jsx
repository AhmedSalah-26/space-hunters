'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, MapPinned, Satellite, Sprout, Scale, ShieldAlert, CircleHelp, ClipboardCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWorkingSession } from '../context/WorkingSessionContext';
import FarmProStudio from './farmPro/FarmProStudio';
import RotationStrategyWorkbench from './rotation/RotationStrategyWorkbench';
import ResultsDashboardScreen from './ResultsDashboardScreen';

const FLOW = [
  { id: 0, target: 'workflow-section-0', icon: MapPinned, label: 'Farm location & area', labelAr: 'موقع المزرعة ومساحتها' },
  { id: 1, target: 'workflow-section-1', icon: Satellite, label: 'Environmental overview', labelAr: 'نظرة بيئية' },
  { id: 2, target: 'workflow-section-2', icon: Sprout, label: 'Farm information & crops', labelAr: 'معلومات المزرعة والمحاصيل' },
  { id: 3, target: 'workflow-section-3', icon: Scale, label: 'Compare rotations', labelAr: 'مقارنة الدورات' },
  { id: 4, target: 'workflow-section-4', icon: ShieldAlert, label: 'Risks & trade-offs', labelAr: 'المخاطر والمقايضات' },
  { id: 5, target: 'workflow-section-5', icon: CircleHelp, label: 'Uncertainty & limits', labelAr: 'عدم اليقين والقيود' },
  { id: 6, target: 'workflow-section-6', icon: ClipboardCheck, label: 'Decision summary', labelAr: 'ملخص القرار' },
];

export default function MissionTerminal({ onOpenGame, onWorkflowStepChange, initialStep = 0 }) {
  const { lang, isRtl } = useLanguage();
  const { session, updateSession } = useWorkingSession();
  const ar = lang === 'ar';
  const [step, setStep] = useState(initialStep);
  const [decision, setDecision] = useState(null);
  const contentRef = useRef(null);
  const pendingTargetRef = useRef(null);
  const evaluation = session.analysisResults?.rotationEvaluation || decision?.evaluation || null;
  const selectedStrategyId = session.analysisResults?.selectedStrategyId || decision?.strategyId || evaluation?.baselineId;
  const mission = {
    countryEn: session.farmLocation?.label || 'Selected farm',
    countryAr: session.farmLocation?.label || 'المزرعة المحددة',
    code: 'LOCAL',
  };

  const completed = useMemo(() => ({
    farm: Boolean(session.farmLocation),
    environment: Boolean(session.environmentalObservations?.length),
    rotation: Boolean(evaluation?.strategies?.length === 3),
    decision: Boolean(decision || session.analysisResults?.selectedStrategyId),
  }), [session.farmLocation, session.environmentalObservations, evaluation, decision, session.analysisResults]);

  const navigateStep = (nextStep) => {
    const resolvedStep = Math.max(0, Math.min(FLOW.length - 1, typeof nextStep === 'function' ? nextStep(step) : nextStep));
    const targetId = FLOW[resolvedStep].target;
    setStep(resolvedStep);
    onWorkflowStepChange?.(resolvedStep);
    pendingTargetRef.current = targetId;
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => { setStep(initialStep); }, [initialStep]);

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return undefined;
    const targets = FLOW.map(({ target }) => document.getElementById(target)).filter(Boolean);
    const observer = new IntersectionObserver(() => {
      const rootRect = root.getBoundingClientRect();
      const activationLine = rootRect.top + Math.min(120, rootRect.height * 0.18);
      const currentTarget = pendingTargetRef.current && document.getElementById(pendingTargetRef.current);
      if (currentTarget) {
        const rect = currentTarget.getBoundingClientRect();
        const targetIsAtScrollTop = rect.top <= rootRect.top + 40 && rect.bottom > rootRect.top;
        if (targetIsAtScrollTop || (rect.top <= activationLine && rect.bottom > activationLine)) pendingTargetRef.current = null;
        else return;
      }
      let active = targets[0];
      for (const target of targets) {
        if (target.getBoundingClientRect().top <= activationLine) active = target;
      }
      const nextStep = FLOW.findIndex(({ target }) => target === active?.id);
      if (nextStep >= 0) {
        setStep((current) => current === nextStep ? current : nextStep);
        onWorkflowStepChange?.(nextStep);
      }
    }, { root, rootMargin: '-18% 0px -70% 0px', threshold: 0 });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [onWorkflowStepChange]);

  useEffect(() => {
    if (initialStep <= 0) return undefined;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(FLOW[initialStep]?.target)?.scrollIntoView({ block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [initialStep]);

  const handleDecision = (strategyId, sequence, nextEvaluation) => {
    setDecision({ strategyId, sequence, evaluation: nextEvaluation });
    updateSession({ analysisResults: { ...(session.analysisResults || {}), rotationEvaluation: nextEvaluation, selectedStrategyId: strategyId, selectedSequence: sequence } });
    navigateStep(6);
  };

  const canAdvance = step < 5 || (step === 5 && completed.decision);
  const PreviousIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return <div dir={isRtl ? 'rtl' : 'ltr'} className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#040915] text-slate-100">
    <header className="z-20 shrink-0 border-b border-cyan-900/60 bg-[#061327] px-3 py-2.5 sm:px-5">
      <div className="mb-2.5 min-w-0"><h2 className="type-card-title truncate font-black text-white">{ar ? 'مركز مهمة تكيّف المزارع' : 'Farm Adaptation Mission Terminal'}</h2></div>
      <nav aria-label={ar ? 'خطوات سير العمل' : 'Workflow steps'} className="hidden gap-1 overflow-x-auto pb-1 sm:flex">{FLOW.map(({ id, target, icon: Icon, label, labelAr }) => {
        const active = id === step;
        const done = id === 0 ? completed.farm : id === 1 ? completed.environment : id < 4 ? completed.rotation : id === 6 ? completed.decision : completed.rotation;
        const disabled = id === 6 && !completed.decision;
        return <button key={id} type="button" disabled={disabled} aria-current={active ? 'step' : undefined} aria-controls={target} onClick={() => navigateStep(id)} className={`flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border px-2.5 text-[13px] font-semibold transition-colors ${active ? 'border-cyan-400 bg-cyan-950/60 text-white' : 'border-white/5 bg-white/[.03] text-slate-300 hover:text-white'} disabled:cursor-not-allowed disabled:opacity-40`}><Icon className="h-4 w-4" />{done && !active && <Check className="h-3.5 w-3.5 text-emerald-400" />}<span>{ar ? labelAr : label}</span></button>;
      })}</nav>
      <div className="sm:hidden">
        <div className="mb-1 flex items-center justify-between gap-2">
          <button type="button" disabled={step === 0} onClick={() => navigateStep((value) => value - 1)} className="app-nav-button flex w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-200 disabled:opacity-40" aria-label={ar ? 'الخطوة السابقة' : 'Previous workflow step'}><PreviousIcon aria-hidden="true" className="h-5 w-5" /></button>
          <label className="sr-only" htmlFor="mission-workflow-step">{ar ? 'اختر خطوة سير العمل' : 'Choose workflow step'}</label>
          <select id="mission-workflow-step" value={step} onChange={(event) => navigateStep(Number(event.target.value))} className="min-h-11 min-w-0 flex-1 rounded-xl border border-cyan-700/50 bg-[#081a32] px-3 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">
            {FLOW.map(({ id, label, labelAr }) => <option key={id} value={id} disabled={id === 6 && !completed.decision}>{ar ? labelAr : label}</option>)}
          </select>
          <button type="button" disabled={!canAdvance} onClick={() => navigateStep((value) => value + 1)} className="app-nav-button flex w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-200 disabled:opacity-40" aria-label={ar ? 'الخطوة التالية' : 'Next workflow step'}><NextIcon aria-hidden="true" className="h-5 w-5" /></button>
        </div>
        <div className="flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-700" role="progressbar" aria-label={ar ? 'تقدم سير العمل' : 'Workflow progress'} aria-valuemin={1} aria-valuemax={FLOW.length} aria-valuenow={step + 1}><div className="h-full rounded-full bg-cyan-500 transition-[width]" style={{ width: `${((step + 1) / FLOW.length) * 100}%` }} /></div><span className="shrink-0 text-xs font-semibold text-slate-300">{ar ? `الخطوة ${step + 1} من ${FLOW.length}` : `Step ${step + 1} of ${FLOW.length}`}</span></div>
      </div>
    </header>

    <main ref={contentRef} tabIndex={0} aria-label={ar ? 'سير عمل دعم قرار المزرعة' : 'Farm decision workflow'} className="mobile-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400">
      <FarmProStudio onContinue={() => navigateStep(1)} onEditFarm={() => navigateStep(0)} />
      <RotationStrategyWorkbench onDecisionSubmit={handleDecision} />
      <section id="workflow-section-6" className="scroll-mt-4 shrink-0 border-t border-white/10" aria-label={ar ? 'ملخص القرار' : 'Decision Summary'}>
        {evaluation ? <ResultsDashboardScreen mission={mission} playerChoice={selectedStrategyId} playerEvaluation={evaluation} onNextMission={onOpenGame} nextLabel={ar ? 'العودة إلى المهام التعليمية' : 'Open learning missions'} /> : <div className="mx-auto min-h-64 max-w-5xl p-6 text-center"><h2 className="text-xl font-black">{ar ? '٧. ملخص القرار' : '7. Decision Summary'}</h2><p className="mt-2 text-sm text-slate-400">{ar ? 'اعتمد استراتيجية لمراجعة ملخص القرار.' : 'Select and submit a rotation strategy to view the decision summary.'}</p></div>}
      </section>
    </main>
  </div>;
}
