package wealthguard.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para la solicitud de creación o edición de un tipo de recomendación")
public class TipoRecomendacionRequestDTO {

    @Schema(description = "Nombre del tipo de recomendación", example = "Reducir gastos en ocio")
    private String nombre;

    @Schema(description = "Mensaje descriptivo de la recomendación", example = "Has superado tu límite de gasto en ocio este mes.")
    private String mensaje;

    @Schema(description = "Score mínimo a partir del cual aplica esta recomendación", example = "0")
    private Integer scoreMinimo;

    @Schema(description = "Score máximo hasta el cual aplica esta recomendación", example = "40")
    private Integer scoreMaximo;

    @Schema(description = "Icono representativo del tipo de recomendación", example = "📉")
    private String icono;

    public TipoRecomendacionRequestDTO() {
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public Integer getScoreMinimo() {
        return scoreMinimo;
    }

    public void setScoreMinimo(Integer scoreMinimo) {
        this.scoreMinimo = scoreMinimo;
    }

    public Integer getScoreMaximo() {
        return scoreMaximo;
    }

    public void setScoreMaximo(Integer scoreMaximo) {
        this.scoreMaximo = scoreMaximo;
    }

    public String getIcono() {
        return icono;
    }

    public void setIcono(String icono) {
        this.icono = icono;
    }
}