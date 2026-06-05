import { Component, OnInit } from '@angular/core';
import { Header } from '../../layout/header/header';
import { MenuLateral } from '../../layout/menu-lateral/menu-lateral';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Categoria, categoriaRequestInicial } from '../../../models/categoria.model';
import { isOkResponse, loadResponseData } from '../../../services/utils.service';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [Header, MenuLateral, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  CategoriaRequest: Categoria = categoriaRequestInicial;

  formularioCategoria: FormGroup;
  // Inyectamos el servicio correctamente

  constructor(private fb: FormBuilder, private dashboardService: DashboardService) {
    this.formularioCategoria = this.fb.group({
      nombre: [''],
    });
  }

  setForm(categoriaRequest: Categoria) {
    this.formularioCategoria.patchValue({
      nombre: categoriaRequest.nombre,
    });
  }

  getForm(): Categoria {
    const formData = this.formularioCategoria.value;
    const categoriaFinal: Categoria = {
      nombre: formData.nombre,
    };
    return categoriaFinal;
  }

  async onSave() {
    const categoriaFinal = this.getForm();

    let response;
    response = await this.dashboardService.crearCategoria(categoriaFinal);

    if (isOkResponse(response)) {
      const categoriaCreada = loadResponseData(response);
      console.log('Categoría creada:', categoriaCreada);
    } else {
      console.error('Error al crear la categoría');
    }
  }
}
