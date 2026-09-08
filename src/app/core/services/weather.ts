import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';

import { GeocodingResponse, ForecastResponse, CurrentWeather } from '../models/weather.model';

export interface CityWeather {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';
  private readonly forecastUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) {}

  /**
   * Looks up a city's coordinates, then fetches its current temperature
   * and weather code. Used to show the weather for a country's capital.
   */
  getWeatherForCity(cityName: string): Observable<CityWeather> {
    return this.geocodeCity(cityName).pipe(
      switchMap(({ latitude, longitude }) => this.getCurrentWeather(latitude, longitude))
    );
  }

  private geocodeCity(cityName: string): Observable<{ latitude: number; longitude: number }> {
    const url = `${this.geocodingUrl}?name=${encodeURIComponent(cityName)}&count=1`;

    return this.http.get<GeocodingResponse>(url).pipe(
      map((response) => {
        const match = response.results?.[0];
        if (!match) {
          throw new Error(`No location found for "${cityName}".`);
        }
        return { latitude: match.latitude, longitude: match.longitude };
      })
    );
  }

  private getCurrentWeather(latitude: number, longitude: number): Observable<CityWeather> {
    const url =
      `${this.forecastUrl}?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,weather_code&timezone=auto`;

    return this.http.get<ForecastResponse>(url).pipe(
      map((response) => {
        if (!response.current) {
          throw new Error('Weather data is unavailable for this location.');
        }
        return {
          latitude,
          longitude,
          timezone: response.timezone,
          current: response.current,
        };
      })
    );
  }
}
