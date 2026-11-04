# Project Audit Report — Field Shift / Space Hunters

Audit date: 2026-11-04  
Scope: Read-only source audit of D:\GitHub\space-hunters. This requested report is the only new file. The live Vercel site was not browser-tested.  
Challenge reference: [NASA Space Apps 2026 — Field Shift](https://www.spaceappschallenge.org/2026/challenges/field-shift-adapting-farms-with-nasa-data/). The stated goal is decision support combining NASA Earth observations, local soil information, crop characteristics and farmer priorities to explore rotations that improve soil health and adaptation.

## 1. Executive Summary

This is a visually developed, client-side Next.js/React prototype. Its main flow is five country missions → scripted briefing → three-season crop selection → result dashboard. It also has a universal sequence sandbox and a separate Farm Pro map studio. Most telemetry, soils, crop impacts, recommendations, rankings and result projections are static records or deterministic browser-side heuristics.

One direct NASA POWER API request exists in Farm Pro. It requests climatological monthly averages for temperature, precipitation and relative humidity. It does not establish live/current observations. The displayed SMAP value is computed as relative humidity × 0.42; other SMAP, GPM, Landsat, MODIS and GRACE values are mock/static. The map's imagery tiles come from Esri, not NASA.

**Built:** extensive UI, five narrative missions, English/Arabic text and RTL direction, interactive map/selection/sequence controls, local formula-based scores, and one coded NASA POWER climatology fetch plus Nominatim place search.

**Not established:** successful runtime behavior of the external requests or deployment; real SMAP/GPM/Landsat/etc integration; field-specific agronomic analysis; validated advice; farm profile intake; comparison of three calculated strategies including existing rotation; backend/database/auth; PDF export; automated tests.

**Strongest parts to keep:** component families, mission/crop data catalogs, bilingual foundation, polished interaction design, world map selection and sequence builder. The biggest product risk is UI copy such as “NASA LIVE”, “NASA VERIFIED”, “99.4% accuracy” and precise savings presenting illustrative/synthetic metrics as validated science.

## 2. Project Overview

- Next.js App Router application served at /; internal views use URL hashes: #start, #map, #briefing, #decision, #results, #universalBuilder, #farmPro.
- Root controller: src/app/page.jsx; global wrapper/provider: src/app/layout.jsx.
- All app data is imported from local JavaScript modules. There is no backend or server-side data service.
- UI areas: start hub, five missions, briefing, decision matrix, results, universal builder, Farm Pro, Agri Bank modal and guide modal.
- README makes feature/data claims that exceed the implementation, detailed below.

## 3. Technology Stack

| Technology | Purpose and evidence | Usage |
|---|---|---|
| JavaScript, JSX | Source throughout src/ | Active |
| Next.js 14.2.20, React 18 | App Router, client screens, hooks | Active |
| Tailwind CSS 3, custom CSS | UI styling and global design | Active |
| Lucide React | Icons | Active |
| D3 Geo, TopoJSON Client, world-atlas | Projected SVG world map and bundled country boundaries | Active |
| Leaflet | Farm Pro map | Active |
| Esri ArcGIS World Imagery/reference tiles | External map imagery source in Leaflet | Wired; live availability not verified |
| NASA POWER API | Browser request for climatological T2M, PRECTOTCORR, RH2M | Implemented; runtime not verified; climatology, not live |
| OpenStreetMap Nominatim | Place search from Farm Pro | Implemented; runtime not verified |
| Google Fonts (Cairo, Inter, Orbitron) | Imported by global CSS | Active remote dependency |
| clsx, tailwind-merge | Manifest dependencies | No source imports found |
| d3-interpolate | Mentioned in README | Not a dependency or source import |
| Database/ORM, auth, AI/ML, chart/PDF libraries | Not found | Not implemented |

No environment-variable reads were found. .gitignore excludes .env*. next.config.mjs enables React strict mode and disables Next image optimization. Tailwind config defines project colors/fonts/animations.

## 4. Folder and File Structure

- src/app/: Next root layout, single root page, global CSS, app icon.
- src/components/: screens and shared components; subfolders briefing/, decision/, map/, results/, farmPro/.
- src/context/: language context only.
- src/data/: static mission, crop, translation, sensor, guide, impact, score and UI records; missions/ holds five country scenarios.
- public/: local illustrations, country/crop/farmer imagery and icons.
- Root: package manifest/lock, Next/Tailwind/PostCSS config, README and ignore rules.
- No API route, backend, DB schema/migration, test directory or CI workflow found.

Main map renderer is src/components/map/WorldMapSvg.jsx; mission records are src/data/missions/*.js; universal crop catalog is src/data/universalRotationData.js; Farm Pro integrations are in src/components/farmPro/FarmProStudio.jsx.

## 5. Application Architecture

    Next layout → LanguageProvider (localStorage language)
    page.jsx → current screen and modal state + URL hash/history
       ├─ Start / Map / Briefing / Decision / Results
       │    └─ static missions → local sequence heuristics → result UI
       ├─ Universal Builder → static crop catalog + local formulas
       ├─ Farm Pro → POWER climatology + Nominatim search + Leaflet/Esri tiles
       └─ Agri Bank / Guide → static content

Shared app state is in page.jsx: current screen, modal, selected mission, player choice and sequence. Screen-local UI uses React state and useMemo. Language context is the only shared provider. Browser localStorage persists language only. App navigation pushes/replaces hash history and listens to popstate; mission and sequence state are not encoded in URL. There is no backend/database or persistent farm profile.

## 6. Website Pages and Routes

All views are under /, not separate Next routes.

| Hash/view | Content and interactions | Data/state caveats |
|---|---|---|
| #start | Branded hub; opens game, Farm Pro, sequence builder, Agri Bank, guide | Local screen/modal transitions |
| #map | SVG world map, five mission markers, details, carousel, legend | Select/pan/recenter/start; bundled boundaries, not satellite analysis |
| #briefing | Mission telemetry sidebar, scripted farmer/NASA dialogue, story tabs | Typewriter/replay controls; no AI or live feed |
| #decision | Three season selectors and gauges | Select/reset/continue; local heuristic and static telemetry |
| #results | Overview, metrics, impact, NASA cards, lessons, grade/certificate panel | Formulas + static content; no official verification |
| #universalBuilder | Crop catalog, climate preset selector, three season columns and gauges | Single custom sequence calculated locally; no three-strategy comparison |
| #farmPro | Leaflet imagery, location selection/search, telemetry/advisory cards, print | NASA POWER climatology; other metrics are bucket constants; print invokes browser print |
| Agri Bank modal | Searchable crop catalog and soil/satellite tabs | Static data; “synchronized” copy unsupported by code |
| Guide modal | Static guide/manual content | Close control |

Farm Pro has loading indicators and silent fallbacks, but no visible API error/provenance timestamp. Unmatched crop search and failed geocoding lack meaningful empty states. Responsive layouts use Tailwind sm/md/lg and a global 1023px breakpoint; browser behavior not verified.

## 7. UI/UX Analysis

- Dark navy/neon cyan-blue design, emerald/amber/red status accents, glass panels, chamfered cards and animated glows.
- Global colors include #050c1b, #06b6d4, #3b82f6, #10b981. Typography uses Cairo/Inter and Orbitron; fonts load remotely from Google.
- Tailwind utility classes dominate component styling; global CSS defines tokens, Leaflet styles and animations. Screens use dense multi-panel layouts and nested scrolling.
- Arabic/English toggling and runtime RTL/LTR are implemented, but some static data is Arabic-only or hard-coded.
- Accessibility concerns from source: viewport disables user scaling; global CSS disables text selection; tiny 8–11px labels; some clickable non-button elements; missing accessible names/focus management; no clear reduced-motion support. No accessibility tool/browser check was run.
- Global body hides vertical overflow, so content depends on nested scroll containers. Mobile layout not verified.
- Similar telemetry copy is repeated across mission files, translations, sensor cards and Farm Pro; possible duplicate start-screen background files in public folders.

## 8. Implemented Features

| Feature | View | Status | Main files | Notes |
|---|---|---|---|---|
| Hash/history screen navigation | All | PARTIALLY IMPLEMENTED | src/app/page.jsx | Core navigation wired; in-memory mission/sequence not restored by URL |
| Five mission scenarios | Map/briefing | MOCK DATA | src/data/missions/*.js | Detailed but static profiles, dialogue, crops, rotations and telemetry |
| SVG world map | Map | FULLY IMPLEMENTED (UI interaction) | WorldMapScreen.jsx, map/WorldMapSvg.jsx | D3/TopoJSON; runtime not browser-verified |
| Mission dialogue | Briefing | FULLY IMPLEMENTED (scripted) | MissionBriefingScreen.jsx, briefing/* | Prewritten script, not two-way freeform |
| Mission crop selector | Decision | PARTIALLY IMPLEMENTED | DecisionMatrixScreen.jsx, decision/SeasonColumn.jsx | Selects among fixed options; simple local scoring |
| Result grade/dashboard | Results | MOCK DATA / PARTIALLY IMPLEMENTED | ResultsDashboardScreen.jsx, results/* | Score responds to sequence heuristics; impacts mostly static; “NASA VERIFIED” is UI copy |
| Universal sequence builder | Builder | PARTIALLY IMPLEMENTED | UniversalRotationScreen.jsx, universalRotationData.js | Catalog and formulas; no observed data input or multi-strategy comparison |
| Farm map | Farm Pro | PARTIALLY IMPLEMENTED | RealSatelliteLeafletMap.jsx, FarmProStudio.jsx | Esri tiles, selected point, illustrative fixed-radius circles; not a farm boundary |
| NASA POWER request | Farm Pro | PARTIALLY IMPLEMENTED | FarmProStudio.jsx lines 60–113 | Climate climatology parameters; fetch not executed in audit |
| Location search | Farm Pro | PARTIALLY IMPLEMENTED | FarmProStudio.jsx lines 242–291 | Presets, raw coordinates, Nominatim; no range validation or rate-limit handling |
| Advisory plans | Farm Pro | MOCK DATA | FarmProStudio.jsx lines 188–240 | Literal plan text and savings; not calculated from API |
| Scan control | Farm Pro | UI ONLY | FarmProStudio.jsx lines 299–305 | 1.2s animation, no fresh API scan |
| Print | Farm Pro | PARTIALLY IMPLEMENTED | FarmProStudio.jsx | Calls window.print; no generated PDF |
| Agri Bank | Modal | MOCK DATA | AgriBankModal.jsx, agriBankData.js | Static local catalog |
| Language switching | All | PARTIALLY IMPLEMENTED | LanguageContext.jsx, translations.js | Toggle/localStorage/RTL; coverage not fully verified |
| Guide/lessons/leaderboard/impact | Modal/results | MOCK DATA | respective data modules | Static records; no ranking service |
| Authentication, profiles, saved plans | N/A | NOT IMPLEMENTED | — | No source evidence |
| PDF report export | README claim | NOT IMPLEMENTED | — | No PDF library/export path |

## 9. Partially Implemented Features

Interactive controls are connected to React state, but “dynamic” means local-rule arithmetic, not data-calibrated agronomic inference. Farm Pro is the only path with external data fetch; its fetched values do not drive the mission decision/result flow.

## 10. Missing Features

No real SMAP, ECOSTRESS, GPM, Landsat, MODIS, GRACE/FO or SRTM integration; no historical series/trend; no raster processing or spatial/temporal fusion; no farmer-entered soil, farm area, water availability, priorities, equipment, market constraints or baseline rotation; no calculated three-strategy comparison; no uncertainty/provenance; no backend, DB, auth, persistence or rate limiting; no test suite/CI/accessibility validation; no actual PDF generator.

## 11. NASA Data Integration Audit

Mission data and sensor cards contain static NASA-associated values. No NASA data catalog, satellite product download, imagery API, Earthdata auth, raster processing or observation series was found. Esri imagery is not NASA data.

| Dataset | Status | Evidence and actual behavior |
|---|---|---|
| SMAP | NOT IMPLEMENTED | smapEst in Farm Pro is relative humidity × 0.42; else coordinate constants. No SMAP request |
| ECOSTRESS | NOT IMPLEMENTED | Narrative mentions only; no ET/LST integration |
| GPM | NOT IMPLEMENTED | Farm Pro POWER precipitation is labeled GPM in UI; no GPM request |
| Landsat | NOT IMPLEMENTED | Static values/copy; Leaflet tiles are Esri |
| MODIS | NOT IMPLEMENTED | Static sensor card only |
| GRACE/GRACE-FO | NOT IMPLEMENTED | Static dialogue and mission claims |
| NASA POWER | PARTIALLY IMPLEMENTED | GET https://power.larc.nasa.gov/api/temporal/climatology/point for T2M, PRECTOTCORR, RH2M, community=AG. Reads monthly/annual climatology; no history or provenance UI |
| SRTM | NOT IMPLEMENTED | No source found |

NASA POWER response is used for temperature/precipitation and humidity-derived SMAP-like estimate. Precipitation is multiplied by 30 for a monthly display. Request failure silently falls back to constants. The UI’s “live” terminology is inaccurate for climatology. Timeout uses AbortController, but timer cleanup is only on the success path; effect cleanup marks cancellation without aborting request.

## 12. Agricultural Analysis Audit

| Analysis | Status | Evidence |
|---|---|---|
| Soil moisture | MOCK DATA | Regional constants or RH-derived value, not SMAP |
| Temperature/heat stress | PARTIALLY IMPLEMENTED | POWER climatology in Farm Pro; static telemetry elsewhere; no crop heat model |
| Rainfall | PARTIALLY IMPLEMENTED | POWER climatology × 30 or regional constants; not GPM/forecast |
| Vegetation health | MOCK DATA | Static NDVI-like regional values |
| Evapotranspiration | NOT IMPLEMENTED | ECOSTRESS is prose only |
| Soil health | MOCK DATA | Static texture/pH/organic-matter/nitrogen |
| Water availability | MOCK DATA | Static labels/plans; no water source input |
| Historical climate | NOT IMPLEMENTED | No historical time series |
| Agricultural risk | PARTIALLY IMPLEMENTED | Heuristics/static labels, not validated or uncertainty-aware |

## 13. Crop Rotation System Audit

| Capability | Status | Finding |
|---|---|---|
| Select crops | PARTIALLY IMPLEMENTED | Fixed per-mission options/catalog |
| Add alternatives | PARTIALLY IMPLEMENTED | Broad predefined catalog; cannot create/import crop |
| Define sequences | PARTIALLY IMPLEMENTED | Three positions, limited seasonal validation |
| Compare 3 strategies incl existing | NOT IMPLEMENTED interactively | Three static mission options exist in data, but UI calculates one selected sequence |
| Water use | PARTIALLY IMPLEMENTED | Catalog values/fixed baseline and static mission savings |
| Nitrogen potential | PARTIALLY IMPLEMENTED | Static N values and simple arithmetic/legume bonus |
| Soil improvement | PARTIALLY IMPLEMENTED | Descriptions/scores, no soil dynamics |
| Erosion risk | UI ONLY / MOCK DATA | Descriptive text, no calculation |
| Pest disruption | PARTIALLY IMPLEMENTED | Family diversity heuristic in universal builder |
| Market fit | MOCK DATA | Labels only; no market data or priorities |
| Recommendation explanation | PARTIALLY IMPLEMENTED | Static explanations/generic tips, not data-derived rationale |
| Existing rotation | NOT IMPLEMENTED in calculator | Narrative only; no baseline comparison |

Formula inconsistency: DecisionMatrixScreen.jsx considers a repeated first/second crop monoculture even if season three differs; ResultsDashboardScreen.jsx distinguishes strict (all same) from partial repetition. Scores can therefore disagree. Universal builder sums crop N values, compares water against fixed 1,800 baseline, clamps savings 5–65%, and scores pest break from family diversity. Its preset state does not feed the main metric formula. These are demo heuristics, not validated recommendations.

## 14. Backend, Database and API Analysis

No backend framework, Next API route, server action, database client/ORM/schema/migration, auth or server endpoint. External calls are browser-side:

1. NASA POWER climatology fetch in FarmProStudio.jsx; fixed parameters and chosen coordinates, reads properties.parameter; no cache/retry/proxy or surfaced error.
2. Nominatim search from user text, limit 5; no debounce/cancellation/status handling/rate limiting/attribution UI.
3. Esri World Imagery and reference tile layers declared in Leaflet.

No database tables/relationships or app-level rate limiting. The main mission flow never calls these services.

## 15. Code Quality and Security Review

- Good component grouping, but page.jsx controls all navigation and Farm Pro combines fetch, geocoding, regional assumptions, plan content and rendering.
- Telemetry and claims are duplicated among mission records, translation/data cards and screens, making values easy to contradict.
- Main integrity concern: “NASA LIVE/VERIFIED”, precise accuracy and impact numbers lack implementation evidence.
- Coordinates are not range-validated. Fetch JSON is lightly checked. Nominatim status is not checked; errors are swallowed. POWER timeout cleanup is incomplete and cleanup does not abort old requests.
- Most data and UI ship client-side. No performance profiling performed; no confirmed runtime performance defect.
- Accessibility concerns listed in section 7; no automated audit performed.
- No secret literal was identified in source reviewed. NASA POWER, Esri and Nominatim calls expose no private application key. No server security layer exists.
- clsx and tailwind-merge appear unused; d3-interpolate is claimed by README but absent from imports/dependencies.
- No dangerouslySetInnerHTML use found; Leaflet DivIcon includes constant markup.
- Dependency vulnerability audit was not run.

## 16. Testing and Deployment Status

- No test files/framework/script or CI workflow found.
- Ran npm run lint: next lint opened interactive ESLint setup prompt because config is absent; exited code 1 without lint results. No configuration was accepted/written.
- Build not run: next build writes into existing .next, conflicting with the no-existing-file-modification constraint. Build status Not Verified.
- Browser, external endpoint and deployed site behavior Not Verified.
- Scripts are dev, build, start, lint.
- README links Vercel, but no vercel.json or deployment workflow/config is present. Actual deployment settings/status Not Verified.

## 17. Problems and Technical Risks

1. Static/inferred values may be mistaken for NASA observation data.
2. Scores and recommendations are not agronomically validated or uncertainty-aware.
3. Verification badges/grades imply authority that the code does not provide.
4. No farm profile or existing rotation input means limited personalization.
5. No real side-by-side three-strategy comparison.
6. Decision and result screens use inconsistent repetition rules.
7. Direct Nominatim/Esri/font dependencies may fail or have usage constraints.
8. Silent API fallback disguises missing data as calibrated telemetry.
9. Zoom lock, tiny copy and keyboard/focus gaps may exclude users.
10. No automated quality gate; lint currently prompts interactively.
11. Static numbers, units and mission copy need traceable sources.

## 18. NASA Challenge Compliance Matrix

Priority is the importance of the gap for this project audit, not a claim that every optional dataset is mandated.

| Requirement | Current Status | Evidence (Files/Functions) | Missing Work | Priority |
|---|---|---|---|---|
| NASA EO in decision support | PARTIALLY IMPLEMENTED | FarmProStudio.jsx POWER request | Feed sourced observations into decisions with lineage | CRITICAL |
| SMAP soil moisture | NOT IMPLEMENTED | RH × 0.42 estimate | Actual SMAP product and valid context | HIGH |
| ECOSTRESS ET/LST | NOT IMPLEMENTED | Mission prose only | Data access/processing | MEDIUM |
| GPM precipitation | NOT IMPLEMENTED | POWER precipitation labeled GPM | Integrate GPM or relabel POWER variable/period | HIGH |
| Landsat | NOT IMPLEMENTED | Esri basemap, static cards | Landsat observation analysis | HIGH |
| MODIS vegetation | NOT IMPLEMENTED | Static card | MODIS/NDVI series | MEDIUM |
| GRACE/FO storage | NOT IMPLEMENTED | Static narrative | Source data and spatial caveats | MEDIUM |
| NASA POWER | PARTIALLY IMPLEMENTED | Farm Pro climatology GET | Verify runtime, label climatology and period | MEDIUM |
| SRTM | NOT IMPLEMENTED | None found | Add only if useful | LOW |
| Data fusion | NOT IMPLEMENTED | No fusion pipeline | Align space/time and missing-data method | CRITICAL |
| Historical trends | NOT IMPLEMENTED | No series/chart | Historical data and trends | HIGH |
| Local soil | MOCK DATA | Missions/Agri Bank records | Verified/location-specific input | HIGH |
| Crop characteristics | PARTIALLY IMPLEMENTED | universalRotationData.js | Validate values/units/calendars | HIGH |
| Farmer priorities | PARTIALLY IMPLEMENTED | Static mission priorities; no input | Capture and use adjustable weights | HIGH |
| Location selection | PARTIALLY IMPLEMENTED | Farm Pro map/search | Integrate main decision flow; validate | MEDIUM |
| Farm size | NOT IMPLEMENTED | Fixed map radii | User area and unit-aware model | MEDIUM |
| Soil type selection | NOT IMPLEMENTED as user input | Static fields | Profile intake and source | HIGH |
| Water availability | NOT IMPLEMENTED as user input | Static status | Capture seasonal supply constraints | HIGH |
| Equipment/market constraints | NOT IMPLEMENTED | Static labels | Capture and evaluate feasibility | MEDIUM |
| Three strategies incl baseline | NOT IMPLEMENTED | Static rotation arrays; one active sequence | Baseline + comparable candidates | CRITICAL |
| Water consumption | PARTIALLY IMPLEMENTED | Static values/fixed formula | Contextual validated calculation | HIGH |
| Nitrogen potential | PARTIALLY IMPLEMENTED | Static values/simple sum/bonus | Validate and model by sequence | HIGH |
| Soil health/erosion/pests | PARTIALLY IMPLEMENTED | Static prose/family heuristic | Transparent sourced indicators | HIGH |
| Market suitability | MOCK DATA | Static labels | Local market evidence and priorities | MEDIUM |
| Explain recommendations | PARTIALLY IMPLEMENTED | Static explanation strings | Tie rationale to inputs and scoring | HIGH |
| Uncertainty/limits | NOT IMPLEMENTED | None found | Quality/confidence and caveats | HIGH |
| Satellite imagery | PARTIALLY IMPLEMENTED | Esri tiles in Leaflet | Attribute basemap; connect analysis or clarify | MEDIUM |
| Vulnerable areas | NOT IMPLEMENTED | Single illustrative circle | Spatial risk method | MEDIUM |

## 19. Recommended Improvements

### Phase 1: Critical Fixes
- Qualify/remove live, verification and accuracy claims until supported. Depends on team deciding demo vs operational advice.
- Label POWER climatology, synthetic values and Esri basemap distinctly. Depends on source/provenance decisions.
- Define consistent scoring units and assumptions. Depends on agronomic review.

### Phase 2: Complete Existing Features
- Add current rotation, farm area, soil, water, farmer priorities, equipment and market constraints. Needed for useful personalization; depends on target user and data units.
- Compare baseline plus at least two alternatives side by side. Depends on scoring definitions and baseline intake.
- Align decision/results formulas and add validation/failure states. Depends on one agreed model.

### Phase 3: NASA Data Integration
- Select datasets tied to a concrete decision question; expose source, date, variables and quality. Depends on access, temporal/spatial resolution and target region.
- Add resilient fetching/caching and clear errors where needed. Depends on hosting and provider constraints.
- Keep basemap source separate from analytical observation source. Depends on intended imagery analysis.

### Phase 4: Agricultural Intelligence & Crop Rotation
- Agronomist-review water, N, soil cover, erosion, pest and feasibility metrics. Depends on credible regional crop data.
- Add spatial/temporal alignment, historical trends and uncertainty. Depends on chosen data products.
- Validate local calendars/suitability. Depends on target pilot geography.

### Phase 5: UI/UX Improvements
- Show source/date/confidence at each metric. Depends on provenance in data model.
- Improve zoom, text sizing, keyboard/focus, reduced motion and nested scrolling. Depends on accessibility review/device targets.
- Make field boundary/area explicit if used in computations. Depends on spatial model.

### Phase 6: Testing and Final Preparation
- Add scoring unit tests, API failure tests and end-to-end smoke paths. Depends on stable contracts.
- Make lint configuration non-interactive and add CI. Depends on selected ESLint policy.
- Verify production build, deployment, Arabic/RTL, mobile and provider outage states. Depends on safe environment and deployment access.

### Top 10 Improvements by Importance
1. Correct misleading NASA-live/verified and impact claims.
2. Integrate genuine Earth-observation values into at least one decision metric with provenance.
3. Compare current rotation against two or more alternatives.
4. Capture farm and farmer constraints.
5. Use one reviewed transparent scoring method.
6. Show uncertainty and missing-data errors.
7. Verify crop attributes, units and local calendars.
8. Separate analytical data from Esri basemap.
9. Add tests, working lint and CI.
10. Improve accessibility and mobile usability.

## 20. Questions and Unknowns Requiring Team Confirmation

- Is this an educational demo or an operational farmer-advice tool?
- Which region is the pilot, and who validated Egypt/Dakahlia crop/soil claims?
- What are the sources/periods/units for mission telemetry and crop attributes?
- Which NASA datasets are intended, and is climatology acceptable for the prototype?
- Should units be hectare/feddan and seasonal/annual? What does “existing rotation” mean?
- Are equipment/market constraints expected within challenge scope?
- Is Vercel currently deployed and configured beyond this checkout?
- Is PDF export/leaderboard expected? Neither is implemented.
- What supports “99.4% accuracy”, “NASA VERIFIED” and precise change estimates? No supporting code/evidence was found.

### Exact files to inspect before changing code

1. src/app/page.jsx — screen flow and history.
2. src/components/farmPro/FarmProStudio.jsx — API, geocoding, synthetic metrics and advisory.
3. src/components/DecisionMatrixScreen.jsx — mission formula.
4. src/components/ResultsDashboardScreen.jsx — result formula/grade.
5. src/components/UniversalRotationScreen.jsx — second scoring method.
6. src/data/missions/egypt.js and the other four mission modules — scenario data.
7. src/data/universalRotationData.js — crop values and presets.
8. src/components/farmPro/RealSatelliteLeafletMap.jsx — provider and map geometry.
9. src/context/LanguageContext.jsx, src/data/translations.js — localization.
10. README.md, package.json, next.config.mjs, tailwind.config.js — claims/scripts/config.

---

**Audit conclusion:** This is a polished interactive frontend prototype with static narratives and heuristic crop sequence scoring, plus a limited NASA POWER climatology request in Farm Pro. The main mission flow does not combine NASA observations, local soil, crop characteristics and farmer priorities into a validated comparison of strategies. Treat specific agronomic impact estimates and NASA verification labels as unverified until linked to sourced data and tested calculations.
