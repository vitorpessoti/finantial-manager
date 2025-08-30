import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private userId: string | null = null;
    private baseUrl = environment.production
        ? `${environment.apiUrl}/auth`
        : `${environment.apiUrlLocal}/auth`;

    constructor(private http: HttpClient) { }

    login(credentials: any) {
        return this.http.post<any>(`${this.baseUrl}/login`, credentials, {
            withCredentials: true
        }).pipe(
            tap(response => {
                this.userId = response.userId;
                localStorage.setItem('userId', this.userId!);
            })
        );
    }

    twoFactorLogin(userId: string, code: string) {
        return this.http.post(`${this.baseUrl}/2fa/login`, { userId, twoFactorToken: code }, {
            withCredentials: true
        });
    }

    register(name: string, email: string, password: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/register`, { name, email, password });
    }

    logout() {
        // Faça uma chamada para o backend limpar o cookie
        return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true }).pipe(
            tap(() => {
                // Limpe o estado local e o localStorage após o logout
                this.userId = null;
                localStorage.removeItem('userId');
            })
        );
    }

    saveToken(token: string) {
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        return !!token;
    }

    clearToken() {
        localStorage.removeItem('token');
    }

    getUserId(): string | null {
        if (!this.userId) {
            this.userId = localStorage.getItem('userId');
        }
        return this.userId;
    }

    enableTwoFactorAuth(userId: string) {
        return this.http.post<any>(`${this.baseUrl}/2fa/user/enable`, { userId }, {
            withCredentials: true
        }).pipe(
            tap(response => { })
        );
    }
}