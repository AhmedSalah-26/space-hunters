'use client';

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useLanguage } from '../../context/LanguageContext';
import { useWorkingSession } from '../../context/WorkingSessionContext';
import { getPowerClimatology } from '../../services/nasa/powerProvider';
import { fuseEnvironmentalObservations } from '../../analysis/environmental/fusion';
import EnvironmentalAnalysisDashboard from './EnvironmentalAnalysisDashboard';
import {
  FARM_AREA_UNITS,
  convertArea,
  createFarmLocationSelection,
  formatArea,
  getPolygonCentroid,
  validateCoordinates,
  validateFarmPolygon,
} from '../../utils/farmGeometry';
import { 
  Scan,
  MapPin, X,
  Search, Compass, Loader2,
  Printer, Eye, EyeOff
} from 'lucide-react';

// Dynamic import for Leaflet map to ensure 100% Client-Side rendering
const RealSatelliteLeafletMap = dynamic(
  () => import('./RealSatelliteLeafletMap'),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-full bg-[#030914] flex flex-col items-center justify-center text-cyan-400 gap-3">
        <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold font-mono">LOADING SATELLITE BASEMAP TILES...</span>
      </div>
    )
  }
);

// Preset Popular Agricultural Locations
const PRESET_LOCATIONS = [
  { nameAr: 'المنصورة وأجا (الدقهلية)', nameEn: 'Mansoura & Aga (Dakahlia)', center: [30.825, 31.310], tag: 'مصر 🇪🇬', soil: 'أرض طمي سوداء خصبة', crops: ['قمح', 'فول بلدي', 'ذرة رفيعة'] },
  { nameAr: 'كفر الشيخ (شمال الدلتا والبرلس)', nameEn: 'Kafr El-Sheikh (North Delta)', center: [31.110, 30.938], tag: 'مصر 🇪🇬', soil: 'أرض طين خفيف قريبة من البحر', crops: ['شعير', 'بنجر سكر', 'بقوليات'] },
  { nameAr: 'طنطا وزفتى (الغربية)', nameEn: 'Tanta & Zefta (Gharbia)', center: [30.786, 31.000], tag: 'مصر 🇪🇬', soil: 'أرض دلتا سوداء تقيلة', crops: ['قمح', 'برسيم', 'ذرة شامية'] },
  { nameAr: 'الزقازيق والصالحية (الشرقية)', nameEn: 'Zagazig & Salheya (Sharqia)', center: [30.587, 31.502], tag: 'مصر 🇪🇬', soil: 'أرض صفرا خفيفة سريعة الصرف', crops: ['فول سوداني', 'قمح', 'سمسم'] },
  { nameAr: 'دمنهور والنوبارية (البحيرة)', nameEn: 'Damanhur & Nubaria (Beheira)', center: [31.036, 30.470], tag: 'مصر 🇪🇬', soil: 'أرض رملية مستصلحة', crops: ['قمح', 'برسيم حجازي', 'بقوليات'] },
  { nameAr: 'المنيا ووادي النيل (الصعيد)', nameEn: 'Minya & Nile Valley', center: [28.109, 30.750], tag: 'مصر 🇪🇬', soil: 'أرض نيلية دافية في الصعيد', crops: ['صويا', 'ذرة رفيعة', 'قمح'] },
  { nameAr: 'الوادي الجديد (الواحات)', nameEn: 'New Valley & Oases', center: [25.451, 30.547], tag: 'مصر 🇪🇬', soil: 'أرض واحات ورملة صحراوية', crops: ['شعير', 'برسيم حجازي', 'قمح'] },
  { nameAr: 'كانساس وحوض أوغالالا (أمريكا)', nameEn: 'Kansas & Ogallala (USA)', center: [38.526, -99.300], tag: 'أمريكا 🇺🇸', soil: 'Prairie Silt Loam', crops: ['Winter Wheat', 'Sorghum', 'Soybean'] },
  { nameAr: 'تكساس وبانهاندل (أمريكا)', nameEn: 'Texas Panhandle (USA)', center: [35.221, -101.831], tag: 'أمريكا 🇺🇸', soil: 'Red Arid Clay', crops: ['Cotton', 'Sorghum', 'Millet'] },
  { nameAr: 'لوديانا، البنجاب (الهند)', nameEn: 'Ludhiana, Punjab (India)', center: [30.901, 75.857], tag: 'الهند 🇮🇳', soil: 'Alluvial Depleted Loam', crops: ['Wheat', 'Moong Pulse', 'Maize'] },
  { nameAr: 'ماتو غروسو (البرازيل)', nameEn: 'Mato Grosso & Cerrado (Brazil)', center: [-12.681, -55.721], tag: 'البرازيل 🇧🇷', soil: 'Deep Red Oxisol', crops: ['Soybean', 'Safrinha Corn', 'Brachiaria'] },
  { nameAr: 'حوض موراي-دارلينغ (أستراليا)', nameEn: 'Murray-Darling Basin (Australia)', center: [-34.520, 145.480], tag: 'أستراليا 🇦🇺', soil: 'Saline Silt Loam', crops: ['Barley', 'Lupin Pulse', 'Wheat'] },
];

function localizeGeometryError(error, lang) {
  if (lang !== 'ar') return error || '';
  const messages = {
    'Enter numeric latitude and longitude.': 'أدخل قيمتين رقميتين لخط العرض وخط الطول.',
    'Latitude must be between -90° and 90°.': 'يجب أن يكون خط العرض بين ‎-90° و90°.',
    'Longitude must be between -180° and 180°.': 'يجب أن يكون خط الطول بين ‎-180° و180°.',
    'Add at least three boundary points.': 'أضف ثلاث نقاط حدود على الأقل.',
    'Boundary points must not be repeated.': 'يجب ألا تتكرر نقاط الحدود.',
    'Boundary edges cross. Move a point to make a simple polygon.': 'تتقاطع أضلاع الحدود؛ حرّك نقطة لتكوين مضلع بسيط.',
    'The boundary is too small or has no measurable area.': 'الحدود صغيرة جداً أو لا تنتج مساحة قابلة للقياس.',
    'The boundary is too large to be a farm parcel.': 'المساحة المحاطة أكبر من أن تمثل قطعة مزرعة.',
  };
  return messages[error] || error || '';
}

export default function FarmProStudio({ onContinue, onEditFarm }) {
  const { lang, isRtl } = useLanguage();
  const { session, updateSession } = useWorkingSession();
  const farmDraft = session.farmInformation?.farmSelectionDraft || {};

  // Active Map Location (Default to Nile Delta: Aga / Mit Ghamr, Dakahlia)
  const [selectedLocation, setSelectedLocation] = useState(() => farmDraft.selectedLocation || (session.farmLocation
    ? [session.farmLocation.latitude, session.farmLocation.longitude]
    : [30.825, 31.310]));
  const [locationName, setLocationName] = useState(() => farmDraft.locationName || session.farmLocation?.label || (lang === 'ar' ? 'مركز أجا وميت غمر، محافظة الدقهلية' : 'Aga & Mit Ghamr, Dakahlia'));
  const [selectionMode, setSelectionMode] = useState(() => farmDraft.selectionMode || (session.farmLocation?.selectionMethod === 'polygon-boundary' ? 'boundary' : 'point-area'));
  const [areaUnit, setAreaUnit] = useState(() => farmDraft.areaUnit || session.farmLocation?.areaUnit || 'feddan');
  const [areaInput, setAreaInput] = useState(() => String(farmDraft.areaInput ?? (session.farmLocation?.selectionMethod === 'point-area' ? session.farmLocation.area ?? 1 : 1)));
  const [latitudeInput, setLatitudeInput] = useState(() => String(farmDraft.latitudeInput ?? session.farmLocation?.latitude ?? 30.825));
  const [longitudeInput, setLongitudeInput] = useState(() => String(farmDraft.longitudeInput ?? session.farmLocation?.longitude ?? 31.310));
  const [boundaryPoints, setBoundaryPoints] = useState(() => {
    if (Array.isArray(farmDraft.boundaryPoints)) return farmDraft.boundaryPoints;
    const coordinates = session.farmLocation?.geometry?.coordinates?.[0];
    return Array.isArray(coordinates) && coordinates.length > 1
      ? coordinates.slice(0, -1).map(([longitude, latitude]) => ({ latitude, longitude }))
      : [];
  });
  const [locationError, setLocationError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  // Search Bar State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [onlineSearchResults, setOnlineSearchResults] = useState([]);
  const [onlineSearchStatus, setOnlineSearchStatus] = useState('');

  // NASA POWER product status and seasonal month selection.
  const [isNasaLoading, setIsNasaLoading] = useState(false);
  const [nasaError, setNasaError] = useState('');
  const [analysisMonth, setAnalysisMonth] = useState(() => session.analysisResults?.environmentalView?.month ?? new Date().getMonth());
  const [activeEnvironmentalLayers, setActiveEnvironmentalLayers] = useState(() => session.analysisResults?.environmentalView?.layers || { T2M: true, PRECTOTCORR: true, RH2M: false, ALLSKY_SFC_SW_DWN: false });

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 639px)');
    const syncMapPanel = (event) => setIsPanelCollapsed(event.matches);
    syncMapPanel(mobile);
    mobile.addEventListener('change', syncMapPanel);
    return () => mobile.removeEventListener('change', syncMapPanel);
  }, []);

  useEffect(() => {
    updateSession({ farmInformation: { ...(session.farmInformation || {}), farmSelectionDraft: { selectedLocation, locationName, selectionMode, areaUnit, areaInput, latitudeInput, longitudeInput, boundaryPoints } } });
    // Save a temporary draft so screen navigation does not discard an in-progress point or polygon.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation, locationName, selectionMode, areaUnit, areaInput, latitudeInput, longitudeInput, boundaryPoints, updateSession]);

  useEffect(() => {
    updateSession({ analysisResults: { ...(session.analysisResults || {}), environmentalView: { month: analysisMonth, layers: activeEnvironmentalLayers } } });
    // Store display choices only when the choices change; preserve other analysis results.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisMonth, activeEnvironmentalLayers, updateSession]);

  const boundaryValidation = useMemo(() => validateFarmPolygon(boundaryPoints), [boundaryPoints]);
  const polygonCentroid = useMemo(() => boundaryValidation.valid ? getPolygonCentroid(boundaryPoints) : null, [boundaryPoints, boundaryValidation.valid]);
  const referenceCoordinates = selectionMode === 'boundary' && polygonCentroid ? polygonCentroid : selectedLocation;
  const areaValue = selectionMode === 'boundary'
    ? (boundaryValidation.valid ? convertArea(boundaryValidation.areaSquareMeters, 'squareMeter', areaUnit) : null)
    : Number(areaInput);
  const pointAreaSquareMeters = selectionMode === 'point-area' ? convertArea(areaValue, areaUnit, 'squareMeter') : null;
  const pointAreaIsValid = selectionMode !== 'point-area' || (Number.isFinite(areaValue) && areaValue > 0 && pointAreaSquareMeters <= 1e12);
  const displayedCoordinates = selectionMode === 'boundary' && polygonCentroid ? polygonCentroid : selectedLocation;
  const farmSelection = useMemo(() => createFarmLocationSelection({
    mode: selectionMode === 'boundary' ? 'boundary' : 'point-area',
    latitude: referenceCoordinates[0],
    longitude: referenceCoordinates[1],
    area: areaValue,
    areaUnit,
    boundaryPoints,
    label: selectionMode === 'boundary'
      ? (lang === 'ar' ? 'مركز حدود المزرعة' : 'Farm boundary centroid')
      : locationName,
  }), [selectionMode, referenceCoordinates[0], referenceCoordinates[1], areaValue, areaUnit, boundaryPoints, lang, locationName]);

  const powerObservations = useMemo(() => (session.environmentalObservations || []).filter((item) => (
    item.source?.id === 'nasa-power-climatology'
    && item.source?.dataKind === 'reference'
    && item.source?.requestCoordinates?.latitude === farmSelection.farmLocation?.latitude
    && item.source?.requestCoordinates?.longitude === farmSelection.farmLocation?.longitude
  )), [session.environmentalObservations, farmSelection.farmLocation?.latitude, farmSelection.farmLocation?.longitude]);
  const environmentalFusion = useMemo(() => fuseEnvironmentalObservations(powerObservations, farmSelection.valid ? farmSelection.farmLocation : null), [powerObservations, farmSelection.valid, farmSelection.farmLocation]);
  const environmentalPointLayers = useMemo(() => {
    const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][analysisMonth];
    return Object.entries(activeEnvironmentalLayers).filter(([, enabled]) => enabled).map(([variable]) => (
      powerObservations.find((item) => item.variable === variable && item.referenceDate === `climatology:${month}`)
    )).filter((item) => Number.isFinite(item?.value));
  }, [powerObservations, analysisMonth, activeEnvironmentalLayers]);

  useEffect(() => {
    updateSession({
      farmLocation: farmSelection.valid ? farmSelection.farmLocation : null,
      farmArea: farmSelection.valid ? farmSelection.farmArea : null,
    });
  }, [farmSelection.valid, farmSelection.farmLocation, updateSession]);

  // Load source-tagged NASA POWER climatology for the selected point.
  useEffect(() => {
    if (!farmSelection.valid) {
      updateSession({ environmentalObservations: [] });
      setNasaError('');
      setIsNasaLoading(false);
      return undefined;
    }

    let isCancelled = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    setNasaError('');

    const fetchNasaData = async () => {
      setIsNasaLoading(true);
      try {
        const observations = await getPowerClimatology({
          latitude: farmSelection.farmLocation.latitude,
          longitude: farmSelection.farmLocation.longitude,
          signal: controller.signal,
        });
        if (isCancelled) return;

        updateSession({ environmentalObservations: observations });
      } catch (err) {
        if (!isCancelled) {
          setNasaError(err?.name === 'AbortError' ? 'Request timed out or was cancelled.' : (err?.message || 'NASA POWER data request failed.'));
        }
      } finally {
        if (!isCancelled) setIsNasaLoading(false);
      }
    };

    fetchNasaData();

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [farmSelection.valid, farmSelection.farmLocation?.latitude, farmSelection.farmLocation?.longitude, updateSession]);

  // Filter preset locations based on search query
  const filteredPresets = useMemo(() => {
    if (!searchQuery.trim()) return PRESET_LOCATIONS.slice(0, 7);
    const q = searchQuery.toLowerCase();
    return PRESET_LOCATIONS.filter(p => 
      p.nameAr.toLowerCase().includes(q) || 
      p.nameEn.toLowerCase().includes(q) ||
      p.tag.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const applyPointLocation = (latitude, longitude, label) => {
    const validation = validateCoordinates(latitude, longitude);
    if (!validation.valid) {
      setLocationError(localizeGeometryError(validation.error, lang));
      return false;
    }
    setSelectedLocation([latitude, longitude]);
    setLatitudeInput(String(latitude));
    setLongitudeInput(String(longitude));
    setLocationName(label);
    setSelectionMode('point-area');
    setLocationError('');
    return true;
  };

  const handleApplyCoordinates = () => {
    if (!latitudeInput.trim() || !longitudeInput.trim()) {
      setLocationError(lang === 'ar' ? 'أدخل خط العرض وخط الطول.' : 'Enter both latitude and longitude.');
      return;
    }
    const latitude = Number(latitudeInput);
    const longitude = Number(longitudeInput);
    if (validateCoordinates(latitude, longitude).valid) {
      applyPointLocation(latitude, longitude, `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`);
    } else {
      setLocationError(localizeGeometryError(validateCoordinates(latitude, longitude).error, lang));
    }
  };

  const handleAreaUnitChange = (nextUnit) => {
    if (selectionMode === 'point-area') {
      const converted = convertArea(Number(areaInput), areaUnit, nextUnit);
      if (converted !== null) setAreaInput(String(Number(converted.toFixed(6))));
    }
    setAreaUnit(nextUnit);
  };

  // Handle Location Selection
  const handleSelectLocation = (loc) => {
    applyPointLocation(loc.center[0], loc.center[1], lang === 'ar' ? loc.nameAr : loc.nameEn);
    setSearchQuery(lang === 'ar' ? loc.nameAr : loc.nameEn);
    setShowSearchDropdown(false);
  };

  // Perform Online Live Geocoding via OpenStreetMap Nominatim
  const handlePerformOnlineSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if user entered raw coordinates (e.g. 30.825, 31.310)
    const coordMatch = searchQuery.match(/(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        applyPointLocation(lat, lng, `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`);
        setOnlineSearchStatus('');
        setShowSearchDropdown(false);
        return;
      }
    }

    setIsSearching(true);
    setOnlineSearchStatus('');
    setShowSearchDropdown(true);

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
      if (!res.ok) throw new Error(`Location search failed with HTTP ${res.status}`);
      const data = await res.json();
      const seenNames = new Set();
      const uniqueResults = (data || []).filter((result) => {
        const name = String(result.display_name || '').trim().toLocaleLowerCase();
        if (!name || seenNames.has(name)) return false;
        seenNames.add(name);
        return true;
      });
      setOnlineSearchResults(uniqueResults);
      if (!uniqueResults.length) setOnlineSearchStatus('no-results');
    } catch (err) {
      setOnlineSearchResults([]);
      setOnlineSearchStatus('error');
    } finally {
      setIsSearching(false);
    }
  };

  // Click on map to place beacon
  const handleMapClick = (coords) => {
    const validation = validateCoordinates(coords[0], coords[1]);
    if (!validation.valid) {
      setLocationError(localizeGeometryError(validation.error, lang));
      return;
    }
    if (selectionMode === 'boundary') {
      setBoundaryPoints((points) => [...points, { latitude: coords[0], longitude: coords[1] }]);
      setLocationError('');
      return;
    }
    applyPointLocation(
      coords[0],
      coords[1],
      lang === 'ar' ? `الموقع المختار (${coords[0].toFixed(3)}°, ${coords[1].toFixed(3)}°)` : `Coordinates (${coords[0].toFixed(3)}°, ${coords[1].toFixed(3)}°)`
    );
  };

  const handleMoveBoundaryPoint = (index, point) => {
    const validation = validateCoordinates(point.latitude, point.longitude);
    if (!validation.valid) {
      setLocationError(localizeGeometryError(validation.error, lang));
      return;
    }
    setBoundaryPoints((points) => points.map((current, pointIndex) => pointIndex === index ? point : current));
    setLocationError('');
  };

  const handleRemoveBoundaryPoint = (index) => {
    setBoundaryPoints((points) => points.filter((_, pointIndex) => pointIndex !== index));
    setLocationError('');
  };

  const handleClearBoundary = () => {
    setBoundaryPoints([]);
    setLocationError('');
  };

  // Trigger Scanner animation
  const handleScanLocation = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div className="relative w-full min-h-[calc(100dvh-9rem)] shrink-0 flex flex-col bg-[#050c18] font-sans">
      
      {/* ── TOP HEADER & LIVE SEARCH BAR ── */}
      <div id="workflow-section-0" className="scroll-mt-4 w-full bg-[#0a1827]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-sm z-30">
        <h2 className="w-full text-sm font-bold text-slate-100">{lang === 'ar' ? '١. موقع المزرعة ومساحتها' : '1. Farm Location & Area'}</h2>
        {/* 🔍 LIVE SEARCH BAR 🔍 */}
        <div className="relative flex-1 max-w-xl min-w-0">
          <form onSubmit={handlePerformOnlineSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOnlineSearchResults([]);
                setOnlineSearchStatus('');
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder={lang === 'ar' ? 'ابحث عن مدينة أو قرية، أو اختر نقطة على الخريطة' : 'Search for a place or select a point on the map'}
              style={{ backgroundColor: '#081426', opacity: 1 }}
              className="min-h-11 w-full border-2 border-indigo-500/60 hover:border-indigo-400 focus:border-cyan-400 text-white rounded-2xl pl-10 pr-10 py-2.5 text-sm font-bold shadow-[0_0_25px_rgba(0,0,0,0.8)] focus:outline-none transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {isSearching && (
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
            )}
          </form>

          {/* Invisible backdrop to close dropdown when clicking outside */}
          {showSearchDropdown && (
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowSearchDropdown(false)} 
            />
          )}

          {/* 100% Solid Non-Transparent Search Suggestions Dropdown */}
          {showSearchDropdown && (
            <div 
              style={{ backgroundColor: '#08162b', opacity: 1 }}
              className="absolute top-full left-0 right-0 mt-2 border-2 border-indigo-500/80 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-2.5 z-50 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95"
            >
              <div className="flex items-center justify-between px-2 py-1 text-[11px] font-black text-cyan-300 border-b border-white/10 mb-2">
                <span>{lang === 'ar' ? 'مراكز ومحافظات زراعية مشهورة' : 'Quick Agricultural Regions'}</span>
                <button 
                  type="button"
                  onClick={() => setShowSearchDropdown(false)} 
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Online results */}
          {isSearching && <p role="status" className="px-2 py-2 text-[10px] text-cyan-200">{lang === 'ar' ? 'جارٍ البحث عن الموقع…' : 'Searching for this place…'}</p>}
          {!isSearching && onlineSearchStatus === 'no-results' && <p role="status" className="px-2 py-2 text-[10px] text-amber-200">{lang === 'ar' ? 'لم يُعثر على أماكن مطابقة. جرّب اسماً آخر أو اختر منطقة سريعة.' : 'No matching places found. Try another name or choose a quick region.'}</p>}
          {!isSearching && onlineSearchStatus === 'error' && <p role="alert" className="px-2 py-2 text-[10px] text-rose-200">{lang === 'ar' ? 'تعذر الوصول إلى خدمة البحث عن الأماكن. تحقق من الاتصال أو اختر منطقة سريعة.' : 'Could not reach the place-search service. Check the connection or choose a quick region.'}</p>}
              {onlineSearchResults.length > 0 && (
                <div className="mb-2">
                  <div className="text-[9px] font-bold text-cyan-300 px-2 py-0.5 uppercase tracking-wider">{lang === 'ar' ? 'نتائج البحث:' : 'Search Results:'}</div>
                  {onlineSearchResults.map((res, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const lat = parseFloat(res.lat);
                        const lng = parseFloat(res.lon);
                        applyPointLocation(lat, lng, res.display_name.split(',')[0]);
                        setShowSearchDropdown(false);
                      }}
                      className="min-h-11 w-full text-left p-2 rounded-xl hover:bg-indigo-600/30 text-xs font-bold text-white flex items-center justify-between transition-all cursor-pointer"
                    >
                      <span className="truncate flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        {res.display_name}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Presets */}
              <div className="space-y-1">
                {filteredPresets.map((loc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectLocation(loc)}
                    className="min-h-11 w-full text-left p-2 rounded-xl hover:bg-indigo-600/30 text-xs font-bold text-white flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'ar' ? loc.nameAr : loc.nameEn}</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                      {loc.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Map imagery is a basemap; environmental data is added as point references only. */}
      <div className="relative flex-1 min-h-0 w-full h-full overflow-hidden">
        
        {/* Esri imagery basemap with farm geometry and optional POWER point inspector. */}
        <RealSatelliteLeafletMap
          center={referenceCoordinates}
          zoom={15}
          selectedLocation={referenceCoordinates}
          onLocationSelect={handleMapClick}
          isScanning={isScanning}
          drawingMode={selectionMode === 'boundary'}
          boundaryPoints={boundaryPoints}
          polygonIsValid={boundaryValidation.valid}
          onBoundaryPointMove={handleMoveBoundaryPoint}
          environmentalPointLayers={environmentalPointLayers}
          lang={lang}
        />

        {/* ── LEFT FLOATING PANEL: NASA WEATHER & RECOMMENDED ROTATIONS (COLLAPSIBLE, 100% SOLID OPAQUE) ── */}
        {isPanelCollapsed ? (
          <button
            onClick={() => setIsPanelCollapsed(false)}
            style={{ backgroundColor: '#07152b', opacity: 1 }}
            className="app-nav-button absolute top-4 left-4 z-20 border-2 border-cyan-400 text-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.85)] px-4 flex items-center gap-2.5 font-black text-sm hover:bg-[#0c2242] transition-all cursor-pointer animate-in fade-in"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ar' ? '🗺️ فتح أدوات موقع ومساحة المزرعة' : '🗺️ Open farm location & area tools'}</span>
          </button>
        ) : (
          <div 
            className="absolute inset-x-2 bottom-2 top-auto z-20 max-h-[90%] w-auto max-w-none border-2 border-indigo-500/60 text-white rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-3 sm:inset-x-auto sm:left-4 sm:top-4 sm:bottom-auto sm:max-h-[calc(100%-2rem)] sm:w-[520px] sm:max-w-[calc(100vw_-_2rem)] sm:p-5 flex flex-col gap-3.5 overflow-y-auto overscroll-contain animate-in fade-in zoom-in-95"
            style={{ backgroundColor: '#07152b', opacity: 1 }}
          >
            
            {/* Selected Location Title & Coordinates + Minimize button */}
            <div className="p-3 bg-[#030914] rounded-2xl border border-cyan-500/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 shrink-0">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-bold">{lang === 'ar' ? 'أرضك اللي اخترتها:' : 'Selected farm:'}</div>
                  <div className="text-xs font-black text-white truncate">{selectionMode === 'boundary' && polygonCentroid ? (lang === 'ar' ? 'مركز المضلع' : 'Polygon centroid') : locationName}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950 px-2 py-1 rounded border border-cyan-500/30">
                  {displayedCoordinates[0].toFixed(3)}°, {displayedCoordinates[1].toFixed(3)}°
                </span>
                <button
                  onClick={() => setIsPanelCollapsed(true)}
                  title={lang === 'ar' ? 'تصغير اللوحة لرؤية الخريطة كاملة' : 'Collapse panel to view full map'}
                  className="app-nav-button w-11 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Farm location and area selection */}
            <section className="p-3 bg-[#030914] rounded-2xl border border-indigo-400/40 space-y-3" aria-label={lang === 'ar' ? 'تحديد موقع ومساحة المزرعة' : 'Farm location and area selection'}>
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-black text-white">{lang === 'ar' ? '١. موقع المزرعة ومساحتها' : '1. Farm Location & Area'}</h2>
                <span className="text-[9px] text-cyan-300 font-mono">{lang === 'ar' ? 'اختياري' : 'WORKING SESSION'}</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  aria-pressed={selectionMode === 'point-area'}
                  onClick={() => { setSelectionMode('point-area'); setLocationError(''); }}
                  className={`min-h-11 rounded-xl border px-2 py-2 text-[10px] sm:text-[11px] font-black transition-all ${selectionMode === 'point-area' ? 'bg-cyan-700/70 border-cyan-300 text-white' : 'bg-[#081730] border-white/10 text-slate-300'}`}
                >
                  {lang === 'ar' ? 'نقطة + مساحة' : 'Select Point + Enter Area'}
                </button>
                <button
                  type="button"
                  aria-pressed={selectionMode === 'boundary'}
                  onClick={() => { setSelectionMode('boundary'); setLocationError(''); }}
                  className={`min-h-11 rounded-xl border px-2 py-2 text-[10px] sm:text-[11px] font-black transition-all ${selectionMode === 'boundary' ? 'bg-cyan-700/70 border-cyan-300 text-white' : 'bg-[#081730] border-white/10 text-slate-300'}`}
                >
                  {lang === 'ar' ? 'ارسم حدود المزرعة' : 'Draw Farm Boundary'}
                </button>
              </div>

              {selectionMode === 'point-area' ? (
                <div className="space-y-2.5">
                  <p className="text-[10px] leading-relaxed text-slate-300">{lang === 'ar' ? 'اختر نقطة على الخريطة أو ابحث عن مكان. المساحة المدخلة تقدير حول نقطة مرجعية ولا تحدد شكل حدود المزرعة.' : 'Click the map or search for a place. The entered area is an estimate around a reference point; it does not define the farm boundary.'}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-[10px] text-slate-300 space-y-1">
                      <span>{lang === 'ar' ? 'خط العرض' : 'Latitude'}</span>
                      <input inputMode="decimal" value={latitudeInput} onChange={(event) => setLatitudeInput(event.target.value)} className="min-h-11 w-full rounded-lg border border-cyan-500/30 bg-[#081426] px-2 py-1.5 text-white" />
                    </label>
                    <label className="text-[10px] text-slate-300 space-y-1">
                      <span>{lang === 'ar' ? 'خط الطول' : 'Longitude'}</span>
                      <input inputMode="decimal" value={longitudeInput} onChange={(event) => setLongitudeInput(event.target.value)} className="min-h-11 w-full rounded-lg border border-cyan-500/30 bg-[#081426] px-2 py-1.5 text-white" />
                    </label>
                  </div>
                  <button type="button" onClick={handleApplyCoordinates} className="app-nav-button w-full rounded-lg border border-cyan-400/40 bg-cyan-950/70 text-sm font-bold text-cyan-100 hover:bg-cyan-900/80">
                    {lang === 'ar' ? 'تطبيق الإحداثيات' : 'Apply Coordinates'}
                  </button>
                  <div className="grid grid-cols-[1fr_1.1fr] gap-2">
                    <label className="text-[10px] text-slate-300 space-y-1">
                      <span>{lang === 'ar' ? 'مساحة المزرعة' : 'Farm area'}</span>
                      <input type="number" min="0" step="any" value={areaInput} onChange={(event) => setAreaInput(event.target.value)} className="min-h-11 w-full rounded-lg border border-cyan-500/30 bg-[#081426] px-2 py-1.5 text-white" />
                    </label>
                    <label className="text-[10px] text-slate-300 space-y-1">
                      <span>{lang === 'ar' ? 'وحدة المساحة' : 'Area unit'}</span>
                      <select value={areaUnit} onChange={(event) => handleAreaUnitChange(event.target.value)} className="min-h-11 w-full rounded-lg border border-cyan-500/30 bg-[#081426] px-2 py-1.5 text-white">
                        {Object.entries(FARM_AREA_UNITS).map(([unit, config]) => <option key={unit} value={unit}>{lang === 'ar' ? config.labelAr : config.labelEn}</option>)}
                      </select>
                    </label>
                  </div>
                  {!pointAreaIsValid && <p role="alert" className="text-[10px] text-rose-300">{lang === 'ar' ? 'أدخل مساحة أكبر من صفر وضمن نطاق المزرعة.' : 'Enter an area greater than zero and within a valid farm-size range.'}</p>}
                </div>
              ) : (
                <div className="space-y-2.5">
                  <p className="text-[10px] leading-relaxed text-slate-300">{lang === 'ar' ? 'اضغط على الخريطة لإضافة نقاط الحدود. اسحب النقاط لتعديلها، أو احذف النقاط غير المطلوبة.' : 'Click the map to add boundary points. Drag a vertex to edit it, or remove individual points below.'}</p>
                  <div className="flex items-center gap-2">
                    <button type="button" disabled={!boundaryPoints.length} onClick={() => handleRemoveBoundaryPoint(boundaryPoints.length - 1)} className="app-nav-button flex-1 rounded-lg border border-white/10 bg-[#081730] px-2 text-sm font-bold text-slate-200 disabled:opacity-40">{lang === 'ar' ? 'تراجع عن آخر نقطة' : 'Undo Last Point'}</button>
                    <button type="button" disabled={!boundaryPoints.length} onClick={handleClearBoundary} className="app-nav-button flex-1 rounded-lg border border-rose-500/30 bg-rose-950/40 px-2 text-sm font-bold text-rose-100 disabled:opacity-40">{lang === 'ar' ? 'مسح وإعادة الرسم' : 'Clear & Redraw'}</button>
                  </div>
                  {boundaryPoints.length > 0 && (
                    <ol className="max-h-28 space-y-1 overflow-y-auto rounded-lg border border-white/10 p-1.5">
                      {boundaryPoints.map((point, index) => (
                        <li key={`${index}-${point.latitude}-${point.longitude}`} className="flex items-center justify-between gap-2 text-[9px] text-slate-200">
                          <span>{index + 1}. {point.latitude.toFixed(5)}, {point.longitude.toFixed(5)}</span>
                          <button type="button" onClick={() => handleRemoveBoundaryPoint(index)} className="app-nav-button w-11 rounded text-rose-200 hover:bg-rose-950/60" aria-label={`${lang === 'ar' ? 'حذف النقطة' : 'Remove point'} ${index + 1}`}><X className="h-4 w-4" /></button>
                        </li>
                      ))}
                    </ol>
                  )}
                  <label className="block text-[10px] text-slate-300 space-y-1">
                    <span>{lang === 'ar' ? 'عرض المساحة المحسوبة بوحدة' : 'Show calculated area in'}</span>
                    <select value={areaUnit} onChange={(event) => handleAreaUnitChange(event.target.value)} className="min-h-11 w-full rounded-lg border border-cyan-500/30 bg-[#081426] px-2 py-1.5 text-white">
                      {Object.entries(FARM_AREA_UNITS).map(([unit, config]) => <option key={unit} value={unit}>{lang === 'ar' ? config.labelAr : config.labelEn}</option>)}
                    </select>
                  </label>
                  {boundaryPoints.length > 0 && !boundaryValidation.valid && <p role="alert" className="text-[10px] text-amber-200">{lang === 'ar' ? 'أكمل مضلعاً صالحاً: ' : ''}{localizeGeometryError(boundaryValidation.error, lang)}</p>}
                </div>
              )}

              {locationError && <p role="alert" className="text-[10px] text-rose-300">{localizeGeometryError(locationError, lang)}</p>}

              <div className="rounded-xl border border-cyan-500/25 bg-[#07152b] p-2.5 space-y-1">
                <div className="text-[10px] font-black text-cyan-200">{lang === 'ar' ? 'ملخص المزرعة' : 'Farm Selection Summary'}</div>
                <div className="text-[10px] text-slate-200">{lang === 'ar' ? 'الموقع:' : 'Location:'} {selectionMode === 'boundary' && polygonCentroid ? (lang === 'ar' ? 'مركز المضلع' : 'Polygon centroid') : locationName}</div>
                <div className="text-[10px] font-mono text-slate-300">{displayedCoordinates[0].toFixed(5)}°, {displayedCoordinates[1].toFixed(5)}°</div>
                <div className="text-[10px] text-slate-200">{lang === 'ar' ? 'المساحة:' : 'Area:'} {selectionMode === 'point-area'
                  ? (pointAreaIsValid ? formatArea(areaValue, areaUnit, lang) : (lang === 'ar' ? 'مساحة غير صالحة' : 'Invalid area'))
                  : (boundaryValidation.valid ? formatArea(areaValue, areaUnit, lang) : (lang === 'ar' ? 'أكمل حدوداً صالحة' : 'Complete a valid boundary'))}</div>
                <div className="text-[9px] text-slate-400">{selectionMode === 'point-area'
                  ? (lang === 'ar' ? 'الطريقة: نقطة مرجعية + مساحة مدخلة؛ لا تمثل حدوداً دقيقة.' : 'Method: reference point + entered area; exact boundary is unknown.')
                  : (lang === 'ar' ? `الطريقة: حدود مرسومة (${boundaryPoints.length} نقاط)` : `Method: drawn polygon (${boundaryPoints.length} vertices)`)}</div>
                {selectionMode === 'boundary' && boundaryValidation.valid && <div className="text-[9px] text-emerald-300">{lang === 'ar' ? 'هندسة GeoJSON جاهزة للتحليل المكاني لاحقاً.' : 'GeoJSON polygon geometry is ready for future spatial analysis.'}</div>}
              </div>
            </section>

            <button type="button" disabled={selectionMode === 'point-area' ? !pointAreaIsValid : !boundaryValidation.valid} onClick={onContinue} className="app-nav-button min-h-11 w-full rounded-xl bg-cyan-700 px-4 text-sm font-bold text-white hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-45">{lang === 'ar' ? 'تأكيد الموقع والمتابعة' : 'Confirm farm and continue'}</button>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleScanLocation}
                disabled={isScanning}
                className="py-2.5 px-3 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-black rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Scan className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? (lang === 'ar' ? 'بنقيس من الأقمار...' : 'Scanning...') : (lang === 'ar' ? 'تحديث قراءات ناسا' : 'Rescan NASA')}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white text-xs font-black rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{lang === 'ar' ? 'طباعة روشتة الأرض والتوصيات' : 'Print NASA Advisory'}</span>
              </button>
            </div>

          </div>
        )}

        {/* ── MAP INSTRUCTION BADGE AT BOTTOM RIGHT ── */}
        <div className={`absolute bottom-6 right-6 z-20 flex-col items-end gap-1.5 pointer-events-none ${isPanelCollapsed ? 'flex' : 'hidden sm:flex'}`}>
          <div 
            style={{ backgroundColor: '#07152b', opacity: 1 }}
            className="text-xs font-black text-white px-3.5 py-2 rounded-2xl border-2 border-cyan-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span>{selectionMode === 'boundary'
              ? (lang === 'ar' ? 'اضغط لإضافة نقاط الحدود واسحب النقاط لتعديلها' : 'Click to add boundary points; drag vertices to edit')
              : (lang === 'ar' ? 'دوس على الخريطة لتحديد نقطة مرجعية للمزرعة' : 'Click the map to select a farm reference point')}</span>
          </div>
          <span 
            style={{ backgroundColor: '#07152b', opacity: 1 }}
            className="text-[10px] font-mono text-cyan-300 font-bold px-2.5 py-1 rounded-lg border border-white/10"
          >
            {lang === 'ar' ? 'خلفية صور Esri • بيانات NASA POWER نقاط مرجعية فقط' : 'Esri imagery basemap • NASA POWER values are point references only'}
          </span>
        </div>

      </div>

      <section id="workflow-section-1" className="scroll-mt-4 mx-auto w-full max-w-6xl shrink-0 space-y-3 p-3 text-slate-100 sm:p-5" aria-labelledby="environmental-overview-heading">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs text-cyan-300">{lang === 'ar' ? 'الخطوة ٢ من ٧' : 'Step 2 of 7'}</p><h2 id="environmental-overview-heading" className="type-section-title font-black">{lang === 'ar' ? 'نظرة بيئية' : 'Environmental Overview'}</h2></div><button type="button" onClick={onEditFarm} className="app-nav-button min-h-11 rounded-lg border border-white/10 px-3 text-sm text-slate-200 hover:bg-white/5">{lang === 'ar' ? 'تعديل الموقع' : 'Edit farm location'}</button></div>
        <EnvironmentalAnalysisDashboard
          id="environmental-analysis"
          observations={powerObservations}
          farmLocation={farmSelection.valid ? farmSelection.farmLocation : null}
          lang={lang}
          isLoading={isNasaLoading}
          requestError={nasaError}
          selectedMonth={analysisMonth}
          onSelectedMonthChange={setAnalysisMonth}
          activeLayers={activeEnvironmentalLayers}
          onToggleLayer={(variable) => setActiveEnvironmentalLayers((current) => ({ ...current, [variable]: !current[variable] }))}
          fusionGroups={environmentalFusion}
        />
      </section>

    </div>
  );
}
