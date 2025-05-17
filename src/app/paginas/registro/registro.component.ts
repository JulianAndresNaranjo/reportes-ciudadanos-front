import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {

  registerForm: any;
  showSuccessAlert = false;
  showErrorAlert = false;
  errorMessage = '';
  ciudades: string[] = [];

  constructor(private fb: FormBuilder,
    private authservice: AuthService,
     private router: Router) {

    this.createForm();
  }
  ngOnInit(): void {
     this.authservice.getCiudades().subscribe({
      next: (data) => {
        this.ciudades = data;
      },
      error: (err) => {
        console.error('Error al obtener ciudades:', err);
      }
    });
    this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group({
      documentNumber: [
        '',
        [Validators.required, Validators.pattern(/^\d{6,15}$/)] // solo números de 6 a 15 cifras
      ],
      name: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{4,}$/)]
      ],
      residenceCity: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/)]
      ],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\d{7,10}$/)] // Teléfonos entre 7 y 10 dígitos
      ],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
        ]
      ]
    });

  }

  onSubmit() {
    if (this.registerForm.valid) {
      const data = this.registerForm.value;
      this.authservice.register(data).subscribe({
      next: res => {
        this.showSuccessAlert = true;
        this.router.navigate(['/verificacion-cuenta']);
        this.authservice.senCodeConfirmation(data.email);
        localStorage.setItem('correoUsuario', data.email); // Guardar el correo en localStorage
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Tu cuenta ha sido creada correctamente.',
          confirmButtonColor: '#3085d6'
        });
      },
      error: err => {
        console.error("Error en el registro:", err);
        // Aquí accedemos al mensaje del backend
        const mensaje = err.error?.mensaje || 'Ocurrió un error inesperado';
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: mensaje,
          confirmButtonColor: '#d33'
        });
      }
    });
       
    }
  }
}
