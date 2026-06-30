import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PresupuestoResponse, PresupuestoRequest } from "../models/presupuestos.model";
import { API_BASE, NICK_USUARIO_PARAM, PASS_USUARIO_PARAM } from '../shared/constants/api-urls';
import { UtilsService } from './utils.service';


@Injectable({
    providedIn: 'root'
})

export class PresupuestosService {

    private apiUrl = `${API_BASE}/presupuestos`;

    constructor(private http: HttpClient, private utils: UtilsService) { }

    private addAuthParams(params: HttpParams): HttpParams {
        const nick = this.utils.obtenerNickUsuario();
        const pass = this.utils.obtenerContrasena();
        if (nick) params = params.set(NICK_USUARIO_PARAM, nick);
        if (pass) params = params.set(PASS_USUARIO_PARAM, pass);
        return params;
    }

    listarPresupuestos(idUsuario: number): Observable<PresupuestoResponse[]> {
        const params = this.addAuthParams(new HttpParams());
        return this.http.get<PresupuestoResponse[]>(`${this.apiUrl}/listar/${idUsuario}`, { params });
    }

    crearPresupuesto(presupuesto: PresupuestoRequest): Observable<PresupuestoResponse> {
        const params = this.addAuthParams(new HttpParams());
        return this.http.post<PresupuestoResponse>(`${this.apiUrl}/crear`, presupuesto, { params });
    }

    editarPresupuesto(idPresupuesto: number, idCategoria: number, limite: number, fechaInicio: string, fechaFin: string): Observable<boolean> {
        let params = new HttpParams()
            .set('idCategoria', idCategoria.toString())
            .set('limite', limite.toString())
            .set('fechaInicio', fechaInicio)
            .set('fechaFin', fechaFin);
        params = this.addAuthParams(params);
        return this.http.put<boolean>(`${this.apiUrl}/editar/${idPresupuesto}`, null, { params });
    }

    eliminarPresupuesto(idPresupuesto: number): Observable<boolean> {
        const params = this.addAuthParams(new HttpParams());
        return this.http.delete<boolean>(`${this.apiUrl}/eliminar/${idPresupuesto}`, { params });
    }
}