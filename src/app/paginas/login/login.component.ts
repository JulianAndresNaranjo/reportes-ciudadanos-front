import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public email = '';
  public password = '';
  verPassword: boolean = false;

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
          const userId = payload.sub;

          console.log('Rol:', rol, 'ID:', userId);

          localStorage.setItem('token', token);
          localStorage.setItem('rol', rol);
          localStorage.setItem('userId', userId);

          Swal.fire({
            icon: 'success',
            title: '¡Inicio de sesión exitoso!',
            text: `Bienvenido${rol === 'ROLE_ADMINISTRADOR' ? ' Administrador' : ''}.`,
            confirmButtonColor: '#3085d6'
          }).then(() => {
            if (rol === 'ROLE_ADMINISTRADOR') {
              this.router.navigate(['/dashboard-admin']);
            } else {
              this.router.navigate(['/home']);
            }
          });

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Token inválido',
            text: 'No se recibió un token válido del servidor.',
            confirmButtonColor: '#d33'
          });
        }
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: 'Verifica tus credenciales e intenta nuevamente.',
          confirmButtonColor: '#d33'
        });
      }
    );

  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa el correo y la contraseña antes de continuar.',
      confirmButtonColor: '#f39c12'
    });
  }
}
}
