package wealthguard.service;

import java.time.LocalDateTime;
import java.util.List;

import wealthguard.dto.TransaccionRequestDTO;
import wealthguard.dto.TransaccionResponseDTO;

public interface ITransaccionService {
    /**
     * Lista las transacciones de un usuario aplicando filtros dinámicos opcionales.
     * Si las fechas no se especifican, se aplica un rango por defecto (últimos 7
     * días).
     *
     * @param idUsuario      Identificador único del usuario propietario de las
     *                       transacciones.
     * @param fechaInicio    Fecha y hora inicial para el rango de búsqueda (opcional).
     * @param fechaFin       Fecha y hora final para el rango de búsqueda (opcional).
     * @param idCategoria    Identificador de la categoría por la que filtrar
     *                       (opcional).
     * @param tipo           Tipo de transacción: true para ingresos, false para gastos
     *                       (opcional).
     * @param cantidad       Monto exacto de la transacción por el que filtrar
     *                       (opcional).
     * @param descripcion    Texto parcial o palabra clave contenida en la descripción
     *                       (opcional).
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return Lista de {@link TransaccionResponseDTO} que cumplen con los criterios
     *         especificados.
     */
    List<TransaccionResponseDTO> listarTransacciones(Integer idUsuario, LocalDateTime fechaInicio,
            LocalDateTime fechaFin, Integer idCategoria, Boolean tipo, Double cantidad, String descripcion,
            String nickUsuario, String contrasena) throws Exception;

    /**
     * Recupera el historial completo de transacciones (tanto ingresos como gastos)
     * de un usuario específico sin aplicar ningún límite temporal o de categoría.
     *
     * @param idUsuario      Identificador único del usuario.
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return Lista de {@link TransaccionResponseDTO} con todas las transacciones
     *         del usuario.
     */
    List<TransaccionResponseDTO> listarTodasPorUsuario(Integer idUsuario, String nickUsuario, String contrasena) throws Exception;

    /**
     * Registra una nueva transacción en el sistema vinculándola a un usuario
     * y a una categoría específicos.
     *
     * @param transaccionRequestDTO Objeto con los datos de la transacción a crear.
     * @param nickUsuario           Nick del usuario autenticado
     * @param contrasena        Contraseña del usuario autenticado
     * @return El objeto {@link TransaccionResponseDTO} con los datos guardados y su
     *         ID generado.
     */
    TransaccionResponseDTO crearTransaccion(TransaccionRequestDTO transaccionRequestDTO, String nickUsuario,
            String contrasena)throws Exception;

    /**
     * Actualiza los datos de una transacción existente en la base de datos.
     *
     * @param idTransaccion          Identificador único de la transacción que se
     *                               desea modificar.
     * @param transaccionRequestDTO  Objeto con los nuevos datos modificados.
     * @param nickUsuario            Nick del usuario autenticado
     * @param contrasena         Contraseña del usuario autenticado
     * @return El objeto {@link TransaccionResponseDTO} con los cambios ya
     *         aplicados.
     */
    TransaccionResponseDTO editarTransaccion(Integer idTransaccion, TransaccionRequestDTO transaccionRequestDTO,
            String nickUsuario, String contrasena)throws Exception;

    /**
     * Elimina de forma permanente una transacción del sistema a partir de su
     * identificador.
     *
     * @param idTransaccion  Identificador único de la transacción a eliminar.
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return true si la eliminación fue exitosa, false en caso contrario.
     */
    boolean eliminarTransaccion(Integer idTransaccion, String nickUsuario, String contrasena)throws Exception;

    /**
     * Calcula la tendencia de gastos de un usuario comparando el total de salidas
     * de dinero del mes actual frente al mes inmediatamente anterior.
     *
     * @param idUsuario      Identificador único del usuario.
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return Un valor de tipo double que representa el porcentaje de variación
     *         (positivo si el gasto aumentó, negativo si disminuyó).
     */
    double obtenerTendencia(int idUsuario, String nickUsuario, String contrasena)throws Exception;

    /**
     * Identifica la categoría en la que el usuario ha acumulado un mayor volumen de
     * gastos y calcula el porcentaje que representa sobre el total de sus gastos.
     *
     * @param idUsuario      Identificador único del usuario.
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return Un array de {@link String} de dos elementos, donde el índice 0 es el
     *         nombre de la categoría principal y el índice 1 es el porcentaje del
     *         total gastado formateado a dos decimales (ej: "45.50").
     */
    String[] obtenerCategoriaPrincipal(int idUsuario, String nickUsuario, String contrasena)throws Exception;

    /**
     * Obtiene el progreso financiero del usuario respecto a su meta u objetivo de
     * ahorro activo.
     *
     * @param idUsuario      Identificador único del usuario.
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return Un array de tipo double donde el índice 0 representa la cantidad
     *         actual acumulada y el índice 1 representa el porcentaje de progreso
     *         logrado hacia la meta.
     */
    double[] obtenerMeta(int idUsuario, String nickUsuario, String contrasena)throws Exception;
}