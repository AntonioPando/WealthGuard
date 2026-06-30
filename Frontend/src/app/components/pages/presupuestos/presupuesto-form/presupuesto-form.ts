import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

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
  @Input() categoriasOcupadas: number[] = [];


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
      this.form.patchValue({
        idCategoria: this.presupuestoEditar.idCategoria,
        limite: this.presupuestoEditar.limite,
      });
    }

    this.form.get('idCategoria')?.setValidators([
      Validators.required,
      (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;

        const idSeleccionado = Number(control.value);

        if (this.esEdicion && idSeleccionado === this.presupuestoEditar?.idCategoria) {
          return null;
        }

        const yaExiste = this.categoriasOcupadas.includes(idSeleccionado);
        return yaExiste ? { categoriaDuplicada: true } : null;
      }
    ]);

    this.form.get('idCategoria')?.updateValueAndValidity();
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
