package wealthguard.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;


@Entity
@Table(name = "recomendacion")
public class RecomendacionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

 @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioEntity usuario;

     @ManyToOne
    @JoinColumn(name = "tipo_recomendacion_id", nullable = false)
    private TipoRecomendacionEntity tipoRecomendacion;

       @Column(name = "fecha_recomendacion", nullable = false)
    private LocalDateTime fechaRecomendacion;

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