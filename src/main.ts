import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import {
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';
import { routes } from './app/app.routes';
import { tap } from 'rxjs';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

function loggingInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  return next(request).pipe(
    tap({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          // console.log('incoming response' + event.status + event.body);
        }
      },
    })
  );
}

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimationsAsync(),
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
    provideHttpClient(withInterceptors([loggingInterceptor])),
  ],
}).catch((err) => console.error(err));
