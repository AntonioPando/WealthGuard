package wealthguard.service;

import wealthguard.dto.ObjetivoRequestDTO;
import wealthguard.dto.ObjetivoResponseDTO;

public interface IObjetivoService {

    /**
     * Crea un nuevo objetivo financiero para el usuario especificado. El
     * objetivo se asocia a una categoría específica y tiene un monto objetivo,
     * fecha de inicio y fecha de fin.
     *
     * @param objetivoRequestDTO Objeto que contiene los datos necesarios para crear
     *                           el objetivo, incluyendo el ID del usuario, monto
     *                           objetivo, fecha de inicio y fecha de fin.
     * @param nickUsuario        Nick del usuario autenticado
     * @param contrasena     Contraseña del usuario autenticado
     * @return El objeto ObjetivoResponseDTO con los datos del objetivo creado,
     *         incluyendo su ID generado.
     */
    public ObjetivoResponseDTO crearObjetivo(ObjetivoRequestDTO objetivoRequestDTO, String nickUsuario,
            String contrasena) throws Exception;

    /**
     * Elimina un objetivo financiero existente por su ID. Solo se puede
     * eliminar un objetivo que pertenezca al usuario especificado.
     *
     * @param idObjetivo     ID del objetivo a eliminar
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return true si la eliminación fue exitosa, false si no se encontró el
     *         objetivo o no pertenece al usuario
     */
    public boolean eliminarObjetivo(Integer idObjetivo, String nickUsuario, String contrasena) throws Exception;

    /**
     * Edita un objetivo financiero existente. Solo se puede editar un objetivo
     * que pertenezca al usuario especificado. Se pueden actualizar todos los
     * campos del objetivo, monto, fechas.
     *
     * @param idObjetivo         ID del objetivo a editar
     * @param objetivoRequestDTO Objeto que contiene los datos actualizados del
     *                           objetivo
     * @param nickUsuario        Nick del usuario autenticado
     * @param contrasena     Contraseña del usuario autenticado
     * @return El objeto ObjetivoResponseDTO con los datos actualizados
     */
    public ObjetivoResponseDTO editarObjetivo(int idObjetivo, ObjetivoRequestDTO objetivoRequestDTO,
            String nickUsuario, String contrasena) throws Exception;

    /**
     * Obtiene el objetivo financiero activo del usuario especificado.
     *
     * @param idUsuario      ID del usuario
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return El objeto ObjetivoResponseDTO con los datos del objetivo activo
     */
    public ObjetivoResponseDTO obtenerObjetivo(Integer idUsuario, String nickUsuario, String contrasena) throws Exception;

    /**
     * Obtiene el último objetivo financiero ya caducado del usuario especificado.
     *
     * @param idUsuario      ID del usuario
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return El objeto ObjetivoResponseDTO con los datos del último objetivo
     */
     ObjetivoResponseDTO obtenerUltimoObjetivo(Integer idUsuario, String nickUsuario, String contrasena) throws Exception;
}