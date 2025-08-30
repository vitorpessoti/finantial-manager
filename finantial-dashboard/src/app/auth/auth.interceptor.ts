import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Adiciona a flag withCredentials para que os cookies de autenticação sejam enviados
    // Essa é a parte que substitui o setHeaders com o token manualmente
    const withCredentialsReq = req.clone({
      withCredentials: true
    });

    return next.handle(withCredentialsReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Acessa negado ou token expirado: limpa a sessão e redireciona
          this.authService.clearToken();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}