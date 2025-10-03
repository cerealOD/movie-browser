import { Component, input, output } from '@angular/core';

import { Movie } from './movie.model';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, DatePipe],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css',
})
export class MoviesComponent {
  movies = input.required<Movie[]>();
  selectMovie = output<Movie>();

  // onSelectMovie(movie: Movie) {
  //   this.selectMovie.emit(movie);
  // }
}
