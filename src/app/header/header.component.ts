import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AsyncPipe } from '@angular/common';
import { HeaderService } from '../services/header.service';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @ViewChild('dropdownWrapper') dropdownWrapper!: ElementRef;
  @ViewChild('sideMenu') sideMenu!: ElementRef;
  auth = inject(AuthService);
  headerService = inject(HeaderService);
  searchQuery = '';

  private router = inject(Router);

  initial = computed(
    () => this.auth.user()?.username.charAt(0).toUpperCase() ?? '?'
  );

  ngOnInit() {
    // Clear search when leaving search page
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (!event.url.startsWith('/search')) {
          this.searchQuery = '';
        }
      });
  }

  // close menus when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    // close dropdown
    if (
      this.headerService.dropdownOpen() &&
      !this.dropdownWrapper.nativeElement.contains(event.target)
    ) {
      this.headerService.close();
    }
    //close sidemenu
    if (
      this.headerService.isMenuOpen() &&
      !this.sideMenu.nativeElement.contains(event.target)
    ) {
      this.headerService.toggleMenu();
    }
  }

  toggleDropdown(event?: Event) {
    if (event) event.stopPropagation();
    this.headerService.toggle();
  }

  logout() {
    this.auth.logout();
    this.headerService.close();
    this.router.navigate(['/auth/login']);
  }

  onSearch() {
    if (!this.searchQuery.trim()) return;
    if (this.headerService.isMenuOpen()) {
      this.headerService.toggleMenu();
    }

    this.router.navigateByUrl(`/search?query=${this.searchQuery}&page=1`);
  }
}
