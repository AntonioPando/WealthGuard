import { Routes } from '@angular/router';
import { Movimientos } from './components/pages/movimientos/movimientos';
import { Perfil } from './components/pages/perfil/perfil';
import { Dashboard } from './components/pages/dashboard/dashboard';
import { Login } from './components/pages/login/login';
import { Registro } from './components/pages/registro/registro';
import { Presupuestos } from './components/pages/presupuestos/presupuestos';
import { NotFound } from './components/pages/not-found/not-found';
import { RecomendacionesComponent } from './components/pages/recomendaciones/recomendaciones';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'registro',
    component: Registro
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'movimientos',
    component: Movimientos
  },
  {
    path: 'perfil',
    component: Perfil
  },
  {
    path: 'presupuestos',
    component: Presupuestos
  },
  {
    path: 'recomendaciones',
    component: RecomendacionesComponent
  },
  {
    path: '**',
    component: NotFound
  }
];