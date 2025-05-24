import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReportesService } from '../../../../servicios/reportes.service';
import { CategoriasService } from '../../../../servicios/categorias.service';
import { AuthService } from '../../../../servicios/auth.service';
import Swal from 'sweetalert2';
import { ChangeStatusReportDTO } from '../../../../servicios/change-status-report.dto';

@Component({
  selector: 'app-gestion-reportes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-reportes.component.html',
  styleUrls: ['./gestion-reportes.component.css']
})
export class GestionReportesComponent implements OnInit {

  reportes: any[] = [];
  estadosDisponibles: string[] = ['PENDIENTE', 'VERIFICADO', 'RESUELTO', 'RECHAZADO', 'ELIMINADO'];
  estadoSeleccionado: { [id: string]: FormControl } = {};
  cargando = true;
  usuarios: any[] = [];

  constructor(
    private reportesService: ReportesService,
    private categoriasService: CategoriasService,
    private authservice: AuthService

  ) { }

  ngOnInit(): void {
    this.obtenerReportesDeArmenia();
  }

  obtenerReportesDeArmenia() {
    this.reportesService.listarTodos().subscribe({
      next: (data) => {
        this.reportes = data;

        this.categoriasService.listar().subscribe({
          next: (categorias) => {
            this.reportes.forEach(reporte => {
              const categoria = categorias.find(cat => cat.id === reporte.categoriaId);
              reporte.nombreCategoria = categoria ? categoria.name : 'Desconocida';
            });
            this.authservice.listarUsuarios().subscribe({
              next: (usuarios) => {
                this.usuarios = usuarios;
                this.reportes.forEach(reporte => {
                  const usuario = this.usuarios.find(user => user.id === reporte.clienteId);
                  reporte.nombreCliente = usuario ? usuario.nombre : 'Desconocido';
                });
              },
              error: (err) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error al cargar usuarios',
                  text: 'No se pudieron obtener los usuarios desde el servidor.',
                  confirmButtonColor: '#dc3545'
                });
              }
            });


            // Crear un FormControl por cada reporte para el select
            this.reportes.forEach(r => {
              this.estadoSeleccionado[r.id] = new FormControl(r.estadoActual);
            });

            this.cargando = false;
            console.log('Reportes obtenidos:', this.reportes);
          },
          error: (err) => {
            console.error('Error al cargar categorías:', err);
            this.cargando = false;
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar reportes:', err);
        this.cargando = false;
      }
    });
  }

  
  
   

 actualizarEstado(reporteId: string) {
  const cambio: ChangeStatusReportDTO = {
    id: reporteId, // asignamos el ID del reporte que se quiere actualizar
    status: this.estadoSeleccionado[reporteId].value,
    observation: '' // puedes agregar aquí lógica para permitir observaciones si lo deseas
  };

  this.reportesService.cambiarEstadoReporte(cambio).subscribe({
    next: () => {
      // Actualizamos localmente el estado en el array de reportes
      const reporteActualizado = this.reportes.find(r => r.id === reporteId);
      if (reporteActualizado) {
        reporteActualizado.estadoActual = cambio.status;
      }

      Swal.fire({
        icon: 'success',
        title: 'Estado actualizado',
        text: 'El estado del reporte fue actualizado correctamente.',
        confirmButtonColor: '#28a745'
      });
    },
    error: (err) => {
      console.error('Error al actualizar estado:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al intentar actualizar el estado del reporte.',
        confirmButtonColor: '#dc3545'
      });
    }
  });
}


}

