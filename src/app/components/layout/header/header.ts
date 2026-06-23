import { Component, OnInit, OnDestroy, HostListener, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin, Subscription, timer } from 'rxjs';
import { LoginService } from '../../../services/login.service';
import { UsuarioService } from '../../../services/usuario.service';
import { FotoPerfilService } from '../../../services/foto-perfil.service';
import { ScoreFinancieroService } from '../../../services/score-financiero.service';
import { TransaccionService } from '../../../services/transaccion.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  private readonly loginService = inject(LoginService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly fotoPerfilService = inject(FotoPerfilService);
  private readonly scoreFinancieroService = inject(ScoreFinancieroService);
  private readonly transaccionService = inject(TransaccionService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  fotoPerfil: string = '/usuario.png';
  nombreUsuario: string = '';
  emailUsuario: string = '';
  menuAbierto: boolean = false;
  score: number | null = null;
  saldo: number | null = null;

  get scoreClass(): string {
    const s = this.score;
    if (s === null || s === undefined) return '';
    if (s < 200) return 'score-rojo';
    if (s >= 200 && s < 400) return 'score-naranja';
    if (s >= 400 && s < 600) return 'score-amarillo';
    if (s >= 600 && s < 900) return 'score-verde';
    return 'score-dorado';
  }

  get saldoClass(): string {
    if (this.saldo === null || this.saldo === undefined) return '';
    return this.saldo < 0 ? 'saldo-negativo' : '';
  }

  private subFoto: Subscription | null = null;
  private subFinanzas: Subscription | null = null;

  @HostListener('document:click')
  onDocumentClick(): void {
    this.menuAbierto = false;
  }

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  cerrarSesion(): void {
    this.loginService.cerrarSesion();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.subFoto = this.fotoPerfilService.foto$.subscribe(url => {
      this.fotoPerfil = url;
      this.cdr.detectChanges();
    });

    const idUsuario = this.loginService.obtenerIdUsuario();
    if (idUsuario === null) return;

    this.subFinanzas = timer(0, 4000).subscribe(() => {
      this.cargarDatosFinancieros(idUsuario);
    });

    this.usuarioService.obtenerPerfil(idUsuario).subscribe({
      next: (usuario) => {
        this.nombreUsuario = usuario.nickUsuario;
        this.emailUsuario = usuario.email;

        const foto = usuario.fotoPerfil;
        if (foto) {
          const url = foto.startsWith('http')
            ? foto
            : 'http://localhost:8080/' + foto.replace(/\\/g, '/');
          this.fotoPerfilService.actualizar(url);
        }

        this.cdr.detectChanges();
      },
      error: () => { }
    });
  }

  private cargarDatosFinancieros(idUsuario: number): void {
    forkJoin({
      txs: this.transaccionService.listarTransacciones(idUsuario),
      resultadoScore: this.scoreFinancieroService.obtenerScoreMensual(idUsuario)
    }).subscribe({
      next: ({ txs, resultadoScore }) => {
        let total = 0;
        for (const t of txs || []) {
          if (t.tipoTransaccion) total += Number(t.cantidad ?? 0);
          else total -= Number(t.cantidad ?? 0);
        }
        this.saldo = total;

        this.score = resultadoScore?.score ?? null;
        this.cdr.detectChanges();
      },
      error: () => {
        this.saldo = null;
        this.score = null;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.subFoto?.unsubscribe();
    this.subFinanzas?.unsubscribe();
  }
}