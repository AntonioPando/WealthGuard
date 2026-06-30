package wealthguard.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import wealthguard.entity.CategoriaEntity;
import wealthguard.entity.UsuarioEntity;

@Schema(
    name = "PresupuestoResponseDTO",
    description = "Respuesta con la información de un presupuesto, incluyendo el gasto actual y el porcentaje consumido."
)
public class PresupuestoResponseDTO {

    @Schema(
        description = "Identificador único del presupuesto",
        example = "1"
    )
    private Integer id;

    @Schema(
        description = "Usuario propietario del presupuesto"
    )
    private UsuarioEntity usuario;

    @Schema(
        description = "Categoría asociada al presupuesto"
    )
    private CategoriaEntity categoria;

    @Schema(
        description = "Límite máximo de gasto permitido para la categoría",
        example = "500.00"
    )
    private double limite;

    @Schema(
        description = "Fecha y hora de inicio del periodo presupuestario",
        example = "2025-01-01T00:00:00"
    )
    private LocalDateTime fechaInicio;

    @Schema(
        description = "Fecha y hora de finalización del periodo presupuestario",
        example = "2025-01-31T23:59:59"
    )
    private LocalDateTime fechaFin;

    @Schema(
        description = "Importe total gastado actualmente en la categoría durante el periodo",
        example = "275.50"
    )
    private double gastoActual;

    @Schema(
        description = "Porcentaje consumido del presupuesto calculado como (gastoActual / limite) * 100",
        example = "55.10"
    )
    private double porcentaje;

    public PresupuestoResponseDTO() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public UsuarioEntity getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioEntity usuario) {
        this.usuario = usuario;
    }

    public CategoriaEntity getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaEntity categoria) {
        this.categoria = categoria;
    }

    public double getLimite() {
        return limite;
    }

    public void setLimite(double limite) {
        this.limite = limite;
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

    public double getGastoActual() {
        return gastoActual;
    }

    public void setGastoActual(double gastoActual) {
        this.gastoActual = gastoActual;
    }

    public double getPorcentaje() {
        return porcentaje;
    }

    public void setPorcentaje(double porcentaje) {
        this.porcentaje = porcentaje;
    }
}