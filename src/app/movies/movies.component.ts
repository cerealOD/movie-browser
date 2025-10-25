import { Component, input } from '@angular/core';

import { IndexMovie } from '../models/index-movie.model';
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
}
