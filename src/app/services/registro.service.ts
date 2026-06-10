import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

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
  private readonly apiUrl = 'http://localhost:8080/usuarios/crear';

  registrar(datos: RegistroRequest): Observable<RegistroResponse> {
    return this.http.post<RegistroResponse>(this.apiUrl, datos);
  }
}