package wealthguard.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para la solicitud de creación o edición de un objetivo financiero")
public class ObjetivoRequestDTO {

    @Schema(description = "ID del usuario propietario del objetivo", example = "42")
    private Integer usuarioId;

    @Schema(description = "Cantidad de dinero objetivo a alcanzar", example = "1500.00")
    private Double cantidadObjetivo;

    public ObjetivoRequestDTO() {
    }

    public Integer getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Integer usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Double getCantidadObjetivo() {
        return cantidadObjetivo;
    }

    public void setCantidadObjetivo(Double cantidadObjetivo) {
        this.cantidadObjetivo = cantidadObjetivo;
    }

}