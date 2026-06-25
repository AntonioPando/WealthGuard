package wealthguard.mapper;

import org.springframework.stereotype.Component;

import wealthguard.dto.RecomendacionRequestDTO;
import wealthguard.dto.RecomendacionResponseDTO;
import wealthguard.entity.RecomendacionEntity;
import wealthguard.entity.TipoRecomendacionEntity;

@Component
public class RecomendacionMapper {

    // Metodo para convertir lo que llega del frontend en una entidad para la base
    // de datos
    public RecomendacionEntity convertirAEntity(RecomendacionRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        RecomendacionEntity entity = new RecomendacionEntity();

        entity.setUsuario(dto.getUsuario());
        entity.setTipoRecomendacion(dto.getTipoRecomendacion());
        entity.setFechaRecomendacion(dto.getFechaRecomendacion());
        return entity;

    }

    // Metodo para convertir lo que sale de la base de datos a DTO para el frontend
    public RecomendacionResponseDTO convertirADTO(RecomendacionEntity entity) {
        if (entity == null) {
            return null;
        }

        RecomendacionResponseDTO dto = new RecomendacionResponseDTO();

        dto.setIdRecomendacion(entity.getId());
        dto.setFechaRecomendacion(entity.getFechaRecomendacion());

        TipoRecomendacionEntity tipo = entity.getTipoRecomendacion();
        if (tipo != null) {
            dto.setTitulo(tipo.getNombre());
            dto.setDescripcion(tipo.getMensaje());
            dto.setIcono(tipo.getIcono());
            dto.setScoreRango(tipo.getScoreMinimo() + "-" + tipo.getScoreMaximo());
        }

        return dto;
    }

}