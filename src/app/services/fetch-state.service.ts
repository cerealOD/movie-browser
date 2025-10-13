import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FetchDataService {
  isFetching = signal(false);
}
