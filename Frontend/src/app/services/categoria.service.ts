import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaResponse } from '../models/categoria.model';
import { API_BASE, NICK_USUARIO_PARAM, PASS_USUARIO_PARAM } from '../shared/constants/api-urls';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = `${API_BASE}/categorias`;

  constructor(private http: HttpClient, private utils: UtilsService) { }

  obtenerCategorias(): Observable<CategoriaResponse[]> {
    const nick = this.utils.obtenerNickUsuario();
    const pass = this.utils.obtenerContrasena();
    let params = new HttpParams();
    if (nick) params = params.set(NICK_USUARIO_PARAM, nick);
    if (pass) params = params.set(PASS_USUARIO_PARAM, pass);
    return this.http.get<CategoriaResponse[]>(`${this.apiUrl}/listar`, { params });
  }
}