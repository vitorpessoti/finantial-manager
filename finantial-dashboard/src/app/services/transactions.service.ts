import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TransactionsService {
    private baseUrl = `${environment.apiUrl}/transactions`;

    constructor(private http: HttpClient) { }

    getByUser(userId: string): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.baseUrl}/users/${userId}`);
    }

    create(transaction: Partial<Transaction>): Observable<any> {
        return this.http.post(this.baseUrl, transaction);
    }

    update(id: string, data: Partial<Transaction>): Observable<any> {
        return this.http.patch(`${this.baseUrl}/${id}`, data);
    }

    delete(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }

    getOne(id: string) {
        console.log(`Fetching transaction with ID: ${id}`);
        return this.http.get<Transaction>(`${this.baseUrl}/${id}`);
    }
}
