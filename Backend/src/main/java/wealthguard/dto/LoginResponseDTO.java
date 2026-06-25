package wealthguard.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO de respuesta del inicio de sesión")
public class LoginResponseDTO {

    @Schema(description = "Mensaje de estado de la autenticación", example = "Login correcto")
    private String mensaje;

    @Schema(description = "Token de sesión generado", example = "b1946ac9-3f0d-4af6-96e6-6f6f0f12eabd")
    private String token;

    @Schema(description = "ID del usuario autenticado", example = "42")
    private Integer idUsuario;

    @Schema(description = "Nick del usuario autenticado", example = "jgarcia92")
    private String nickUsuario;

    @Schema(description = "Nombre del usuario", example = "Juan")
    private String nombre;

    @Schema(description = "Email del usuario", example = "juan@email.com")
    private String email;

    @Schema(description = "Indica si la cuenta está activa", example = "true")
    private Boolean activo;

    public LoginResponseDTO() {
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}
