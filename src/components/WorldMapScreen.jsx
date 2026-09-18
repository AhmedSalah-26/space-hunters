'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { geoNaturalEarth1 } from 'd3-geo';
import { useLanguage } from '../context/LanguageContext';
import { Compass, Globe, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
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

  /* ── Responsive Screen Width Detection ── */
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* ── Mobile View State: 'map' | 'details' | 'missions' | 'legend' ── */
  const [mobileView, setMobileView] = useState('map');

  /* ── Interactive Map Drag / Panning State ── */
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  /* ── build projection (dynamic scale for mobile) ── */
  const project = useMemo(() => {
    const scale = isMobile ? 155 : 118;
    const tx = isMobile ? W / 2 + 25 : W / 2 + 55;
    const ty = isMobile ? H / 2 - 30 : H / 2 - 95;
    return geoNaturalEarth1()
      .scale(scale)
      .translate([tx, ty]);
  }, [isMobile]);

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
    const cx = isMobile ? W / 2 + 25 : W / 2 + 55;
    const cy = isMobile ? H / 2 - 30 : H / 2 - 95;
    if (m && beaconPositions[m.id]) {
      const pos = beaconPositions[m.id];
      if (pos && !isNaN(pos.x) && !isNaN(pos.y)) {
        const targetX = cx - pos.x;
        const targetY = cy - pos.y;
        const clampedX = Math.max(-360, Math.min(360, targetX));
        const clampedY = Math.max(-260, Math.min(180, targetY));
        setPan({ x: clampedX, y: clampedY });
      }
    } else {
      setPan({ x: 0, y: 0 });
    }
  };

  /* Auto-recenter when selectedMission changes */
  useEffect(() => {
    const cx = isMobile ? W / 2 + 25 : W / 2 + 55;
    const cy = isMobile ? H / 2 - 30 : H / 2 - 95;
    if (selectedMission?.id && beaconPositions[selectedMission.id]) {
      const pos = beaconPositions[selectedMission.id];
      if (pos && !isNaN(pos.x)) {
        const targetX = Math.max(-360, Math.min(360, cx - pos.x));
        const targetY = Math.max(-260, Math.min(180, cy - pos.y));
        setPan({ x: targetX, y: targetY });
      }
    }
  }, [selectedMission, beaconPositions, isMobile]);

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
      className="relative w-full max-w-[1600px] mx-auto h-full overflow-hidden bg-[#040c1a] shadow-2xl flex flex-col"
      style={{
        clipPath: isMobile ? 'none' : 'polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 12px), 0 16px)',
      }}
    >
      {/* ═══════════════════════════════════════════════════════════
          MOBILE TOP SUB-BAR (Visible on < lg screens)
          ═══════════════════════════════════════════════════════════ */}
      <div className="lg:hidden z-30 px-2 py-1.5 bg-[#051329]/98 border-b border-cyan-500/30 flex items-center justify-between gap-1.5 shrink-0 shadow-md">
        <div className="flex-1 grid grid-cols-3 gap-1">
          {[
            { id: 'map', label: lang === 'ar' ? '🗺️ الخريطة' : '🗺️ Map' },
            { id: 'details', label: lang === 'ar' ? '📋 التفاصيل' : '📋 Details' },
            { id: 'missions', label: lang === 'ar' ? '🎯 المهمات' : '🎯 Missions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMobileView(tab.id)}
              className={`py-1.5 px-1 rounded-lg text-[10.5px] font-black transition-all cursor-pointer text-center truncate ${
                mobileView === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/30 border border-cyan-300/40'
                  : 'bg-[#081838] border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Recenter Button as Part of Top Bar */}
        <button
          onClick={() => recenterMap()}
          className="py-1.5 px-2.5 bg-[#081d3d] hover:bg-[#0c2a57] border border-cyan-400/40 rounded-lg text-[10.5px] font-black text-cyan-300 flex items-center gap-1 shrink-0 active:scale-95 transition-all shadow-sm cursor-pointer"
          title={lang === 'ar' ? 'تركيز الخريطة' : 'Recenter Map'}
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>{lang === 'ar' ? 'تركيز' : 'Center'}</span>
        </button>
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

        {/* Desktop Compass Widget */}
        <div
          onClick={(e) => { e.stopPropagation(); recenterMap(); }}
          className="hidden lg:flex absolute top-3 left-[250px] z-30 items-center gap-1.5 px-3 py-1.5 bg-[#061633]/95 border border-cyan-400/50 hover:border-cyan-300 text-cyan-300 hover:text-white rounded-lg backdrop-blur-md shadow-xl pointer-events-auto cursor-pointer transition-all active:scale-95 group"
          title={lang === 'ar' ? mapControlsData.recenterTooltipAr : mapControlsData.recenterTooltipEn}
        >
          <Compass className={`w-4 h-4 text-cyan-300 transition-transform group-hover:rotate-45 ${isDragging ? 'animate-spin' : ''}`} />
          <span className="text-[10.5px] font-mono font-black tracking-wider">
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
          }}
          beaconPositions={beaconPositions}
          project={project}
          isMobile={isMobile}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE FLOATING BOTTOM HUD BAR — No overlap, spacious & clean
          ═══════════════════════════════════════════════════════════ */}
      <div className={`lg:hidden absolute bottom-0 left-0 right-0 z-30 pointer-events-auto transition-transform duration-300 ${mobileView !== 'map' ? 'translate-y-full pointer-events-none' : 'translate-y-0'}`}>
        <div className="p-2.5 bg-gradient-to-t from-[#020713] via-[#051329]/98 to-[#051329]/95 border-t border-cyan-400/50 shadow-[0_-8px_32px_rgba(0,0,0,0.95)] backdrop-blur-xl flex flex-col gap-2">
          
          {/* Row 1: Selected Mission Info + Prev/Next Controls */}
          <div className="flex items-center justify-between gap-2">
            {/* Mission Flag & Name */}
            <div
              onClick={() => setMobileView('details')}
              className="flex items-center gap-2 cursor-pointer flex-1 min-w-0 active:scale-98 transition-transform"
            >
              <span className="text-2xl shrink-0 p-1 bg-[#091b38] rounded-xl border border-cyan-500/30 shadow-sm">{selectedMission.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-white truncate">
                    {lang === 'ar' ? selectedMission.countryAr : selectedMission.countryEn}
                  </h3>
                  <span className="text-[9.5px] font-mono font-bold text-cyan-300 bg-blue-950/90 px-1.5 py-0.5 rounded border border-cyan-500/30 shrink-0">
                    #{selectedMission.code}
                  </span>
                </div>
                <p className="text-[10px] text-cyan-300 font-bold truncate mt-0.5">
                  {lang === 'ar' ? selectedMission.titleAr : selectedMission.titleEn}
                </p>
              </div>
            </div>

            {/* Prev / Next Mission Arrows */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handlePrevMission}
                className="w-8 h-8 bg-[#0a1e3f] hover:bg-[#122e5e] border border-cyan-400/50 rounded-xl flex items-center justify-center text-cyan-300 font-black active:scale-90 transition-all cursor-pointer shadow-sm"
                title={lang === 'ar' ? 'المهمة السابقة' : 'Previous Mission'}
              >
                ◀
              </button>
              <button
                onClick={handleNextMission}
                className="w-8 h-8 bg-[#0a1e3f] hover:bg-[#122e5e] border border-cyan-400/50 rounded-xl flex items-center justify-center text-cyan-300 font-black active:scale-90 transition-all cursor-pointer shadow-sm"
                title={lang === 'ar' ? 'المهمة التالية' : 'Next Mission'}
              >
                ▶
              </button>
            </div>
          </div>

          {/* Row 2: Action Buttons (Two full, distinct, non-overlapping buttons) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMobileView('details')}
              className="py-2.5 px-2 bg-[#092247] hover:bg-[#0e2f60] border border-cyan-400/40 rounded-xl text-xs font-black text-cyan-200 transition-all text-center active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>📋</span>
              <span>{lang === 'ar' ? 'التفاصيل' : 'Details'}</span>
            </button>
            <button
              onClick={onStartMission}
              className="py-2.5 px-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white rounded-xl text-xs font-black shadow-lg shadow-cyan-500/30 border border-cyan-300/50 transition-all active:scale-95 text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>🚀</span>
              <span>{lang === 'ar' ? 'ابدأ المهمة' : 'Start Mission'}</span>
            </button>
          </div>

        </div>
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
