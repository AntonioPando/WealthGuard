package wealthguard.mapper;

import org.springframework.stereotype.Component;

import wealthguard.dto.PresupuestoRequestDTO;
import wealthguard.dto.PresupuestoResponseDTO;
import wealthguard.entity.PresupuestoEntity;

@Component
public class PresupuestoMapper {


    public PresupuestoEntity convertirAEntity(PresupuestoRequestDTO PresupuestoRequestDTO) {
        if (PresupuestoRequestDTO == null) {
            return null;
        }

        PresupuestoEntity presupuestoEntity = new PresupuestoEntity();

        presupuestoEntity.setUsuario(PresupuestoRequestDTO.getUsuario());
        presupuestoEntity.setCategoria(PresupuestoRequestDTO.getCategoria());
        presupuestoEntity.setLimite(PresupuestoRequestDTO.getLimite());
        presupuestoEntity.setFechaInicio(PresupuestoRequestDTO.getFechaInicio());
        presupuestoEntity.setFechaFin(PresupuestoRequestDTO.getFechaFin());

        return presupuestoEntity;

    }

    public PresupuestoResponseDTO convertirADTO(PresupuestoEntity presupuestoEntity) {
        if (presupuestoEntity == null) {
            return null;
        }

        PresupuestoResponseDTO presupuestoResponseDTO = new PresupuestoResponseDTO();

        presupuestoResponseDTO.setId(presupuestoEntity.getId()); 
        presupuestoResponseDTO.setUsuario(presupuestoEntity.getUsuario());
        presupuestoResponseDTO.setCategoria(presupuestoEntity.getCategoria());
        presupuestoResponseDTO.setLimite(presupuestoEntity.getLimite());
        presupuestoResponseDTO.setFechaInicio(presupuestoEntity.getFechaInicio());
        presupuestoResponseDTO.setFechaFin(presupuestoEntity.getFechaFin());
        
        return presupuestoResponseDTO;
    }
}
