import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Categoria, CategoriasService } from '../../../../servicios/categorias.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-categorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-categorias.component.html',
  styleUrls: ['./gestion-categorias.component.css']
})
export class GestionCategoriasComponent implements OnInit {

  categorias: Categoria[] = [];
  cargando = true;

  formulario: FormGroup;
  modoEdicion = false;
  categoriaEditandoId: string | null = null;

  constructor(
    private categoriasService: CategoriasService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    icon: ['', Validators.required]
  });
  }

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  obtenerCategorias(): void {
  this.cargando = true;
  this.categoriasService.listar().subscribe({
    next: (data) => {
      console.log('Categorías obtenidas:', data);
      this.categorias = data;
      console.log('Categorías cargadas:', this.categorias);
      
      if (!this.categorias || this.categorias.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Sin categorías',
          text: 'No se encontraron categorías registradas.',
          confirmButtonColor: '#3085d6'
        });
      }

      this.cargando = false;
    },
    error: (err) => {
      console.error('Error al cargar categorías:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar',
        text: err.error?.mensaje || 'No se pudieron cargar las categorías.',
        confirmButtonColor: '#d33'
      });
      this.cargando = false;
    }
  });
}


guardarCategoria(): void {
  if (this.formulario.invalid) {
    console.warn('Formulario inválido:', this.formulario);
    Swal.fire({
      icon: 'warning',
      title: 'Formulario incompleto',
      text: 'Por favor, completa todos los campos obligatorios antes de guardar.',
      confirmButtonColor: '#f39c12'
    });
    return;
  }

  const data = this.formulario.value;

  if (this.modoEdicion && this.categoriaEditandoId) {
    this.categoriasService.actualizar(data.name, data).subscribe({
      next: () => {
        this.resetFormulario();
        this.obtenerCategorias();
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Categoría actualizada correctamente.',
          confirmButtonColor: '#3085d6'
        });
      },
      error: (err) => {
        const mensaje = err.error?.mensaje || 'Error al actualizar la categoría.';
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: mensaje,
          confirmButtonColor: '#d33'
        });
      }
    });
  } else {
    this.categoriasService.crear(data).subscribe({
      next: () => {
        this.resetFormulario();
        this.obtenerCategorias();
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Categoría registrada correctamente.',
          confirmButtonColor: '#3085d6'
        });
      },
      error: (err) => {
        const mensaje = err.error?.mensaje || 'Error al registrar la categoría.';
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



  editarCategoria(categoria: Categoria): void {
  this.formulario.setValue({
    name: categoria.name,
    description: categoria.description,
    icon: categoria.icon || ''
  });

  this.categoriaEditandoId = categoria.id;
  this.modoEdicion = true;

  console.log('Editando categoría:', categoria);

  // Opcional: mostrar un mensaje visual
  Swal.fire({
    icon: 'info',
    title: 'Modo edición',
    text: `Estás editando la categoría: "${categoria.name}"`,
    timer: 2000,
    showConfirmButton: false
  });
}


  eliminarCategoria(categoria: Categoria): void {
  Swal.fire({
    title: `¿Seguro que deseas eliminar la categoría "${categoria.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.categoriasService.eliminar(categoria.name).subscribe({
        next: () => {
          this.obtenerCategorias();
          Swal.fire({
            icon: 'success',
            title: 'Eliminada',
            text: 'La categoría fue eliminada correctamente.',
            confirmButtonColor: '#3085d6'
          });
        },
        error: (err) => {
          const mensaje = err.error?.mensaje || 'Error al eliminar la categoría.';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            confirmButtonColor: '#d33'
          });
        }
      });
    }
  });
}

  cancelarEdicion(): void {
    this.resetFormulario();
  }

  private resetFormulario(): void {
    this.formulario.reset();
    this.modoEdicion = false;
    this.categoriaEditandoId = null;
  }
}
