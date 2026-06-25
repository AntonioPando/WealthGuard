export interface ObjetivoRequest{
    cantidadObjetivo: number;
    usuarioId: number;
}

export interface ObjetivoResponse{
    id: number;
    usuarioId: number;
    cantidadObjetivo: number;
    fechaInicio: string;
    fechaFin: string;
}