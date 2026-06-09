import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PresupuestoResponse, PresupuestoRequest } from "../models/presupuestos.model";


@Injectable({
    providedIn: 'root'
})

export class PresupuestosService {

    private apiUrl = 'http://localhost:8080/presupuestos';

    constructor(private http: HttpClient) { }

    listarPresupuestos(idUsuario: number): Observable<PresupuestoResponse[]> {
        return this.http.get<PresupuestoResponse[]>(`${this.apiUrl}/listar/${idUsuario}`);
    }

    crearPresupuesto(presupuesto: PresupuestoRequest): Observable<PresupuestoResponse> {
        return this.http.post<PresupuestoResponse>(`${this.apiUrl}/crear`, presupuesto);
    }

    editarPresupuesto(idPresupuesto: number, idCategoria: number, limite: number, fechaInicio: string, fechaFin: string): Observable<boolean> {
        const params = new HttpParams()
            .set('idCategoria', idCategoria.toString())
            .set('limite', limite.toString())
            .set('fechaInicio', fechaInicio)
            .set('fechaFin', fechaFin);

        return this.http.put<boolean>(`${this.apiUrl}/editar/${idPresupuesto}`, null, { params });
    }

    eliminarPresupuesto(idPresupuesto: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.apiUrl}/eliminar/${idPresupuesto}`);
    }
}
