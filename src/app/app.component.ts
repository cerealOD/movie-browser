import { Component, effect, inject, Renderer2 } from '@angular/core';

import { HeaderComponent } from './header/header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { AuthService } from './services/auth.service';
import { MoviesService } from './services/movies.service';
import { ToastComponent } from './toast/toast/toast.component';
import { HeaderService } from './services/header.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [HeaderComponent, RouterOutlet, FooterComponent, ToastComponent],
})
export class AppComponent {
  headerService = inject(HeaderService);

  private auth = inject(AuthService);
  private movies = inject(MoviesService);
  private renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      if (this.auth.isLoggedIn()) {
        this.movies.loadUserFavorites().subscribe();
      }
    });
    effect(() => {
      if (this.headerService.isMenuOpen()) {
        this.renderer.addClass(document.body, 'overflow-hidden');
      } else {
        this.renderer.removeClass(document.body, 'overflow-hidden');
      }
    });
  }
}
