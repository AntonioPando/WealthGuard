package wealthguard.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO de respuesta con los datos de una recomendación financiera")
public class RecomendacionResponseDTO {

    @Schema(description = "ID único de la recomendación", example = "1")
    private Integer idRecomendacion;

    @Schema(description = "Título de la recomendación", example = "Construye tu fondo de ahorro")
    private String titulo;

    @Schema(description = "Descripción / mensaje de la recomendación")
    private String descripcion;

    @Schema(description = "Rango de score al que aplica esta recomendación", example = "400-599")
    private String scoreRango;

    @Schema(description = "Icono representativo de la recomendación", example = "💰")
    private String icono;

    @Schema(description = "Fecha en la que se generó la recomendación", example = "2024-06-01T10:00:00")
    private LocalDateTime fechaRecomendacion;

    public RecomendacionResponseDTO() {
    }

    public Integer getIdRecomendacion() {
        return idRecomendacion;
    }

    public void setIdRecomendacion(Integer idRecomendacion) {
        this.idRecomendacion = idRecomendacion;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getScoreRango() {
        return scoreRango;
    }

    public void setScoreRango(String scoreRango) {
        this.scoreRango = scoreRango;
    }

    public String getIcono() {
        return icono;
    }

    public void setIcono(String icono) {
        this.icono = icono;
    }

    public LocalDateTime getFechaRecomendacion() {
        return fechaRecomendacion;
    }

    public void setFechaRecomendacion(LocalDateTime fechaRecomendacion) {
        this.fechaRecomendacion = fechaRecomendacion;
    }
}