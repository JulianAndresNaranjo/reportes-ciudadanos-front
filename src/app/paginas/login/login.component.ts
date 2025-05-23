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
      const payload = JSON.parse(atob(token.split('.')[1]));
      const rol = payload.rol;
      const userId = payload.sub; // 👈 o payload.id si así lo maneja tu backend

      console.log('Rol:', rol, 'ID:', userId);

      localStorage.setItem('token', token);
      localStorage.setItem('rol', rol);
      localStorage.setItem('userId', userId); // ✅ Necesario para comentarios

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
