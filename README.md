# 🚀 FIELD SHIFT | NASA Space Apps Challenge 2026
> **Adapting Farms with NASA Earth Observations**  
> **Team:** Space Hunters 🌌  

---

## 🌾 Overview
**FIELD SHIFT** is an interactive, gamified decision-support platform designed to help agricultural communities and farmers transition away from continuous monoculture by designing **climate-resilient multi-season crop rotations**. Powered by real-time and historical NASA Earth Observation telemetry (SMAP, Landsat-9, ECOSTRESS, GRACE-FO), the platform simulates:
- **Water Conservation**: Irrigation savings vs. aquifer depletion (SMAP Soil Moisture).
- **Biological Nitrogen Replenishment**: Natural N-fixation from legumes (+kg N/ha).
- **Pest & Pathogen Cycle Interruption**: Diversified plant families breaking soil-borne disease cycles.
- **Extreme Heat & Climate Resilience**: Land Surface Temperature (LST) and drought stress indicators.

---

## ✨ Key Features

1. **🌟 Minimalist Luxury Start Hub**:
   - Direct launch into the **World Missions Map**, **Agri-Bank Vault**, or the **Universal Crop Rotation Sandbox**.
2. **🗺️ Interactive 3D/SVG World Map**:
   - 5 Real-world country missions: **Egypt (Nile Delta)**, **Brazil (Amazon & Cerrado)**, **India (Punjab Plains)**, **USA (High Plains & Ogallala Aquifer)**, and **Australia (Murray-Darling Basin)**.
3. **📋 Two-Way Comms Mission Briefing**:
   - Interactive dialogue with NASA Earth Science expert (Sarah) and local farmers to diagnose ground-truth telemetry.
4. **🔄 Crop Rotation Decision Matrix**:
   - 3-Season sequence planner with dynamic agronomic scoring, farmer feedback, and live telemetry gauges.
5. **🔬 Universal Crop Rotation Sandbox**:
   - Global vault containing 14+ international crop varieties across 5 categories, tested against 5 NASA climate presets.
6. **🏆 Results & Certification Dashboard**:
   - Dynamic NASA Space Apps verification grade (A+, A, B+, B, D), 5-year sustainability projections, and PDF report export.
7. **🌐 Full Bilingual Support**:
   - 100% Arabic & English localization with RTL/LTR dynamic layout adaptation.
8. **🗄️ Zero-Hardcoding Modular Data Layer**:
   - Schema-ready data architecture in `src/data/` for plug-and-play database / API integration.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 14 (App Router)
- **UI & Styling**: React 18, Tailwind CSS, Lucide React Icons
- **Mapping & Geo**: TopoJSON, D3-Geo, D3-Interpolate
- **State & Localization**: Custom React Context with zero-latency language switching

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed

### Live Demo & Links
- 🌐 **Live Website (Vercel):** [https://space-hunters-five.vercel.app](https://space-hunters-five.vercel.app)
- 📂 **GitHub Repository:** [https://github.com/AhmedSalah-26/space-hunters](https://github.com/AhmedSalah-26/space-hunters)

### Installation
```bash
# Clone repository
git clone https://github.com/AhmedSalah-26/space-hunters.git

# Navigate to directory
cd space-hunters

# Install dependencies
npm install

# Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 🛰️ NASA Earth Science Telemetry Datasets
- **SMAP**: Root-zone soil moisture anomaly detection.
- **Landsat 8/9 & Sentinel-2**: Normalized Difference Vegetation Index (NDVI) & Land Surface Temperature (LST).
- **ECOSTRESS**: Evapotranspiration and thermal plant stress warning.
- **GRACE-FO**: Deep groundwater storage change anomalies.

---

## 👥 Team
- **Team Space Hunters** — NASA Space Apps Challenge 2026.
