import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

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
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideNoopAnimations(),
      ],
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

  it('should load and sort countries alphabetically by name into the table data source', () => {
    const fixture = TestBed.createComponent(Countries);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const req = httpMock.expectOne('https://worldfactbook.io/api/v1/countries');
    req.flush(mockCountries);
    fixture.detectChanges();

    expect(component.loading()).toBeFalse();
    expect(component.dataSource.data.map((c) => c.name)).toEqual(['Brazil', 'Germany']);
  });

  it('should set an error flag when the request fails', () => {
    const fixture = TestBed.createComponent(Countries);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const req = httpMock.expectOne('https://worldfactbook.io/api/v1/countries');
    req.error(new ProgressEvent('Network error'));
    fixture.detectChanges();

    expect(component.loading()).toBeFalse();
    expect(component.hasError()).toBeTrue();
  });

  it('should filter the table data source by typed name', () => {
    const fixture = TestBed.createComponent(Countries);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const req = httpMock.expectOne('https://worldfactbook.io/api/v1/countries');
    req.flush(mockCountries);
    fixture.detectChanges();

    component.onFilterInput('ger');
    expect(component.dataSource.filteredData.map((c) => c.name)).toEqual(['Germany']);
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
