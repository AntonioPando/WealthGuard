package wealthguard.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import wealthguard.dto.LoginRequestDTO;
import wealthguard.dto.LoginResponseDTO;
import wealthguard.dto.UsuarioRequestDTO;
import wealthguard.dto.UsuarioResponseDTO;
import wealthguard.exception.UsuarioException;

public interface IUsuarioService {

  /**
   * Autentica un usuario por nick o email y contraseña.
   *
   * @param loginRequestDTO Credenciales de acceso
   * @return LoginResponseDTO con datos de sesión
   * @throws UsuarioException si las credenciales no son válidas
   */
  public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) throws UsuarioException;

  /**
   * Crea un nuevo usuario en el sistema.
   *
   * @param usuarioRequestDTO Datos de entrada del usuario
   * @return UsuarioResponseDTO con los datos creados
   * @throws UsuarioException si el nick ya está en uso
   */
  public UsuarioResponseDTO crearUsuario(UsuarioRequestDTO usuarioRequestDTO) throws UsuarioException;

  /**
   * Actualiza los datos del perfil del usuario.
   *
   * @param idUsuario         ID del usuario a actualizar
   * @param usuarioRequestDTO Datos nuevos del usuario
   * @param nickUsuario       Nick del usuario autenticado
   * @param contrasena    Contraseña del usuario autenticado
   * @return UsuarioResponseDTO con los datos actualizados
   * @throws UsuarioException si el usuario no existe, el nick ya está en uso o
   *                          las credenciales no son válidas
   */
  public UsuarioResponseDTO actualizarUsuario(int idUsuario, UsuarioRequestDTO usuarioRequestDTO,
      String nickUsuario, String contrasena) throws UsuarioException;

  /**
   * Elimina de forma permanente la cuenta del usuario y todos sus datos
   * asociados. Operación irreversible.
   *
   * @param idUsuario      ID del usuario a eliminar
   * @param nickUsuario    Nick del usuario autenticado
   * @param contrasena Contraseña del usuario autenticado
   * @return true si la eliminación fue exitosa, false si no se encontró el
   *         usuario
   */
  public boolean eliminarCuenta(int idUsuario, String nickUsuario, String contrasena);

  /**
   * Genera un fichero con todo el historial financiero del usuario para cumplir
   * con el derecho de portabilidad (RGPD).
   *
   * @param idUsuario      ID del usuario
   * @param nickUsuario    Nick del usuario autenticado
   * @param contrasena Contraseña del usuario autenticado
   * @return Array de bytes del fichero generado (PDF o CSV)
   */
  public byte[] exportarDatos(int idUsuario, String nickUsuario, String contrasena);

  /**
   * Cambia la contraseña del usuario siguiendo estos pasos:
   * 1. Verifica que passwordAntigua coincide con la almacenada.
   * 2. Hashea passwordNueva.
   * 3. Actualiza la fecha del último cambio de contraseña.
   *
   * @param idUsuario       ID del usuario
   * @param passwordAntigua Contraseña actual en texto plano
   * @param passwordNueva   Nueva contraseña en texto plano
   * @param nickUsuario     Nick del usuario autenticado
   * @param contrasena  Contraseña del usuario autenticado
   * @return true si el cambio fue exitoso
   * @throws UsuarioException si la contraseña antigua es incorrecta, el usuario
   *                          no existe o las credenciales no son válidas
   */
  public boolean cambiarPassword(int idUsuario, String passwordAntigua, String passwordNueva,
      String nickUsuario, String contrasena) throws UsuarioException;

  /**
   * Obtiene los datos del perfil del usuario autenticado.
   *
   * @param idUsuario      ID del usuario
   * @param nickUsuario    Nick del usuario autenticado
   * @param contrasena Contraseña del usuario autenticado
   * @return UsuarioResponseDTO con todos sus datos, incluida la URL de la foto
   *         de perfil
   */
  public UsuarioResponseDTO obtenerPerfil(int idUsuario, String nickUsuario, String contrasena);

  /**
   * Lista todos los usuarios registrados en el sistema.
   *
   * @param nickUsuario    Nick del usuario autenticado
   * @param contrasena Contraseña del usuario autenticado
   * @return Lista de UsuarioResponseDTO
   */
  public List<UsuarioResponseDTO> listarUsuarios(String nickUsuario, String contrasena);

  /**
   * Actualiza la foto de perfil del usuario.
   * La imagen recibida se almacena en el sistema de archivos o servicio de
   * almacenamiento configurado, y se guarda la URL resultante en el usuario.
   *
   * @param idUsuario      ID del usuario
   * @param imagen         Archivo de imagen recibido (JPG, PNG, etc.)
   * @param nickUsuario    Nick del usuario autenticado
   * @param contrasena Contraseña del usuario autenticado
   * @return URL o ruta donde quedó almacenada la imagen
   * @throws UsuarioException si el usuario no existe o la imagen no es válida
   */
public String actualizarFotoPerfil(int idUsuario, MultipartFile imagen) throws UsuarioException;

  /**
   * Comprueba si un nombre de usuario ya está registrado en el sistema.
   *
   * @param nick Nombre de usuario a verificar
   * @return true si ya existe, false si está disponible
   */
  public boolean existeNick(String nick);

  /**
   * Comprueba si un email ya está registrado en el sistema.
   *
   * @param email Email a verificar
   * @return true si ya existe, false si está disponible
   */
  public boolean existeEmail(String email);

  /**
   * Obtiene la pregunta de seguridad asociada a un usuario.
   *
   * @param usuario Nick o email del usuario
   * @return Pregunta de seguridad asociada al usuario
   * @throws UsuarioException si el usuario no existe o no tiene pregunta de
   *                          seguridad configurada
   */
  String obtenerPreguntaSeguridad(String usuario) throws UsuarioException;

  /**
   * Verifica si la respuesta a la pregunta de seguridad es correcta para un
   * usuario.
   *
   *
   * @param usuario   Nick o email del usuario
   * @param respuesta Respuesta a la pregunta de seguridad
   * @return true si la respuesta es correcta, false si es incorrecta
   * @throws UsuarioException si el usuario no existe o no tiene pregunta de
   *                          seguridad configurada
   */
  boolean verificarRespuestaSeguridad(String usuario, String respuesta) throws UsuarioException;

  /**
   * Resetea la contraseña de un usuario después de verificar la respuesta a su
   * pregunta de seguridad.
   *
   * @param usuario       Nick o email del usuario
   * @param respuesta     Respuesta a la pregunta de seguridad
   * @param passwordNueva Nueva contraseña en texto plano
   * @return true si el reseteo fue exitoso, false si la respuesta es incorrecta
   * @throws UsuarioException si el usuario no existe o no tiene pregunta de
   *                          seguridad configurada
   */
  boolean resetearPassword(String usuario, String respuesta, String passwordNueva) throws UsuarioException;
}