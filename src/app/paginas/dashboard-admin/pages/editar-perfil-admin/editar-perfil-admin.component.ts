/*import { AuthService } from '../../services/auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';*/

import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService, Usuario } from "../../../../servicios/auth.service";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from "@angular/material/button";
import Swal from "sweetalert2";
import { Router, RouterModule, RouterOutlet } from "@angular/router";
  // Ya lo tienes si usas Reactive Forms


@Component({
  selector: 'app-editar-perfil-admin',
  imports: [
     MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterOutlet, RouterModule,
    HttpClientModule
  ],
  templateUrl: './editar-perfil-admin.component.html',
  styleUrl: './editar-perfil-admin.component.css'
})
export class EditarPerfilAdminComponent {
  form!: FormGroup;
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);


  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

ngOnInit(): void {
  this.form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],   
    telefono: ['', [Validators.required, Validators.minLength(10)]], 
    ciudad: ['', [Validators.required, Validators.minLength(3)]],   
  });

  const userId = localStorage.getItem('userId');
  if (userId) {
    this.authService.obtenerUsuario(userId).subscribe({
      next: (usuario: Usuario) => {
        this.form.patchValue({
          nombre: usuario.name,
          telefono: usuario.phone,
          ciudad: usuario.residenceCity
        });
      },
      error: (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    });
  } else {
    console.warn('No se encontró userId en localStorage');
  }
}


 guardarCambios(): void {
  if (this.form.valid) {
    const datosFormulario = this.form.value;

    // Construir el objeto JSON que quieres enviar
    const datosAEnviar = {
      residenceCity: datosFormulario.ciudad || '',  // usar el valor del formulario o cadena vacía
      phone: datosFormulario.telefono || '',
      address: '',  // vacio explícito
      email: ''     // vacio explícito
    };

    const userId = localStorage.getItem('userId') || '';

    console.log('Datos a actualizar:', datosAEnviar);

    this.authService.actualizarUsuario(userId, datosAEnviar).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Perfil actualizado',
          text: res?.mensaje || 'Perfil actualizado correctamente.',
          confirmButtonColor: '#3085d6',
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: err.error?.mensaje || 'No se pudo actualizar el perfil. Intenta de nuevo más tarde.',
          confirmButtonColor: '#d33',
        });
      }
    });
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Formulario inválido',
      text: 'Por favor completa todos los campos correctamente antes de guardar.',
      confirmButtonColor: '#f0ad4e',
    });
  }
}


 eliminarCuenta(): void {
  const userId = localStorage.getItem('userId') || '';

  console.log('ID de usuario a eliminar:', userId);

  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const payload = {
        userId: userId,
        newStatus: 'INACTIVO'
      };

      this.authService.eliminaerUsuario(payload).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Cuenta eliminada',
            text: res.mensaje || 'Tu cuenta ha sido eliminada correctamente.',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('rol');
            localStorage.removeItem('userId');
            this.router.navigate(['/login']);
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.mensaje || 'Hubo un error al eliminar la cuenta. Intenta de nuevo más tarde.',
            confirmButtonColor: '#d33'
          });
        }
      });
    }
  });
}



}
