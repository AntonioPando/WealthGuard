import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  preguntaSeguridad: string = '';
  respuestaSeguridad: string = '';

  formularioEnviado: boolean = false;
  cargando: boolean = false;
  errorMensaje: string = '';
  exitoMensaje: string = '';

  constructor(private router: Router) { }

  get nickValido() { return this.nickUsuario.trim().length >= 3; }
  get nombreValido() { return this.nombre.trim().length > 0; }
  get apellidoValido() { return this.primerApellido.trim().length > 0; }
  get emailValido() { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email); }
  get preguntaValida() { return this.preguntaSeguridad !== ''; }
  get respuestaValida() { return this.respuestaSeguridad.trim().length > 0; }

  get tieneMinCaracteres() { return this.password.length >= 6; }
  get tieneMayuscula() { return /[A-Z]/.test(this.password); }
  get tieneMinuscula() { return /[a-z]/.test(this.password); }
  get tieneNumero() { return /[0-9]/.test(this.password); }
  get passwordsCoinciden() { return this.password === this.confirmarPassword; }

  irAlPaso2(): void {
    this.formularioEnviado = true;
    if (!this.nickValido || !this.nombreValido || !this.apellidoValido || !this.emailValido) {
      return;
    }
    this.formularioEnviado = false;
    this.paso = 2;
  }

  irAlPaso1(): void {
    this.paso = 1;
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onSubmit(): void {
    this.formularioEnviado = true;
    this.errorMensaje = '';

    if (!this.preguntaValida || !this.respuestaValida ||
      !this.tieneMinCaracteres || !this.tieneMayuscula ||
      !this.tieneMinuscula || !this.tieneNumero || !this.passwordsCoinciden) {
      return;
    }

    this.cargando = true;
    console.log('Registrando usuario:', this.nickUsuario);
  }

  onIrAlLogin(): void {
    this.router.navigate(['/login']);
  }
}