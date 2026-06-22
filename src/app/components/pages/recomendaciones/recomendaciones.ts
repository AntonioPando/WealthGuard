import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/login.service';
import { ScoreFinancieroService } from '../../../services/score-financiero.service';
import { RecomendacionService } from '../../../services/recomendaciones.service';
import { Header } from '../../layout/header/header';
import { MenuLateral } from '../../layout/menu-lateral/menu-lateral';
import { RecomendacionResponseDTO } from '../../../models/recomendacion.model';

@Component({
  selector: 'app-recomendaciones',
  standalone: true,
  imports: [Header, MenuLateral, CommonModule],
  templateUrl: './recomendaciones.html',
  styleUrl: './recomendaciones.css',
})
export class RecomendacionesComponent implements OnInit {

  private idUsuario: number | null = null;

  recomendaciones: RecomendacionResponseDTO[] = [];
  seleccionadas = new Set<number>();
  cargando = true;

  mostrarPopup = false;
  recomendacionActual: RecomendacionResponseDTO | null = null;

  constructor(
    private loginService: LoginService,
    private scoreFinancieroService: ScoreFinancieroService,
    private recomendacionService: RecomendacionService,
    private cdr: ChangeDetectorRef
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
        this.recomendacionService.generar(this.idUsuario!, resultado.score).subscribe({
          next: (data) => {
            this.recomendaciones = data;
            this.cargando = false;
            if (data.length > 0) {
              this.recomendacionActual = data[0];
              this.mostrarPopup = true;
            }
            this.cdr.markForCheck();
          },
          error: () => {
            this.cargando = false;
            this.cdr.markForCheck();
          },
        });
      },
      error: () => {
        this.cargarRecomendaciones();
      }
    });
  }

  cargarRecomendaciones(): void {
    this.cargando = true;
    this.recomendacionService.obtenerPorUsuario(this.idUsuario!).subscribe({
      next: (data) => {
        this.recomendaciones = data;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }

  cerrarPopup(): void {
    this.mostrarPopup = false;
  }

  esActual(r: RecomendacionResponseDTO): boolean {
    return this.recomendaciones.length > 0
      && r.idRecomendacion === this.recomendaciones[0].idRecomendacion;
  }

  private esActualId(id: number): boolean {
    return this.recomendaciones.length > 0
      && this.recomendaciones[0].idRecomendacion === id;
  }

  toggleSeleccion(id: number): void {
    if (this.esActualId(id)) return;
    if (this.seleccionadas.has(id)) {
      this.seleccionadas.delete(id);
    } else {
      this.seleccionadas.add(id);
    }
    this.seleccionadas = new Set(this.seleccionadas);
  }

  eliminarUna(id: number): void {
    if (this.esActualId(id)) return;
    this.recomendacionService.eliminar(id).subscribe({
      next: (ok) => {
        if (ok) {
          this.recomendaciones = this.recomendaciones.filter(r => r.idRecomendacion !== id);
          this.seleccionadas.delete(id);
          this.seleccionadas = new Set(this.seleccionadas);
        }
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error al eliminar recomendación', err),
    });
  }

  eliminarSeleccionadas(): void {
    const idActual = this.recomendaciones[0]?.idRecomendacion;
    const ids = Array.from(this.seleccionadas).filter(id => id !== idActual);

    if (ids.length === 0) return;

    let pendientes = ids.length;
    ids.forEach((id) => {
      this.recomendacionService.eliminar(id).subscribe({
        next: () => {
          pendientes--;
          if (pendientes === 0) {
            this.seleccionadas.clear();
            this.cargarRecomendaciones();
          }
        },
        error: (err) => {
          console.error('Error al eliminar recomendación', err);
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
  if (inicio >= 600) return 'alto';   
  if (inicio >= 200) return 'medio';  
  return 'bajo';                       
}
}