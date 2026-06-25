package wealthguard.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para la solicitud de reseteo de contraseña")
public class ResetearPasswordRequestDTO {
    @Schema(description = "Nick o email del usuario", example = "jgarcia92")    
    private String usuario;
    @Schema(description = "Respuesta a la pregunta de seguridad del usuario", example = "Fido")
    private String respuesta;
    @Schema
    private String passwordNueva;

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getRespuesta() {
        return respuesta;
    }

    public void setRespuesta(String respuesta) {
        this.respuesta = respuesta;
    }

    public String getPasswordNueva() {
        return passwordNueva;
    }

    public void setPasswordNueva(String passwordNueva) {
        this.passwordNueva = passwordNueva;
    }
}