import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TransactionsService } from '../../services/transactions.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponseInterface } from '../../interfaces/api-response.interface';
import { Transaction } from '../../models/transaction.model';
import { ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit {
  form!: FormGroup;
  submitting = false;
  successMessage = '';
  errorMessage = '';
  userId: string = '';
  isEditMode: boolean = false;
  transactionId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private transactionsService: TransactionsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log('TransactionFormComponent initialized');
    this.form = this.fb.group({
      userId: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      value: [null, [Validators.required, Validators.min(0.01)]],
      category: [''],
      date: ['', Validators.required]
    });

    const userId = this.route.snapshot.paramMap.get('userId') || '';
    this.form.patchValue({ userId });

    const transactionId = this.route.snapshot.paramMap.get('transactionId');
    if (transactionId) {
      this.transactionsService.getOne(transactionId).subscribe({
        next: (transaction: any) => {
          console.log('Transaction data:', transaction);
          this.form.patchValue({
            userId: transaction.userId,
            type: transaction.type,
            description: transaction.description,
            value: transaction.value,
            category: transaction.category,
            date: transaction.date.slice(0, 10)
          });
        }
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const request$ = this.isEditMode && this.transactionId
      ? this.transactionsService.update(this.transactionId, this.form.value)
      : this.transactionsService.create(this.form.value);

    request$.subscribe({
      next: () => {
        this.successMessage = this.isEditMode
          ? 'Transação atualizada com sucesso!'
          : 'Transação criada com sucesso!';
        this.submitting = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao salvar transação.';
        this.submitting = false;
      }
    });
  }
}
