'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import StartScreen from '../components/StartScreen';
import UniversalRotationScreen from '../components/UniversalRotationScreen';
import WorldMapScreen from '../components/WorldMapScreen';
import MissionBriefingScreen from '../components/MissionBriefingScreen';
import DecisionMatrixScreen from '../components/DecisionMatrixScreen';
import ResultsDashboardScreen from '../components/ResultsDashboardScreen';
import FarmProStudio from '../components/farmPro/FarmProStudio';
import AgriBankModal from '../components/AgriBankModal';
import GameGuideModal from '../components/GameGuideModal';
import { missionsData } from '../data/missionsData';
import { useLanguage } from '../context/LanguageContext';

const VALID_SCREENS = ['start', 'map', 'briefing', 'decision', 'results', 'universalBuilder', 'farmPro'];

export default function Home() {
  const { lang } = useLanguage();
  const [activeNavTab, setActiveNavTab] = useState(null); // 'agriBank' | 'gameGuide' | null
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start' | 'map' | 'briefing' | 'decision' | 'results' | 'universalBuilder' | 'farmPro'
  const [selectedMission, setSelectedMission] = useState(missionsData[0]);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [playerCustomSequence, setPlayerCustomSequence] = useState(null);

  // Navigate to screen with full Browser History & URL Hash support
  const navigateToScreen = useCallback((screenName, replace = false) => {
    setCurrentScreen(screenName);
    setActiveNavTab(null);
    if (typeof window !== 'undefined') {
      const hash = `#${screenName}`;
      if (window.location.hash !== hash) {
        if (replace) {
          window.history.replaceState({ screen: screenName, modal: null }, '', hash);
        } else {
          window.history.pushState({ screen: screenName, modal: null }, '', hash);
        }
      }
    }
  }, []);

  // Modal open with history push so browser back closes modal first
  const handleOpenModal = useCallback((modalName) => {
    setActiveNavTab(modalName);
    if (typeof window !== 'undefined') {
      const current = window.location.hash.split('?')[0] || `#${currentScreen}`;
      window.history.pushState({ screen: currentScreen, modal: modalName }, '', `${current}?modal=${modalName}`);
    }
  }, [currentScreen]);

  const handleCloseModal = useCallback(() => {
    setActiveNavTab(null);
    if (typeof window !== 'undefined' && window.location.hash.includes('?modal=')) {
      window.history.back();
    }
  }, []);

  // Sync with Browser History Back/Forward (popstate)
  useEffect(() => {
    const parseUrl = () => {
      const raw = window.location.hash.replace('#', '') || 'start';
      const [screenPart, queryPart] = raw.split('?');
      const screen = VALID_SCREENS.includes(screenPart) ? screenPart : 'start';
      
      let modal = null;
      if (queryPart && queryPart.includes('modal=')) {
        const m = queryPart.replace('modal=', '');
        if (['agriBank', 'gameGuide'].includes(m)) modal = m;
      }
      return { screen, modal };
    };

    const initial = parseUrl();
    setCurrentScreen(initial.screen);
    if (initial.modal) setActiveNavTab(initial.modal);

    // Initial state record
    window.history.replaceState(
      { screen: initial.screen, modal: initial.modal },
      '',
      initial.modal ? `#${initial.screen}?modal=${initial.modal}` : `#${initial.screen}`
    );

    const onPopState = (e) => {
      if (e.state && e.state.screen && VALID_SCREENS.includes(e.state.screen)) {
        setCurrentScreen(e.state.screen);
        setActiveNavTab(e.state.modal || null);
      } else {
        const parsed = parseUrl();
        setCurrentScreen(parsed.screen);
        setActiveNavTab(parsed.modal);
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  // Transitions from Start Screen
  const handleStartGame = () => {
    navigateToScreen('map');
  };

  const handleOpenFarmPro = () => {
    navigateToScreen('farmPro');
  };

  const handleOpenAgriBank = () => {
    handleOpenModal('agriBank');
  };

  const handleOpenSequenceBuilder = () => {
    navigateToScreen('universalBuilder');
  };

  const handleOpenGameGuide = () => {
    handleOpenModal('gameGuide');
  };

  // Game flow Transitions
  const handleStartMission = () => {
    navigateToScreen('briefing');
  };

  const handleContinueToDecision = () => {
    navigateToScreen('decision');
  };

  const handleDecisionSubmit = (rotationId, customSequence) => {
    setPlayerChoice(rotationId);
    setPlayerCustomSequence(customSequence);
    navigateToScreen('results');
  };

  const handleBackToMap = () => {
    if (typeof window !== 'undefined' && window.location.hash.includes('briefing')) {
      window.history.back();
    } else {
      navigateToScreen('map');
    }
  };

  const handleGoHome = () => {
    if (typeof window !== 'undefined' && (window.location.hash.includes('farmPro') || window.location.hash.includes('map') || window.location.hash.includes('universalBuilder'))) {
      window.history.back();
    } else {
      navigateToScreen('start');
    }
  };

  const handleNextMission = () => {
    const currentIndex = missionsData.findIndex(m => m.id === selectedMission.id);
    const nextIndex = (currentIndex + 1) % missionsData.length;
    setSelectedMission(missionsData[nextIndex]);
    navigateToScreen('briefing', true);
  };

  return (
    <main className="h-full bg-[#040915] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0d1e3d] via-[#050c1b] to-[#02050c] flex flex-col relative overflow-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* Background Starfield Glow (Fixed & GPU-accelerated) */}
      <div 
        className="fixed top-0 left-1/2 w-[1000px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" 
        style={{ transform: 'translate3d(-50%, 0, 0)' }}
      />
      <div 
        className="fixed bottom-0 right-10 w-[600px] h-[300px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" 
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Global Navbar (Shown on Map view, with home button returning to start screen) */}
      {currentScreen === 'map' && (
        <Navbar
          activeTab="map"
          setActiveTab={(tab) => {
            if (tab === 'map') handleBackToMap();
            else if (tab === 'farmPro') handleOpenFarmPro();
            else handleOpenModal(tab);
          }}
          onGoHome={handleGoHome}
          onOpenFarmPro={handleOpenFarmPro}
        />
      )}

      {/* Dynamic Screen View - Takes full remaining vertical space */}
      <div className={`flex-1 min-h-0 flex flex-col relative z-10 w-full ${
        currentScreen === 'map' ? 'overflow-hidden' : 'overflow-y-auto justify-start md:justify-center'
      }`}>
        
        {/* 🌟 1. START / LANDING SCREEN 🌟 */}
        {currentScreen === 'start' && (
          <StartScreen
            onStartGame={handleStartGame}
            onOpenFarmPro={handleOpenFarmPro}
            onOpenAgriBank={handleOpenAgriBank}
            onOpenSequenceBuilder={handleOpenSequenceBuilder}
            onOpenGameGuide={handleOpenGameGuide}
          />
        )}

        {/* 🛰️ 2. FARM PRO DECISION STUDIO & FIELD BOUNDARY DETECTOR 🛰️ */}
        {currentScreen === 'farmPro' && (
          <FarmProStudio
            onBackToHome={handleGoHome}
            onOpenGame={handleStartGame}
          />
        )}

        {/* 🔬 3. UNIVERSAL CROP ROTATION SANDBOX (ALL CROPS DATABASE) 🔬 */}
        {currentScreen === 'universalBuilder' && (
          <UniversalRotationScreen
            onBack={handleGoHome}
          />
        )}

        {/* 🗺️ 4. WORLD MISSIONS MAP 🗺️ */}
        {currentScreen === 'map' && (
          <WorldMapScreen
            missions={missionsData}
            selectedMission={selectedMission}
            setSelectedMission={setSelectedMission}
            onStartMission={handleStartMission}
          />
        )}

        {/* 📋 5. MISSION BRIEFING & DIALOGUE 📋 */}
        {currentScreen === 'briefing' && (
          <MissionBriefingScreen
            mission={selectedMission}
            onBack={handleBackToMap}
            onContinue={handleContinueToDecision}
          />
        )}

        {/* 🔄 6. COUNTRY MISSION CROP ROTATION DECISION & BUILDER 🔄 */}
        {currentScreen === 'decision' && (
          <DecisionMatrixScreen
            mission={selectedMission}
            onBack={() => {
              if (typeof window !== 'undefined' && window.location.hash.includes('decision')) {
                window.history.back();
              } else {
                navigateToScreen('briefing');
              }
            }}
            onDecisionSubmit={handleDecisionSubmit}
          />
        )}

        {/* 🏆 7. RESULTS & CERTIFICATION DASHBOARD 🏆 */}
        {currentScreen === 'results' && (
          <ResultsDashboardScreen
            mission={selectedMission}
            playerChoice={playerChoice}
            playerCustomSequence={playerCustomSequence}
            onBackToMap={() => navigateToScreen('map')}
            onNextMission={handleNextMission}
          />
        )}
      </div>

      {/* Persistent Space Apps Challenge 2026 Slim Footer - Hidden on Map screen on mobile */}
      <footer className={`w-full min-h-7 py-1 px-2.5 sm:px-4 border-t border-white/5 bg-[#030712]/95 backdrop-blur-md text-[8.5px] sm:text-[9.5px] text-slate-500 flex flex-wrap items-center justify-between gap-1 shrink-0 z-20 ${
        currentScreen === 'map' ? 'hidden sm:flex' : 'flex'
      }`}>
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
        onClose={handleCloseModal}
      />

      <GameGuideModal
        isOpen={activeNavTab === 'gameGuide'}
        onClose={handleCloseModal}
      />

    </main>
  );
}
