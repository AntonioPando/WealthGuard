import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from '../../layout/header/header';
import { MenuLateral } from '../../layout/menu-lateral/menu-lateral';
import { UsuarioRequest, UsuarioResponse } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, MenuLateral],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
  encapsulation: ViewEncapsulation.None
})
export class Perfil implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly cdr = inject(ChangeDetectorRef);

  idUsuario: number = 1;

  cargandoPerfil: boolean = false;
  guardandoPerfil: boolean = false;
  actualizandoPassword: boolean = false;

  mostrarPopupEditarPerfil: boolean = false;
  mostrarPopupPassword: boolean = false;

  mensajeExito: string = '';
  mensajeError: string = '';

  usuario: UsuarioResponse | null = null;

  formularioEditar: UsuarioRequest = {
    nickUsuario: '',
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    email: '',
    password: '',
    preguntaSeguridad: '',
    respuestaSeguridad: '',
    fotoPerfil: null
  };

  passwordAntigua: string = '';
  passwordNueva: string = '';

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.mensajeError = '';
    this.cargandoPerfil = true;
    this.usuarioService.obtenerPerfil(this.idUsuario).subscribe({
      next: (data) => {
        this.usuario = data;
        this.cargandoPerfil = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensajeError = 'No se pudo cargar el perfil. Verifica que el backend esté activo en http://localhost:8080.';
        this.cargandoPerfil = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirEditarPerfil() {
    if (!this.usuario) {
      this.mensajeError = 'No hay datos de perfil cargados todavía. Intenta nuevamente cuando el backend esté disponible.';
      return;
    }

    this.limpiarMensajes();
    this.formularioEditar = {
      nickUsuario: this.usuario.nickUsuario,
      nombre: this.usuario.nombre,
      primerApellido: this.usuario.primerApellido,
      segundoApellido: this.usuario.segundoApellido,
      email: this.usuario.email,
      password: '',
      preguntaSeguridad: this.usuario.preguntaSeguridad,
      respuestaSeguridad: '',
      fotoPerfil: this.usuario.fotoPerfil
    };
    this.mostrarPopupEditarPerfil = true;
  }

  cerrarEditarPerfil() {
    this.mostrarPopupEditarPerfil = false;
  }

  guardarPerfil() {
    if (!this.formularioEditar.email || !this.formularioEditar.nombre || !this.formularioEditar.nickUsuario) {
      this.mensajeError = 'Nombre, usuario y email son obligatorios.';
      return;
    }

    this.guardandoPerfil = true;
    this.usuarioService.actualizarUsuario(this.idUsuario, this.formularioEditar).subscribe({
      next: (data) => {
        this.usuario = data;
        this.guardandoPerfil = false;
        this.mostrarPopupEditarPerfil = false;
        this.mensajeExito = 'Perfil actualizado correctamente.';
        this.cdr.detectChanges();
      },
      error: () => {
        this.guardandoPerfil = false;
        this.mensajeError = 'No se pudo actualizar el perfil.';
        this.cdr.detectChanges();
      }
    });
  }

  abrirCambiarPassword() {
    this.limpiarMensajes();
    this.passwordAntigua = '';
    this.passwordNueva = '';
    this.mostrarPopupPassword = true;
  }

  cerrarCambiarPassword() {
    this.mostrarPopupPassword = false;
  }

  guardarPassword() {
    if (!this.passwordAntigua || !this.passwordNueva) {
      this.mensajeError = 'Debes completar ambas contraseñas.';
      return;
    }

    this.actualizandoPassword = true;
    this.usuarioService.cambiarPassword(this.idUsuario, this.passwordAntigua, this.passwordNueva).subscribe({
      next: (ok) => {
        this.actualizandoPassword = false;
        if (ok) {
          this.mostrarPopupPassword = false;
          this.mensajeExito = 'Contraseña actualizada correctamente.';
          this.cdr.detectChanges();
          return;
        }

        this.mensajeError = 'No se pudo actualizar la contraseña.';
        this.cdr.detectChanges();
      },
      error: () => {
        this.actualizandoPassword = false;
        this.mensajeError = 'No se pudo actualizar la contraseña.';
        this.cdr.detectChanges();
      }
    });
  }

  subirFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (!archivo) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const bytes = new Uint8Array(reader.result as ArrayBuffer);
      this.usuarioService.actualizarFotoPerfil(this.idUsuario, Array.from(bytes)).subscribe({
        next: (url) => {
          if (this.usuario) {
            this.usuario.fotoPerfil = url;
          }
          this.mensajeExito = 'Foto de perfil actualizada.';
          this.cdr.detectChanges();
        },
        error: () => {
          this.mensajeError = 'No se pudo actualizar la foto de perfil.';
          this.cdr.detectChanges();
        }
      });
    };

    reader.readAsArrayBuffer(archivo);
  }

  eliminarCuenta() {
    if (!confirm('¿Estás seguro de que deseas eliminar la cuenta? Esta acción es irreversible.')) {
      return;
    }

    this.usuarioService.eliminarCuenta(this.idUsuario).subscribe({
      next: (eliminado) => {
        if (eliminado) {
          this.usuario = null;
          this.mensajeExito = 'Cuenta eliminada correctamente.';
          this.cdr.detectChanges();
          return;
        }

        this.mensajeError = 'No se pudo eliminar la cuenta.';
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensajeError = 'No se pudo eliminar la cuenta.';
        this.cdr.detectChanges();
      }
    });
  }

  exportarDatosPerfil() {
    if (!this.usuario) {
      return;
    }

    const contenido = JSON.stringify(this.usuario, null, 2);
    const blob = new Blob([contenido], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `perfil-usuario-${this.usuario.id}.json`;
    enlace.click();
    URL.revokeObjectURL(url);
  }

  obtenerNombreCompleto(): string {
    if (!this.usuario) {
      return '';
    }

    return [this.usuario.nombre, this.usuario.primerApellido, this.usuario.segundoApellido]
      .filter(Boolean)
      .join(' ');
  }

  formatearFechaRegistro(): string {
    if (!this.usuario?.fechaRegistro) {
      return 'UNIDO EN -';
    }

    const fecha = new Date(this.usuario.fechaRegistro);
    const mes = fecha.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '');
    return `UNIDO EN ${mes} ${fecha.getFullYear()}`;
  }

  private limpiarMensajes() {
    this.mensajeExito = '';
    this.mensajeError = '';
  }
}