import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IndexMovie } from '../../models/indexMovie.model';

@Component({
  selector: 'app-movie',
  imports: [RouterLink, DatePipe],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css',
})
export class MovieComponent {
  movie = input.required<IndexMovie>();
}
