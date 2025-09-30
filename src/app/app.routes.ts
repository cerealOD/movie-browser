import {
  CanMatch,
  CanMatchFn,
  RedirectCommand,
  Router,
  Routes,
} from '@angular/router';

import { inject } from '@angular/core';
import { PopularMoviesComponent } from './movies/popular-movies/popular-movies.component';
import { AllMoviesComponent } from './movies/all-movies/all-movies.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

const dummyCanMatch: CanMatchFn = (route, segments) => {
  const router = inject(Router);
  const shouldgetaccess = Math.random();
  if (shouldgetaccess < 0.5) {
    return true;
  }
  return new RedirectCommand(router.parseUrl('/unauthorized'));
};

export const routes: Routes = [
  {
    path: '',
    component: AllMoviesComponent,
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
    path: 'popular',
    component: PopularMoviesComponent,
  },
  {
    path: 'top-rated',
    component: PopularMoviesComponent,
  },
  {
    path: 'now-playing',
    component: PopularMoviesComponent,
  },
  {
    path: 'upcoming',
    component: PopularMoviesComponent,
  },
];
