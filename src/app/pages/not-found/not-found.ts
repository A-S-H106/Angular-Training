import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  /** The path the user tried to hit, shown inside the mock terminal output. */
  readonly attemptedPath = signal<string>('');

  constructor(private router: Router) {
    this.attemptedPath.set(window.location.pathname || '/unknown-route');
  }

  goHome(): void {
    this.router.navigateByUrl('/');
  }
}
