'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useWorkingSession } from '../../context/WorkingSessionContext';
import { cropCatalog, buildMissionCropCatalog } from '../../data/cropCatalog.js';
import { DEFAULT_ROTATION_PRIORITIES, ROTATION_CRITERIA, evaluateRotationStrategies } from '../../analysis/rotation/evaluateStrategies.js';
import { analyzeRotationTradeoffs } from '../../analysis/rotation/analyzeTradeoffs.js';
import { assessRotationUncertainty } from '../../analysis/uncertainty/assessRotationUncertainty.js';
import { assessEnvironmentalRisk } from '../../analysis/risk/assessEnvironmentalRisk.js';
import { formatArea } from '../../utils/farmGeometry.js';

const starterSequences = [
  ['winter_wheat', 'faba_beans', 'summer_corn'],
  ['winter_wheat', 'faba_beans', 'sorghum_grain'],
  ['barley', 'faba_beans', 'sunflower'],
];
const labels = ['Existing Rotation (Baseline)', 'Alternative Rotation 1', 'Alternative Rotation 2'];
const labelAr = ['الدورة الحالية (خط الأساس)', 'الدورة البديلة 1', 'الدورة البديلة 2'];
const priorityLabels = {
  waterNeed: ['Lower crop water need', 'انخفاض احتياج المحاصيل للمياه'],
  nitrogenPotential: ['Legume fixation potential', 'إمكانات تثبيت البقوليات للنيتروجين'],
  familyDiversity: ['Crop-family diversity', 'تنوع العائلات النباتية'],
  pestBreak: ['Potential pest-cycle breaks', 'إمكانات كسر دورات الآفات'],
  droughtResilience: ['Drought resilience', 'تحمل الجفاف'],
};
const priorityAria = {
  waterNeed: 'أهمية الاحتياج المائي الأقل', nitrogenPotential: 'أهمية إمكانات تثبيت النيتروجين',
  familyDiversity: 'أهمية تنوع العائلات', pestBreak: 'أهمية كسر دورة الآفات', droughtResilience: 'أهمية تحمل الجفاف',
};
const priorityDescriptions = {
  waterNeed: ['How strongly the comparison should favor crops with lower published water needs.', 'مدى تفضيل المحاصيل ذات الاحتياج المائي المنشور الأقل في المقارنة.'],
  nitrogenPotential: ['How much to value the share of crops with sourced legume-fixation potential.', 'مدى أهمية نسبة المحاصيل ذات إمكانات تثبيت النيتروجين الموثقة.'],
  familyDiversity: ['How much to value the number of different crop families in a sequence.', 'مدى أهمية عدد العائلات النباتية المختلفة في الدورة.'],
  pestBreak: ['How much to value changes in crop family between seasons as a pest-cycle proxy.', 'مدى أهمية تغيير العائلة النباتية بين المواسم كمؤشر محتمل لكسر دورة الآفات.'],
  droughtResilience: ['How much to value sourced drought-response classes when every strategy has comparable data.', 'مدى أهمية فئات تحمل الجفاف الموثقة عند توفر بيانات قابلة للمقارنة لكل الاستراتيجيات.'],
};
const formatPercent = (value) => `${Math.round(value)}%`;

export default function RotationStrategyWorkbench({ mission = null, onBack, onDecisionSubmit, focusSection = null }) {
  const { lang, isRtl } = useLanguage();
  const { session, updateSession } = useWorkingSession();
  const ar = lang === 'ar';
  const catalog = useMemo(() => mission ? buildMissionCropCatalog(mission.crops) : cropCatalog, [mission]);
  const starter = useMemo(() => {
    if (!mission?.rotations?.length) return starterSequences;
    return mission.rotations.slice(0, 3).map((rotation, index) => (rotation.sequenceIds || []).slice(0, 3).map((id) => id));
  }, [mission]);
  const savedInputs = session.farmInformation?.rotationInputs || {};
  const [sequences, setSequences] = useState(() => starter);
  const [baselineConfirmed, setBaselineConfirmed] = useState(() => Boolean(session.analysisResults?.rotationEvaluation?.farmInputs?.baselineConfirmed));
  const [selectedId, setSelectedId] = useState(() => session.analysisResults?.selectedStrategyId || 'strategy-0');
  const [priorities, setPriorities] = useState(() => savedInputs.priorities || DEFAULT_ROTATION_PRIORITIES);
  const [farm, setFarm] = useState(() => ({ region: session.farmLocation?.label || mission?.regionEn || '', soilType: '', waterAvailability: '', equipment: '', market: '', ...savedInputs, region: session.farmLocation?.label || mission?.regionEn || savedInputs.region || '' }));

  useEffect(() => {
    const ids = new Set(catalog.map((crop) => crop.id));
    const saved = session.rotationStrategies?.length === 3 ? session.rotationStrategies.map((strategy) => strategy.sequence || []) : null;
    if (saved && saved.every((sequence) => sequence.length === 3 && sequence.every((id) => ids.has(id)))) setSequences(saved);
    else setSequences(starter);
    setBaselineConfirmed(Boolean(session.analysisResults?.rotationEvaluation?.farmInputs?.baselineConfirmed));
    setSelectedId(session.analysisResults?.selectedStrategyId || 'strategy-0');
  }, [starter, catalog]);

  useEffect(() => {
    if (!focusSection) return;
    document.getElementById(`rotation-${focusSection}`)?.scrollIntoView({ block: 'start' });
  }, [focusSection]);

  const strategies = useMemo(() => sequences.map((sequence, index) => ({
    id: `strategy-${index}`, name: ar ? labelAr[index] : labels[index], isBaseline: index === 0, sequence,
  })), [sequences, ar]);
  const evaluation = useMemo(() => evaluateRotationStrategies(strategies, {
    cropCatalog: catalog, priorities, environmentalObservations: session.environmentalObservations || [],
    farmInputs: { ...farm, baselineConfirmed },
  }), [strategies, catalog, priorities, session.environmentalObservations, farm, baselineConfirmed]);

  useEffect(() => {
    updateSession({
      selectedCrops: sequences[0]?.map((id) => catalog.find((crop) => crop.id === id)).filter(Boolean) || [],
      rotationStrategies: strategies,
      analysisResults: { ...(session.analysisResults || {}), rotationEvaluation: evaluation },
      farmInformation: { ...(session.farmInformation || {}), rotationInputs: { ...farm, priorities } },
    });
  // Session update is intentionally based on evaluator inputs only.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluation]);

  const setCrop = (strategyIndex, seasonIndex, cropId) => setSequences((current) => current.map((sequence, i) => i === strategyIndex ? sequence.map((id, j) => j === seasonIndex ? cropId : id) : sequence));
  const fieldClass = 'w-full rounded-lg bg-[#07152b] border border-slate-600 px-2.5 py-2 text-xs text-white focus:border-cyan-400 outline-none';
  const selected = evaluation.strategies.find((strategy) => strategy.id === selectedId) || evaluation.strategies[0];
  const tradeoffs = useMemo(() => analyzeRotationTradeoffs(evaluation), [evaluation]);
  const uncertainty = useMemo(() => assessRotationUncertainty({ strategy: selected, evaluation, farmLocation: session.farmLocation, environmentalObservations: session.environmentalObservations || [] }), [selected, evaluation, session.farmLocation, session.environmentalObservations]);
  const riskAssessment = useMemo(() => assessEnvironmentalRisk({ observations: session.environmentalObservations || [], farmLocation: session.farmLocation, farmInputs: farm, strategies }), [session.environmentalObservations, session.farmLocation, farm, strategies]);
  const cropName = (crop) => ar ? crop?.nameAr : crop?.nameEn;
  const submit = () => onDecisionSubmit?.(selected.id, { season1: selected.sequence[0], season2: selected.sequence[1], season3: selected.sequence[2] }, evaluation);
  const selectStrategy = (id) => {
    setSelectedId(id);
    updateSession({ analysisResults: { ...(session.analysisResults || {}), selectedStrategyId: id } });
  };

  const farmLocation = session.farmLocation;
  const farmArea = session.farmArea || farmLocation;
  const locationLabel = farmLocation?.label || (ar ? mission?.regionAr || 'لم يتم تحديد موقع للمزرعة' : mission?.regionEn || 'No farm location selected');
  const areaLabel = farmArea?.area != null && farmArea?.areaUnit
    ? formatArea(farmArea.area, farmArea.areaUnit, ar ? 'ar' : 'en')
    : (ar ? 'غير متاح' : 'Unavailable');
  const methodLabel = farmLocation?.selectionMethod === 'polygon-boundary'
    ? (ar ? 'مساحة محسوبة من حدود مرسومة' : 'Calculated from drawn boundary')
    : farmLocation?.selectionMethod === 'point-area'
      ? (ar ? 'نقطة مرجعية ومساحة مدخلة' : 'Reference point and entered area')
      : (ar ? 'لم تُسجل طريقة القياس' : 'Measurement method unavailable');

  return <div dir={isRtl ? 'rtl' : 'ltr'} className="mobile-scroll w-full h-full min-h-0 max-w-[1500px] mx-auto px-3 sm:px-6 py-4 text-slate-100 space-y-4 overflow-y-auto">
    <header className="flex items-center justify-between gap-3">
      <div><p className="text-[10px] uppercase tracking-[.2em] text-cyan-300">Field Shift · Decision Support</p><h1 className="text-xl sm:text-2xl font-black">{ar ? 'مقارنة استراتيجيات الدورة الزراعية' : 'Crop Rotation Strategy Comparison'}</h1><p className="mt-1 max-w-3xl text-xs text-slate-400">{ar ? 'قارن خط الأساس مع بديلين باستخدام صفات منشورة وأوزان تحددها أنت.' : 'Compare an existing-rotation baseline with two alternatives using sourced crop traits and priorities you control.'}</p></div>
      {onBack && <button onClick={onBack} className="shrink-0 rounded-lg border border-slate-600 px-3 py-2 text-xs">{ar ? 'رجوع' : 'Back'}</button>}
    </header>

    <section className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]">
      <div className="lg:col-span-2"><h2 className="text-sm font-bold"><span className="me-2 text-cyan-300">01</span>{ar ? 'مقارنة الدورات الزراعية' : 'Module 01 · Compare Rotations'}</h2></div>
      <div id="rotation-comparison" className="grid min-w-0 scroll-mt-3 gap-3 xl:grid-cols-3">
        {strategies.map((strategy, si) => {
          const result = evaluation.strategies[si];
          const strengths = si === 0 ? (ar ? 'مرجع المقارنة.' : 'Comparison reference.') : (evaluation.scoredCriteria.filter((key) => result.metrics[key] > evaluation.strategies[0].metrics[key]).map((key) => ar ? ROTATION_CRITERIA[key].labelAr : ROTATION_CRITERIA[key].labelEn).join(', ') || (ar ? 'لا توجد ميزة أعلى وفق المعايير المدعومة.' : 'No higher supported criterion score.'));
          const tradeoffs = si === 0 ? (baselineConfirmed ? (ar ? 'الدورة المؤكدة هي مرجع المقارنة.' : 'Confirmed existing rotation; comparison reference.') : (ar ? 'قالب خط الأساس لم يُؤكد بعد.' : 'Baseline template has not been confirmed yet.')) : (evaluation.scoredCriteria.filter((key) => result.metrics[key] < evaluation.strategies[0].metrics[key]).map((key) => ar ? ROTATION_CRITERIA[key].labelAr : ROTATION_CRITERIA[key].labelEn).join(', ') || (ar ? 'لا توجد درجات أدنى وفق المعايير المدعومة.' : 'No lower supported criterion score.'));
          return <article key={strategy.id} className={`rounded-xl border p-3 bg-[#07152b]/90 ${selectedId === strategy.id ? 'border-cyan-400' : 'border-slate-700'}`}>
            <div className="flex items-center justify-between gap-2"><h2 className="text-sm font-bold">{ar ? labelAr[si] : labels[si]}</h2><label className="flex min-h-11 items-center gap-2 text-xs text-cyan-100"><input aria-label={ar ? `اختيار ${labelAr[si]}` : `Select ${labels[si]}`} type="radio" checked={selectedId === strategy.id} onChange={() => selectStrategy(strategy.id)} />{ar ? 'اختيار' : 'Select'}</label></div>
            <p className="mt-1 text-sm font-semibold text-slate-200">{result.crops.map((crop) => cropName(crop)).join(' → ')}</p>
            <div className="mt-3 rounded-lg bg-slate-900/80 p-2"><div className="text-xs text-slate-400">{ar ? 'درجة الملاءمة النسبية' : 'Relative fit score'}</div><div className="text-2xl font-black text-cyan-300">{result.metrics.overallScore ?? '—'}<span className="text-xs text-slate-500"> / 100</span></div>{result.comparisonToBaseline !== null && <p className="text-xs text-slate-400">{ar ? 'مقارنة بخط الأساس' : 'vs baseline'}: {result.comparisonToBaseline > 0 ? '+' : ''}{result.comparisonToBaseline}</p>}</div>
            <p className="mt-2 text-xs text-emerald-200"><b>{ar ? 'ميزة مدعومة: ' : 'Supported strength: '}</b>{strengths}</p>
            <p className="mt-1 text-xs text-amber-200"><b>{ar ? 'المقايضة: ' : 'Trade-off: '}</b>{tradeoffs}</p>
            <details className="mt-3 border-t border-slate-700 pt-2">
              <summary className="min-h-11 cursor-pointer py-2 text-xs font-bold text-cyan-200">{ar ? 'تعديل المحاصيل وعرض الأدلة والقياسات' : 'Edit crops and view evidence & metrics'}</summary>
              {si === 0 && <label className="my-2 flex min-h-11 items-center gap-2 text-xs text-amber-200"><input type="checkbox" checked={baselineConfirmed} onChange={(event) => setBaselineConfirmed(event.target.checked)} />{ar ? 'أكد أن التسلسل يمثل الدورة الحالية فعلاً' : 'Confirm this sequence matches the farm’s actual existing rotation'}</label>}
              <div className="mt-2 space-y-2">{[0, 1, 2].map((season) => <label key={season} className="block text-xs text-slate-300">{ar ? `الموسم ${season + 1}` : `Season ${season + 1}`}<select className={`${fieldClass} mt-1`} value={sequences[si]?.[season] || ''} onChange={(event) => setCrop(si, season, event.target.value)}>{catalog.map((crop) => <option key={crop.id} value={crop.id}>{cropName(crop)}</option>)}</select></label>)}</div>
              <div className="mt-2 space-y-1">{result.crops.map((crop, index) => crop && <p key={`${crop.id}-source-${index}`} className="text-xs text-slate-400">{cropName(crop)}: {crop.cropWaterNeed ? <a className="text-cyan-300 underline" href={crop.cropWaterNeed.source.url} target="_blank" rel="noreferrer">FAO · {ar ? crop.cropWaterNeed.scopeAr : crop.cropWaterNeed.scope}</a> : (ar ? 'الصفات الزراعية غير متاحة / غير موثقة' : 'Agronomic traits unavailable or unverified')}{crop.familyEvidence && <> · <a className="text-cyan-300 underline" href={crop.familyEvidence.url} target="_blank" rel="noreferrer">{ar ? 'مصدر العائلة النباتية' : 'family source'}</a></>}</p>)}</div>
            <dl className="mt-3 space-y-1 text-xs">
              <Metric label={ar ? 'احتياج مائي إرشادي للمواسم' : 'Indicative crop water need'} value={result.metrics.waterNeedRangeMm ? `${result.metrics.waterNeedRangeMm.min}–${result.metrics.waterNeedRangeMm.max} mm` : 'Unavailable'} />
              <Metric label={ar ? 'إمكانات تثبيت النيتروجين' : 'Nitrogen fixation potential'} value={result.metrics.nitrogenPotential == null ? 'Unavailable' : `${formatPercent(result.metrics.nitrogenPotential)} ${ar ? 'من المحاصيل' : 'of crops'}`} />
              <Metric label={ar ? 'تنوع العائلات' : 'Family diversity'} value={result.metrics.familyDiversity == null ? 'Unavailable' : formatPercent(result.metrics.familyDiversity)} />
              <Metric label={ar ? 'كسر دورة الآفات المحتمل' : 'Potential pest-cycle breaks'} value={result.metrics.pestBreak == null ? 'Unavailable' : `${formatPercent(result.metrics.pestBreak)} ${ar ? 'من الانتقالات' : 'transitions'}`} />
              <Metric label={ar ? 'تحمل الجفاف (غير محسوب لغياب مصدر)' : 'Drought resilience (not scored; no sourced class)'} value={result.metrics.droughtResilience == null ? (ar ? 'غير متاح' : 'Unavailable') : `${Math.round(result.metrics.droughtResilience)}/100`} />
              <Metric label={ar ? 'البيانات البيئية' : 'Environmental compatibility'} value={ar ? 'سياق فقط؛ غير محسوبة' : 'Context only; not scored'} />
            </dl>
            </details>
          </article>;
        })}
      </div>
      <aside id="rotation-inputs" className="min-w-0 scroll-mt-3 rounded-xl border border-slate-700 bg-[#07152b] p-3 space-y-4 lg:col-start-2 lg:row-start-2">
        <h2 className="text-base font-bold">{ar ? 'معلومات المزرعة والأولويات' : 'Farm Information & Priorities'}</h2>
        <section aria-labelledby="selected-farm-context-title" className="rounded-lg border border-cyan-900/70 bg-[#030914] p-3">
          <h3 id="selected-farm-context-title" className="text-sm font-bold text-cyan-100">{ar ? 'ملخص المزرعة المحددة' : 'Selected Farm Context'}</h3>
          <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
            <div className="min-w-0"><dt className="text-slate-400">{ar ? 'الموقع' : 'Location'}</dt><dd className="break-words font-semibold">{locationLabel}</dd></div>
            <div className="min-w-0"><dt className="text-slate-400">{ar ? 'الإحداثيات' : 'Coordinates'}</dt><dd className="break-words font-mono text-xs">{Number.isFinite(farmLocation?.latitude) && Number.isFinite(farmLocation?.longitude) ? `${farmLocation.latitude.toFixed(5)}, ${farmLocation.longitude.toFixed(5)}` : (ar ? 'غير متاحة' : 'Unavailable')}</dd></div>
            <div><dt className="text-slate-400">{ar ? 'مساحة المزرعة' : 'Farm area'}</dt><dd className="font-semibold">{areaLabel}</dd></div>
            <div className="min-w-0"><dt className="text-slate-400">{ar ? 'طريقة القياس' : 'Area measurement method'}</dt><dd className="break-words">{methodLabel}</dd></div>
          </dl>
        </section>

        <details className="rounded-lg border border-slate-700 bg-[#030914]">
          <summary className="cursor-pointer px-3 py-3 text-sm font-bold text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400">{ar ? 'معلومات إضافية عن المزرعة (اختياري)' : 'Additional Farm Information (Optional)'}</summary>
          <div className="space-y-4 border-t border-slate-700 p-3">
            <p className="text-xs leading-relaxed text-slate-400">{ar ? 'هذه معلومات يشاركها المزارع للسياق فقط. لا تُقاس بالأقمار الصناعية ولا تغيّر درجات المقارنة.' : 'These are farmer-provided context only. They are not satellite measurements and do not change comparison scores.'}</p>
            <label className="block space-y-1.5 text-sm text-slate-200"><span>{ar ? 'نوع التربة (اختياري)' : 'Soil type (optional)'}</span><input className={fieldClass} value={farm.soilType || ''} onChange={(e) => setFarm({ ...farm, soilType: e.target.value })} placeholder={ar ? 'معلومة يقدّمها المزارع' : 'Farmer-provided information'} /><span className="block text-xs leading-relaxed text-slate-400">{ar ? 'لا يُستدل على نوع التربة من الإحداثيات، ولا يدخل هذا الحقل في الدرجة.' : 'Soil type is not inferred from coordinates and does not affect the score.'}</span></label>
            <label className="block space-y-1.5 text-sm text-slate-200"><span>{ar ? 'تقدير المزارع لتوفر المياه (اختياري)' : 'Farmer assessment of water availability (optional)'}</span><select className={fieldClass} value={farm.waterAvailability === 'Adequate' ? 'Sufficient' : farm.waterAvailability || ''} onChange={(e) => setFarm({ ...farm, waterAvailability: e.target.value })}><option value="">{ar ? 'غير معروف' : 'Unknown'}</option><option value="Limited">{ar ? 'محدود' : 'Limited'}</option><option value="Moderate">{ar ? 'متوسط' : 'Moderate'}</option><option value="Sufficient">{ar ? 'كافٍ' : 'Sufficient'}</option></select><span className="block text-xs leading-relaxed text-slate-400">{ar ? 'تقدير ذاتي للسياق؛ لا يمثل قياساً للأمطار أو رطوبة التربة أو المياه الجوفية ولا يؤثر في الدرجة.' : 'A self-reported context value, not a measure of rainfall, soil moisture, or groundwater; it does not affect the score.'}</span></label>
          </div>
        </details>

        <div className="border-t border-slate-700 pt-3">
          <h3 className="text-sm font-bold">{ar ? 'أولويات المزارع' : 'Farmer Priorities'}</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">{ar ? 'تحدد هذه الأوزان مدى تأثير الصفات الزراعية المدعومة في درجة المقارنة النسبية. تُستبعد الصفات التي لا تتوفر لها بيانات قابلة للمقارنة، وتُعاد موازنة الأوزان المتبقية.' : 'These weights set how supported crop traits influence the relative comparison score. Traits without comparable data are excluded, and remaining weights are renormalized.'}</p>
          <div className="mt-3 space-y-4">{Object.entries(DEFAULT_ROTATION_PRIORITIES).map(([key]) => <label key={key} className="block space-y-1.5 text-sm text-slate-200"><span className="flex items-start justify-between gap-3"><span>{priorityLabels[key][ar ? 1 : 0]}</span><b className="shrink-0 text-cyan-300">{priorities[key]}</b></span><span className="block text-xs leading-relaxed text-slate-400">{priorityDescriptions[key][ar ? 1 : 0]}</span><input className="w-full accent-cyan-400" type="range" min="0" max="100" value={priorities[key]} aria-label={ar ? priorityAria[key] : priorityLabels[key][0]} onChange={(e) => setPriorities({ ...priorities, [key]: Number(e.target.value) })} /></label>)}</div>
        </div>
      </aside>
    </section>

    <section className="grid lg:grid-cols-2 gap-3">
      <div className="rounded-xl border border-cyan-800/60 bg-[#07152b] p-3"><h2 className="text-sm font-bold">{ar ? 'لماذا تتصدر هذه الاستراتيجية؟' : 'Strategy explanation'}</h2><p className="mt-2 text-xs text-slate-300">{selected.metrics.overallScore == null ? (ar ? 'لا تتوفر بيانات كافية لحساب درجة مشتركة.' : 'There is not enough comparable crop data for a combined score.') : (ar ? `الدرجة ${selected.metrics.overallScore}/100 تقيس الملاءمة النسبية للأوزان المحددة فقط.` : `Score ${selected.metrics.overallScore}/100 reflects relative fit to the selected priorities only.`)}</p><p className="mt-1 text-[10px] text-slate-400">{ar ? 'المياه تعني احتياج المحصول لا كفاءة الري. إمكانات تثبيت النيتروجين لا تضمن كمية مضافة. الأرقام ليست توصية زراعية مضمونة.' : 'Water means crop evapotranspiration need, not irrigation efficiency. Legume potential is not a guaranteed nitrogen quantity. Scores are not guaranteed recommendations.'}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">{evaluation.scoredCriteria.map((key) => <div key={key} className="rounded bg-slate-900 p-2"><span>{ar ? ROTATION_CRITERIA[key].labelAr : ROTATION_CRITERIA[key].labelEn}</span><div className="mt-1 h-1.5 bg-slate-700 rounded"><div className="h-full bg-cyan-400 rounded" style={{ width: `${selected.metrics[key]}%` }} /></div><span className="text-cyan-300">{Math.round(selected.metrics[key])} · {evaluation.normalizedWeights[key].toFixed(0)}% {ar ? 'وزن' : 'weight'}</span></div>)}</div>
      </div>
      <div className="rounded-xl border border-slate-700 bg-[#07152b] p-3"><h2 className="text-sm font-bold">{ar ? 'البيانات والمصادر والقيود' : 'Evidence, assumptions & limits'}</h2><p className="mt-2 text-xs text-slate-300">{ar ? 'الصفات العلمية المعروضة مرتبطة بالمصدر في كل بطاقة محصول.' : 'Scientific crop facts are linked to their source in the unified catalog.'}</p><div className="mt-2 flex flex-wrap gap-2 text-[10px]"><a className="text-cyan-300 underline" href="https://www.fao.org/4/S2022E/s2022e07.htm" target="_blank" rel="noreferrer">FAO · indicative crop water needs</a><a className="text-cyan-300 underline" href="https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/living-soil-healthy-garden" target="_blank" rel="noreferrer">UMN Extension · crop families & legumes</a><a className="text-cyan-300 underline" href="https://extension.psu.edu/plant-rotation-in-the-garden-based-on-plant-families" target="_blank" rel="noreferrer">Penn State · family rotation</a></div><ul className="mt-2 list-disc space-y-1 ps-4 text-[10px] text-amber-200">{selected.assumptions.map((item, i) => <li key={i}>{item}</li>)}<li>{ar ? 'الموسمية المحلية، التربة، السوق، الغلة، وتغطية التربة غير متاحة أو غير مُتحقق منها؛ لا تدخل في الدرجة.' : 'Local calendars, soil response, markets, yield, and soil cover are unavailable or unverified; they do not contribute to the score.'}</li></ul>
        {selected.crops.map((crop) => crop?.cropWaterNeed && <p className="mt-1 text-[9px] text-slate-400" key={crop.id}>{cropName(crop)}: {crop.cropWaterNeed.scope}</p>)}
      </div>
    </section>
    <section id="rotation-tradeoffs" className="scroll-mt-3 rounded-xl border border-amber-700/40 bg-[#07152b] p-3">
      <h2 className="text-sm font-bold"><span className="me-2 text-cyan-300">02</span>{ar ? 'كشف المقايضات بين الاستراتيجيات' : 'Module 02 · Reveal Trade-offs'}</h2>
      <p className="mt-1 text-[10px] text-slate-400">{ar ? 'المخطط يقارن درجات الصفات المدعومة بخط الأساس. لا يمثل غلة أو ربحاً.' : 'Bars compare supported trait scores with the baseline. They do not represent yield or profit.'}</p>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">{tradeoffs.map((item, si) => <article key={item.strategyId} className="rounded-lg border border-slate-700 bg-[#030914] p-2.5"><h3 className="text-xs font-bold">{ar ? labelAr[si] : labels[si]}</h3>
        <div className="mt-2 space-y-2">{item.changes.map((change) => <div key={change.criterion}><div className="flex justify-between text-[9px]"><span>{ar ? change.labelAr : change.label}</span><span>{change.value} <span className="text-slate-500">({change.delta > 0 ? '+' : ''}{change.delta})</span></span></div><div className="mt-1 h-1.5 overflow-hidden rounded bg-slate-700"><div className={`h-full ${change.delta < 0 ? 'bg-amber-400' : 'bg-cyan-400'}`} style={{ width: `${change.value}%` }} /></div></div>)}</div>
        <div className="mt-2 text-[9px]"><span className="text-emerald-300">{ar ? 'تحسن:' : 'Improves:'}</span> <span className="text-slate-300">{item.improves.map((c) => ar ? c.labelAr : c.label).join(', ') || (ar ? 'لا يوجد تغير مدعوم' : 'No supported increase')}</span></div>
        <div className="mt-1 text-[9px]"><span className="text-amber-300">{ar ? 'تنازل:' : 'Sacrifices:'}</span> <span className="text-slate-300">{item.sacrifices.map((c) => ar ? c.labelAr : c.label).join(', ') || (ar ? 'لا يوجد انخفاض مدعوم' : 'No supported decrease')}</span></div>
      </article>)}</div>
      <p className="mt-2 text-[9px] text-amber-200">{ar ? 'الملاءمة السوقية، تغطية التربة، قيود الإنتاج، والتوافق مع موسم النمو غير متاحة؛ لذلك لا يمكن تقييم تلك المقايضات أو الاستدلال على الإنتاجية.' : 'Market fit, soil cover, production constraints, and growing-season fit are unavailable, so those trade-offs and production outcomes cannot be evaluated.'}</p>
      <details className="mt-3 border-t border-slate-700 pt-2"><summary className="min-h-11 cursor-pointer py-2 text-xs font-bold text-amber-100"><span className="me-2 text-cyan-300">03</span>{ar ? 'المخاطر البيئية (غير مصنفة)' : 'Environmental risks (unclassified)'}</summary><p className="mt-1 text-xs text-slate-400">{ar ? 'تعرضات الحرارة والأمطار مناخية مرجعية؛ لا تُصنف كمخاطر دون حدود محلية موثقة. لا توجد تنبؤات.' : 'Temperature and rainfall are climatological context; hazards are not classified without local thresholds. No forecasts are generated.'}</p><div className="mt-2 grid gap-2 sm:grid-cols-2">{riskAssessment.risks.map((item) => <div key={item.id} className="rounded bg-[#030914] p-2"><div className="flex justify-between gap-2 text-xs"><span>{ar ? item.labelAr : item.label}</span><b className="text-amber-200">{ar ? 'غير مصنف' : 'Unclassified'}</b></div><p className="mt-1 text-xs text-slate-400">{ar ? item.reasonAr : item.reason}</p></div>)}</div><p className="mt-2 text-xs text-amber-200">{riskAssessment.spatial.explanation}</p></details>
    </section>
    <section id="rotation-uncertainty" className="scroll-mt-3 rounded-xl border border-violet-500/30 bg-[#07152b] p-3">
      <h2 className="text-sm font-bold"><span className="me-2 text-cyan-300">04</span>{ar ? 'إظهار عدم اليقين واكتمال الأدلة' : 'Module 04 · Make Uncertainty Visible'}</h2>
      <p className="mt-2 text-sm text-violet-200">{ar ? uncertainty.overallAr : uncertainty.cropEvidence.status}</p>
      <details className="mt-2"><summary className="min-h-11 cursor-pointer py-2 text-xs font-bold text-violet-200">{ar ? 'عرض مصدر البيانات والقيود التفصيلية' : 'View evidence sources and detailed limits'}</summary><div className="mt-2 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg bg-[#030914] p-2.5"><b className="text-xs text-violet-200">{ar ? 'المقارنة الزراعية' : 'Crop-trait comparison'}</b><p className="mt-1 text-[10px] text-cyan-200">{ar ? uncertainty.overallAr : uncertainty.cropEvidence.status}</p><p className="text-[9px] text-slate-400">{ar ? `${uncertainty.cropEvidence.sourcedTraitCount} صفة موثقة من أصل ${uncertainty.cropEvidence.expectedTraitCount} صفة مطلوبة. هذا مقياس اكتمال وليس ثقة.` : `${uncertainty.cropEvidence.sourcedTraitCount} sourced trait entries across ${uncertainty.cropEvidence.expectedTraitCount} expected entries. Completeness label only, not confidence.`}</p></div>
        <div className="rounded-lg bg-[#030914] p-2.5"><b className="text-xs text-violet-200">{ar ? 'البيانات البيئية' : 'Environmental data'}</b><p className="mt-1 text-[10px] text-cyan-200">{ar ? (uncertainty.environmentalEvidence.status === 'Unavailable' ? 'غير متاحة' : 'أدلة محدودة') : uncertainty.environmentalEvidence.status}</p><p className="text-[9px] text-slate-300">{ar ? uncertainty.environmentalEvidence.kindAr : uncertainty.environmentalEvidence.kind}</p><p className="mt-1 text-[8px] text-slate-500">{uncertainty.environmentalEvidence.provider || (ar ? 'المزود غير متاح' : 'Provider unavailable')} · {uncertainty.environmentalEvidence.dataset || (ar ? 'مجموعة البيانات غير متاحة' : 'Dataset unavailable')}</p><p className="text-[8px] text-slate-500">{uncertainty.environmentalEvidence.temporalResolution || (ar ? 'الدقة الزمنية غير متاحة' : 'Temporal resolution unavailable')} · {uncertainty.environmentalEvidence.temporalCoverage || (ar ? 'التغطية غير متاحة' : 'Coverage unavailable')}</p><p className="text-[8px] text-slate-500">{uncertainty.environmentalEvidence.spatialResolution || (ar ? 'الدقة المكانية غير متاحة' : 'Spatial resolution unavailable')} · {ar ? 'تاريخ الاسترجاع' : 'Retrieved'} {uncertainty.environmentalEvidence.retrievalDate ? new Date(uncertainty.environmentalEvidence.retrievalDate).toLocaleDateString(ar ? 'ar-EG' : 'en-US') : (ar ? 'غير متاح' : 'date unavailable')}</p>{uncertainty.environmentalEvidence.quality && <p className="mt-1 text-[8px] text-amber-200">{ar ? 'الجودة' : 'Quality'}: {uncertainty.environmentalEvidence.quality}</p>}{uncertainty.environmentalEvidence.sourceUrl && <a className="text-[8px] text-cyan-300 underline" href={uncertainty.environmentalEvidence.sourceUrl} target="_blank" rel="noreferrer">{ar ? 'وثائق المصدر' : 'Provider documentation'}</a>}<ul className="mt-1 list-disc ps-3 text-[8px] text-slate-500">{uncertainty.environmentalEvidence.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div className="rounded-lg bg-[#030914] p-2.5"><b className="text-xs text-violet-200">{ar ? 'البيانات التي تحسن النتيجة' : 'Data that would improve the result'}</b><ul className="mt-1 list-disc space-y-1 ps-4 text-[9px] text-slate-300">{(ar ? uncertainty.improvementNeedsAr : uncertainty.improvementNeeds).slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul></div>
      </div>
      <div className="mt-2 grid gap-3 md:grid-cols-2"><div><h3 className="text-[10px] font-bold text-amber-200">{ar ? 'معلومات مفقودة' : 'Missing inputs'}</h3><ul className="mt-1 list-disc space-y-1 ps-4 text-[9px] text-slate-400">{(ar ? uncertainty.missingInputsAr : uncertainty.missingInputs).map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3 className="text-[10px] font-bold text-amber-200">{ar ? 'الافتراضات المنهجية' : 'Method assumptions'}</h3><ul className="mt-1 list-disc space-y-1 ps-4 text-[9px] text-slate-400">{uncertainty.assumptions.map((item) => <li key={item}>{ar ? 'تستخدم المقارنة افتراضات معلنة، ولا تمثل هذه النتيجة ضماناً زراعياً.' : item}</li>)}</ul></div></div>
      <p className="mt-2 text-xs text-slate-400">{ar ? uncertainty.basisAr : uncertainty.basis}</p></details>
    </section>
    <footer className="flex flex-wrap items-center justify-between gap-2 pb-2"><button onClick={() => { setSequences(starter); setBaselineConfirmed(false); selectStrategy('strategy-0'); setPriorities(DEFAULT_ROTATION_PRIORITIES); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-xs"><RotateCcw size={13} />{ar ? 'استعادة القوالب' : 'Restore starter sequences'}</button><button onClick={submit} disabled={!onDecisionSubmit} className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-bold disabled:opacity-50">{ar ? 'اعتماد الاختيار للنتائج' : 'Use selected strategy'}{isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}</button></footer>
  </div>;
}

function Metric({ label, value }) { return <div className="flex justify-between gap-2 border-b border-white/5 pb-1"><dt className="text-slate-400">{label}</dt><dd className="text-right text-slate-200">{value}</dd></div>; }
