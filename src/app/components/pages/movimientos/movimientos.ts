import { Component } from '@angular/core';
import { Filtros } from './filtros/filtros';
import { Tabla } from './tabla/tabla';
import { HeaderMovimientos } from './header-movimientos/header-movimientos';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [
    HeaderMovimientos,
    Filtros,
    Tabla
  ],
  templateUrl: './movimientos.html',
  styleUrls: ['./movimientos.css'],
})
export class Movimientos {

  movimientos = [
    { fecha: '2026-10-24', categoria: 'Minorista', descripcion: 'Compra Apple Store', monto: -1299, tipo: 'gasto' },
    { fecha: '2026-10-22', categoria: 'Salario', descripcion: 'Honorarios', monto: 8500, tipo: 'ingreso' },
    { fecha: '2026-10-20', categoria: 'Entretenimiento', descripcion: 'Netflix', monto: -15, tipo: 'gasto' },
    { fecha: '2026-10-18', categoria: 'Transporte', descripcion: 'Uber', monto: -25, tipo: 'gasto' },
    { fecha: '2026-10-15', categoria: 'Inversiones', descripcion: 'Dividendos', monto: 200, tipo: 'ingreso' },
    { fecha: '2026-10-12', categoria: 'Comida', descripcion: 'Restaurante', monto: -45, tipo: 'gasto' },
    { fecha: '2026-10-10', categoria: 'Salario', descripcion: 'Honorarios', monto: 8500, tipo: 'ingreso' },
    { fecha: '2026-10-08', categoria: 'Entretenimiento', descripcion: 'Spotify', monto: -10, tipo: 'gasto' },
    { fecha: '2026-10-05', categoria: 'Transporte', descripcion: 'Gasolina', monto: -60, tipo: 'gasto' },
    { fecha: '2026-10-02', categoria: 'Inversiones', descripcion: 'Venta de acciones', monto: 1500, tipo: 'ingreso' },
  ];

  movimientosFiltrados = [...this.movimientos];

  // FILTRO FECHAS
  aplicarFiltroFechas(rango: { inicio: Date | null, fin: Date | null }) {

    if (!rango.inicio || !rango.fin) {
      this.movimientosFiltrados = [...this.movimientos];
      return;
    }

    const inicio = new Date(rango.inicio).getTime();
    const fin = new Date(rango.fin).getTime();

    this.movimientosFiltrados = this.movimientos.filter(m => {
      const fecha = new Date(m.fecha).getTime();
      return fecha >= inicio && fecha <= fin;
    });
  }

  // LIMPIAR FILTRO
  limpiarFiltros() {
    this.movimientosFiltrados = [...this.movimientos];
  }

  // FILTRO TIPO
  filtroTipo: 'todos' | 'ingreso' | 'gasto' = 'todos';

  filtrarPorTipo(tipo: 'todos' | 'ingreso' | 'gasto') {
    this.filtroTipo = tipo;

    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let data = [...this.movimientos];

    if (this.filtroTipo !== 'todos') {
      data = data.filter(m => m.tipo === this.filtroTipo);
    }

    this.movimientosFiltrados = data;
  }
}
