import { Injectable } from "@angular/core";
import {
     HttpInterceptor,
     HttpRequest,
     HttpHandler,
     HttpEvent 
} from "@angular/common/http";
import { Observable, from, switchMap } from "rxjs";
import { AuthService } from "./auth.services";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}


    intercept(
        req: HttpRequest<any>, 
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        if (req.url.includes('/login') || req.url.includes('/signup')) {
            return next.handle(req);
        }

        return from(this.authService.getTokenAsync()).pipe(
            switchMap(token => {
                if (token) {
                    req = req.clone({
                        setHeaders: { Authorization: `Bearer ${token}` }
                    })
                }
                return next.handle(req)
            })
        )
        
    }

}