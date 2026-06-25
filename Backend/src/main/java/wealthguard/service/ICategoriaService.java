package wealthguard.service;

import java.util.List;

import wealthguard.dto.CategoriaRequestDTO;
import wealthguard.dto.CategoriaResponseDTO;

public interface ICategoriaService {

    /**
     * Elimina una categoría
     *
     * @param idCategoria    ID de la categoría a eliminar
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return true si la eliminación fue exitosa, false si no se encontró la
     *         categoría
     */
    public boolean eliminarCategoria(int idCategoria, String nickUsuario, String contrasena)throws Exception;

    /**
     * Crea una nueva categoría en el sistema.
     *
     * @param nombreCategoria DTO que contiene el nombre de la categoría a crear
     * @param nickUsuario     Nick del usuario autenticado
     * @param contrasena  Contraseña del usuario autenticado
     * @return El objeto {@link CategoriaResponseDTO} creado, o null si ya existe
     *         una categoría con el mismo nombre
     */
    public CategoriaResponseDTO crearCategoria(CategoriaRequestDTO nombreCategoria, String nickUsuario,
            String contrasena)throws Exception;

    /**
     * Obtiene la lista de categorías disponibles en el sistema.
     *
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return Lista de categorías
     */
    public List<CategoriaResponseDTO> obtenerCategorias(String nickUsuario, String contrasena)throws Exception;

    /**
     * Edita el nombre de una categoría existente.
     *
     * @param idCategoria    ID de la categoría a editar
     * @param nuevoNombre    DTO que contiene el nuevo nombre para la categoría
     * @param nickUsuario    Nick del usuario autenticado
     * @param contrasena Contraseña del usuario autenticado
     * @return El objeto {@link CategoriaResponseDTO} con los datos actualizados de
     *         la categoría, o null si no se encontró la categoría
     */
    public CategoriaResponseDTO editarCategoria(int idCategoria, CategoriaRequestDTO nuevoNombre,
            String nickUsuario, String contrasena)throws Exception;
}