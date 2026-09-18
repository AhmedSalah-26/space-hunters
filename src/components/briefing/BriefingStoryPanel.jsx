'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CheckSquare, ArrowRight, ArrowLeft } from 'lucide-react';
import { briefingRolesData } from '../../data/worldMapData';

export default function BriefingStoryPanel({ mission, onBack }) {
  const { t, lang, isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState('farmer');

  const farmerAvatar = mission.farmerImage || "/images/farmer_egypt.jpg";
  const nasaAvatar = mission.nasaExpertImage || "/images/nasa_expert.jpg";

  return (
    <div
      className="lg:col-span-3 p-3.5 bg-[#061633]/96 border border-cyan-400/40 shadow-2xl backdrop-blur-md flex flex-col gap-3 min-h-0 overflow-y-auto custom-scrollbar rounded-xl"
      style={{
        clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)',
      }}
    >
      <div className="space-y-2.5">
        {/* Story Header */}
        <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2 pb-1.5 border-b border-cyan-500/20">
          <span>📋</span>
          <span>{t.missionStory}</span>
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          {lang === 'ar' ? mission.descriptionAr : mission.descriptionEn}
        </p>

        {/* Character Perspective Tabs */}
        <div className="flex items-center bg-[#071326] p-1 border border-white/10 rounded-lg">
          <button
            onClick={() => setActiveTab('farmer')}
            className={`flex-1 py-1.5 text-xs sm:text-sm font-black transition-all rounded-md cursor-pointer ${
              activeTab === 'farmer' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.tabFarmer}
          </button>
          <button
            onClick={() => setActiveTab('agri')}
            className={`flex-1 py-1.5 text-xs sm:text-sm font-black transition-all rounded-md cursor-pointer ${
              activeTab === 'agri' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.tabAgriOrg}
          </button>
          <button
            onClick={() => setActiveTab('nasa')}
            className={`flex-1 py-1.5 text-xs sm:text-sm font-black transition-all rounded-md cursor-pointer ${
              activeTab === 'nasa' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.tabNasaExperts}
          </button>
        </div>

        {/* Perspective Content Card */}
        <div className="p-2.5 bg-[#081730] border border-cyan-500/35 flex items-start gap-2.5 rounded-xl">
          <div className="w-11 h-11 overflow-hidden shrink-0 border border-cyan-400/40 rounded-lg bg-[#061226]">
            <img
              src={
                activeTab === 'nasa'
                  ? nasaAvatar
                  : activeTab === 'agri'
                  ? (mission.satelliteImage || mission.heroImage)
                  : farmerAvatar
              }
              alt="Perspective"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <span className="text-xs sm:text-sm font-black text-cyan-300 block truncate">
              {activeTab === 'nasa'
                ? (lang === 'ar' ? briefingRolesData.nasaScienceTeamAr : briefingRolesData.nasaScienceTeamEn)
                : activeTab === 'agri'
                ? (lang === 'ar' ? briefingRolesData.agriCoopAr : briefingRolesData.agriCoopEn)
                : (lang === 'ar' ? mission.farmerNameAr : mission.farmerNameEn)}
            </span>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mt-0.5">
              {activeTab === 'nasa'
                ? (lang === 'ar'
                    ? briefingRolesData.nasaDialogFallbackAr
                    : briefingRolesData.nasaDialogFallbackEn)
                : activeTab === 'agri'
                ? (lang === 'ar'
                    ? briefingRolesData.agriCoopDialogFallbackAr
                    : briefingRolesData.agriCoopDialogFallbackEn)
                : `"${lang === 'ar' ? mission.farmerDialogueAr : mission.farmerDialogueEn}"`}
            </p>
          </div>
        </div>

        {/* Mission Objectives List (All Target Objectives Defined & Verified) */}
        <div className="space-y-1.5">
          <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
            <span>🎯</span>
            <span>{t.missionObjectives}</span>
          </h4>

          <div className="space-y-1">
            {[t.obj1, t.obj2, t.obj3, t.obj4].map((obj, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 font-semibold p-1.5 bg-cyan-950/20 border border-cyan-500/25 rounded-lg select-none cursor-default"
              >
                <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all border border-cyan-500/25 rounded-xl cursor-pointer shrink-0 shadow-sm mt-auto"
      >
        {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span>{t.back}</span>
      </button>
    </div>
  );
}
