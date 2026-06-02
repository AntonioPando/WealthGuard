import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Filtros } from './filtros/filtros';
import { Tabla } from './tabla/tabla';
import { HeaderMovimientos } from './header-movimientos/header-movimientos';
import { MenuLateral } from "../../layout/menu-lateral/menu-lateral";
import { Header } from "../../layout/header/header";
import { TransaccionResponse } from '../../../models/transaccion.model';
import { TransaccionService } from '../../../services/transaccion.service';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [
    HeaderMovimientos,
    Filtros,
    Tabla,
    MenuLateral,
    Header
  ],
  templateUrl: './movimientos.html',
  styleUrls: ['./movimientos.css'],
})
export class Movimientos implements OnInit {


  idUsuario: number = 1; // ID de usuario fijo para pruebas!!!!!!!!!!!!!!!!!!!

  movimientos: TransaccionResponse[] = [];
  movimientosFiltrados: TransaccionResponse[] = [];

  // variables para los insigths
  tendencia: number = 0;
  categoriaPrincipal: string[] = ['sin datos', '0,0'];
  meta: number[] = [0.0, 0.0];

  constructor(private transaccionService: TransaccionService, private cdr: ChangeDetectorRef) { }


  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    // Primero cargamos el historial completo de las transacciones
    this.transaccionService.ListarTransacciones(this.idUsuario).subscribe({
      next: (data) => {
        this.movimientos = data;

        this.limpiarFiltros(); // Inicialmente mostramos todos los movimientos sin filtros
        this.cdr.detectChanges(); // Forzamos la detección de cambios para actualizar la vista con los datos cargados
      },
      error: (e) => console.error(e)
    });

    // luego cargamos la tendencia, categoria principal y meta para los insights
    this.transaccionService.obtenerTendencia(this.idUsuario).subscribe(resultado => {
      this.tendencia = resultado;
      this.cdr.detectChanges();
    });

    this.transaccionService.obtenerCategoriaPrincipal(this.idUsuario).subscribe(resultado => {
      this.categoriaPrincipal = resultado;
      this.cdr.detectChanges();
    });

    this.transaccionService.obtenerMeta(this.idUsuario).subscribe(resultado => {
      this.meta = resultado;
      this.cdr.detectChanges();
    })
  }

  // Filtro de fechas
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

  // Limpiar filtros
  limpiarFiltros() {
    this.movimientosFiltrados = [...this.movimientos];
  }

  // Filtro tipo
  filtroTipo: 'todos' | 'ingreso' | 'gasto' = 'todos';

  filtrarPorTipo(tipo: 'todos' | 'ingreso' | 'gasto') {
    this.filtroTipo = tipo;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let data = [...this.movimientos];

    if (this.filtroTipo === 'ingreso') {
      data = data.filter(m => m.tipoTransaccion === true);
    } else if (this.filtroTipo === 'gasto') {
      data = data.filter(m => m.tipoTransaccion === false);
    }

    this.movimientosFiltrados = data;
  }
}
