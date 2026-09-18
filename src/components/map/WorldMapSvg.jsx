'use client';

import React, { useMemo } from 'react';
import { feature } from 'topojson-client';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import worldData from 'world-atlas/countries-110m.json';
import { useLanguage } from '../../context/LanguageContext';

/* CONTINENT COLOR PALETTE */
const PALETTE = {
  northAmerica: { fill: '#0b4072', fillHover: '#135c9e', stroke: '#38bdf8', glow: '#38bdf8', label: '#bae6fd' },
  southAmerica: { fill: '#0a4a2e', fillHover: '#0f6e45', stroke: '#34d399', glow: '#34d399', label: '#6ee7b7' },
  europe: { fill: '#0d504b', fillHover: '#13756d', stroke: '#2dd4bf', glow: '#2dd4bf', label: '#5eead4' },
  africa: { fill: '#6e2b00', fillHover: '#963b00', stroke: '#fbbf24', glow: '#fbbf24', label: '#fde68a' },
  asia: { fill: '#6e1010', fillHover: '#941616', stroke: '#f87171', glow: '#f87171', label: '#fca5a5' },
  oceania: { fill: '#421682', fillHover: '#591cb3', stroke: '#c084fc', glow: '#c084fc', label: '#e9d5ff' },
};

/* ISO 3166-1 NUMERIC → CONTINENT MAPPING */
const AFRICA_IDS = new Set([
  12, 24, 72, 108, 120, 132, 140, 148, 174, 175, 178, 180, 204, 226, 231, 232,
  262, 266, 270, 288, 324, 384, 404, 426, 430, 434, 450, 454, 466, 478, 480,
  504, 508, 516, 562, 566, 624, 638, 646, 678, 694, 706, 710, 716, 728, 729,
  732, 788, 800, 818, 834, 854, 894,
]);
const EUROPE_IDS = new Set([
  8, 20, 40, 56, 70, 100, 112, 191, 196, 203, 208, 233, 246, 250, 276, 300,
  348, 352, 372, 380, 428, 438, 440, 442, 470, 492, 498, 499, 528, 578, 616,
  620, 642, 674, 688, 703, 705, 724, 752, 756, 804, 826, 807, 831, 832, 833,
]);
const NORTH_AMERICA_IDS = new Set([
  28, 44, 52, 60, 84, 124, 136, 188, 192, 212, 214, 218, 222, 308, 312, 316,
  320, 332, 340, 388, 474, 484, 500, 531, 533, 534, 535, 591, 630, 659, 660,
  662, 663, 666, 670, 780, 796, 840, 850,
]);
const SOUTH_AMERICA_IDS = new Set([
  32, 68, 76, 152, 170, 238, 254, 328, 600, 604, 740, 858, 862,
]);
const OCEANIA_IDS = new Set([
  36, 184, 242, 258, 296, 520, 540, 548, 570, 574, 580, 583, 584, 585,
  598, 612, 772, 776, 798, 882, 886,
]);

function getContinent(numericId) {
  const id = parseInt(numericId, 10);
  if (AFRICA_IDS.has(id)) return 'africa';
  if (EUROPE_IDS.has(id)) return 'europe';
  if (NORTH_AMERICA_IDS.has(id)) return 'northAmerica';
  if (SOUTH_AMERICA_IDS.has(id)) return 'southAmerica';
  if (OCEANIA_IDS.has(id)) return 'oceania';
  return 'asia';
}

import { continentLabels } from '../../data/worldMapData';

const OCEAN_LABELS = [
  { text: 'ARCTIC OCEAN',   lon:   0,   lat:  82 },
  { text: 'PACIFIC OCEAN',  lon: -140,  lat: -10 },
  { text: 'ATLANTIC OCEAN', lon:  -30,  lat:  18 },
  { text: 'INDIAN OCEAN',   lon:   75,  lat: -22 },
  { text: 'SOUTHERN OCEAN', lon:    0,  lat: -68 },
];

const CRISIS_COLOR = {
  water:   '#38bdf8',
  temp:    '#f87171',
  soil:    '#34d399',
  drought: '#fbbf24',
  extreme: '#c084fc',
};

export default function WorldMapSvg({
  width,
  height,
  pan,
  isDragging,
  missions,
  selectedMission,
  setSelectedMission,
  beaconPositions,
  project
}) {
  const { lang } = useLanguage();

  /* Build projection + path generator */
  const { countries, pathGen } = useMemo(() => {
    const proj = geoNaturalEarth1()
      .scale(118)
      .translate([width / 2 + 55, height / 2 - 95]);
    const pg = geoPath(proj);
    const countries = feature(worldData, worldData.objects.countries);
    return { countries, pathGen: pg };
  }, [width, height]);

  /* Pre-compute SVG paths per country */
  const countryPaths = useMemo(() =>
    countries.features.map((f, idx) => ({
      id:        f.id != null ? f.id : `country-${idx}`,
      d:         pathGen(f),
      continent: getContinent(f.id),
    })),
    [countries, pathGen]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full select-none"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {Object.entries(PALETTE).map(([key, pal]) => (
          <React.Fragment key={key}>
            {/* Standard subtle glow filter */}
            <filter id={`glow-${key}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feFlood floodColor={pal.glow} floodOpacity="0.45" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Selected continent matching color glow */}
            <filter id={`glow-sel-${key}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4.0" result="blur" />
              <feFlood floodColor={pal.glow} floodOpacity="0.75" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </React.Fragment>
        ))}

        <filter id="beacon-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Map Group with Pan Transformation */}
      <g transform={`translate(${pan.x}, ${pan.y})`} style={{ transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {/* 1. Ocean Labels */}
        {OCEAN_LABELS.map(({ text, lon, lat }) => {
          const [ox, oy] = project([lon, lat]) || [0, 0];
          return (
            <text key={text} x={ox} y={oy} textAnchor="middle"
              fontSize="7" fill="rgba(103,232,249,0.22)" fontWeight="700"
              fontFamily="monospace" letterSpacing="2.5"
              style={{ pointerEvents: 'none' }}>
              {text}
            </text>
          );
        })}

        {/* 2. Country Paths */}
        {countryPaths.map(({ id, d, continent }) => {
          if (!d) return null;
          const pal = PALETTE[continent] || PALETTE.asia;
          const isSel = selectedMission && (
            (continent === 'africa' && selectedMission.id === 'egypt') ||
            (continent === 'southAmerica' && selectedMission.id === 'brazil') ||
            (continent === 'asia' && (selectedMission.id === 'india' || id === 356)) ||
            (continent === 'northAmerica' && selectedMission.id === 'usa') ||
            (continent === 'oceania' && selectedMission.id === 'australia')
          );
          return (
            <path
              key={id}
              d={d}
              fill={pal.fill}
              fillOpacity={isSel ? 0.95 : 0.78}
              stroke={pal.stroke}
              strokeWidth={isSel ? "1.25" : "0.5"}
              strokeOpacity={isSel ? 1.0 : 0.55}
              filter={isSel ? `url(#glow-sel-${continent})` : `url(#glow-${continent})`}
              style={{ transition: 'all 0.3s ease' }}
            />
          );
        })}

        {/* 3. Mission Beacons */}
        {missions.map(m => {
          const pos = beaconPositions[m.id];
          if (!pos || isNaN(pos.x)) return null;
          const isSel = selectedMission.id === m.id;
          const mc = CRISIS_COLOR[m.crisisType] || CRISIS_COLOR.temp;
          const R = isSel ? 11 : 9;
          const P = isSel ? 18 : 14;
          return (
            <g key={m.id}
              transform={`translate(${pos.x},${pos.y})`}
              onClick={() => setSelectedMission(m)}
              style={{ cursor: 'pointer' }}
              filter="url(#beacon-glow)"
            >
              {/* Outer animated pulse ring */}
              <circle r={P} fill={mc} fillOpacity="0.1" stroke={mc} strokeWidth="0.7">
                <animate attributeName="r" values={`${P - 2};${P + 6};${P - 2}`} dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="fill-opacity" values="0.18;0.02;0.18" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.6;0.08;0.6" dur="2.4s" repeatCount="indefinite" />
              </circle>
              {/* Mid ring */}
              <circle r={R + 3} fill={mc} fillOpacity="0.15" stroke={mc} strokeWidth="0.6" />
              {/* Inner circle */}
              <circle r={R} fill={isSel ? 'rgba(255,255,255,0.92)' : 'rgba(7, 22, 44, 0.65)'} stroke={mc} strokeWidth={isSel ? 2.5 : 1.6} fillOpacity={isSel ? 0.95 : 0.75} />
              {/* Flag emoji */}
              <text x="0" y={R * 0.35} textAnchor="middle" dominantBaseline="middle"
                fontSize={R * 1.05} style={{ pointerEvents: 'none', userSelect: 'none' }}>
                {m.flag}
              </text>
              {/* Country label */}
              <text x="0" y={R + 10} textAnchor="middle" fontSize="6.5"
                fontWeight="800" fontFamily="Cairo, sans-serif" fill={mc}
                style={{ pointerEvents: 'none', userSelect: 'none', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.95))' }}>
                {lang === 'ar' ? m.countryAr : m.countryEn}
              </text>
            </g>
          );
        })}

        {/* 4. Continent Labels */}
        {continentLabels.map(({ textAr, textEn, lon, lat, size, key }) => {
          const [lx, ly] = project([lon, lat]) || [0, 0];
          return (
            <text key={key} x={lx} y={ly} textAnchor="middle"
              fontSize={size} fontWeight="900" fill={PALETTE[key].label}
              fillOpacity="0.95" fontFamily="Cairo, Tajawal, Arial, sans-serif"
              style={{
                pointerEvents: 'none',
                userSelect: 'none',
                filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.95))',
              }}>
              {lang === 'ar' ? textAr : textEn}
            </text>
          );
        })}
      </g>
    </svg>
  );
}
