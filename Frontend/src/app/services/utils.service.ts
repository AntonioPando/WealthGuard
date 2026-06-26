import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private readonly _mesesEspanol = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  obtenerNickUsuario(): string | null {
    const data = localStorage.getItem('usuario_actual') ?? sessionStorage.getItem('usuario_actual');
    if (!data) return null;
    try { return JSON.parse(data).nickUsuario ?? null; } catch { return null; }
  }

  obtenerContrasena(): string | null {
    return localStorage.getItem('auth_contrasena') ?? sessionStorage.getItem('auth_contrasena');
  }

  // Obtiene el id del usuario logeado
  obtenerIdUsuario(): number | null {
    const idUsuario = localStorage.getItem('id_usuario') ?? sessionStorage.getItem('id_usuario');

    if (!idUsuario) {
      console.warn('WealthGuard Alerta: No se encontró un usuario logeado.');
      return null;
    }

    const valor = Number(idUsuario);
    return Number.isNaN(valor) ? null : valor;
  }

  /**
   * Devuelve el nombre del mes actual en español con la primera letra en mayúscula.
   */
  obtenerMesActual(): string {
    try {
      const idx = new Date().getMonth();
      const raw = this._mesesEspanol[idx] ?? '';
      return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : '';
    } catch (e) {
      return '';
    }
  }

  manejarError(err: unknown, mensajeFallback: string): string {
    const httpError = err as HttpErrorResponse;

    if (httpError.status === 0) {
      return 'Sin conexión con el backend en http://localhost:8080.';
    }

    if (httpError.status === 401) {
      return 'Tu sesión ha expirado. Inicia sesión nuevamente.';
    }

    if (httpError.status === 403) {
      return 'No tienes permisos para realizar esta acción.';
    }

    if (httpError.status === 404) {
      return 'El recurso solicitado no existe.';
    }

    return mensajeFallback;
  }

}
