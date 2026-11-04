'use client';

import React, { useMemo } from 'react';
import { Activity, Droplets, Leaf, Thermometer, Waves } from 'lucide-react';
import { assessEnvironmentalRisk } from '../../analysis/risk/assessEnvironmentalRisk.js';

const MONTHS = [
  ['JAN', 'Jan', 'يناير'], ['FEB', 'Feb', 'فبراير'], ['MAR', 'Mar', 'مارس'], ['APR', 'Apr', 'أبريل'],
  ['MAY', 'May', 'مايو'], ['JUN', 'Jun', 'يونيو'], ['JUL', 'Jul', 'يوليو'], ['AUG', 'Aug', 'أغسطس'],
  ['SEP', 'Sep', 'سبتمبر'], ['OCT', 'Oct', 'أكتوبر'], ['NOV', 'Nov', 'نوفمبر'], ['DEC', 'Dec', 'ديسمبر'],
];
const MONTH_ABBREVIATIONS_AR = ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس'];

const LAYERS = [
  { variable: 'T2M', label: 'Temperature reference', labelAr: 'مرجع الحرارة', color: '#fbbf24' },
  { variable: 'PRECTOTCORR', label: 'Rainfall reference', labelAr: 'مرجع الأمطار', color: '#22d3ee' },
  { variable: 'RH2M', label: 'Atmospheric humidity', labelAr: 'رطوبة الهواء', color: '#60a5fa' },
  { variable: 'ALLSKY_SFC_SW_DWN', label: 'Solar radiation', labelAr: 'الإشعاع الشمسي', color: '#fb923c' },
];

const CATEGORIES = [
  { id: 'rainfall', title: 'Rainfall', titleAr: 'الأمطار', icon: Droplets, variables: ['PRECTOTCORR'], note: 'NASA POWER corrected precipitation reference', noteAr: 'مرجع الهطول المصحح من NASA POWER' },
  { id: 'soil', title: 'Soil moisture', titleAr: 'رطوبة التربة', icon: Waves, variables: [], unavailable: 'No integrated soil-moisture provider is available.', unavailableAr: 'لا يوجد مزود مدمج لرصد رطوبة التربة.' },
  { id: 'heat', title: 'Temperature and radiation', titleAr: 'الحرارة والإشعاع', icon: Thermometer, variables: ['T2M', 'ALLSKY_SFC_SW_DWN'], note: 'Air temperature and solar radiation are separate measurements.', noteAr: 'درجة حرارة الهواء والإشعاع الشمسي قياسان منفصلان.' },
  { id: 'vegetation', title: 'Vegetation', titleAr: 'الغطاء النباتي', icon: Leaf, variables: [], unavailable: 'No integrated vegetation-index or canopy provider is available.', unavailableAr: 'لا يوجد مزود مدمج لمؤشر الغطاء النباتي أو رصده.' },
  { id: 'humidity', title: 'Atmospheric humidity', titleAr: 'رطوبة الهواء', icon: Waves, variables: ['RH2M'], note: 'Atmospheric humidity does not measure soil, crop, surface, or groundwater availability.', noteAr: 'رطوبة الهواء لا تقيس توفر مياه التربة أو المحصول أو المياه السطحية أو الجوفية.' },
];

const PRIMARY_MEASURES = [
  { variable: 'T2M', title: 'Air temperature', titleAr: 'حرارة الهواء', note: '2 m reference', noteAr: 'مرجع على ارتفاع مترين' },
  { variable: 'PRECTOTCORR', title: 'Rainfall', titleAr: 'الأمطار', note: 'Corrected precipitation', noteAr: 'هطول مصحح' },
  { variable: 'RH2M', title: 'Atmospheric humidity', titleAr: 'رطوبة الهواء', note: 'Not soil moisture or water availability', noteAr: 'ليست رطوبة التربة أو توفر المياه' },
];

function valueForMonth(observations, variable, monthIndex) {
  const month = MONTHS[monthIndex][0];
  return observations.find((item) => item.variable === variable && item.referenceDate === `climatology:${month}`) || null;
}

function displayUnit(unit = '') {
  return unit === 'degC' ? '°C' : unit;
}

function formatValue(observation, lang) {
  if (!observation || !Number.isFinite(observation.value)) return lang === 'ar' ? 'غير متاح' : 'Unavailable';
  const digits = observation.variable === 'RH2M' ? 0 : 2;
  return `${Number(observation.value).toFixed(digits)} ${displayUnit(observation.unit)}`;
}

function SeasonalChart({ observations, variable, selectedMonth, color, lang }) {
  const points = MONTHS.map((_, index) => valueForMonth(observations, variable, index));
  const valid = points.map((observation, index) => ({ observation, index })).filter(({ observation }) => Number.isFinite(observation?.value));
  if (valid.length < 2) return <div className="flex h-20 items-center justify-center text-sm text-slate-500">{lang === 'ar' ? 'لا توجد نقاط كافية لرسم ملف موسمي' : 'Not enough values for a seasonal profile'}</div>;

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
  return <div>
    <svg viewBox="0 0 300 96" className="h-24 w-full overflow-visible" role="img" aria-label={lang === 'ar' ? 'ملف مناخي موسمي من متوسطات اثني عشر شهراً' : 'Seasonal profile of twelve climatological monthly averages'}>
      <path d="M12 64H288" stroke="#334155" strokeWidth="1" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {xy.map(({ x, y, value, index }) => <g key={index}>
        <title>{`${MONTHS[index][lang === 'ar' ? 2 : 1]}: ${Number(value).toFixed(2)} ${displayUnit(points[index].unit)}`}</title>
        <circle cx={x} cy={y} r={index === selectedMonth ? 4.5 : 2.5} fill={index === selectedMonth ? '#fff' : color} stroke={color} strokeWidth="1.5" />
      </g>)}
      {MONTHS.map((month, index) => <text key={month[0]} x={12 + (276 * index) / 11} y="90" fill={index === selectedMonth ? '#e2e8f0' : '#94a3b8'} fontSize="11" textAnchor="middle">{lang === 'ar' ? MONTH_ABBREVIATIONS_AR[index] : month[1]}</text>)}
    </svg>
    <div className="flex justify-between text-xs text-slate-500"><span>{min.toFixed(2)} {displayUnit(points[valid.find(({ observation }) => observation.value === min).index].unit)}</span><span>{max.toFixed(2)} {displayUnit(points[valid.find(({ observation }) => observation.value === max).index].unit)}</span></div>
  </div>;
}

function IndicatorMetric({ observation, observations, selectedMonth, color, lang, title, titleAr, mapEnabled, onToggleLayer }) {
  const item = valueForMonth(observations, observation, selectedMonth);
  const month = MONTHS[selectedMonth][lang === 'ar' ? 2 : 1];
  const variableLabel = lang === 'ar'
    ? ({ T2M: 'حرارة الهواء على ارتفاع مترين', PRECTOTCORR: 'الهطول المصحح', RH2M: 'الرطوبة النسبية على ارتفاع مترين', ALLSKY_SFC_SW_DWN: 'الإشعاع الشمسي قصير الموجة' })[observation]
    : ({ T2M: '2 m air temperature', PRECTOTCORR: 'Corrected precipitation', RH2M: '2 m relative humidity', ALLSKY_SFC_SW_DWN: 'All-sky surface shortwave radiation' })[observation];
  return <div className="min-w-0 rounded-lg bg-[#081426] p-3">
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0"><div className="text-sm text-slate-300">{lang === 'ar' ? titleAr : title}</div><div className="font-bold text-white">{formatValue(item, lang)}</div></div>
      <label className="flex min-h-11 shrink-0 cursor-pointer items-center gap-2 text-sm text-slate-300" title={lang === 'ar' ? 'إظهار مرجع النقطة في الخريطة' : 'Show this point reference on the map'}>
        <input type="checkbox" checked={mapEnabled} disabled={!Number.isFinite(item?.value)} onChange={onToggleLayer} className="accent-cyan-400" />
        {lang === 'ar' ? 'على الخريطة' : 'Map'}
      </label>
    </div>
    <div className="mt-1 text-sm text-cyan-200">{variableLabel} · {item?.referenceDate ? month : '—'}</div>
    <SeasonalChart observations={observations} variable={observation} selectedMonth={selectedMonth} color={color} lang={lang} />
    <p className="text-sm text-slate-400">{lang === 'ar' ? 'متوسطات مناخية شهرية؛ لا تعرض اتجاهاً تاريخياً سنة بسنة.' : 'Monthly climatology; this is not a year-by-year historical trend.'}</p>
    <p className="break-words text-sm text-slate-400">{item?.quality || (lang === 'ar' ? 'لم يجرِ التطبيق تقييماً إضافياً للجودة' : 'Quality not further assessed by the application')}</p>
  </div>;
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
  const monthlyObservations = useMemo(() => observations.filter((item) => item.source?.id === 'nasa-power-climatology' && item.source?.dataKind === 'reference'), [observations]);
  const source = monthlyObservations[0]?.source;
  const isPolygon = farmLocation?.selectionMethod === 'polygon-boundary';
  const selectedMonthName = MONTHS[selectedMonth][isArabic ? 2 : 1];
  const currentValues = LAYERS.map(({ variable }) => valueForMonth(monthlyObservations, variable, selectedMonth)).filter(Boolean);
  const activeCurrentValues = currentValues.filter((item) => activeLayers[item.variable] && Number.isFinite(item.value));
  const fusedForMonth = fusionGroups.find((group) => group.referenceDate === `climatology:${MONTHS[selectedMonth][0]}`);
  const riskAssessment = useMemo(() => assessEnvironmentalRisk({ observations: monthlyObservations, farmLocation }), [monthlyObservations, farmLocation]);

  const insights = useMemo(() => {
    const makeRangeInsight = (variable, label, labelAr, unit) => {
      const values = MONTHS.map((_, index) => valueForMonth(monthlyObservations, variable, index)).filter((item) => Number.isFinite(item?.value));
      if (values.length < 2) return null;
      const highest = values.reduce((a, b) => (b.value > a.value ? b : a));
      const lowest = values.reduce((a, b) => (b.value < a.value ? b : a));
      const highIndex = MONTHS.findIndex(([month]) => highest.referenceDate === `climatology:${month}`);
      const lowIndex = MONTHS.findIndex(([month]) => lowest.referenceDate === `climatology:${month}`);
      return {
        id: variable,
        text: isArabic
          ? `${labelAr}: أعلى متوسط في ${MONTHS[highIndex][2]} (${highest.value.toFixed(2)} ${unit})، وأدنى متوسط في ${MONTHS[lowIndex][2]} (${lowest.value.toFixed(2)} ${unit}).`
          : `${label}: highest climatological mean in ${MONTHS[highIndex][1]} (${highest.value.toFixed(2)} ${unit}); lowest in ${MONTHS[lowIndex][1]} (${lowest.value.toFixed(2)} ${unit}).`,
      };
    };
    return [
      makeRangeInsight('T2M', 'Air temperature', 'درجة حرارة الهواء', '°C'),
      makeRangeInsight('PRECTOTCORR', 'Corrected precipitation', 'الهطول المصحح', 'mm/day'),
    ].filter(Boolean);
  }, [monthlyObservations, isArabic]);

  return <section id={id || 'environmental-analysis'} className="min-w-0 w-full scroll-mt-3 space-y-4" aria-label={isArabic ? 'تحليل البيئة' : 'Environmental overview'}>
    <header>
      <h2 className="flex items-center gap-2 text-lg font-bold text-white"><Activity className="h-5 w-5 text-cyan-300" />{isArabic ? 'السياق البيئي' : 'Environmental context'}</h2>
      <p className="mt-1 text-sm leading-relaxed text-slate-300">{isArabic ? 'قيم NASA POWER متوسطات مناخية شهرية مرجعية، وليست رصداً حالياً أو قياساً على مستوى الحقل.' : 'NASA POWER values are monthly climatological references, not current observations or field-scale measurements.'}</p>
    </header>

    {isLoading && <p role="status" className="rounded-lg bg-cyan-950/40 px-3 py-2 text-sm text-cyan-100">{isArabic ? 'جارٍ تحميل مرجع NASA POWER…' : 'Loading NASA POWER reference data…'}</p>}
    {requestError && <p role="alert" className="rounded-lg bg-rose-950/40 px-3 py-2 text-sm leading-relaxed text-rose-100">{isArabic ? 'تعذر تحديث NASA POWER. قد تظل بيانات مرجعية مخزنة للموقع المطابق ظاهرة.' : `NASA POWER could not be updated: ${requestError}. Matching cached reference data may still be shown.`}</p>}
    {!isLoading && !requestError && monthlyObservations.length === 0 && <p role="status" className="rounded-lg bg-amber-950/30 px-3 py-2 text-sm text-amber-100">{isArabic ? 'لا تتوفر بيانات مرجعية لهذا الموقع بعد.' : 'No reference data is available for this location yet.'}</p>}

    <div className="rounded-lg bg-[#07152b] p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label htmlFor="environment-month" className="font-semibold text-white">{isArabic ? 'الشهر المرجعي' : 'Reference month'}: <span className="text-cyan-200">{selectedMonthName}</span></label>
        <span className="text-sm text-slate-400">{isArabic ? 'متوسط مناخي شهري، وليس تاريخاً للرصد' : 'Monthly climatology, not an observation date'}</span>
      </div>
      <input id="environment-month" type="range" min="0" max="11" step="1" value={selectedMonth} onChange={(event) => onSelectedMonthChange(Number(event.target.value))} className="mt-2 w-full accent-cyan-400" aria-label={isArabic ? 'اختر الشهر المرجعي' : 'Select reference month'} />
    </div>

    <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3">
      {PRIMARY_MEASURES.map((measure) => {
        const item = valueForMonth(monthlyObservations, measure.variable, selectedMonth);
        return <article key={measure.variable} className="min-w-0 rounded-lg bg-[#07152b] p-3">
          <h3 className="text-sm font-medium text-slate-300">{isArabic ? measure.titleAr : measure.title}</h3>
          <p className="mt-1 text-xl font-semibold text-white">{formatValue(item, lang)}</p>
          <p className="mt-1 text-sm text-slate-400">{isArabic ? measure.noteAr : measure.note}</p>
        </article>;
      })}
    </div>

    <p className="text-sm leading-relaxed text-amber-200">{isArabic ? 'بيانات نقطية شبكية؛ لا تمثل متوسطاً للمزرعة. رطوبة الهواء لا تقيس رطوبة التربة أو توفر المياه.' : 'Gridded point data; not a farm-wide average. Atmospheric humidity does not measure soil moisture or water availability.'}</p>

    <details className="group rounded-lg border border-white/10 bg-[#07111f]">
      <summary className="cursor-pointer px-3 py-3 font-semibold text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400">{isArabic ? 'الملفات الشهرية والبيانات غير المتاحة' : 'Monthly profiles and unavailable measures'}</summary>
      <div className="space-y-4 border-t border-white/10 p-3">
        <div className="grid min-w-0 grid-cols-1 gap-3">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const categoryObservations = category.variables.flatMap((variable) => monthlyObservations.filter((item) => item.variable === variable));
            const available = categoryObservations.length > 0;
            return <article key={category.id} className="min-w-0 rounded-lg bg-[#07152b] p-3">
              <h3 className="flex items-center gap-2 font-semibold text-white"><Icon className="h-4 w-4 text-cyan-300" />{isArabic ? category.titleAr : category.title}</h3>
              {available ? <>
                <p className="mt-1 text-sm text-slate-400">{isArabic ? 'متوسط الشهر المختار ضمن مرجع مناخي' : 'Selected-month value within a climatology reference'}</p>
                <div className="mt-2 space-y-2">{category.variables.map((variable) => {
                  const descriptor = LAYERS.find((layer) => layer.variable === variable);
                  return <IndicatorMetric key={variable} observation={variable} observations={monthlyObservations} selectedMonth={selectedMonth} color={descriptor.color} lang={lang} title={descriptor.label} titleAr={descriptor.labelAr} mapEnabled={!!activeLayers[variable]} onToggleLayer={() => onToggleLayer(variable)} />;
                })}</div>
                <p className="mt-2 text-sm text-slate-400">{isArabic ? category.noteAr : category.note || (isPolygon ? 'Centroid point sample only; no farm-area summary.' : 'Point sample only; not a farm-area average.')}</p>
              </> : <p className="mt-2 text-sm leading-relaxed text-slate-300">{isArabic ? category.unavailableAr : category.unavailable} {isArabic ? 'لا تُستخدم تقديرات تجريبية بديلة في التحليل.' : 'No demo estimates are substituted into the analysis.'}</p>}
            </article>;
          })}
        </div>

        <section>
          <h3 className="font-semibold text-white">{isArabic ? 'ملاحظات موسمية' : 'Seasonal patterns'}</h3>
          {insights.length ? <ul className="mt-2 space-y-2 text-sm text-slate-300">{insights.map((insight) => <li key={insight.id}>{insight.text} <span className="text-slate-500">{isArabic ? 'وصف للموسمية، وليس دليلاً على السببية.' : 'Descriptive seasonality, not evidence of causation.'}</span></li>)}</ul> : <p className="mt-1 text-sm text-slate-400">{isArabic ? 'لا تتوفر بيانات كافية لعرض نمط موسمي.' : 'Not enough data to show a seasonal pattern.'}</p>}
        </section>

        <section>
          <h3 className="font-semibold text-white">{isArabic ? 'نقاط مرجعية على الخريطة' : 'Map point references'}</h3>
          <p className="mt-1 text-sm text-slate-400">{isArabic ? 'تظهر القياسات المحددة في نافذة نقطة واحدة؛ صورة الخريطة من Esri وليست طبقة NASA.' : 'Selected measures appear in one point inspector. Esri imagery is the basemap, not a NASA raster layer.'}</p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">{LAYERS.map((layer) => {
            const value = valueForMonth(monthlyObservations, layer.variable, selectedMonth);
            return <label key={layer.variable} className="flex min-h-11 items-center gap-2 rounded-md bg-[#030914] px-3 py-2 text-sm text-slate-200">
              <input type="checkbox" checked={!!activeLayers[layer.variable]} disabled={!Number.isFinite(value?.value)} onChange={() => onToggleLayer(layer.variable)} className="accent-cyan-400" />
              <span>{isArabic ? layer.labelAr : layer.label}</span>
              <span className="ms-auto text-slate-400">{formatValue(value, lang)}</span>
            </label>;
          })}</div>
          <p className="mt-2 text-sm text-slate-400">{activeCurrentValues.length ? (isArabic ? `${activeCurrentValues.length} قياسات متزامنة؛ بقيت وحداتها منفصلة ولم تُحسب قيمة مركبة.` : `${activeCurrentValues.length} aligned measures; units remain separate and no composite value is calculated.`) : (isArabic ? 'لا توجد قياسات متاحة للشهر المختار.' : 'No measures are available for the selected month.')}</p>
        </section>

        <details className="rounded-md bg-[#030914] p-3">
          <summary className="cursor-pointer font-semibold text-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400">{isArabic ? 'فحص المخاطر والقيود المكانية' : 'Risk screening and spatial limits'}</summary>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{isArabic ? 'المخاطر غير مصنفة لغياب حدود محلية موثقة. بيانات POWER هنا متوسطات مناخية وليست رصداً حالياً أو توقعاً.' : 'Risks are unclassified because validated local thresholds are unavailable. POWER values here are climatological averages, not current observations or forecasts.'}</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-300">{riskAssessment.risks.map((risk) => <li key={risk.id}><b>{isArabic ? risk.labelAr : risk.label}:</b> {isArabic ? 'غير مصنف.' : 'Unclassified.'} <span className="text-slate-400">{isArabic ? risk.reasonAr : risk.reason}</span>{risk.evidence && <span className="block text-slate-400">{risk.evidence.min.toFixed(2)}–{risk.evidence.max.toFixed(2)} {displayUnit(risk.evidence.unit)} · {risk.evidence.coverage || (isArabic ? 'فترة مرجعية غير محددة' : 'reference period unspecified')}</span>}</li>)}</ul>
          <p className="mt-2 text-sm text-amber-100">{isArabic ? (isPolygon ? 'المضلع محفوظ، لكن البيانات عند نقطة المركز فقط؛ لا يوجد متوسط مكاني للمزرعة.' : 'البيانات عند نقطة مرجعية فقط؛ لا توجد طبقة مخاطر مكانية للمزرعة.') : riskAssessment.spatial.explanation}</p>
          {farmLocation && <p className="mt-1 text-sm text-slate-400">{farmLocation.latitude.toFixed(4)}, {farmLocation.longitude.toFixed(4)} · {source?.spatialResolution || (isArabic ? 'الدقة غير متاحة' : 'Resolution unavailable')}</p>}
        </details>

        <section>
          <h3 className="font-semibold text-white">{isArabic ? 'المصدر والمنهج' : 'Source and method'}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">{source?.provider || 'NASA POWER'} · {source?.dataset || (isArabic ? 'مجموعة البيانات غير متاحة' : 'Dataset unavailable')}</p>
          {source?.url && <a href={source.url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm text-cyan-300 underline">{isArabic ? 'وثائق مصدر البيانات' : 'Data source documentation'}</a>}
          <p className="mt-1 text-sm text-slate-400">{isArabic ? 'التغطية المرجعية:' : 'Reference coverage:'} {source?.temporalCoverage || (isArabic ? 'التغطية غير محددة في الاستجابة' : 'Coverage not supplied in response')} · {isArabic ? 'تاريخ الاسترجاع:' : 'Retrieved:'} {source?.retrievedAt ? new Date(source.retrievedAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US') : (isArabic ? 'غير متاح' : 'unavailable')}</p>
          <p className="mt-1 text-sm text-slate-400">{isArabic ? 'الدقة المكانية تختلف حسب المتغير؛ القيم تمثل نقطة شبكية ولا تعني قياساً حقلياً.' : 'Spatial resolution varies by variable; values represent a grid point, not a field measurement.'}</p>
        </section>
      </div>
    </details>
  </section>;
}
