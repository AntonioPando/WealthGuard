import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  nickUsuario: string = '';
  nombre: string = '';
  primerApellido: string = '';
  segundoApellido: string = '';
  email: string = '';
  password: string = '';
  confirmarPassword: string = '';
  preguntaSeguridad: string = '';
  respuestaSeguridad: string = '';

  errorMensaje: string = '';
  exitoMensaje: string = '';
  cargando: boolean = false;
  mostrarPassword: boolean = false;

  private apiUrl = 'http://localhost:8080/usuarios/crear';

  constructor(private http: HttpClient, private router: Router) {}

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onIrAlLogin(): void {
    this.router.navigate(['/login']);
  }

  onSubmit(): void {
    this.errorMensaje = '';
    this.exitoMensaje = '';

    if (this.password !== this.confirmarPassword) {
      this.errorMensaje = 'Las contraseñas no coinciden.';
      return;
    }

    this.cargando = true;

    const datos = {
      nickUsuario: this.nickUsuario,
      nombre: this.nombre,
      primerApellido: this.primerApellido,
      segundoApellido: this.segundoApellido,
      email: this.email,
      password: this.password,
      preguntaSeguridad: this.preguntaSeguridad,
      respuestaSeguridad: this.respuestaSeguridad,
      fotoPerfil: null
    };

    this.http.post(this.apiUrl, datos).subscribe({
      next: () => {
        this.cargando = false;
        this.exitoMensaje = '¡Cuenta creada correctamente! Redirigiendo al login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.cargando = false;
        if (err.status === 400) {
          this.errorMensaje = 'El nombre de usuario ya está en uso. Prueba con otro.';
        } else {
          this.errorMensaje = 'Ha ocurrido un error. Inténtalo de nuevo más tarde.';
        }
      }
    });
  }
}