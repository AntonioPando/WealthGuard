package wealthguard.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import wealthguard.entity.ObjetivoEntity;

@Repository
public interface ObjetivoRepository extends JpaRepository<ObjetivoEntity, Integer> {

    // Busca los objetivos de un usuario ordenados por fecha de inicio descendente
    Optional<ObjetivoEntity> findFirstByUsuarioIdOrderByFechaInicioDesc(Integer idUsuario);

    // Obtiene la última meta de un usuario cuya fecha de fin ya haya pasado
    Optional<ObjetivoEntity> findFirstByUsuarioIdAndFechaFinBeforeOrderByFechaFinDesc(Integer idUsuario, LocalDateTime fechaFin);

    void deleteByUsuarioId(Integer usuarioId);

}
