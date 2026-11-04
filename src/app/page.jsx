'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import AppNavigation from '../components/AppNavigation';
import StartScreen from '../components/StartScreen';
import WorldMapScreen from '../components/WorldMapScreen';
import MissionBriefingScreen from '../components/MissionBriefingScreen';
import DecisionMatrixScreen from '../components/DecisionMatrixScreen';
import ResultsDashboardScreen from '../components/ResultsDashboardScreen';
import MissionTerminal from '../components/MissionTerminal';
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
  const [playerEvaluation, setPlayerEvaluation] = useState(null);
  const [terminalStartStep, setTerminalStartStep] = useState(0);
  const currentScreenRef = useRef('start');
  const navigationIndexRef = useRef(0);
  const navigationScreensRef = useRef(['start']);

  // Navigate to screen with full Browser History & URL Hash support
  const navigateToScreen = useCallback((screenName, replace = false) => {
    const previousScreen = currentScreenRef.current;
    setCurrentScreen(screenName);
    currentScreenRef.current = screenName;
    setActiveNavTab(null);
    if (typeof window !== 'undefined') {
      const hash = `#${screenName}`;
      if (replace) {
        const navIndex = navigationIndexRef.current;
        navigationScreensRef.current[navIndex] = screenName;
        window.history.replaceState({ screen: screenName, modal: null, navIndex }, '', hash);
      } else if (previousScreen !== screenName || window.location.hash !== hash) {
        const navIndex = navigationIndexRef.current + 1;
        navigationScreensRef.current = navigationScreensRef.current.slice(0, navIndex);
        navigationScreensRef.current[navIndex] = screenName;
        navigationIndexRef.current = navIndex;
        window.history.pushState({ screen: screenName, modal: null, navIndex }, '', hash);
      }
    }
  }, []);

  // Modal open with history push so browser back closes modal first
  const handleOpenModal = useCallback((modalName) => {
    setActiveNavTab(modalName);
    if (typeof window !== 'undefined') {
      const current = window.location.hash.split('?')[0] || `#${currentScreen}`;
      window.history.pushState({ screen: currentScreen, modal: modalName, navIndex: navigationIndexRef.current }, '', `${current}?modal=${modalName}`);
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
    currentScreenRef.current = initial.screen;
    if (initial.modal) setActiveNavTab(initial.modal);

    // A direct workflow link gets a safe in-app Back destination instead of
    // relying on whatever external page happened to open it.
    if (initial.screen === 'start') {
      navigationIndexRef.current = 0;
      navigationScreensRef.current = ['start'];
      window.history.replaceState({ screen: 'start', modal: initial.modal, navIndex: 0 }, '', initial.modal ? '#start?modal=' + initial.modal : '#start');
    } else {
      navigationIndexRef.current = 1;
      navigationScreensRef.current = ['start', initial.screen];
      window.history.replaceState({ screen: 'start', modal: null, navIndex: 0 }, '', '#start');
      window.history.pushState({ screen: initial.screen, modal: initial.modal, navIndex: 1 }, '', initial.modal ? `#${initial.screen}?modal=${initial.modal}` : `#${initial.screen}`);
    }

    const onPopState = (e) => {
      if (e.state && e.state.screen && VALID_SCREENS.includes(e.state.screen)) {
        setCurrentScreen(e.state.screen);
        currentScreenRef.current = e.state.screen;
        setActiveNavTab(e.state.modal || null);
        if (Number.isInteger(e.state.navIndex)) navigationIndexRef.current = e.state.navIndex;
      } else {
        const parsed = parseUrl();
        setCurrentScreen(parsed.screen);
        currentScreenRef.current = parsed.screen;
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
    setTerminalStartStep(0);
    navigateToScreen('farmPro');
  };

  const handleOpenFarmData = () => {
    setTerminalStartStep(1);
    navigateToScreen('farmPro');
  };

  const handleOpenAgriBank = () => {
    handleOpenModal('agriBank');
  };

  const handleOpenSequenceBuilder = () => {
    setTerminalStartStep(3);
    navigateToScreen('farmPro');
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

  const handleDecisionSubmit = (rotationId, customSequence, evaluation) => {
    setPlayerChoice(rotationId);
    setPlayerCustomSequence(customSequence);
    setPlayerEvaluation(evaluation);
    navigateToScreen('results');
  };

  const handleBack = () => {
    if (activeNavTab) {
      handleCloseModal();
      return;
    }
    if (navigationIndexRef.current > 0 && typeof window !== 'undefined') window.history.back();
    else navigateToScreen('start', true);
  };

  const handleGoHome = () => navigateToScreen('start');

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

      {currentScreen !== 'start' && <AppNavigation
        currentScreen={currentScreen}
        onBack={handleBack}
        onHome={handleGoHome}
        onOpenMap={() => navigateToScreen('map')}
        onOpenFarm={() => { setTerminalStartStep(0); navigateToScreen('farmPro'); }}
        onOpenAgriBank={handleOpenAgriBank}
        onOpenGameGuide={handleOpenGameGuide}
      />}

      {/* Dynamic Screen View - Takes full remaining vertical space */}
      <div className={`flex-1 min-h-0 flex flex-col relative z-10 w-full ${
        currentScreen === 'map' || currentScreen === 'farmPro' || currentScreen === 'universalBuilder' ? 'overflow-hidden' : 'overflow-y-auto justify-start md:justify-center'
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
          <MissionTerminal
            onOpenGame={handleStartGame}
            onWorkflowStepChange={setTerminalStartStep}
            initialStep={terminalStartStep}
          />
        )}

        {/* 🔬 3. UNIVERSAL CROP ROTATION SANDBOX (ALL CROPS DATABASE) 🔬 */}
        {currentScreen === 'universalBuilder' && (
          <MissionTerminal onOpenGame={handleStartGame} onWorkflowStepChange={setTerminalStartStep} initialStep={3} />
        )}

        {/* 🗺️ 4. WORLD MISSIONS MAP 🗺️ */}
        {currentScreen === 'map' && (
          <WorldMapScreen
            missions={missionsData}
            selectedMission={selectedMission}
            setSelectedMission={setSelectedMission}
            onStartMission={handleStartMission}
            onOpenFarmData={handleOpenFarmData}
          />
        )}

        {/* 📋 5. MISSION BRIEFING & DIALOGUE 📋 */}
        {currentScreen === 'briefing' && (
          <MissionBriefingScreen
            mission={selectedMission}
            onContinue={handleContinueToDecision}
            onOpenFarmData={handleOpenFarmData}
          />
        )}

        {/* 🔄 6. COUNTRY MISSION CROP ROTATION DECISION & BUILDER 🔄 */}
        {currentScreen === 'decision' && (
          <DecisionMatrixScreen
            mission={selectedMission}
            onDecisionSubmit={handleDecisionSubmit}
          />
        )}

        {/* 🏆 7. RESULTS & CERTIFICATION DASHBOARD 🏆 */}
        {currentScreen === 'results' && (
          <ResultsDashboardScreen
            mission={selectedMission}
            playerChoice={playerChoice}
            playerCustomSequence={playerCustomSequence}
            playerEvaluation={playerEvaluation}
            onNextMission={handleNextMission}
          />
        )}
      </div>

      {/* Persistent Space Apps Challenge 2026 Slim Footer - Hidden on Map screen on mobile */}
      <footer className={`w-full min-h-7 py-1 px-2.5 sm:px-4 border-t border-white/5 bg-[#030712]/95 backdrop-blur-md text-[8.5px] sm:text-[9.5px] text-slate-500 flex flex-wrap items-center justify-between gap-1 shrink-0 z-20 ${
        ['map', 'farmPro', 'universalBuilder'].includes(currentScreen) ? 'hidden sm:flex' : 'flex'
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
