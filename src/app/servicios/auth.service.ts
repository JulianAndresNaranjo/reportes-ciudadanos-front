import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:8080/users/';
  private tokenKey = 'auth_token';

  login(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }


  

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}createUser/`, data);
  }


  getCiudades(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}getcities`);
  }

  senCodeConfirmation(correo: string): void {
    this.http.post(`${this.baseUrl}sendCodeConfirmation/${correo}`, null)
      .subscribe({
        next: response => {
          console.log('Código enviado con éxito', response);
        },
        error: error => {
          console.error('Error al enviar código', error);
        }
      });
  }

  verifyCode(code: any ): Observable<any> {
   return  this.http.put(`${this.baseUrl}verifyAccountEmailCode`, code);
  }
}
