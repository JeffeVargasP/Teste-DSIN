import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoginRequest } from '../user';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    // Redireciona se já estiver autenticado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials: LoginRequest = this.loginForm.value;
      this.authService.login(credentials).subscribe({
        next: () => {
          this.loginError = '';
          this.router.navigate(['/home']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.loginError = 'Email ou senha incorretos';
          } else {
            this.loginError = 'Ocorreu um erro ao tentar fazer login. Tente novamente.';
          }
        }
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'Este campo é obrigatório';
    if (control.errors['email']) return 'Email inválido';
    
    return '';
  }
}
