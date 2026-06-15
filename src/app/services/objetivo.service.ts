import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ObjetivoRequest, ObjetivoResponse } from "../models/objetivo.model";

@Injectable({
    providedIn: "root",
})
export class ObjetivoService {

    private apiUrl = 'http://localhost:8080/objetivos';

    constructor(private http: HttpClient) { }

  obtenerMetaActiva(idUsuario: number): Observable<ObjetivoResponse> {
    return this.http.get<ObjetivoResponse>(`${this.apiUrl}/activa/${idUsuario}`);
  }

  crearObjetivo(objetivo: ObjetivoRequest): Observable<ObjetivoResponse> {
    return this.http.post<ObjetivoResponse>(`${this.apiUrl}/crear`, objetivo);
  }

  editarObjetivo(id: number, objetivo: ObjetivoRequest): Observable<ObjetivoResponse> {
    return this.http.put<ObjetivoResponse>(`${this.apiUrl}/editar/${id}`, objetivo);
  }
}