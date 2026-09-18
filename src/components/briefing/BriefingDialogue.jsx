'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  RotateCcw, FastForward, MessageSquare, 
  Volume2, ArrowRight, ArrowLeft 
} from 'lucide-react';
import { briefingRolesData, briefingDialogueUiData } from '../../data/worldMapData';

export default function BriefingDialogue({ mission, onContinue }) {
  const { lang, isRtl } = useLanguage();

  const dialogueList = mission.dialogue || [
    {
      id: 1,
      sender: "farmer",
      speakerNameAr: mission.farmerNameAr || briefingRolesData.farmerDefaultNameAr,
      speakerNameEn: mission.farmerNameEn || briefingRolesData.farmerDefaultNameEn,
      speakerRoleAr: `${briefingRolesData.farmerRolePrefixAr}${mission.countryAr}`,
      speakerRoleEn: `${briefingRolesData.farmerRolePrefixEn}${mission.countryEn}`,
      avatar: mission.farmerImage || "/images/farmer_egypt.jpg",
      textAr: mission.farmerDialogueAr || briefingRolesData.farmerDefaultDialogueAr,
      textEn: mission.farmerDialogueEn || briefingRolesData.farmerDefaultDialogueEn
    },
    {
      id: 2,
      sender: "nasa",
      speakerNameAr: mission.nasaExpertNameAr || briefingRolesData.nasaDefaultNameAr,
      speakerNameEn: mission.nasaExpertNameEn || briefingRolesData.nasaDefaultNameEn,
      speakerRoleAr: briefingRolesData.nasaDefaultRoleAr,
      speakerRoleEn: briefingRolesData.nasaDefaultRoleEn,
      avatar: mission.nasaExpertImage || "/images/nasa_expert.jpg",
      textAr: briefingRolesData.nasaTelemetryDialogueAr(mission.telemetry?.tempAnomaly || "+2.0°C", mission.telemetry?.soilMoisture || "-20%"),
      textEn: briefingRolesData.nasaTelemetryDialogueEn(mission.telemetry?.tempAnomaly || "+2.0°C", mission.telemetry?.soilMoisture || "-20%")
    },
    {
      id: 3,
      sender: "farmer",
      speakerNameAr: mission.farmerNameAr || briefingRolesData.farmerDefaultNameAr,
      speakerNameEn: mission.farmerNameEn || briefingRolesData.farmerDefaultNameEn,
      speakerRoleAr: `${briefingRolesData.farmerRolePrefixAr}${mission.countryAr}`,
      speakerRoleEn: `${briefingRolesData.farmerRolePrefixEn}${mission.countryEn}`,
      avatar: mission.farmerImage || "/images/farmer_egypt.jpg",
      textAr: mission.farmerQuestionAr || briefingRolesData.farmerQuestionFallbackAr,
      textEn: mission.farmerQuestionEn || briefingRolesData.farmerQuestionFallbackEn
    },
    {
      id: 4,
      sender: "nasa",
      speakerNameAr: mission.nasaExpertNameAr || briefingRolesData.nasaDefaultNameAr,
      speakerNameEn: mission.nasaExpertNameEn || briefingRolesData.nasaDefaultNameEn,
      speakerRoleAr: briefingRolesData.nasaDefaultRoleAr,
      speakerRoleEn: briefingRolesData.nasaDefaultRoleEn,
      avatar: mission.nasaExpertImage || "/images/nasa_expert.jpg",
      textAr: briefingRolesData.nasaSolutionDialogueAr,
      textEn: briefingRolesData.nasaSolutionDialogueEn
    }
  ];

  // Chat State
  const [currentStep, setCurrentStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [revealedAll, setRevealedAll] = useState(false);
  const chatScrollRef = useRef(null);

  const activeMessage = dialogueList[currentStep] || dialogueList[0];
  const fullText = lang === 'ar' ? activeMessage.textAr : activeMessage.textEn;

  // Typewriter effect with automatic sequence progression
  useEffect(() => {
    if (revealedAll) {
      setTypedText(fullText);
      setIsTyping(false);
      return;
    }

    setTypedText('');
    setIsTyping(true);
    let idx = 0;
    let autoAdvanceTimeout = null;

    const timer = setInterval(() => {
      if (idx < fullText.length) {
        setTypedText(fullText.slice(0, idx + 1));
        idx++;
      } else {
        setIsTyping(false);
        clearInterval(timer);

        // Auto-advance to the next message after a natural reading pause
        if (currentStep < dialogueList.length - 1) {
          autoAdvanceTimeout = setTimeout(() => {
            setCurrentStep(prev => prev + 1);
          }, 1100);
        }
      }
    }, 14);

    return () => {
      clearInterval(timer);
      if (autoAdvanceTimeout) clearTimeout(autoAdvanceTimeout);
    };
  }, [currentStep, fullText, revealedAll, dialogueList.length]);

  // Auto-scroll chat container to bottom when messages update
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [currentStep, typedText, revealedAll]);

  const handleNextMessage = () => {
    if (isTyping) {
      setTypedText(fullText);
      setIsTyping(false);
      if (currentStep < dialogueList.length - 1) {
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 350);
      }
    } else if (currentStep < dialogueList.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onContinue();
    }
  };

  const handleRevealAll = () => {
    setRevealedAll(true);
    setCurrentStep(dialogueList.length - 1);
    setIsTyping(false);
  };

  const handleResetChat = () => {
    setRevealedAll(false);
    setCurrentStep(0);
    setIsTyping(true);
  };

  const farmerAvatar = mission.farmerImage || "/images/farmer_egypt.jpg";
  const nasaAvatar = mission.nasaExpertImage || "/images/nasa_expert.jpg";

  const isFarmerActive = !revealedAll && activeMessage.sender === 'farmer';
  const isNasaActive = !revealedAll && activeMessage.sender === 'nasa';

  return (
    <div className="lg:col-span-6 flex flex-col gap-2.5 min-h-0 overflow-hidden">
      
      {/* Top Panorama View */}
      <div
        className="w-full h-28 sm:h-32 bg-[#061633]/96 border border-cyan-400/40 relative overflow-hidden flex flex-col justify-between p-3 shadow-2xl shrink-0 rounded-2xl"
        style={{
          clipPath: 'polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)',
        }}
      >
        {/* Real Background Hero Image */}
        <div className="absolute inset-0">
          <img src={mission.heroImage} alt={mission.countryEn} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061021]/95 via-[#061021]/50 to-[#061021]/20" />
        </div>

        {/* Country Header Badge */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2 bg-[#061021]/90 backdrop-blur-md px-3 py-1 rounded-xl border border-cyan-400/40 shadow-sm">
            <span className="text-xl">{mission.flag}</span>
            <span className="text-sm sm:text-base font-black text-white">
              {lang === 'ar' ? mission.countryAr : mission.countryEn}
            </span>
            <span className="text-xs text-slate-300 font-bold">
              ({lang === 'ar' ? mission.regionAr : mission.regionEn})
            </span>
          </div>

          <div className="bg-[#061021]/90 backdrop-blur-md px-3 py-1 rounded-xl border border-cyan-400/40 text-xs font-black text-cyan-300 shadow-sm">
            {lang === 'ar' 
              ? `${briefingDialogueUiData.missionPrefixAr}${mission.code}` 
              : `${briefingDialogueUiData.missionPrefixEn}${mission.code}`}
          </div>
        </div>

        {/* Floating Speech Banner */}
        <div className="z-10 bg-[#091834]/95 backdrop-blur-md border border-cyan-400/40 px-3 py-1.5 max-w-[94%] self-end shadow-xl rounded-xl">
          <p className="text-xs sm:text-sm font-bold text-cyan-100 leading-tight italic truncate">
            "{lang === 'ar' ? mission.quoteBriefingAr : mission.quoteBriefingEn}"
          </p>
        </div>
      </div>

      {/* TWO-WAY INTERACTIVE DIALOGUE BOX */}
      <div
        className="p-3.5 bg-[#061633]/96 border border-cyan-400/50 flex-1 min-h-0 flex flex-col justify-between shadow-2xl relative overflow-hidden rounded-2xl"
        style={{
          clipPath: 'polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)',
        }}
      >
        {/* Title & Field Challenge Summary */}
        <div className="space-y-1 mb-2 pb-2 border-b border-cyan-500/20 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📋</span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white leading-tight">
                  {lang === 'ar' 
                    ? `${briefingDialogueUiData.diagnosisTitlePrefixAr}${mission.countryAr}` 
                    : `${briefingDialogueUiData.diagnosisTitlePrefixEn}${mission.countryEn}`}
                </h3>
                <p className="text-xs sm:text-sm text-cyan-300 font-bold">
                  {lang === 'ar' ? mission.titleAr : mission.titleEn}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleResetChat}
                title={lang === 'ar' ? briefingDialogueUiData.resetTooltipAr : briefingDialogueUiData.resetTooltipEn}
                className="p-1.5 bg-[#091d3d] hover:bg-cyan-600/30 border border-cyan-500/40 rounded-lg text-cyan-300 hover:text-white transition-all text-xs cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleRevealAll}
                title={lang === 'ar' ? briefingDialogueUiData.revealAllTooltipAr : briefingDialogueUiData.revealAllTooltipEn}
                className="px-2.5 py-1.5 bg-[#091d3d] hover:bg-cyan-600/30 border border-cyan-500/40 rounded-lg text-cyan-300 hover:text-white transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? briefingDialogueUiData.skipBtnAr : briefingDialogueUiData.skipBtnEn}</span>
              </button>
            </div>
          </div>

          {/* Climate Alert Banner */}
          <div className="p-2 bg-[#081730] border border-amber-500/40 rounded-lg">
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              <span className="font-bold text-amber-300 ml-1">
                ⚠️ {lang === 'ar' ? briefingDialogueUiData.fieldChallengeTagAr : briefingDialogueUiData.fieldChallengeTagEn}{' '}
              </span>
              {lang === 'ar' ? mission.descriptionAr : mission.descriptionEn}
            </p>
          </div>
        </div>

        {/* TWO CHARACTER AVATAR HEADERS */}
        <div className="grid grid-cols-2 gap-2 p-2 bg-[#041026]/90 border border-cyan-500/25 rounded-xl mb-2 shrink-0">
          
          {/* Farmer Profile */}
          <div className={`p-2 rounded-xl border transition-all flex items-center gap-2.5 ${
            isFarmerActive ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400/50 scale-[1.01]' : 'bg-[#071730]/60 border-white/10 opacity-75'
          }`}>
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 border-amber-400/70 shadow relative">
              <img src={farmerAvatar} alt="Farmer" className="w-full h-full object-cover" />
              <span className="absolute bottom-0.5 right-0.5 text-xs">{mission.flag}</span>
            </div>
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-black text-white truncate block">
                {lang === 'ar' ? mission.farmerNameAr : mission.farmerNameEn}
              </span>
              <span className="text-xs text-amber-300 font-bold truncate block">
                {lang === 'ar' ? briefingDialogueUiData.farmerRoleAr : briefingDialogueUiData.farmerRoleEn}
              </span>
              {isFarmerActive && (
                <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{lang === 'ar' ? briefingDialogueUiData.speakingAr : briefingDialogueUiData.speakingEn}</span>
                </span>
              )}
            </div>
          </div>

          {/* NASA Specialist Profile */}
          <div className={`p-2 rounded-xl border transition-all flex items-center gap-2.5 ${
            isNasaActive ? 'bg-cyan-500/15 border-cyan-400 ring-1 ring-cyan-300/50 scale-[1.01]' : 'bg-[#071730]/60 border-white/10 opacity-75'
          }`}>
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 border-cyan-400/70 shadow relative">
              <img src={nasaAvatar} alt="NASA Expert" className="w-full h-full object-cover" />
              <span className="absolute bottom-0.5 right-0.5 text-[8px] bg-blue-900 text-cyan-300 font-mono px-1 rounded">NASA</span>
            </div>
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-black text-white truncate block">
                {lang === 'ar' ? (mission.nasaExpertNameAr || briefingRolesData.nasaDefaultNameAr) : (mission.nasaExpertNameEn || briefingRolesData.nasaDefaultNameEn)}
              </span>
              <span className="text-xs text-cyan-300 font-bold truncate block">
                {lang === 'ar' ? briefingDialogueUiData.nasaRoleAr : briefingDialogueUiData.nasaRoleEn}
              </span>
              {isNasaActive && (
                <span className="text-[10px] text-cyan-300 font-bold flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{lang === 'ar' ? briefingDialogueUiData.speakingFemaleAr : briefingDialogueUiData.speakingFemaleEn}</span>
                </span>
              )}
            </div>
          </div>

        </div>

        {/* SCROLLABLE SEQUENTIAL CHAT MESSAGES STREAM */}
        <div
          ref={chatScrollRef}
          className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-2.5 pr-1 mb-2"
        >
          {dialogueList.map((msg, index) => {
            if (!revealedAll && index > currentStep) return null;

            const isCurrent = !revealedAll && index === currentStep;
            const isFarmer = msg.sender === 'farmer';
            const textContent = isCurrent ? typedText : (lang === 'ar' ? msg.textAr : msg.textEn);
            const avatarImg = isFarmer ? farmerAvatar : nasaAvatar;

            return (
              <div
                key={msg.id || index}
                className={`flex items-start gap-2.5 transition-all duration-300 ${
                  isFarmer ? 'justify-start' : 'justify-end'
                }`}
              >
                {isFarmer && (
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-amber-400/60 shadow">
                    <img src={avatarImg} alt={msg.speakerNameAr} className="w-full h-full object-cover" />
                  </div>
                )}

                <div
                  className={`p-3 max-w-[85%] rounded-2xl border transition-all text-xs sm:text-sm font-medium relative shadow-lg ${
                    isFarmer
                      ? 'bg-gradient-to-br from-[#0c264a] to-[#071830] border-amber-400/50 text-slate-100 rounded-tr-sm'
                      : 'bg-gradient-to-bl from-[#0a2e5c] to-[#061838] border-cyan-400/60 text-white rounded-tl-sm'
                  } ${isCurrent ? 'ring-2 ring-cyan-400/60 shadow-[0_0_16px_rgba(6,182,212,0.35)]' : ''}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1 pb-1 border-b border-white/10 text-xs font-black">
                    <span className={isFarmer ? 'text-amber-300' : 'text-cyan-300'}>
                      {lang === 'ar' ? msg.speakerNameAr : msg.speakerNameEn}
                    </span>
                    <span className="font-mono text-slate-400 text-xs">#{index + 1}</span>
                  </div>

                  <p className="leading-relaxed">
                    "{textContent}"
                    {isCurrent && isTyping && (
                      <span className="inline-block w-2 h-3.5 ml-1 bg-cyan-400 animate-pulse align-middle" />
                    )}
                  </p>

                  {isCurrent && isTyping && (
                    <div className="flex items-center gap-1.5 mt-1.5 pt-1 border-t border-white/10 text-xs text-cyan-300 font-bold">
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                      <span>
                        {lang === 'ar' ? briefingDialogueUiData.receivingCommsAr : briefingDialogueUiData.receivingCommsEn}
                      </span>
                    </div>
                  )}
                </div>

                {!isFarmer && (
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-cyan-400/70 shadow">
                    <img src={avatarImg} alt={msg.speakerNameAr} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Actions inside Center Panel */}
        <div className="flex items-center justify-between pt-2.5 border-t border-white/10 gap-3 shrink-0">
          <button
            onClick={handleNextMessage}
            className="py-2 px-4 bg-[#0e3160] hover:bg-[#144280] border border-cyan-400/60 rounded-xl text-xs sm:text-sm font-black text-cyan-200 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>
              {isTyping
                ? (lang === 'ar' ? briefingDialogueUiData.completeBtnAr : briefingDialogueUiData.completeBtnEn)
                : (currentStep < dialogueList.length - 1
                    ? (lang === 'ar' ? briefingDialogueUiData.nextBtnAr : briefingDialogueUiData.nextBtnEn)
                    : (lang === 'ar' ? briefingDialogueUiData.doneBtnAr : briefingDialogueUiData.doneBtnEn))}
            </span>
          </button>

          <button
            onClick={onContinue}
            className="py-2.5 px-6 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-black flex items-center gap-2 rounded-xl shadow-xl shadow-blue-500/40 transition-all hover:scale-105 cursor-pointer"
          >
            <span>
              {lang === 'ar' 
                ? briefingDialogueUiData.proceedToDecisionBtnAr 
                : briefingDialogueUiData.proceedToDecisionBtnEn}
            </span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

      </div>

    </div>
  );
}
