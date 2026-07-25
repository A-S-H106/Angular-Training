import { Routes } from '@angular/router';
import { Countries } from './pages/countries/countries';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', component: Countries },
  // Add your real application routes above this line.
  { path: '**', component: NotFound },
];
