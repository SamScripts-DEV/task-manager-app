import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.services';
import { ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import {
  IonContent, IonList, IonItem, IonLabel, IonInput,
  IonButton, IonSpinner, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { listOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    IonContent, IonList, IonItem, IonLabel, IonInput,
    IonButton, IonSpinner, IonIcon
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private navCtrl = inject(NavController);
  private cdr = inject(ChangeDetectorRef);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading$ = this.authService.isLoading$;
  error$ = this.authService.error$;

  constructor() {
    addIcons({ listOutline });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          console.log('Login exitoso, navegando a /tasks...');
          this.navCtrl.navigateRoot('/tasks', { animated: true, animationDirection: 'forward' });
        },
        error: (err) => {
          console.error('Error en login:', err);
          this.cdr.markForCheck();
        }
      });
    }
  }

  goToSignup() {
    this.navCtrl.navigateForward('/signup');
  }
}



