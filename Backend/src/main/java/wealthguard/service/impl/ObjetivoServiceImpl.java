package wealthguard.service.impl;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import wealthguard.dto.ObjetivoRequestDTO;
import wealthguard.dto.ObjetivoResponseDTO;
import wealthguard.entity.ObjetivoEntity;
import wealthguard.mapper.ObjetivoMapper;
import wealthguard.repository.ObjetivoRepository;
import wealthguard.service.IObjetivoService;
import wealthguard.service.LoginService;

@Service
public class ObjetivoServiceImpl implements IObjetivoService {

    @Autowired
    private ObjetivoRepository objetivoRepository;

    @Autowired
    private ObjetivoMapper objetivoMapper;

    @Autowired
    private LoginService loginService;

    @Override
    @Transactional
    public ObjetivoResponseDTO crearObjetivo(ObjetivoRequestDTO objetivoRequestDTO, String nickUsuario,
            String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime inicioMes = ahora.with(TemporalAdjusters.firstDayOfMonth()).with(LocalTime.MIN);
        LocalDateTime finMes = ahora.with(TemporalAdjusters.lastDayOfMonth()).with(LocalTime.MAX);

        Optional<ObjetivoEntity> objetivoExistente = objetivoRepository
                .findFirstByUsuarioIdOrderByFechaInicioDesc(objetivoRequestDTO.getUsuarioId());

        if (objetivoExistente.isPresent()) {
            ObjetivoEntity ultimoObjetivo = objetivoExistente.get();

            if (!ultimoObjetivo.getFechaFin().isBefore(inicioMes) && !ultimoObjetivo.getFechaInicio().isAfter(finMes)) {
                ultimoObjetivo.setCantidadObjetivo(objetivoRequestDTO.getCantidadObjetivo());
                return objetivoMapper.convertirADTO(objetivoRepository.save(ultimoObjetivo));
            }
        }

        ObjetivoEntity objetivoEntity = objetivoMapper.convertirAEntity(objetivoRequestDTO);
        objetivoEntity.setFechaInicio(inicioMes);
        objetivoEntity.setFechaFin(finMes);

        ObjetivoEntity objetivoGuardado = objetivoRepository.save(objetivoEntity);
        return objetivoMapper.convertirADTO(objetivoGuardado);
    }

    @Override
    public boolean eliminarObjetivo(Integer idObjetivo, String nickUsuario, String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        if (objetivoRepository.existsById(idObjetivo)) {
            objetivoRepository.deleteById(idObjetivo);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public ObjetivoResponseDTO editarObjetivo(int idObjetivo, ObjetivoRequestDTO objetivoRequestDTO,
            String nickUsuario, String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        ObjetivoEntity objetivoExistente = objetivoRepository.findById(idObjetivo)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el objetivo con ID: " + idObjetivo));

        objetivoExistente.setCantidadObjetivo(objetivoRequestDTO.getCantidadObjetivo());

        ObjetivoEntity objetivoGuardado = objetivoRepository.save(objetivoExistente);
        return objetivoMapper.convertirADTO(objetivoGuardado);
    }

    @Override
    public ObjetivoResponseDTO obtenerObjetivo(Integer idUsuario, String nickUsuario, String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        return objetivoRepository.findFirstByUsuarioIdOrderByFechaInicioDesc(idUsuario)
                .map(objetivoMapper::convertirADTO)
                .orElse(null);
    }

    @Override
    public ObjetivoResponseDTO obtenerUltimoObjetivo(Integer idUsuario, String nickUsuario, String contrasena) {

        loginService.verificar(nickUsuario, contrasena);

        return objetivoRepository.findFirstByUsuarioIdAndFechaFinBeforeOrderByFechaFinDesc(idUsuario,
                LocalDateTime.now())
                .map(objetivoMapper::convertirADTO)
                .orElse(null);
    }
}