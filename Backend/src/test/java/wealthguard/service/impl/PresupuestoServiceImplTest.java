package wealthguard.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import wealthguard.dto.PresupuestoRequestDTO;
import wealthguard.dto.PresupuestoResponseDTO;
import wealthguard.entity.CategoriaEntity;
import wealthguard.entity.PresupuestoEntity;
import wealthguard.entity.TransaccionEntity;
import wealthguard.entity.UsuarioEntity;
import wealthguard.mapper.PresupuestoMapper;
import wealthguard.repository.PresupuestoRepository;
import wealthguard.repository.TransaccionRepository;
import wealthguard.service.LoginService;

@ExtendWith(MockitoExtension.class)
class PresupuestoServiceImplTest {

    @Mock
    private PresupuestoRepository presupuestoRepository;

    @Mock
    private TransaccionRepository transaccionRepository;

    @Mock
    private PresupuestoMapper presupuestoMapper;

    @Mock
    private LoginService loginService;

    @InjectMocks
    private PresupuestoServiceImpl presupuestoService;

    private UsuarioEntity usuarioEntity;
    private CategoriaEntity categoriaEntity;
    private PresupuestoEntity presupuestoEntity;
    private PresupuestoResponseDTO presupuestoResponseDTO;
    private PresupuestoRequestDTO presupuestoRequestDTO;

    @BeforeEach
    void setUp() {
        usuarioEntity = new UsuarioEntity();
        usuarioEntity.setId(1);

        categoriaEntity = new CategoriaEntity();
        categoriaEntity.setId(1);
        categoriaEntity.setNombre("Alimentación");

        presupuestoEntity = new PresupuestoEntity();
        presupuestoEntity.setId(1);
        presupuestoEntity.setUsuario(usuarioEntity);
        presupuestoEntity.setCategoria(categoriaEntity);
        presupuestoEntity.setLimite(500.0);
        presupuestoEntity.setFechaInicio(LocalDateTime.now().minusDays(30));
        presupuestoEntity.setFechaFin(LocalDateTime.now().plusDays(1));

        presupuestoResponseDTO = new PresupuestoResponseDTO();
        presupuestoResponseDTO.setId(1);
        presupuestoResponseDTO.setUsuario(usuarioEntity);
        presupuestoResponseDTO.setCategoria(categoriaEntity);
        presupuestoResponseDTO.setLimite(500.0);

        presupuestoRequestDTO = new PresupuestoRequestDTO();
        presupuestoRequestDTO.setUsuario(usuarioEntity);
        presupuestoRequestDTO.setCategoria(categoriaEntity);
        presupuestoRequestDTO.setLimite(500.0);
        presupuestoRequestDTO.setFechaInicio(LocalDateTime.now().minusDays(30));
        presupuestoRequestDTO.setFechaFin(LocalDateTime.now().plusDays(1));
    }

    // --- crearPresupuesto ---

    @Test
    void crearPresupuesto_exitoso_retornaResponseDTO() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(presupuestoMapper.convertirAEntity(presupuestoRequestDTO)).thenReturn(presupuestoEntity);
        when(presupuestoRepository.save(presupuestoEntity)).thenReturn(presupuestoEntity);
        when(presupuestoMapper.convertirADTO(presupuestoEntity)).thenReturn(presupuestoResponseDTO);

        PresupuestoResponseDTO result = presupuestoService.crearPresupuesto(presupuestoRequestDTO, "testuser", "pass");

        assertNotNull(result);
        assertEquals(500.0, result.getLimite());
        verify(presupuestoRepository).save(presupuestoEntity);
    }

    @Test
    void crearPresupuesto_credencialesInvalidas_lanzaRuntimeException() {
        doThrow(new RuntimeException("Acceso denegado")).when(loginService).verificar(anyString(), anyString());

        assertThrows(RuntimeException.class,
                () -> presupuestoService.crearPresupuesto(presupuestoRequestDTO, "wrong", "wrong"));
        verify(presupuestoRepository, never()).save(any());
    }

    // --- eliminarPresupuesto ---

    @Test
    void eliminarPresupuesto_existe_eliminaYRetornaTrue() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(presupuestoRepository.existsById(1)).thenReturn(true);

        boolean result = presupuestoService.eliminarPresupuesto(1, "testuser", "pass");

        assertTrue(result);
        verify(presupuestoRepository).deleteById(1);
    }

    @Test
    void eliminarPresupuesto_noExiste_retornaFalse() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(presupuestoRepository.existsById(999)).thenReturn(false);

        boolean result = presupuestoService.eliminarPresupuesto(999, "testuser", "pass");

        assertFalse(result);
        verify(presupuestoRepository, never()).deleteById(any());
    }

    // --- editarPresupuesto ---

    @Test
    void editarPresupuesto_existe_actualizaYRetornaTrue() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(presupuestoRepository.findById(1)).thenReturn(Optional.of(presupuestoEntity));
        when(presupuestoRepository.save(any(PresupuestoEntity.class))).thenReturn(presupuestoEntity);

        LocalDateTime nuevaInicio = LocalDateTime.now().minusDays(15);
        LocalDateTime nuevaFin = LocalDateTime.now().plusDays(15);

        boolean result = presupuestoService.editarPresupuesto(1, 1, 750.0, nuevaInicio, nuevaFin, "testuser", "pass");

        assertTrue(result);
        verify(presupuestoRepository).save(argThat(p ->
                p.getLimite() == 750.0 &&
                p.getFechaInicio().equals(nuevaInicio) &&
                p.getFechaFin().equals(nuevaFin)));
    }

    @Test
    void editarPresupuesto_noExiste_retornaFalse() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(presupuestoRepository.findById(999)).thenReturn(Optional.empty());

        boolean result = presupuestoService.editarPresupuesto(999, 1, 500.0,
                LocalDateTime.now(), LocalDateTime.now().plusDays(1), "testuser", "pass");

        assertFalse(result);
        verify(presupuestoRepository, never()).save(any());
    }

    // --- obtenerPresupuestos ---

    @Test
    void obtenerPresupuestos_conGastos_calculaPorcentajeCorrectamente() {
        doNothing().when(loginService).verificar(anyString(), anyString());

        TransaccionEntity gasto1 = new TransaccionEntity();
        gasto1.setCantidad(150.0);
        TransaccionEntity gasto2 = new TransaccionEntity();
        gasto2.setCantidad(100.0);

        when(presupuestoRepository.findByUsuarioId(1)).thenReturn(Arrays.asList(presupuestoEntity));
        when(transaccionRepository.buscarConFiltros(
                eq(1), any(), any(), eq(1), eq(false), isNull(), isNull()))
                .thenReturn(Arrays.asList(gasto1, gasto2));
        when(presupuestoMapper.convertirADTO(presupuestoEntity)).thenReturn(presupuestoResponseDTO);

        List<PresupuestoResponseDTO> result = presupuestoService.obtenerPresupuestos(1, "testuser", "pass");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(250.0, result.get(0).getGastoActual(), 0.01);
        assertEquals(50.0, result.get(0).getPorcentaje(), 0.01);
    }

    @Test
    void obtenerPresupuestos_sinGastos_retornaPorcentajeCero() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(presupuestoRepository.findByUsuarioId(1)).thenReturn(Arrays.asList(presupuestoEntity));
        when(transaccionRepository.buscarConFiltros(
                eq(1), any(), any(), eq(1), eq(false), isNull(), isNull()))
                .thenReturn(Collections.emptyList());
        when(presupuestoMapper.convertirADTO(presupuestoEntity)).thenReturn(presupuestoResponseDTO);

        List<PresupuestoResponseDTO> result = presupuestoService.obtenerPresupuestos(1, "testuser", "pass");

        assertEquals(0.0, result.get(0).getGastoActual());
        assertEquals(0.0, result.get(0).getPorcentaje());
    }

    @Test
    void obtenerPresupuestos_sinPresupuestos_retornaListaVacia() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(presupuestoRepository.findByUsuarioId(1)).thenReturn(Collections.emptyList());

        List<PresupuestoResponseDTO> result = presupuestoService.obtenerPresupuestos(1, "testuser", "pass");

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void obtenerPresupuestos_limiteCero_porcentajeCero() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        presupuestoEntity.setLimite(0.0);

        TransaccionEntity gasto = new TransaccionEntity();
        gasto.setCantidad(100.0);

        when(presupuestoRepository.findByUsuarioId(1)).thenReturn(Arrays.asList(presupuestoEntity));
        when(transaccionRepository.buscarConFiltros(
                eq(1), any(), any(), eq(1), eq(false), isNull(), isNull()))
                .thenReturn(Arrays.asList(gasto));
        when(presupuestoMapper.convertirADTO(presupuestoEntity)).thenReturn(presupuestoResponseDTO);

        List<PresupuestoResponseDTO> result = presupuestoService.obtenerPresupuestos(1, "testuser", "pass");

        assertEquals(0.0, result.get(0).getPorcentaje());
    }
}
