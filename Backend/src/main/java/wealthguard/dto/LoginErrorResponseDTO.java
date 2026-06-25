package wealthguard.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO de error para login")
public class LoginErrorResponseDTO {

    @Schema(description = "Mensaje de error de autenticación", example = "Credenciales inválidas")
    private String mensaje;

    public LoginErrorResponseDTO() {
    }

    public LoginErrorResponseDTO(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}
