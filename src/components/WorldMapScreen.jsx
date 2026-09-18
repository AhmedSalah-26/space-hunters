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
  const { lang } = useLanguage();

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
      className="relative w-full max-w-[1600px] mx-auto h-full max-h-full min-h-0 overflow-hidden border border-cyan-500/30 bg-[#040c1a] shadow-2xl"
      style={{
        clipPath: 'polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)',
      }}
    >
      {/* ═══════════════════════════════════════════════════════════
          BACKGROUND WORLD MAP
          ═══════════════════════════════════════════════════════════ */}
      <div
        className={`absolute inset-0 w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
          className="absolute top-3 left-[250px] z-30 flex items-center gap-2 px-3 py-1.5 bg-[#061633]/95 border border-cyan-400/50 hover:border-cyan-300 text-cyan-300 hover:text-white rounded-lg backdrop-blur-md shadow-xl pointer-events-auto cursor-pointer transition-all active:scale-95 group"
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
          setSelectedMission={setSelectedMission}
          beaconPositions={beaconPositions}
          project={project}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          FLOATING OVERLAY 1: LEFT PANEL (Crisis Legend + Stats)
          ═══════════════════════════════════════════════════════════ */}
      <MapLegendSidebar />

      {/* ═══════════════════════════════════════════════════════════
          FLOATING OVERLAY 2: RIGHT PANEL (Selected Mission Details)
          ═══════════════════════════════════════════════════════════ */}
      <MissionDetailCard
        selectedMission={selectedMission}
        onStartMission={onStartMission}
      />

      {/* ═══════════════════════════════════════════════════════════
          FLOATING OVERLAY 3: BOTTOM CAROUSEL
          ═══════════════════════════════════════════════════════════ */}
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
