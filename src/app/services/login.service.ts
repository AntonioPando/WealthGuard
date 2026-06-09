import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, timeout, tap } from 'rxjs';
import { UsuarioResponse } from '../models/usuario.model';

interface LoginRequest {
	usuario: string;
	pass: string;
}

interface LoginResponse {
	mensaje: string;
	token: string;
	idUsuario: number;
	nickUsuario: string;
	nombre: string;
	email: string;
	esAdmin: boolean;
	activo: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class LoginService {
	private readonly http = inject(HttpClient);
	private readonly apiUrl = 'http://localhost:8080/usuarios/login';

	iniciarSesion(usuario: string, pass: string, recordar: boolean): Observable<LoginResponse> {
		const payload: LoginRequest = { usuario, pass };
		const storage = recordar ? localStorage : sessionStorage;

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
		sessionStorage.removeItem('auth_token');
		sessionStorage.removeItem('id_usuario');
		sessionStorage.removeItem('usuario_actual');
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
