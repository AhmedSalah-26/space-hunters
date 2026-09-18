'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import StartScreen from '../components/StartScreen';
import UniversalRotationScreen from '../components/UniversalRotationScreen';
import WorldMapScreen from '../components/WorldMapScreen';
import MissionBriefingScreen from '../components/MissionBriefingScreen';
import DecisionMatrixScreen from '../components/DecisionMatrixScreen';
import ResultsDashboardScreen from '../components/ResultsDashboardScreen';
import AgriBankModal from '../components/AgriBankModal';
import GameGuideModal from '../components/GameGuideModal';
import LeaderboardModal from '../components/LeaderboardModal';
import { missionsData } from '../data/missionsData';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { lang } = useLanguage();
  const [activeNavTab, setActiveNavTab] = useState(null); // 'agriBank' | 'gameGuide' | 'leaderboard' | null
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start' | 'map' | 'briefing' | 'decision' | 'results' | 'universalBuilder'
  const [selectedMission, setSelectedMission] = useState(missionsData[0]);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [playerCustomSequence, setPlayerCustomSequence] = useState(null);

  // Transitions from Start Screen
  const handleStartGame = () => {
    setCurrentScreen('map');
  };

  const handleOpenAgriBank = () => {
    setActiveNavTab('agriBank');
  };

  const handleOpenSequenceBuilder = () => {
    setCurrentScreen('universalBuilder');
  };

  const handleOpenGameGuide = () => {
    setActiveNavTab('gameGuide');
  };

  const handleOpenLeaderboard = () => {
    setActiveNavTab('leaderboard');
  };

  // Game flow Transitions
  const handleStartMission = () => {
    setCurrentScreen('briefing');
  };

  const handleContinueToDecision = () => {
    setCurrentScreen('decision');
  };

  const handleDecisionSubmit = (rotationId, customSequence) => {
    setPlayerChoice(rotationId);
    setPlayerCustomSequence(customSequence);
    setCurrentScreen('results');
  };

  const handleBackToMap = () => {
    setCurrentScreen('map');
    setActiveNavTab(null);
  };

  const handleGoHome = () => {
    setCurrentScreen('start');
    setActiveNavTab(null);
  };

  const handleNextMission = () => {
    const currentIndex = missionsData.findIndex(m => m.id === selectedMission.id);
    const nextIndex = (currentIndex + 1) % missionsData.length;
    setSelectedMission(missionsData[nextIndex]);
    setCurrentScreen('briefing');
  };

  return (
    <main className="min-h-screen lg:h-screen lg:max-h-screen bg-[#040915] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0d1e3d] via-[#050c1b] to-[#02050c] flex flex-col justify-between relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* Background Starfield Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[600px] h-[300px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Global Navbar (Shown on Map view, with home button returning to start screen) */}
      {currentScreen === 'map' && (
        <Navbar
          activeTab="map"
          setActiveTab={(tab) => {
            if (tab === 'map') handleBackToMap();
            else setActiveNavTab(tab);
          }}
          onGoHome={handleGoHome}
        />
      )}

      {/* Dynamic Screen View - Takes full remaining vertical space */}
      <div className="flex-1 min-h-0 flex flex-col justify-start md:justify-center relative z-10 w-full overflow-y-auto lg:overflow-hidden">
        
        {/* 🌟 1. START / LANDING SCREEN 🌟 */}
        {currentScreen === 'start' && (
          <StartScreen
            onStartGame={handleStartGame}
            onOpenAgriBank={handleOpenAgriBank}
            onOpenSequenceBuilder={handleOpenSequenceBuilder}
            onOpenGameGuide={handleOpenGameGuide}
            onOpenLeaderboard={handleOpenLeaderboard}
          />
        )}

        {/* 🔬 2. UNIVERSAL CROP ROTATION SANDBOX (ALL CROPS DATABASE) 🔬 */}
        {currentScreen === 'universalBuilder' && (
          <UniversalRotationScreen
            onBack={handleGoHome}
          />
        )}

        {/* 🗺️ 3. WORLD MISSIONS MAP 🗺️ */}
        {currentScreen === 'map' && (
          <WorldMapScreen
            missions={missionsData}
            selectedMission={selectedMission}
            setSelectedMission={setSelectedMission}
            onStartMission={handleStartMission}
          />
        )}

        {/* 📋 4. MISSION BRIEFING & DIALOGUE 📋 */}
        {currentScreen === 'briefing' && (
          <MissionBriefingScreen
            mission={selectedMission}
            onBack={handleBackToMap}
            onContinue={handleContinueToDecision}
          />
        )}

        {/* 🔄 5. COUNTRY MISSION CROP ROTATION DECISION & BUILDER 🔄 */}
        {currentScreen === 'decision' && (
          <DecisionMatrixScreen
            mission={selectedMission}
            onBack={() => {
              if (currentScreen === 'decision' && !playerChoice) {
                handleBackToMap();
              } else {
                setCurrentScreen('briefing');
              }
            }}
            onDecisionSubmit={handleDecisionSubmit}
          />
        )}

        {/* 🏆 6. RESULTS & CERTIFICATION DASHBOARD 🏆 */}
        {currentScreen === 'results' && (
          <ResultsDashboardScreen
            mission={selectedMission}
            playerChoice={playerChoice}
            playerCustomSequence={playerCustomSequence}
            onBackToMap={handleBackToMap}
            onNextMission={handleNextMission}
          />
        )}
      </div>

      {/* Persistent Space Apps Challenge 2026 Slim Footer */}
      <footer className="w-full min-h-7 py-1 px-2.5 sm:px-4 border-t border-white/5 bg-[#030712]/95 backdrop-blur-md text-[8.5px] sm:text-[9.5px] text-slate-500 flex flex-wrap items-center justify-between gap-1 shrink-0 z-20">
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="text-cyan-400 font-black">NASA SPACE APPS 2026</span>
          <span>•</span>
          <span>Team Space Hunters</span>
        </div>
        
        <div className="text-slate-400 font-medium truncate max-w-[240px] sm:max-w-none">
          {lang === 'ar' ? 'تحدي Field Shift: Adapting Farms with NASA Data' : 'Field Shift: Adapting Farms with NASA Data'}
        </div>
      </footer>

      {/* Top Modals (Available on all screens) */}
      <AgriBankModal
        isOpen={activeNavTab === 'agriBank'}
        onClose={() => setActiveNavTab(null)}
      />

      <GameGuideModal
        isOpen={activeNavTab === 'gameGuide'}
        onClose={() => setActiveNavTab(null)}
      />

      <LeaderboardModal
        isOpen={activeNavTab === 'leaderboard'}
        onClose={() => setActiveNavTab(null)}
      />

    </main>
  );
}
