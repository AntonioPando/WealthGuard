package wealthguard.service.impl;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import wealthguard.dto.CategoriaRequestDTO;
import wealthguard.dto.CategoriaResponseDTO;
import wealthguard.entity.CategoriaEntity;
import wealthguard.mapper.CategoriaMapper;
import wealthguard.repository.CategoriaRepository;
import wealthguard.service.LoginService;

@ExtendWith(MockitoExtension.class)
class CategoriaServiceImplTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private CategoriaMapper categoriaMapper;

    @Mock
    private LoginService loginService;

    @InjectMocks
    private CategoriaServiceImpl categoriaService;

    private CategoriaEntity categoriaEntity;
    private CategoriaResponseDTO categoriaResponseDTO;
    private CategoriaRequestDTO categoriaRequestDTO;

    @BeforeEach
    void setUp() {
        categoriaEntity = new CategoriaEntity();
        categoriaEntity.setId(1);
        categoriaEntity.setNombre("Alimentación");
        categoriaEntity.setIcono("food.svg");

        categoriaResponseDTO = new CategoriaResponseDTO();
        categoriaResponseDTO.setId(1);
        categoriaResponseDTO.setNombre("Alimentación");
        categoriaResponseDTO.setIcono("food.svg");

        categoriaRequestDTO = new CategoriaRequestDTO();
        categoriaRequestDTO.setNombre("Alimentación");
        categoriaRequestDTO.setIcono("food.svg");
    }

    @Test
    void crearCategoria_nueva_retornaCategoriaResponseDTO() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(categoriaMapper.convertirAEntity(categoriaRequestDTO)).thenReturn(categoriaEntity);
        when(categoriaRepository.existsByNombre("Alimentación")).thenReturn(false);
        when(categoriaRepository.save(categoriaEntity)).thenReturn(categoriaEntity);
        when(categoriaMapper.convertirADTO(categoriaEntity)).thenReturn(categoriaResponseDTO);

        CategoriaResponseDTO result = categoriaService.crearCategoria(categoriaRequestDTO, "testuser", "pass");

        assertNotNull(result);
        assertEquals("Alimentación", result.getNombre());
        verify(categoriaRepository).save(categoriaEntity);
    }

    @Test
    void crearCategoria_nombreDuplicado_retornaNull() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(categoriaMapper.convertirAEntity(categoriaRequestDTO)).thenReturn(categoriaEntity);
        when(categoriaRepository.existsByNombre("Alimentación")).thenReturn(true);

        CategoriaResponseDTO result = categoriaService.crearCategoria(categoriaRequestDTO, "testuser", "pass");

        assertNull(result);
        verify(categoriaRepository, never()).save(any());
    }

    @Test
    void crearCategoria_credencialesInvalidas_lanzaRuntimeException() {
        doThrow(new RuntimeException("Acceso denegado")).when(loginService).verificar(anyString(), anyString());

        assertThrows(RuntimeException.class,
                () -> categoriaService.crearCategoria(categoriaRequestDTO, "wrong", "wrong"));
    }

    @Test
    void obtenerCategorias_conDatos_retornaLista() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        CategoriaEntity cat2 = new CategoriaEntity();
        cat2.setId(2);
        cat2.setNombre("Transporte");
        CategoriaResponseDTO dto2 = new CategoriaResponseDTO();
        dto2.setId(2);
        dto2.setNombre("Transporte");

        when(categoriaRepository.listarCategorias()).thenReturn(Arrays.asList(categoriaEntity, cat2));
        when(categoriaMapper.convertirADTO(categoriaEntity)).thenReturn(categoriaResponseDTO);
        when(categoriaMapper.convertirADTO(cat2)).thenReturn(dto2);

        List<CategoriaResponseDTO> result = categoriaService.obtenerCategorias("testuser", "pass");

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Alimentación", result.get(0).getNombre());
        assertEquals("Transporte", result.get(1).getNombre());
    }

    @Test
    void obtenerCategorias_sinDatos_retornaListaVacia() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(categoriaRepository.listarCategorias()).thenReturn(Collections.emptyList());

        List<CategoriaResponseDTO> result = categoriaService.obtenerCategorias("testuser", "pass");

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void editarCategoria_exitosa_retornaCategoriaActualizada() {
        CategoriaRequestDTO nuevoRequest = new CategoriaRequestDTO();
        nuevoRequest.setNombre("NuevoNombre");

        CategoriaEntity categoriaActualizada = new CategoriaEntity();
        categoriaActualizada.setNombre("NuevoNombre");

        CategoriaResponseDTO responseActualizado = new CategoriaResponseDTO();
        responseActualizado.setId(1);
        responseActualizado.setNombre("NuevoNombre");

        doNothing().when(loginService).verificar(anyString(), anyString());
        when(categoriaRepository.findById(1)).thenReturn(Optional.of(categoriaEntity));
        when(categoriaMapper.convertirAEntity(nuevoRequest)).thenReturn(categoriaActualizada);
        when(categoriaRepository.existsByNombre("NuevoNombre")).thenReturn(false);
        when(categoriaRepository.save(categoriaActualizada)).thenReturn(categoriaActualizada);
        when(categoriaMapper.convertirADTO(categoriaActualizada)).thenReturn(responseActualizado);

        CategoriaResponseDTO result = categoriaService.editarCategoria(1, nuevoRequest, "testuser", "pass");

        assertNotNull(result);
        assertEquals("NuevoNombre", result.getNombre());
        verify(categoriaRepository).save(categoriaActualizada);
    }

    @Test
    void editarCategoria_nombreDuplicado_retornaNull() {
        CategoriaRequestDTO nuevoRequest = new CategoriaRequestDTO();
        nuevoRequest.setNombre("Duplicado");

        CategoriaEntity categoriaActualizada = new CategoriaEntity();
        categoriaActualizada.setNombre("Duplicado");

        doNothing().when(loginService).verificar(anyString(), anyString());
        when(categoriaRepository.findById(1)).thenReturn(Optional.of(categoriaEntity));
        when(categoriaMapper.convertirAEntity(nuevoRequest)).thenReturn(categoriaActualizada);
        when(categoriaRepository.existsByNombre("Duplicado")).thenReturn(true);

        CategoriaResponseDTO result = categoriaService.editarCategoria(1, nuevoRequest, "testuser", "pass");

        assertNull(result);
        verify(categoriaRepository, never()).save(any());
    }

    @Test
    void editarCategoria_noEncontrada_lanzaRuntimeException() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(categoriaRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> categoriaService.editarCategoria(999, categoriaRequestDTO, "testuser", "pass"));
    }

    @Test
    void eliminarCategoria_existe_eliminaYRetornaTrue() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(categoriaRepository.existsById(1)).thenReturn(true);

        boolean result = categoriaService.eliminarCategoria(1, "testuser", "pass");

        assertTrue(result);
        verify(categoriaRepository).deleteById(1);
    }

    @Test
    void eliminarCategoria_noExiste_retornaFalse() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(categoriaRepository.existsById(999)).thenReturn(false);

        boolean result = categoriaService.eliminarCategoria(999, "testuser", "pass");

        assertFalse(result);
        verify(categoriaRepository, never()).deleteById(any());
    }

    @Test
    void eliminarCategoria_credencialesInvalidas_lanzaRuntimeException() {
        doThrow(new RuntimeException("Acceso denegado")).when(loginService).verificar(anyString(), anyString());

        assertThrows(RuntimeException.class,
                () -> categoriaService.eliminarCategoria(1, "wrong", "wrong"));
    }
}
