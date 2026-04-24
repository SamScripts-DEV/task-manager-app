import { Injectable } from '@angular/core';
import { AuthService } from './auth.services';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {
  private initialized = false;

  constructor(private authService: AuthService) {}

  
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      await this.authService['initializeAuth']();
      this.initialized = true;
    } catch (err) {
      console.error('Error inicializando app:', err);
      this.initialized = true; 
    }
  }
}


