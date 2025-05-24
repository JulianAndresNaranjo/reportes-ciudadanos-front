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
  // Ya lo tienes si usas Reactive Forms


@Component({
  selector: 'app-editar-perfil-admin',
  imports: [
     MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
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
    const datosActualizados = this.form.value;
    const userId = localStorage.getItem('userId') || '';

    this.authService.actualizarUsuario(userId, datosActualizados).subscribe({
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
    /*const authToken = localStorage.getItem('authToken');
    const decodeToken: any = jwtDecode(authToken || '');
    const userId = decodeToken.id;
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
  
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta?')) {
      this.authService.deleteUser(userId, headers).subscribe({
        next: (res: any) => {
          alert(res.mensaje || 'Cuenta eliminada correctamente.');
          this.authService.cerrarSesion();
        },
        error: (err) => {
          console.error('Error al eliminar la cuenta:', err);
        }
      });
    }*/
  }
  

}
