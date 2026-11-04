import { powerProvider } from './powerProvider';

/**
 * Catalog of investigated NASA/Earthdata sources. Entries marked
 * `not-integrated` are documentation only and intentionally expose no request
 * method: they must not be presented as available environmental observations.
 */
export const nasaEnvironmentalProviders = Object.freeze({
  power: powerProvider,
  smap: { id: 'nasa-smap', name: 'SMAP', status: 'not-integrated', documentation: 'https://nsidc.org/data/smap' },
  ecostress: { id: 'nasa-ecostress', name: 'ECOSTRESS', status: 'not-integrated', documentation: 'https://appeears.earthdatacloud.nasa.gov/api/' },
  gpm: { id: 'nasa-gpm', name: 'GPM IMERG', status: 'not-integrated', documentation: 'https://disc.gsfc.nasa.gov/datasets?keywords=IMERG' },
  landsat: { id: 'landsat', name: 'Landsat', status: 'not-integrated', documentation: 'https://landsat.gsfc.nasa.gov/data/' },
  modis: { id: 'nasa-modis', name: 'MODIS Land', status: 'not-integrated', documentation: 'https://appeears.earthdatacloud.nasa.gov/api/' },
  grace: { id: 'grace-gracefo', name: 'GRACE and GRACE-FO', status: 'not-integrated', documentation: 'https://podaac.jpl.nasa.gov/GRACE-FO' },
  srtm: { id: 'nasa-srtm', name: 'SRTM', status: 'not-integrated', documentation: 'https://lpdaac.usgs.gov/products/srtmgl1v003/' },
});
