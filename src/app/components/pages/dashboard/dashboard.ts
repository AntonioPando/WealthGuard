import { Component, OnInit } from '@angular/core';
import { Header } from '../../layout/header/header';
import { MenuLateral } from '../../layout/menu-lateral/menu-lateral';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { CategoriaRequest, categoriaRequestInicial } from '../../../models/categoria.model';


@Component({
  selector: 'app-dashboard',
  imports: [Header, MenuLateral, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  CategoriaRequest: CategoriaRequest = categoriaRequestInicial;

  fomularioCategoria: FormGroup | undefined;
  
  constructor(private fb: FormBuilder) {}

  setForm(categoriaRequest: CategoriaRequest) {
    this.formularioCategoria.patchValue({
      nombre: CategoriaRequest.nombre
    });
  }
    

}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }


