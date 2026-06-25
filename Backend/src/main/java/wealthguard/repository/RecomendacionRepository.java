package wealthguard.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import wealthguard.entity.RecomendacionEntity;

@Repository
public interface RecomendacionRepository extends JpaRepository<RecomendacionEntity, Integer> {

    List<RecomendacionEntity> findByUsuarioId(Integer usuarioId);

    List<RecomendacionEntity> findByTipoRecomendacionId(Integer tipoRecomendacionId);

    List<RecomendacionEntity> findByUsuarioIdAndTipoRecomendacionId(
            Integer usuarioId,
            Integer tipoRecomendacionId);

    List<RecomendacionEntity> findByUsuarioIdAndFechaRecomendacionBetween(
            Integer usuarioId,
            LocalDateTime desde,
            LocalDateTime hasta);

    List<RecomendacionEntity> findByUsuarioIdOrderByFechaRecomendacionDesc(Integer usuarioId);

    void deleteByUsuarioId(Integer usuarioId);
}