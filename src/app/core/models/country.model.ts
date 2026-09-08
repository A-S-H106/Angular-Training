/**
 * Shape of a single record returned by
 * https://worldfactbook.io/api/v1/countries/
 *
 * Only the fields we actually use are typed strictly; the rest are
 * marked optional/unknown so the app doesn't break if the API adds
 * or omits fields.
 */
export interface Country {
  name: string;
  slug?: string;
  flag?: string;
  region: string;
  capital: string;
  /** The API returns population as a numeric string, e.g. "84400000". */
  population: string;
  gdp?: number;
  gdpPerCapita?: number;
  hdiScore?: number;
  democracyScore?: number;
  corruptionIndex?: number;
  dataUpdatedAt?: string;
}
