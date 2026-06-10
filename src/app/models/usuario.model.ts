export interface UsuarioRequest {
  nickUsuario: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  email: string;
  password: string;
  preguntaSeguridad: string;
  respuestaSeguridad: string;
  fotoPerfil: string | null;
}

export interface UsuarioResponse {
  id: number;
  nickUsuario: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  email: string;
  password?: string;
  preguntaSeguridad: string;
  fotoPerfil: string | null;
  fechaRegistro: string;
  fechaUltimoCambioPassword: string | null;
  esAdmin: boolean;
  activo: boolean;
  cuentaBloqueada: boolean;
}