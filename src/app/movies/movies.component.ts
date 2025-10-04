import { Component, input, output } from '@angular/core';

import { IndexMovie } from '../models/indexMovie.model';
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
  movies = input.required<IndexMovie[]>();
  selectMovie = output<IndexMovie>();
}
