# Analysis boundaries

Analysis modules are kept separate from screen components. `environmental/fusion.js` currently groups only compatible observations that share provider/dataset, data kind, coordinate reference system, exact point, reference period, temporal coverage/resolution and spatial resolution. It retains each measurement and its unit without computing a composite score. Missing values and demo records are excluded. Polygon input remains a centroid point sample until a product supports defensible area aggregation.

No crop rotation scoring or agronomic recommendation logic has been added in this phase. Future calculations should remain pure functions with explicit units, inputs, provenance, quality and limitations; UI components should format results and show the source context.

Suggested boundaries: `environmental/` for observation transformations, `rotation/` for strategy metrics, `risk/` for risk indicators, and `uncertainty/` for confidence/limitations. Keep demo data under `src/data/demo/` and label it with `DATA_KINDS.DEMO`.
