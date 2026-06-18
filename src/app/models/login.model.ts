export interface LoginRequest {
    usuario: string;
    pass: string;
}

export interface LoginResponse {
    mensaje: string;
    token: string;
    idUsuario: number;
    nickUsuario: string;
    nombre: string;
    email: string;
    esAdmin: boolean;
    activo: boolean;
}