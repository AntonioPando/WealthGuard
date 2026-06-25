package wealthguard.service.impl;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import wealthguard.dto.RecomendacionResponseDTO;
import wealthguard.entity.RecomendacionEntity;
import wealthguard.entity.TipoRecomendacionEntity;
import wealthguard.entity.UsuarioEntity;
import wealthguard.mapper.RecomendacionMapper;
import wealthguard.repository.RecomendacionRepository;
import wealthguard.repository.TipoRecomendacionRepository;
import wealthguard.repository.UsuarioRepository;
import wealthguard.service.IRecomendacionService;
import wealthguard.service.LoginService;

@Service
public class RecomendacionServiceImpl implements IRecomendacionService {

        @Autowired
        private RecomendacionRepository recomendacionRepository;

        @Autowired
        private UsuarioRepository usuarioRepository;

        @Autowired
        private TipoRecomendacionRepository tipoRecomendacionRepository;

        @Autowired
        private RecomendacionMapper recomendacionMapper;

        @Autowired
        private LoginService loginService;

        @Override
        @Transactional
        public List<RecomendacionResponseDTO> generarRecomendaciones(int idUsuario, int score, String nickUsuario,
                        String contrasena) {

                loginService.verificar(nickUsuario, contrasena);

                List<RecomendacionEntity> existentes = recomendacionRepository
                                .findByUsuarioIdOrderByFechaRecomendacionDesc(idUsuario);

                if (!existentes.isEmpty()) {
                        TipoRecomendacionEntity tipoActual = existentes.get(0).getTipoRecomendacion();
                        boolean scoreSigueEnMismoRango = score >= tipoActual.getScoreMinimo()
                                        && score <= tipoActual.getScoreMaximo();

                        if (scoreSigueEnMismoRango) {
                                return existentes.stream()
                                                .map(recomendacionMapper::convertirADTO)
                                                .collect(Collectors.toList());
                        }
                }

                List<TipoRecomendacionEntity> candidatos = tipoRecomendacionRepository.findByScore(score);
                TipoRecomendacionEntity tipoMasEspecifico = seleccionarMasEspecifico(candidatos);

                if (tipoMasEspecifico == null) {
                        return existentes.stream()
                                        .map(recomendacionMapper::convertirADTO)
                                        .collect(Collectors.toList());
                }

                UsuarioEntity usuario = usuarioRepository.findById(idUsuario)
                                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + idUsuario));

                RecomendacionEntity r = new RecomendacionEntity();
                r.setUsuario(usuario);
                r.setTipoRecomendacion(tipoMasEspecifico);
                r.setFechaRecomendacion(LocalDateTime.now());

                recomendacionRepository.save(r);

                List<RecomendacionEntity> actualizadas = recomendacionRepository
                                .findByUsuarioIdOrderByFechaRecomendacionDesc(idUsuario);

                return actualizadas.stream()
                                .map(recomendacionMapper::convertirADTO)
                                .collect(Collectors.toList());
        }

        private TipoRecomendacionEntity seleccionarMasEspecifico(List<TipoRecomendacionEntity> candidatos) {
                return candidatos.stream()
                                .min(Comparator.comparingInt(t -> t.getScoreMaximo() - t.getScoreMinimo()))
                                .orElse(null);
        }

        @Override
        public List<RecomendacionResponseDTO> obtenerRecomendaciones(int idUsuario, String nickUsuario,
                        String contrasena) {

                loginService.verificar(nickUsuario, contrasena);

                return recomendacionRepository
                                .findByUsuarioIdOrderByFechaRecomendacionDesc(idUsuario)
                                .stream()
                                .map(recomendacionMapper::convertirADTO)
                                .collect(Collectors.toList());
        }

        @Override
        public boolean eliminarRecomendacion(int idRecomendacion, String nickUsuario, String contrasena) {

                loginService.verificar(nickUsuario, contrasena);

                RecomendacionEntity recomendacion = recomendacionRepository.findById(idRecomendacion).orElse(null);
                if (recomendacion == null) {
                        return false;
                }

                int idUsuario = recomendacion.getUsuario().getId();
                List<RecomendacionEntity> historico = recomendacionRepository
                                .findByUsuarioIdOrderByFechaRecomendacionDesc(idUsuario);

                boolean esLaVigente = !historico.isEmpty()
                                && historico.get(0).getId().equals(idRecomendacion);

                if (esLaVigente) {
                        return false;
                }

                recomendacionRepository.deleteById(idRecomendacion);
                return true;
        }
}