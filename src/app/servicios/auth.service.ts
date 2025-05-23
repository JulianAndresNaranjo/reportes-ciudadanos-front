import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Route, Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,private router:Router) { }
  private baseUrl = 'http://localhost:8080/users/';
  private tokenKey = 'auth_token';

 login(data: any):  Observable<any> {
    return this.http.post(`http://localhost:8080/api/auth/login`, data).pipe(
      tap((response: any) => {
        localStorage.setItem('authToken', response.token);
        console.log('Token almacenado en localStorage:', response.token);
      })
    );
  }


  

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
 }

  verificateSession(){
    this.delay(500);
    const rol = localStorage.getItem('rol');
    console.log(rol)
    if (rol === 'ROLE_ADMINISTRADOR') {
      this.router.navigate(['/dashboard-admin']);
    } else if ( rol === 'ROLE_CLIENTE') {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
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
