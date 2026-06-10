import { Component } from '@angular/core';
import { Header } from '../../layout/header/header';
import { MenuLateral } from '../../layout/menu-lateral/menu-lateral';


@Component({
  selector: 'app-dashboard',
  imports: [Header, MenuLateral],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
