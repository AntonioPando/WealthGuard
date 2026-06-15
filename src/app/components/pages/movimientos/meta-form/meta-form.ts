import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-meta-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './meta-form.html',
  styleUrl: './meta-form.css',
})
export class MetaForm implements OnInit {

  @Input() metaEditar: any = null;
  @Output() guardar = new EventEmitter<number>();
  @Output() cancelar = new EventEmitter<void>();

  cantidad: number | null = null;
  ngOnInit(): void {

    if(this.metaEditar && this.metaEditar.cantidadObjetivo){
      this.cantidad = this.metaEditar.cantidadObjetivo
    }
  }

  onGuardar() {
    if (this.cantidad && this.cantidad > 0) {
      this.guardar.emit(this.cantidad);
    }
  }
}
