import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../../../../services/login.service'; 
interface RecomendacionResponseDTO {
  idRecomendacion: number;
  titulo: string;
  descripcion: string;
  scoreRango: string;
  fechaRecomendacion: string;
}

@Component({
  selector: 'app-recomendacion-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recomendacion-popup.html',
  styleUrl: './recomendacion-popup.css',
})
export class RecomendacionPopupComponent implements OnInit {

  private readonly API = 'http://localhost:8080/api/recomendaciones';

  mostrarPopup = false;
  recomendacion: RecomendacionResponseDTO | null = null;

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idUsuario = this.loginService.obtenerIdUsuario();

    if (idUsuario === null) return;

    this.http
      .get<RecomendacionResponseDTO[]>(`${this.API}/usuario/${idUsuario}`)
      .subscribe({
        next: (data) => {
          if (data.length > 0) {
            this.recomendacion = data[0];
            this.mostrarPopup = true;
          }
        },
        error: () => {
        },
      });
  }

  cerrar(): void {
    this.mostrarPopup = false;
  }

  irAHistorial(): void {
    this.mostrarPopup = false;
    this.router.navigate(['/recomendaciones']);
  }

  badgeClase(scoreRango: string | undefined): string {
    if (!scoreRango) return '';
    const inicio = parseInt(scoreRango.split('-')[0], 10);
    if (inicio >= 71) return 'alto';
    if (inicio >= 41) return 'medio';
    return 'bajo';
  }
}