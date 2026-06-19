import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from '../../layout/header/header';
import { MenuLateral } from '../../layout/menu-lateral/menu-lateral';
import { UsuarioRequest, UsuarioResponse } from '../../../models/usuario.model';
import { LoginService } from '../../../services/login.service';
import { UsuarioService } from '../../../services/usuario.service';
import { FotoPerfilService } from '../../../services/foto-perfil.service';
import { UiAlertsService } from '../../../services/ui-alerts.service';

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
  private readonly loginService = inject(LoginService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly fotoPerfilService = inject(FotoPerfilService);
  private readonly uiAlertsService = inject(UiAlertsService);

  idUsuario: number | null = null;

  cargandoPerfil: boolean = false;
  guardandoPerfil: boolean = false;
  actualizandoPassword: boolean = false;

  mostrarPopupEditarPerfil: boolean = false;
  mostrarPopupPassword: boolean = false;

  mensajeExito: string = '';
  mensajeError: string = '';
  mensajeErrorPassword: string = '';
  mensajeErrorEditarPerfil: string = '';

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

  nickRepetidoEditar: boolean = false;
  emailRepetidoEditar: boolean = false;

  passwordAntigua: string = '';
  passwordNueva: string = '';
  confirmarPasswordNueva: string = '';
  mostrarPasswordAntigua: boolean = false;
  mostrarNuevaPassword: boolean = false;
  mostrarConfirmarPassword: boolean = false;
  mostrarPasswordEditar: boolean = false;
  formularioPasswordEnviado: boolean = false;

  get nuevaPasswordTieneMinCaracteres() { return this.passwordNueva.length >= 6; }
  get nuevaPasswordTieneMayuscula() { return /[A-Z]/.test(this.passwordNueva); }
  get nuevaPasswordTieneMinuscula() { return /[a-z]/.test(this.passwordNueva); }
  get nuevaPasswordTieneNumero() { return /[0-9]/.test(this.passwordNueva); }
  get nuevasPasswordsCoinciden() { return this.passwordNueva === this.confirmarPasswordNueva; }
  get nuevaPasswordValida() {
    return this.nuevaPasswordTieneMinCaracteres &&
      this.nuevaPasswordTieneMayuscula &&
      this.nuevaPasswordTieneMinuscula &&
      this.nuevaPasswordTieneNumero;
  }

  togglePasswordAntigua(): void { this.mostrarPasswordAntigua = !this.mostrarPasswordAntigua; }
  toggleNuevaPassword(): void { this.mostrarNuevaPassword = !this.mostrarNuevaPassword; }
  toggleConfirmarPassword(): void { this.mostrarConfirmarPassword = !this.mostrarConfirmarPassword; }
  togglePasswordEditar(): void { this.mostrarPasswordEditar = !this.mostrarPasswordEditar; }

  onNickEditarChange(): void {
    this.nickRepetidoEditar = false;
    const nick = this.formularioEditar.nickUsuario.trim();
    if (nick.length >= 3 && nick !== this.usuario?.nickUsuario) {
      this.usuarioService.existeNick(nick).subscribe({
        next: (existe) => { this.nickRepetidoEditar = existe; },
        error: () => { }
      });
    }
  }

  onEmailEditarChange(): void {
    this.emailRepetidoEditar = false;
    const email = this.formularioEditar.email.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email !== this.usuario?.email) {
      this.usuarioService.existeEmail(email).subscribe({
        next: (existe) => { this.emailRepetidoEditar = existe; },
        error: () => { }
      });
    }
  }

  ngOnInit(): void {
    this.idUsuario = this.loginService.obtenerIdUsuario();

    if (this.idUsuario === null) {
      this.mensajeError = 'No hay una sesión activa. Inicia sesión nuevamente para ver tu perfil.';
      return;
    }

    this.cargarPerfil();
  }

  cargarPerfil() {
    const idUsuario = this.obtenerIdUsuarioActivo();
    if (idUsuario === null) return;

    this.mensajeError = '';
    this.cargandoPerfil = true;
    this.usuarioService.obtenerPerfil(idUsuario).subscribe({
      next: (data) => {
        this.usuario = data;
        const foto = data.fotoPerfil;
        if (foto) {
          const url = foto.startsWith('http')
            ? foto
            : 'http://localhost:8080/' + foto.replace(/\\/g, '/');
          this.fotoPerfilService.actualizar(url);
        }
        this.cargandoPerfil = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensajeError = 'No se pudo cargar el perfil. Inicia sesión nuevamente para ver tu perfil.';
        this.cargandoPerfil = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirEditarPerfil() {
    if (!this.usuario) {
      this.mensajeError = 'No hay datos de perfil cargados todavía.';
      return;
    }

    this.limpiarMensajes();
    this.mensajeErrorEditarPerfil = '';
    this.mostrarPasswordEditar = false;
    this.nickRepetidoEditar = false;
    this.emailRepetidoEditar = false;
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
    this.mensajeErrorEditarPerfil = '';
    this.mostrarPasswordEditar = false;
    this.nickRepetidoEditar = false;
    this.emailRepetidoEditar = false;
    this.mostrarPopupEditarPerfil = false;
  }

  guardarPerfil() {
    if (!this.formularioEditar.email || !this.formularioEditar.nombre || !this.formularioEditar.nickUsuario) {
      this.mensajeErrorEditarPerfil = 'Nombre, usuario y email son obligatorios.';
      return;
    }

    if (this.nickRepetidoEditar) {
      this.mensajeErrorEditarPerfil = 'El nombre de usuario ya está en uso.';
      return;
    }

    if (this.emailRepetidoEditar) {
      this.mensajeErrorEditarPerfil = 'El correo electrónico ya está en uso.';
      return;
    }

    if (!this.formularioEditar.password || this.formularioEditar.password.trim() === '') {
      this.mensajeErrorEditarPerfil = 'Debes introducir tu contraseña para guardar los cambios.';
      return;
    }

    const idUsuario = this.obtenerIdUsuarioActivo();
    if (idUsuario === null) return;

    this.guardandoPerfil = true;
    this.mensajeErrorEditarPerfil = '';
    this.usuarioService.actualizarUsuario(idUsuario, this.formularioEditar).subscribe({
      next: (data) => {
        this.usuario = data;
        this.guardandoPerfil = false;
        this.mostrarPopupEditarPerfil = false;
        this.mensajeExito = 'Perfil actualizado correctamente.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.guardandoPerfil = false;
        if (err.status === 400) {
          this.mensajeErrorEditarPerfil = 'La contraseña introducida es incorrecta.';
        } else {
          this.mensajeErrorEditarPerfil = 'No se pudo actualizar el perfil.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  abrirCambiarPassword() {
    this.limpiarMensajes();
    this.mensajeErrorPassword = '';
    this.passwordAntigua = '';
    this.passwordNueva = '';
    this.confirmarPasswordNueva = '';
    this.mostrarPasswordAntigua = false;
    this.mostrarNuevaPassword = false;
    this.mostrarConfirmarPassword = false;
    this.formularioPasswordEnviado = false;
    this.mostrarPopupPassword = true;
  }

  cerrarCambiarPassword() {
    this.mostrarPopupPassword = false;
  }

  guardarPassword() {
    this.formularioPasswordEnviado = true;
    this.mensajeErrorPassword = '';

    if (!this.passwordAntigua) {
      this.mensajeErrorPassword = 'Debes introducir tu contraseña actual.';
      return;
    }

    if (!this.nuevaPasswordValida || !this.nuevasPasswordsCoinciden) {
      this.mensajeError = 'La nueva contraseña no cumple los requisitos o no coincide.';
      return;
    }

    const idUsuario = this.obtenerIdUsuarioActivo();
    if (idUsuario === null) return;

    this.actualizandoPassword = true;
    this.usuarioService.cambiarPassword(idUsuario, this.passwordAntigua, this.passwordNueva).subscribe({
      next: (ok) => {
        this.actualizandoPassword = false;
        if (ok) {
          this.mostrarPopupPassword = false;
          this.mensajeExito = 'Contraseña actualizada correctamente.';
          this.cdr.detectChanges();
          return;
        }
        this.mensajeErrorPassword = 'No se pudo actualizar la contraseña.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.actualizandoPassword = false;
        if (err.status === 400 || err.status === 401) {
          this.mensajeErrorPassword = 'La contraseña actual es incorrecta.';
        } else {
          this.mensajeErrorPassword = 'No se pudo actualizar la contraseña.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  subirFoto(event: Event) {
    const idUsuario = this.obtenerIdUsuarioActivo();
    if (idUsuario === null) return;

    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) return;

    this.usuarioService.actualizarFotoPerfil(idUsuario, archivo).subscribe({
      next: (url) => {
        const urlLimpia = url.startsWith('http')
          ? url
          : 'http://localhost:8080/' + url.replace(/\\/g, '/');
        const urlConTimestamp = urlLimpia + '?t=' + Date.now();
        if (this.usuario) {
          this.usuario.fotoPerfil = urlConTimestamp;
        }
        this.fotoPerfilService.actualizar(urlConTimestamp);
        this.mensajeExito = 'Foto de perfil actualizada.';
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensajeError = 'No se pudo actualizar la foto de perfil.';
        this.cdr.detectChanges();
      }
    });
  }

  async eliminarCuenta() {
    if (this.cargandoPerfil || !this.usuario) return;

    const confirmado = await this.uiAlertsService.confirm({
      title: '¿Eliminar tu cuenta?',
      message: 'Esta acción es irreversible. Se eliminarán tu perfil, tus presupuestos y tus movimientos registrados.',
      confirmText: 'Sí, eliminar cuenta',
      cancelText: 'Cancelar',
      severity: 'danger'
    });

    if (!confirmado) return;

    const idUsuario = this.obtenerIdUsuarioActivo();
    if (idUsuario === null) return;

    this.limpiarMensajes();
    this.usuarioService.eliminarCuenta(idUsuario).subscribe({
      next: async (eliminado) => {
        if (eliminado) {
          this.usuario = null;
          this.mensajeExito = 'Cuenta eliminada correctamente.';
          this.cdr.detectChanges();
          return;
        }
        await this.uiAlertsService.alert({
          title: 'No se pudo eliminar',
          message: 'No se pudo eliminar la cuenta. Inténtalo de nuevo.',
          severity: 'danger'
        });
      },
      error: async () => {
        await this.uiAlertsService.alert({
          title: 'Error al eliminar',
          message: 'Se produjo un problema al intentar eliminar la cuenta.',
          severity: 'danger'
        });
      }
    });
  }

  exportarDatosPerfil() {
    if (!this.usuario) return;

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
    if (!this.usuario) return '';
    return [this.usuario.nombre, this.usuario.primerApellido, this.usuario.segundoApellido]
      .filter(Boolean)
      .join(' ');
  }

  obtenerFotoPerfil(): string {
    const foto = this.usuario?.fotoPerfil;
    if (!foto) return '/usuario.png';
    if (foto.startsWith('http')) return foto;
    return 'http://localhost:8080/' + foto.replace(/\\/g, '/');
  }

  formatearFechaRegistro(): string {
    if (!this.usuario?.fechaRegistro) return 'UNIDO EN -';
    const fecha = new Date(this.usuario.fechaRegistro);
    const mes = fecha.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '');
    return `UNIDO EN ${mes} ${fecha.getFullYear()}`;
  }

  formatearFechaPassword(): string {
    const fecha = this.usuario?.fechaUltimoCambioPassword;
    if (!fecha) return 'Nunca actualizada';

    const ahora = new Date();
    const fechaActualizacion = new Date(fecha);
    const diffMs = ahora.getTime() - fechaActualizacion.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDias === 0) return 'Actualizada hoy';
    if (diffDias === 1) return 'Actualizada ayer';
    if (diffDias < 7) return `Actualizada hace ${diffDias} días`;

    const diffSemanas = Math.floor(diffDias / 7);
    if (diffSemanas < 4) return `Actualizada hace ${diffSemanas} semana${diffSemanas > 1 ? 's' : ''}`;

    const diffMeses = Math.floor(diffDias / 30);
    if (diffMeses < 12) return `Actualizada hace ${diffMeses} mes${diffMeses > 1 ? 'es' : ''}`;

    const diffAnios = Math.floor(diffDias / 365);
    return `Actualizada hace ${diffAnios} año${diffAnios > 1 ? 's' : ''}`;
  }

  private limpiarMensajes() {
    this.mensajeExito = '';
    this.mensajeError = '';
  }

  private obtenerIdUsuarioActivo(): number | null {
    if (this.idUsuario !== null) return this.idUsuario;

    this.idUsuario = this.loginService.obtenerIdUsuario();
    if (this.idUsuario === null) {
      this.mensajeError = 'No hay una sesión activa. Inicia sesión nuevamente para continuar.';
      this.cdr.detectChanges();
      return null;
    }

    return this.idUsuario;
  }
}