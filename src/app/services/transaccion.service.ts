import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransaccionRequest, TransaccionResponse } from '../models/transaccion.model';
import { Observable } from 'rxjs';
import { API_BASE, NICK_USUARIO_PARAM, PASS_USUARIO_PARAM } from '../shared/constants/api-urls';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class TransaccionService {

  private apiUrl = `${API_BASE}/transacciones`;

  constructor(private http: HttpClient, private utils: UtilsService) { }

  private addAuthParams(params: HttpParams): HttpParams {
    const nick = this.utils.obtenerNickUsuario();
    const pass = this.utils.obtenerContrasena();
    if (nick) params = params.set(NICK_USUARIO_PARAM, nick);
    if (pass) params = params.set(PASS_USUARIO_PARAM, pass);
    return params;
  }

  listarTransaccionesConFiltros(idUsuario: number, filtros?: any): Observable<TransaccionResponse[]> {
    let params = new HttpParams();

    if (filtros) {
      if (filtros.fechaInicio) params = params.set('fechaInicio', filtros.fechaInicio);
      if (filtros.fechaFin) params = params.set('fechaFin', filtros.fechaFin);
      if (filtros.idCategoria) params = params.set('idCategoria', filtros.idCategoria.toString());
      if (filtros.tipo !== undefined) params = params.set('tipo', filtros.tipo.toString());
      if (filtros.cantidad) params = params.set('cantidad', filtros.cantidad.toString());
      if (filtros.descripcion) params = params.set('descripcion', filtros.descripcion);
    }

    params = this.addAuthParams(params);
    return this.http.get<TransaccionResponse[]>(`${this.apiUrl}/listar/${idUsuario}`, { params });
  }

  listarTransacciones(idUsuario: number): Observable<TransaccionResponse[]> {
    const params = this.addAuthParams(new HttpParams());
    return this.http.get<TransaccionResponse[]>(`${this.apiUrl}/listar-todas/${idUsuario}`, { params });
  }

  crearTransaccion(transaccion: TransaccionRequest): Observable<TransaccionResponse> {
    const params = this.addAuthParams(new HttpParams());
    return this.http.post<TransaccionResponse>(`${this.apiUrl}/crear`, transaccion, { params });
  }

  editarTransaccion(id: number, transaccion: TransaccionRequest): Observable<TransaccionResponse> {
    const params = this.addAuthParams(new HttpParams());
    return this.http.put<TransaccionResponse>(`${this.apiUrl}/editar/${id}`, transaccion, { params });
  }

  eliminarTransaccion(id: number): Observable<boolean> {
    const params = this.addAuthParams(new HttpParams());
    return this.http.delete<boolean>(`${this.apiUrl}/eliminar/${id}`, { params });
  }

  obtenerTendencia(idUsuario: number): Observable<number> {
    const params = this.addAuthParams(new HttpParams());
    return this.http.get<number>(`${this.apiUrl}/tendencia/${idUsuario}`, { params });
  }

  obtenerCategoriaPrincipal(idUsuario: number): Observable<string[]> {
    const params = this.addAuthParams(new HttpParams());
    return this.http.get<string[]>(`${this.apiUrl}/categoria-principal/${idUsuario}`, { params });
  }

  obtenerMeta(idUsuario: number): Observable<number[]> {
    const params = this.addAuthParams(new HttpParams());
    return this.http.get<number[]>(`${this.apiUrl}/meta/${idUsuario}`, { params });
  }

}
