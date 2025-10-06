import {
  CanActivateFn,
  CanMatch,
  CanMatchFn,
  RedirectCommand,
  Router,
  Routes,
} from '@angular/router';

import { inject } from '@angular/core';
import { CategoricalMoviesComponent } from './movies/categorical-movies/categorical-movies.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthService } from './services/auth.service';
import { ProfileComponent } from './profile/profile.component';
import { MovieShowComponent } from './movies/movie-show/movie-show.component';
import { SearchResultsComponent } from './movies/search-results/search-results.component';
import { FavoritesComponent } from './profile/favorites/favorites.component';

const dummyCanMatch: CanMatchFn = (route, segments) => {
  const router = inject(Router);
  const shouldgetaccess = Math.random();
  if (shouldgetaccess < 0.5) {
    return true;
  }
  return new RedirectCommand(router.parseUrl('/unauthorized'));
};

const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true; // allow navigation
  }

  // redirect to login if not logged in
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'movies/popular?page=1',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: SignupComponent,
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
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
    component: SearchResultsComponent,
  },
];
