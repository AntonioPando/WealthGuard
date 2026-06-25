package wealthguard.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import wealthguard.entity.TransaccionEntity;

@Repository
public interface TransaccionRepository extends JpaRepository<TransaccionEntity, Integer> {

    // Busqueda con filtros dinamicos quitando los valores null
@Query("SELECT t FROM TransaccionEntity t WHERE " +
            "(:idUsuario IS NULL OR t.usuario.id = :idUsuario) " +
            "AND (t.fecha BETWEEN :fechaInicio AND :fechaFin) " +
            "AND (:idCategoria IS NULL OR t.categoria.id = :idCategoria) " +
            "AND (:tipo IS NULL OR t.tipoTransaccion = :tipo) " +
            "AND (:cantidad IS NULL OR t.cantidad = :cantidad) " +
            "AND (:descripcion IS NULL OR t.descripcion LIKE LOWER(CONCAT('%', :descripcion, '%')))")
    List<TransaccionEntity> buscarConFiltros(
            @Param("idUsuario") Integer idUsuario,
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin,
            @Param("idCategoria") Integer idCategoria,
            @Param("tipo") Boolean tipo,
            @Param("cantidad") Double cantidad,
            @Param("descripcion") String descripcion
    );

            // Busca los gastos agrupados por categoria, se ordenan de mayor a menor
            // Devuelve una lista de array de objetos [0] sera el nombre de la categoria
            // y [1] sera la suma de los gastos de esa categoria
            @Query("SELECT c.nombre, SUM(t.cantidad) " +
                "FROM TransaccionEntity t " +
                "JOIN t.categoria c " +
                "WHERE t.usuario.id = :idUsuario AND t.tipoTransaccion = false " +
                "GROUP BY c.nombre " +
                "ORDER BY SUM(t.cantidad) DESC"
            )
            List<Object[]> obtenerGastosAgrupadosPorCategoria(@Param("idUsuario") Integer idUsuario);


            // Suma los ingresos y resta los gastos en un rango de fechas
            @Query("SELECT SUM(CASE WHEN t.tipoTransaccion = true THEN t.cantidad ELSE -t.cantidad END) " +
                "FROM TransaccionEntity t WHERE t.usuario.id = :idUsuario AND t.fecha BETWEEN :inicio AND :fin")
                Double obtenerBalanceEntreFechas(@Param("idUsuario") Integer idUsuario, @Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);


            List<TransaccionEntity> findByUsuarioId(Integer idUsuario);

            void deleteByUsuarioId(Integer usuarioId);


}

