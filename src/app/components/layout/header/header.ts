import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  fotoPerfil: string = '/usuario.png';
  private sub: Subscription | null = null;

  ngOnInit(): void {
    // Suscribirse a cambios de foto
    this.sub = this.fotoPerfilService.foto$.subscribe(url => {
      this.fotoPerfil = url;
    });

    // Cargar la foto inicial desde el backend
    const idUsuario = this.loginService.obtenerIdUsuario();
    if (idUsuario === null) return;

    this.usuarioService.obtenerPerfil(idUsuario).subscribe({
      next: (usuario) => {
        const foto = usuario.fotoPerfil;
        if (!foto) return;
        const url = foto.startsWith('http')
          ? foto
          : 'http://localhost:8080/' + foto.replace(/\\/g, '/');
        this.fotoPerfilService.actualizar(url);
      },
      error: () => { }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}