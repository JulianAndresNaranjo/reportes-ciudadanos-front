import { Component, OnInit } from '@angular/core';
import { MapService } from '../../servicios/map.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(
    private mapaService: MapService,
    private router: Router
  ) { }

  ngOnInit(): void {
    
      this.mapaService.crearMapa();
   
    // Aquí puedes agregar la lógica que necesites al cargar el componente
  }

  // Puedes agregar métodos adicionales según sea necesario
}
