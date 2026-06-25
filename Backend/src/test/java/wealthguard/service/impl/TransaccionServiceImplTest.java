// package wealthguard.service.impl;

// import java.time.LocalDateTime;
// import java.util.Collections;
// import java.util.List;
// import java.util.Optional;

// import static org.assertj.core.api.Assertions.assertThat;
// import static org.assertj.core.api.Assertions.assertThatThrownBy;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.ArgumentMatchers.eq;
// import static org.mockito.ArgumentMatchers.isNull;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import static org.mockito.Mockito.never;
// import static org.mockito.Mockito.verify;
// import static org.mockito.Mockito.when;
// import org.mockito.junit.jupiter.MockitoExtension;

// import wealthguard.dto.TransaccionRequestDTO;
// import wealthguard.dto.TransaccionResponseDTO;
// import wealthguard.entity.CategoriaEntity;
// import wealthguard.entity.ObjetivoEntity;
// import wealthguard.entity.TransaccionEntity;
// import wealthguard.mapper.TransaccionMapper;
// import wealthguard.repository.CategoriaRepository;
// import wealthguard.repository.ObjetivoRepository;
// import wealthguard.repository.TransaccionRepository;

// @ExtendWith(MockitoExtension.class)
// class TransaccionServiceImplTest {

//     @Mock private TransaccionRepository transaccionRepository;
//     @Mock private ObjetivoRepository objetivoRepository;
//     @Mock private CategoriaRepository categoriaRepository;
//     @Mock private TransaccionMapper transaccionMapper;

//     @InjectMocks
//     private TransaccionServiceImpl transaccionService;

//     private TransaccionEntity transaccionReciente;
//     private TransaccionEntity transaccionAntigua;
//     private TransaccionResponseDTO transaccionDTO;

//     @BeforeEach
//     void setUp() {
//         CategoriaEntity categoria = new CategoriaEntity();
//         categoria.setId(1);
//         categoria.setNombre("Alimentación");

//         transaccionReciente = new TransaccionEntity();
//         transaccionReciente.setId(1);
//         transaccionReciente.setFecha(LocalDateTime.now().minusDays(5));
//         transaccionReciente.setCantidad(100.0);
//         transaccionReciente.setTipoTransaccion(false); // gasto
//         transaccionReciente.setCategoria(categoria);

//         transaccionAntigua = new TransaccionEntity();
//         transaccionAntigua.setId(2);
//         transaccionAntigua.setFecha(LocalDateTime.now().minusMonths(4)); // más de 3 meses
//         transaccionAntigua.setCantidad(50.0);
//         transaccionAntigua.setCategoria(categoria);

//         transaccionDTO = new TransaccionResponseDTO();
//     }

//     // ─── listarTransacciones ──────────────────────────────────────────────────

//     @Test
//     @DisplayName("listarTransacciones: sin fechas — aplica rango de últimos 7 días por defecto")
//     void listarTransacciones_sinFechas_aplicaRangoPorDefecto() {
//         when(transaccionRepository.buscarConFiltros(eq(1), any(), any(), isNull(), isNull(), isNull(), isNull()))
//                 .thenReturn(List.of(transaccionReciente));
//         when(transaccionMapper.convertirADTO(transaccionReciente)).thenReturn(transaccionDTO);

//         List<TransaccionResponseDTO> resultado = transaccionService.listarTransacciones(
//                 1, null, null, null, null, null, null);

//         assertThat(resultado).hasSize(1);
//         verify(transaccionRepository).buscarConFiltros(eq(1), any(), any(), isNull(), isNull(), isNull(), isNull());
//     }

//     @Test
//     @DisplayName("listarTransacciones: con fechas explícitas — las pasa tal cual al repositorio")
//     void listarTransacciones_conFechas_pasaFechasAlRepositorio() {
//         LocalDateTime inicio = LocalDateTime.now().minusDays(30);
//         LocalDateTime fin = LocalDateTime.now();

//         when(transaccionRepository.buscarConFiltros(eq(1), eq(inicio), eq(fin), isNull(), isNull(), isNull(), isNull()))
//                 .thenReturn(Collections.emptyList());

//         List<TransaccionResponseDTO> resultado = transaccionService.listarTransacciones(
//                 1, inicio, fin, null, null, null, null);

//         assertThat(resultado).isEmpty();
//     }

//     // ─── crearTransaccion ─────────────────────────────────────────────────────

//     @Test
//     @DisplayName("crearTransaccion: categoría válida — guarda y devuelve DTO")
//     void crearTransaccion_categoriaValida_guardaYdevuelveDTO() {
//         TransaccionRequestDTO requestDTO = new TransaccionRequestDTO();
//         CategoriaEntity categoria = new CategoriaEntity();
//         categoria.setId(1);
//         transaccionReciente.setCategoria(categoria);

//         when(transaccionMapper.convertirAEntity(requestDTO)).thenReturn(transaccionReciente);
//         when(categoriaRepository.findById(1)).thenReturn(Optional.of(categoria));
//         when(transaccionRepository.save(transaccionReciente)).thenReturn(transaccionReciente);
//         when(transaccionMapper.convertirADTO(transaccionReciente)).thenReturn(transaccionDTO);

//         TransaccionResponseDTO resultado = transaccionService.crearTransaccion(requestDTO);

//         assertThat(resultado).isNotNull();
//         verify(transaccionRepository).save(transaccionReciente);
//     }

//     @Test
//     @DisplayName("crearTransaccion: categoría no encontrada — lanza RuntimeException")
//     void crearTransaccion_categoriaNoExiste_lanzaExcepcion() {
//         TransaccionRequestDTO requestDTO = new TransaccionRequestDTO();
//         CategoriaEntity categoria = new CategoriaEntity();
//         categoria.setId(99);
//         transaccionReciente.setCategoria(categoria);

//         when(transaccionMapper.convertirAEntity(requestDTO)).thenReturn(transaccionReciente);
//         when(categoriaRepository.findById(99)).thenReturn(Optional.empty());

//         assertThatThrownBy(() -> transaccionService.crearTransaccion(requestDTO))
//                 .isInstanceOf(RuntimeException.class)
//                 .hasMessageContaining("Categoría no encontrada");
//     }

//     @Test
//     @DisplayName("crearTransaccion: sin categoría — guarda directamente sin buscar categoría")
//     void crearTransaccion_sinCategoria_guardaSinBuscarCategoria() {
//         TransaccionRequestDTO requestDTO = new TransaccionRequestDTO();
//         TransaccionEntity sinCategoria = new TransaccionEntity();
//         sinCategoria.setCategoria(null);

//         when(transaccionMapper.convertirAEntity(requestDTO)).thenReturn(sinCategoria);
//         when(transaccionRepository.save(sinCategoria)).thenReturn(sinCategoria);
//         when(transaccionMapper.convertirADTO(sinCategoria)).thenReturn(transaccionDTO);

//         TransaccionResponseDTO resultado = transaccionService.crearTransaccion(requestDTO);

//         assertThat(resultado).isNotNull();
//         verify(categoriaRepository, never()).findById(any());
//     }

//     // ─── editarTransaccion ────────────────────────────────────────────────────

//     @Test
//     @DisplayName("editarTransaccion: transacción no encontrada — lanza RuntimeException")
//     void editarTransaccion_noExiste_lanzaExcepcion() {
//         when(transaccionRepository.findById(99)).thenReturn(Optional.empty());

//         assertThatThrownBy(() -> transaccionService.editarTransaccion(99, new TransaccionRequestDTO()))
//                 .isInstanceOf(RuntimeException.class)
//                 .hasMessageContaining("Transaccion no encontrada");
//     }

//     @Test
//     @DisplayName("editarTransaccion: más de 3 meses de antigüedad — lanza RuntimeException")
//     void editarTransaccion_muyAntigua_lanzaExcepcion() {
//         when(transaccionRepository.findById(2)).thenReturn(Optional.of(transaccionAntigua));

//         assertThatThrownBy(() -> transaccionService.editarTransaccion(2, new TransaccionRequestDTO()))
//                 .isInstanceOf(RuntimeException.class)
//                 .hasMessageContaining("3 meses");
//     }

//     @Test
//     @DisplayName("editarTransaccion: reciente y existente — actualiza y devuelve DTO")
//     void editarTransaccion_recienteYExistente_actualizaYdevuelveDTO() {
//         TransaccionRequestDTO requestDTO = new TransaccionRequestDTO();
//         when(transaccionRepository.findById(1)).thenReturn(Optional.of(transaccionReciente));
//         when(transaccionMapper.convertirAEntity(requestDTO)).thenReturn(transaccionReciente);
//         when(transaccionRepository.save(transaccionReciente)).thenReturn(transaccionReciente);
//         when(transaccionMapper.convertirADTO(transaccionReciente)).thenReturn(transaccionDTO);

//         TransaccionResponseDTO resultado = transaccionService.editarTransaccion(1, requestDTO);

//         assertThat(resultado).isNotNull();
//         verify(transaccionRepository).save(transaccionReciente);
//     }

//     // ─── eliminarTransaccion ──────────────────────────────────────────────────

//     @Test
//     @DisplayName("eliminarTransaccion: no existe — devuelve false")
//     void eliminarTransaccion_noExiste_devuelveFalse() {
//         when(transaccionRepository.findById(99)).thenReturn(Optional.empty());

//         boolean resultado = transaccionService.eliminarTransaccion(99);

//         assertThat(resultado).isFalse();
//         verify(transaccionRepository, never()).deleteById(any());
//     }

//     @Test
//     @DisplayName("eliminarTransaccion: más de 3 meses — devuelve false sin borrar")
//     void eliminarTransaccion_muyAntigua_devuelveFalse() {
//         when(transaccionRepository.findById(2)).thenReturn(Optional.of(transaccionAntigua));

//         boolean resultado = transaccionService.eliminarTransaccion(2);

//         assertThat(resultado).isFalse();
//         verify(transaccionRepository, never()).deleteById(any());
//     }

//     @Test
//     @DisplayName("eliminarTransaccion: reciente y existente — elimina y devuelve true")
//     void eliminarTransaccion_recienteYExistente_eliminaYdevuelveTrue() {
//         when(transaccionRepository.findById(1)).thenReturn(Optional.of(transaccionReciente));

//         boolean resultado = transaccionService.eliminarTransaccion(1);

//         assertThat(resultado).isTrue();
//         verify(transaccionRepository).deleteById(1);
//     }

//     // ─── obtenerTendencia ─────────────────────────────────────────────────────

//     @Test
//     @DisplayName("obtenerTendencia: balance anterior 0 y actual positivo — devuelve 100.0")
//     void obtenerTendencia_anteriorCeroActualPositivo_devuelve100() {
//         when(transaccionRepository.obtenerBalanceEntreFechas(eq(1), any(), any()))
//                 .thenReturn(500.0)  // mes actual
//                 .thenReturn(0.0);   // mes anterior

//         double resultado = transaccionService.obtenerTendencia(1);

//         assertThat(resultado).isEqualTo(100.0);
//     }

//     @Test
//     @DisplayName("obtenerTendencia: ambos balances 0 — devuelve 0.0")
//     void obtenerTendencia_ambosBalancesCero_devuelveCero() {
//         when(transaccionRepository.obtenerBalanceEntreFechas(eq(1), any(), any()))
//                 .thenReturn(null)
//                 .thenReturn(null);

//         double resultado = transaccionService.obtenerTendencia(1);

//         assertThat(resultado).isEqualTo(0.0);
//     }

//     @Test
//     @DisplayName("obtenerTendencia: balance actual 150, anterior 100 — devuelve 50.0%")
//     void obtenerTendencia_calculoNormal_devuelvePorcentajeCorrecto() {
//         when(transaccionRepository.obtenerBalanceEntreFechas(eq(1), any(), any()))
//                 .thenReturn(150.0)
//                 .thenReturn(100.0);

//         double resultado = transaccionService.obtenerTendencia(1);

//         assertThat(resultado).isEqualTo(50.0);
//     }

//     @Test
//     @DisplayName("obtenerTendencia: balance actual 50, anterior 100 — devuelve -50.0%")
//     void obtenerTendencia_balanceBaja_devuelveNegativo() {
//         when(transaccionRepository.obtenerBalanceEntreFechas(eq(1), any(), any()))
//                 .thenReturn(50.0)
//                 .thenReturn(100.0);

//         double resultado = transaccionService.obtenerTendencia(1);

//         assertThat(resultado).isEqualTo(-50.0);
//     }

//     // ─── obtenerCategoriaPrincipal ────────────────────────────────────────────

//     @Test
//     @DisplayName("obtenerCategoriaPrincipal: sin gastos este mes — devuelve ['Sin datos', '0.0']")
//     void obtenerCategoriaPrincipal_sinGastos_devuelveSinDatos() {
//         // Transacción de ingreso (no cuenta como gasto)
//         transaccionReciente.setTipoTransaccion(true);
//         when(transaccionRepository.findByUsuarioId(1)).thenReturn(List.of(transaccionReciente));

//         String[] resultado = transaccionService.obtenerCategoriaPrincipal(1);

//         assertThat(resultado[0]).isEqualTo("Sin datos");
//         assertThat(resultado[1]).isEqualTo("0.0");
//     }

//     @Test
//     @DisplayName("obtenerCategoriaPrincipal: varios gastos — devuelve categoría con mayor importe")
//     void obtenerCategoriaPrincipal_variosGastos_devuelveCategoriaMayor() {
//         CategoriaEntity catOcio = new CategoriaEntity();
//         catOcio.setNombre("Ocio");

//         TransaccionEntity gastoOcio = new TransaccionEntity();
//         gastoOcio.setTipoTransaccion(false);
//         gastoOcio.setFecha(LocalDateTime.now()); // este mes
//         gastoOcio.setCantidad(200.0);
//         gastoOcio.setCategoria(catOcio);

//         // transaccionReciente ya es gasto de 100 en "Alimentación"
//         when(transaccionRepository.findByUsuarioId(1))
//                 .thenReturn(List.of(transaccionReciente, gastoOcio));

//         String[] resultado = transaccionService.obtenerCategoriaPrincipal(1);

//         assertThat(resultado[0]).isEqualTo("Ocio");
//     }

//     // ─── obtenerMeta ─────────────────────────────────────────────────────────

//     @Test
//     @DisplayName("obtenerMeta: sin objetivo — devuelve [0.0, 0.0]")
//     void obtenerMeta_sinObjetivo_devuelveCeros() {
//         when(objetivoRepository.findFirstByUsuarioIdOrderByFechaInicioDesc(1))
//                 .thenReturn(Optional.empty());

//         double[] resultado = transaccionService.obtenerMeta(1);

//         assertThat(resultado).containsExactly(0.0, 0.0);
//     }

//     @Test
//     @DisplayName("obtenerMeta: objetivo caducado — devuelve [0.0, 0.0]")
//     void obtenerMeta_objetivoCaducado_devuelveCeros() {
//         ObjetivoEntity objetivo = new ObjetivoEntity();
//         objetivo.setFechaFin(LocalDateTime.now().minusDays(1)); // ya caducó
//         objetivo.setCantidadObjetivo(1000.0);

//         when(objetivoRepository.findFirstByUsuarioIdOrderByFechaInicioDesc(1))
//                 .thenReturn(Optional.of(objetivo));

//         double[] resultado = transaccionService.obtenerMeta(1);

//         assertThat(resultado).containsExactly(0.0, 0.0);
//     }

//     @Test
//     @DisplayName("obtenerMeta: objetivo vigente con progreso al 50% — devuelve progreso y meta")
//     void obtenerMeta_objetivoVigente_devuelveProgresoYMeta() {
//         ObjetivoEntity objetivo = new ObjetivoEntity();
//         objetivo.setFechaFin(LocalDateTime.now().plusDays(15));
//         objetivo.setCantidadObjetivo(1000.0);

//         TransaccionEntity ingreso = new TransaccionEntity();
//         ingreso.setTipoTransaccion(true);
//         ingreso.setCantidad(600.0);

//         TransaccionEntity gasto = new TransaccionEntity();
//         gasto.setTipoTransaccion(false);
//         gasto.setCantidad(100.0);

//         when(objetivoRepository.findFirstByUsuarioIdOrderByFechaInicioDesc(1))
//                 .thenReturn(Optional.of(objetivo));
//         when(transaccionRepository.buscarConFiltros(eq(1), any(), any(), isNull(), isNull(), isNull(), isNull()))
//                 .thenReturn(List.of(ingreso, gasto));

//         double[] resultado = transaccionService.obtenerMeta(1);

//         // progreso = 600 - 100 = 500; meta = 1000
//         assertThat(resultado[0]).isEqualTo(500.0);
//         assertThat(resultado[1]).isEqualTo(1000.0);
//     }

//     @Test
//     @DisplayName("obtenerMeta: progreso supera la meta — porcentaje se capea al 100%")
//     void obtenerMeta_progresoSuperaMeta_porcentajeCapadoA100() {
//         ObjetivoEntity objetivo = new ObjetivoEntity();
//         objetivo.setFechaFin(LocalDateTime.now().plusDays(15));
//         objetivo.setCantidadObjetivo(100.0); // meta pequeña

//         TransaccionEntity ingreso = new TransaccionEntity();
//         ingreso.setTipoTransaccion(true);
//         ingreso.setCantidad(500.0); // supera la meta

//         when(objetivoRepository.findFirstByUsuarioIdOrderByFechaInicioDesc(1))
//                 .thenReturn(Optional.of(objetivo));
//         when(transaccionRepository.buscarConFiltros(eq(1), any(), any(), isNull(), isNull(), isNull(), isNull()))
//                 .thenReturn(List.of(ingreso));

//         double[] resultado = transaccionService.obtenerMeta(1);

//         // El servicio devuelve [progresoActual, cantidadMeta], no el porcentaje
//         assertThat(resultado[0]).isEqualTo(500.0);
//         assertThat(resultado[1]).isEqualTo(100.0);
//     }

//     // ─── listarTodasPorUsuario ────────────────────────────────────────────────

//     @Test
//     @DisplayName("listarTodasPorUsuario: devuelve todas las transacciones mapeadas")
//     void listarTodasPorUsuario_devuelveTodasMapeadas() {
//         when(transaccionRepository.findByUsuarioId(1)).thenReturn(List.of(transaccionReciente));
//         when(transaccionMapper.convertirADTO(transaccionReciente)).thenReturn(transaccionDTO);

//         List<TransaccionResponseDTO> resultado = transaccionService.listarTodasPorUsuario(1);

//         assertThat(resultado).hasSize(1);
//     }

//     @Test
//     @DisplayName("listarTodasPorUsuario: sin transacciones — devuelve lista vacía")
//     void listarTodasPorUsuario_sinTransacciones_devuelveListaVacia() {
//         when(transaccionRepository.findByUsuarioId(1)).thenReturn(Collections.emptyList());

//         List<TransaccionResponseDTO> resultado = transaccionService.listarTodasPorUsuario(1);

//         assertThat(resultado).isEmpty();
//     }
// }