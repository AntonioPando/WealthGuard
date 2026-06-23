import { HttpInterceptorFn } from '@angular/common/http';
import { NICK_USUARIO_PARAM, PASS_USUARIO_PARAM } from '../shared/constants/api-urls';

function obtenerNickUsuario(): string | null {
  const data = localStorage.getItem('usuario_actual') ?? sessionStorage.getItem('usuario_actual');
  if (!data) return null;
  try { return JSON.parse(data).nickUsuario ?? null; } catch { return null; }
}

function obtenerContrasena(): string | null {
  return localStorage.getItem('auth_contrasena') ?? sessionStorage.getItem('auth_contrasena');
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const nick = obtenerNickUsuario();
  const pass = obtenerContrasena();

  if (!nick || !pass) {
    return next(req);
  }

  return next(req.clone({
    params: req.params.set(NICK_USUARIO_PARAM, nick).set(PASS_USUARIO_PARAM, pass)
  }));
};
