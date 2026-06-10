import { Component } from '@angular/core';
import { Header } from "../../layout/header/header";
import { MenuLateral } from "../../layout/menu-lateral/menu-lateral";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresupuestoForm } from './presupuesto-form/presupuesto-form';

const ICONOS_CATEGORIA: Record<string, string> = {
  'Comida y Restaurantes': '🍽️',
  'Vivienda': '🏠',
  'Transporte': '🚗',
  'Entretenimiento': '🎬',
  'Compras': '🛍️',
  'Salud': '🏥',
  'Educación': '📚',
  'Servicios': '⚡',
  'Viajes': '✈️',
  'Otros': '📦'
};

@Component({
  selector: 'app-presupuestos',
  standalone: true,
  imports: [Header, MenuLateral, CommonModule, FormsModule, PresupuestoForm],
  templateUrl: './presupuestos.html',
  styleUrl: './presupuestos.css',
})

export class Presupuestos {

  public presupuestoEditando: any = null;
  public mostrarFormulario: boolean = false;

  // Categorías hardcodeadas
  public listaCategorias = [
    { id: 1, nombre: 'Comida y Restaurantes', icono: ICONOS_CATEGORIA['Comida y Restaurantes'] },
    { id: 2, nombre: 'Vivienda', icono: ICONOS_CATEGORIA['Vivienda'] },
    { id: 3, nombre: 'Transporte', icono: ICONOS_CATEGORIA['Transporte'] },
    { id: 4, nombre: 'Entretenimiento', icono: ICONOS_CATEGORIA['Entretenimiento'] },
    { id: 5, nombre: 'Compras', icono: ICONOS_CATEGORIA['Compras'] },
    { id: 6, nombre: 'Salud', icono: ICONOS_CATEGORIA['Salud'] },
    { id: 7, nombre: 'Educación', icono: ICONOS_CATEGORIA['Educación'] },
    { id: 8, nombre: 'Servicios', icono: ICONOS_CATEGORIA['Servicios'] },
    { id: 9, nombre: 'Viajes', icono: ICONOS_CATEGORIA['Viajes'] },
    { id: 10, nombre: 'Otros', icono: ICONOS_CATEGORIA['Otros'] }
  ];

  // Datos harcodeados que controlan la interfaz
  public listaPresupuestos = [
    {
      id: 1,
      categoria: 'Comida y Restaurantes',
      icono: ICONOS_CATEGORIA['Comida y Restaurantes'],
      gastado: 810.40,
      limite: 1200.00
    },
    {
      id: 2,
      categoria: 'Vivienda',
      icono: ICONOS_CATEGORIA['Vivienda'],
      gastado: 2700.00,
      limite: 3000.00
    },
    {
      id: 3,
      categoria: 'Transporte',
      icono: ICONOS_CATEGORIA['Transporte'],
      gastado: 50.15,
      limite: 600.00
    },
    {
      id: 4,
      categoria: 'Entretenimiento',
      icono: ICONOS_CATEGORIA['Entretenimiento'],
      gastado: 1305.00,
      limite: 400.00
    },
    {
      id: 5,
      categoria: 'Compras',
      icono: ICONOS_CATEGORIA['Compras'],
      gastado: 120.00,
      limite: 500.00
    },
    {
      id: 6,
      categoria: 'Salud',
      icono: ICONOS_CATEGORIA['Salud'],
      gastado: 45.00,
      limite: 200.00
    },
    {
      id: 7,
      categoria: 'Educación',
      icono: ICONOS_CATEGORIA['Educación'],
      gastado: 100,
      limite: 300.00
    },
    {
      id: 8,
      categoria: 'Servicios',
      icono: ICONOS_CATEGORIA['Servicios'],
      gastado: 150.00,
      limite: 250.00
    },
    {
      id: 9,
      categoria: 'Viajes',
      icono: ICONOS_CATEGORIA['Viajes'],
      gastado: 990,
      limite: 1000.00
    },
    {
      id: 10,
      categoria: 'Otros',
      icono: ICONOS_CATEGORIA['Otros'],
      gastado: 20.00,
      limite: 100.00
    }
  ];

  // Propiedades dinamicas para el grafico superior
  calcularPorcentaje(gastado: number, limite: number): number {
    if (!limite) return 0;
    return Math.round((gastado / limite) * 100);
  }

  obtenerEstado(gastado: number, limite: number): 'bueno' | 'advertencia' | 'peligro' {
    const porcentaje = (gastado / limite) * 100;
    if (porcentaje >= 100) return 'peligro';
    if (porcentaje >= 90) return 'advertencia'; // Alerta amarilla al llegar al 90%
    return 'bueno';
  }

  // PROPIEDADES DINÁMICAS PARA EL GRÁFICO INFERIOR

  get totalGastadoGlobal(): number {
    return this.listaPresupuestos.reduce((acumulado, p) => acumulado + p.gastado, 0);
  }

  get totalLimiteGlobal(): number {
    return this.listaPresupuestos.reduce((acumulado, p) => acumulado + p.limite, 0);
  }


  // Categoría con mayor gasto
  get categoriaMasGasto() {
    if (this.listaPresupuestos.length === 0) return null;
    return [...this.listaPresupuestos].sort((a, b) => b.gastado - a.gastado)[0];
  }

  // Categoría con menor gasto
  get categoriaMenosGasto() {
    if (this.listaPresupuestos.length === 0) return null;
    return [...this.listaPresupuestos].sort((a, b) => a.gastado - b.gastado)[0];
  }

  //Editar
  abrirEdicion(presupuesto: any) {
    // Hacemos una copia para no modificar el original hasta guardar
    this.presupuestoEditando = { ...presupuesto };
  }

  cerrarEdicion() {
    this.presupuestoEditando = null;
  }

  guardarCambios() {
    // Lógica para actualizar el array original
    const index = this.listaPresupuestos.findIndex(p => p.id === this.presupuestoEditando.id);
    if (index !== -1) {
      this.listaPresupuestos[index] = { ...this.presupuestoEditando };
    }
    this.cerrarEdicion();
  }

  eliminarPresupuesto() {
    if (confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
      // Filtramos la lista para quitar el elemento
      this.listaPresupuestos = this.listaPresupuestos.filter(p => p.id !== this.presupuestoEditando.id);

      // Cerramos el modal
      this.cerrarEdicion();
      console.log('Presupuesto eliminado');
    }
  }

  abrirCrear() {
    this.mostrarFormulario = true;
  }

  guardarNuevoPresupuesto(datos: any) {
    const categoriaEncontrada = this.listaCategorias.find(c => c.id == datos.idCategoria);
    const nombreCat = categoriaEncontrada ? categoriaEncontrada.nombre : 'Otros';

    const nuevoPresupuesto = {
      id: Math.floor(Math.random() * 1000),
      categoria: nombreCat,
      // Buscamos el icono
      icono: ICONOS_CATEGORIA[nombreCat] || '❓',
      limite: datos.limite,
      gastado: 0
    };

    this.listaPresupuestos.push(nuevoPresupuesto);
    this.mostrarFormulario = false;
  }

}


