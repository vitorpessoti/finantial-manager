import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Transaction } from '../../models/transaction.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MessageDialogComponent } from '../../shared/dialogs/message-dialog/message-dialog.component';
import { TransactionsService } from '../../services/transactions.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CurrencyMaskDirective } from '../../shared/directives/currency-mask.directive';

@Component({
  selector: 'app-transaction-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    CurrencyMaskDirective
  ],
  templateUrl: './transaction-edit-dialog.component.html',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
  styleUrls: ['./transaction-edit-dialog.component.scss']
})
export class TransactionEditDialogComponent {
  form!: FormGroup;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TransactionEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Transaction,
    private dialog: MatDialog,
    private transactionsService: TransactionsService
  ) {
    this.isEdit = !!data;

    this.form = this.fb.group({
      type: [data?.type || 'debit', Validators.required],
      description: [data?.description || '', Validators.required],
      value: [this.converterParaCentavos(data?.value) || '', [Validators.required, Validators.min(0.01)]],
      category: [data?.category || '', Validators.required],
      date: [data?.date || new Date().toISOString().substring(0, 10), Validators.required],
      userId: [data?.userId || '', Validators.required]
    });
  }

  private converterParaCentavos(valorEmReais: number): number {
    // Multiplica por 100 e arredonda para evitar problemas com floats
    return Math.round(valorEmReais * 100);
  }

  submit(): void {
    if (this.form.valid) {
      const amount = this.form.get('value')?.value;
      const formatedAmount = parseFloat((amount / 100).toFixed(2));
      const transactionData = {
        ...this.form.value,
        value: formatedAmount
      };

      const request$ = this.data?.id
        ? this.transactionsService.update(this.data.id, transactionData)
        : this.transactionsService.create(transactionData);

      request$.subscribe({
        next: (res) => {
          console.log('############# Transação salva com sucesso.', res);
          this.dialog.open(MessageDialogComponent, {
            data: {
              title: 'Success!',
              message: res.message || 'Transaction saved successfully.'
            }
          });
          this.dialogRef.close();
        },
        error: (err) => {
          console.error('Erro ao salvar transação.', err);
          this.dialog.open(MessageDialogComponent, {
            data: {
              title: 'Error.',
              message: err.error?.message || 'An error occurred while saving the transaction.'
            }
          });
        }
      });
    } else {
      console.log('Invalid data.');
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Error',
          message: 'There was an error. Check your data.'
        }
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
