import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, timeout, tap } from 'rxjs';
import { UsuarioResponse } from '../models/usuario.model';
import { LoginResponse, LoginRequest } from '../models/login.model';
import { API_BASE } from '../shared/constants/api-urls';

@Injectable({
	providedIn: 'root'
})
export class LoginService {
	private readonly http = inject(HttpClient);
	private readonly apiUrl = `${API_BASE}/usuarios/login`;

	iniciarSesion(usuario: string, pass: string): Observable<LoginResponse> {
		const payload: LoginRequest = { usuario, pass };
		const storage = sessionStorage;

		localStorage.removeItem('auth_token');
		localStorage.removeItem('id_usuario');
		localStorage.removeItem('usuario_actual');
		sessionStorage.removeItem('auth_token');
		sessionStorage.removeItem('id_usuario');
		sessionStorage.removeItem('usuario_actual');

		return this.http.post<LoginResponse>(this.apiUrl, payload).pipe(
			timeout(5000),
			tap((respuesta) => {
				const token = respuesta.token;
				const idUsuario = respuesta.idUsuario;

				if (token) {
					storage.setItem('auth_token', token);
				}

				if (idUsuario) {
					storage.setItem('id_usuario', String(idUsuario));
				}

				storage.setItem('auth_contrasena', payload.pass);

				const usuarioActual: Partial<UsuarioResponse> = {
					id: respuesta.idUsuario,
					nickUsuario: respuesta.nickUsuario,
					nombre: respuesta.nombre,
					email: respuesta.email,
					esAdmin: respuesta.esAdmin,
					activo: respuesta.activo
				};

				storage.setItem('usuario_actual', JSON.stringify(usuarioActual));
			})
		);
	}

	cerrarSesion(): void {
		localStorage.removeItem('auth_token');
		localStorage.removeItem('id_usuario');
		localStorage.removeItem('usuario_actual');
		localStorage.removeItem('auth_contrasena');
		sessionStorage.removeItem('auth_token');
		sessionStorage.removeItem('id_usuario');
		sessionStorage.removeItem('usuario_actual');
		sessionStorage.removeItem('auth_contrasena');
	}

	obtenerIdUsuario(): number | null {
		const idUsuario = localStorage.getItem('id_usuario') ?? sessionStorage.getItem('id_usuario');

		if (!idUsuario) {
			return null;
		}

		const valor = Number(idUsuario);
		return Number.isNaN(valor) ? null : valor;
	}

	estaAutenticado(): boolean {
		return (
			!!localStorage.getItem('auth_token') ||
			!!localStorage.getItem('id_usuario') ||
			!!sessionStorage.getItem('auth_token') ||
			!!sessionStorage.getItem('id_usuario')
		);
	}
}