import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioRequest, UsuarioResponse } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/usuarios';

  constructor(private http: HttpClient) { }

  obtenerPerfil(idUsuario: number): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/perfil/${idUsuario}`);
  }

  actualizarUsuario(idUsuario: number, payload: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(`${this.apiUrl}/actualizar/${idUsuario}`, payload);
  }

  cambiarPassword(idUsuario: number, passwordAntigua: string, passwordNueva: string): Observable<boolean> {
    const params = new HttpParams()
      .set('passwordAntigua', passwordAntigua)
      .set('passwordNueva', passwordNueva);
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
    return this.http.delete<boolean>(`${this.apiUrl}/eliminar/${idUsuario}`);
  }
}