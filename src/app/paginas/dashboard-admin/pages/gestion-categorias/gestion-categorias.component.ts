import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Categoria, CategoriasService } from '../../../../servicios/categorias.service';

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
      description: ['', Validators.required], // <-- Agregado
      icon: ['']
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
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.cargando = false;
      }
    });
  }

  guardarCategoria(): void {
    if (this.formulario.invalid) return;
    const data = this.formulario.value;
    if (this.modoEdicion && this.categoriaEditandoId) {
      this.categoriasService.actualizar(this.categoriaEditandoId, data).subscribe({
        next: () => {
          this.resetFormulario();
          this.obtenerCategorias();
        },
        error: (err) => console.error('Error al actualizar categoría:', err)
      });
    } else {
      this.categoriasService.crear(data).subscribe({
        next: () => {
          this.resetFormulario();
          this.obtenerCategorias();
        },
        error: (err) => console.error('Error al crear categoría:', err)
      });
    }
  }

  editarCategoria(categoria: Categoria): void {
    this.formulario.setValue({ name: categoria.name, description: categoria.description , icon: categoria.icon || '' });
    this.categoriaEditandoId = categoria.id;
    this.modoEdicion = true;
  }

  eliminarCategoria(categoria: Categoria): void {
    if (confirm(`¿Seguro que deseas eliminar la categoría "${categoria.name}"?`)) {
      this.categoriasService.eliminar(categoria.id).subscribe({
        next: () => this.obtenerCategorias(),
        error: (err) => console.error('Error al eliminar categoría:', err)
      });
    }
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
