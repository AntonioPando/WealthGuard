
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  
  // Calculamos el porcentaje de la meta alcanzada
  get totalMeta(): number {
    // Evitamos división por cero
    if (!this.meta || this.meta[1] === 0) {
      return 0;
    }
    // Si el backend ya nos devuelve el porcentaje calculado, lo usamos directamente, sino lo calculamos 
    return this.meta[2] !== undefined ? this.meta[2] : Math.round((this.meta[0] / (this.meta[1]) * 100));
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
}
