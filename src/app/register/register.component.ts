import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      city: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const user: User = this.registerForm.value;

      this.userService.register(user).subscribe({
        next: (response) => {
          console.log('Registro realizado com sucesso:', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Erro ao registrar:', error);
        }
      });
    }
  }
  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'Este campo é obrigatório';
    if (control.errors['email']) return 'Email inválido';
    if (control.errors['minlength']) return 'A senha deve ter no mínimo 6 caracteres';
    if (control.errors['pattern']) return 'Número de telefone inválido (DDD + número)';
    if (control.errors['passwordMismatch']) return 'As senhas não coincidem';
    
    return '';
  }

}
