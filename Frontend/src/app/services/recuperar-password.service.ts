import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE } from '../shared/constants/api-urls';

@Injectable({ providedIn: 'root' })
export class RecuperarPasswordService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${API_BASE}/usuarios`;

    obtenerPregunta(usuario: string): Observable<{ pregunta: string }> {
        return this.http.get<{ pregunta: string }>(`${this.apiUrl}/pregunta-seguridad`, {
            params: { usuario }
        });
    }

    verificarRespuesta(usuario: string, respuesta: string): Observable<boolean> {
        return this.http.post<boolean>(`${this.apiUrl}/verificar-respuesta`, { usuario, respuesta });
    }

    resetearPassword(usuario: string, respuesta: string, passwordNueva: string): Observable<boolean> {
        return this.http.put<boolean>(`${this.apiUrl}/resetear-password`, { usuario, respuesta, passwordNueva });
    }
}