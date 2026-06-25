package wealthguard.mapper;

import org.springframework.stereotype.Component;

import wealthguard.dto.TransaccionRequestDTO;
import wealthguard.dto.TransaccionResponseDTO;
import wealthguard.entity.CategoriaEntity;
import wealthguard.entity.TransaccionEntity;
import wealthguard.entity.UsuarioEntity;

@Component
public class TransaccionMapper {

    // Metodo para convertir lo que llega del frontend en una entidad para la base de datos
    public TransaccionEntity convertirAEntity (TransaccionRequestDTO transaccionRequestDTO){
        if (transaccionRequestDTO == null) {
            return null;
        }

        TransaccionEntity transaccionEntity = new TransaccionEntity();
        transaccionEntity.setCantidad(transaccionRequestDTO.getCantidad());
        transaccionEntity.setFecha(transaccionRequestDTO.getFecha());
        transaccionEntity.setDescripcion(transaccionRequestDTO.getDescripcion());
        transaccionEntity.setTipoTransaccion(transaccionRequestDTO.getTipoTransaccion());

        if (transaccionRequestDTO.getIdCategoria() != null) {
            CategoriaEntity categoriaEntity = new CategoriaEntity();
            categoriaEntity.setId(transaccionRequestDTO.getIdCategoria());
            transaccionEntity.setCategoria(categoriaEntity);
        }

        if (transaccionRequestDTO.getIdUsuario() != null) {
            UsuarioEntity usuarioEntity = new UsuarioEntity();
            usuarioEntity.setId(transaccionRequestDTO.getIdUsuario());
            transaccionEntity.setUsuario(usuarioEntity);
        }

        return transaccionEntity;
    }

    // Metodo para convertir lo que sale de la base de datos a DTO para el frontend
    public TransaccionResponseDTO convertirADTO(TransaccionEntity transaccionEntity){
        if (transaccionEntity == null) {
            return null;
        }
        TransaccionResponseDTO transaccionResponseDTO = new TransaccionResponseDTO();
        transaccionResponseDTO.setId(transaccionEntity.getId());
        transaccionResponseDTO.setCantidad(transaccionEntity.getCantidad());
        transaccionResponseDTO.setFecha(transaccionEntity.getFecha());
        transaccionResponseDTO.setDescripcion(transaccionEntity.getDescripcion());
        transaccionResponseDTO.setTipoTransaccion(transaccionEntity.getTipoTransaccion());

        if (transaccionEntity.getCategoria() != null) {
            transaccionResponseDTO.setNombreCategoria(transaccionEntity.getCategoria().getNombre());
            transaccionResponseDTO.setIdCategoria(transaccionEntity.getCategoria().getId());
        }

        return transaccionResponseDTO;
    }

}
