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

  // Método principal que ya tienes funcionando
  listar(): Observable<Categoria[]> {
    return this.http.get<any>(`${this.baseUrl}`, { headers: this.getHeaders() })
      .pipe(map(response => response.datos ?? []));
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

  actualizar(id: string, categoria: Partial<Categoria>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, categoria, { headers: this.getHeaders() });
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }
}