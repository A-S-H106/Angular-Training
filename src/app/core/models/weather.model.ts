/** A single match from the Open-Meteo geocoding API. */
export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  timezone?: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
}

/** The "current" block from the Open-Meteo forecast API. */
export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  weather_code: number;
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
}
