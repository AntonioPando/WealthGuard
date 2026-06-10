import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginService } from '../../../services/login.service';
import { TimeoutError, finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})

export class Login {
  usuario: string = '';
  password: string = '';
  recordar: boolean = false;
  errormensaje: string = '';
  cargando: boolean = false;
  private bloqueoSubmitId: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (this.cargando) {
      return;
    }

    this.errormensaje = '';

    if (!this.usuario || !this.password) {
      this.errormensaje = 'Debes completar usuario y contraseña.';
      return;
    }

    this.cargando = true;

    this.bloqueoSubmitId = setTimeout(() => {
      this.cargando = false;
      this.errormensaje = 'La solicitud tardó demasiado. Revisa backend/CORS e inténtalo de nuevo.';
      this.bloqueoSubmitId = null;
    }, 8000);

    this.loginService
      .iniciarSesion(this.usuario.trim(), this.password, this.recordar)
      .pipe(
        finalize(() => {
          if (this.bloqueoSubmitId) {
            clearTimeout(this.bloqueoSubmitId);
            this.bloqueoSubmitId = null;
          }

          this.cargando = false;
        })
      )
      .subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error: unknown) => {

        if (error instanceof TimeoutError) {
          this.errormensaje = 'El servidor tardó demasiado en responder. Inténtalo de nuevo.';
          return;
        }

        const httpError = error as HttpErrorResponse;

        if (httpError.status === 401) {
          const mensajeBackend = (httpError.error as { mensaje?: string })?.mensaje;
          this.errormensaje = mensajeBackend || 'Usuario o contraseña incorrectos.';
          return;
        }

        if (httpError.status === 404) {
          this.errormensaje = 'No se encontró el endpoint de login en el backend.';
          return;
        }

        if (httpError.status === 0) {
          this.errormensaje = 'No hay conexión con el backend en http://localhost:8080.';
          return;
        }

        this.errormensaje = 'No se pudo iniciar sesión. Inténtalo de nuevo.';
      }
    });
  }

  onOlvideMiPassword(): void {
    this.errormensaje = 'Recuperación de contraseña disponible próximamente.';
  }

  onRegistrarse(): void {
    this.router.navigate(['/registro']);
  }
}