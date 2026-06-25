package wealthguard.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import wealthguard.dto.TipoRecomendacionRequestDTO;
import wealthguard.dto.TipoRecomendacionResponseDTO;
import wealthguard.entity.TipoRecomendacionEntity;
import wealthguard.mapper.TipoRecomendacionMapper;
import wealthguard.repository.TipoRecomendacionRepository;
import wealthguard.service.ITipoRecomendacionService;
import wealthguard.service.LoginService;

@Service
public class TipoRecomendacionServiceImpl implements ITipoRecomendacionService {

    @Autowired
    private TipoRecomendacionRepository repository;

    @Autowired
    private TipoRecomendacionMapper mapper;

    @Autowired
    private LoginService loginService;

    @Override
    public TipoRecomendacionResponseDTO crearTipoRecomendacion(TipoRecomendacionRequestDTO dto, String nickUsuario,
            String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        TipoRecomendacionEntity entity = mapper.toEntity(dto);
        TipoRecomendacionEntity savedEntity = repository.save(entity);
        return mapper.convertirADTO(savedEntity);
    }

    @Override
    public TipoRecomendacionResponseDTO obtenerTipoRecomendacionPorId(Integer id, String nickUsuario,
            String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        TipoRecomendacionEntity entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de Recomendación no encontrado"));
        return mapper.convertirADTO(entity);
    }

    @Override
    public List<TipoRecomendacionResponseDTO> listarTodos(String nickUsuario, String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        List<TipoRecomendacionEntity> entities = repository.findAll();
        return entities.stream()
                .map(TipoRecomendacionMapper::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    public TipoRecomendacionResponseDTO actualizarTipoRecomendacion(Integer id, TipoRecomendacionRequestDTO dto,
            String nickUsuario, String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        TipoRecomendacionEntity existingEntity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de Recomendación no encontrado"));

        existingEntity.setNombre(dto.getNombre());
        existingEntity.setMensaje(dto.getMensaje());

        TipoRecomendacionEntity updatedEntity = repository.save(existingEntity);
        return TipoRecomendacionMapper.convertirADTO(updatedEntity);
    }

    @Override
    public void eliminarTipoRecomendacion(Integer id, String nickUsuario, String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        if (!repository.existsById(id)) {
            throw new RuntimeException("Tipo de Recomendación no encontrado");
        }
        repository.deleteById(id);
    }
}