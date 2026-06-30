package wealthguard.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import wealthguard.entity.TipoRecomendacionEntity;
import wealthguard.entity.UsuarioEntity;

@Schema(description = "DTO para la solicitud de creación de una recomendación financiera")
public class RecomendacionRequestDTO {

    @Schema(description = "Usuario al que va dirigida la recomendación")
    private UsuarioEntity usuario;

    @Schema(description = "Tipo de recomendación a aplicar")
    private TipoRecomendacionEntity tipoRecomendacion;

    @Schema(description = "Fecha en la que se genera la recomendación", example = "2024-06-01T10:00:00")
    private LocalDateTime fechaRecomendacion;

    public RecomendacionRequestDTO() {
    }

    public UsuarioEntity getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioEntity usuario) {
        this.usuario = usuario;
    }

    public TipoRecomendacionEntity getTipoRecomendacion() {
        return tipoRecomendacion;
    }

    public void setTipoRecomendacion(TipoRecomendacionEntity tipoRecomendacion) {
        this.tipoRecomendacion = tipoRecomendacion;
    }

    public LocalDateTime getFechaRecomendacion() {
        return fechaRecomendacion;
    }

    public void setFechaRecomendacion(LocalDateTime fechaRecomendacion) {
        this.fechaRecomendacion = fechaRecomendacion;
    }
}