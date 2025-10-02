import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HeaderService {
  dropdownOpen = signal(false);

  open() {
    this.dropdownOpen.set(true);
  }

  close() {
    this.dropdownOpen.set(false);
  }

  toggle() {
    this.dropdownOpen.update((open) => !open);
  }
}
