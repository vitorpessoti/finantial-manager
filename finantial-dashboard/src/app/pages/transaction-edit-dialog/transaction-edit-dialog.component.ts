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
    ReactiveFormsModule
  ],
  templateUrl: './transaction-edit-dialog.component.html',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ]
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
      value: [data?.value || '', [Validators.required, Validators.min(0.01)]],
      category: [data?.category || '', Validators.required],
      date: [data?.date || new Date().toISOString().substring(0, 10), Validators.required],
      userId: [data?.userId || '', Validators.required]
    });
  }


  submit(): void {
    if (this.form.valid) {
      const request$ = this.data?.id
        ? this.transactionsService.update(this.data.id, this.form.value)
        : this.transactionsService.create(this.form.value);

      request$.subscribe({
        next: (res) => {
          this.dialog.open(MessageDialogComponent, {
            data: {
              title: 'Sucesso!',
              message: 'A transação foi atualizada com sucesso.'
            }
          });
          this.dialogRef.close(true);
          this.dialogRef.close(this.form.value);
        },
        error: (err) => {
          console.error('Erro ao salvar transação.', err);
          this.dialog.open(MessageDialogComponent, {
            data: {
              title: 'Erro',
              message: 'Ocorreu um erro ao atualizar a transação.'
            }
          });
        }
      });
    } else {
      console.log('Formulário inválido');
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Erro',
          message: 'Ocorreu um erro ao atualizar a transação.'
        }
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
