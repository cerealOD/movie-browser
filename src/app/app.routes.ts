import { CanActivateFn, Router, Routes } from '@angular/router';

import { inject } from '@angular/core';
import { CategoricalMoviesComponent } from './movies/categorical-movies/categorical-movies.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthService } from './services/auth.service';
import { MovieShowComponent } from './movies/movie-show/movie-show.component';
import { SearchResultsComponent } from './movies/search-results/search-results.component';
import { FavoritesComponent } from './favorites/favorites.component';

const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true; // allow navigation
  }

  // redirect to login if not logged in
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'movies/popular?page=1',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./favorites/favorites.component').then(
        (mod) => mod.FavoritesComponent
      ), // lazy load this route
    canActivate: [authGuard],
  },

  {
    path: 'movies/:category',
    component: CategoricalMoviesComponent,
  },
  {
    path: 'movie/:id',
    component: MovieShowComponent,
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./movies/search-results/search-results.component').then(
        (mod) => mod.SearchResultsComponent
      ), // lazy load this route
  },
];
