import { Injectable, inject } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { Observable, from } from "rxjs";
import { switchMap } from "rxjs/operators";
import { AuthService } from "./auth.services";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isAuthRequest = request.url.includes("login") || request.url.includes("signup");
    
    if (isAuthRequest) {
      return next.handle(request);
    }

    return from(this.authService.getTokenAsync()).pipe(
      switchMap(token => {
        if (token) {
          const authReq = request.clone({
            setHeaders: {
              Authorization: "Bearer " + token
            }
          });
          return next.handle(authReq);
        }
        return next.handle(request);
      })
    );
  }
}



