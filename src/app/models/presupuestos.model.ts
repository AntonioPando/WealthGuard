import { UsuarioResponse } from "./usuario.model";

export interface PresupuestoRequest {
  usuario: { id: number };
  categoria: { id: number };
  limite: number;
  fechaInicio: string;
  fechaFin: string;
}

export interface PresupuestoResponse {
  id: number;
  usuario: UsuarioResponse; 
  categoria: {
    id: number;
    nombre: string;
    icono?: string;
  };
  limite: number;
  fechaInicio: string;
  fechaFin: string;
  gastoActual: number;
  porcentaje: number;
}