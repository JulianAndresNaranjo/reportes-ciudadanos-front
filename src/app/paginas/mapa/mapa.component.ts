import { Component, Output, EventEmitter, AfterViewInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-mapa',
  standalone: true,
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements AfterViewInit {
  @Output() ubicacionSeleccionada = new EventEmitter<{ latitude: number, longitude: number }>();
  mapa!: mapboxgl.Map;
  marcadores: mapboxgl.Marker[] = [];
  posicionActual: [number, number] = [-75.67270, 4.53252]; // [lng, lat]

  ngAfterViewInit() {
    this.crearMapa();
    this.agregarMarcador();
  }

  crearMapa() {
  mapboxgl.accessToken = 'pk.eyJ1IjoianVsaWFuYW5kcmVzbmFyYWpvYWx6YXRlIiwiYSI6ImNtYXhqc2JjYTB0NXIyaXB1cXBnajhoNnEifQ.MzMwGNmXdcEWoJvS3mWR_A';

  this.mapa = new mapboxgl.Map({
    container: 'mapa',
    style: 'mapbox://styles/mapbox/standard',
    center: [-75.67270, 4.53252],
    zoom: 17
  });

  this.mapa.addControl(new mapboxgl.NavigationControl());
}


  agregarMarcador() {
    this.mapa.on('click', (e: any) => {
      // Elimina marcadores anteriores
      this.marcadores.forEach(m => m.remove());

      // Crea nuevo marcador
      const marcador = new mapboxgl.Marker({ color: 'red' })
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(this.mapa);

      this.marcadores = [marcador];

      // Emitir coordenadas
      this.ubicacionSeleccionada.emit({
        latitude: e.lngLat.lat,
        longitude: e.lngLat.lng
      });
    });
  }
}
