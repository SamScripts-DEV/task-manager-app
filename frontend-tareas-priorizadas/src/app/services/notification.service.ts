import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number; 
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notification$ = new BehaviorSubject<Notification | null>(null);

  
  notification = this.notification$.asObservable();

  
  success(message: string, duration = 3000): void {
    this.show({ message, type: 'success', duration });
  }

  
  error(message: string, duration = 3000): void {
    this.show({ message, type: 'error', duration });
  }

  
  warning(message: string, duration = 3000): void {
    this.show({ message, type: 'warning', duration });
  }

  
  info(message: string, duration = 3000): void {
    this.show({ message, type: 'info', duration });
  }

  
  private show(notification: Notification): void {
    this.notification$.next(notification);

    
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.notification$.next(null);
      }, notification.duration);
    }
  }

  
  clear(): void {
    this.notification$.next(null);
  }
}


