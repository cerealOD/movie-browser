import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
  OnInit,
  signal,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AsyncPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { HeaderService } from '../services/header.service';
import { FormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { IndexMovie } from '../models/index-movie.model';
import { MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, FormsModule, DatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  @ViewChild('dropdownWrapper') dropdownWrapper!: ElementRef;
  @ViewChild('sideMenu') sideMenu!: ElementRef;
  @ViewChild('searchBar') searchBar!: ElementRef;

  auth = inject(AuthService);
  headerService = inject(HeaderService);

  searchQuery = '';
  suggestions = signal<IndexMovie[] | null>(null);
  showSuggestions = signal(false);
  isSearching = signal(false);

  private moviesService = inject(MoviesService);
  private router = inject(Router);

  //use subject to push searchquery into it, then fetch results when changed with debounce
  private searchInput$ = new Subject<string>();

  constructor() {
    this.setupLiveSearch();
  }

  // compute initial based on username
  initial = computed(
    () => this.auth.user()?.username.charAt(0).toUpperCase() ?? '?'
  );

  ngOnInit() {
    // clear search when leaving search page
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
    //close suggestions
    if (
      this.showSuggestions() &&
      !this.searchBar.nativeElement.contains(event.target)
    ) {
      this.showSuggestions.set(false);
    }
  }

  openSuggestions() {
    if (this.searchQuery.length >= 2) {
      this.showSuggestions.set(true);
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

    this.showSuggestions.set(false);

    this.router.navigateByUrl(`/search?query=${this.searchQuery}&page=1`);
  }

  onSearchChange(value: string) {
    this.searchQuery = value;
    this.searchInput$.next(value);
  }

  goToMovie(id: number) {
    this.showSuggestions.set(false);
    if (this.headerService.isMenuOpen()) {
      this.headerService.toggleMenu();
    }
    this.router.navigate(['/movie', id]);
  }

  private setupLiveSearch() {
    this.searchInput$
      .pipe(
        //trim & ignore too short inputs
        debounceTime(300),
        distinctUntilChanged(),
        filter((value) => value.trim().length >= 2),
        tap(() => {
          this.isSearching.set(true);
          this.showSuggestions.set(true);
        }),
        switchMap((term) => this.moviesService.searchMovies(term, 1))
      )
      .subscribe({
        next: (res) => {
          //limit to 6 results
          this.suggestions.set(res.results.slice(0, 6));
          this.isSearching.set(false);
        },
        error: () => {
          this.suggestions.set([]);
          this.isSearching.set(false);
        },
      });
  }
}
