import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
@Injectable({
  providedIn: 'root'
})
export class MapService {
  mapa: any;
  marcadores: any[];
 posicionActual: LngLatLike;
  constructor() { 
    this.marcadores = [];
   this.posicionActual = [-75.67270, 4.53252];
  }

   public crearMapa() {
   this.mapa = new mapboxgl.Map({
     accessToken: 'pk.eyJ1Ijoic3RldmVuejAyIiwiYSI6ImNtOTNpbHA5MDBucGgyc3B3aGc3NGVjMTIifQ.sWpwCMBLsMpYLuT4MVQ4OA',
     container: 'mapa',
     style: 'mapbox://styles/mapbox/standard',
     center: this.posicionActual,
     pitch: 45,
     zoom: 17
   });
   this.mapa.addControl(new mapboxgl.NavigationControl());
   this.mapa.addControl(
     new mapboxgl.GeolocateControl({
       positionOptions: { enableHighAccuracy: true },
       trackUserLocation: true
     })
   );
 }

 public agregarMarcador(): Observable<any> {
   const mapaGlobal = this.mapa;
   const marcadores = this.marcadores;
   return new Observable<any>(observer => {
     mapaGlobal.on('click', function (e: any) {
       marcadores.forEach(marcador => marcador.remove());
       const marcador = new mapboxgl.Marker({color: 'red'})
         .setLngLat([e.lngLat.lng, e.lngLat.lat])
         .addTo(mapaGlobal);
       marcadores.push(marcador);
       observer.next(marcador.getLngLat());
     });
   });
 }
 pintarMarcadores(reportes: any[]) {
  reportes.forEach(reporte => {
    if (!reporte.location || reporte.location.longitude == null || reporte.location.latitude == null) {
      console.warn('Reporte sin ubicación válida:', reporte);
      return;
    }

    const popupHtml = `
      <strong>${reporte.titulo}</strong><br>
      <em>${reporte.descripcion}</em><br>
      <small><b>Categoría:</b> ${reporte.nombreCategoria ?? '—'}</small><br>
      <small><b>Estado:</b> ${reporte.estadoActual ?? 'SIN ESTADO'}</small><br><br>
      <a href="/dashboard/reportes/detalle/${reporte.id}" target="_self" style="color: #007bff; text-decoration: underline;">📄 Ver detalles</a>
    `;

    new mapboxgl.Marker({ color: 'red' })
      .setLngLat([reporte.location.longitude, reporte.location.latitude])
      .setPopup(new mapboxgl.Popup().setHTML(popupHtml))
      .addTo(this.mapa);
    });
  }

}
