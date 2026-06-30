import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ObjetivoRequest, ObjetivoResponse } from "../models/objetivo.model";
import { API_BASE, NICK_USUARIO_PARAM, PASS_USUARIO_PARAM } from '../shared/constants/api-urls';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: "root",
})
export class ObjetivoService {

  private apiUrl = `${API_BASE}/objetivos`;

  constructor(private http: HttpClient, private utils: UtilsService) { }

  private addAuthParams(params: HttpParams): HttpParams {
    const nick = this.utils.obtenerNickUsuario();
    const pass = this.utils.obtenerContrasena();
    if (nick) params = params.set(NICK_USUARIO_PARAM, nick);
    if (pass) params = params.set(PASS_USUARIO_PARAM, pass);
    return params;
  }

  obtenerMetaActiva(idUsuario: number): Observable<ObjetivoResponse> {
    const params = this.addAuthParams(new HttpParams());
    return this.http.get<ObjetivoResponse>(`${this.apiUrl}/activa/${idUsuario}`, { params });
  }

  crearObjetivo(objetivo: ObjetivoRequest): Observable<ObjetivoResponse> {
    const params = this.addAuthParams(new HttpParams());
    return this.http.post<ObjetivoResponse>(`${this.apiUrl}/crear`, objetivo, { params });
  }

  editarObjetivo(id: number, objetivo: ObjetivoRequest): Observable<ObjetivoResponse> {
    const params = this.addAuthParams(new HttpParams());
    return this.http.put<ObjetivoResponse>(`${this.apiUrl}/editar/${id}`, objetivo, { params });
  }

  obtenerMetaPasada(idUsuario: number): Observable<ObjetivoResponse> {
    const params = this.addAuthParams(new HttpParams());
    return this.http.get<ObjetivoResponse>(`${this.apiUrl}/ultimo/${idUsuario}`, { params });
  }
}