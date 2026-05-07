import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-filtros',
  imports: [
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule],
  templateUrl: './filtros.html',
  styleUrl: './filtros.css',
})
export class Filtros {

  // FILTRO FECHAS
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  @Output() rangoSeleccionado =
    new EventEmitter<{ inicio: Date | null, fin: Date | null }>();

  @Output() limpiar = new EventEmitter<void>();

  emitirFiltro() {
    this.rangoSeleccionado.emit({
      inicio: this.fechaInicio,
      fin: this.fechaFin
    });
  }

  limpiarFiltro() {
    this.fechaInicio = null;
    this.fechaFin = null;
    this.limpiar.emit();
  }

  // FILTRO TIPO
  @Output() tipoSeleccionado = new EventEmitter<'todos' | 'ingreso' | 'gasto'>();

}
