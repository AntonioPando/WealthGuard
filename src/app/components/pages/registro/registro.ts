import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { RegistroService } from '../../../services/registro.service';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css'],
})
export class Registro {

  paso: number = 1;

  nickUsuario: string = '';
  nombre: string = '';
  primerApellido: string = '';
  segundoApellido: string = '';
  email: string = '';

  password: string = '';
  confirmarPassword: string = '';
  mostrarPassword: boolean = false;
  mostrarConfirmarPassword: boolean = false;
  preguntaSeguridad: string = '';
  respuestaSeguridad: string = '';

  archivoFoto: File | null = null;
  previsualizacionFoto: string | null = null;
  nombreArchivoFoto: string = '';

  formularioEnviado: boolean = false;
  cargando: boolean = false;
  errorMensaje: string = '';
  exitoMensaje: string = '';

  nickRepetido: boolean = false;
  emailRepetido: boolean = false;

  constructor(
    private router: Router,
    private registroService: RegistroService,
    private utilsService: UtilsService
  ) { }

  get nickValido() { return this.nickUsuario.trim().length >= 3 && !this.nickRepetido; }
  get nombreValido() { return this.nombre.trim().length > 0; }
  get apellidoValido() { return this.primerApellido.trim().length > 0; }
  get emailValido() { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email) && !this.emailRepetido; }
  get preguntaValida() { return this.preguntaSeguridad !== ''; }
  get respuestaValida() { return this.respuestaSeguridad.trim().length > 0; }
  get tieneMinCaracteres() { return this.password.length >= 6; }
  get tieneMayuscula() { return /[A-Z]/.test(this.password); }
  get tieneMinuscula() { return /[a-z]/.test(this.password); }
  get tieneNumero() { return /[0-9]/.test(this.password); }
  get passwordsCoinciden() { return this.password === this.confirmarPassword; }

  onNickChange(): void {
    this.nickRepetido = false;
    if (this.nickUsuario.trim().length >= 3) {
      this.registroService.existeNick(this.nickUsuario.trim()).subscribe({
        next: (existe) => { this.nickRepetido = existe; },
        error: () => { }
      });
    }
  }

  onEmailChange(): void {
    this.emailRepetido = false;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.registroService.existeEmail(this.email.trim()).subscribe({
        next: (existe) => { this.emailRepetido = existe; },
        error: () => { }
      });
    }
  }

  seleccionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) return;

    this.archivoFoto = archivo;
    this.nombreArchivoFoto = archivo.name;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.previsualizacionFoto = e.target?.result as string;
    };
    reader.readAsDataURL(archivo);
  }

  irAlPaso2(): void {
    this.formularioEnviado = true;
    if (!this.nickValido || !this.nombreValido || !this.apellidoValido || !this.emailValido) return;
    this.formularioEnviado = false;
    this.errorMensaje = '';
    this.paso = 2;
  }

  irAlPaso1(): void {
    this.paso = 1;
    this.errorMensaje = '';
  }

  togglePassword(): void { this.mostrarPassword = !this.mostrarPassword; }
  toggleConfirmarPassword(): void { this.mostrarConfirmarPassword = !this.mostrarConfirmarPassword; }

  onSubmit(): void {
    this.formularioEnviado = true;
    this.errorMensaje = '';

    if (!this.preguntaValida || !this.respuestaValida ||
      !this.tieneMinCaracteres || !this.tieneMayuscula ||
      !this.tieneMinuscula || !this.tieneNumero || !this.passwordsCoinciden) {
      return;
    }

    this.cargando = true;

    this.registroService.registrar({
      nickUsuario: this.nickUsuario.trim(),
      nombre: this.nombre.trim(),
      primerApellido: this.primerApellido.trim(),
      segundoApellido: this.segundoApellido.trim(),
      email: this.email.trim(),
      password: this.password,
      preguntaSeguridad: this.preguntaSeguridad,
      respuestaSeguridad: this.respuestaSeguridad.trim(),
      fotoPerfil: null
    }, this.archivoFoto).subscribe({
      next: () => {
        this.cargando = false;
        this.exitoMensaje = '¡Cuenta creada correctamente! Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/login']), 1800);
      },
      error: (err: HttpErrorResponse) => {
        this.cargando = false;
        // 400 has its own specific message about nick/email conflict
        if (err.status === 400) {
          this.errorMensaje = 'El nick o el email ya están en uso. Prueba con otros datos.';
        } else {
          this.errorMensaje = this.utilsService.manejarError(err, 'No se pudo crear la cuenta. Inténtalo de nuevo.');
        }
      }
    });
  }

  onIrAlLogin(): void {
    this.router.navigate(['/login']);
  }
}