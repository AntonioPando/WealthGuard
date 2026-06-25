package wealthguard.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import wealthguard.dto.CategoriaRequestDTO;
import wealthguard.dto.CategoriaResponseDTO;
import wealthguard.entity.CategoriaEntity;
import wealthguard.mapper.CategoriaMapper;
import wealthguard.repository.CategoriaRepository;
import wealthguard.service.ICategoriaService;
import wealthguard.service.LoginService;

@Service
public class CategoriaServiceImpl implements ICategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private CategoriaMapper categoriaMapper;

    @Autowired
    private LoginService loginService;

    @Override
    public boolean eliminarCategoria(int idCategoria, String nickUsuario, String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        if (categoriaRepository.existsById(idCategoria)) {
            categoriaRepository.deleteById(idCategoria);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public CategoriaResponseDTO crearCategoria(CategoriaRequestDTO nombreCategoria, String nickUsuario,
            String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        CategoriaEntity categoriaEntidad = categoriaMapper.convertirAEntity(nombreCategoria);

        if (categoriaRepository.existsByNombre(categoriaEntidad.getNombre())) {
            return null;
        } else {
            CategoriaEntity categoriaGuardada = categoriaRepository.save(categoriaEntidad);
            return categoriaMapper.convertirADTO(categoriaGuardada);
        }
    }

    @Override
    public List<CategoriaResponseDTO> obtenerCategorias(String nickUsuario, String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        List<CategoriaEntity> categorias = categoriaRepository.listarCategorias();

        return categorias.stream()
                .map(categoria -> categoriaMapper.convertirADTO(categoria))
                .collect(Collectors.toList());
    }

    @Override
    public CategoriaResponseDTO editarCategoria(int idCategoria, CategoriaRequestDTO categoriaRequest,
            String nickUsuario, String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        CategoriaEntity categoriaEntidad = categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        CategoriaEntity categoriaActualizada = categoriaMapper.convertirAEntity(categoriaRequest);
        categoriaActualizada.setId(categoriaEntidad.getId());

        if (categoriaRepository.existsByNombre(categoriaActualizada.getNombre())) {
            return null;
        } else {
            CategoriaEntity categoriaGuardada = categoriaRepository.save(categoriaActualizada);
            return categoriaMapper.convertirADTO(categoriaGuardada);
        }
    }
}