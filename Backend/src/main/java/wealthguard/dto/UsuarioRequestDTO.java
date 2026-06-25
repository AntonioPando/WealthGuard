package wealthguard.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para la solicitud de creación o actualización de un usuario")
public class UsuarioRequestDTO {

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

    @Schema(description = "Contraseña del usuario", example = "MiPassword123!")
    private String password;

    @Schema(description = "Pregunta de seguridad para recuperación de cuenta", example = "¿Cuál es el nombre de tu mascota?")
    private String preguntaSeguridad;

    @Schema(description = "Respuesta a la pregunta de seguridad", example = "Firulais")
    private String respuestaSeguridad;

    @Schema(description = "URL o base64 de la foto de perfil del usuario", example = "https://cdn.example.com/fotos/jgarcia.jpg")
    private String fotoPerfil;

    public UsuarioRequestDTO() {
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
}