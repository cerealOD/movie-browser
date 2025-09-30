import { Component, inject } from '@angular/core';

import { ErrorService } from './shared/error.service';
import { ErrorModalComponent } from './shared/modal/error-modal/error-modal.component';
import { HeaderComponent } from './header/header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    ErrorModalComponent,
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
  ],
})
export class AppComponent {
  private errorService = inject(ErrorService);
  error = this.errorService.error;
}
