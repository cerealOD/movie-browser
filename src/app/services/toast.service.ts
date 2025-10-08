// src/app/services/toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private messages = new BehaviorSubject<ToastMessage[]>([]);
  messages$ = this.messages.asObservable();

  show(text: string, type: 'success' | 'error' | 'info' = 'info') {
    const toast: ToastMessage = { text, type };
    this.messages.next([...this.messages.value, toast]);

    // remove after 2 seconds
    setTimeout(() => this.remove(toast), 2000);
  }

  private remove(toast: ToastMessage) {
    this.messages.next(this.messages.value.filter((t) => t !== toast));
  }
}
