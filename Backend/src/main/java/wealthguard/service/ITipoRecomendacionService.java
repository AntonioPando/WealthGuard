package wealthguard.service;

import java.util.List;

import wealthguard.dto.TipoRecomendacionRequestDTO;
import wealthguard.dto.TipoRecomendacionResponseDTO;

public interface ITipoRecomendacionService {

    /**
     * Crea un nuevo tipo de recomendación.
     *
     * @param dto            Datos del tipo de recomendación a crear
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return El objeto TipoRecomendacionResponseDTO creado
     */
    TipoRecomendacionResponseDTO crearTipoRecomendacion(TipoRecomendacionRequestDTO dto, String nickUsuario,
            String contrasena) throws Exception;

    /**
     * Obtiene un tipo de recomendación por su ID.
     *
     * @param id             ID del tipo de recomendación
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return El objeto TipoRecomendacionResponseDTO encontrado
     */
    TipoRecomendacionResponseDTO obtenerTipoRecomendacionPorId(Integer id, String nickUsuario, String contrasena) throws Exception;

    /**
     * Lista todos los tipos de recomendación registrados.
     *
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return Lista de TipoRecomendacionResponseDTO
     */
    List<TipoRecomendacionResponseDTO> listarTodos(String nickUsuario, String contrasena) throws Exception;

    /**
     * Actualiza un tipo de recomendación existente.
     *
     * @param id             ID del tipo de recomendación a actualizar
     * @param dto            Datos actualizados
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return El objeto TipoRecomendacionResponseDTO actualizado
     */
    TipoRecomendacionResponseDTO actualizarTipoRecomendacion(Integer id, TipoRecomendacionRequestDTO dto,
            String nickUsuario, String contrasena) throws Exception;

    /**
     * Elimina un tipo de recomendación por su ID.
     *
     * @param id             ID del tipo de recomendación a eliminar
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return true si se eliminó, false si no existía
     */
    void eliminarTipoRecomendacion(Integer id, String nickUsuario, String contrasena) throws Exception;
}