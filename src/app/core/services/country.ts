import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Country } from '../models/country.model';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private readonly countriesUrl = 'https://worldfactbook.io/api/v1/countries';

  constructor(private http: HttpClient) {}

  /**
   * Fetches the full list of countries with headline fields
   * (name, region, capital, population, etc.).
   */
  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.countriesUrl);
  }
}
