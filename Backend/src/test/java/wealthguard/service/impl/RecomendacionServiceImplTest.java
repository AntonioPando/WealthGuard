// package wealthguard.service.impl;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;

// import wealthguard.dto.RecomendacionResponseDTO;
// import wealthguard.entity.RecomendacionEntity;
// import wealthguard.entity.TipoRecomendacionEntity;
// import wealthguard.entity.UsuarioEntity;
// import wealthguard.mapper.RecomendacionMapper;
// import wealthguard.repository.RecomendacionRepository;
// import wealthguard.repository.TipoRecomendacionRepository;
// import wealthguard.repository.UsuarioRepository;

// import java.time.LocalDateTime;
// import java.util.Arrays;
// import java.util.Collections;
// import java.util.List;
// import java.util.Optional;

// import static org.assertj.core.api.Assertions.*;
// import static org.mockito.ArgumentMatchers.*;
// import static org.mockito.Mockito.*;

// @ExtendWith(MockitoExtension.class)
// class RecomendacionServiceImplTest {

//     @Mock private RecomendacionRepository recomendacionRepository;
//     @Mock private UsuarioRepository usuarioRepository;
//     @Mock private TipoRecomendacionRepository tipoRecomendacionRepository;
//     @Mock private RecomendacionMapper recomendacionMapper;

//     @InjectMocks
//     private RecomendacionServiceImpl recomendacionService;

//     private UsuarioEntity usuario;
//     private TipoRecomendacionEntity tipoRecomendacion;
//     private RecomendacionEntity recomendacionEntity;
//     private RecomendacionResponseDTO recomendacionDTO;

//     @BeforeEach
//     void setUp() {
//         usuario = new UsuarioEntity();
//         usuario.setId(1);

//         tipoRecomendacion = new TipoRecomendacionEntity();
//         tipoRecomendacion.setId(10);
//         tipoRecomendacion.setScoreMinimo(0);
//         tipoRecomendacion.setScoreMaximo(50);

//         recomendacionEntity = new RecomendacionEntity();
//         recomendacionEntity.setId(100);
//         recomendacionEntity.setUsuario(usuario);
//         recomendacionEntity.setTipoRecomendacion(tipoRecomendacion);
//         recomendacionEntity.setFechaRecomendacion(LocalDateTime.now());

//         recomendacionDTO = new RecomendacionResponseDTO();
//     }

//     // ─── generarRecomendaciones ───────────────────────────────────────────────

//     @Test
//     @DisplayName("generarRecomendaciones: score en mismo rango que la última — devuelve historial sin nueva fila")
//     void generarRecomendaciones_mismoRango_devuelveHistorialExistente() {
//         int score = 30; // dentro del rango 0-50
//         when(recomendacionRepository.findByUsuarioIdOrderByFechaRecomendacionDesc(1))
//                 .thenReturn(List.of(recomendacionEntity));
//         when(recomendacionMapper.convertirADTO(recomendacionEntity)).thenReturn(recomendacionDTO);

//         List<RecomendacionResponseDTO> resultado = recomendacionService.generarRecomendaciones(1, score);

//         assertThat(resultado).hasSize(1);
//         verify(recomendacionRepository, never()).save(any());
//     }

//     @Test
//     @DisplayName("generarRecomendaciones: primera evaluación (sin historial) — crea nueva recomendación")
//     void generarRecomendaciones_sinHistorial_creaRecomendacion() {
//         int score = 40;
//         when(recomendacionRepository.findByUsuarioIdOrderByFechaRecomendacionDesc(1))
//                 .thenReturn(Collections.emptyList())
//                 .thenReturn(List.of(recomendacionEntity));
//         when(tipoRecomendacionRepository.findByScore(score)).thenReturn(List.of(tipoRecomendacion));
//         when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario));
//         when(recomendacionMapper.convertirADTO(recomendacionEntity)).thenReturn(recomendacionDTO);

//         List<RecomendacionResponseDTO> resultado = recomendacionService.generarRecomendaciones(1, score);

//         verify(recomendacionRepository).save(any(RecomendacionEntity.class));
//         assertThat(resultado).isNotNull();
//     }

//     @Test
//     @DisplayName("generarRecomendaciones: score cambia de rango — crea nueva entrada en historial")
//     void generarRecomendaciones_cambioDerango_creaNuevaRecomendacion() {
//         int scoreNuevo = 80; // fuera del rango 0-50

//         when(recomendacionRepository.findByUsuarioIdOrderByFechaRecomendacionDesc(1))
//                 .thenReturn(List.of(recomendacionEntity))
//                 .thenReturn(List.of(recomendacionEntity)); // historial actualizado

//         TipoRecomendacionEntity tipoNuevo = new TipoRecomendacionEntity();
//         tipoNuevo.setScoreMinimo(60);
//         tipoNuevo.setScoreMaximo(100);
//         when(tipoRecomendacionRepository.findByScore(scoreNuevo)).thenReturn(List.of(tipoNuevo));
//         when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario));
//         when(recomendacionMapper.convertirADTO(any())).thenReturn(recomendacionDTO);

//         List<RecomendacionResponseDTO> resultado = recomendacionService.generarRecomendaciones(1, scoreNuevo);

//         verify(recomendacionRepository).save(any(RecomendacionEntity.class));
//         assertThat(resultado).isNotNull();
//     }

//     @Test
//     @DisplayName("generarRecomendaciones: sin candidatos de tipo — devuelve historial sin guardar")
//     void generarRecomendaciones_sinCandidatos_devuelveHistorialSinGuardar() {
//         int score = 80;
//         when(recomendacionRepository.findByUsuarioIdOrderByFechaRecomendacionDesc(1))
//                 .thenReturn(Collections.emptyList());
//         when(tipoRecomendacionRepository.findByScore(score)).thenReturn(Collections.emptyList());

//         List<RecomendacionResponseDTO> resultado = recomendacionService.generarRecomendaciones(1, score);

//         verify(recomendacionRepository, never()).save(any());
//         assertThat(resultado).isEmpty();
//     }

//     @Test
//     @DisplayName("generarRecomendaciones: usuario no encontrado — lanza RuntimeException")
//     void generarRecomendaciones_usuarioNoExiste_lanzaExcepcion() {
//         int score = 80;
//         when(recomendacionRepository.findByUsuarioIdOrderByFechaRecomendacionDesc(1))
//                 .thenReturn(Collections.emptyList());
//         when(tipoRecomendacionRepository.findByScore(score)).thenReturn(List.of(tipoRecomendacion));
//         when(usuarioRepository.findById(1)).thenReturn(Optional.empty());

//         assertThatThrownBy(() -> recomendacionService.generarRecomendaciones(1, score))
//                 .isInstanceOf(RuntimeException.class)
//                 .hasMessageContaining("Usuario no encontrado");
//     }

//     @Test
//     @DisplayName("generarRecomendaciones: varios candidatos — selecciona el de rango más estrecho")
//     void generarRecomendaciones_variosCanidatos_seleccionaMasEspecifico() {
//         int score = 40;

//         TipoRecomendacionEntity amplio = new TipoRecomendacionEntity();
//         amplio.setScoreMinimo(0);
//         amplio.setScoreMaximo(100); // rango 100

//         TipoRecomendacionEntity estrecho = new TipoRecomendacionEntity();
//         estrecho.setScoreMinimo(30);
//         estrecho.setScoreMaximo(50); // rango 20 ← debe ganar

//         when(recomendacionRepository.findByUsuarioIdOrderByFechaRecomendacionDesc(1))
//                 .thenReturn(Collections.emptyList())
//                 .thenReturn(List.of(recomendacionEntity));
//         when(tipoRecomendacionRepository.findByScore(score)).thenReturn(List.of(amplio, estrecho));
//         when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario));
//         when(recomendacionMapper.convertirADTO(any())).thenReturn(recomendacionDTO);

//         recomendacionService.generarRecomendaciones(1, score);

//         verify(recomendacionRepository).save(argThat(r ->
//                 r.getTipoRecomendacion().getScoreMaximo() - r.getTipoRecomendacion().getScoreMinimo() == 20
//         ));
//     }

//     // ─── obtenerRecomendaciones ───────────────────────────────────────────────

//     @Test
//     @DisplayName("obtenerRecomendaciones: devuelve historial mapeado")
//     void obtenerRecomendaciones_devuelveListaMapeada() {
//         when(recomendacionRepository.findByUsuarioIdOrderByFechaRecomendacionDesc(1))
//                 .thenReturn(List.of(recomendacionEntity));
//         when(recomendacionMapper.convertirADTO(recomendacionEntity)).thenReturn(recomendacionDTO);

//         List<RecomendacionResponseDTO> resultado = recomendacionService.obtenerRecomendaciones(1);

//         assertThat(resultado).hasSize(1).contains(recomendacionDTO);
//     }

//     @Test
//     @DisplayName("obtenerRecomendaciones: sin historial — devuelve lista vacía")
//     void obtenerRecomendaciones_sinHistorial_devuelveListaVacia() {
//         when(recomendacionRepository.findByUsuarioIdOrderByFechaRecomendacionDesc(1))
//                 .thenReturn(Collections.emptyList());

//         List<RecomendacionResponseDTO> resultado = recomendacionService.obtenerRecomendaciones(1);

//         assertThat(resultado).isEmpty();
//     }

//     // ─── eliminarRecomendacion ────────────────────────────────────────────────

//     @Test
//     @DisplayName("eliminarRecomendacion: recomendación no existe — devuelve false")
//     void eliminarRecomendacion_noExiste_devuelveFalse() {
//         when(recomendacionRepository.findById(99)).thenReturn(Optional.empty());

//         boolean resultado = recomendacionService.eliminarRecomendacion(99);

//         assertThat(resultado).isFalse();
//         verify(recomendacionRepository, never()).deleteById(any());
//     }

//     @Test
//     @DisplayName("eliminarRecomendacion: es la vigente (la última) — devuelve false sin borrar")
//     void eliminarRecomendacion_esLaVigente_devuelveFalse() {
//         recomendacionEntity.setId(100);
//         when(recomendacionRepository.findById(100)).thenReturn(Optional.of(recomendacionEntity));
//         when(recomendacionRepository.findByUsuarioIdOrderByFechaRecomendacionDesc(1))
//                 .thenReturn(List.of(recomendacionEntity)); // la vigente tiene id=100

//         boolean resultado = recomendacionService.eliminarRecomendacion(100);

//         assertThat(resultado).isFalse();
//         verify(recomendacionRepository, never()).deleteById(any());
//     }

//     @Test
//     @DisplayName("eliminarRecomendacion: es una del historial anterior — elimina y devuelve true")
//     void eliminarRecomendacion_esDelHistorial_eliminaYdevuelveTrue() {
//         RecomendacionEntity vigente = new RecomendacionEntity();
//         vigente.setId(200);
//         vigente.setUsuario(usuario);

//         recomendacionEntity.setId(100); // la que queremos borrar (no vigente)

//         when(recomendacionRepository.findById(100)).thenReturn(Optional.of(recomendacionEntity));
//         when(recomendacionRepository.findByUsuarioIdOrderByFechaRecomendacionDesc(1))
//                 .thenReturn(Arrays.asList(vigente, recomendacionEntity)); // vigente es la primera

//         boolean resultado = recomendacionService.eliminarRecomendacion(100);

//         assertThat(resultado).isTrue();
//         verify(recomendacionRepository).deleteById(100);
//     }
// }