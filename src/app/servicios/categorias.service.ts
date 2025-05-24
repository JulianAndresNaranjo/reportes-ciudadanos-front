import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Categoria {
  id: string;
  name: string;
  icon: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private baseUrl = 'http://localhost:8080/categories';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

listar(): Observable<Categoria[]> {
  return this.http.get<any>(`${this.baseUrl}`, { headers: this.getHeaders() })
    .pipe(
      map(response => {
        if (response && response.datos) {
          return response.datos;
        } else {
          console.warn('La respuesta del backend no tiene "datos":', response);
          return [];
        }
      })
    );
}


  // Alias para mantener compatibilidad con código existente
  listarTodas(): Observable<Categoria[]> {
    return this.listar();
  }

  obtenerPorId(id: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/id/${id}`, { headers: this.getHeaders() });
  }

  crear(categoria: any): Observable<any> {
    console.log('Creando categoría:', categoria);
    return this.http.post(this.baseUrl, categoria, { headers: this.getHeaders() });
  }

  actualizar(name: string, categoria: Partial<Categoria>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${name}`, categoria, { headers: this.getHeaders() });
  }

  eliminar(name: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${name}`, { headers: this.getHeaders() });
  }
}