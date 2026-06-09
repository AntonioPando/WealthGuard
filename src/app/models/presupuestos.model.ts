export interface PresupuestoRequest {
  usuario: { id: number };
  categoria: { id: number };
  limite: number;
  fechaInicio: string;
  fechaFin: string;
}

export interface PresupuestoResponse {
  id: number;
  usuario: any; 
  categoria: {
    id: number;
    nombre: string;
  };
  limite: number;
  fechaInicio: string;
  fechaFin: string;
  gastoActual: number;
  porcentaje: number;
}