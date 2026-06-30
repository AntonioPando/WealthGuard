package wealthguard.service.impl;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import wealthguard.dto.TransaccionRequestDTO;
import wealthguard.dto.TransaccionResponseDTO;
import wealthguard.entity.CategoriaEntity;
import wealthguard.entity.ObjetivoEntity;
import wealthguard.entity.TransaccionEntity;
import wealthguard.mapper.TransaccionMapper;
import wealthguard.repository.CategoriaRepository;
import wealthguard.repository.ObjetivoRepository;
import wealthguard.repository.TransaccionRepository;
import wealthguard.service.LoginService;

@ExtendWith(MockitoExtension.class)
class TransaccionServiceImplTest {

    @Mock
    private TransaccionRepository transaccionRepository;
    @Mock
    private ObjetivoRepository objetivoRepository;
    @Mock
    private CategoriaRepository categoriaRepository;
    @Mock
    private TransaccionMapper transaccionMapper;
    @Mock
    private LoginService loginService;

    @InjectMocks
    private TransaccionServiceImpl transaccionService;

    private static final String NICK = "testuser";
    private static final String PASS = "pass";

    private TransaccionEntity transaccionReciente;
    private TransaccionEntity transaccionAntigua;
    private TransaccionResponseDTO transaccionDTO;

    @BeforeEach
    void setUp() {
        CategoriaEntity categoria = new CategoriaEntity();
        categoria.setId(1);
        categoria.setNombre("Alimentación");

        transaccionReciente = new TransaccionEntity();
        transaccionReciente.setId(1);
        transaccionReciente.setFecha(LocalDateTime.now().minusDays(5));
        transaccionReciente.setCantidad(100.0);
        transaccionReciente.setTipoTransaccion(false);
        transaccionReciente.setCategoria(categoria);

        transaccionAntigua = new TransaccionEntity();
        transaccionAntigua.setId(2);
        transaccionAntigua.setFecha(LocalDateTime.now().minusMonths(4));
        transaccionAntigua.setCantidad(50.0);
        transaccionAntigua.setCategoria(categoria);

        transaccionDTO = new TransaccionResponseDTO();
    }

    @Test
    @DisplayName("listarTransacciones: sin fechas — aplica rango de últimos 7 días por defecto")
    void listarTransacciones_sinFechas_aplicaRangoPorDefecto() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(transaccionRepository.buscarConFiltros(eq(1), any(), any(), isNull(), isNull(), isNull(), isNull()))
                .thenReturn(List.of(transaccionReciente));
        when(transaccionMapper.convertirADTO(transaccionReciente)).thenReturn(transaccionDTO);

        List<TransaccionResponseDTO> resultado = transaccionService.listarTransacciones(
                1, null, null, null, null, null, null, NICK, PASS);

        assertThat(resultado).hasSize(1);
        verify(transaccionRepository).buscarConFiltros(eq(1), any(), any(), isNull(), isNull(), isNull(), isNull());
    }

    @Test
    @DisplayName("listarTransacciones: con fechas explícitas — las pasa tal cual al repositorio")
    void listarTransacciones_conFechas_pasaFechasAlRepositorio() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        LocalDateTime inicio = LocalDateTime.now().minusDays(30);
        LocalDateTime fin = LocalDateTime.now();

        when(transaccionRepository.buscarConFiltros(eq(1), eq(inicio), eq(fin), isNull(), isNull(), isNull(), isNull()))
                .thenReturn(Collections.emptyList());

        List<TransaccionResponseDTO> resultado = transaccionService.listarTransacciones(
                1, inicio, fin, null, null, null, null, NICK, PASS);

        assertThat(resultado).isEmpty();
    }

    @Test
    @DisplayName("crearTransaccion: categoría válida — guarda y devuelve DTO")
    void crearTransaccion_categoriaValida_guardaYdevuelveDTO() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        TransaccionRequestDTO requestDTO = new TransaccionRequestDTO();
        CategoriaEntity categoria = new CategoriaEntity();
        categoria.setId(1);
        transaccionReciente.setCategoria(categoria);

        when(transaccionMapper.convertirAEntity(requestDTO)).thenReturn(transaccionReciente);
        when(categoriaRepository.findById(1)).thenReturn(Optional.of(categoria));
        when(transaccionRepository.save(transaccionReciente)).thenReturn(transaccionReciente);
        when(transaccionMapper.convertirADTO(transaccionReciente)).thenReturn(transaccionDTO);

        TransaccionResponseDTO resultado = transaccionService.crearTransaccion(requestDTO, NICK, PASS);

        assertThat(resultado).isNotNull();
        verify(transaccionRepository).save(transaccionReciente);
    }

    @Test
    @DisplayName("crearTransaccion: categoría no encontrada — lanza RuntimeException")
    void crearTransaccion_categoriaNoExiste_lanzaExcepcion() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        TransaccionRequestDTO requestDTO = new TransaccionRequestDTO();
        CategoriaEntity categoria = new CategoriaEntity();
        categoria.setId(99);
        transaccionReciente.setCategoria(categoria);

        when(transaccionMapper.convertirAEntity(requestDTO)).thenReturn(transaccionReciente);
        when(categoriaRepository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> transaccionService.crearTransaccion(requestDTO, NICK, PASS))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Categoría no encontrada");
    }

    @Test
    @DisplayName("crearTransaccion: sin categoría — guarda directamente sin buscar categoría")
    void crearTransaccion_sinCategoria_guardaSinBuscarCategoria() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        TransaccionRequestDTO requestDTO = new TransaccionRequestDTO();
        TransaccionEntity sinCategoria = new TransaccionEntity();
        sinCategoria.setCategoria(null);

        when(transaccionMapper.convertirAEntity(requestDTO)).thenReturn(sinCategoria);
        when(transaccionRepository.save(sinCategoria)).thenReturn(sinCategoria);
        when(transaccionMapper.convertirADTO(sinCategoria)).thenReturn(transaccionDTO);

        TransaccionResponseDTO resultado = transaccionService.crearTransaccion(requestDTO, NICK, PASS);

        assertThat(resultado).isNotNull();
        verify(categoriaRepository, never()).findById(any());
    }

    @Test
    @DisplayName("editarTransaccion: transacción no encontrada — lanza RuntimeException")
    void editarTransaccion_noExiste_lanzaExcepcion() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(transaccionRepository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> transaccionService.editarTransaccion(99, new TransaccionRequestDTO(), NICK, PASS))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Transaccion no encontrada");
    }

    @Test
    @DisplayName("editarTransaccion: más de 3 meses de antigüedad — lanza RuntimeException")
    void editarTransaccion_muyAntigua_lanzaExcepcion() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(transaccionRepository.findById(2)).thenReturn(Optional.of(transaccionAntigua));

        assertThatThrownBy(() -> transaccionService.editarTransaccion(2, new TransaccionRequestDTO(), NICK, PASS))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("3 meses");
    }

    @Test
    @DisplayName("editarTransaccion: reciente y existente — actualiza y devuelve DTO")
    void editarTransaccion_recienteYExistente_actualizaYdevuelveDTO() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        TransaccionRequestDTO requestDTO = new TransaccionRequestDTO();
        when(transaccionRepository.findById(1)).thenReturn(Optional.of(transaccionReciente));
        when(transaccionMapper.convertirAEntity(requestDTO)).thenReturn(transaccionReciente);
        when(transaccionRepository.save(transaccionReciente)).thenReturn(transaccionReciente);
        when(transaccionMapper.convertirADTO(transaccionReciente)).thenReturn(transaccionDTO);

        TransaccionResponseDTO resultado = transaccionService.editarTransaccion(1, requestDTO, NICK, PASS);

        assertThat(resultado).isNotNull();
        verify(transaccionRepository).save(transaccionReciente);
    }

    @Test
    @DisplayName("eliminarTransaccion: no existe — devuelve false")
    void eliminarTransaccion_noExiste_devuelveFalse() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(transaccionRepository.findById(99)).thenReturn(Optional.empty());

        boolean resultado = transaccionService.eliminarTransaccion(99, NICK, PASS);

        assertThat(resultado).isFalse();
        verify(transaccionRepository, never()).deleteById(any());
    }

    @Test
    @DisplayName("eliminarTransaccion: más de 3 meses — devuelve false sin borrar")
    void eliminarTransaccion_muyAntigua_devuelveFalse() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(transaccionRepository.findById(2)).thenReturn(Optional.of(transaccionAntigua));

        boolean resultado = transaccionService.eliminarTransaccion(2, NICK, PASS);

        assertThat(resultado).isFalse();
        verify(transaccionRepository, never()).deleteById(any());
    }

    @Test
    @DisplayName("eliminarTransaccion: reciente y existente — elimina y devuelve true")
    void eliminarTransaccion_recienteYExistente_eliminaYdevuelveTrue() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(transaccionRepository.findById(1)).thenReturn(Optional.of(transaccionReciente));

        boolean resultado = transaccionService.eliminarTransaccion(1, NICK, PASS);

        assertThat(resultado).isTrue();
        verify(transaccionRepository).deleteById(1);
    }

    @Test
    @DisplayName("obtenerTendencia: balance anterior 0 y actual positivo — devuelve 100.0")
    void obtenerTendencia_anteriorCeroActualPositivo_devuelve100() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(transaccionRepository.obtenerBalanceEntreFechas(eq(1), any(), any()))
                .thenReturn(500.0)
                .thenReturn(0.0);

        double resultado = transaccionService.obtenerTendencia(1, NICK, PASS);

        assertThat(resultado).isEqualTo(100.0);
    }

    @Test
    @DisplayName("obtenerTendencia: ambos balances 0 — devuelve 0.0")
    void obtenerTendencia_ambosBalancesCero_devuelveCero() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(transaccionRepository.obtenerBalanceEntreFechas(eq(1), any(), any()))
                .thenReturn(null)
                .thenReturn(null);

        double resultado = transaccionService.obtenerTendencia(1, NICK, PASS);

        assertThat(resultado).isEqualTo(0.0);
    }

    @Test
    @DisplayName("obtenerTendencia: balance actual 150, anterior 100 — devuelve 50.0%")
    void obtenerTendencia_calculoNormal_devuelvePorcentajeCorrecto() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(transaccionRepository.obtenerBalanceEntreFechas(eq(1), any(), any()))
                .thenReturn(150.0)
                .thenReturn(100.0);

        double resultado = transaccionService.obtenerTendencia(1, NICK, PASS);

        assertThat(resultado).isEqualTo(50.0);
    }

    @Test
    @DisplayName("obtenerTendencia: balance actual 50, anterior 100 — devuelve -50.0%")
    void obtenerTendencia_balanceBaja_devuelveNegativo() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(transaccionRepository.obtenerBalanceEntreFechas(eq(1), any(), any()))
                .thenReturn(50.0)
                .thenReturn(100.0);

        double resultado = transaccionService.obtenerTendencia(1, NICK, PASS);

        assertThat(resultado).isEqualTo(-50.0);
    }

    @Test
    @DisplayName("obtenerCategoriaPrincipal: sin gastos este mes — devuelve ['Sin datos', '0.0']")
    void obtenerCategoriaPrincipal_sinGastos_devuelveSinDatos() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        transaccionReciente.setTipoTransaccion(true);
        when(transaccionRepository.findByUsuarioId(1)).thenReturn(List.of(transaccionReciente));

        String[] resultado = transaccionService.obtenerCategoriaPrincipal(1, NICK, PASS);

        assertThat(resultado[0]).isEqualTo("Sin datos");
        assertThat(resultado[1]).isEqualTo("0.0");
    }

    @Test
    @DisplayName("obtenerCategoriaPrincipal: varios gastos — devuelve categoría con mayor importe")
    void obtenerCategoriaPrincipal_variosGastos_devuelveCategoriaMayor() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        CategoriaEntity catOcio = new CategoriaEntity();
        catOcio.setNombre("Ocio");

        TransaccionEntity gastoOcio = new TransaccionEntity();
        gastoOcio.setTipoTransaccion(false);
        gastoOcio.setFecha(LocalDateTime.now());
        gastoOcio.setCantidad(200.0);
        gastoOcio.setCategoria(catOcio);

        when(transaccionRepository.findByUsuarioId(1))
                .thenReturn(List.of(transaccionReciente, gastoOcio));

        String[] resultado = transaccionService.obtenerCategoriaPrincipal(1, NICK, PASS);

        assertThat(resultado[0]).isEqualTo("Ocio");
    }

    @Test
    @DisplayName("obtenerMeta: sin objetivo — devuelve [0.0, 0.0]")
    void obtenerMeta_sinObjetivo_devuelveCeros() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(objetivoRepository.findFirstByUsuarioIdOrderByFechaInicioDesc(1))
                .thenReturn(Optional.empty());

        double[] resultado = transaccionService.obtenerMeta(1, NICK, PASS);

        assertThat(resultado).containsExactly(0.0, 0.0);
    }

    @Test
    @DisplayName("obtenerMeta: objetivo caducado — devuelve [0.0, 0.0]")
    void obtenerMeta_objetivoCaducado_devuelveCeros() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        ObjetivoEntity objetivo = new ObjetivoEntity();
        objetivo.setFechaFin(LocalDateTime.now().minusDays(1));
        objetivo.setCantidadObjetivo(1000.0);

        when(objetivoRepository.findFirstByUsuarioIdOrderByFechaInicioDesc(1))
                .thenReturn(Optional.of(objetivo));

        double[] resultado = transaccionService.obtenerMeta(1, NICK, PASS);

        assertThat(resultado).containsExactly(0.0, 0.0);
    }

    @Test
    @DisplayName("obtenerMeta: objetivo vigente — devuelve progreso y meta")
    void obtenerMeta_objetivoVigente_devuelveProgresoYMeta() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        ObjetivoEntity objetivo = new ObjetivoEntity();
        objetivo.setFechaFin(LocalDateTime.now().plusDays(15));
        objetivo.setCantidadObjetivo(1000.0);

        TransaccionEntity ingreso = new TransaccionEntity();
        ingreso.setTipoTransaccion(true);
        ingreso.setCantidad(600.0);

        TransaccionEntity gasto = new TransaccionEntity();
        gasto.setTipoTransaccion(false);
        gasto.setCantidad(100.0);

        when(objetivoRepository.findFirstByUsuarioIdOrderByFechaInicioDesc(1))
                .thenReturn(Optional.of(objetivo));
        when(transaccionRepository.buscarConFiltros(eq(1), any(), any(), isNull(), isNull(), isNull(), isNull()))
                .thenReturn(List.of(ingreso, gasto));

        double[] resultado = transaccionService.obtenerMeta(1, NICK, PASS);

        assertThat(resultado[0]).isEqualTo(500.0);
        assertThat(resultado[1]).isEqualTo(1000.0);
    }

    @Test
    @DisplayName("obtenerMeta: progreso supera la meta — devuelve progreso real y meta")
    void obtenerMeta_progresoSuperaMeta_devuelveProgresoReal() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        ObjetivoEntity objetivo = new ObjetivoEntity();
        objetivo.setFechaFin(LocalDateTime.now().plusDays(15));
        objetivo.setCantidadObjetivo(100.0);

        TransaccionEntity ingreso = new TransaccionEntity();
        ingreso.setTipoTransaccion(true);
        ingreso.setCantidad(500.0);

        when(objetivoRepository.findFirstByUsuarioIdOrderByFechaInicioDesc(1))
                .thenReturn(Optional.of(objetivo));
        when(transaccionRepository.buscarConFiltros(eq(1), any(), any(), isNull(), isNull(), isNull(), isNull()))
                .thenReturn(List.of(ingreso));

        double[] resultado = transaccionService.obtenerMeta(1, NICK, PASS);

        assertThat(resultado[0]).isEqualTo(500.0);
        assertThat(resultado[1]).isEqualTo(100.0);
    }

    @Test
    @DisplayName("listarTodasPorUsuario: devuelve todas las transacciones mapeadas")
    void listarTodasPorUsuario_devuelveTodasMapeadas() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(transaccionRepository.findByUsuarioId(1)).thenReturn(List.of(transaccionReciente));
        when(transaccionMapper.convertirADTO(transaccionReciente)).thenReturn(transaccionDTO);

        List<TransaccionResponseDTO> resultado = transaccionService.listarTodasPorUsuario(1, NICK, PASS);

        assertThat(resultado).hasSize(1);
    }

    @Test
    @DisplayName("listarTodasPorUsuario: sin transacciones — devuelve lista vacía")
    void listarTodasPorUsuario_sinTransacciones_devuelveListaVacia() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(transaccionRepository.findByUsuarioId(1)).thenReturn(Collections.emptyList());

        List<TransaccionResponseDTO> resultado = transaccionService.listarTodasPorUsuario(1, NICK, PASS);

        assertThat(resultado).isEmpty();
    }
}