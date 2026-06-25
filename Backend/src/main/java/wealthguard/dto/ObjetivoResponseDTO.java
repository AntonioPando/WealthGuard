package wealthguard.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO de respuesta con los datos de un objetivo financiero")
public class ObjetivoResponseDTO {

    @Schema(description = "ID único del objetivo", example = "1")
    private Integer id;

    @Schema(description = "ID del usuario propietario del objetivo", example = "42")
    private Integer usuarioId;

    @Schema(description = "Cantidad de dinero objetivo a alcanzar", example = "1500.00")
    private Double cantidadObjetivo;

    @Schema(description = "Fecha de inicio del objetivo", example = "2024-01-01T00:00:00")
    private LocalDateTime fechaInicio;

    @Schema(description = "Fecha de fin del objetivo", example = "2024-12-31T23:59:59")
    private LocalDateTime fechaFin;

    public ObjetivoResponseDTO() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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


    public LocalDateTime getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDateTime fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDateTime getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDateTime fechaFin) {
        this.fechaFin = fechaFin;
    }

}