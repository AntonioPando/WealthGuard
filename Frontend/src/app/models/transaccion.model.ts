
export interface TransaccionRequest {
    idUsuario: number;
    idCategoria: number;
    cantidad: number;
    descripcion: string;
    fecha: string;
    tipoTransaccion: boolean;
}

export interface TransaccionResponse {
    id: number;
    idUsuario: number;
    idCategoria: number;
    cantidad: number;
    descripcion: string;
    fecha: string;
    tipoTransaccion: boolean;
    nombreCategoria?: string;
}