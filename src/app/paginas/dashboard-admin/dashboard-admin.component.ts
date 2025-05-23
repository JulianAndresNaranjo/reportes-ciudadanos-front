import { Component, OnInit } from '@angular/core';
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
export class DashboardAdminComponent implements OnInit{
  menuAbierto = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.authService.verificateSession();
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  navegar(ruta: string): void {
    this.router.navigate([ruta]);
  }

  


}


