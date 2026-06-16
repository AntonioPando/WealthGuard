import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../../../services/login.service';
import { ScoreFinancieroService } from '../../../services/score-financiero.service';
import { Header } from '../../layout/header/header';
import { MenuLateral } from '../../layout/menu-lateral/menu-lateral';

export interface RecomendacionResponseDTO {
  idRecomendacion: number;
  titulo: string;
  descripcion: string;
  scoreRango: string;
  fechaRecomendacion: string;
}

@Component({
  selector: 'app-recomendaciones',
  standalone: true,
  imports: [Header, MenuLateral, CommonModule],
  templateUrl: './recomendaciones.html',
  styleUrl: './recomendaciones.css',
})
export class RecomendacionesComponent implements OnInit {

  private readonly API = 'http://localhost:8080/api/recomendaciones';
  private idUsuario: number | null = null;

  recomendaciones: RecomendacionResponseDTO[] = [];
  seleccionadas = new Set<number>();
  cargando = true;

  mostrarPopup = false;
  recomendacionActual: RecomendacionResponseDTO | null = null;

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    private scoreFinancieroService: ScoreFinancieroService
  ) { }

  ngOnInit(): void {
    this.idUsuario = this.loginService.obtenerIdUsuario();
    if (this.idUsuario === null) {
      this.cargando = false;
      return;
    }
    this.generarYCargarRecomendaciones();
  }

  generarYCargarRecomendaciones(): void {
    this.cargando = true;

    this.scoreFinancieroService.obtenerScoreMensual(this.idUsuario!).subscribe({
      next: (resultado) => {
        const score = resultado.score;

        this.http
          .post<RecomendacionResponseDTO[]>(
            `${this.API}/generar?idUsuario=${this.idUsuario}&score=${score}`,
            {}
          )
          .subscribe({
            next: (data) => {
              this.recomendaciones = data;
              this.cargando = false;
              if (data.length > 0) {
                this.recomendacionActual = data[0];
                this.mostrarPopup = true;
              }
            },
            error: () => { this.cargando = false; },
          });
      },
      error: () => {
        // Si falla el cálculo del score, al menos mostramos el historial existente
        this.cargarRecomendaciones();
      }
    });
  }

  cargarRecomendaciones(): void {
    this.cargando = true;
    this.http
      .get<RecomendacionResponseDTO[]>(`${this.API}/usuario/${this.idUsuario}`)
      .subscribe({
        next: (data) => {
          this.recomendaciones = data;
          this.cargando = false;
        },
        error: () => { this.cargando = false; },
      });
  }

  cerrarPopup(): void {
    this.mostrarPopup = false;
  }

  toggleSeleccion(id: number): void {
    if (this.seleccionadas.has(id)) {
      this.seleccionadas.delete(id);
    } else {
      this.seleccionadas.add(id);
    }
    this.seleccionadas = new Set(this.seleccionadas);
  }

  eliminarUna(id: number): void {
    this.http.delete<boolean>(`${this.API}/${id}`).subscribe({
      next: (ok) => {
        if (ok) {
          this.recomendaciones = this.recomendaciones.filter(r => r.idRecomendacion !== id);
          this.seleccionadas.delete(id);
          this.seleccionadas = new Set(this.seleccionadas);
        }
      },
    });
  }

  eliminarSeleccionadas(): void {
    const ids = Array.from(this.seleccionadas);
    let pendientes = ids.length;
    ids.forEach((id) => {
      this.http.delete<boolean>(`${this.API}/${id}`).subscribe({
        next: () => {
          pendientes--;
          if (pendientes === 0) {
            this.seleccionadas.clear();
            this.cargarRecomendaciones();
          }
        },
      });
    });
  }

  badgeClase(scoreRango: string): string {
    if (!scoreRango) return '';
    const inicio = parseInt(scoreRango.split('-')[0], 10);
    if (inicio >= 700) return 'alto';
    if (inicio >= 400) return 'medio';
    return 'bajo';
  }
}