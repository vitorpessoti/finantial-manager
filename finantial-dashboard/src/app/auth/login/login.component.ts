import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        QRCodeComponent,
        RouterModule
    ],
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    loginForm: FormGroup;
    loading = false;
    error: string | null = null;
    isTwoFactorEnabled = false;
    qrCodeUrl: string | null = null;
    userId: string | null = null;
    twoFactorForm = new FormGroup({
        code: new FormControl('', Validators.required)
    });

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit() {
        if (this.loginForm.invalid) return;

        this.loading = true;
        this.error = null;

        this.authService.login(this.loginForm.value).subscribe({
            next: (res) => {
                this.loading = false;
                console.log('Login successful:', res);

                if (res.isTwoFactorEnabled) {
                    this.isTwoFactorEnabled = true;
                    this.userId = res.userId;
                } else if (res.qrCodeUrl) {
                    this.qrCodeUrl = res.qrCodeUrl;
                    this.userId = res.userId;
                } else {
                    this.router.navigate([`/transactions/${res.userId}`]);
                }
            },
            error: (err) => {
                console.error(err);
                this.error = err.error?.message || 'Erro ao fazer login';
                this.loading = false;
            }
        });
    }

    onSubmit2FA() {
        const code2FA = this.twoFactorForm.get('code')?.value || '';
        if (this.userId) {
            this.authService.twoFactorLogin(this.userId, code2FA).subscribe(
                (res) => {
                    console.log('2FA successful:', this.userId);
                    const url = `/transactions/${this.userId}`;
                    // const url = `/register`;
                    this.router.navigate([url]);
                },
                error => {
                    console.error('!!!!!!! Invalid 2FA code', error);
                }
            );
        }
    }

    authenticatorAppConfigured() {
        this.authService.enableTwoFactorAuth(this.userId!).subscribe((response) => {
            this.isTwoFactorEnabled = true;
            this.qrCodeUrl = null;
        });
    }
}
