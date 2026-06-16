
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { A11yModule } from "@angular/cdk/a11y";

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [CommonModule, A11yModule],
  templateUrl: './tabla.html',
  styleUrls: ['./tabla.css'],
})
export class Tabla {

  @Input() movimientos: any[] = [];
  @Input() tendencia: number = 0;
  @Input() categoriaPrincipal: string[] = ['sin datos', '0,0'];
  @Input() meta: number[] = [0.0, 0.0];
  @Input() metaPasada: any = null;

  @Output() abrirEditar = new EventEmitter<any>();
  @Output() eliminar = new EventEmitter<number>();
  @Output() abrirModalMeta = new EventEmitter<void>();

  // Calculamos el porcentaje de la meta alcanzada
  get totalMeta(): number {
    // Verificamos que existan los datos
    if (!this.meta || this.meta.length < 2) {
      return 0;
    }

    const ahorroActual = this.meta[0];
    const objetivo = this.meta[1];

    // Evitamos división por cero o metas negativas
    if (objetivo <= 0) {
      return 0;
    }

    // Calculamos el porcentaje
    const porcentaje = (ahorroActual / objetivo) * 100;

    return Math.floor(Math.max(0, Math.min(100, porcentaje)));
  }

  pagina: number = 1;
  itemsPorPagina: number = 7;

  // Paginacion
  get totalPaginas() {
    return Math.ceil(this.movimientos.length / this.itemsPorPagina);
  }

  // Paginas
  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  // Movimientos paginados
  get movimientosPaginados() {
    const inicio = (this.pagina - 1) * this.itemsPorPagina;
    return this.movimientos.slice(inicio, inicio + this.itemsPorPagina);
  }

  irAPagina(p: number) {
    this.pagina = p;
  }


  anterior() {
    if (this.pagina > 1) {
      this.pagina--;
    }
  }

  siguiente() {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
    }

  }

  // Funcion para determinar si una transaccion es editable
  esEditable(fecha: any): boolean {
  if (!fecha) return false;
  
  const fechaTransaccion = new Date(fecha);
  const fechaLimite = new Date();
  fechaLimite.setMonth(fechaLimite.getMonth() - 3); // Restamos 3 meses
  
  return fechaTransaccion >= fechaLimite;
}
}
