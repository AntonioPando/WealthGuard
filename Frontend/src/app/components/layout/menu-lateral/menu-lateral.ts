import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-menu-lateral',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu-lateral.html',
  styleUrl: './menu-lateral.css',
})
export class MenuLateral {

  @Output() nuevaTransaccion = new EventEmitter<void>();

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {}

  onCerrarSesion(): void {
    this.loginService.cerrarSesion();
    this.router.navigate(['/login']);
  }

  onNuevaTransaccion(): void {
    if (this.router.url.includes('/movimientos')) {
      this.nuevaTransaccion.emit();
    } else {
      this.router.navigate(['/movimientos'], { queryParams: { abrir: 'true' } });
    }
  }
}
