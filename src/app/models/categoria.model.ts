// Lo que enviamos a los formularios
export interface CategoriaRequest {
    nombre: string;
}

// Lo que devuelve el backend
export interface CategoriaResponse {
    id: number;
    nombre: string;
    usuarioId: number;
}

export const categoriaRequestInicial: CategoriaRequest = {
    nombre: ''
};