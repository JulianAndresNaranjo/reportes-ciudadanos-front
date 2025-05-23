import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { routes } from './app.routes';
import { CommonModule } from '@angular/common';
import { AuthService } from './servicios/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-report';

  constructor(private authService: AuthService,private router:Router) {
    

  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  logout(){
    localStorage.setItem('token', '');
    localStorage.setItem('rol', '');
    this.router.navigate(['/login']);
  }
}
