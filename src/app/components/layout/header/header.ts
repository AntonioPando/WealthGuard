import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/login.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  private readonly loginService = inject(LoginService);
  private readonly usuarioService = inject(UsuarioService);

  fotoPerfil: string = '/usuario.png';

  ngOnInit(): void {
    const idUsuario = this.loginService.obtenerIdUsuario();
    if (idUsuario === null) return;

    this.usuarioService.obtenerPerfil(idUsuario).subscribe({
      next: (usuario) => {
        const foto = usuario.fotoPerfil;
        if (!foto) {
          this.fotoPerfil = '/usuario.png';
        } else if (foto.startsWith('http')) {
          this.fotoPerfil = foto;
        } else {
          this.fotoPerfil = 'http://localhost:8080/' + foto.replace(/\\/g, '/');
        }
      },
      error: () => {
        this.fotoPerfil = '/usuario.png';
      }
    });
  }
}