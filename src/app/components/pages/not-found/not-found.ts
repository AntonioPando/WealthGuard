import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.html',
  styleUrls: ['./not-found.css'],
})
export class NotFound {

  constructor(private router: Router) {}

  irAlPanel(): void {
    this.router.navigate(['/dashboard']);
  }

  irAlLogin(): void {
    this.router.navigate(['/login']);
  }

  irASoporte(): void {
    console.log('Navegar a soporte');
  }
}