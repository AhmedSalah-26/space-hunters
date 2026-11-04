# NASA environmental data providers

## Provider contract

Each integrated provider exposes `id`, `name`, and `request(options)`. A request resolves to normalized `EnvironmentalObservation[]` records (`variable`, scalar `value` or `null`, `unit`, temporal labels, quality, and traceable `source` metadata) or rejects with an error. Missing product values remain `null`; transport, HTTP, and malformed-response errors reject and are shown in Farm Pro. Provider entries without a request method are catalog/documentation placeholders only.

## NASA POWER integration

`powerProvider.js` requests the official public point **climatology** endpoint for the farm reference coordinate. It requests `T2M`, `PRECTOTCORR`, `RH2M`, and `ALLSKY_SFC_SW_DWN` for the AG community. These are returned as 12 monthly climatological values for each variable (48 observations), not current conditions. Precipitation stays in the API's `mm/day` unit; the UI does not multiply it into an assumed 30-day monthly total. Units are the POWER API's AG community units, including `MJ/m²/day` for solar radiation. The provider converts numeric values and maps non-numeric/null, POWER's `-999` missing marker, and response-declared fill values to `null`.

Request example (substitute the selected latitude/longitude):

```text
https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR%2CRH2M%2CALLSKY_SFC_SW_DWN&community=AG&longitude=31.31&latitude=30.825&format=JSON
```

The endpoint shape, community parameter, multi-parameter syntax and JSON format follow NASA's [Climatology API documentation](https://power.larc.nasa.gov/docs/services/api/temporal/climatology/). NASA documents daily, monthly, hourly and climatology products separately in its [Temporal APIs documentation](https://power.larc.nasa.gov/docs/services/api/temporal/). This first integration intentionally requests climatology only. The code does not claim a chosen historical baseline when the API response does not provide its period; response period metadata is retained when available.

The browser request is anonymous and has no private credential. The component aborts stale requests and enforces a 7-second timeout. Successful point responses are kept in a bounded in-memory cache for 15 minutes to avoid repeat requests at the same exact coordinate. Failed requests are not cached. Farm Pro shows an error state and keeps demo estimates visibly marked as demo; they are not inserted as replacements for missing NASA measurements.

## Investigated sources not integrated

These are possible future providers, not active data sources. Availability of a catalog/product does not mean that this client can currently retrieve/process it.

| Source | Verified access path | Why it remains a placeholder |
| --- | --- | --- |
| SMAP | [NSIDC SMAP data](https://nsidc.org/data/smap) distributes multiple products; NASA Earthdata authentication/access mechanisms apply to protected downloads. | Needs a specific product, temporal choice, auth-aware server route, and raster/pixel extraction strategy. It is not a ready unauthenticated point API here. |
| ECOSTRESS | [NASA AppEEARS API](https://appeears.earthdatacloud.nasa.gov/api/) and Earthdata Search expose versioned products; [LP DAAC's 2025 notice](https://www.earthdata.nasa.gov/data/alerts-outages/higher-level-ecostress-version-2-historic-processing-complete) documents V2 availability. | AppEEARS is a task/product workflow with Earthdata account/token requirements and variable product/quality handling. Pick a product and build a protected Next.js proxy before enabling it. |
| GPM IMERG | [NASA GES DISC collections](https://cmr.earthdata.nasa.gov/search/site/collections/directory/GES_DISC/gov.nasa.eosdis) list daily, half-hourly and monthly IMERG products. | Requires temporal/product selection, authenticated subset/granule access and raster value extraction. No source was presented as Farm Pro measurements. |
| Landsat | [NASA Landsat data overview](https://landsat.gsfc.nasa.gov/data/) links to mission data access. | Image products require scene search, cloud/quality masking and pixel processing. A point lookup is not an environmental observation provider. |
| MODIS | [NASA AppEEARS API](https://appeears.earthdatacloud.nasa.gov/api/) offers access to LP DAAC products; product access paths are changing, including [the Collection 6.1 OPeNDAP transition notice](https://www.earthdata.nasa.gov/data/alerts-outages/modis-version-6-1-opendap-access-lp-daac-retired). | Requires product/temporal selection, auth-aware access, quality screening, and raster extraction. Avoid binding the app to a retired endpoint. |
| GRACE / GRACE-FO | [NASA PO.DAAC mission data](https://podaac.jpl.nasa.gov/GRACE-FO) lists gravity and water-storage products. | Monthly, coarse-scale products are not field-scale soil moisture; access and geospatial processing must be designed around an appropriate product. |
| SRTM | [LP DAAC SRTMGL1 v003](https://lpdaac.usgs.gov/products/srtmgl1v003/) documents a global 1 arc-second elevation product. | Static elevation is available but requires a product access/subsetting route and raster sampling; it is not yet used by current features. |

No placeholder requests data, fabricates product identifiers or returns environmental values. Reassess these choices when the challenge publishes its final resource list.
