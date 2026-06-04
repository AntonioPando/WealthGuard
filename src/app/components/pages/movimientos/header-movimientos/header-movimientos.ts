import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header-movimientos',
  imports: [],
  templateUrl: './header-movimientos.html',
  styleUrl: './header-movimientos.css',
})
export class HeaderMovimientos {

  @Output() abrirCrear = new EventEmitter<void>();
}
