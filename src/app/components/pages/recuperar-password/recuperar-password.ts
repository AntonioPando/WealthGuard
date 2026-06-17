import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { RecuperarPasswordService } from '../../../services/recuperar-password.service';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './recuperar-password.html',
  styleUrls: ['./recuperar-password.css'],
})
export class RecuperarPassword {
  paso: number = 1;

  usuario: string = '';
  pregunta: string = '';
  respuesta: string = '';

  passwordNueva: string = '';
  confirmarPasswordNueva: string = '';
  mostrarPassword: boolean = false;
  mostrarConfirmarPassword: boolean = false;

  formularioEnviado: boolean = false;
  cargando: boolean = false;
  errorMensaje: string = '';
  exitoMensaje: string = '';

  constructor(
    private router: Router,
    private recuperarPasswordService: RecuperarPasswordService
  ) { }

  get tieneMinCaracteres() {
    return this.passwordNueva.length >= 6;
  }
  get tieneMayuscula() {
    return /[A-Z]/.test(this.passwordNueva);
  }
  get tieneMinuscula() {
    return /[a-z]/.test(this.passwordNueva);
  }

  get tieneNumero() {
    return /[0-9]/.test(this.passwordNueva);
  }
  get passwordsCoinciden() {
    return this.passwordNueva === this.confirmarPasswordNueva;
  }
  get passwordValida() {
    return this.tieneMinCaracteres && this.tieneMayuscula && this.tieneMinuscula && this.tieneNumero;
  }

  buscarPregunta(): void {
    this.errorMensaje = '';
    if (!this.usuario.trim()) {
      this.errorMensaje = 'Introduce tu usuario o correo electrónico.';
      return;
    }
    this.cargando = true;
    this.recuperarPasswordService.obtenerPregunta(this.usuario.trim()).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        this.pregunta = respuesta.pregunta;
        this.paso = 2;
      },
      error: (err: HttpErrorResponse) => {
        this.cargando = false;
        const mensajeBackend = (err.error as { mensaje?: string })?.mensaje;
        this.errorMensaje = mensajeBackend || 'No se ha encontrado ese usuario.';
      }
    });
  }

  comprobarRespuesta(): void {
    this.errorMensaje = '';
    if (!this.respuesta.trim()) {
      this.errorMensaje = 'Debes escribir una respuesta.';
      return;
    }
    this.cargando = true;
    this.recuperarPasswordService.verificarRespuesta(this.usuario.trim(), this.respuesta.trim()).subscribe({
      next: (esCorrecta) => {
        this.cargando = false;
        if (esCorrecta) {
          this.paso = 3;
        } else {
          this.errorMensaje = 'Respuesta incorrecta.';
        }
      },
      error: () => {
        this.cargando = false;
        this.errorMensaje = 'No se pudo comprobar la respuesta. Inténtalo de nuevo.';
      }
    });
  }

  onSubmit(): void {
    this.formularioEnviado = true;
    this.errorMensaje = '';

    if (!this.passwordValida || !this.passwordsCoinciden) {
      return;
    }

    this.cargando = true;
    this.recuperarPasswordService
      .resetearPassword(this.usuario.trim(), this.respuesta.trim(), this.passwordNueva)
      .subscribe({
        next: () => {
          this.cargando = false;
          this.exitoMensaje = 'Contraseña actualizada correctamente. Redirigiendo al login...';
          setTimeout(() => this.router.navigate(['/login']), 1800);
        },
        error: (err: HttpErrorResponse) => {
          this.cargando = false;
          const mensajeBackend = (err.error as { mensaje?: string })?.mensaje;
          this.errorMensaje = mensajeBackend || 'No se pudo actualizar la contraseña.';
          this.paso = 2; // por si la respuesta dejó de ser válida, que la repita
        }
      });
  }

  volverAlPaso1(): void {
    this.paso = 1;
    this.errorMensaje = '';
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }
  toggleConfirmarPassword(): void {
    this.mostrarConfirmarPassword = !this.mostrarConfirmarPassword;
  }
  onVolverAlLogin(): void {
    this.router.navigate(['/login']);
  }
}