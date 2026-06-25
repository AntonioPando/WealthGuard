package wealthguard.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para la solicitud de creación o edición de una categoría")
public class CategoriaRequestDTO {

    @Schema(description = "Nombre de la categoría", example = "Alimentación")
    private String nombre;

    @Schema(description = "Icono representativo de la categoría (opcional)", example = "icono.svg")
    private String icono;

    public CategoriaRequestDTO() {
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