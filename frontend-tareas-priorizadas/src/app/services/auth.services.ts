import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, from } from 'rxjs';
import { tap, catchError, map, finalize, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private storage = inject(Storage);

    private readonly API_URL = environment.apiUrl;

    private authSubject = new BehaviorSubject<boolean>(false);
    isAuthenticated$ = this.authSubject.asObservable();

    private userSubject = new BehaviorSubject<any>(null);
    currentUser$ = this.userSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(false);
    isLoading$ = this.loadingSubject.asObservable();

    private errorSubject = new BehaviorSubject<string | null>(null);
    error$ = this.errorSubject.asObservable();

    constructor() {
        this.initStorage();
    }

    private storageReady$ = new BehaviorSubject<boolean>(false);

    private async initStorage() {
        await this.storage.create();
        const token = await this.storage.get('auth_token');
        if (token) {
            this.authSubject.next(true);
            const user = await this.storage.get('user_data');
            if (user) this.userSubject.next(user);
        }
        this.storageReady$.next(true); 
    }


    get isReady$() {
        return this.storageReady$.asObservable();
    }

    async initializeAuth() {
        await this.storage.create();
        const token = await this.storage.get('auth_token');
        if (token) {
            this.authSubject.next(true);
            const user = await this.storage.get('user_data');
            if (user) this.userSubject.next(user);
        }
    }

    async getTokenAsync(): Promise<string | null> {
        return await this.storage.get('auth_token');
    }

    login(email: string, password: string): Observable<any> {
        this.loadingSubject.next(true);
        this.errorSubject.next(null);

        return this.http.post(this.API_URL + '/users/login', { email, password }).pipe(
            switchMap((res: any) => {
                console.log('--- LOGIN RESPONSE DATA ---', res);

                const token = res.access_token || res.token || res.access;
                const user = res.user || { email };

                console.log('--- EXTRACTED TOKEN ---', token);

                return from(Promise.all([
                    this.storage.set('auth_token', token),
                    this.storage.set('user_data', user)
                ])).pipe(
                    tap(() => console.log('--- TOKEN SAVED IN STORAGE ---')),
                    map(() => {
                        this.userSubject.next(user);
                        this.authSubject.next(true);
                        return res;
                    })
                );
            }),
            catchError((error: HttpErrorResponse) => {
                const msg = error.status === 401 ? 'Credenciales incorrectas' : 'Error al iniciar sesion';
                this.errorSubject.next(msg);
                return throwError(() => msg);
            }),
            finalize(() => this.loadingSubject.next(false))
        );
    }

    signup(email: string, password: string, passwordConfirm: string): Observable<any> {
        this.loadingSubject.next(true);
        this.errorSubject.next(null);
        return this.http.post(this.API_URL + '/users/signup', { email, password, passwordConfirm }).pipe(
            catchError((error: HttpErrorResponse) => {
                const msg = 'Error al crear cuenta';
                this.errorSubject.next(msg);
                return throwError(() => msg);
            }),
            finalize(() => this.loadingSubject.next(false))
        );
    }

    async logout() {
        await this.storage.remove('auth_token');
        await this.storage.remove('user_data');
        this.authSubject.next(false);
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    get isAuthenticated(): Observable<boolean> {
        return this.isAuthenticated$;
    }
}



