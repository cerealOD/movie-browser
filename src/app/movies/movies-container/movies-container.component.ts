import { Component, input } from '@angular/core';

@Component({
  selector: 'app-movies-container',
  standalone: true,
  imports: [],
  templateUrl: './movies-container.component.html',
  styleUrl: './movies-container.component.css',
})
export class MoviesContainerComponent {
  title = input.required<string>();
}
