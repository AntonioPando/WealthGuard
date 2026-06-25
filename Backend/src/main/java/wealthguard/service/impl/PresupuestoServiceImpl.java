package wealthguard.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import wealthguard.dto.PresupuestoRequestDTO;
import wealthguard.dto.PresupuestoResponseDTO;
import wealthguard.entity.PresupuestoEntity;
import wealthguard.entity.TransaccionEntity;
import wealthguard.mapper.PresupuestoMapper;
import wealthguard.repository.PresupuestoRepository;
import wealthguard.repository.TransaccionRepository;
import wealthguard.service.IPresupuestoService;
import wealthguard.service.LoginService;

@Service
public class PresupuestoServiceImpl implements IPresupuestoService {

    @Autowired
    private PresupuestoRepository presupuestoRepository;

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Autowired
    private PresupuestoMapper presupuestoMapper;

    @Autowired
    private LoginService loginService;

    @Override
    public PresupuestoResponseDTO crearPresupuesto(PresupuestoRequestDTO presupuestoRequest, String nickUsuario,
            String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        PresupuestoEntity nuevaEntidad = presupuestoMapper.convertirAEntity(presupuestoRequest);
        PresupuestoEntity entidadGuardada = presupuestoRepository.save(nuevaEntidad);
        return presupuestoMapper.convertirADTO(entidadGuardada);
    }

    @Override
    public boolean eliminarPresupuesto(int idPresupuesto, String nickUsuario, String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        if (!presupuestoRepository.existsById(idPresupuesto)) {
            return false;
        }
        presupuestoRepository.deleteById(idPresupuesto);
        return true;
    }

    @Override
    public boolean editarPresupuesto(int idPresupuesto, int idCategoria, double limite,
            LocalDateTime fechaInicio, LocalDateTime fechaFin, String nickUsuario, String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        PresupuestoEntity presupuesto = presupuestoRepository.findById(idPresupuesto)
                .orElse(null);

        if (presupuesto == null) {
            return false;
        }

        presupuesto.setLimite(limite);
        presupuesto.setFechaInicio(fechaInicio);
        presupuesto.setFechaFin(fechaFin);

        presupuestoRepository.save(presupuesto);
        return true;
    }

    @Override
    public List<PresupuestoResponseDTO> obtenerPresupuestos(int idUsuario, String nickUsuario,
            String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        List<PresupuestoEntity> presupuestos = presupuestoRepository.findByUsuarioId(idUsuario);
        List<PresupuestoResponseDTO> resultado = new ArrayList<>();

        for (PresupuestoEntity presupuesto : presupuestos) {

            List<TransaccionEntity> transacciones = transaccionRepository.buscarConFiltros(
                    idUsuario,
                    presupuesto.getFechaInicio(),
                    presupuesto.getFechaFin(),
                    presupuesto.getCategoria().getId(),
                    false,
                    null,
                    null);

            double gastoActual = 0.0;
            for (TransaccionEntity t : transacciones) {
                gastoActual += t.getCantidad();
            }

            double porcentaje = 0.0;
            if (presupuesto.getLimite() > 0) {
                porcentaje = (gastoActual / presupuesto.getLimite()) * 100;
            }

            PresupuestoResponseDTO dto = presupuestoMapper.convertirADTO(presupuesto);
            dto.setGastoActual(gastoActual);
            dto.setPorcentaje(porcentaje);

            resultado.add(dto);
        }

        return resultado;
    }
}