import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecomendacionResponseDTO } from '../models/recomendacion.model';
import { API_BASE, NICK_USUARIO_PARAM, PASS_USUARIO_PARAM } from '../shared/constants/api-urls';
import { UtilsService } from './utils.service';


@Injectable({ providedIn: 'root' })
export class RecomendacionService {
    private readonly http = inject(HttpClient);
    private readonly utils = inject(UtilsService);
    private readonly API = `${API_BASE}/recomendaciones`;

    private addAuthParams(params: HttpParams): HttpParams {
        const nick = this.utils.obtenerNickUsuario();
        const pass = this.utils.obtenerContrasena();
        if (nick) params = params.set(NICK_USUARIO_PARAM, nick);
        if (pass) params = params.set(PASS_USUARIO_PARAM, pass);
        return params;
    }

    generar(idUsuario: number, score: number): Observable<RecomendacionResponseDTO[]> {
        let params = new HttpParams()
            .set('idUsuario', idUsuario.toString())
            .set('score', score.toString());
        params = this.addAuthParams(params);
        return this.http.post<RecomendacionResponseDTO[]>(`${this.API}/generar`, {}, { params });
    }

    obtenerPorUsuario(idUsuario: number): Observable<RecomendacionResponseDTO[]> {
        const params = this.addAuthParams(new HttpParams());
        return this.http.get<RecomendacionResponseDTO[]>(`${this.API}/usuario/${idUsuario}`, { params });
    }

    eliminar(idRecomendacion: number): Observable<boolean> {
        const params = this.addAuthParams(new HttpParams());
        return this.http.delete<boolean>(`${this.API}/${idRecomendacion}`, { params });
    }
}