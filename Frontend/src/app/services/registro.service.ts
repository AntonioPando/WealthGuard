import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, of } from 'rxjs';
import { API_BASE } from '../shared/constants/api-urls';

export interface RegistroRequest {
  nickUsuario: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  email: string;
  password: string;
  preguntaSeguridad: string;
  respuestaSeguridad: string;
  fotoPerfil: string | null;
}

export interface RegistroResponse {
  id: number;
  nickUsuario: string;
  nombre: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE}/usuarios`;

  registrar(datos: RegistroRequest, foto: File | null = null): Observable<RegistroResponse> {
    return this.http.post<RegistroResponse>(`${this.apiUrl}/crear`, datos).pipe(
      switchMap((usuario) => {
        if (!foto) return of(usuario);

        const formData = new FormData();
        formData.append('imagen', foto, foto.name);

        return this.http
          .put<string>(`${this.apiUrl}/foto-perfil/${usuario.id}`, formData, {
            responseType: 'text' as 'json'
          })
          .pipe(switchMap(() => of(usuario)));
      })
    );
  }

  existeNick(nick: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/existe-nick`, { params: { nick } });
  }

  existeEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/existe-email`, { params: { email } });
  }
}