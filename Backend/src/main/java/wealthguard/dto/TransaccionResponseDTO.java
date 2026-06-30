package wealthguard.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO de respuesta con los datos de una transacción")
public class TransaccionResponseDTO {

    @Schema(description = "ID único de la transacción", example = "1")
    private Integer id;

    @Schema(description = "Cantidad de dinero de la transacción", example = "49.99")
    private double cantidad;

    @Schema(description = "Fecha y hora de la transacción", example = "2024-06-01T14:30:00")
    private LocalDateTime fecha;

    @Schema(description = "Descripción o concepto de la transacción", example = "Compra supermercado")
    private String descripcion;

    @Schema(description = "Nombre de la categoría asociada a la transacción", example = "Alimentación")
    private String nombreCategoria;

    @Schema(description = "ID de la categoría asociada a la transacción", example = "3")
    private Integer idCategoria;

    @Schema(description = "Tipo de transacción: true = ingreso, false = gasto", example = "false")
    private Boolean tipoTransaccion;

    public TransaccionResponseDTO() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public double getCantidad() {
        return cantidad;
    }

    public void setCantidad(double cantidad) {
        this.cantidad = cantidad;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getNombreCategoria() {
        return nombreCategoria;
    }

    public void setNombreCategoria(String nombreCategoria) {
        this.nombreCategoria = nombreCategoria;
    }

    public Integer getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Integer idCategoria) {
        this.idCategoria = idCategoria;
    }

    public Boolean getTipoTransaccion() {
        return tipoTransaccion;
    }

    public void setTipoTransaccion(Boolean tipoTransaccion) {
        this.tipoTransaccion = tipoTransaccion;
    }
}