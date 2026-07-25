import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { Countries } from './countries';
import { Country } from '../../core/models/country.model';

describe('Countries', () => {
  let httpMock: HttpTestingController;

  const mockCountries: Country[] = [
    {
      name: 'Germany',
      region: 'Europe',
      capital: 'Berlin',
      population: '84400000',
      flag: '🇩🇪',
    },
    {
      name: 'Brazil',
      region: 'South America',
      capital: 'Brasília',
      population: '215300000',
      flag: '🇧🇷',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Countries],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Countries);
    fixture.detectChanges();
    const req = httpMock.expectOne('https://worldfactbook.io/api/v1/countries');
    req.flush(mockCountries);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should load and sort countries alphabetically by name', () => {
    const fixture = TestBed.createComponent(Countries);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const req = httpMock.expectOne('https://worldfactbook.io/api/v1/countries');
    req.flush(mockCountries);
    fixture.detectChanges();

    expect(component.loading()).toBeFalse();
    expect(component.sortedCountries().map((c) => c.name)).toEqual(['Brazil', 'Germany']);
  });

  it('should set an error message when the request fails', () => {
    const fixture = TestBed.createComponent(Countries);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const req = httpMock.expectOne('https://worldfactbook.io/api/v1/countries');
    req.error(new ProgressEvent('Network error'));
    fixture.detectChanges();

    expect(component.loading()).toBeFalse();
    expect(component.error()).toBeTruthy();
  });

  it('should format population in millions rounded to one decimal', () => {
    const fixture = TestBed.createComponent(Countries);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const req = httpMock.expectOne('https://worldfactbook.io/api/v1/countries');
    req.flush(mockCountries);

    expect(component.populationInMillions('34678345')).toBe('34.7');
    expect(component.populationInMillions('84400000')).toBe('84.4');
  });
});
