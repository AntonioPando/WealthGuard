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
  formularioEnviado: boolean = false;

  private apiUrl = 'http://localhost:8080/usuarios/crear';
  private apiCheckNick = 'http://localhost:8080/usuarios/existe-nick';

  private regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  constructor(private http: HttpClient, private router: Router) {}


  get nickValido(): boolean {
    return this.nickUsuario.trim().length >= 3;
  }

  get nombreValido(): boolean {
    return this.nombre.trim().length > 0;
  }

  get apellidoValido(): boolean {
    return this.primerApellido.trim().length > 0;
  }

  get emailValido(): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(this.email);
  }

  get passwordValida(): boolean {
    return this.regexPassword.test(this.password);
  }

  get passwordsCoinciden(): boolean {
    return this.password === this.confirmarPassword && this.confirmarPassword.length > 0;
  }

  get preguntaValida(): boolean {
    return this.preguntaSeguridad.trim().length > 0;
  }

  get respuestaValida(): boolean {
    return this.respuestaSeguridad.trim().length > 0;
  }

  get formularioValido(): boolean {
    return this.nickValido &&
           this.nombreValido &&
           this.apellidoValido &&
           this.emailValido &&
           this.passwordValida &&
           this.passwordsCoinciden &&
           this.preguntaValida &&
           this.respuestaValida;
  }


  get tieneMinCaracteres(): boolean {
    return this.password.length >= 6;
  }

  get tieneMayuscula(): boolean {
    return /[A-Z]/.test(this.password);
  }

  get tieneMinuscula(): boolean {
    return /[a-z]/.test(this.password);
  }

  get tieneNumero(): boolean {
    return /\d/.test(this.password);
  }


  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onIrAlLogin(): void {
    this.router.navigate(['/login']);
  }

  onSubmit(): void {
    this.formularioEnviado = true;
    this.errorMensaje = '';
    this.exitoMensaje = '';

    if (!this.formularioValido) return;

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
        setTimeout(() => this.router.navigate(['/login']), 2000);
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