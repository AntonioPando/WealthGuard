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
  // Obtiene el id del usuario logeado
  obtenerIdUsuario(): number | null {
    const idUsuario = localStorage.getItem('id_usuario') ?? sessionStorage.getItem('id_usuario');

    if (!idUsuario) {
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

  
}
