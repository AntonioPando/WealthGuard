import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { Header } from '../../layout/header/header';
import { MenuLateral } from '../../layout/menu-lateral/menu-lateral';
// Importa aquí tus componentes de layout

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, Header, MenuLateral], 
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
  encapsulation: ViewEncapsulation.None
})
export class Perfil {
  // Aquí puedes añadir lógica básica más adelante
  usuario = {
    nombre: 'Julian Alexander',
    email: 'julian.alexander@wealthguard.com',
    plan: 'Pro'
  };
}