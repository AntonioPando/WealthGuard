import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransaccionRequest, TransaccionResponse } from '../models/transaccion.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransaccionService {

  private apiUrl = 'http://localhost:8080/transacciones';

  private deFinanzasSub = new Subject<void>();
  readonly alCambiarFinanzas$: Observable<void> = this.deFinanzasSub.asObservable();

  notificarCambio(): void {
    this.deFinanzasSub.next();
  }

  constructor(private http: HttpClient) { }

  // Metodo para listar con filtros dinamicos (ultimos 7 dias)

  listarTransaccionesConFiltros(idUsuario: number, filtros?: any): Observable<TransaccionResponse[]> {
    let params = new HttpParams();

    if (filtros) {
      if (filtros.fechaInicio) {
        params = params.set('fechaInicio', filtros.fechaInicio);
      }
      if (filtros.fechaFin) {
        params = params.set('fechaFin', filtros.fechaFin);
      }
      if (filtros.idCategoria) {
        params = params.set('idCategoria', filtros.idCategoria.toString());
      }
      if (filtros.tipo !== undefined) {
        params = params.set('tipo', filtros.tipo.toString());
      }
      if (filtros.cantidad) {
        params = params.set('cantidad', filtros.cantidad.toString());
      }
      if (filtros.descripcion) {
        params = params.set('descripcion', filtros.descripcion);
      }
    }

    return this.http.get<TransaccionResponse[]>(`${this.apiUrl}/listar/${idUsuario}`, { params });
  }

  // Metodo para listar todas las transacciones de un usuario
  listarTransacciones(idUsuario: number): Observable<TransaccionResponse[]> {
    return this.http.get<TransaccionResponse[]>(`${this.apiUrl}/listar-todas/${idUsuario}`);
  }

  // Metodo para crear una  transaccion
  crearTransaccion(transaccion: TransaccionRequest): Observable<TransaccionResponse> {
    return this.http.post<TransaccionResponse>(`${this.apiUrl}/crear`, transaccion);
  }

  // Metodo para editar una transaccion
  editarTransaccion(id: number, transaccion: TransaccionRequest): Observable<TransaccionResponse> {
    return this.http.put<TransaccionResponse>(`${this.apiUrl}/editar/${id}`, transaccion);
  }

  // Metodo para eliminar una transaccion
  eliminarTransaccion(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/eliminar/${id}`);
  }

  // Metodo para obtener la tendencia de gastos
  obtenerTendencia(idUsuario: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/tendencia/${idUsuario}`);
  }

  // Metodo para obtener la categoria principal
  obtenerCategoriaPrincipal(idUsuario: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categoria-principal/${idUsuario}`);
  }

  // Metodo para obtener Meta / progreso
  obtenerMeta(idUsuario: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/meta/${idUsuario}`);
  }

}