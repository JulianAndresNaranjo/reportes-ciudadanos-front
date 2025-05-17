import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountServiceService {
  constructor(private http: HttpClient) { }
   private baseUrl = 'http://localhost:8080/users/';
}
