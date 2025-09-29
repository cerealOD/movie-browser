import { Component, inject } from '@angular/core';

import { PopularMoviesComponent } from './movies/popular-movies/popular-movies.component';
import { ErrorService } from './shared/error.service';
import { ErrorModalComponent } from './shared/modal/error-modal/error-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [PopularMoviesComponent, ErrorModalComponent],
})
export class AppComponent {
  private errorService = inject(ErrorService);
  error = this.errorService.error;
}
