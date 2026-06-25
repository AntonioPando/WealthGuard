package wealthguard.service;

import java.util.List;

import wealthguard.dto.RecomendacionResponseDTO;

public interface IRecomendacionService {

    /**
     * Evalúa el score del usuario, busca los tipos de recomendación
     * cuyo rango incluye ese score y crea una recomendación por cada uno.
     *
     * @param idUsuario      ID del usuario
     * @param score          Valor del score financiero actual (0-100)
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return Lista de recomendaciones generadas y persistidas
     */
    List<RecomendacionResponseDTO> generarRecomendaciones(int idUsuario, int score, String nickUsuario,
            String contrasena) throws Exception;

    /**
     * Devuelve todas las recomendaciones registradas para el usuario,
     * de más reciente a más antigua.
     *
     * @param idUsuario      ID del usuario
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return Lista de RecomendacionResponseDTO
     */
    List<RecomendacionResponseDTO> obtenerRecomendaciones(int idUsuario, String nickUsuario, String contrasena) throws Exception;

    /**
     * Elimina una recomendación por su ID.
     *
     * @param idRecomendacion ID de la recomendación
     * @param nickUsuario     Nick del usuario autenticado
     * @param contrasena  Contraseña del usuario autenticado
     * @return true si se eliminó, false si no existía
     */
    boolean eliminarRecomendacion(int idRecomendacion, String nickUsuario, String contrasena) throws Exception;
}