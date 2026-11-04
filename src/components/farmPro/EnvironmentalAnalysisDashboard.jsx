'use client';

import React, { useMemo, useState } from 'react';
import { Activity, AlertTriangle, Droplets, Leaf, Layers, Thermometer, Waves } from 'lucide-react';
import { fuseEnvironmentalObservations } from '../../analysis/environmental/fusion';
import { assessEnvironmentalRisk } from '../../analysis/risk/assessEnvironmentalRisk.js';

const MONTHS = [
  ['JAN', 'Jan', 'يناير'], ['FEB', 'Feb', 'فبراير'], ['MAR', 'Mar', 'مارس'], ['APR', 'Apr', 'أبريل'],
  ['MAY', 'May', 'مايو'], ['JUN', 'Jun', 'يونيو'], ['JUL', 'Jul', 'يوليو'], ['AUG', 'Aug', 'أغسطس'],
  ['SEP', 'Sep', 'سبتمبر'], ['OCT', 'Oct', 'أكتوبر'], ['NOV', 'Nov', 'نوفمبر'], ['DEC', 'Dec', 'ديسمبر'],
];
const MONTH_ABBREVIATIONS_AR = ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس'];

const CATEGORIES = [
  { id: 'rainfall', title: 'Rainfall', titleAr: 'الأمطار', icon: Droplets, variables: ['PRECTOTCORR'], note: 'NASA POWER corrected precipitation reference', noteAr: 'مرجع الهطول المصحح من NASA POWER' },
  { id: 'soil', title: 'Soil Moisture', titleAr: 'رطوبة التربة', icon: Waves, variables: [], unavailable: 'No integrated soil-moisture observation provider is available.', unavailableAr: 'لا يوجد حالياً مزود مدمج لرصد رطوبة التربة.' },
  { id: 'heat', title: 'Heat', titleAr: 'الحرارة', icon: Thermometer, variables: ['T2M', 'ALLSKY_SFC_SW_DWN'], note: 'Air temperature and solar radiation are separate measurements.', noteAr: 'درجة حرارة الهواء والإشعاع الشمسي قياسان منفصلان.' },
  { id: 'vegetation', title: 'Vegetation', titleAr: 'الغطاء النباتي', icon: Leaf, variables: [], unavailable: 'No integrated vegetation index or canopy observation provider is available.', unavailableAr: 'لا يوجد حالياً مزود مدمج لمؤشر الغطاء النباتي أو رصده.' },
  { id: 'water', title: 'Water', titleAr: 'المياه', icon: Waves, variables: ['RH2M'], note: 'Atmospheric relative humidity is context only; it does not measure soil, crop, surface, or groundwater availability.', noteAr: 'الرطوبة النسبية للهواء معلومة سياقية فقط؛ لا تقيس توفر مياه التربة أو المحصول أو المياه السطحية أو الجوفية.' },
];

const LAYERS = [
  { variable: 'T2M', label: 'Temperature reference', labelAr: 'مرجع الحرارة', color: '#fbbf24' },
  { variable: 'PRECTOTCORR', label: 'Rainfall reference', labelAr: 'مرجع الأمطار', color: '#22d3ee' },
  { variable: 'RH2M', label: 'Atmospheric humidity', labelAr: 'رطوبة الهواء', color: '#60a5fa' },
  { variable: 'ALLSKY_SFC_SW_DWN', label: 'Solar radiation', labelAr: 'الإشعاع الشمسي', color: '#fb923c' },
];

function valueForMonth(observations, variable, monthIndex) {
  const month = MONTHS[monthIndex][0];
  return observations.find((item) => item.variable === variable && item.referenceDate === `climatology:${month}`) || null;
}

function monthIndexFor(observation) {
  return MONTHS.findIndex(([month]) => observation.referenceDate === `climatology:${month}`);
}

function displayUnit(unit = '') {
  return unit === 'degC' ? '°C' : unit;
}

function variableName(variable, lang) {
  if (lang !== 'ar') return ({ T2M: '2 m air temperature', PRECTOTCORR: 'Corrected precipitation', RH2M: '2 m relative humidity', ALLSKY_SFC_SW_DWN: 'All-sky surface shortwave radiation' })[variable] || variable;
  return ({ T2M: 'حرارة الهواء على ارتفاع مترين', PRECTOTCORR: 'الهطول المصحح', RH2M: 'الرطوبة النسبية على ارتفاع مترين', ALLSKY_SFC_SW_DWN: 'الإشعاع الشمسي قصير الموجة' })[variable] || variable;
}

function coverageLabel(lang, coverage) {
  if (lang === 'ar') {
    if (!coverage) return 'الفترة المرجعية غير متاحة في استجابة المصدر';
    const yearRange = String(coverage).match(/^(\d{4})[–-](\d{4})$/);
    return yearRange ? `الفترة المرجعية: ${yearRange[1]}–${yearRange[2]}` : 'فترة المناخ المرجعية المحددة مسبقاً؛ تفاصيل السنوات غير واردة في الاستجابة';
  }
  return coverage || 'Reference coverage period not supplied by the response';
}

function qualityLabel(quality, lang) {
  if (!quality) return lang === 'ar' ? 'قيمة الشهر غير متاحة' : 'No valid value for this month';
  if (lang !== 'ar') return quality;
  if (quality.startsWith('Missing')) return 'القيمة مفقودة في استجابة NASA POWER';
  return 'قيمة جاهزة للتحليل حسب NASA POWER؛ لم يُجرِ التطبيق فحص جودة إضافياً';
}

function formatValue(observation, lang) {
  if (!observation || !Number.isFinite(observation.value)) return lang === 'ar' ? 'غير متاح' : 'Unavailable';
  const digits = observation.variable === 'RH2M' ? 0 : 2;
  return `${Number(observation.value).toFixed(digits)} ${displayUnit(observation.unit)}`;
}

function SeasonalChart({ observations, variable, selectedMonth, color, lang }) {
  const points = MONTHS.map((_, index) => valueForMonth(observations, variable, index));
  const valid = points.map((observation, index) => ({ observation, index })).filter(({ observation }) => Number.isFinite(observation?.value));
  if (valid.length < 2) return <div className="h-20 flex items-center justify-center text-[9px] text-slate-500">{lang === 'ar' ? 'لا توجد نقاط كافية لرسم ملف موسمي' : 'Not enough available values for a seasonal profile'}</div>;

  const values = valid.map(({ observation }) => observation.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const xy = valid.map(({ observation, index }) => ({
    x: 12 + (276 * index) / 11,
    y: 8 + (52 * (max - observation.value)) / span,
    value: observation.value,
    index,
  }));
  const path = xy.map(({ x, y }, index) => `${index ? 'L' : 'M'}${x},${y}`).join(' ');
  return (
    <div>
      <svg viewBox="0 0 300 82" className="w-full h-[82px] overflow-visible" role="img" aria-label={lang === 'ar' ? 'ملف موسمي من اثني عشر متوسطاً مناخياً شهرياً' : 'Seasonal profile of twelve monthly climatological averages'}>
        <path d="M12 64H288" stroke="#334155" strokeWidth="1" />
        <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {xy.map(({ x, y, value, index }) => (
        <g key={index}>
            <title>{`${MONTHS[index][lang === 'ar' ? 2 : 1]}: ${Number(value).toFixed(2)} ${displayUnit(points[index].unit)}`}</title>
            <circle cx={x} cy={y} r={index === selectedMonth ? 4.5 : 2.5} fill={index === selectedMonth ? '#fff' : color} stroke={color} strokeWidth="1.5" />
          </g>
        ))}
        {MONTHS.map((month, index) => <text key={month[0]} x={12 + (276 * index) / 11} y="78" fill={index === selectedMonth ? '#e2e8f0' : '#64748b'} fontSize="6.5" textAnchor="middle">{lang === 'ar' ? MONTH_ABBREVIATIONS_AR[index] : month[1]}</text>)}
      </svg>
      <div className="flex justify-between text-[8px] text-slate-500"><span>{min.toFixed(2)} {displayUnit(points[valid.find(({ observation }) => observation.value === min).index].unit)}</span><span>{max.toFixed(2)} {displayUnit(points[valid.find(({ observation }) => observation.value === max).index].unit)}</span></div>
    </div>
  );
}

function IndicatorMetric({ observation, observations, selectedMonth, color, lang, title, titleAr, mapEnabled, onToggleLayer }) {
  const item = valueForMonth(observations, observation, selectedMonth);
  return (
    <div className="rounded-xl border border-white/10 bg-[#061327] p-2.5 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[9px] text-slate-400">{lang === 'ar' ? titleAr : title}</div>
          <div className="text-sm font-bold text-white truncate">{formatValue(item, lang)}</div>
        </div>
        <label className="flex items-center gap-1 text-[8px] text-slate-400 shrink-0 cursor-pointer" title={lang === 'ar' ? 'إظهار مرجع النقطة في الخريطة' : 'Show this point reference on the map'}>
          <input type="checkbox" checked={mapEnabled} disabled={!Number.isFinite(item?.value)} onChange={onToggleLayer} className="accent-cyan-400" />
          {lang === 'ar' ? 'خريطة' : 'Map'}
        </label>
      </div>
      <div className="text-[8px] text-cyan-200 mt-1">{variableName(observation, lang)} · {item?.referenceDate ? MONTHS[selectedMonth][lang === 'ar' ? 2 : 1] : '—'}</div>
      <SeasonalChart observations={observations} variable={observation} selectedMonth={selectedMonth} color={color} lang={lang} />
      <div className="text-[7.5px] text-slate-500">{lang === 'ar' ? '١٢ متوسطاً مناخياً شهرياً؛ لا يوجد اتجاه تاريخي سنة بسنة.' : '12 monthly climatology normals; no year-by-year historical trend.'}</div>
      <div className="text-[8px] text-slate-500 truncate" title={qualityLabel(item?.quality, lang)}>{qualityLabel(item?.quality, lang)}</div>
    </div>
  );
}

export default function EnvironmentalAnalysisDashboard({
  id,
  observations = [],
  farmLocation,
  lang = 'en',
  isLoading = false,
  requestError = '',
  selectedMonth,
  onSelectedMonthChange,
  activeLayers,
  onToggleLayer,
  fusionGroups = [],
}) {
  const isArabic = lang === 'ar';
  const [showLayerDetails, setShowLayerDetails] = useState(false);
  const monthlyObservations = useMemo(() => observations.filter((item) => item.source?.id === 'nasa-power-climatology' && item.source?.dataKind === 'reference'), [observations]);
  const source = monthlyObservations[0]?.source;
  const profileCoverage = coverageLabel(lang, source?.temporalCoverage);
  const isPolygon = farmLocation?.selectionMethod === 'polygon-boundary';

  const insights = useMemo(() => {
    const makeRangeInsight = (variable, label, labelAr, unit) => {
      const values = MONTHS.map((_, index) => valueForMonth(monthlyObservations, variable, index)).filter((item) => Number.isFinite(item?.value));
      if (values.length < 2) return null;
      const hottestOrWettest = values.reduce((a, b) => (b.value > a.value ? b : a));
      const coolestOrDriest = values.reduce((a, b) => (b.value < a.value ? b : a));
      const highMonth = monthIndexFor(hottestOrWettest);
      const lowMonth = monthIndexFor(coolestOrDriest);
      return {
        id: variable,
        text: isArabic
          ? `${labelAr}: أعلى متوسط شهري في ${MONTHS[highMonth][2]} (${hottestOrWettest.value.toFixed(2)} ${unit})، وأدنى متوسط في ${MONTHS[lowMonth][2]} (${coolestOrDriest.value.toFixed(2)} ${unit}).`
          : `${label}: highest monthly climatological mean is ${MONTHS[highMonth][1]} (${hottestOrWettest.value.toFixed(2)} ${unit}); lowest is ${MONTHS[lowMonth][1]} (${coolestOrDriest.value.toFixed(2)} ${unit}).`,
        source: hottestOrWettest.source.name,
        coverage: isArabic ? 'فترة المناخ المرجعية المحددة مسبقاً' : hottestOrWettest.temporalCoverage,
      };
    };
    return [
      makeRangeInsight('T2M', 'Air temperature', 'درجة حرارة الهواء', '°C'),
      makeRangeInsight('PRECTOTCORR', 'Corrected precipitation', 'الهطول المصحح', 'mm/day'),
    ].filter(Boolean);
  }, [monthlyObservations, isArabic]);

  const currentValues = LAYERS.map(({ variable }) => valueForMonth(monthlyObservations, variable, selectedMonth)).filter(Boolean);
  const activeCurrentValues = currentValues.filter((item) => activeLayers[item.variable] && Number.isFinite(item.value));
  const fusedForMonth = fusionGroups.find((group) => group.referenceDate === `climatology:${MONTHS[selectedMonth][0]}`);
  const riskAssessment = useMemo(() => assessEnvironmentalRisk({ observations: monthlyObservations, farmLocation }), [monthlyObservations, farmLocation]);

  return (
    <section id={id || 'environmental-analysis'} className="scroll-mt-3 rounded-2xl border border-cyan-500/30 bg-[#030914] p-3 space-y-3" aria-label={isArabic ? 'تحليل البيئة' : 'Environmental analysis'}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-1.5 text-xs font-black text-cyan-200"><Activity className="w-4 h-4" />{isArabic ? 'تحليل البيئة' : 'Environmental Analysis'}</h2>
          <p className="text-[9px] text-slate-400 mt-1">{isArabic ? 'NASA POWER · متوسطات مناخية شهرية مرجعية، وليست رصداً حالياً.' : 'NASA POWER · monthly climatological reference values, not current observations.'}</p>
          <p className="text-[8px] text-amber-200 mt-1">{isArabic ? 'بيانات نقطة شبكية؛ الدقة المكانية تختلف حسب المتغير. لا تمثل قياساً دقيقاً للحقل.' : 'Gridded point data; spatial resolution varies by parameter and is not field-scale.'}</p>
        </div>
        <span className="shrink-0 rounded-md border border-indigo-400/30 bg-indigo-950/40 px-1.5 py-1 text-[8px] text-indigo-200">{isArabic ? 'تغطية' : 'Coverage'}: {profileCoverage}</span>
      </div>

      {isLoading && <div role="status" className="rounded-lg border border-cyan-500/20 bg-cyan-950/20 px-2 py-1.5 text-[9px] text-cyan-200">{isArabic ? 'جارٍ تحميل مرجع NASA POWER…' : 'Loading NASA POWER reference data…'}</div>}
      {requestError && <div role="alert" className="rounded-lg border border-rose-500/30 bg-rose-950/20 px-2 py-1.5 text-[9px] text-rose-200"><AlertTriangle className="inline w-3 h-3 mr-1" />{isArabic ? 'تعذر تحديث بيانات NASA POWER. تحقق من الاتصال أو أعد المحاولة؛ وقد تظل البيانات المرجعية المخزنة المطابقة للموقع ظاهرة عند توفرها.' : `NASA POWER update failed: ${requestError}. A matching cached reference remains visible when available.`}</div>}
      {!isLoading && !requestError && monthlyObservations.length === 0 && <div role="status" className="rounded-lg border border-amber-500/20 bg-amber-950/20 px-2 py-1.5 text-[9px] text-amber-100">{isArabic ? 'لا توجد مشاهدات بيئية فعلية متاحة بعد.' : 'No real environmental observations are available yet.'}</div>}

      <div className="rounded-xl border border-white/10 bg-[#07152b] p-2.5 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="environment-month" className="text-[9px] font-bold text-white">{isArabic ? 'الشهر المناخي المرجعي' : 'Climatology month'}: <span className="text-cyan-200">{MONTHS[selectedMonth][isArabic ? 2 : 1]}</span></label>
          <span className="text-[8px] text-slate-400">{isArabic ? 'اختيار شهر مناخي، وليس فترة تاريخية' : 'Month-of-year selector; not a historical date range'}</span>
        </div>
        <input id="environment-month" type="range" min="0" max="11" step="1" value={selectedMonth} onChange={(event) => onSelectedMonthChange(Number(event.target.value))} className="w-full accent-cyan-400" aria-label={isArabic ? 'اختر شهر المناخ' : 'Select climatology month'} />
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-0.5 text-center">{MONTHS.map((month, index) => <button type="button" key={month[0]} onClick={() => onSelectedMonthChange(index)} aria-label={month[isArabic ? 2 : 1]} title={month[isArabic ? 2 : 1]} aria-pressed={index === selectedMonth} className={`rounded py-1 text-[7px] ${index === selectedMonth ? 'bg-cyan-700 text-white' : 'text-slate-500 hover:bg-white/5'}`}>{isArabic ? MONTH_ABBREVIATIONS_AR[index] : month[1]}</button>)}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const categoryObservations = category.variables.flatMap((variable) => monthlyObservations.filter((item) => item.variable === variable));
          const available = categoryObservations.length > 0;
          const actual = categoryObservations.find((item) => item.source.dataKind === 'observation' && item.observationDate);
          return (
            <article key={category.id} className="rounded-xl border border-white/10 bg-[#07152b] p-2.5 min-w-0">
              <h3 className="flex items-center gap-1.5 text-[10px] font-black text-white"><Icon className="w-3.5 h-3.5 text-cyan-300" />{isArabic ? category.titleAr : category.title}</h3>
              {available ? <>
                <div className="text-[8px] text-slate-400 mt-1">{actual ? (isArabic ? 'أحدث رصد مؤرخ' : 'Latest dated observation') : (isArabic ? 'لا يوجد رصد مؤرخ؛ مرجع الشهر المختار' : 'No dated observation; selected-month climatology')}</div>
                {actual && <div className="text-sm font-bold text-cyan-100">{formatValue(actual, lang)} · {actual.observationDate}</div>}
                <div className="space-y-2 mt-2">{category.variables.map((variable) => {
                  const descriptor = LAYERS.find((layer) => layer.variable === variable);
                  return <IndicatorMetric key={variable} observation={variable} observations={monthlyObservations} selectedMonth={selectedMonth} color={descriptor.color} lang={lang} title={descriptor.label} titleAr={descriptor.labelAr} mapEnabled={!!activeLayers[variable]} onToggleLayer={() => onToggleLayer(variable)} />;
                })}</div>
                <p className="mt-1.5 text-[8px] text-slate-500">{isArabic ? category.noteAr : category.note || (isPolygon ? 'Centroid point sample only; no farm-area summary.' : 'Point sample; not a farm-area average.')}</p>
                <p className="mt-1 text-[8px] text-slate-500"><a href={source?.url} target="_blank" rel="noreferrer" className="text-cyan-300 underline">{source?.provider}</a> · {source?.dataset} · {isArabic ? 'استرجاع' : 'Retrieved'} {source?.retrievedAt ? new Date(source.retrievedAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US') : '—'}</p>
                {!actual && <p className="mt-1 text-[8px] text-amber-300">{isArabic ? 'هذه متوسطات مرجعية؛ تاريخ الرصد الفعلي غير متاح.' : 'Reference averages only; actual observation date is unavailable.'}</p>}
              </> : <div className="mt-2 rounded-lg border border-amber-500/20 bg-amber-950/10 p-2 text-[8.5px] text-amber-100">{isArabic ? category.unavailableAr : category.unavailable}<div className="text-amber-300 mt-1">{isArabic ? 'لا تُستخدم تقديرات العرض التجريبي في التحليل أو الاستبصار.' : 'Demo estimates are excluded from analysis and insights.'}</div></div>}
            </article>
          );
        })}
      </div>

      <div className="rounded-xl border border-cyan-500/20 bg-[#061327] p-2.5">
        <h3 className="text-[10px] font-black text-cyan-100">{isArabic ? 'ملاحظات قابلة للتفسير' : 'Explainable insights'}</h3>
        {insights.length ? <ul className="mt-1.5 space-y-1.5">{insights.map((insight) => <li key={insight.id} className="text-[8.5px] text-slate-200"><span className="text-cyan-300">{isArabic ? 'ملاحظة موسمية: ' : 'Seasonal pattern: '}</span>{insight.text}<div className="text-[7.5px] text-slate-500">{insight.source} · {insight.coverage} · {isArabic ? 'تزامن وصفي، لا يثبت علاقة سببية.' : 'Descriptive co-variation only; no causal claim.'}</div></li>)}</ul> : <p className="mt-1 text-[8px] text-slate-500">{isArabic ? 'لا توجد بيانات كافية لاستبصارات مدعومة.' : 'Not enough real data for supported insights.'}</p>}
      </div>

      <div className="rounded-xl border border-indigo-400/20 bg-[#07152b] p-2.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="flex items-center gap-1.5 text-[10px] font-black text-indigo-100"><Layers className="w-3.5 h-3.5" />{isArabic ? 'طبقات البيئة على الخريطة' : 'Environmental map layers'}</h3>
          <button type="button" onClick={() => setShowLayerDetails((value) => !value)} className="text-[8px] text-cyan-300 underline">{showLayerDetails ? (isArabic ? 'إخفاء' : 'Hide details') : (isArabic ? 'تفاصيل' : 'Layer details')}</button>
        </div>
        <p className="mt-1 text-[8px] text-slate-400">{isArabic ? 'فعّل عدة قياسات لمقارنتها في نافذة النقطة على الخريطة.' : 'Enable multiple measures to compare them together in the map point inspector.'}</p>
        <div className="grid grid-cols-2 gap-1 mt-2">{LAYERS.map((layer) => {
          const value = valueForMonth(monthlyObservations, layer.variable, selectedMonth);
          return <label key={layer.variable} className={`flex items-center gap-1 rounded-lg border border-white/5 bg-[#030914] p-1.5 text-[8px] ${Number.isFinite(value?.value) ? 'text-slate-200' : 'text-slate-600'}`}>
            <input type="checkbox" checked={!!activeLayers[layer.variable]} disabled={!Number.isFinite(value?.value)} onChange={() => onToggleLayer(layer.variable)} className="accent-cyan-400" />
            <span className="truncate">{isArabic ? layer.labelAr : layer.label}</span>
          </label>;
        })}</div>
        {showLayerDetails && <div className="mt-2 space-y-1 border-t border-white/10 pt-2 text-[8px] text-slate-300">{activeCurrentValues.length ? activeCurrentValues.map((item) => <div key={item.variable}>{item.variable}: {formatValue(item, lang)} · {item.referenceDate} · {item.source.provider}</div>) : <p>{isArabic ? 'لا توجد طبقات نقطية متاحة لهذا الشهر.' : 'No point layers available for this month.'}</p>}<p className="text-amber-200">{isArabic ? 'صورة الخلفية من Esri؛ بيانات NASA تظهر كنقطة فقط وليست طبقة بكسلية أو متوسطاً لحدود المزرعة.' : 'Esri imagery is the basemap. NASA values appear only as a point annotation, not a raster layer or farm-boundary average.'}</p></div>}
        <p className="mt-2 text-[7.5px] text-slate-500">{isArabic ? 'إسناد مكاني: ' : 'Spatial interpretation: '}{isArabic ? (isPolygon ? 'عينة نقطة ممثلة عند مركز المضلع؛ لم يُحسب متوسط لمساحة المزرعة.' : 'عينة نقطة عند الإحداثية المرجعية؛ ليست متوسطاً لمساحة المزرعة.') : fusedForMonth?.spatialInterpretation || (isPolygon ? 'Centroid point sample; no area aggregation.' : 'Selected point sample; no area aggregation.')}</p>
      </div>

      <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/10 p-2 text-[8px] text-emerald-100">
        <span className="font-bold">{isArabic ? 'دمج مبدئي:' : 'Initial data fusion:'}</span> {fusedForMonth ? (isArabic ? `${fusedForMonth.observations.length} قياسات متزامنة من مصدر ونقطة وفترة تغطية متوافقة. بقيت الوحدات منفصلة ولم تُحسب قيمة مركبة.` : `${fusedForMonth.observations.length} aligned measurements share provider, point, month and coverage. Units remain separate; no composite value was calculated.`) : (isArabic ? 'لا توجد قياسات فعلية متوافقة لهذا الشهر.' : 'No compatible real measurements for this month.')}
      </div>

      <section className="rounded-xl border border-amber-500/25 bg-[#07152b] p-2.5" aria-label={isArabic ? 'تقييم المخاطر البيئية' : 'Environmental risk screening'}>
        <h3 className="text-[10px] font-black text-amber-100">{isArabic ? 'فحص المخاطر والقيود المكانية' : 'Risk screening & spatial limits'}</h3>
        <p className="mt-1 text-[8px] text-slate-400">{isArabic ? 'لا تُصنف مستويات المخاطر دون حدود محلية موثقة. بيانات POWER هنا مرجع مناخي، وليست رصداً حالياً أو توقعاً.' : 'Risk levels are not classified without validated local thresholds. POWER values here are climatological references, not current observations or forecasts.'}</p>
        <div className="mt-2 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">{riskAssessment.risks.map((risk) => <article key={risk.id} className="rounded-lg border border-slate-700 bg-[#030914] p-2">
          <div className="flex items-center justify-between gap-2"><b className="text-[8.5px] text-slate-200">{isArabic ? risk.labelAr : risk.label}</b><span className="rounded bg-slate-800 px-1.5 py-0.5 text-[7px] text-amber-200">{isArabic ? 'غير مصنف' : 'Unclassified'}</span></div>
          {risk.evidence && <p className="mt-1 text-[7.5px] text-cyan-200">{risk.evidence.min.toFixed(2)}–{risk.evidence.max.toFixed(2)} {displayUnit(risk.evidence.unit)} · {isArabic ? 'فترة المناخ المرجعية المحددة مسبقاً' : risk.evidence.coverage} · {isArabic ? 'متوسطات مناخية' : 'climatology'}</p>}
          <p className="mt-1 text-[7px] leading-snug text-slate-400">{isArabic ? risk.reasonAr : risk.reason}</p>
        </article>)}</div>
        <div className="mt-2 rounded-lg border border-amber-700/40 bg-amber-950/20 p-2 text-[8px] text-amber-100">
          <b>{isArabic ? 'التغطية المكانية:' : 'Spatial coverage:'}</b> {isArabic ? (isPolygon ? 'تم حفظ مضلع المزرعة، لكن قيم NASA POWER مرجع عند نقطة المركز فقط. لا يدعم المصدر تلخيص المساحة أو إنشاء طبقات مناطق.' : 'الإحداثية المحددة نقطة مرجعية فقط. لا تمثل بيانات NASA POWER المناخية سطح مخاطر دقيقاً للحقل؛ ولا تدعم مناطق مخاطر ملونة.') : riskAssessment.spatial.explanation}
          <div className="mt-1 text-slate-400">{farmLocation ? `${farmLocation.latitude.toFixed(4)}, ${farmLocation.longitude.toFixed(4)}` : (isArabic ? 'لم يتم تحديد موقع مرجعي' : 'No reference location selected')} · {source?.spatialResolution || (isArabic ? 'الدقة غير متاحة' : 'Resolution unavailable')}</div>
          <div className="mt-1">{isArabic ? 'لا توجد مناطق ملونة أو متوسطات للمزرعة؛ الخريطة تعرض حدودك/نقطة المرجع فقط.' : 'No colored zones or farm averages are generated; the map shows only the selected point/boundary.'}</div>
          {source?.url && <a href={source.url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-cyan-300 underline">{source.provider} · {source.dataset}</a>}
        </div>
      </section>
    </section>
  );
}
