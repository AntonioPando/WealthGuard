package wealthguard.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import wealthguard.dto.LoginRequestDTO;
import wealthguard.dto.LoginResponseDTO;
import wealthguard.dto.UsuarioRequestDTO;
import wealthguard.dto.UsuarioResponseDTO;
import wealthguard.entity.UsuarioEntity;
import wealthguard.exception.UsuarioException;
import wealthguard.mapper.UsuarioMapper;
import wealthguard.repository.ObjetivoRepository;
import wealthguard.repository.PresupuestoRepository;
import wealthguard.repository.RecomendacionRepository;
import wealthguard.repository.TransaccionRepository;
import wealthguard.repository.UsuarioRepository;
import wealthguard.service.IUsuarioService;
import wealthguard.service.LoginService;

@Service
public class UsuarioServiceImpl implements IUsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioMapper usuarioMapper;

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Autowired
    private RecomendacionRepository recomendacionRepository;

    @Autowired
    private PresupuestoRepository presupuestoRepository;

    @Autowired
    private ObjetivoRepository objetivoRepository;

    @Autowired
    private LoginService loginService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) throws UsuarioException {

        if (loginRequestDTO == null
                || loginRequestDTO.getUsuario() == null
                || loginRequestDTO.getUsuario().isBlank()
                || loginRequestDTO.getPass() == null
                || loginRequestDTO.getPass().isBlank()) {
            throw new UsuarioException("Credenciales_invalidas");
        }

        String identificador = loginRequestDTO.getUsuario().trim();
        Optional<UsuarioEntity> usuarioOpt;

        if (identificador.contains("@")) {
            usuarioOpt = usuarioRepository.findByEmailIgnoreCase(identificador);
        } else {
            usuarioOpt = usuarioRepository.findByNickUsuarioIgnoreCase(identificador);
        }

        UsuarioEntity usuario = usuarioOpt.orElseThrow(() -> new UsuarioException("Usuario_no_encontrado"));

        if (!passwordEncoder.matches(loginRequestDTO.getPass(), usuario.getPassword())) {
            throw new UsuarioException("Credenciales_incorrectas");
        }

        LoginResponseDTO response = new LoginResponseDTO();
        response.setMensaje("Login correcto");
        response.setToken(UUID.randomUUID().toString());
        response.setIdUsuario(usuario.getId());
        response.setNickUsuario(usuario.getNickUsuario());
        response.setNombre(usuario.getNombre());
        response.setEmail(usuario.getEmail());

        return response;
    }

    @Override
    public UsuarioResponseDTO crearUsuario(UsuarioRequestDTO usuarioRequestDTO) throws UsuarioException {
        if (usuarioRepository.findByNickUsuario(usuarioRequestDTO.getNickUsuario()).isPresent()) {
            throw new UsuarioException();
        }

        UsuarioEntity usuario = usuarioMapper.convertirAEntity(usuarioRequestDTO);
        usuario.setPassword(passwordEncoder.encode(usuarioRequestDTO.getPassword()));
        usuario.setFechaRegistro(LocalDateTime.now());
        usuario.setFechaUltimoCambioPassword(LocalDateTime.now());

        UsuarioEntity guardado = usuarioRepository.save(usuario);
        return usuarioMapper.convertirADTO(guardado);
    }

    @Override
    public UsuarioResponseDTO actualizarUsuario(int idUsuario, UsuarioRequestDTO usuarioRequestDTO,
            String nickUsuario, String contrasena) throws UsuarioException {

        UsuarioEntity existente = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new UsuarioException());

        if (usuarioRepository.existsByNickUsuarioAndIdNot(usuarioRequestDTO.getNickUsuario(), idUsuario)) {
            throw new UsuarioException();
        }

        if (usuarioRequestDTO.getPassword() == null || usuarioRequestDTO.getPassword().isBlank()) {
            throw new UsuarioException("Password_obligatoria");
        }
        if (!passwordEncoder.matches(usuarioRequestDTO.getPassword(), existente.getPassword())) {
            throw new UsuarioException("Password_incorrecta");
        }

        UsuarioEntity usuario = usuarioMapper.convertirAEntity(usuarioRequestDTO);
        usuario.setId(idUsuario);
        usuario.setFechaRegistro(existente.getFechaRegistro());
        usuario.setFechaUltimoCambioPassword(existente.getFechaUltimoCambioPassword());
        usuario.setPassword(existente.getPassword());

        if (usuarioRequestDTO.getFotoPerfil() == null || usuarioRequestDTO.getFotoPerfil().isBlank()) {
            usuario.setFotoPerfil(existente.getFotoPerfil());
        }
        usuario.setPreguntaSeguridad(existente.getPreguntaSeguridad());
        if (usuarioRequestDTO.getRespuestaSeguridad() == null || usuarioRequestDTO.getRespuestaSeguridad().isBlank()) {
            usuario.setRespuestaSeguridad(existente.getRespuestaSeguridad());
        }

        UsuarioEntity actualizado = usuarioRepository.save(usuario);
        return usuarioMapper.convertirADTO(actualizado);
    }

    @Override
    @Transactional
    public boolean eliminarCuenta(int idUsuario, String nickUsuario, String contrasena) {
        loginService.verificar(nickUsuario, contrasena);

        if (!usuarioRepository.existsById(idUsuario)) {
            return false;
        }

        transaccionRepository.deleteByUsuarioId(idUsuario);
        recomendacionRepository.deleteByUsuarioId(idUsuario);
        presupuestoRepository.deleteByUsuarioId(idUsuario);
        objetivoRepository.deleteByUsuarioId(idUsuario);

        usuarioRepository.deleteById(idUsuario);
        return true;
    }

    @Override
    public byte[] exportarDatos(int idUsuario, String nickUsuario, String contrasena) {
        loginService.verificar(nickUsuario, contrasena);

        UsuarioEntity usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String csv = "id,nick,nombre,primerApellido,segundoApellido,email,fechaRegistro,activo\n"
                + usuario.getId() + ","
                + usuario.getNickUsuario() + ","
                + usuario.getNombre() + ","
                + usuario.getPrimerApellido() + ","
                + (usuario.getSegundoApellido() != null ? usuario.getSegundoApellido() : "") + ","
                + usuario.getEmail() + ","
                + usuario.getFechaRegistro();

        return csv.getBytes();
    }

    @Override
    public boolean cambiarPassword(int idUsuario, String passwordAntigua, String passwordNueva,
            String nickUsuario, String contrasena) throws UsuarioException {

        loginService.verificar(nickUsuario, contrasena);

        UsuarioEntity usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new UsuarioException());

        if (!passwordEncoder.matches(passwordAntigua, usuario.getPassword())) {
            throw new UsuarioException("Password_incorrecta");
        }
        if (passwordEncoder.matches(passwordNueva, usuario.getPassword())) {
            throw new UsuarioException("Password_igual");
        }

        usuario.setPassword(passwordEncoder.encode(passwordNueva));
        usuario.setFechaUltimoCambioPassword(LocalDateTime.now());
        usuarioRepository.save(usuario);
        return true;
    }

    @Override
    public UsuarioResponseDTO obtenerPerfil(int idUsuario, String nickUsuario, String contrasena) {
        loginService.verificar(nickUsuario, contrasena);

        UsuarioEntity usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return usuarioMapper.convertirADTO(usuario);
    }

    @Override
    public List<UsuarioResponseDTO> listarUsuarios(String nickUsuario, String contrasena) {
        loginService.verificar(nickUsuario, contrasena);

        return usuarioRepository.findAll()
                .stream()
                .map(usuarioMapper::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    public String actualizarFotoPerfil(int idUsuario, MultipartFile imagen) throws UsuarioException {

        UsuarioEntity usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new UsuarioException());

        try {
            Path directorio = Paths.get("uploads", "fotos-perfil");
            Files.createDirectories(directorio);

            String nombreOriginal = imagen.getOriginalFilename();
            String extension = (nombreOriginal != null && nombreOriginal.contains("."))
                    ? nombreOriginal.substring(nombreOriginal.lastIndexOf("."))
                    : ".jpg";

            String nombreArchivo = "usuario_" + idUsuario + extension;
            Path rutaArchivo = directorio.resolve(nombreArchivo);
            Files.write(rutaArchivo, imagen.getBytes());

            String url = "http://localhost:8080/uploads/fotos-perfil/" + nombreArchivo;
            usuario.setFotoPerfil(url);
            usuarioRepository.save(usuario);
            return url;

        } catch (IOException e) {
            throw new RuntimeException("Error al guardar la imagen de perfil", e);
        }
    }

    @Override
    public boolean existeNick(String nick) {
        return usuarioRepository.findByNickUsuarioIgnoreCase(nick).isPresent();
    }

    @Override
    public boolean existeEmail(String email) {
        return usuarioRepository.findByEmailIgnoreCase(email).isPresent();
    }

    private UsuarioEntity buscarPorNickOEmail(String identificador) throws UsuarioException {
        if (identificador == null || identificador.isBlank()) {
            throw new UsuarioException("Usuario_no_encontrado");
        }
        String valor = identificador.trim();
        Optional<UsuarioEntity> usuarioOpt = valor.contains("@")
                ? usuarioRepository.findByEmailIgnoreCase(valor)
                : usuarioRepository.findByNickUsuarioIgnoreCase(valor);
        return usuarioOpt.orElseThrow(() -> new UsuarioException("Usuario_no_encontrado"));
    }

    @Override
    public String obtenerPreguntaSeguridad(String usuario) throws UsuarioException {
        UsuarioEntity entidad = buscarPorNickOEmail(usuario);
        if (entidad.getPreguntaSeguridad() == null || entidad.getPreguntaSeguridad().isBlank()) {
            throw new UsuarioException("Usuario_sin_pregunta_seguridad");
        }
        return entidad.getPreguntaSeguridad();
    }

    @Override
    public boolean verificarRespuestaSeguridad(String usuario, String respuesta) throws UsuarioException {
        UsuarioEntity entidad = buscarPorNickOEmail(usuario);
        if (respuesta == null || respuesta.isBlank()) {
            return false;
        }
        return entidad.getRespuestaSeguridad() != null
                && entidad.getRespuestaSeguridad().trim().equalsIgnoreCase(respuesta.trim());
    }

    @Override
    public boolean resetearPassword(String usuario, String respuesta, String passwordNueva) throws UsuarioException {
        UsuarioEntity entidad = buscarPorNickOEmail(usuario);

        boolean respuestaCorrecta = entidad.getRespuestaSeguridad() != null
                && entidad.getRespuestaSeguridad().trim()
                        .equalsIgnoreCase(respuesta == null ? "" : respuesta.trim());

        if (!respuestaCorrecta) {
            throw new UsuarioException("Respuesta_incorrecta");
        }
        if (passwordNueva == null || passwordNueva.isBlank()) {
            throw new UsuarioException("Password_obligatoria");
        }
        if (passwordEncoder.matches(passwordNueva, entidad.getPassword())) {
            throw new UsuarioException("Password_igual");
        }

        entidad.setPassword(passwordEncoder.encode(passwordNueva));
        entidad.setFechaUltimoCambioPassword(LocalDateTime.now());
        usuarioRepository.save(entidad);
        return true;
    }
}