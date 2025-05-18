import { Routes } from '@angular/router';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { VerificacionCuentaComponent } from './paginas/verificacion-cuenta/verificacion-cuenta.component';
import { HomeComponent } from './paginas/home/home.component';
import { DashboardAdminComponent } from './paginas/dashboard-admin/dashboard-admin.component';
import { GestionReportesComponent } from './paginas/dashboard-admin/pages/gestion-reportes/gestion-reportes.component';
import { GestionCategoriasComponent } from './paginas/dashboard-admin/pages/gestion-categorias/gestion-categorias.component';
import { AdminInicioComponent } from './paginas/dashboard-admin/pages/admin-inicio/admin-inicio.component';

export const routes: Routes = [
   { path: '', redirectTo: 'login', pathMatch: 'full' },
   { path: 'login', component: LoginComponent },
   { path: 'registro', component: RegistroComponent }, 
   { path: 'verificacion-cuenta', component: VerificacionCuentaComponent},
   { path: 'home', component: HomeComponent},
   {path: 'dashboard-admin',
    component: DashboardAdminComponent,
    children: [
      { path: '', component: AdminInicioComponent },
      { path: 'categorias', component: GestionCategoriasComponent },
      { path: 'reportes', component: GestionReportesComponent },
    ]
  },
   { path: "**", pathMatch: "full", redirectTo: "" }
   
  
];
