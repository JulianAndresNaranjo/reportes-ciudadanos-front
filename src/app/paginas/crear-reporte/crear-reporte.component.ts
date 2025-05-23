import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Categoria, CategoriasService } from '../../servicios/categorias.service';
import { MapaComponent } from '../mapa/mapa.component';
import { HttpClient } from '@angular/common/http';
import { ReportesService } from '../../servicios/reportes.service';
import { CrearReporteDTO, RespuestaDTO } from '../../dto/respuesta-dto'; // Asegúrate de que CrearReporteDTO esté en este archivo o en uno importable
import { routes } from '../../app.routes';
import { Route, Router, RouterLink } from '@angular/router';
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
  ) { }

  ngOnInit(): void {

    this.getCategories();

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
      console.log('Imagen seleccionada:', this.imagenSeleccionada);

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
    console.log('Ubicación seleccionada:', this.ubicacion);
  }

  enviarReporte(): void {
    console.log('Iniciando envío de reporte...');

    // Obtener ID del usuario desde el JWT token
    const userId = this.obtenerUsuarioIdDesdeJWT();

    if (!userId) {
      alert('No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.');
      return;
    }

    console.log('Usuario ID obtenido:', userId);

    // Validaciones
    if (!this.titulo.trim()) {
      alert('El título es obligatorio.');
      return;
    }

    if (!this.descripcion.trim()) {
      alert('La descripción es obligatoria.');
      return;
    }

    if (!this.categoria) {
      alert('Debe seleccionar una categoría.');
      return;
    }

    if (!this.ubicacion) {
      alert('Debe seleccionar una ubicación en el mapa.');
      return;
    }

    // Buscar el ID de la categoría seleccionada
    const categoriaSeleccionada = this.categorias.find(cat => cat.name === this.categoria);
    if (!categoriaSeleccionada) {
      alert('Categoría no válida.');
      return;
    }

    console.log('Categoría seleccionada:', categoriaSeleccionada);

    // Crear el objeto DTO que el backend espera
    const createReportDTO: CrearReporteDTO = {
      description: this.descripcion.trim(),
      userId: userId,
      title: this.titulo.trim(),
      categoryId: categoriaSeleccionada.id,
      location: {
        latitude: this.ubicacion.latitude,
        longitude: this.ubicacion.longitude,
        name: this.ubicacion.name || '',
        description: this.ubicacion.description || ''
      }
      // Las fotos no se incluyen aquí directamente, se envían aparte en FormData
    };

    // Crear FormData
    const formData = new FormData();

    // Adjuntar el DTO serializado a JSON bajo la clave "createReportDTO"
    formData.append('createReportDTO', JSON.stringify(createReportDTO));
    console.log('createReportDTO JSON agregado al FormData:', JSON.stringify(createReportDTO));


    // Adjuntar la imagen si existe, bajo la clave "photos" (como espera el backend para una lista)
    if (this.imagenSeleccionada) {
      // El backend espera 'photos' como un List<MultipartFile>, incluso si es solo una
      formData.append('photos', this.imagenSeleccionada, this.imagenSeleccionada.name);
      console.log('Imagen agregada al FormData bajo la clave "photos"');
    }

    // Debug: Mostrar contenido del FormData (para verificación)
    console.log('Contenido final del FormData:');
    for (let pair of formData.entries()) {
      if (pair[0] === 'photos') {
        console.log(`${pair[0]}: [File] ${(pair[1] as File).name}`);
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }

    // Enviar el reporte
    this.reportesService.crear(formData).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        if (response.error) {
          alert('Error del servidor: ' + JSON.stringify(response.contenido));
        } else {
          alert('Reporte enviado correctamente');
          this.limpiarFormulario();
        }
      },
      error: (err) => {
        console.error('Error completo:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Error body:', err.error);

        let mensajeError = 'Error al enviar el reporte.';
        if (err.error && err.error.mensaje) {
          mensajeError += ' ' + err.error.mensaje;
        } else if (err.statusText) {
          mensajeError += ' Detalles: ' + err.statusText;
        } else if (err.message) {
          mensajeError += ' Mensaje: ' + err.message;
        }
        alert(mensajeError);
      }
    });
  }

  private obtenerUsuarioIdDesdeJWT(): string | null {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');

    if (!token) {
      console.error('No se encontró token');
      return null;
    }

    try {
      // Decodificar JWT - tomar solo la parte del payload (índice 1)
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('JWT Payload:', payload);

      // El ID del usuario debería estar en 'sub' (subject)
      return payload.sub || null;
    } catch (error) {
      console.error('Error al decodificar JWT:', error);
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