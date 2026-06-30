package wealthguard.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para la respuesta de la pregunta de seguridad")
public class PreguntaSeguridadResponseDTO {
    @Schema(description = "Pregunta de seguridad asociada al usuario", example = "¿Cuál es el nombre de tu primera mascota?")   
    private String pregunta;

    public PreguntaSeguridadResponseDTO() {
    }

    public PreguntaSeguridadResponseDTO(String pregunta) {
        this.pregunta = pregunta;
    }

    public String getPregunta() {
        return pregunta;
    }

    public void setPregunta(String pregunta) {
        this.pregunta = pregunta;
    }
}