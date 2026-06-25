package wealthguard.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import wealthguard.entity.PresupuestoEntity;

@Repository
public interface PresupuestoRepository extends JpaRepository<PresupuestoEntity, Integer> {

    List<PresupuestoEntity> findByUsuarioId(Integer usuarioId);
    List<PresupuestoEntity> findByCategoriaId(Integer categoriaId);
    List<PresupuestoEntity> findByUsuarioIdAndCategoriaId(Integer usuarioId, Integer categoriaId);
    List<PresupuestoEntity> findByUsuarioIdAndFechaInicioBeforeAndFechaFinAfter(
        Integer usuarioId, LocalDateTime fechaInicio, LocalDateTime fechaFin);
    List<PresupuestoEntity> findByUsuarioIdAndFechaInicioBetween(
        Integer usuarioId, LocalDateTime desde, LocalDateTime hasta);

    // Verifica si ya existe un presupuesto para ese usuario y categoría en ese rango de fechas
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM PresupuestoEntity p " +
           "WHERE p.usuario.id = :usuarioId AND p.categoria.id = :categoriaId " +
           "AND p.fechaInicio < :fechaFin AND p.fechaFin > :fechaInicio")
    boolean existeSolapamiento(
        @Param("usuarioId") Integer usuarioId,
        @Param("categoriaId") Integer categoriaId,
        @Param("fechaInicio") LocalDateTime fechaInicio,
        @Param("fechaFin") LocalDateTime fechaFin
    );

    // Filtro dinámico: todos los parámetros son opcionales
    @Query("SELECT p FROM PresupuestoEntity p WHERE " +
           "(:usuarioId IS NULL OR p.usuario.id = :usuarioId) AND " +
           "(:categoriaId IS NULL OR p.categoria.id = :categoriaId)")
    List<PresupuestoEntity> buscarConFiltro(
        @Param("usuarioId") Integer usuarioId,
        @Param("categoriaId") Integer categoriaId
    );

    @Transactional
    void deleteByUsuarioId(Integer usuarioId);

}