import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CountryService } from '../../core/services/country';
import { Country } from '../../core/models/country.model';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  templateUrl: './countries.html',
  styleUrl: './countries.css',
})
export class Countries implements OnInit {
  /** Raw list as returned by the API. */
  private readonly countries = signal<Country[]>([]);

  readonly loading = signal<boolean>(true);
  readonly hasError = signal<boolean>(false);

  readonly displayedColumns = ['name', 'region', 'capital', 'population'];
  readonly dataSource = new MatTableDataSource<Country>([]);

  /** What the user has typed / selected in the autocomplete filter field. */
  filterValue = '';

  /** Alphabetically sorted by name for a predictable, scannable table. */
  readonly sortedCountries = computed(() =>
    [...this.countries()].sort((a, b) => a.name.localeCompare(b.name))
  );

  readonly countryCount = computed(() => this.countries().length);

  /** Autocomplete suggestions: country names matching the current filter text. */
  readonly filteredNames = computed(() => {
    const query = this.filterValue.trim().toLowerCase();
    const names = this.sortedCountries().map((c) => c.name);

    if (!query) {
      return names.slice(0, 20);
    }
    return names.filter((name) => name.toLowerCase().includes(query)).slice(0, 20);
  });

  constructor(
    private countryService: CountryService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Filter by country name only, not the whole row's stringified contents.
    this.dataSource.filterPredicate = (country, filter) =>
      country.name.toLowerCase().includes(filter);

    // Keep the Material table's data source in sync with the loaded/sorted countries.
    effect(() => {
      this.dataSource.data = this.sortedCountries();
    });
  }

  ngOnInit(): void {
    this.fetchCountries();
  }

  fetchCountries(): void {
    this.loading.set(true);
    this.hasError.set(false);

    this.countryService.getCountries().subscribe({
      next: (data) => {
        this.countries.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.hasError.set(true);
        this.showError(
          'Could not load countries right now. Please check your connection and try again.'
        );
      },
    });
  }

  /** Applies the typed text as a live filter on the Material table. */
  onFilterInput(value: string): void {
    this.filterValue = value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  /** Applies the chosen autocomplete option as the table filter. */
  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value as string;
    this.filterValue = value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  clearFilter(): void {
    this.filterValue = '';
    this.dataSource.filter = '';
  }

  /** Converts a raw population string/number into "34.7" (millions, 1 decimal). */
  populationInMillions(population: string | number): string {
    const value = typeof population === 'string' ? parseFloat(population) : population;

    if (!value || Number.isNaN(value)) {
      return 'N/A';
    }

    return (value / 1_000_000).toFixed(1);
  }

  /** Navigates to the weather page for the selected country's capital. */
  goToWeather(country: Country): void {
    if (!country.capital) {
      this.showError(`No capital city is on record for ${country.name}.`);
      return;
    }

    this.router.navigate(['/weather'], {
      queryParams: { country: country.name, capital: country.capital },
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Retry', { duration: 6000 }).onAction().subscribe(() => {
      this.fetchCountries();
    });
  }
}
