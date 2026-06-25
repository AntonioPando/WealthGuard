import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, timeout, tap } from 'rxjs';
import { UsuarioResponse } from '../models/usuario.model';
import { LoginResponse, LoginRequest } from '../models/login.model';

@Injectable({
	providedIn: 'root'
})
export class LoginService {
	private readonly http = inject(HttpClient);
	private readonly apiUrl = 'http://localhost:8080/usuarios/login';

	iniciarSesion(usuario: string, pass: string): Observable<LoginResponse> {
		const payload: LoginRequest = { usuario, pass };

		this.limpiarStorage();

		return this.http.post<LoginResponse>(this.apiUrl, payload).pipe(
			timeout(5000),
			tap((respuesta) => {
				if (respuesta.token) {
					localStorage.setItem('auth_token', respuesta.token);
				}
				if (respuesta.idUsuario) {
					localStorage.setItem('id_usuario', String(respuesta.idUsuario));
				}
				localStorage.setItem('auth_contrasena', pass);
				localStorage.setItem('usuario_actual', JSON.stringify({
					id: respuesta.idUsuario,
					nickUsuario: respuesta.nickUsuario,
					nombre: respuesta.nombre,
					email: respuesta.email,
					esAdmin: respuesta.esAdmin,
					activo: respuesta.activo
				} as Partial<UsuarioResponse>));
			})
		);
	}

	cerrarSesion(): void {
		this.limpiarStorage();
	}

	private limpiarStorage(): void {
		['auth_token', 'id_usuario', 'usuario_actual', 'auth_contrasena'].forEach(key => {
			localStorage.removeItem(key);
			sessionStorage.removeItem(key);
		});
	}

	obtenerIdUsuario(): number | null {
		const idUsuario = localStorage.getItem('id_usuario') ?? sessionStorage.getItem('id_usuario');
		const valor = Number(idUsuario);
		return idUsuario && !Number.isNaN(valor) ? valor : null;
	}

	estaAutenticado(): boolean {
		return !!localStorage.getItem('id_usuario') || !!sessionStorage.getItem('id_usuario');
	}
}
