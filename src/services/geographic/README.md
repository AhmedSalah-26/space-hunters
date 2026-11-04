# Geographic service boundary

Location lookup and map rendering remain in the existing Farm Pro UI for this preparation phase. New geographic providers belong here so components can consume normalized results rather than owning provider URLs and response parsing. `FarmLocation` and `FarmArea` contracts are documented in `src/data/models.js`.

The current Leaflet basemap is Esri World Imagery with a reference-label layer, not NASA observation imagery. Farm marker circles are illustrative and must not be treated as farm boundaries or area measurements.
