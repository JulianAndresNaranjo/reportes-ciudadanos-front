import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public email = '';
  public password = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
  if (this.email && this.password) {
    console.log('Iniciando sesión con', this.email);

    const data = {
      email: this.email,
      password: this.password
    };

    this.authService.login(data).subscribe(
      (response: any) => {
        const token = response.token;
        if (token) {
          // Decodificar el payload del JWT
          const payload = JSON.parse(atob(token.split('.')[1]));
          const rol = payload.rol; // Asegúrate que el backend pone el rol en el payload

          console.log('Rol del usuario:', rol);
          localStorage.setItem('token', token);
          localStorage.setItem('rol', rol);

          if (rol === 'ROLE_ADMINISTRADOR') {
            this.router.navigate(['/dashboard-admin']);
          } else {
            this.router.navigate(['/home']);
          }
        } else {
          alert('No se recibió un token válido.');
        }
      },
      error => {
        alert('Error al iniciar sesión. Verifica tus credenciales.');
      }
    );
  } else {
    alert('Completa todos los campos.');
  }
}
}
