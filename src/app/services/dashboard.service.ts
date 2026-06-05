import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Categoria } from '../models/categoria.model';
import to, {headers} from "./utils.service";
import ConstUrls from "../constants/const-urls";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {}

    private CATEGORIA_URL = ConstUrls.API_URL + '/categorias';

    async crearCategoria(categoria: Categoria) {
        return await to(
            this.http
                .post<Categoria>(this.CATEGORIA_URL + '/crear', categoria, {
                    headers: headers,
                    observe: "response",
                })
                .toPromise()
        )
    }
}