import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsService } from '../../services/transactions.service';
import { Transaction } from '../../models/transaction.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TransactionEditDialogComponent } from '../transaction-edit-dialog/transaction-edit-dialog.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  userId!: string;
  displayedColumns: string[] = ['description', 'type', 'value', 'category', 'date', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionsService: TransactionsService,
    private authService: AuthService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId() || '';

    if (this.userId) {
      this.getTransactions(this.userId);
    }
  }

  getTransactions(userId: string = this.userId): void {
    this.transactionsService.getByUser(this.userId).subscribe({
      next: (res: any) => {
        this.transactions = res;
      },
      error: (err: any) => {
        console.error('Error fetching transactions:', err);
      }
    });
  }

  editTransaction(transaction: Transaction): void {
    this.router.navigate([`transactions/${transaction.userId}/edit/${transaction.id}`]);
  }

  syncTransactions(): void {
    this.transactionsService.syncTransactions().subscribe({
      next: () => {
        this.getTransactions();
      },
      error: (err: any) => {
        console.error('Error syncing transactions:', err);
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(TransactionEditDialogComponent, {
      width: '400px',
      data: { userId: this.userId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTransactions();
      }
    });
  }

  openEditDialog(transaction: Transaction): void {
    const dialogRef = this.dialog.open(TransactionEditDialogComponent, {
      data: transaction
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.transactionsService.update(transaction.id!, result).subscribe(() => {
          this.getTransactions();
        });
      }
    });
  }
}
