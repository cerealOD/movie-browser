import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleize',
  standalone: true,
})
export class TitleizePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return value
      .split('-') // break into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize
      .join(' ');
  }
}
