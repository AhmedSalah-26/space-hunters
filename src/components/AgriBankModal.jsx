'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, Database, Sprout, Droplets, Sun, 
  Satellite, Search, Layers 
} from 'lucide-react';
import { 
  agriBankHeader, 
  agriBankTabs, 
  agriBankLabels, 
  cropDatabase, 
  soilDatabase, 
  satellitesData 
} from '../data/agriBankData';

export default function AgriBankModal({ isOpen, onClose }) {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('crops'); // 'crops' | 'soil' | 'satellites'
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredCrops = cropDatabase.filter(c => {
    const q = searchQuery.toLowerCase();
    return c.nameAr.includes(searchQuery) || c.nameEn.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#051329]/98 border border-cyan-400/50 shadow-[0_0_50px_rgba(0,180,216,0.35)] flex flex-col max-h-[90vh] overflow-hidden rounded-2xl"
        style={{
          clipPath: 'polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-cyan-500/25 bg-[#071a38] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-sm">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>{t.navAgriBank}</span>
                <span className="text-xs text-cyan-300 font-mono px-2 py-0.5 bg-cyan-950 border border-cyan-500/40 rounded-lg">
                  {agriBankHeader.badge}
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                {lang === 'ar' ? agriBankHeader.subAr : agriBankHeader.subEn}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/5 hover:bg-white/15 border border-cyan-500/30 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 bg-[#040e21] border-b border-cyan-500/20 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {agriBankTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isActive ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${tab.iconColor}`} />
                  <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
                </button>
              );
            })}
          </div>

          {activeTab === 'crops' && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-cyan-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={lang === 'ar' ? agriBankHeader.searchPlaceholderAr : agriBankHeader.searchPlaceholderEn}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#061633] border border-cyan-500/40 rounded-xl py-1.5 pr-9 pl-3 text-xs sm:text-sm text-white placeholder-slate-400 outline-none"
              />
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3.5 space-y-3">
          
          {/* TAB 1: CROPS VAULT */}
          {activeTab === 'crops' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredCrops.map((crop) => (
                <div key={crop.id} className="p-3 bg-[#081730] border border-cyan-500/35 rounded-xl flex gap-3 items-start shadow-md hover:border-cyan-400/70 transition-all">
                  <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden border border-white/10 shrink-0 relative shadow-inner">
                    <img src={crop.image} alt={crop.nameEn} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 text-[10px] bg-black/85 px-1.5 py-0.5 rounded text-cyan-300 font-mono font-bold">
                      {crop.droughtScore}%
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-xs sm:text-sm font-black text-white truncate">
                        {lang === 'ar' ? crop.nameAr : crop.nameEn}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold shrink-0">
                        {lang === 'ar' ? crop.categoryAr : crop.categoryEn}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Droplets className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="text-slate-400 font-medium">
                          {lang === 'ar' ? agriBankLabels.waterUsageAr : agriBankLabels.waterUsageEn}
                        </span>
                        <strong className="text-sky-300">
                          {lang === 'ar' ? crop.waterLevel : crop.waterLevelEn}
                        </strong>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Sprout className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-slate-400 font-medium">
                          {lang === 'ar' ? agriBankLabels.nitrogenAr : agriBankLabels.nitrogenEn}
                        </span>
                        <strong className="text-emerald-300 truncate">
                          {lang === 'ar' ? crop.nitrogen : crop.nitrogenEn}
                        </strong>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-slate-400 font-medium">
                          {lang === 'ar' ? agriBankLabels.optimalSeasonAr : agriBankLabels.optimalSeasonEn}
                        </span>
                        <span className="text-amber-300 font-bold">
                          {lang === 'ar' ? crop.optimalSeasonAr : crop.optimalSeasonEn}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 italic line-clamp-2 pt-1 border-t border-white/5 leading-relaxed">
                      • {lang === 'ar' ? crop.soilBenefitAr : crop.soilBenefitEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: SOIL DATABASE */}
          {activeTab === 'soil' && (
            <div className="space-y-3">
              {soilDatabase.map((soil, idx) => (
                <div key={idx} className="p-3 bg-[#081730] border border-emerald-500/35 rounded-xl space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🌱</span>
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-white">
                          {lang === 'ar' ? soil.typeAr : soil.typeEn}
                        </h3>
                        <span className="text-xs text-emerald-300 font-bold">
                          {lang === 'ar' ? soil.regionAr : soil.regionEn}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-[#040e21] px-2.5 py-1 border border-cyan-500/30 rounded-lg">
                      pH: {soil.ph}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                      <span className="text-slate-400 block text-[11px] font-bold">
                        {lang === 'ar' ? agriBankLabels.organicMatterAr : agriBankLabels.organicMatterEn}
                      </span>
                      <strong className="text-amber-300 text-xs sm:text-sm">
                        {lang === 'ar' ? soil.organicMatter : soil.organicMatterEn}
                      </strong>
                    </div>
                    <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                      <span className="text-slate-400 block text-[11px] font-bold">
                        {lang === 'ar' ? agriBankLabels.drainageAr : agriBankLabels.drainageEn}
                      </span>
                      <strong className="text-sky-300 text-xs sm:text-sm">
                        {lang === 'ar' ? soil.drainageAr : soil.drainageEn}
                      </strong>
                    </div>
                    <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                      <span className="text-slate-400 block text-[11px] font-bold">
                        {lang === 'ar' ? agriBankLabels.recommendedRotationAr : agriBankLabels.recommendedRotationEn}
                      </span>
                      <strong className="text-emerald-300 text-xs sm:text-sm">
                        {lang === 'ar' ? soil.recRotationAr : soil.recRotationEn}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: NASA SATELLITES */}
          {activeTab === 'satellites' && (
            <div className="space-y-3">
              {satellitesData.map((sat, idx) => (
                <div key={idx} className="p-3 bg-[#081730] border border-cyan-500/35 rounded-xl flex items-start gap-3 shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-blue-900/50 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0">
                    <Satellite className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm sm:text-base font-black text-white">{sat.name}</h3>
                      <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
                        {sat.resolution}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-emerald-300">
                      {lang === 'ar' ? sat.metricAr : sat.metricEn}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      <span className="text-slate-400 font-bold">
                        {lang === 'ar' ? agriBankLabels.spaceUsageAr : agriBankLabels.spaceUsageEn}
                      </span>{' '}
                      {lang === 'ar' ? sat.usageAr : sat.usageEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-cyan-500/20 bg-[#071a38] flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400 font-bold">
            {lang === 'ar' ? agriBankHeader.footerNoteAr : agriBankHeader.footerNoteEn}
          </div>
          <button
            onClick={onClose}
            className="py-1.5 px-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs sm:text-sm font-black rounded-xl cursor-pointer hover:scale-105 transition-all shadow-md"
          >
            {lang === 'ar' ? agriBankHeader.closeBtnAr : agriBankHeader.closeBtnEn}
          </button>
        </div>

      </div>
    </div>
  );
}
