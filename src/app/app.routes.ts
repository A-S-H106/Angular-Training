import { Routes } from '@angular/router';
import { Countries } from './pages/countries/countries';
import { Weather } from './pages/weather/weather';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', component: Countries },
  { path: 'weather', component: Weather },
  // Add your real application routes above this line.
  { path: '**', component: NotFound },
];
