import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecomendacionResponseDTO } from '../models/recomendacion.model';


@Injectable({ providedIn: 'root' })
export class RecomendacionService {
    private readonly http = inject(HttpClient);
    private readonly API = 'http://localhost:8080/api/recomendaciones';

    generar(idUsuario: number, score: number): Observable<RecomendacionResponseDTO[]> {
        return this.http.post<RecomendacionResponseDTO[]>(
            `${this.API}/generar?idUsuario=${idUsuario}&score=${score}`,
            {}
        );
    }

    obtenerPorUsuario(idUsuario: number): Observable<RecomendacionResponseDTO[]> {
        return this.http.get<RecomendacionResponseDTO[]>(`${this.API}/usuario/${idUsuario}`);
    }

    eliminar(idRecomendacion: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.API}/${idRecomendacion}`);
    }
}