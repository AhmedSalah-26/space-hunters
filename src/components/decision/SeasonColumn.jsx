'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Check } from 'lucide-react';
import { decisionScreenLabels } from '../../data/decisionFeedbackData';

export default function SeasonColumn({
  seasonNumber,
  seasonTitle,
  seasonEmoji,
  colorScheme, // 'cyan' | 'emerald' | 'amber'
  crops,
  selectedCropId,
  onSelectCrop,
  selectedCropInsight
}) {
  const { lang, isRtl } = useLanguage();

  const colorStyles = {
    cyan: {
      border: 'border-cyan-500/40',
      title: 'text-cyan-300',
      badgeBg: 'bg-cyan-950 text-cyan-300 border-cyan-500/30',
      activeBtn: 'bg-blue-600/90 border-cyan-300 text-white shadow-lg shadow-blue-500/30',
      checkColor: 'text-cyan-200',
      subText: 'text-cyan-200',
      insightHighlight: 'text-sky-300',
    },
    emerald: {
      border: 'border-emerald-500/40',
      title: 'text-emerald-300',
      badgeBg: 'bg-emerald-950 text-emerald-300 border-emerald-500/30',
      activeBtn: 'bg-emerald-600/90 border-emerald-300 text-white shadow-lg shadow-emerald-500/30',
      checkColor: 'text-emerald-200',
      subText: 'text-emerald-200',
      insightHighlight: 'text-emerald-300',
    },
    amber: {
      border: 'border-amber-500/40',
      title: 'text-amber-300',
      badgeBg: 'bg-amber-950 text-amber-300 border-amber-500/30',
      activeBtn: 'bg-amber-600/90 border-amber-300 text-white shadow-lg shadow-amber-500/30',
      checkColor: 'text-amber-200',
      subText: 'text-amber-200',
      insightHighlight: 'text-amber-300',
    }
  };

  const style = colorStyles[colorScheme] || colorStyles.cyan;

  return (
    <div className={`p-3 bg-[#040e21] border-2 ${style.border} rounded-2xl flex flex-col justify-between shadow-md space-y-2.5`}>
      <div className={`flex items-center justify-between text-xs font-black ${style.title} pb-1.5 border-b border-white/10`}>
        <span className="flex items-center gap-1.5">
          <span>{seasonEmoji}</span>
          <span>{seasonTitle}</span>
        </span>
        <span className={`font-mono text-xs px-2 py-0.5 rounded border font-bold ${style.badgeBg}`}>
          0{seasonNumber}
        </span>
      </div>

      {/* Crop Options Buttons Grid */}
      <div className="space-y-1.5">
        {crops.map((crop) => {
          const isSelected = selectedCropId === crop.id;
          const isLegume = crop.id.includes('legume') || crop.id.includes('faba') || crop.id.includes('soy');
          
          let subText = "";
          if (colorScheme === 'emerald') {
            subText = lang === 'ar' ? crop.nitrogenImpactAr : crop.nitrogenImpactEn;
          } else if (colorScheme === 'amber') {
            subText = lang === 'ar' 
              ? `${crop.droughtToleranceAr} ${decisionScreenLabels.toleranceAr} • ${crop.waterUsageAr}`
              : `${crop.droughtToleranceEn} ${decisionScreenLabels.toleranceEn} • ${crop.waterUsageEn}`;
          } else {
            subText = lang === 'ar'
              ? `${crop.waterUsageAr} • ${crop.yieldAr}`
              : `${crop.waterUsageEn} • ${crop.yieldEn}`;
          }

          return (
            <button
              key={crop.id}
              type="button"
              onClick={() => onSelectCrop(crop.id)}
              className={`w-full ${isRtl ? 'text-right' : 'text-left'} p-2 rounded-xl transition-all border flex items-center justify-between cursor-pointer ${
                isSelected
                  ? `${style.activeBtn} font-black`
                  : 'bg-[#081730] border-white/10 text-slate-300 hover:bg-[#0c234a] hover:text-white font-bold'
              }`}
            >
              <div className="truncate">
                <span className="text-xs sm:text-sm block truncate">
                  {lang === 'ar' ? crop.nameAr : crop.nameEn} {isLegume && colorScheme === 'emerald' ? '🌱' : ''}
                </span>
                <span className={`text-[10px] ${style.subText} block truncate font-normal`}>
                  {subText}
                </span>
              </div>
              {isSelected && <Check className={`w-4 h-4 ${style.checkColor} shrink-0 mx-1`} />}
            </button>
          );
        })}
      </div>

      {/* Selected Crop Satellite Insight */}
      {selectedCropInsight && (
        <div className="p-2 bg-black/40 rounded-xl border border-white/5 text-xs text-slate-200 space-y-1">
          <div className="text-slate-300 font-medium text-[11px] truncate">
            {colorScheme === 'emerald' ? '🌱' : colorScheme === 'amber' ? '🌽' : '🌾'}{' '}
            {lang === 'ar' ? selectedCropInsight.descAr : selectedCropInsight.descEn}
          </div>
          <div className={`${style.insightHighlight} font-bold text-[11px]`}>
            {colorScheme === 'emerald'
              ? `${decisionScreenLabels.nitrogenBadgeAr} ${lang === 'ar' ? selectedCropInsight.nitrogenImpactAr : selectedCropInsight.nitrogenImpactEn}`
              : colorScheme === 'amber'
              ? `${decisionScreenLabels.droughtBadgeAr} ${lang === 'ar' ? selectedCropInsight.droughtToleranceAr : selectedCropInsight.droughtToleranceEn}`
              : `${decisionScreenLabels.waterUsageBadgeAr} ${lang === 'ar' ? selectedCropInsight.waterUsageAr : selectedCropInsight.waterUsageEn}`}
          </div>
        </div>
      )}
    </div>
  );
}
