
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla.html',
  styleUrls: ['./tabla.css'],
})
export class Tabla {

  // MOVIMIENTOS
  @Input() movimientos: any[] = [];

  pagina: number = 1;
  itemsPorPagina: number = 7;

  // PAGINACIÓN
  get totalPaginas() {
    return Math.ceil(this.movimientos.length / this.itemsPorPagina);
  }

  // PAGINAS
  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  // MOVIMIENTOS PAGINADOS
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
}
