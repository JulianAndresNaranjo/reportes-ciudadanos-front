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

  getReport(){
    this.reportesService.listarTodos().subscribe({
      next: (reportes) => {
        this.mapaService.pintarMarcadores(reportes);
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
