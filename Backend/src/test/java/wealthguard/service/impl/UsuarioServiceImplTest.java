package wealthguard.service.impl;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

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
import wealthguard.service.LoginService;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private UsuarioMapper usuarioMapper;
    @Mock
    private TransaccionRepository transaccionRepository;
    @Mock
    private RecomendacionRepository recomendacionRepository;
    @Mock
    private PresupuestoRepository presupuestoRepository;
    @Mock
    private ObjetivoRepository objetivoRepository;
    @Mock
    private LoginService loginService;

    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    private static final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder();
    private static final String PLAIN_PASSWORD = "Password123!";
    private static final String ENCODED_PASSWORD = ENCODER.encode(PLAIN_PASSWORD);

    private UsuarioEntity usuarioTest;
    private UsuarioResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        usuarioTest = new UsuarioEntity();
        usuarioTest.setId(1);
        usuarioTest.setNickUsuario("testuser");
        usuarioTest.setNombre("Test");
        usuarioTest.setPrimerApellido("User");
        usuarioTest.setEmail("test@example.com");
        usuarioTest.setPassword(ENCODED_PASSWORD);
        usuarioTest.setFechaRegistro(LocalDateTime.now());
        usuarioTest.setFechaUltimoCambioPassword(LocalDateTime.now());
        usuarioTest.setPreguntaSeguridad("¿Cuál es el nombre de tu mascota?");
        usuarioTest.setRespuestaSeguridad("Firulais");

        responseDTO = new UsuarioResponseDTO();
        responseDTO.setId(1);
        responseDTO.setNickUsuario("testuser");
        responseDTO.setNombre("Test");
        responseDTO.setEmail("test@example.com");
    }

    @Test
    void login_conNickValido_retornaLoginResponseDTO() throws UsuarioException {
        when(usuarioRepository.findByNickUsuarioIgnoreCase("testuser")).thenReturn(Optional.of(usuarioTest));

        LoginRequestDTO req = new LoginRequestDTO();
        req.setUsuario("testuser");
        req.setPass(PLAIN_PASSWORD);

        LoginResponseDTO result = usuarioService.login(req);

        assertNotNull(result);
        assertEquals("Login correcto", result.getMensaje());
        assertEquals("testuser", result.getNickUsuario());
        assertEquals(1, result.getIdUsuario());
        assertNotNull(result.getToken());
    }

    @Test
    void login_conEmailValido_retornaLoginResponseDTO() throws UsuarioException {
        when(usuarioRepository.findByEmailIgnoreCase("test@example.com")).thenReturn(Optional.of(usuarioTest));

        LoginRequestDTO req = new LoginRequestDTO();
        req.setUsuario("test@example.com");
        req.setPass(PLAIN_PASSWORD);

        LoginResponseDTO result = usuarioService.login(req);

        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    void login_requestNull_lanzaUsuarioException() {
        assertThrows(UsuarioException.class, () -> usuarioService.login(null));
    }

    @Test
    void login_usuarioNulo_lanzaUsuarioException() {
        LoginRequestDTO req = new LoginRequestDTO();
        req.setUsuario(null);
        req.setPass(PLAIN_PASSWORD);
        assertThrows(UsuarioException.class, () -> usuarioService.login(req));
    }

    @Test
    void login_usuarioBlanco_lanzaUsuarioException() {
        LoginRequestDTO req = new LoginRequestDTO();
        req.setUsuario("   ");
        req.setPass(PLAIN_PASSWORD);
        assertThrows(UsuarioException.class, () -> usuarioService.login(req));
    }

    @Test
    void login_passwordNula_lanzaUsuarioException() {
        LoginRequestDTO req = new LoginRequestDTO();
        req.setUsuario("testuser");
        req.setPass(null);
        assertThrows(UsuarioException.class, () -> usuarioService.login(req));
    }

    @Test
    void login_usuarioNoEncontrado_lanzaUsuarioException() {
        when(usuarioRepository.findByNickUsuarioIgnoreCase("noexiste")).thenReturn(Optional.empty());

        LoginRequestDTO req = new LoginRequestDTO();
        req.setUsuario("noexiste");
        req.setPass(PLAIN_PASSWORD);

        UsuarioException ex = assertThrows(UsuarioException.class, () -> usuarioService.login(req));
        assertEquals("Usuario_no_encontrado", ex.getMessage());
    }

    @Test
    void login_passwordIncorrecta_lanzaUsuarioException() {
        when(usuarioRepository.findByNickUsuarioIgnoreCase("testuser")).thenReturn(Optional.of(usuarioTest));

        LoginRequestDTO req = new LoginRequestDTO();
        req.setUsuario("testuser");
        req.setPass("wrongPassword");

        UsuarioException ex = assertThrows(UsuarioException.class, () -> usuarioService.login(req));
        assertEquals("Credenciales_incorrectas", ex.getMessage());
    }

    @Test
    void crearUsuario_exitoso_retornaResponseDTO() throws UsuarioException {
        UsuarioRequestDTO requestDTO = new UsuarioRequestDTO();
        requestDTO.setNickUsuario("newuser");
        requestDTO.setPassword(PLAIN_PASSWORD);

        UsuarioEntity entity = new UsuarioEntity();
        entity.setNickUsuario("newuser");

        when(usuarioRepository.findByNickUsuario("newuser")).thenReturn(Optional.empty());
        when(usuarioMapper.convertirAEntity(requestDTO)).thenReturn(entity);
        when(usuarioRepository.save(any(UsuarioEntity.class))).thenReturn(usuarioTest);
        when(usuarioMapper.convertirADTO(usuarioTest)).thenReturn(responseDTO);

        UsuarioResponseDTO result = usuarioService.crearUsuario(requestDTO);

        assertNotNull(result);
        assertEquals("testuser", result.getNickUsuario());
        // Verifica que se cifra la contraseña y se asignan fechas
        verify(usuarioRepository).save(argThat(u -> u.getPassword() != null && !u.getPassword().equals(PLAIN_PASSWORD)
                && u.getFechaRegistro() != null));
    }

    @Test
    void crearUsuario_nickDuplicado_lanzaUsuarioException() {
        UsuarioRequestDTO requestDTO = new UsuarioRequestDTO();
        requestDTO.setNickUsuario("existente");

        when(usuarioRepository.findByNickUsuario("existente")).thenReturn(Optional.of(usuarioTest));

        assertThrows(UsuarioException.class, () -> usuarioService.crearUsuario(requestDTO));
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void actualizarUsuario_exitoso_retornaResponseDTO() throws UsuarioException {
        UsuarioRequestDTO requestDTO = new UsuarioRequestDTO();
        requestDTO.setNickUsuario("testuser");
        requestDTO.setPassword(PLAIN_PASSWORD);

        UsuarioEntity entity = new UsuarioEntity();
        entity.setNickUsuario("testuser");

        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuarioTest));
        when(usuarioRepository.existsByNickUsuarioAndIdNot("testuser", 1)).thenReturn(false);
        when(usuarioMapper.convertirAEntity(requestDTO)).thenReturn(entity);
        when(usuarioRepository.save(any(UsuarioEntity.class))).thenReturn(usuarioTest);
        when(usuarioMapper.convertirADTO(usuarioTest)).thenReturn(responseDTO);

        UsuarioResponseDTO result = usuarioService.actualizarUsuario(1, requestDTO, "testuser", PLAIN_PASSWORD);

        assertNotNull(result);
        verify(usuarioRepository).save(any());
    }

    @Test
    void actualizarUsuario_usuarioNoEncontrado_lanzaUsuarioException() {
        when(usuarioRepository.findById(999)).thenReturn(Optional.empty());

        UsuarioRequestDTO requestDTO = new UsuarioRequestDTO();
        requestDTO.setNickUsuario("testuser");
        requestDTO.setPassword(PLAIN_PASSWORD);

        assertThrows(UsuarioException.class,
                () -> usuarioService.actualizarUsuario(999, requestDTO, "testuser", PLAIN_PASSWORD));
    }

    @Test
    void actualizarUsuario_nickDuplicado_lanzaUsuarioException() {
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuarioTest));
        when(usuarioRepository.existsByNickUsuarioAndIdNot("otroNick", 1)).thenReturn(true);

        UsuarioRequestDTO requestDTO = new UsuarioRequestDTO();
        requestDTO.setNickUsuario("otroNick");
        requestDTO.setPassword(PLAIN_PASSWORD);

        assertThrows(UsuarioException.class,
                () -> usuarioService.actualizarUsuario(1, requestDTO, "testuser", PLAIN_PASSWORD));
    }

    @Test
    void actualizarUsuario_passwordBlanca_lanzaUsuarioException() {
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuarioTest));
        when(usuarioRepository.existsByNickUsuarioAndIdNot("testuser", 1)).thenReturn(false);

        UsuarioRequestDTO requestDTO = new UsuarioRequestDTO();
        requestDTO.setNickUsuario("testuser");
        requestDTO.setPassword("  ");

        UsuarioException ex = assertThrows(UsuarioException.class,
                () -> usuarioService.actualizarUsuario(1, requestDTO, "testuser", PLAIN_PASSWORD));
        assertEquals("Password_obligatoria", ex.getMessage());
    }

    @Test
    void actualizarUsuario_passwordIncorrecta_lanzaUsuarioException() {
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuarioTest));
        when(usuarioRepository.existsByNickUsuarioAndIdNot("testuser", 1)).thenReturn(false);

        UsuarioRequestDTO requestDTO = new UsuarioRequestDTO();
        requestDTO.setNickUsuario("testuser");
        requestDTO.setPassword("wrongPassword");

        UsuarioException ex = assertThrows(UsuarioException.class,
                () -> usuarioService.actualizarUsuario(1, requestDTO, "testuser", PLAIN_PASSWORD));
        assertEquals("Password_incorrecta", ex.getMessage());
    }

    @Test
    void eliminarCuenta_usuarioExiste_eliminaTodoYRetornaTrue() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(usuarioRepository.existsById(1)).thenReturn(true);

        boolean result = usuarioService.eliminarCuenta(1, "testuser", PLAIN_PASSWORD);

        assertTrue(result);
        verify(transaccionRepository).deleteByUsuarioId(1);
        verify(recomendacionRepository).deleteByUsuarioId(1);
        verify(presupuestoRepository).deleteByUsuarioId(1);
        verify(objetivoRepository).deleteByUsuarioId(1);
        verify(usuarioRepository).deleteById(1);
    }

    @Test
    void eliminarCuenta_usuarioNoExiste_retornaFalse() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(usuarioRepository.existsById(999)).thenReturn(false);

        boolean result = usuarioService.eliminarCuenta(999, "testuser", PLAIN_PASSWORD);

        assertFalse(result);
        verify(usuarioRepository, never()).deleteById(any());
    }

    @Test
    void eliminarCuenta_credencialesInvalidas_lanzaRuntimeException() {
        doThrow(new RuntimeException("Acceso denegado")).when(loginService).verificar(anyString(), anyString());

        assertThrows(RuntimeException.class,
                () -> usuarioService.eliminarCuenta(1, "wronguser", "wrongpass"));
    }

    @Test
    void exportarDatos_usuarioExiste_retornaCSV() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuarioTest));

        byte[] result = usuarioService.exportarDatos(1, "testuser", PLAIN_PASSWORD);

        assertNotNull(result);
        String csv = new String(result);
        assertTrue(csv.contains("testuser"));
        assertTrue(csv.contains("test@example.com"));
        assertTrue(csv.startsWith("id,nick,nombre"));
    }

    @Test
    void exportarDatos_usuarioNoExiste_lanzaRuntimeException() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(usuarioRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> usuarioService.exportarDatos(999, "testuser", PLAIN_PASSWORD));
    }

    @Test
    void cambiarPassword_exitoso_retornaTrue() throws UsuarioException {
        String nuevaPassword = "NewPassword456!";
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuarioTest));
        when(usuarioRepository.save(any())).thenReturn(usuarioTest);

        boolean result = usuarioService.cambiarPassword(1, PLAIN_PASSWORD, nuevaPassword, "testuser", PLAIN_PASSWORD);

        assertTrue(result);
        verify(usuarioRepository).save(argThat(u -> ENCODER.matches(nuevaPassword, u.getPassword())));
    }

    @Test
    void cambiarPassword_passwordAntiguaIncorrecta_lanzaUsuarioException() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuarioTest));

        UsuarioException ex = assertThrows(UsuarioException.class,
                () -> usuarioService.cambiarPassword(1, "wrongOld", "NewPassword456!", "testuser", PLAIN_PASSWORD));
        assertEquals("Password_incorrecta", ex.getMessage());
    }

    @Test
    void cambiarPassword_mismaPassword_lanzaUsuarioException() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuarioTest));

        UsuarioException ex = assertThrows(UsuarioException.class,
                () -> usuarioService.cambiarPassword(1, PLAIN_PASSWORD, PLAIN_PASSWORD, "testuser", PLAIN_PASSWORD));
        assertEquals("Password_igual", ex.getMessage());
    }

    @Test
    void cambiarPassword_usuarioNoEncontrado_lanzaUsuarioException() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(usuarioRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(UsuarioException.class,
                () -> usuarioService.cambiarPassword(999, PLAIN_PASSWORD, "NewPassword456!", "testuser",
                        PLAIN_PASSWORD));
    }

    @Test
    void obtenerPerfil_usuarioExiste_retornaResponseDTO() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuarioTest));
        when(usuarioMapper.convertirADTO(usuarioTest)).thenReturn(responseDTO);

        UsuarioResponseDTO result = usuarioService.obtenerPerfil(1, "testuser", PLAIN_PASSWORD);

        assertNotNull(result);
        assertEquals(1, result.getId());
    }

    @Test
    void obtenerPerfil_usuarioNoExiste_lanzaRuntimeException() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(usuarioRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> usuarioService.obtenerPerfil(999, "testuser", PLAIN_PASSWORD));
    }

    @Test
    void listarUsuarios_conDatos_retornaLista() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(usuarioTest));
        when(usuarioMapper.convertirADTO(usuarioTest)).thenReturn(responseDTO);

        List<UsuarioResponseDTO> result = usuarioService.listarUsuarios("testuser", PLAIN_PASSWORD);

        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void listarUsuarios_sinDatos_retornaListaVacia() {
        doNothing().when(loginService).verificar(anyString(), anyString());
        when(usuarioRepository.findAll()).thenReturn(Collections.emptyList());

        List<UsuarioResponseDTO> result = usuarioService.listarUsuarios("testuser", PLAIN_PASSWORD);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void existeNick_nickExistente_retornaTrue() {
        when(usuarioRepository.findByNickUsuarioIgnoreCase("testuser")).thenReturn(Optional.of(usuarioTest));
        assertTrue(usuarioService.existeNick("testuser"));
    }

    @Test
    void existeNick_nickNoExistente_retornaFalse() {
        when(usuarioRepository.findByNickUsuarioIgnoreCase("noexiste")).thenReturn(Optional.empty());
        assertFalse(usuarioService.existeNick("noexiste"));
    }

    @Test
    void existeEmail_emailExistente_retornaTrue() {
        when(usuarioRepository.findByEmailIgnoreCase("test@example.com")).thenReturn(Optional.of(usuarioTest));
        assertTrue(usuarioService.existeEmail("test@example.com"));
    }

    @Test
    void existeEmail_emailNoExistente_retornaFalse() {
        when(usuarioRepository.findByEmailIgnoreCase("noexiste@test.com")).thenReturn(Optional.empty());
        assertFalse(usuarioService.existeEmail("noexiste@test.com"));
    }

    @Test
    void obtenerPreguntaSeguridad_porNick_retornaPregunta() throws UsuarioException {
        when(usuarioRepository.findByNickUsuarioIgnoreCase("testuser")).thenReturn(Optional.of(usuarioTest));
        String pregunta = usuarioService.obtenerPreguntaSeguridad("testuser");
        assertEquals("¿Cuál es el nombre de tu mascota?", pregunta);
    }

    @Test
    void obtenerPreguntaSeguridad_porEmail_retornaPregunta() throws UsuarioException {
        when(usuarioRepository.findByEmailIgnoreCase("test@example.com")).thenReturn(Optional.of(usuarioTest));
        String pregunta = usuarioService.obtenerPreguntaSeguridad("test@example.com");
        assertEquals("¿Cuál es el nombre de tu mascota?", pregunta);
    }

    @Test
    void obtenerPreguntaSeguridad_sinPregunta_lanzaUsuarioException() {
        usuarioTest.setPreguntaSeguridad(null);
        when(usuarioRepository.findByNickUsuarioIgnoreCase("testuser")).thenReturn(Optional.of(usuarioTest));

        UsuarioException ex = assertThrows(UsuarioException.class,
                () -> usuarioService.obtenerPreguntaSeguridad("testuser"));
        assertEquals("Usuario_sin_pregunta_seguridad", ex.getMessage());
    }

    @Test
    void obtenerPreguntaSeguridad_usuarioNulo_lanzaUsuarioException() {
        assertThrows(UsuarioException.class,
                () -> usuarioService.obtenerPreguntaSeguridad(null));
    }

    @Test
    void verificarRespuestaSeguridad_respuestaCorrecta_retornaTrue() throws UsuarioException {
        when(usuarioRepository.findByNickUsuarioIgnoreCase("testuser")).thenReturn(Optional.of(usuarioTest));
        assertTrue(usuarioService.verificarRespuestaSeguridad("testuser", "Firulais"));
    }

    @Test
    void verificarRespuestaSeguridad_respuestaIncorrecta_retornaFalse() throws UsuarioException {
        when(usuarioRepository.findByNickUsuarioIgnoreCase("testuser")).thenReturn(Optional.of(usuarioTest));
        assertFalse(usuarioService.verificarRespuestaSeguridad("testuser", "Wronganswer"));
    }

    @Test
    void verificarRespuestaSeguridad_respuestaNula_retornaFalse() throws UsuarioException {
        when(usuarioRepository.findByNickUsuarioIgnoreCase("testuser")).thenReturn(Optional.of(usuarioTest));
        assertFalse(usuarioService.verificarRespuestaSeguridad("testuser", null));
    }

    @Test
    void verificarRespuestaSeguridad_ignoraMayusculas_retornaTrue() throws UsuarioException {
        when(usuarioRepository.findByNickUsuarioIgnoreCase("testuser")).thenReturn(Optional.of(usuarioTest));
        assertTrue(usuarioService.verificarRespuestaSeguridad("testuser", "FIRULAIS"));
    }

    @Test
    void resetearPassword_exitoso_retornaTrue() throws UsuarioException {
        when(usuarioRepository.findByNickUsuarioIgnoreCase("testuser")).thenReturn(Optional.of(usuarioTest));
        when(usuarioRepository.save(any())).thenReturn(usuarioTest);

        boolean result = usuarioService.resetearPassword("testuser", "Firulais", "NuevaPassword789!");

        assertTrue(result);
        verify(usuarioRepository).save(argThat(u -> ENCODER.matches("NuevaPassword789!", u.getPassword())));
    }

    @Test
    void resetearPassword_respuestaIncorrecta_lanzaUsuarioException() {
        when(usuarioRepository.findByNickUsuarioIgnoreCase("testuser")).thenReturn(Optional.of(usuarioTest));

        UsuarioException ex = assertThrows(UsuarioException.class,
                () -> usuarioService.resetearPassword("testuser", "RespuestaWrong", "NuevaPassword789!"));
        assertEquals("Respuesta_incorrecta", ex.getMessage());
    }

    @Test
    void resetearPassword_mismaPassword_lanzaUsuarioException() {
        when(usuarioRepository.findByNickUsuarioIgnoreCase("testuser")).thenReturn(Optional.of(usuarioTest));

        UsuarioException ex = assertThrows(UsuarioException.class,
                () -> usuarioService.resetearPassword("testuser", "Firulais", PLAIN_PASSWORD));
        assertEquals("Password_igual", ex.getMessage());
    }

    @Test
    void resetearPassword_passwordNuevaNula_lanzaUsuarioException() {
        when(usuarioRepository.findByNickUsuarioIgnoreCase("testuser")).thenReturn(Optional.of(usuarioTest));

        UsuarioException ex = assertThrows(UsuarioException.class,
                () -> usuarioService.resetearPassword("testuser", "Firulais", null));
        assertEquals("Password_obligatoria", ex.getMessage());
    }

    @Test
    void resetearPassword_passwordNuevaBlanca_lanzaUsuarioException() {
        when(usuarioRepository.findByNickUsuarioIgnoreCase("testuser")).thenReturn(Optional.of(usuarioTest));

        UsuarioException ex = assertThrows(UsuarioException.class,
                () -> usuarioService.resetearPassword("testuser", "Firulais", "   "));
        assertEquals("Password_obligatoria", ex.getMessage());
    }
}