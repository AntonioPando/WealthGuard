package wealthguard.service;

import java.time.LocalDateTime;
import java.util.List;

import wealthguard.dto.PresupuestoRequestDTO;
import wealthguard.dto.PresupuestoResponseDTO;

public interface IPresupuestoService {

    /**
     * Crea un nuevo presupuesto para un usuario y categoría específicos.
     *
     * @param presupuestoRequest Datos necesarios para crear el presupuesto
     * @param nickUsuario        Nick del usuario autenticado
     * @param contrasena     Contraseña del usuario autenticado
     * @return El objeto PresupuestoResponseDTO con los datos del presupuesto creado
     */
    PresupuestoResponseDTO crearPresupuesto(PresupuestoRequestDTO presupuestoRequest, String nickUsuario,
            String contrasena) throws Exception;

    /**
     * Elimina un presupuesto existente por su ID.
     *
     * @param idPresupuesto  ID del presupuesto a eliminar
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return true si la eliminación fue exitosa, false si no se encontró el
     *         presupuesto
     */
    boolean eliminarPresupuesto(int idPresupuesto, String nickUsuario, String contrasena) throws Exception;

    /**
     * Modifica el límite y las fechas de un presupuesto existente.
     *
     * @param idPresupuesto  ID del presupuesto a editar
     * @param idCategoria    ID de la categoría asociada
     * @param limite         Nuevo límite de gasto
     * @param fechaInicio    Nueva fecha de inicio
     * @param fechaFin       Nueva fecha de fin
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return true si la edición fue exitosa, false si no se encontró el
     *         presupuesto
     */
    boolean editarPresupuesto(int idPresupuesto, int idCategoria, double limite,
            LocalDateTime fechaInicio, LocalDateTime fechaFin, String nickUsuario, String contrasena) throws Exception;

    /**
     * Devuelve todos los presupuestos del usuario con el gasto actual calculado
     * a partir de sus transacciones y el porcentaje utilizado.
     * Es el método principal para la pantalla de presupuestos.
     *
     * @param idUsuario      ID del usuario
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return Lista de PresupuestoResponseDTO con los datos calculados
     */
    List<PresupuestoResponseDTO> obtenerPresupuestos(int idUsuario, String nickUsuario, String contrasena) throws Exception;
}