import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.html',
  styleUrls: ['./not-found.css'],
})
export class NotFound {

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  irAlPanel(): void {
    if (this.loginService.estaAutenticado()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  irAlLogin(): void {
    this.router.navigate(['/login']);
  }

  irASoporte(): void {
    console.log('Navegar a soporte');
  }
}