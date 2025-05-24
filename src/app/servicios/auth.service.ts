import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Route, Router } from '@angular/router';
export interface usuario {
  id: string;
  name: string;
  icon: string;
  description: string;
}
export interface Usuario {
  id: string;
  documentNumber: string;
  name: string;
  residenceCity: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  userType: string;
  enumUserStatus: string;
  followers: any[]; // puedes tiparlo mejor si sabes su estructura
  score: number;
  createdAt: string;
  codeValidation: string | null;
}
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
   private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
obtenerUsuario(userId: string): Observable<Usuario> {
    return this.http.get<any>(`${this.baseUrl}${userId}`, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response && response.datos) {
            return response.datos as Usuario;
          } else {
            console.warn('La respuesta del backend no tiene "datos":', response);
            return {} as Usuario;
          }
        })
      );
  }

actualizarUsuario(userId: string, data: any): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}${userId}`, data, { headers: this.getHeaders() })
    .pipe(
      map(response => {
        if (response && response.datos) {
          return response.datos;
        } else {
          console.warn('La respuesta del backend no tiene "datos":', response);
          return null;
        }
      }),
      catchError(err => {
        console.error('Error al actualizar usuario:', err);
        return throwError(() => err);
      })
    );
}




 listarUsuarios(): Observable<Usuario[]> {
  return this.http.get<any>(`${this.baseUrl}`, { headers: this.getHeaders() })
    .pipe(
      map(response => {
        if (response && response.datos) {
          return response.datos as Usuario[];
        } else {
          console.warn('La respuesta del backend no tiene "datos":', response);
          return [];
        }
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
