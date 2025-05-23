import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ComentariosService {
  private readonly baseUrl = 'http://localhost:8080/comments';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  crearComentario(comentario: { message: string, userId: string, reportId: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}`, comentario, { headers: this.getHeaders() });
  }

  obtenerComentarios(): Observable<any> {
    return this.http.get(`${this.baseUrl}`, { headers: this.getHeaders() });
  }
  eliminarComentario(id: string): Observable<any> {
  return this.http.delete(`${this.baseUrl}/${id}`, {
    headers: this.getHeaders()
  });
}


}
