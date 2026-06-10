
// Lo que enviamos a los formularios
export interface TransaccionRequest {
    idUsuario: number;
    idCategoria: number;
    cantidad: number;
    descripcion: string;
    fecha: string;
    tipoTransaccion: boolean;
}

// Lo que devuelve el backend
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