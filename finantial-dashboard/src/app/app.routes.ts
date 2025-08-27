import { Routes } from '@angular/router';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { TransactionFormComponent } from './pages/transaction-form/transaction-form.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'transactions/:userId',
        loadComponent: () => import('./pages/transactions/transactions.component').then(m => m.TransactionsComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'transaction-form/:userId',
        loadComponent: () => import('./pages/transaction-form/transaction-form.component').then(m => m.TransactionFormComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'transactions/:userId/edit/:transactionId',
        loadComponent: () => import('./pages/transaction-form/transaction-form.component').then(m => m.TransactionFormComponent),
        canActivate: [AuthGuard]
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
