import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Categoria, CategoriasService } from '../../servicios/categorias.service';
import { MapaComponent } from '../mapa/mapa.component';
import { HttpClient } from '@angular/common/http';
import { ReportesService } from '../../servicios/reportes.service';
import { CrearReporteDTO } from '../../dto/respuesta-dto';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-crear-reporte',
  standalone: true,
  imports: [CommonModule, FormsModule, MapaComponent],
  templateUrl: './crear-reporte.component.html',
  styleUrls: ['./crear-reporte.component.css']
})
export class CrearReporteComponent implements OnInit {

  notificador: string = '';
  titulo: string = '';
  categorias: Categoria[] = [];
  categoria: string = '';
  descripcion: string = '';
  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;
  isImportant: boolean = false;

  ubicacion: {
    latitude: number;
    longitude: number;
    name: string;
    description: string;
  } | null = null;

  constructor(
    private http: HttpClient,
    private categoriasService: CategoriasService,
    private reportesService: ReportesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  volver(): void {
    this.router.navigate(['/home']);
  }

  getCategories() {
    this.categoriasService.listar().subscribe({
      next: (data) => {
        this.categorias = data;
        console.log('Categorías cargadas:', this.categorias);
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagenSeleccionada = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      reader.readAsDataURL(this.imagenSeleccionada);
    }
  }

  onUbicacionMapa(coords: { latitude: number; longitude: number }): void {
    this.ubicacion = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      name: '',
      description: ''
    };
  }

  enviarReporte(): void {
    const userId = this.obtenerUsuarioIdDesdeJWT();
    if (!userId) {
      alert('No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.');
      return;
    }

    if (!this.titulo.trim() || !this.descripcion.trim() || !this.categoria || !this.ubicacion) {
      alert('Todos los campos obligatorios deben estar completos.');
      return;
    }

    const categoriaSeleccionada = this.categorias.find(cat => cat.name === this.categoria);
    if (!categoriaSeleccionada) {
      alert('Categoría no válida.');
      return;
    }

    const createReportDTO: CrearReporteDTO = {
  description: this.descripcion.trim(),
  userId: userId,
  title: this.titulo.trim(),
  categoryId: categoriaSeleccionada.id,
  isImportant: this.isImportant,   // <-- nuevo campo aquí
  location: {
    latitude: this.ubicacion.latitude,
    longitude: this.ubicacion.longitude,
    name: this.ubicacion.name || '',
    description: this.ubicacion.description || ''
  }
};


    const formData = new FormData();
    formData.append('createReportDTO', JSON.stringify(createReportDTO));

    if (this.imagenSeleccionada) {
      formData.append('photos', this.imagenSeleccionada, this.imagenSeleccionada.name);
    }

    this.reportesService.crear(formData).subscribe({
      next: (response) => {
        alert('Reporte enviado correctamente');
        this.limpiarFormulario();
      },
      error: (err) => {
        alert('Error al enviar el reporte: ' + (err.error?.mensaje || err.message));
      }
    });
  }

  private obtenerUsuarioIdDesdeJWT(): string | null {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || null;
    } catch {
      return null;
    }
  }

  private limpiarFormulario(): void {
    this.titulo = '';
    this.descripcion = '';
    this.categoria = '';
    this.imagenSeleccionada = null;
    this.imagenPreview = null;
    this.ubicacion = null;
  }
}