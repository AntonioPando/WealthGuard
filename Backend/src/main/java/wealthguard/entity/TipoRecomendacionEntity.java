package wealthguard.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tipo_recomendacion")
public class TipoRecomendacionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "mensaje", nullable = false)
    private String mensaje;

    @Column(name = "score_minimo", nullable = false)
    private Integer scoreMinimo;

    @Column(name = "score_maximo", nullable = false)
    private Integer scoreMaximo;

    @Column(name = "icono")
    private String icono;

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