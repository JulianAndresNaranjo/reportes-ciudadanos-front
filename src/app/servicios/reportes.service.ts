import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaDTO } from '../dto/respuesta-dto'; // Asegúrate de que esta ruta sea correcta
import { ChangeStatusReportDTO } from './change-status-report.dto';



@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private reportesURL = "http://localhost:8080/report";

  constructor(private http: HttpClient) { }

  public crear(reporte: FormData): Observable<RespuestaDTO> {
    console.log('=== ENVIANDO REPORTE ===');
    console.log('URL:', this.reportesURL);

    // Obtener token
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');

    // Crear headers
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      console.log('Token agregado a headers');
    } else {
      console.warn('No se encontró token');
    }

    // Debug FormData (ya lo tienes en el componente, pero lo dejo aquí por si acaso)
    console.log('FormData entries en el servicio:');
    for (let pair of reporte.entries()) {
      if (pair[0] === 'photos') { // Cambiado a 'photos' para la imagen
        console.log(`${pair[0]}: [File] ${(pair[1] as File).name}`);
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }

    // No es necesario especificar Content-Type para FormData; Angular/HttpClient lo hace automáticamente
    // y lo configura como multipart/form-data con el boundary correcto.
    return this.http.post<RespuestaDTO>(this.reportesURL, reporte, { headers });
  }

  public listarTodos(): Observable<any[]> {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<any[]>(`${this.reportesURL}/all`, { headers });

  }

  public obtenerPorId(id: string): Observable<any> {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<any>(`${this.reportesURL}?id=${id}`, { headers });
  }

  getCategoriaById(id: string) {
    return this.http.get<any>(`http://localhost:8080/categories/id/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  cambiarEstadoReporte(cambio: ChangeStatusReportDTO): Observable<any> {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  

  return this.http.patch(`${this.reportesURL}/status`, cambio, { headers });
}

eliminarReporte(id: string): Observable<any> {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');

  let headers = new HttpHeaders();
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  return this.http.delete(`${this.reportesURL}?id=${id}`, { headers });
}



}