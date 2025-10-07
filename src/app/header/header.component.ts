import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AsyncPipe } from '@angular/common';
import { HeaderService } from '../services/header.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private router = inject(Router);
  @ViewChild('dropdownWrapper') dropdownWrapper!: ElementRef;
  auth = inject(AuthService);
  headerService = inject(HeaderService);
  searchQuery = '';

  initial = computed(
    () => this.auth.user()?.username.charAt(0).toUpperCase() ?? '?'
  );

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.dropdownWrapper) return;
    if (
      this.headerService.dropdownOpen() &&
      !this.dropdownWrapper.nativeElement.contains(event.target)
    ) {
      this.headerService.close();
    }
  }

  toggleDropdown(event?: Event) {
    if (event) event.stopPropagation();
    this.headerService.toggle();
  }

  logout() {
    this.auth.logout();
    this.headerService.close();
    this.router.navigate(['/login']);
  }

  onSearch() {
    if (!this.searchQuery.trim()) return;

    this.router.navigateByUrl(`/search?query=${this.searchQuery}&page=1`);
  }
}
