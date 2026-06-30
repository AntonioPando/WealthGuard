package wealthguard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import wealthguard.entity.TipoRecomendacionEntity;

@Repository
public interface TipoRecomendacionRepository extends JpaRepository<TipoRecomendacionEntity, Integer> {

    // Devuelve todos los tipos cuyo rango incluye el score dado
    @Query("SELECT t FROM TipoRecomendacionEntity t WHERE :score BETWEEN t.scoreMinimo AND t.scoreMaximo")
    List<TipoRecomendacionEntity> findByScore(@Param("score") Integer score);
}