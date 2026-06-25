package wealthguard.service.impl;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import wealthguard.dto.TransaccionRequestDTO;
import wealthguard.dto.TransaccionResponseDTO;
import wealthguard.entity.CategoriaEntity;
import wealthguard.entity.ObjetivoEntity;
import wealthguard.entity.TransaccionEntity;
import wealthguard.mapper.TransaccionMapper;
import wealthguard.repository.CategoriaRepository;
import wealthguard.repository.ObjetivoRepository;
import wealthguard.repository.TransaccionRepository;
import wealthguard.service.ITransaccionService;
import wealthguard.service.LoginService;

@Service
public class TransaccionServiceImpl implements ITransaccionService {

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Autowired
    private ObjetivoRepository objetivoRepository;

    @Autowired
    private TransaccionMapper transaccionMapper;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private LoginService loginService;

    @Override
    public List<TransaccionResponseDTO> listarTransacciones(Integer idUsuario, LocalDateTime fechaInicio,
            LocalDateTime fechaFin, Integer idCategoria, Boolean tipo, Double cantidad, String descripcion,
            String nickUsuario, String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        if (fechaFin == null)
            fechaFin = LocalDateTime.now();
        if (fechaInicio == null)
            fechaInicio = fechaFin.minusDays(7);

        List<TransaccionEntity> transacciones = transaccionRepository.buscarConFiltros(idUsuario, fechaInicio, fechaFin,
                idCategoria, tipo, cantidad, descripcion);

        return transacciones.stream()
                .map(transaccion -> transaccionMapper.convertirADTO(transaccion)).collect(Collectors.toList());
    }

    @Override
    public TransaccionResponseDTO crearTransaccion(TransaccionRequestDTO transaccionRequestDTO,
            String nickUsuario, String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        TransaccionEntity nuevaEntidad = transaccionMapper.convertirAEntity(transaccionRequestDTO);

        if (nuevaEntidad.getCategoria() != null) {
            CategoriaEntity categoriaReal = categoriaRepository.findById(nuevaEntidad.getCategoria().getId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            nuevaEntidad.setCategoria(categoriaReal);
        }
        TransaccionEntity entidadGuardada = transaccionRepository.save(nuevaEntidad);
        return transaccionMapper.convertirADTO(entidadGuardada);
    }

    @Override
    public TransaccionResponseDTO editarTransaccion(Integer idTransaccion,
            TransaccionRequestDTO transaccionRequestDTO, String nickUsuario, String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        TransaccionEntity transaccionExistente = transaccionRepository.findById(idTransaccion)
                .orElseThrow(() -> new RuntimeException("Transaccion no encontrada"));

        LocalDateTime limite = LocalDateTime.now().minusMonths(3);
        if (transaccionExistente.getFecha().isBefore(limite)) {
            throw new RuntimeException("No puedes editar transacciones con más de 3 meses de antigüedad.");
        }

        TransaccionEntity transaccionActualizada = transaccionMapper.convertirAEntity(transaccionRequestDTO);
        transaccionActualizada.setId(idTransaccion);

        TransaccionEntity entidadActualizada = transaccionRepository.save(transaccionActualizada);
        return transaccionMapper.convertirADTO(entidadActualizada);
    }

    @Override
    public boolean eliminarTransaccion(Integer idTransaccion, String nickUsuario, String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        TransaccionEntity transaccion = transaccionRepository.findById(idTransaccion)
                .orElse(null);

        if (transaccion == null) {
            return false;
        }

        LocalDateTime limite = LocalDateTime.now().minusMonths(3);
        if (transaccion.getFecha().isBefore(limite)) {
            return false;
        }

        try {
            transaccionRepository.deleteById(idTransaccion);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public double obtenerTendencia(int idUsuario, String nickUsuario, String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        YearMonth mesActual = YearMonth.now();
        YearMonth mesAnterior = mesActual.minusMonths(1);

        LocalDateTime inicioMesActual = mesActual.atDay(1).atStartOfDay();
        LocalDateTime finMesActual = mesActual.atEndOfMonth().atTime(LocalTime.MAX);

        LocalDateTime inicioMesAnterior = mesAnterior.atDay(1).atStartOfDay();
        LocalDateTime finMesAnterior = mesAnterior.atEndOfMonth().atTime(LocalTime.MAX);

        Double balanceActual = transaccionRepository.obtenerBalanceEntreFechas(idUsuario, inicioMesActual,
                finMesActual);
        Double balanceAnterior = transaccionRepository.obtenerBalanceEntreFechas(idUsuario, inicioMesAnterior,
                finMesAnterior);

        if (balanceActual == null) {
            balanceActual = 0.0;
        }
        if (balanceAnterior == null) {
            balanceAnterior = 0.0;
        }

        if (balanceAnterior == 0.0) {
            if (balanceActual > 0)
                return 100.0;
            else
                return 0.0;
        }

        return ((balanceActual - balanceAnterior) / Math.abs(balanceAnterior)) * 100;
    }

    @Override
    public String[] obtenerCategoriaPrincipal(int idUsuario, String nickUsuario, String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        java.time.YearMonth mesActual = java.time.YearMonth.now();
        LocalDateTime inicioMes = mesActual.atDay(1).atStartOfDay();
        LocalDateTime finMes = mesActual.atEndOfMonth().atTime(LocalTime.MAX);

        List<TransaccionEntity> transacciones = transaccionRepository.findByUsuarioId(idUsuario);

        java.util.Map<String, Double> sumasPorCategoria = new java.util.HashMap<>();
        double totalGastos = 0.0;

        for (TransaccionEntity t : transacciones) {

            boolean esGasto = t.getTipoTransaccion() != null && !t.getTipoTransaccion();
            boolean esDeEsteMes = t.getFecha() != null && !t.getFecha().isBefore(inicioMes)
                    && !t.getFecha().isAfter(finMes);

            if (esGasto && esDeEsteMes) {
                String nombreCat = t.getCategoria().getNombre();
                double cantidad = t.getCantidad();

                totalGastos += cantidad;

                double sumaAnterior = sumasPorCategoria.getOrDefault(nombreCat, 0.0);
                sumasPorCategoria.put(nombreCat, sumaAnterior + cantidad);
            }
        }

        if (totalGastos == 0.0) {
            return new String[] { "Sin datos", "0.0" };
        }

        String categoriaPrincipal = "";
        double maximoGasto = 0.0;

        for (java.util.Map.Entry<String, Double> entrada : sumasPorCategoria.entrySet()) {
            if (entrada.getValue() > maximoGasto) {
                maximoGasto = entrada.getValue();
                categoriaPrincipal = entrada.getKey();
            }
        }

        double porcentaje = (maximoGasto / totalGastos) * 100;

        return new String[] { categoriaPrincipal, String.format("%.2f", porcentaje) };
    }

    @Override
    @Transactional
    public double[] obtenerMeta(int idUsuario, String nickUsuario, String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        Optional<ObjetivoEntity> objetivos = objetivoRepository.findFirstByUsuarioIdOrderByFechaInicioDesc(idUsuario);

        if (objetivos.isEmpty()) {
            return new double[] { 0.0, 0.0 };
        }

        ObjetivoEntity metaActual = objetivos.get();

        if (metaActual.getFechaFin().isBefore(LocalDateTime.now())) {
            return new double[] { 0.0, 0.0 };
        }

        double cantidadMeta = metaActual.getCantidadObjetivo();

        YearMonth mesActual = YearMonth.now();
        LocalDateTime inicioMesActual = mesActual.atDay(1).atStartOfDay();
        LocalDateTime finMesActual = mesActual.atEndOfMonth().atTime(LocalTime.MAX);

        List<TransaccionEntity> transaccionesMeta = transaccionRepository.buscarConFiltros(idUsuario,
                inicioMesActual,
                finMesActual, null, null, null, null);

        double progresoActual = 0.0;
        if (transaccionesMeta != null) {
            for (TransaccionEntity transaccion : transaccionesMeta) {
                if (transaccion.getTipoTransaccion() != null && transaccion.getTipoTransaccion()) {
                    progresoActual += transaccion.getCantidad();
                } else {
                    progresoActual -= transaccion.getCantidad();
                }
            }
        }

        double porcentaje;
        if (cantidadMeta > 0) {
            porcentaje = (progresoActual / cantidadMeta) * 100;
        } else {
            porcentaje = 0.0;
        }

        if (porcentaje > 100.0) {
            porcentaje = 100.0;
        }

        return new double[] { progresoActual, cantidadMeta };
    }

    @Override
    public List<TransaccionResponseDTO> listarTodasPorUsuario(Integer idUsuario, String nickUsuario,
            String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        List<TransaccionEntity> transacciones = transaccionRepository.findByUsuarioId(idUsuario);
        return transacciones.stream()
                .map(transaccionMapper::convertirADTO).toList();
    }
}