import { Component, OnInit, OnDestroy, HostListener, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoginService } from '../../../services/login.service';
import { UsuarioService } from '../../../services/usuario.service';
import { FotoPerfilService } from '../../../services/foto-perfil.service';

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
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  fotoPerfil: string = '/usuario.png';
  nombreUsuario: string = '';
  emailUsuario: string = '';
  menuAbierto: boolean = false;

  private sub: Subscription | null = null;

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
    this.sub = this.fotoPerfilService.foto$.subscribe(url => {
      this.fotoPerfil = url;
      this.cdr.detectChanges();
    });

    const idUsuario = this.loginService.obtenerIdUsuario();
    if (idUsuario === null) return;

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

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}