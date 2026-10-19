'use client';

import React, { useEffect, useRef } from 'react';

export default function RealSatelliteLeafletMap({
  center = [30.825, 31.310], // Nile Delta center
  zoom = 15,
  selectedLocation = [30.825, 31.310],
  onLocationSelect,
  isScanning
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const beaconLayerRef = useRef(null);

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

      // 1. High-Resolution Esri World Imagery (Real High-Res Satellite Tiles)
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
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Click to choose any location on Earth!
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        onLocationSelect?.([lat, lng]);
      });

      const beaconGroup = L.layerGroup().addTo(map);
      beaconLayerRef.current = beaconGroup;
      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle center or zoom updates (Fly smoothly to country/governorate)
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.flyTo(center, zoom, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [center[0], center[1], zoom]);

  // Render ONLY the single glowing concentric circle on the selected location!
  useEffect(() => {
    if (!mapInstanceRef.current || !beaconLayerRef.current) return;

    import('leaflet').then((L) => {
      const group = beaconLayerRef.current;
      group.clearLayers();

      if (!selectedLocation || selectedLocation.length < 2) return;
      const [lat, lng] = selectedLocation;

      // 1. Outer Luminous Neon Circle (Represents the farm parcel radius / boundary)
      const farmRadiusCircle = L.circle([lat, lng], {
        radius: 280, // ~15 Feddans zone
        className: 'leaflet-neon-polygon-selected',
        color: '#a855f7',
        weight: 3.5,
        fillColor: '#6366f1',
        fillOpacity: 0.28,
      });
      group.addLayer(farmRadiusCircle);

      // 2. Subtle dashed warning boundary
      const outerRing = L.circle([lat, lng], {
        radius: 380,
        color: '#38bdf8',
        weight: 1.5,
        dashArray: '5, 8',
        fill: false,
        opacity: 0.6
      });
      group.addLayer(outerRing);

      // 3. Exact Concentric Glowing Beacon Marker on the EXACT dead center of the circle
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
            <div style="position: absolute; top: -16px; left: 50%; transform: translateX(-50%); background: rgba(10, 15, 30, 0.95); border: 1px solid #38bdf8; color: #38bdf8; font-size: 8.5px; font-weight: 900; font-family: monospace; padding: 1px 6px; border-radius: 6px; white-space: nowrap; box-shadow: 0 0 12px rgba(56, 189, 248, 0.6);">
              NASA TARGET
            </div>
          </div>
        `
      });

      const marker = L.marker([lat, lng], { icon: beaconIcon });
      group.addLayer(marker);
    });
  }, [selectedLocation]);

  return (
    <div className="relative w-full h-full min-h-[500px]">
      {/* Real Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0 cursor-crosshair" />

      {/* Laser Scanning Overlay Animation */}
      {isScanning && (
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/35 to-transparent animate-pulse border-b-2 border-cyan-300" />
      )}
    </div>
  );
}
