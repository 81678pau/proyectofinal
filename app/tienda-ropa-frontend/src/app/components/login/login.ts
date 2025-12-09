import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  mensaje: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['cliente', Validators.required], // ✅ Valor por defecto correcto
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    }, {
      validators: this.passwordMatchValidator // ✅ Validador personalizado
    });
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit() {
    // Limpiar mensaje anterior
    this.mensaje = '';

    if (this.loginForm.invalid) {
      // Mostrar errores específicos
      if (this.loginForm.errors?.['passwordMismatch']) {
        this.mensaje = '❌ Las contraseñas no coinciden';
      } else {
        this.mensaje = '❌ Por favor completa todos los campos correctamente';
      }

      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const { username, email, password, role, phoneNumber } = this.loginForm.value;

    this.http.post('http://localhost:3000/api/users', {
      username,
      email,
      password,
      role,
      phoneNumber
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.mensaje = `Exito: ${res.mensaje || 'Usuario registrado exitosamente'}`;

        if (res.userId) {
          localStorage.setItem('userId', res.userId.toString());
        }

        setTimeout(() => {
          this.router.navigate(['/productos']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error?.error) {
          this.mensaje = `Error: ${err.error.error}`;
        } else if (err.status === 400) {
          this.mensaje = 'Error: El email o usuario ya existe';
        } else if (err.status === 500) {
          this.mensaje = 'Error: en el servidor. Intenta de nuevo';
        } else {
          this.mensaje = 'Error: al registrar usuario';
        }
        console.error('Error completo:', err);
      }
    });
  }

  // Métodos auxiliares para mostrar errores en el template
  hasError(field: string, error: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.hasError(error) && control.touched);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
