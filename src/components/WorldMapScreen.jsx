'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { geoNaturalEarth1 } from 'd3-geo';
import { useLanguage } from '../context/LanguageContext';
import { Compass } from 'lucide-react';
import WorldMapSvg from './map/WorldMapSvg';
import MapLegendSidebar from './map/MapLegendSidebar';
import MissionDetailCard from './map/MissionDetailCard';
import MissionsCarousel from './map/MissionsCarousel';
import { mapControlsData } from '../data/worldMapData';

/* MISSION GEOGRAPHIC COORDINATES */
const MISSION_GEO = {
  egypt: [30.8, 26.8],
  brazil: [-52.0, -10.5],
  india: [79.5, 22.5],
  usa: [-98.5, 38.5],
  australia: [134.0, -26.5],
};

/* SVG VIEWBOX DIMENSIONS */
const W = 960, H = 520;

export default function WorldMapScreen({ missions, selectedMission, setSelectedMission, onStartMission }) {
  const { lang, isRtl } = useLanguage();

  /* ── Mobile View State: 'map' | 'details' | 'missions' | 'legend' ── */
  const [mobileView, setMobileView] = useState('map');

  /* ── Interactive Map Drag / Panning State ── */
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  /* ── build projection once ── */
  const project = useMemo(() => {
    return geoNaturalEarth1()
      .scale(118)
      .translate([W / 2 + 55, H / 2 - 95]);
  }, []);

  /* ── mission beacon projected pixel positions ── */
  const beaconPositions = useMemo(() =>
    Object.fromEntries(
      missions.map(m => {
        const coords = MISSION_GEO[m.id] || [0, 0];
        const [bx, by] = project(coords);
        return [m.id, { x: bx, y: by }];
      })
    ),
    [missions, project]);

  /* ── Calculate Pan offset to center map perfectly on selected mission ── */
  const recenterMap = (targetMission) => {
    const m = targetMission || selectedMission;
    if (m && beaconPositions[m.id]) {
      const pos = beaconPositions[m.id];
      if (pos && !isNaN(pos.x) && !isNaN(pos.y)) {
        const targetX = (W / 2 + 55) - pos.x;
        const targetY = (H / 2 - 95) - pos.y;
        const clampedX = Math.max(-280, Math.min(280, targetX));
        const clampedY = Math.max(-220, Math.min(100, targetY));
        setPan({ x: clampedX, y: clampedY });
      }
    } else {
      setPan({ x: 0, y: 0 });
    }
  };

  /* Auto-recenter when selectedMission changes */
  useEffect(() => {
    if (selectedMission?.id && beaconPositions[selectedMission.id]) {
      const pos = beaconPositions[selectedMission.id];
      if (pos && !isNaN(pos.x)) {
        const targetX = Math.max(-280, Math.min(280, (W / 2 + 55) - pos.x));
        const targetY = Math.max(-220, Math.min(100, (H / 2 - 95) - pos.y));
        setPan({ x: targetX, y: targetY });
      }
    }
  }, [selectedMission, beaconPositions]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const nextX = Math.max(-280, Math.min(280, dragStartRef.current.panX + dx));
    const nextY = Math.max(-140, Math.min(140, dragStartRef.current.panY + dy));
    setPan({ x: nextX, y: nextY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  /* ── Touch Drag Panning for Mobile ── */
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        panX: pan.x,
        panY: pan.y,
      };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    const nextX = Math.max(-280, Math.min(280, dragStartRef.current.panX + dx));
    const nextY = Math.max(-140, Math.min(140, dragStartRef.current.panY + dy));
    setPan({ x: nextX, y: nextY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  /* ── Carousel Navigation Handlers ── */
  const handlePrevMission = () => {
    const currentIndex = missions.findIndex(m => m.id === selectedMission.id);
    const prevIndex = (currentIndex - 1 + missions.length) % missions.length;
    setSelectedMission(missions[prevIndex]);
  };

  const handleNextMission = () => {
    const currentIndex = missions.findIndex(m => m.id === selectedMission.id);
    const nextIndex = (currentIndex + 1) % missions.length;
    setSelectedMission(missions[nextIndex]);
  };

  return (
    <div
      className="relative w-full max-w-[1600px] mx-auto h-full max-h-full min-h-[520px] sm:min-h-0 overflow-hidden border border-cyan-500/30 bg-[#040c1a] shadow-2xl flex flex-col justify-between"
      style={{
        clipPath: 'polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)',
      }}
    >
      {/* ═══════════════════════════════════════════════════════════
          MOBILE TOP HUD TAB SWITCHER (Visible on screens < lg)
          ═══════════════════════════════════════════════════════════ */}
      <div className="lg:hidden z-30 p-2 bg-[#051329]/95 border-b border-cyan-500/30 flex items-center justify-between gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
        {[
          { id: 'map', label: lang === 'ar' ? '🗺️ الخريطة' : '🗺️ Map' },
          { id: 'details', label: lang === 'ar' ? '📋 التفاصيل' : '📋 Details' },
          { id: 'missions', label: lang === 'ar' ? '🎯 المهمات' : '🎯 Missions' },
          { id: 'legend', label: lang === 'ar' ? '📊 الدليل' : '📊 Legend' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMobileView(tab.id)}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black whitespace-nowrap transition-all cursor-pointer ${
              mobileView === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                : 'bg-[#081838] border border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          BACKGROUND WORLD MAP
          ═══════════════════════════════════════════════════════════ */}
      <div
        className={`absolute inset-0 w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          background: 'radial-gradient(ellipse 130% 100% at 50% 45%, #071c3d 0%, #040e21 60%, #020712 100%)',
        }}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(56,189,248,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.04) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
        }} />

        {/* Glow vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 80px 25px rgba(2,7,18,0.85)' }} />

        {/* Compass Widget / Recenter Selected Mission Button */}
        <div
          onClick={(e) => { e.stopPropagation(); recenterMap(); }}
          className="absolute top-12 lg:top-3 left-3 lg:left-[250px] z-30 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#061633]/95 border border-cyan-400/50 hover:border-cyan-300 text-cyan-300 hover:text-white rounded-lg backdrop-blur-md shadow-xl pointer-events-auto cursor-pointer transition-all active:scale-95 group"
          title={lang === 'ar' ? mapControlsData.recenterTooltipAr : mapControlsData.recenterTooltipEn}
        >
          <Compass className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300 transition-transform group-hover:rotate-45 ${isDragging ? 'animate-spin' : ''}`} />
          <span className="text-[9.5px] sm:text-[10.5px] font-mono font-black tracking-wider">
            {lang === 'ar' ? mapControlsData.recenterBtnAr : mapControlsData.recenterBtnEn}
          </span>
        </div>

        {/* ══ SVG MAP COMPONENT ══ */}
        <WorldMapSvg
          width={W}
          height={H}
          pan={pan}
          isDragging={isDragging}
          missions={missions}
          selectedMission={selectedMission}
          setSelectedMission={(m) => {
            setSelectedMission(m);
            if (window.innerWidth < 1024) {
              // On mobile, tapping a country beacon can stay on map or open details
            }
          }}
          beaconPositions={beaconPositions}
          project={project}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE FLOATING BOTTOM HUD BAR (Visible on Mobile Map mode)
          ═══════════════════════════════════════════════════════════ */}
      <div className="lg:hidden absolute bottom-2 left-2 right-2 z-30 pointer-events-auto">
        {mobileView === 'map' && (
          <div className="p-2.5 bg-[#051329]/96 border border-cyan-400/50 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              {/* Mission Flag & Name */}
              <div
                onClick={() => setMobileView('details')}
                className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
              >
                <span className="text-2xl">{selectedMission.flag}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-black text-white truncate">
                      {lang === 'ar' ? selectedMission.countryAr : selectedMission.countryEn}
                    </h3>
                    <span className="text-[10px] font-mono text-cyan-300 bg-blue-950 px-1.5 py-0.2 rounded border border-cyan-500/30">
                      #{selectedMission.code}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-cyan-300 font-bold truncate">
                    {lang === 'ar' ? selectedMission.titleAr : selectedMission.titleEn}
                  </p>
                </div>
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handlePrevMission}
                  className="w-7 h-7 bg-[#0a1e3f] border border-cyan-400/50 rounded-lg flex items-center justify-center text-cyan-300 active:scale-90"
                >
                  ◀
                </button>
                <button
                  onClick={handleNextMission}
                  className="w-7 h-7 bg-[#0a1e3f] border border-cyan-400/50 rounded-lg flex items-center justify-center text-cyan-300 active:scale-90"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileView('details')}
                className="flex-1 py-2 px-2.5 bg-[#081f42] hover:bg-[#0c2a5c] border border-cyan-400/40 rounded-xl text-xs font-black text-cyan-200 transition-all text-center"
              >
                📋 {lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
              </button>
              <button
                onClick={onStartMission}
                className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/40 transition-all active:scale-95 text-center flex items-center justify-center gap-1"
              >
                <span>{lang === 'ar' ? '🚀 ابدأ المهمة' : '🚀 Start Mission'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE OVERLAY MODALS (Details / Missions / Legend on Mobile)
          ═══════════════════════════════════════════════════════════ */}
      {mobileView === 'details' && (
        <div className="lg:hidden absolute inset-0 z-30 p-2.5 bg-black/85 backdrop-blur-md overflow-y-auto flex flex-col justify-start">
          <MissionDetailCard
            selectedMission={selectedMission}
            onStartMission={onStartMission}
            className="w-full max-w-lg mx-auto p-3.5 bg-[#061633]/98 border border-cyan-400/60 shadow-2xl backdrop-blur-xl flex flex-col gap-3 rounded-2xl"
            isMobile={true}
            onCloseMobile={() => setMobileView('map')}
          />
        </div>
      )}

      {mobileView === 'missions' && (
        <div className="lg:hidden absolute inset-0 z-30 p-2.5 bg-black/85 backdrop-blur-md overflow-y-auto flex flex-col justify-start">
          <div className="w-full max-w-lg mx-auto">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setMobileView('map')}
                className="px-3 py-1 bg-[#061633] border border-cyan-400/40 rounded-xl text-xs font-bold text-slate-300"
              >
                ✕ {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
            <MissionsCarousel
              missions={missions}
              selectedMission={selectedMission}
              setSelectedMission={(m) => {
                setSelectedMission(m);
                setMobileView('details');
              }}
              onPrevMission={handlePrevMission}
              onNextMission={handleNextMission}
              className="w-full block"
              isMobile={true}
            />
          </div>
        </div>
      )}

      {mobileView === 'legend' && (
        <div className="lg:hidden absolute inset-0 z-30 p-2.5 bg-black/85 backdrop-blur-md overflow-y-auto flex flex-col justify-start">
          <div className="w-full max-w-lg mx-auto">
            <MapLegendSidebar
              className="w-full flex flex-col gap-2 p-1"
              isMobile={true}
              onCloseMobile={() => setMobileView('map')}
            />
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          DESKTOP FLOATING HUD OVERLAYS (Shown on lg:block)
          ═══════════════════════════════════════════════════════════ */}
      <MapLegendSidebar />

      <MissionDetailCard
        selectedMission={selectedMission}
        onStartMission={onStartMission}
      />

      <MissionsCarousel
        missions={missions}
        selectedMission={selectedMission}
        setSelectedMission={setSelectedMission}
        onPrevMission={handlePrevMission}
        onNextMission={handleNextMission}
      />

    </div>
  );
}
