package wealthguard.mapper;

import org.springframework.stereotype.Component;

import wealthguard.dto.CategoriaRequestDTO;
import wealthguard.dto.CategoriaResponseDTO;
import wealthguard.entity.CategoriaEntity;

@Component
public class CategoriaMapper {

    public CategoriaEntity convertirAEntity (CategoriaRequestDTO categoriaRequestDTO){
        if (categoriaRequestDTO == null) {
            return null;
        }

        CategoriaEntity categoriaEntity = new CategoriaEntity();
        
        categoriaEntity.setNombre(categoriaRequestDTO.getNombre());
        categoriaEntity.setIcono(categoriaRequestDTO.getIcono());

        return categoriaEntity;
    }

    public CategoriaResponseDTO convertirADTO (CategoriaEntity categoriaEntity){
        if (categoriaEntity == null) {
            return null;
        }

        CategoriaResponseDTO categoriaResponseDTO = new CategoriaResponseDTO();

        categoriaResponseDTO.setId(categoriaEntity.getId());
        categoriaResponseDTO.setNombre(categoriaEntity.getNombre());
        categoriaResponseDTO.setIcono(categoriaEntity.getIcono());

        return categoriaResponseDTO;
    }

}
