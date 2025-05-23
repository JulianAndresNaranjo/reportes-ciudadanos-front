import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReportesService } from '../../servicios/reportes.service';
import { CategoriasService } from '../../servicios/categorias.service';
import { FormsModule } from '@angular/forms';
import { ComentariosService } from '../../servicios/comentarios.service';
import { Router } from '@angular/router';
import { ChangeStatusReportDTO } from '../../servicios/change-status-report.dto';



@Component({
  selector: 'app-detalle-reporte',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ FormsModule incluido
  templateUrl: './detalle-reporte.component.html',
  styleUrls: ['./detalle-reporte.component.css']
})

export class DetalleReporteComponent implements OnInit {

  reporte: any;
  nombreCategoria: string = 'No asignada';
  comentarios: any[] = [];
  nuevoComentario: string = '';
   userIdActual: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private reportesService: ReportesService,
    private categoriasService: CategoriasService,
    private router: Router,
    private comentariosService: ComentariosService
  ) {}

  ngOnInit(): void {
    this.userIdActual = localStorage.getItem('userId');
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reportesService.obtenerPorId(id).subscribe({
        next: (data) => {
          this.reporte = data.datos;
          if (this.reporte.categoryId) {
            this.obtenerNombreCategoria(this.reporte.categoryId);
          }
          this.cargarComentarios(); // Cargar comentarios
        },
        error: (err) => {
          console.error('Error al obtener reporte:', err);
          this.reporte = null;
        }
      });
    }
  }

  private obtenerNombreCategoria(categoryId: string): void {
    this.categoriasService.obtenerPorId(categoryId).subscribe({
      next: (categoria) => {
        this.nombreCategoria = categoria.datos?.name || categoria.name || 'No asignada';
      },
      error: (err) => {
        this.nombreCategoria = 'Error al cargar categoría';
      }
    });
  }

  private cargarComentarios(): void {
    this.comentariosService.obtenerComentarios().subscribe({
      next: (respuesta) => {
        this.comentarios = (respuesta.datos || []).filter((c: any) => c.reportId === this.reporte.id);
      },
      error: (err) => {
        console.error('Error al cargar comentarios:', err);
      }
    });
  }

  agregarComentario(): void {
  const userId = localStorage.getItem('userId');
  const mensaje = this.nuevoComentario.trim();

  if (!userId || !mensaje) {
    alert('El comentario no puede estar vacío');
    return;
  }

  const comentario = {
    message: mensaje,
    userId: userId,
    reportId: this.reporte.id
  };

  this.comentariosService.crearComentario(comentario).subscribe({
    next: () => {
      this.nuevoComentario = ''; // ✅ Limpiar textarea
      this.cargarComentarios();  // ✅ Recargar comentarios
    },
    error: (err) => {
      console.error('Error al agregar comentario:', err);
      alert('Error al enviar el comentario');
    }
  });
}

eliminarComentario(id: string): void {
  console.log('Eliminando comentario con ID:', id); // ✅ PRIMER PASO
  if (confirm('¿Estás seguro de eliminar este comentario?')) {
    this.comentariosService.eliminarComentario(id).subscribe({
      next: () => {
        console.log('Comentario eliminado'); // ✅
        this.cargarComentarios(); // Recargar lista de comentarios
      },
      error: (err) => {
        console.error('Error al eliminar comentario:', err);
        alert('Error al eliminar el comentario');
      }
    });
  }
}

marcarComoResuelto(): void {
  if (!this.reporte?.id) {
    alert("No se puede cambiar el estado sin ID de reporte.");
    return;
  }

  const confirmacion = confirm("¿Estás seguro de marcar este reporte como RESUELTO?");
  if (!confirmacion) return;

  const cambio: ChangeStatusReportDTO = {
    id: this.reporte.id,
    status: "RESUELTO",
    observation: "El usuario marcó este reporte como resuelto."
  };

  this.reportesService.cambiarEstadoReporte(cambio).subscribe({
    next: (respuesta) => {
      alert("Reporte actualizado con éxito.");
      this.reporte.status = "RESUELTO";
    },
    error: (err) => {
      console.error("Error al cambiar estado:", err);
      alert("Hubo un error al actualizar el reporte.");
    }
  });
}

eliminarReporte(): void {
  if (!this.reporte?.id) {
    alert("No se puede cambiar el estado sin ID de reporte.");
    return;
  }

  const confirmacion = confirm("¿Estás seguro de marcar este reporte como ELIMINADO? Esta acción no se puede deshacer.");
  if (!confirmacion) return;

  this.reportesService.eliminarReporte(this.reporte.id).subscribe({
    next: () => {
      alert("Reporte marcado como eliminado con éxito.");
      this.router.navigate(['/home']);
    },
    error: (err) => {
      console.error("Error al cambiar estado a ELIMINADO:", err);
      alert("Hubo un error al actualizar el reporte.");
    }
  });
}



volver(): void {
    this.router.navigate(['/home']); // Cambia esta ruta si quieres otro destino
  }

}