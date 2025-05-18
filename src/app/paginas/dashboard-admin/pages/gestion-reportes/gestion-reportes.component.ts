import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(
   
  ) {}

  ngOnInit(): void {
    this.obtenerReportesDeArmenia();
  }

  obtenerReportesDeArmenia() {
    /*this.reportesService.obtenerReportesPorCiudad('Armenia').subscribe({
      next: (data) => {
        this.reportes = data;
        this.cargando = false;
        // Crear un form control por reporte para el select
        this.reportes.forEach(r => {
          this.estadoSeleccionado[r.id] = new FormControl(r.estadoActual);
        });
      },
      error: (err) => {
        console.error('Error al cargar reportes:', err);
        this.cargando = false;
      }
    });*/
  }

  actualizarEstado(reporteId: string) {
    /*const nuevoEstado = this.estadoSeleccionado[reporteId].value;
    this.reportesService.cambiarEstado(reporteId, nuevoEstado).subscribe({
      next: () => {
        alert('Estado actualizado correctamente.');
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        alert('Error al actualizar estado del reporte.');
      }
    });*/
  }

  cargarNombresClientesUnicos() {
  /*const idsUnicos = Array.from(new Set(this.reportes.map(r => r.clienteId)));

  idsUnicos.forEach(id => {
    this.usuariosService.obtenerPorId(id).subscribe({
      next: (data) => {
        const nombre = data?.respuesta?.nombre || 'Desconocido';
        this.reportes.forEach(rep => {
          if (rep.clienteId === id) {
            rep.nombreCliente = nombre;
          }
        });
      },
      error: () => {
        this.reportes.forEach(rep => {
          if (rep.clienteId === id) {
            rep.nombreCliente = 'Error';
          }
        });
      }
    });
  });*/
}
}

