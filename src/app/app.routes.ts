import { Routes } from '@angular/router';
import { Movimientos } from './components/pages/movimientos/movimientos';
import { Dashboard } from './components/pages/dashboard/dashboard';

export const routes: Routes = [
  { path: 'movimientos', component: Movimientos, title: 'Movimientos' },
  { path: 'dashboard', component: Dashboard, title: 'Dashboard' },
];
