package wealthguard.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import wealthguard.entity.UsuarioEntity;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Integer> {

    // Busca un usuario por su nick (para comprobar duplicados)
    Optional<UsuarioEntity> findByNickUsuario(String nickUsuario);

    // Busca usuario por nick ignorando mayúsculas/minúsculas (login)
    Optional<UsuarioEntity> findByNickUsuarioIgnoreCase(String nickUsuario);

    // Busca usuario por email ignorando mayúsculas/minúsculas (login)
    Optional<UsuarioEntity> findByEmailIgnoreCase(String email);

    // Comprueba si ya existe un usuario con ese nick (excluye al propio usuario por id)
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM UsuarioEntity u WHERE LOWER(u.nickUsuario) = LOWER(:nick) AND u.id <> :id")
    boolean existsByNickUsuarioAndIdNot(@Param("nick") String nick, @Param("id") Integer id);

}

