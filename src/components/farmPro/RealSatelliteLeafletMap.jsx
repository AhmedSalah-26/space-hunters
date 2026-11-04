'use client';

import React, { useEffect, useRef } from 'react';

export default function RealSatelliteLeafletMap({
  center = [30.825, 31.310], // Nile Delta center
  zoom = 15,
  selectedLocation = [30.825, 31.310],
  onLocationSelect,
  isScanning,
  drawingMode = false,
  boundaryPoints = [],
  polygonIsValid = false,
  onBoundaryPointMove,
  environmentalPointLayers = [],
  lang = 'en',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const beaconLayerRef = useRef(null);
  const boundaryLayerRef = useRef(null);
  const environmentalLayerRef = useRef(null);
  const zoomControlRef = useRef(null);
  const callbacksRef = useRef({});
  callbacksRef.current = { onLocationSelect, onBoundaryPointMove };

  // Initialize Leaflet Map once
  useEffect(() => {
    let map = null;

    import('leaflet').then((L) => {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Initialize Map with custom high-res satellite controls
      map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // Esri World Imagery is the basemap, not an analytical NASA data layer.
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: 'Esri, Maxar, Earthstar Geographics'
        }
      ).addTo(map);

      // 2. Subtle Reference labels (Roads, canals, place names)
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          opacity: 0.75
        }
      ).addTo(map);

      // Custom Zoom Control top-right
      zoomControlRef.current = L.control.zoom({
        position: 'topright',
        zoomInTitle: lang === 'ar' ? 'تكبير الخريطة' : 'Zoom in',
        zoomOutTitle: lang === 'ar' ? 'تصغير الخريطة' : 'Zoom out',
      }).addTo(map);

      // Click to choose any location on Earth!
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        callbacksRef.current.onLocationSelect?.([lat, lng]);
      });

      const beaconGroup = L.layerGroup().addTo(map);
      const boundaryGroup = L.layerGroup().addTo(map);
      const environmentalGroup = L.layerGroup().addTo(map);
      beaconLayerRef.current = beaconGroup;
      boundaryLayerRef.current = boundaryGroup;
      environmentalLayerRef.current = environmentalGroup;
      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        zoomControlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const control = zoomControlRef.current;
    if (!control) return;
    const zoomInTitle = lang === 'ar' ? 'تكبير الخريطة' : 'Zoom in';
    const zoomOutTitle = lang === 'ar' ? 'تصغير الخريطة' : 'Zoom out';
    control.options.zoomInTitle = zoomInTitle;
    control.options.zoomOutTitle = zoomOutTitle;
    const container = control.getContainer();
    container?.querySelector('.leaflet-control-zoom-in')?.setAttribute('title', zoomInTitle);
    container?.querySelector('.leaflet-control-zoom-out')?.setAttribute('title', zoomOutTitle);
  }, [lang]);

  // Handle center or zoom updates (Fly smoothly to country/governorate)
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.flyTo(center, zoom, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [center[0], center[1], zoom]);

  // Render the point marker or polygon boundary without implying a surveyed farm edge.
  useEffect(() => {
    if (!mapInstanceRef.current || !beaconLayerRef.current) return;

    import('leaflet').then((L) => {
      const group = beaconLayerRef.current;
      group.clearLayers();
      if (drawingMode) return;

      if (!selectedLocation || selectedLocation.length < 2) return;
      const [lat, lng] = selectedLocation;
      const beaconIcon = L.divIcon({
        className: 'custom-neon-beacon',
        iconSize: [64, 64],
        iconAnchor: [32, 32],
        html: `
          <div style="position: relative; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; pointer-events: none;">
            <!-- Outer Pulsing Neon Wave -->
            <div style="position: absolute; width: 56px; height: 56px; border-radius: 50%; border: 2px solid #a855f7; box-shadow: 0 0 24px rgba(168, 85, 247, 0.95); animation: beaconPulse 2s infinite ease-out;"></div>
            
            <!-- Secondary Cyan Halo -->
            <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; border: 2px solid #38bdf8; box-shadow: 0 0 16px rgba(56, 189, 248, 0.9); animation: beaconPulse 2.5s infinite 0.5s ease-out;"></div>

            <!-- Central Glowing Glass Disc (Dead Center Dot) -->
            <div style="position: absolute; width: 18px; height: 18px; border-radius: 50%; background: linear-gradient(135deg, #0284c7, #7c3aed); border: 2px solid #ffffff; box-shadow: 0 0 15px #ffffff, 0 0 25px #a855f7; display: flex; align-items: center; justify-content: center;">
              <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
            </div>

            <!-- Perfectly Centered Target Badge Above -->
            <div style="position: absolute; top: -18px; left: 50%; transform: translateX(-50%); background: rgba(10, 15, 30, 0.95); border: 1px solid #38bdf8; color: #7dd3fc; font-size: 12px; font-weight: 900; font-family: monospace; padding: 2px 7px; border-radius: 6px; white-space: nowrap; box-shadow: 0 0 12px rgba(56, 189, 248, 0.6);">
              ${lang === 'ar' ? 'موقع المزرعة' : 'FARM LOCATION'}
            </div>
          </div>
        `
      });

      const marker = L.marker([lat, lng], { icon: beaconIcon });
      group.addLayer(marker);
    });
  }, [selectedLocation, drawingMode, lang]);

  useEffect(() => {
    if (!mapInstanceRef.current || !boundaryLayerRef.current) return;

    import('leaflet').then((L) => {
      const group = boundaryLayerRef.current;
      if (!group) return;
      group.clearLayers();
      if (!boundaryPoints.length) return;

      const latLngs = boundaryPoints.map((point) => [point.latitude, point.longitude]);
      if (latLngs.length >= 2) {
        const shape = latLngs.length >= 3 && polygonIsValid
          ? L.polygon(latLngs, {
            color: '#22d3ee',
            weight: 3,
            fillColor: '#0891b2',
            fillOpacity: 0.22,
            className: 'leaflet-neon-polygon-selected',
          })
          : L.polyline(latLngs, { color: '#22d3ee', weight: 3, dashArray: '6, 6' });
        group.addLayer(shape);
      }

      boundaryPoints.forEach((point, index) => {
        const editable = L.marker([point.latitude, point.longitude], {
          draggable: true,
          keyboard: true,
          icon: L.divIcon({
            className: 'custom-neon-beacon',
            html: '<div style="width:16px;height:16px;border:2px solid #ecfeff;border-radius:50%;background:#06b6d4;box-shadow:0 0 12px rgba(6,182,212,.9)"></div>',
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          }),
          title: `Boundary point ${index + 1}; drag to edit`,
        });
        editable.on('dragend', (event) => {
          const { lat, lng } = event.target.getLatLng();
          callbacksRef.current.onBoundaryPointMove?.(index, { latitude: lat, longitude: lng });
        });
        group.addLayer(editable);
      });
    });
  }, [boundaryPoints, polygonIsValid]);

  // POWER currently supplies a location-based climatology, not a raster.
  // Render one point inspector with selected measures; never shade the farm.
  useEffect(() => {
    if (!mapInstanceRef.current || !environmentalLayerRef.current) return;

    import('leaflet').then((L) => {
      const group = environmentalLayerRef.current;
      if (!group) return;
      group.clearLayers();
      if (!selectedLocation || !environmentalPointLayers.length) return;

      const marker = L.circleMarker(selectedLocation, {
        radius: 8,
        color: '#f8fafc',
        weight: 2,
        fillColor: '#06b6d4',
        fillOpacity: 0.95,
        bubblingMouseEvents: false,
      });
      marker.bindTooltip(lang === 'ar' ? 'نقطة مرجعية من NASA POWER · ليست طبقة صور' : 'NASA POWER reference point · not a raster overlay', { direction: 'top' });

      const popup = L.DomUtil.create('div', 'environmental-point-popup');
      const heading = L.DomUtil.create('strong', '', popup);
      heading.textContent = lang === 'ar' ? 'NASA POWER · مرجع نقطي' : 'NASA POWER · point reference';
      const explanation = L.DomUtil.create('p', '', popup);
      explanation.textContent = lang === 'ar'
        ? 'صور Esri هي خريطة الأساس. هذه قيم مناخية شبكية وليست قياسات حقلية أو متوسطات للمضلع.'
        : 'Esri imagery is the basemap. These values are climatological grid references, not field measurements or polygon averages.';
      environmentalPointLayers.forEach((item) => {
        const row = L.DomUtil.create('p', '', popup);
        const unit = item.unit === 'degC' ? '°C' : item.unit;
        row.textContent = `${item.variable}: ${Number(item.value).toFixed(2)} ${unit} · ${item.referenceDate} · ${item.source?.provider || 'NASA POWER'}`;
        row.style.fontSize = '14px';
        row.style.lineHeight = '1.5';
        const quality = L.DomUtil.create('small', '', popup);
        quality.textContent = item.quality || (lang === 'ar' ? 'لم يجرِ التطبيق تقييماً إضافياً للجودة' : 'Quality not further assessed by application');
        quality.style.fontSize = '12px';
        quality.style.lineHeight = '1.5';
      });
      marker.bindPopup(popup, { maxWidth: 280 });
      group.addLayer(marker);
    });
  }, [selectedLocation, environmentalPointLayers, lang]);

  return (
    <div className="relative w-full h-full min-h-0">
      {/* Esri basemap container */}
      <div ref={mapContainerRef} className="w-full h-full z-0 cursor-crosshair" />

      <div className="absolute left-3 right-3 top-3 z-[500] max-w-[calc(100%-1.5rem)] rounded-md border border-white/20 bg-[#07152b]/95 px-2 py-1.5 text-[8px] leading-relaxed text-slate-100 pointer-events-none sm:left-auto sm:max-w-[440px] sm:text-xs">
        {lang === 'ar' ? 'الخلفية: صور Esri © Esri وMaxar وEarthstar · التحليل: بيانات نقطية فقط' : 'BASEMAP: ESRI IMAGERY © ESRI, MAXAR, EARTHSTAR · ANALYSIS: POINT DATA ONLY'}
      </div>

      {/* Laser Scanning Overlay Animation */}
      {isScanning && (
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/35 to-transparent animate-pulse border-b-2 border-cyan-300" />
      )}
    </div>
  );
}
