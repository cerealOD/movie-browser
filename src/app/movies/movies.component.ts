import { Component, input, output } from '@angular/core';

import { IndexMovie } from '../models/indexMovie.model';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MovieComponent } from './movie/movie.component';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [MovieComponent],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css',
})
export class MoviesComponent {
  movies = input.required<IndexMovie[]>();
  selectMovie = output<IndexMovie>();
}
