import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, from, Observable, throwError } from "rxjs"
import { tap, catchError, finalize } from "rxjs/operators";
import { Storage } from "@ionic/storage-angular";
import { AuthResponse, LoginRequest, SignupRequest, User } from "@models/user.model"
import { environment } from "@env/environment";

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private readonly currentUser$ = new BehaviorSubject<User | null>(null);
    private readonly isAuthenticated$ = new BehaviorSubject<boolean>(false);
    private readonly isLoading$ = new BehaviorSubject<boolean>(false);
    private readonly error$ = new BehaviorSubject<string | null>(null)


    private readonly apiUrl = environment.apiUrl;
    private readonly loginUrl = `${this.apiUrl}/users/login`
    private readonly signupUrl = `${this.apiUrl}/users/signup`

    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'auth_user';

    constructor(
        private http: HttpClient,
        private storage: Storage
    ) {
        this.initializeAuth();
    }


    private async initializeAuth(): Promise<void> {
        await this.storage.create();
        const token = await this.storage.get(this.TOKEN_KEY);
        const user = await this.storage.get(this.USER_KEY);

        if (token && user ) {
            this.currentUser$.next(user);
            this.isAuthenticated$.next(true);
        }
    }


    login(email: string, password: string): Observable<AuthResponse> {
        this.isLoading$.next(true)
        this.error$.next(null);

        const request: LoginRequest = {email, password};

        return this.http.post<AuthResponse>(this.loginUrl, request).pipe(
            tap(response => {
                this.handleAuthSuccess(response);
            }),
            catchError(err => {
                this.handleError(err);
                return throwError(() => err)
            }),
            
            finalize(() => this.isLoading$.next(false))
        );     
    }


    signup(
        email: string,
        password: string,
        passwordConfirm: string
    ): Observable<AuthResponse> {
        this.isLoading$.next(true);
        this.error$.next(null);

        const request: SignupRequest = {email, password, password_confirmation: passwordConfirm}

        return this.http.post<AuthResponse>(this.signupUrl, request).pipe(
            tap(response => {this.handleAuthSuccess(response)}),
            catchError(err => {
                this.handleError(err);
                return throwError(() => err)
            }),
            finalize(() => this.isLoading$.next(false))
        )

    }

    async logout(): Promise<void> {
        await this.storage.remove(this.TOKEN_KEY);
        await this.storage.remove(this.USER_KEY);

        this.currentUser$.next(null);
        this.isAuthenticated$.next(false);

        this.error$.next(null);

    }


    getToken(): Observable<string | null> {
        return from(this.storage.get(this.TOKEN_KEY));
    }

    async getTokenAsync(): Promise<string | null> {
        return await this.storage.get(this.TOKEN_KEY);
    }





    //----------------------------------------------------
    
    currentUser = this.currentUser$.asObservable();
    isAuthenticated = this.isAuthenticated$.asObservable();
    isLoading = this.isLoading$.asObservable();
    error = this.error$.asObservable();


    get isAuthenticatedValue(): boolean {
        return this.isAuthenticated$.value;
    }

    get currentUserValue(): User | null {
        return this.currentUser$.value;

    }

    get isLoadingValue(): boolean {
        return this.isLoading$.value;
    }



    private handleAuthSuccess(response: AuthResponse): void {
        this.storage.set(this.TOKEN_KEY, response.access_token);
        this.storage.set(this.USER_KEY, response.user);

        this.currentUser$.next(response.user);
        this.isAuthenticated$.next(true);

        this.error$.next(null);
    }


  private handleError(error: any): void {
    let errorMessage = 'Unknown error';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 400) {
      errorMessage = error.error?.detail || 'Invalid data';
    } else if (error.status === 401) {
      errorMessage = 'Not authenticated';
    } else if (error.status === 409) {
      errorMessage = 'The email already exists';
    } else if (error.status === 0) {
      errorMessage = 'Could not connect to the server';
    } else {
      errorMessage = `Error: ${error.status}`;
    }

    this.error$.next(errorMessage);
  }


}