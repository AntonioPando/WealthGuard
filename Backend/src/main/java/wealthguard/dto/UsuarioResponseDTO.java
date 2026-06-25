package wealthguard.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO de respuesta con los datos de un usuario")
public class UsuarioResponseDTO {

    @Schema(description = "ID único del usuario", example = "42")
    private Integer id;

    @Schema(description = "Nombre de usuario único", example = "jgarcia92")
    private String nickUsuario;

    @Schema(description = "Nombre real del usuario", example = "Juan")
    private String nombre;

    @Schema(description = "Primer apellido del usuario", example = "García")
    private String primerApellido;

    @Schema(description = "Segundo apellido del usuario", example = "López")
    private String segundoApellido;

    @Schema(description = "Correo electrónico del usuario", example = "juan@email.com")
    private String email;

    @Schema(description = "Contraseña cifrada del usuario")
    private String password;

    @Schema(description = "Pregunta de seguridad para recuperación de cuenta", example = "¿Cuál es el nombre de tu mascota?")
    private String preguntaSeguridad;

    @Schema(description = "Respuesta de seguridad del usuario")
    private String respuestaSeguridad;

    @Schema(description = "URL o base64 de la foto de perfil del usuario", example = "https://cdn.example.com/fotos/jgarcia.jpg")
    private String fotoPerfil;

    @Schema(description = "Fecha y hora de registro del usuario", example = "2024-01-15T09:30:00")
    private LocalDateTime fechaRegistro;

    @Schema(description = "Fecha y hora del último cambio de contraseña", example = "2024-03-10T14:00:00")
    private LocalDateTime fechaUltimoCambioPassword;

    public UsuarioResponseDTO() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNickUsuario() {
        return nickUsuario;
    }

    public void setNickUsuario(String nickUsuario) {
        this.nickUsuario = nickUsuario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getPrimerApellido() {
        return primerApellido;
    }

    public void setPrimerApellido(String primerApellido) {
        this.primerApellido = primerApellido;
    }

    public String getSegundoApellido() {
        return segundoApellido;
    }

    public void setSegundoApellido(String segundoApellido) {
        this.segundoApellido = segundoApellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPreguntaSeguridad() {
        return preguntaSeguridad;
    }

    public void setPreguntaSeguridad(String preguntaSeguridad) {
        this.preguntaSeguridad = preguntaSeguridad;
    }

    public String getRespuestaSeguridad() {
        return respuestaSeguridad;
    }

    public void setRespuestaSeguridad(String respuestaSeguridad) {
        this.respuestaSeguridad = respuestaSeguridad;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public LocalDateTime getFechaUltimoCambioPassword() {
        return fechaUltimoCambioPassword;
    }

    public void setFechaUltimoCambioPassword(LocalDateTime fechaUltimoCambioPassword) {
        this.fechaUltimoCambioPassword = fechaUltimoCambioPassword;
    }

}