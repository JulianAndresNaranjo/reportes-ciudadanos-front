import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verificacion-cuenta',
  imports: [CommonModule, FormsModule],
  templateUrl: './verificacion-cuenta.component.html',
  styleUrl: './verificacion-cuenta.component.css'
})
export class VerificacionCuentaComponent {
  constructor(
    private authservice: AuthService,
    private router: Router) {
  }
  showSuccessAlert = false;
  showErrorAlert = false;
  errorMessage = '';
  codigo: string[] = ['', '', '', '', '', ''];

  autoFocusSiguiente(i: number) {
    setTimeout(() => {
      if (this.codigo[i] && i < this.codigo.length - 1) {
        const siguiente = document.querySelectorAll<HTMLInputElement>('input[name^="codigo"]')[i + 1];
        siguiente?.focus();
      }
    });
  }


  autoFocusAnterior(event: KeyboardEvent, i: number) {
    if (event.key === 'Backspace' && !this.codigo[i] && i > 0) {
      const anterior = document.querySelectorAll<HTMLInputElement>('input[name^="codigo"]')[i - 1];
      anterior?.focus();
    }
  }

  verificarCodigo() {
    const codigoFinal = this.codigo.join('');
    const email = localStorage.getItem('correoUsuario'); // ← obtiene el email guardado en el registro

    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró el correo del usuario. Por favor regístrate de nuevo.',
      });
      return;
    }

    const data = {
      email: email,
      code: codigoFinal
    };
    console.log('Código ingresado:', data);

    this.authservice.verifyCode(data).subscribe({
      next: res => {
        this.showSuccessAlert = true;
        this.router.navigate(['/login']);
        Swal.fire({
          icon: 'success',
          title: '¡Verificación exitosa!',
          text: 'Tu cuenta ha sido verificada correctamente.',
          confirmButtonColor: '#3085d6'
        });
      },
      error: err => {
        console.error("Error al verificar la cuenta:", err);
        const mensaje = err.error?.mensaje || 'Ocurrió un error inesperado';
        Swal.fire({
          icon: 'error',
          title: 'Error al verificar la cuenta',
          text: mensaje,
          confirmButtonColor: '#d33'
        });
      }
    });
  }


  reenviarCodigo() {
    console.log('Reenviar código solicitado');
    // Aquí puedes colocar la lógica para reenviar el código
  }
}


