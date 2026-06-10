import { Component } from '@angular/core';
import { Header } from '../../layout/header/header';
import { MenuLateral } from '../../layout/menu-lateral/menu-lateral';
import { RecomendacionPopupComponent } from '../recomendaciones/recomendacion-popup/recomendacion-popup';


@Component({
  selector: 'app-dashboard',
  imports: [Header, MenuLateral, RecomendacionPopupComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
