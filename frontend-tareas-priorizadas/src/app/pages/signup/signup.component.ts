import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import {
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonContent, IonCard, IonCardContent, IonItem, IonLabel,
    IonInput, IonButton, IonSpinner, IonText, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personAddOutline } from 'ionicons/icons';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.services';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule,
        IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
        IonContent, IonCard, IonCardContent, IonItem, IonLabel,
        IonInput, IonButton, IonSpinner, IonText, IonIcon
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private navCtrl = inject(NavController);
    private cdr = inject(ChangeDetectorRef);

    signupForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        passwordConfirm: ['', [Validators.required]]
    });

    isLoading$ = this.authService.isLoading$;
    error$ = this.authService.error$;


    constructor() {
        addIcons({ personAddOutline });
    }

    onSubmit() {
        if (this.signupForm.valid) {
            const { email, password, passwordConfirm } = this.signupForm.value;
            this.authService.signup(email, password, passwordConfirm).subscribe({
                next: () => {
                    this.navCtrl.navigateRoot('/login');
                },
                error: (err) => {
                    this.cdr.markForCheck();
                }
            });
        }
    }

    goToLogin() {
        this.navCtrl.navigateBack('/login');
    }
}
