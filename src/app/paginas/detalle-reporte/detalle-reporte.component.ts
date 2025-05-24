import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ReportesService } from '../../servicios/reportes.service';
import { CategoriasService } from '../../servicios/categorias.service';
import { ComentariosService } from '../../servicios/comentarios.service';
import { ChangeStatusReportDTO } from '../../servicios/change-status-report.dto';

import Swal from 'sweetalert2';  // <-- Importar SweetAlert2

@Component({
  selector: 'app-detalle-reporte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-reporte.component.html',
  styleUrls: ['./detalle-reporte.component.css']
})
export class DetalleReporteComponent implements OnInit {

  reporte: any;
  nombreCategoria: string = 'No asignada';
  comentarios: any[] = [];
  nuevoComentario: string = '';
  userIdActual: string | null = null;
  comentarioCargando: boolean = false;

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
          this.cargarComentarios();
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
      error: () => {
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
    Swal.fire({
      icon: 'warning',
      title: 'Comentario vacío',
      text: 'El comentario no puede estar vacío',
      confirmButtonColor: '#f39c12'
    });
    return;
  }

  const comentario = {
    message: mensaje,
    userId: userId,
    reportId: this.reporte.id
  };

  this.comentarioCargando = true; // Activa spinner

  this.comentariosService.crearComentario(comentario).subscribe({
    next: () => {
      this.nuevoComentario = '';
      this.cargarComentarios();
      this.comentarioCargando = false; // Desactiva spinner

      Swal.fire({
        icon: 'success',
        title: 'Comentario agregado',
        text: 'Tu comentario se ha enviado correctamente.',
        timer: 1500,
        showConfirmButton: false
      });
    },
    error: (err) => {
      console.error('Error al agregar comentario:', err);
      this.comentarioCargando = false; // Desactiva spinner

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al enviar el comentario',
        confirmButtonColor: '#d33'
      });
    }
  });
}


  eliminarComentario(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.comentariosService.eliminarComentario(id).subscribe({
          next: () => {
            this.cargarComentarios();
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'Comentario eliminado correctamente',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error('Error al eliminar comentario:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al eliminar el comentario',
              confirmButtonColor: '#d33'
            });
          }
        });
      }
    });
  }

  marcarComoResuelto(): void {
    if (!this.reporte?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se puede cambiar el estado sin ID de reporte.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro de marcar este reporte como RESUELTO?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2ecc71',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, marcar como resuelto',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const cambio: ChangeStatusReportDTO = {
          id: this.reporte.id,
          status: "RESUELTO",
          observation: "El usuario marcó este reporte como resuelto."
        };

        this.reportesService.cambiarEstadoReporte(cambio).subscribe({
          next: () => {
            this.reporte.status = "RESUELTO";
            Swal.fire({
              icon: 'success',
              title: 'Reporte actualizado',
              text: 'Reporte marcado como resuelto exitosamente.',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error("Error al cambiar estado:", err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al actualizar el reporte.',
              confirmButtonColor: '#d33'
            });
          }
        });
      }
    });
  }

  eliminarReporte(): void {
    if (!this.reporte?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se puede eliminar sin ID de reporte.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro de eliminar este reporte?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reportesService.eliminarReporte(this.reporte.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Reporte eliminado',
              text: 'Reporte eliminado con éxito.',
              timer: 1500,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/home']);
            });
          },
          error: (err) => {
            console.error("Error al eliminar reporte:", err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al eliminar el reporte.',
              confirmButtonColor: '#d33'
            });
          }
        });
      }
    });
  }

  volver(): void {
    this.router.navigate(['/home']);
  }
}
