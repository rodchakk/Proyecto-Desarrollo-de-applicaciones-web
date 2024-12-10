import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { LoginResponse } from '../../models/login.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, 
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.userService.login(loginData.username, loginData.password).subscribe({
        next: (response: LoginResponse) => {
          console.log('Respuesta:', response);
          // alert(response.mensaje); // Muestra el mensaje de éxito
          localStorage.setItem('token', response.token); // Almacena el token          
          this.errorMessage = null; // Limpia el mensaje de error si existe
          this.snackBar.open(response.mensaje, 'Cerrar', {
            duration: 3000, // Duración en milisegundos
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-success'] // Clase CSS personalizada
          });
          this.router.navigate(['home']);
        },
        error: (error) => {
          this.errorMessage = 'Credenciales invalidas';
        }
      });

    }
  }
}
