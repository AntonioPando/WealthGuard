import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-presupuesto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './presupuesto-form.html',
  styleUrl: './presupuesto-form.css',
})
export class PresupuestoForm implements OnInit {

  @Input() presupuestoEditar: any;
  @Input() categoriasLista: { id: number, nombre: string }[] = [];


  @Output() guardar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<void>();

  form: FormGroup;
  esEdicion: boolean = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      idCategoria: ['', Validators.required],
      limite: ['', [Validators.required, Validators.min(0.01)]]
    });
  }


  ngOnInit(): void {
    if (this.presupuestoEditar) {
      this.esEdicion = true;
      // Patch de datos existentes
      this.form.patchValue({
        idCategoria: this.presupuestoEditar.idCategoria, // 👈 Apuntamos al ID plano corregido
        limite: this.presupuestoEditar.limite,
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      // Devolvemos los datos
      this.guardar.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
