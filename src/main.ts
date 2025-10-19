import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';
import { routes } from './app/app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {
  RouteReuseStrategy,
  DetachedRouteHandle,
  ActivatedRouteSnapshot,
} from '@angular/router';

//cache and reuse movies/:category routes to preserve state
export class CustomReuseStrategy implements RouteReuseStrategy {
  //store detached routes
  private storedHandles = new Map<string, DetachedRouteHandle>();

  //only detach the CategoricalMovies component
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.routeConfig?.path === 'movies/:category';
  }

  //store detached component
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const key = this.getKey(route);
    this.storedHandles.set(key, handle);
  }

  //will attach stored component if we have one
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = this.getKey(route);
    return this.storedHandles.has(key);
  }

  //get the stored element
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = this.getKey(route);
    return this.storedHandles.get(key) ?? null;
  }

  //default method implemented
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  //create keys for each category so we can cache them separately
  private getKey(route: ActivatedRouteSnapshot): string {
    const category = route.paramMap.get('category');
    return `movies/${category}`;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
      })
    ),
    provideHttpClient(),
  ],
}).catch((err) => console.error(err));
