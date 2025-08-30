// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { AuthService } from './auth/auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) { }

//   canActivate(): boolean {
//     if (this.authService.isAuthenticated()) {
//       return true;
//     }
//     this.router.navigate(['/login']);
//     return false;
//   }
// }

// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    // Assume que o usuário está autenticado e deixa a requisição passar.
    // A segurança será tratada pelo interceptor em caso de falha.
    // Se precisar de alguma validação rápida (por exemplo, se o userId está no localStorage),
    // pode adicionar aqui. Caso contrário, apenas retorne true.
    return true;
  }
}