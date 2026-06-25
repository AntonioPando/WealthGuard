package wealthguard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import wealthguard.dto.LoginErrorResponseDTO;
import wealthguard.dto.LoginRequestDTO;
import wealthguard.dto.LoginResponseDTO;
import wealthguard.dto.PreguntaSeguridadResponseDTO;
import wealthguard.dto.ResetearPasswordRequestDTO;
import wealthguard.dto.UsuarioRequestDTO;
import wealthguard.dto.UsuarioResponseDTO;
import wealthguard.dto.VerificarRespuestaRequestDTO;
import wealthguard.exception.UsuarioException;
import wealthguard.service.IUsuarioService;

@RestController
@RequestMapping("/usuarios")
@Tag(name = "Usuarios", description = "Gestión de usuarios y cuentas de la aplicación")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = { "Content-Type",
        "Authorization" }, allowCredentials = "false", methods = { RequestMethod.OPTIONS,
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE })
public class UsuarioController {

    @Autowired
    private IUsuarioService usuarioService;

    @Operation(summary = "Iniciar sesión por nick o email y contraseña")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login correcto", content = @Content(schema = @Schema(implementation = LoginResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "Credenciales inválidas", content = @Content(schema = @Schema(implementation = LoginErrorResponseDTO.class)))
    })
    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequestDTO requestDTO) {
        try {
            LoginResponseDTO response = usuarioService.login(requestDTO);
            return ResponseEntity.ok(response);
        } catch (UsuarioException e) {
            return ResponseEntity.status(401).body(new LoginErrorResponseDTO("Credenciales inválidas"));
        }
    }

    @Operation(summary = "Crear un nuevo usuario")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario creado correctamente", content = @Content(schema = @Schema(implementation = UsuarioResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o usuario ya existente", content = @Content)
    })
    @PostMapping("/crear")
    public ResponseEntity<UsuarioResponseDTO> crearUsuario(@RequestBody UsuarioRequestDTO requestDTO) {
        try {
            UsuarioResponseDTO creado = usuarioService.crearUsuario(requestDTO);
            return ResponseEntity.ok(creado);
        } catch (UsuarioException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Verificar si un nombre de usuario ya existe")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "true si existe, false si está disponible", content = @Content(schema = @Schema(implementation = Boolean.class)))
    })
    @GetMapping("/existe-nick")
    public ResponseEntity<Boolean> existeNick(
            @Parameter(description = "Nombre de usuario a verificar", required = true) @RequestParam String nick) {
        return ResponseEntity.ok(usuarioService.existeNick(nick));
    }

    @Operation(summary = "Verificar si un email ya existe")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "true si existe, false si está disponible", content = @Content(schema = @Schema(implementation = Boolean.class)))
    })
    @GetMapping("/existe-email")
    public ResponseEntity<Boolean> existeEmail(
            @Parameter(description = "Email a verificar", required = true) @RequestParam String email) {
        return ResponseEntity.ok(usuarioService.existeEmail(email));
    }

    @Operation(summary = "Listar todos los usuarios")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Listado de usuarios obtenido correctamente", content = @Content(array = @ArraySchema(schema = @Schema(implementation = UsuarioResponseDTO.class))))
    })
    @GetMapping("/listar")
    public List<UsuarioResponseDTO> listarUsuarios(
            @Parameter(description = "Nick del usuario autenticado", required = true) @RequestParam String nickUsuario,
            @Parameter(description = "Contraseña del usuario autenticado", required = true) @RequestParam String contrasena) {
        return usuarioService.listarUsuarios(nickUsuario, contrasena);
    }

    @Operation(summary = "Obtener el perfil de un usuario por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Perfil obtenido correctamente", content = @Content(schema = @Schema(implementation = UsuarioResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content)
    })
    @GetMapping("/perfil/{idUsuario}")
    public ResponseEntity<UsuarioResponseDTO> obtenerPerfil(
            @Parameter(description = "ID del usuario", required = true) @PathVariable int idUsuario,
            @Parameter(description = "Nick del usuario autenticado", required = true) @RequestParam String nickUsuario,
            @Parameter(description = "Contraseña del usuario autenticado", required = true) @RequestParam String contrasena) {
        try {
            UsuarioResponseDTO usuario = usuarioService.obtenerPerfil(idUsuario, nickUsuario, contrasena);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Actualizar los datos del perfil de un usuario")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario actualizado correctamente", content = @Content(schema = @Schema(implementation = UsuarioResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content)
    })
    @PutMapping("/actualizar/{idUsuario}")
    public ResponseEntity<UsuarioResponseDTO> actualizarUsuario(
            @Parameter(description = "ID del usuario a actualizar", required = true) @PathVariable int idUsuario,
            @RequestBody UsuarioRequestDTO requestDTO,
            @Parameter(description = "Nick del usuario autenticado", required = true) @RequestParam String nickUsuario,
            @Parameter(description = "Contraseña del usuario autenticado", required = true) @RequestParam String contrasena) {
        try {
            UsuarioResponseDTO actualizado = usuarioService.actualizarUsuario(idUsuario, requestDTO, nickUsuario,
                    contrasena);
            return ResponseEntity.ok(actualizado);
        } catch (UsuarioException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Eliminar la cuenta de un usuario de forma permanente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cuenta eliminada correctamente", content = @Content(schema = @Schema(implementation = Boolean.class))),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content)
    })
    @DeleteMapping("/eliminar/{idUsuario}")
    public ResponseEntity<Boolean> eliminarCuenta(
            @Parameter(description = "ID del usuario a eliminar", required = true) @PathVariable int idUsuario,
            @Parameter(description = "Nick del usuario autenticado", required = true) @RequestParam String nickUsuario,
            @Parameter(description = "Contraseña del usuario autenticado", required = true) @RequestParam String contrasena) {
        boolean eliminado = usuarioService.eliminarCuenta(idUsuario, nickUsuario, contrasena);
        if (eliminado) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Cambiar la contraseña del usuario")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contraseña cambiada correctamente", content = @Content(schema = @Schema(implementation = Boolean.class))),
            @ApiResponse(responseCode = "400", description = "Contraseña antigua incorrecta u otros errores", content = @Content)
    })
    @PutMapping("/cambiar-password/{idUsuario}")
    public ResponseEntity<Object> cambiarPassword(
            @Parameter(description = "ID del usuario", required = true) @PathVariable int idUsuario,
            @Parameter(description = "Contraseña actual del usuario", required = true) @RequestParam String passwordAntigua,
            @Parameter(description = "Nueva contraseña del usuario", required = true) @RequestParam String passwordNueva,
            @Parameter(description = "Nick del usuario autenticado", required = true) @RequestParam String nickUsuario,
            @Parameter(description = "Contraseña del usuario autenticado", required = true) @RequestParam String contrasena) {
        try {
            boolean resultado = usuarioService.cambiarPassword(idUsuario, passwordAntigua, passwordNueva,
                    nickUsuario, contrasena);
            return ResponseEntity.ok(resultado);
        } catch (UsuarioException e) {
            String mensaje = switch (e.getMessage()) {
                case "Password_igual" -> "La nueva contraseña no puede ser igual a la anterior.";
                case "Password_incorrecta" -> "La contraseña actual es incorrecta.";
                default -> "No se pudo actualizar la contraseña.";
            };
            return ResponseEntity.status(400).body(new LoginErrorResponseDTO(mensaje));
        }
    }

    @Operation(summary = "Exportar los datos del usuario como CSV (RGPD)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Fichero CSV generado correctamente", content = @Content(mediaType = "text/csv", schema = @Schema(type = "string", format = "binary"))),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content)
    })
    @GetMapping("/exportar/{idUsuario}")
    public ResponseEntity<byte[]> exportarDatos(
            @Parameter(description = "ID del usuario", required = true) @PathVariable int idUsuario,
            @Parameter(description = "Nick del usuario autenticado", required = true) @RequestParam String nickUsuario,
            @Parameter(description = "Contraseña del usuario autenticado", required = true) @RequestParam String contrasena) {
        try {
            byte[] datos = usuarioService.exportarDatos(idUsuario, nickUsuario, contrasena);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"datos_usuario_" + idUsuario + ".csv\"")
                    .header("Content-Type", "text/csv")
                    .body(datos);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Actualizar la foto de perfil del usuario", description = "Recibe la imagen como MultipartFile y devuelve la URL pública de la foto actualizada")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Foto de perfil actualizada correctamente", content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content)
    })
    @PutMapping("/foto-perfil/{idUsuario}")
    public ResponseEntity<String> actualizarFotoPerfil(
            @Parameter(description = "ID del usuario", required = true) @PathVariable int idUsuario,
            @RequestParam("imagen") MultipartFile imagen) {
        try {
            String url = usuarioService.actualizarFotoPerfil(idUsuario, imagen);
            return ResponseEntity.ok(url);
        } catch (UsuarioException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Obtener la pregunta de seguridad para recuperar contraseña")
    @GetMapping("/pregunta-seguridad")
    public ResponseEntity<Object> obtenerPreguntaSeguridad(@RequestParam String usuario) {
        try {
            String pregunta = usuarioService.obtenerPreguntaSeguridad(usuario);
            return ResponseEntity.ok(new PreguntaSeguridadResponseDTO(pregunta));
        } catch (UsuarioException e) {
            return ResponseEntity.status(404).body(new LoginErrorResponseDTO("Usuario no encontrado"));
        }
    }

    @Operation(summary = "Verificar la respuesta de seguridad")
    @PostMapping("/verificar-respuesta")
    public ResponseEntity<Boolean> verificarRespuesta(@RequestBody VerificarRespuestaRequestDTO requestDTO) {
        try {
            boolean correcta = usuarioService.verificarRespuestaSeguridad(requestDTO.getUsuario(),
                    requestDTO.getRespuesta());
            return ResponseEntity.ok(correcta);
        } catch (UsuarioException e) {
            return ResponseEntity.ok(false);
        }
    }

    @Operation(summary = "Resetear la contraseña tras verificar la pregunta de seguridad")
    @PutMapping("/resetear-password")
    public ResponseEntity<Object> resetearPassword(@RequestBody ResetearPasswordRequestDTO requestDTO) {
        try {
            usuarioService.resetearPassword(requestDTO.getUsuario(), requestDTO.getRespuesta(),
                    requestDTO.getPasswordNueva());
            return ResponseEntity.ok(true);
        } catch (UsuarioException e) {
            String mensaje;
            switch (e.getMessage()) {
                case "Respuesta_incorrecta" -> mensaje = "La respuesta de seguridad no es correcta.";
                case "Password_igual" -> mensaje = "La nueva contraseña no puede ser igual a la anterior.";
                default -> mensaje = "No se pudo actualizar la contraseña.";
            }
            return ResponseEntity.status(400).body(new LoginErrorResponseDTO(mensaje));
        }
    }
}