import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-inicio',
  templateUrl: './admin-inicio.component.html',
  styleUrls: ['./admin-inicio.component.css']
})
export class AdminInicioComponent {
  constructor(private router: Router) {}

  navegar(ruta: string) {
    this.router.navigate(['/dashboard-admin', ruta]);
  }
}
