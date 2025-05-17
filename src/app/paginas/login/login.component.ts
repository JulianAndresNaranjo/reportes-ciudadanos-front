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



      
      /**
       * Si inicia sesion correctamente se guarda el token y se redirige al home
       * si no se valida si es por inactivacion o usuario no existe, manejar bien la promesa
       */
      // Redirige al home, dashboard de control de reporte
      const fakeToken = 'eyJhbGciOi...';  // esto lo retorna el backend

      // Guardar el token en sessionStorage
      this.authService.login(fakeToken);
      this.router.navigate(['/home']);
    } else {
      alert('Completa todos los campos.');
    }
  }

}
