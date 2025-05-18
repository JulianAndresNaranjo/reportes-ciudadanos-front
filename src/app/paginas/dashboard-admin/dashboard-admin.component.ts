import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';


@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent {
  menuAbierto = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  navegar(ruta: string): void {
    this.router.navigate([ruta]);
  }


}

