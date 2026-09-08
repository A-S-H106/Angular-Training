import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { WeatherService, CityWeather } from '../../core/services/weather';
import { describeWeatherCode } from './weather-codes';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './weather.html',
  styleUrl: './weather.css',
})
export class Weather implements OnInit {
  readonly countryName = signal<string>('');
  readonly capitalName = signal<string>('');

  readonly weather = signal<CityWeather | null>(null);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  /** e.g. "October 12, 2026, 3:45 PM" — formatted from the API's local time string. */
  readonly formattedDateTime = computed(() => {
    const current = this.weather();
    if (!current) return '';

    // The API returns a naive local time like "2026-10-12T15:45" with no
    // timezone suffix. Parsing it directly (no Z) makes JS treat the
    // numbers as-is, so formatting it back out reproduces the capital's
    // own local wall-clock time rather than converting time zones.
    const date = new Date(current.current.time);

    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(date);
  });

  readonly temperatureCelsius = computed(() => {
    const current = this.weather();
    return current ? Math.round(current.current.temperature_2m * 10) / 10 : null;
  });

  readonly conditionText = computed(() => {
    const current = this.weather();
    return current ? describeWeatherCode(current.current.weather_code) : null;
  });

  constructor(
    private route: ActivatedRoute,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const country = params.get('country') ?? '';
    const capital = params.get('capital') ?? '';

    this.countryName.set(country);
    this.capitalName.set(capital);

    if (!capital) {
      this.loading.set(false);
      this.error.set('No capital city was provided for this country.');
      return;
    }

    this.fetchWeather(capital);
  }

  fetchWeather(capital: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.weatherService.getWeatherForCity(capital).subscribe({
      next: (data) => {
        this.weather.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(
          `Could not load weather for ${capital}. Please try again in a moment.`
        );
        this.loading.set(false);
      },
    });
  }

  retry(): void {
    const capital = this.capitalName();
    if (capital) {
      this.fetchWeather(capital);
    }
  }
}
