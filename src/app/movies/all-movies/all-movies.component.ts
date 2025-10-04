import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { IndexMovie } from '../../models/indexMovie.model';
import { MoviesComponent } from '../movies.component';
import { MoviesContainerComponent } from '../movies-container/movies-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { MoviesService } from '../../services/movies.service';
@Component({
  selector: 'app-all-movies',
  standalone: true,
  imports: [MoviesComponent, MoviesContainerComponent],
  templateUrl: './all-movies.component.html',
  styleUrl: './all-movies.component.css',
})
export class AllMoviesComponent implements OnInit {
  movies = signal<IndexMovie[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private moviesService = inject(MoviesService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.isFetching.set(true);
  }
}
