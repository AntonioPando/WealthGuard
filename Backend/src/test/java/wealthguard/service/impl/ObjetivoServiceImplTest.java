package wealthguard.service.impl;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
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
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import wealthguard.dto.ObjetivoRequestDTO;
import wealthguard.dto.ObjetivoResponseDTO;
import wealthguard.entity.ObjetivoEntity;
import wealthguard.entity.UsuarioEntity;
import wealthguard.mapper.ObjetivoMapper;
import wealthguard.repository.ObjetivoRepository;
import wealthguard.service.LoginService;

@ExtendWith(MockitoExtension.class)
class ObjetivoServiceImplTest {

    @Mock
    private ObjetivoRepository objetivoRepository;

    @Mock
    private ObjetivoMapper objetivoMapper;

    @Mock
    private LoginService loginService;

    @InjectMocks
    private ObjetivoServiceImpl objetivoService;

    private UsuarioEntity usuarioEntity;
    private ObjetivoEntity objetivoVigente;
    private ObjetivoEntity objetivoExpirado;
    private ObjetivoResponseDTO objetivoResponseDTO;
    private ObjetivoRequestDTO objetivoRequestDTO;

    @BeforeEach
    void setUp() {
        usuarioEntity = new UsuarioEntity();
        usuarioEntity.setId(1);

        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime inicioMes = ahora.with(TemporalAdjusters.firstDayOfMonth()).with(LocalTime.MIN);
        LocalDateTime finMes = ahora.with(TemporalAdjusters.lastDayOfMonth()).with(LocalTime.MAX);

        objetivoVigente = new ObjetivoEntity();
        objetivoVigente.setId(1);
        objetivoVigente.setUsuario(usuarioEntity);
        objetivoVigente.setCantidadObjetivo(1500.0);
        objetivoVigente.setFechaInicio(inicioMes);
        objetivoVigente.setFechaFin(finMes);

        objetivoExpirado = new ObjetivoEntity();
        objetivoExpirado.setId(2);
        objetivoExpirado.setUsuario(usuarioEntity);
        objetivoExpirado.setCantidadObjetivo(1000.0);
        objetivoExpirado.setFechaInicio(ahora.minusMonths(2).with(TemporalAdjusters.firstDayOfMonth()));
        objetivoExpirado.setFechaFin(ahora.minusMonths(2).with(TemporalAdjusters.lastDayOfMonth()));

        objetivoResponseDTO = new ObjetivoResponseDTO();
        objetivoResponseDTO.setId(1);
        objetivoResponseDTO.setUsuarioId(1);
        objetivoResponseDTO.setCantidadObjetivo(1500.0);

        objetivoRequestDTO = new ObjetivoRequestDTO();
        objetivoRequestDTO.setUsuarioId(1);
        objetivoRequestDTO.setCantidadObjetivo(1500.0);
    }

    @Test
    void crearObjetivo_sinObjetivoExistente_creaUnoNuevo() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(objetivoRepository.findFirstByUsuarioIdOrderByFechaInicioDesc(1)).thenReturn(Optional.empty());

        ObjetivoEntity nuevaEntidad = new ObjetivoEntity();
        nuevaEntidad.setUsuario(usuarioEntity);
        nuevaEntidad.setCantidadObjetivo(1500.0);

        when(objetivoMapper.convertirAEntity(objetivoRequestDTO)).thenReturn(nuevaEntidad);
        when(objetivoRepository.save(any(ObjetivoEntity.class))).thenReturn(objetivoVigente);
        when(objetivoMapper.convertirADTO(objetivoVigente)).thenReturn(objetivoResponseDTO);

        ObjetivoResponseDTO result = objetivoService.crearObjetivo(objetivoRequestDTO, "testuser", "pass");

        assertNotNull(result);
        assertEquals(1500.0, result.getCantidadObjetivo());
        verify(objetivoRepository).save(argThat(o -> o.getFechaInicio() != null && o.getFechaFin() != null));
    }

    @Test
    void crearObjetivo_objetivoExistenteEnMismoMes_actualizaCantidad() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(objetivoRepository.findFirstByUsuarioIdOrderByFechaInicioDesc(1))
                .thenReturn(Optional.of(objetivoVigente));

        ObjetivoResponseDTO responseActualizado = new ObjetivoResponseDTO();
        responseActualizado.setCantidadObjetivo(2000.0);

        when(objetivoRepository.save(objetivoVigente)).thenReturn(objetivoVigente);
        when(objetivoMapper.convertirADTO(objetivoVigente)).thenReturn(responseActualizado);

        ObjetivoRequestDTO requestNuevo = new ObjetivoRequestDTO();
        requestNuevo.setUsuarioId(1);
        requestNuevo.setCantidadObjetivo(2000.0);

        ObjetivoResponseDTO result = objetivoService.crearObjetivo(requestNuevo, "testuser", "pass");

        assertNotNull(result);
        assertEquals(2000.0, result.getCantidadObjetivo());
        verify(objetivoMapper, never()).convertirAEntity(any());
    }

    @Test
    void crearObjetivo_objetivoExpirado_creaUnoNuevo() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(objetivoRepository.findFirstByUsuarioIdOrderByFechaInicioDesc(1))
                .thenReturn(Optional.of(objetivoExpirado));

        ObjetivoEntity nuevaEntidad = new ObjetivoEntity();
        when(objetivoMapper.convertirAEntity(objetivoRequestDTO)).thenReturn(nuevaEntidad);
        when(objetivoRepository.save(any(ObjetivoEntity.class))).thenReturn(objetivoVigente);
        when(objetivoMapper.convertirADTO(objetivoVigente)).thenReturn(objetivoResponseDTO);

        ObjetivoResponseDTO result = objetivoService.crearObjetivo(objetivoRequestDTO, "testuser", "pass");

        assertNotNull(result);
        verify(objetivoMapper).convertirAEntity(objetivoRequestDTO);
    }

    @Test
    void eliminarObjetivo_existe_eliminaYRetornaTrue() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(objetivoRepository.existsById(1)).thenReturn(true);

        boolean result = objetivoService.eliminarObjetivo(1, "testuser", "pass");

        assertTrue(result);
        verify(objetivoRepository).deleteById(1);
    }

    @Test
    void eliminarObjetivo_noExiste_retornaFalse() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(objetivoRepository.existsById(999)).thenReturn(false);

        boolean result = objetivoService.eliminarObjetivo(999, "testuser", "pass");

        assertFalse(result);
        verify(objetivoRepository, never()).deleteById(any());
    }

    @Test
    void editarObjetivo_existe_actualizaCantidadYRetornaDTO() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(objetivoRepository.findById(1)).thenReturn(Optional.of(objetivoVigente));
        when(objetivoRepository.save(objetivoVigente)).thenReturn(objetivoVigente);

        ObjetivoResponseDTO responseActualizado = new ObjetivoResponseDTO();
        responseActualizado.setCantidadObjetivo(2500.0);
        when(objetivoMapper.convertirADTO(objetivoVigente)).thenReturn(responseActualizado);

        ObjetivoRequestDTO editRequest = new ObjetivoRequestDTO();
        editRequest.setCantidadObjetivo(2500.0);

        ObjetivoResponseDTO result = objetivoService.editarObjetivo(1, editRequest, "testuser", "pass");

        assertNotNull(result);
        assertEquals(2500.0, result.getCantidadObjetivo());
        verify(objetivoRepository).save(argThat(o -> o.getCantidadObjetivo() == 2500.0));
    }

    @Test
    void editarObjetivo_noExiste_lanzaIllegalArgumentException() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(objetivoRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> objetivoService.editarObjetivo(999, objetivoRequestDTO, "testuser", "pass"));
    }

    @Test
    void obtenerObjetivo_existe_retornaDTO() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(objetivoRepository.findFirstByUsuarioIdOrderByFechaInicioDesc(1))
                .thenReturn(Optional.of(objetivoVigente));
        when(objetivoMapper.convertirADTO(objetivoVigente)).thenReturn(objetivoResponseDTO);

        ObjetivoResponseDTO result = objetivoService.obtenerObjetivo(1, "testuser", "pass");

        assertNotNull(result);
        assertEquals(1500.0, result.getCantidadObjetivo());
    }

    @Test
    void obtenerObjetivo_noExiste_retornaNull() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(objetivoRepository.findFirstByUsuarioIdOrderByFechaInicioDesc(1)).thenReturn(Optional.empty());

        ObjetivoResponseDTO result = objetivoService.obtenerObjetivo(1, "testuser", "pass");

        assertNull(result);
    }

    @Test
    void obtenerUltimoObjetivo_existeExpirado_retornaDTO() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        ObjetivoResponseDTO expiradoDTO = new ObjetivoResponseDTO();
        expiradoDTO.setCantidadObjetivo(1000.0);

        when(objetivoRepository.findFirstByUsuarioIdAndFechaFinBeforeOrderByFechaFinDesc(eq(1), any()))
                .thenReturn(Optional.of(objetivoExpirado));
        when(objetivoMapper.convertirADTO(objetivoExpirado)).thenReturn(expiradoDTO);

        ObjetivoResponseDTO result = objetivoService.obtenerUltimoObjetivo(1, "testuser", "pass");

        assertNotNull(result);
        assertEquals(1000.0, result.getCantidadObjetivo());
    }

    @Test
    void obtenerUltimoObjetivo_noExiste_retornaNull() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(objetivoRepository.findFirstByUsuarioIdAndFechaFinBeforeOrderByFechaFinDesc(eq(1), any()))
                .thenReturn(Optional.empty());

        ObjetivoResponseDTO result = objetivoService.obtenerUltimoObjetivo(1, "testuser", "pass");

        assertNull(result);
    }
}
