import { Injectable } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ScrollPositionService {
  private positions = new Map<string, number>();

  //restore scroll position
  constructor(private router: Router) {
    let lastUrl: string | null = null;

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart && lastUrl) {
        this.positions.set(lastUrl, window.scrollY);
      }

      if (event instanceof NavigationEnd) {
        lastUrl = event.urlAfterRedirects;

        requestAnimationFrame(() => {
          const pos = this.positions.get(event.urlAfterRedirects);
          if (pos !== undefined) window.scrollTo(0, pos);
        });
      }
    });
  }
}
