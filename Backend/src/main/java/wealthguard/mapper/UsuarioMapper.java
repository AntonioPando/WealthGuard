package wealthguard.mapper;

import org.springframework.stereotype.Component;

import wealthguard.dto.UsuarioRequestDTO;
import wealthguard.dto.UsuarioResponseDTO;
import wealthguard.entity.UsuarioEntity;

@Component
public class UsuarioMapper {

    public UsuarioEntity convertirAEntity(UsuarioRequestDTO dto) {
        if (dto == null)
            return null;

        UsuarioEntity entity = new UsuarioEntity();
        entity.setNickUsuario(dto.getNickUsuario());
        entity.setNombre(dto.getNombre());
        entity.setPrimerApellido(dto.getPrimerApellido());
        entity.setSegundoApellido(dto.getSegundoApellido());
        entity.setEmail(dto.getEmail());
        entity.setPassword(dto.getPassword());
        entity.setPreguntaSeguridad(dto.getPreguntaSeguridad());
        entity.setRespuestaSeguridad(dto.getRespuestaSeguridad());
        entity.setFotoPerfil(dto.getFotoPerfil());

        return entity;
    }

    public UsuarioResponseDTO convertirADTO(UsuarioEntity entity) {
        if (entity == null)
            return null;

        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(entity.getId());
        dto.setNickUsuario(entity.getNickUsuario());
        dto.setNombre(entity.getNombre());
        dto.setPrimerApellido(entity.getPrimerApellido());
        dto.setSegundoApellido(entity.getSegundoApellido());
        dto.setEmail(entity.getEmail());
        dto.setPassword(entity.getPassword());
        dto.setPreguntaSeguridad(entity.getPreguntaSeguridad());
        dto.setRespuestaSeguridad(entity.getRespuestaSeguridad());
        dto.setFotoPerfil(entity.getFotoPerfil());
        dto.setFechaRegistro(entity.getFechaRegistro());
        dto.setFechaUltimoCambioPassword(entity.getFechaUltimoCambioPassword());

        return dto;
    }
}