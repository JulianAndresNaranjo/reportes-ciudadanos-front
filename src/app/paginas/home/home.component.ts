import { Component, OnInit } from '@angular/core';
import { MapService } from '../../servicios/map.service';
import { Router } from '@angular/router';
import { ReportesService } from '../../servicios/reportes.service'; // <-- Asegúrate de importar esto
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(
    private mapaService: MapService,
    private reportesService: ReportesService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.verificateSession();
    this.mapaService.crearMapa();
    this.getReport();

    
  }

  getReport() {
  this.reportesService.listarTodos().subscribe({
    next: (reportes) => {
      console.log('Reporte recibido:', reportes);
      const reportesConCategoria = reportes.map(async (reporte) => {
        if (reporte.categoryId) {
          try {
            const categoria = await this.reportesService
              .getCategoriaById(reporte.categoryId)
              .toPromise();
            reporte.nombreCategoria = categoria.datos?.name || categoria.name || 'No asignada';
          } catch (err) {
            console.warn(`Error al cargar categoría del reporte ${reporte.id}`, err);
            reporte.nombreCategoria = 'Error al cargar';
          }
        } else {
          reporte.nombreCategoria = 'No asignada';
        }
        return reporte;
      });

      // Esperar a que todos los reportes tengan su nombre de categoría antes de pintar
      Promise.all(reportesConCategoria).then((completos) => {
        this.mapaService.pintarMarcadores(completos);
      });
    },
    error: (err) => {
      console.error('Error al cargar reportes:', err);
    }
  });
}


  crearReporte() {
    this.router.navigate(['/crear-reporte']);
  }
}
