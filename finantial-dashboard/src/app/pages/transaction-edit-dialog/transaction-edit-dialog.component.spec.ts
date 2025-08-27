import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionEditDialogComponent } from './transaction-edit-dialog.component';

describe('TransactionEditDialogComponent', () => {
  let component: TransactionEditDialogComponent;
  let fixture: ComponentFixture<TransactionEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
