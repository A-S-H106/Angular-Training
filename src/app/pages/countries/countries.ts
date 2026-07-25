import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountryService } from '../../core/services/country';
import { Country } from '../../core/models/country.model';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countries.html',
  styleUrl: './countries.css',
})
export class Countries implements OnInit {
  /** Raw list as returned by the API. */
  private readonly countries = signal<Country[]>([]);

  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  /** Alphabetically sorted by name for a predictable, scannable table. */
  readonly sortedCountries = computed(() =>
    [...this.countries()].sort((a, b) => a.name.localeCompare(b.name))
  );

  readonly countryCount = computed(() => this.countries().length);

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.fetchCountries();
  }

  fetchCountries(): void {
    this.loading.set(true);
    this.error.set(null);

    this.countryService.getCountries().subscribe({
      next: (data) => {
        this.countries.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(
          'Could not load countries right now. Please check your connection and try again.'
        );
        this.loading.set(false);
      },
    });
  }

  /** Converts a raw population string/number into "34.7" (millions, 1 decimal). */
  populationInMillions(population: string | number): string {
    const value = typeof population === 'string' ? parseFloat(population) : population;

    if (!value || Number.isNaN(value)) {
      return 'N/A';
    }

    return (value / 1_000_000).toFixed(1);
  }
}
