package wealthguard.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO de respuesta con los datos de una categoría")
public class CategoriaResponseDTO {

    @Schema(description = "ID único de la categoría", example = "1")
    private Integer id;

    @Schema(description = "Nombre de la categoría", example = "Alimentación")
    private String nombre;

    @Schema(description = "Icono representativo de la categoría (opcional)", example = "icono.svg")
    private String icono;

    public CategoriaResponseDTO() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getIcono() {
        return icono;
    }

    public void setIcono(String icono) {
        this.icono = icono;
    }

}