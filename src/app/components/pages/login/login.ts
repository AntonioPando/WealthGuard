import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { UtilsService } from '../../../services/utils.service';
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
  mostrarPassword: boolean = false;
  private bloqueoSubmitId: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private utilsService: UtilsService,
  ) { }

  onSubmit(): void {
    if (this.cargando) return;

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
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error: unknown) => {
          if (error instanceof TimeoutError) {
            this.errormensaje = 'El servidor tardó demasiado en responder. Inténtalo de nuevo.';
            this.cdr.detectChanges();
            return;
          }

          // Mensaje personalizado para 401 con mensaje del backend
          const httpError = error as any;
          if (httpError.status === 401) {
            const mensajeBackend = httpError.error?.mensaje;
            this.errormensaje = mensajeBackend || 'Usuario o contraseña incorrectos.';
          } else if (httpError.status === 404) {
            this.errormensaje = 'No se encontró el endpoint de login en el backend.';
          } else {
            this.errormensaje = this.utilsService.manejarError(error, 'No se pudo iniciar sesión. Inténtalo de nuevo.');
          }

          this.cdr.detectChanges();
        }
      });
  }

  onOlvideMiPassword(): void {
    this.router.navigate(['/recuperar-password']);
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onRegistrarse(): void {
    this.router.navigate(['/registro']);
  }
}