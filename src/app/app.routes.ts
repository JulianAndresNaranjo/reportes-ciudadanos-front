import { Routes } from '@angular/router';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { VerificacionCuentaComponent } from './paginas/verificacion-cuenta/verificacion-cuenta.component';

export const routes: Routes = [
   { path: '', redirectTo: 'login', pathMatch: 'full' },
   { path: 'login', component: LoginComponent },
   { path: 'registro', component: RegistroComponent }, 
   { path: 'verificacion-cuenta', component: VerificacionCuentaComponent},
   { path: "**", pathMatch: "full", redirectTo: "" }
  
];
