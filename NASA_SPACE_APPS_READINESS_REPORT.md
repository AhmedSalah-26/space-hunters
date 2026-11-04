# NASA Space Apps Readiness Report — Space Hunters / Field Shift

**Review date:** 2026-11-04  
**Review scope:** Phase 8 quality review of the current local checkout. This is not a deployment or scientific validation certificate.  
**Challenge reference:** [NASA Space Apps 2026 — Field Shift: Adapting Farms with NASA Data](https://www.spaceappschallenge.org/2026/challenges/field-shift-adapting-farms-with-nasa-data/). The challenge page describes decision support that combines NASA Earth observations, local soil information, crop characteristics, and farmer priorities to explore rotation options. The requirements below distinguish what the application does today from what the challenge needs scientifically.

## 1. Executive Summary

Space Hunters now has a unified bilingual Mission Terminal with farm location and area selection, a NASA POWER climatology view, three rotation comparisons, risk screening, trade-off explanation, uncertainty limits, and a decision summary. The project builds with Next.js and includes focused automated tests for geospatial selection, POWER response normalization, and rotation scoring.

The application is a **decision-support prototype**, not a validated agronomic recommendation system. NASA POWER monthly climatology is the only integrated NASA environmental provider. There are no dated environmental time series, field-scale raster summaries, calibrated crop suitability/risk thresholds, yield estimates, or validated economic outcomes. Many risk classes correctly remain unclassified and the uncertainty UI does not claim statistical confidence.

QA verified the production build, 11 data tests, 4 rotation tests, major browser workflows, point/area validation, unit conversion, method switching, invalid polygon feedback, the three-strategy comparison, priority controls, Arabic/RTL rendering, historical-climatology month navigation, and summary generation. A UI formatting defect that exposed floating-point tails was fixed in the strategy and summary screens. Mobile-device, keyboard-only, screen-reader, comprehensive network-failure, and deployed-site tests were not completed. The lint command is not configured for noninteractive use and stopped at Next.js's first-time ESLint setup prompt.

**Readiness assessment:** suitable for continued prototype development and a challenge demonstration with its limitations disclosed. Do not claim production readiness, field-specific recommendations, NASA multi-dataset fusion, or verified agricultural outcomes.

## 2. Implemented Features

- Single-page Next.js Mission Terminal and temporary client working session; no authentication, account, database, or server backend.
- Farm can be set by reference coordinate plus manually entered area, or by a drawn GeoJSON-compatible polygon. The interface distinguishes the reference point from a surveyed boundary.
- Area units include feddan, hectare, square meter, and square kilometer. Polygon area uses geodesic calculation and invalid/duplicate/incomplete polygons are rejected.
- Place search, coordinate editing, map selection, boundary vertex editing/removal, and clear/redraw controls are present.
- Environmental dashboard shows NASA POWER monthly climatology, charts and a month-of-year selector, with units, source, retrieval/provenance information, and limitations. Missing soil-moisture and vegetation providers are explicitly unavailable.
- Crop rotation workbench compares baseline plus two alternatives under one scoring engine. Farmer priorities affect normalized criterion weights. Unknown criteria are excluded rather than awarded favorable defaults.
- Risk screening, trade-offs, uncertainty/completeness, and decision summary are connected through the workflow.
- English/Arabic language switching and RTL/LTR direction are functional in the checked flows.

## 3. NASA Dataset Integrations

| Dataset | Status | Evidence / limitation |
|---|---|---|
| NASA POWER | **PARTIALLY IMPLEMENTED** | Official point climatology endpoint requests AG community `T2M`, `PRECTOTCORR`, `RH2M`, and `ALLSKY_SFC_SW_DWN`. The application labels these monthly climatological references, not current observations. Units and missing values are normalized; provenance accompanies records. |
| SMAP | **NOT IMPLEMENTED** | Documented placeholder only. No SMAP values are displayed as real observations. |
| ECOSTRESS | **NOT IMPLEMENTED** | Documented placeholder; no evapotranspiration or thermal product is integrated. |
| GPM IMERG | **NOT IMPLEMENTED** | Documented placeholder; rainfall comes from POWER climatology, not GPM. |
| Landsat | **NOT IMPLEMENTED** | No Landsat analysis. Leaflet imagery is an Esri basemap and is identified as such. |
| MODIS | **NOT IMPLEMENTED** | Documented placeholder only. |
| GRACE / GRACE-FO | **NOT IMPLEMENTED** | Documented placeholder only; coarse water-storage products are not used as field measurements. |
| SRTM | **NOT IMPLEMENTED** | Documented placeholder only; no elevation sampling or terrain risk layer. |

POWER request example (also recorded in `src/services/nasa/README.md`):

```text
https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR%2CRH2M%2CALLSKY_SFC_SW_DWN&community=AG&longitude=31.31&latitude=30.825&format=JSON
```

The provider's endpoint and field structure are documented by NASA's [POWER Climatology API](https://power.larc.nasa.gov/docs/services/api/temporal/climatology/) and [Temporal APIs](https://power.larc.nasa.gov/docs/services/api/temporal/). The UI displayed a successful POWER climatology response during browser review. The payload was not independently reconciled against a separate NASA client. Provider error and malformed-response handling were tested with fixtures, not a live outage.

## 4. Environmental Analysis

| Category | Readiness | Current behavior |
|---|---|---|
| Rainfall | **PARTIALLY IMPLEMENTED** | POWER corrected precipitation monthly climatology in mm/day; no dated historical variability or forecast. |
| Soil moisture | **NOT IMPLEMENTED** | Explicitly unavailable; demo estimates are excluded from analysis. |
| Heat | **PARTIALLY IMPLEMENTED** | POWER air-temperature monthly climatology; no crop-stage stress model or local thresholds. |
| Vegetation | **NOT IMPLEMENTED** | No integrated vegetation index/canopy provider. |
| Water | **PARTIALLY IMPLEMENTED** | Relative humidity and precipitation can be seen as context; these do not directly measure farm water supply, groundwater, irrigation, or crop water stress. |

Charts describe twelve month-of-year climatological means, not dated historical time-series observations. The selected month changes the displayed climatology. Environmental analysis uses location-based point samples. The application does not claim precise field-scale or polygon-wide measurement.

## 5. Data Fusion

**PARTIALLY IMPLEMENTED.** An initial compatibility check avoids combining unsupported or incompatible observations; the UI reports when no compatible measurements are available. At present, POWER climatology is a single provider and does not form a multi-product fusion. No polygon aggregation or raster processing is implemented. Coarse gridded point values remain reference context, not per-field values. No synthetic demo records are combined with real POWER observations.

## 6. Crop Rotation Comparison

**PARTIALLY IMPLEMENTED.** One centralized evaluator compares three sequences using indicative crop-water needs, qualitative legume fixation potential, family diversity/pest-cycle proxy, and ordinal drought resilience. Priorities alter normalized weights; the same criteria and weights apply to all strategies. Unsupported traits are excluded. The baseline requires user confirmation before it is treated as the actual existing rotation.

Crop water figures are sourced indicative growing-period needs, not irrigation volumes, yield, water-use efficiency, or water saved. Nitrogen fixation is a qualitative potential, not a guaranteed quantity added to soil. Family diversity is a proxy, not a pest forecast. Regional calendars, soil response, crop-stage compatibility, market suitability, equipment, ground cover, and yield are not validated/scored. The evaluator is transparent about these assumptions but is not calibrated for a particular farm.

## 7. Risk Analysis

**PARTIALLY IMPLEMENTED.** The module lists water stress, heat stress, rainfall variability, vegetation stress, erosion, crop suitability, and seasonal vulnerability. Conditions are left **Unclassified** when the required observations or validated local thresholds are absent. POWER climatology is supporting exposure context only; it is not treated as a forecast. Spatial risk surfaces and colored hotspots are not generated. Polygon geometry is preserved, but current data is not aggregated over it.

## 8. Trade-off Analysis

**PARTIALLY IMPLEMENTED.** Strategy criteria are compared against the baseline with displayed improvements and sacrifices. Bars represent relative supported trait scores only, not production, profit, or yield. Market fit, soil cover, production constraints, and local growing-season compatibility remain unavailable, so those trade-offs cannot be resolved.

## 9. Uncertainty Handling

**PARTIALLY IMPLEMENTED.** The application reports qualitative evidence completeness, source, temporal/spatial limitations, missing inputs, and assumptions. It does not emit invented confidence percentages. Current completeness reflects crop evidence coverage and remaining gaps; it is not statistical confidence or probability of success. Actual data quality/measurement uncertainty is not quantified.

## 10. Known Limitations

- Only POWER monthly climatology is integrated; no dated historical data, forecasts, or raster processing.
- POWER climatology period metadata may not be returned by the response; the interface states this instead of inventing a period.
- No field-level soil moisture, vegetation stress, crop heat/water thresholds, erosion model, or farm-wide environmental statistics.
- Crop catalog evidence is incomplete and not locally calibrated; baseline rotation starts from a template and must be confirmed.
- No market/yield/financial estimates or guaranteed recommendation.
- Search service quota/policy behavior and external API outage UX were not exhaustively tested.
- No mobile device emulation, full keyboard-only audit, screen-reader review, or formal accessibility/performance measurement was performed.
- Global styles and small labels/nested scrolling warrant an accessibility and mobile usability pass; this QA did not claim WCAG conformance.
- `npm run lint` invokes `next lint` without an ESLint configuration. It opened the interactive setup prompt and exited nonzero; no lint results are available.
- The initial browser error on port 3001 occurred in a stale concurrent Next dev/build session sharing `.next`; the clean app session loaded successfully. This is recorded as a test-environment collision, not as a confirmed app defect.
- Static review found no private credential or environment-secret dependency in the client-side POWER integration. The route's production bundle is 132 kB with 226 kB first-load JavaScript in the build output; no browser performance profile or Core Web Vitals measurement was taken. No new dependencies were added during QA.

## 11. Testing Results

| Check | Result | Evidence |
|---|---|---|
| `npm run test:data` | **PASS — 14/14** | Five farm geometry/area cases, two POWER provider cases, three risk/uncertainty cases, four rotation-engine cases. |
| `npm run test:rotation` | **PASS — 4/4** | Shared scoring direction, unsupported data, priority weighting, catalog fields. |
| `npm run build` | **PASS after clean single-process retry** | Initial concurrent build attempt hit `EPERM` creating `.next`; after confirming no Node/Next listeners remained on ports 3000/3001, production compilation, static generation (5/5), and build tracing completed successfully. |
| `git diff --check` | **PASS** | No whitespace errors; Git reported only its usual LF-to-CRLF working-copy notices. |
| `npm run lint` | **NOT VERIFIED** | Next.js first-run ESLint configuration prompt; command is not noninteractive/configured. |
| Browser workflow, desktop | **PARTIAL PASS** | App loaded at localhost; point selection view, manual area, feddan-to-hectare conversion (4 feddan ≈ 1.680333 ha), invalid latitude message, polygon duplicate-point validation/removal/clear, mode switching, strategy comparison, priority slider and selection, climatology month selection, Arabic/RTL and English switch, decision summary. |
| Draw/edit valid polygon with pointer geometry | **NOT VERIFIED end-to-end** | Browser automation added three coincident vertices and confirmed appropriate duplicate-vertex error; robust geodesic valid polygon, longitude-first GeoJSON, and self-intersection checks pass in unit tests. Dragging map vertices was not manually completed. |
| Mobile, accessibility, performance, deployment | **NOT VERIFIED** | No device emulation/formal instrumentation/deployment test. |

### Defect fixed during QA

Rotation percentages and criterion values were rendered directly from fractional floating-point results (e.g., `33.333333333333336`). The strategy workbench and summary now round those display values to whole-number percentages/scores without changing evaluation or ranking math. The build and existing calculation tests cover the change; no scoring logic was altered.

Three regression cases were added for risk/uncertainty behavior: climatology remains unclassified and creates no spatial zone, uncertainty remains qualitative with `confidence: null`, and absent observations produce unavailable evidence.

## 12. Remaining Work

1. Configure a repository ESLint setup and rerun lint noninteractively.
2. Add browser-level automated workflow tests for valid polygon drawing/editing, mode-switch retention, API error/empty states, and decision summary.
3. Perform real mobile viewport, keyboard focus, screen-reader, and accessibility review; fix confirmed issues.
4. Validate the NASA POWER value/units/response metadata against a saved official response and document expected climatology baseline semantics.
5. Add dated historical products only after selecting verified products, auth/access paths, spatial support, quality flags, and a defensible sampling method.
6. Add locally sourced crop calendars/soil tests and documented agronomic validation before presenting farm-specific suitability or risk classifications.
7. Reassess integrations when NASA Space Apps 2026 publishes final resources/products.

## 13. Compliance Matrix Against the Official Challenge

The challenge reference calls for using NASA Earth observations alongside local soil data, crop characteristics, and farmer priorities to explore rotations for improved soil health and adaptation. Statuses below refer to evidenced application behavior, not the presence of UI copy alone.

| Requirement / capability | Status | Basis |
|---|---|---|
| Public interactive app; no registration required | **FULLY IMPLEMENTED** | Public client workflow; no account/backend dependency. |
| Use genuine NASA Earth-observation data | **PARTIALLY IMPLEMENTED** | NASA POWER monthly climatology only; not a multi-source Earth-observation analysis. |
| Accurately label measurement type, date/period, units, source and limitations | **PARTIALLY IMPLEMENTED** | POWER provenance and climatology labeling present; response may not provide dated observations or the climatology baseline period. |
| Integrate NASA satellite products such as SMAP, ECOSTRESS, GPM, Landsat, MODIS, GRACE or SRTM | **NOT IMPLEMENTED** | All remain documented placeholders. |
| Combine local soil information with environmental data | **NOT IMPLEMENTED** | Soil type is optional user-entered context; there is no soil dataset or analysis. |
| Use sourced crop characteristics | **PARTIALLY IMPLEMENTED** | Some sourced indicative traits are present; coverage and local applicability are limited. |
| Incorporate farmer priorities | **FULLY IMPLEMENTED** | Users can adjust criterion weights and see relative score consequences. |
| Compare existing rotation with alternatives | **PARTIALLY IMPLEMENTED** | Three comparable sequences and a baseline exist, but baseline is a template unless confirmed; recommendations are not agronomically validated. |
| Support soil health improvement | **NOT IMPLEMENTED** | No soil dynamics, soil-health response model, or measured change is calculated. |
| Support adaptation to environmental conditions | **PARTIALLY IMPLEMENTED** | POWER climatology provides context; no validated farm-specific suitability, forecast, or future climate scenario. |
| Understand risk with evidence | **PARTIALLY IMPLEMENTED** | Risk categories and limitations are explained; no validated classifications or spatial risk layer. |
| Reveal strategy trade-offs | **PARTIALLY IMPLEMENTED** | Relative sourced-trait comparisons; several farmer-relevant outcomes lack evidence. |
| Make uncertainty visible | **PARTIALLY IMPLEMENTED** | Qualitative evidence completeness and limitations are visible; no statistical uncertainty model. |
| Spatially analyze farm boundaries | **NOT IMPLEMENTED** | Boundary capture and geodesic area work; no supported polygon environmental aggregation. |
| Provide forecast or guarantee yields/financial return | **NOT IMPLEMENTED** | No forecasts/yield/return are generated, appropriately. |
| Support Arabic and English interface | **PARTIALLY IMPLEMENTED** | Main checked flows translate and switch direction; full site-wide translation coverage is not verified. |

