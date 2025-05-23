import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReportesService } from '../../servicios/reportes.service';
import { CategoriasService } from '../../servicios/categorias.service';

@Component({
  selector: 'app-detalle-reporte',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-reporte.component.html',
  styleUrls: ['./detalle-reporte.component.css']
})
export class DetalleReporteComponent implements OnInit {
  reporte: any;
  nombreCategoria: string = 'No asignada';

  constructor(
    private route: ActivatedRoute,
    private reportesService: ReportesService,
    private categoriasService: CategoriasService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reportesService.obtenerPorId(id).subscribe({
        next: (data) => {
          console.log("Respuesta completa:", data);
          console.log("Reporte recibido:", data.datos);
          this.reporte = data.datos;

          // Si hay categoryId, buscar el nombre de la categoría
          if (this.reporte.categoryId) {
            this.obtenerNombreCategoria(this.reporte.categoryId);
          }

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
        console.error('Error al obtener categoría:', err);
        this.nombreCategoria = 'Error al cargar categoría';
      }
    });
  }

}