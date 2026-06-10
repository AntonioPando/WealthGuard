import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-transaccion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaccion-form.html',
  styleUrl: './transaccion-form.css',
})
export class TransaccionForm implements OnInit {

  // Si es null es creacion y si tiene valor es editar
  @Input() transaccionEditar: any = null;
  // Para el desplegable de categorias
  @Input() categoriasLista: { id: number, nombre: string }[] = [];

  @Output() guardar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<void>();

  form: FormGroup;
  esEdicion: boolean = false;

  constructor(private fb: FormBuilder) {
    // Estructura del formulario
    this.form = this.fb.group({
      tipoTransaccion: [null, Validators.required], // false = gasto, true = ingreso
      cantidad: ['', [Validators.required, Validators.min(0.01)]], // validamos que el numero sea positivo
      fecha: ['', Validators.required],
      descripcion: [''],
      idCategoria: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Comprobamos si recibimos una transaccion para editar
    if (this.transaccionEditar) {
      this.esEdicion = true;
    }

    const datos = this.transaccionEditar;

    // Formateamos la fecha 
    const fechaFormateada = datos?.fecha ? datos.fecha.substring(0, 10) : '';

    // Si es edicion rellenamos los datos del formulario
    this.form.patchValue({
      tipoTransaccion: this.transaccionEditar.tipoTransaccion,
      cantidad: this.transaccionEditar.cantidad,
      fecha: fechaFormateada,
      descripcion: this.transaccionEditar.descripcion,
      idCategoria: this.transaccionEditar.idCategoria
    });

  }

  onSubmit() {
    if (this.form.valid) {
      this.guardar.emit(this.form.value);
    } else {
      this.form.markAllAsTouched(); // Se pone en rojo si hay error en la validacion
    }
  }



}
