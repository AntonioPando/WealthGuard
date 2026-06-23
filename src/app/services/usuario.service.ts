import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioRequest, UsuarioResponse } from '../models/usuario.model';
import { API_BASE, NICK_USUARIO_PARAM, PASS_USUARIO_PARAM } from '../shared/constants/api-urls';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = `${API_BASE}/usuarios`;

  constructor(private http: HttpClient, private utils: UtilsService) { }

  private addAuthParams(params: HttpParams): HttpParams {
    const nick = this.utils.obtenerNickUsuario();
    const pass = this.utils.obtenerContrasena();
    if (nick) params = params.set(NICK_USUARIO_PARAM, nick);
    if (pass) params = params.set(PASS_USUARIO_PARAM, pass);
    return params;
  }

  obtenerPerfil(idUsuario: number): Observable<UsuarioResponse> {
    const params = this.addAuthParams(new HttpParams());
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/perfil/${idUsuario}`, { params });
  }

  actualizarUsuario(idUsuario: number, payload: UsuarioRequest): Observable<UsuarioResponse> {
    const params = this.addAuthParams(new HttpParams());
    return this.http.put<UsuarioResponse>(`${this.apiUrl}/actualizar/${idUsuario}`, payload, { params });
  }

  cambiarPassword(idUsuario: number, passwordAntigua: string, passwordNueva: string): Observable<boolean> {
    let params = new HttpParams()
      .set('passwordAntigua', passwordAntigua)
      .set('passwordNueva', passwordNueva);
    params = this.addAuthParams(params);
    return this.http.put<boolean>(`${this.apiUrl}/cambiar-password/${idUsuario}`, null, { params });
  }

  actualizarFotoPerfil(idUsuario: number, archivo: File): Observable<string> {
    const formData = new FormData();
    formData.append('imagen', archivo, archivo.name);
    return this.http.put(`${this.apiUrl}/foto-perfil/${idUsuario}`, formData, {
      responseType: 'text'
    });
  }

  eliminarCuenta(idUsuario: number): Observable<boolean> {
    const params = this.addAuthParams(new HttpParams());
    return this.http.delete<boolean>(`${this.apiUrl}/eliminar/${idUsuario}`, { params });
  }

  existeNick(nick: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/existe-nick`, { params: { nick } });
  }

  existeEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/existe-email`, { params: { email } });
  }
}
