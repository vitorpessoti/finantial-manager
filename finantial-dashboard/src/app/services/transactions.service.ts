import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TransactionsService {
    private baseUrl = environment.production
        ? `${environment.apiUrl}/transactions`
        : `${environment.apiUrlLocal}/transactions`;

    constructor(private http: HttpClient) { }

    getByUser(userId: string): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.baseUrl}/users/${userId}`, { withCredentials: true });
    }

    create(transaction: Partial<Transaction>): Observable<any> {
        return this.http.post(this.baseUrl, transaction, { withCredentials: true });
    }

    update(id: string, data: Partial<Transaction>): Observable<any> {
        return this.http.patch(`${this.baseUrl}/${id}`, data, { withCredentials: true });
    }

    delete(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`, { withCredentials: true });
    }

    getOne(id: string) {
        console.log(`Fetching transaction with ID: ${id}`);
        return this.http.get<Transaction>(`${this.baseUrl}/${id}`, { withCredentials: true });
    }
}
