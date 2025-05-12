import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {

   registerForm: any;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }
  ngOnInit(): void {
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
      console.log('Formulario enviado:', data);

      // llamada servicio y alerta de mensaje confirmacion u otp
    }
  }
}
