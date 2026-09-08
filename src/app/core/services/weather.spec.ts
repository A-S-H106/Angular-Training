import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { WeatherService } from './weather';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('geocodes the city, then fetches weather for those coordinates', () => {
    let result: any;

    service.getWeatherForCity('Berlin').subscribe((data) => (result = data));

    const geoReq = httpMock.expectOne(
      (req) => req.url === 'https://geocoding-api.open-meteo.com/v1/search'
    );
    geoReq.flush({
      results: [{ name: 'Berlin', latitude: 52.52, longitude: 13.405 }],
    });

    const forecastReq = httpMock.expectOne(
      (req) => req.url === 'https://api.open-meteo.com/v1/forecast'
    );
    expect(forecastReq.request.params.get('latitude')).toBe('52.52');
    expect(forecastReq.request.params.get('longitude')).toBe('13.405');

    forecastReq.flush({
      latitude: 52.52,
      longitude: 13.405,
      timezone: 'Europe/Berlin',
      current: { time: '2026-09-08T14:00', temperature_2m: 18.3, weather_code: 1 },
    });

    expect(result.current.temperature_2m).toBe(18.3);
    expect(result.timezone).toBe('Europe/Berlin');
  });

  it('errors when the geocoding API finds no match', () => {
    let errorMessage = '';

    service.getWeatherForCity('Nowhereville').subscribe({
      error: (err) => (errorMessage = err.message),
    });

    const geoReq = httpMock.expectOne(
      (req) => req.url === 'https://geocoding-api.open-meteo.com/v1/search'
    );
    geoReq.flush({ results: [] });

    expect(errorMessage).toContain('No location found');
  });
});
