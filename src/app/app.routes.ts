import { Routes } from '@angular/router';
import { Movimientos } from './components/pages/movimientos/movimientos';
import { Perfil } from './components/pages/perfil/perfil';
import { Dashboard } from './components/pages/dashboard/dashboard';
import { Login } from './components/pages/login/login';
import { Registro } from './components/pages/registro/registro';

export const routes: Routes = [
      {
    path: 'movimientos',
    component: Movimientos
  },
  { 
    path: 'perfil',
    component: Perfil
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'login',
    component: Login
  },
   {
    path: 'registro',
    component: Registro
  }
];
