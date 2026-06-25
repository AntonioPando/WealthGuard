package wealthguard.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para la solicitud de inicio de sesión")
public class LoginRequestDTO {

    @Schema(description = "Nick o email del usuario", example = "jgarcia92")
    private String usuario;

    @Schema(description = "Contraseña en texto plano", example = "MiPassword123!")
    private String pass;

    public LoginRequestDTO() {
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }
}
