import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Header } from "../../layout/header/header";
import { MenuLateral } from "../../layout/menu-lateral/menu-lateral";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresupuestoForm } from './presupuesto-form/presupuesto-form';
import { PresupuestosService } from '../../../services/presupuesto.service';
import { CategoriaService } from '../../../services/categoria.service';
import { LoginService } from '../../../services/login.service';
import { PresupuestoResponse } from '../../../models/presupuestos.model';

interface PresupuestoInterfaz {
  id: number;
  idCategoria: number;
  categoria: string;
  icono: string;
  gastado: number;
  limite: number;
}

@Component({
  selector: 'app-presupuestos',
  standalone: true,
  imports: [Header, MenuLateral, CommonModule, FormsModule, PresupuestoForm],
  templateUrl: './presupuestos.html',
  styleUrl: './presupuestos.css',
})

export class Presupuestos implements OnInit {

  public idUsuario!: number;


  public presupuestoEditando: PresupuestoInterfaz | null = null;
  public mostrarFormulario: boolean = false;

  public listaPresupuestos: PresupuestoInterfaz[] = []
  public listaCategorias: { id: number, nombre: string }[] = [];


  constructor(
    private presupuestoService: PresupuestosService,
    private categoriaService: CategoriaService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef // Se fuerza el renderizado si Angular no detecta los cambios
  ) { }

  ngOnInit(): void {
    this.comprobarUsuarioLogeado();
  }

  private comprobarUsuarioLogeado(): void {

    const id = this.loginService.obtenerIdUsuario();

    if (id !== null) {
      this.idUsuario = id;
      this.cargarDatos();
    } else {
      console.warn('WealthGuard Alerta: No se encontró un usuario logeado.');
    }
  }

  // Calculamos las fechas del mes actual
  private obtenerFechaInicioMes(): string {
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    return `${anio}-${mes}-01T00:00:00`;
  }

  private obtenerFechaFinMes(): string {
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = ahora.getMonth() + 1;
    // El día '0' del siguiente mes nos da el último día del mes actual
    const ultimoDia = new Date(anio, mes, 0).getDate();
    const mesStr = String(mes).padStart(2, '0');
    return `${anio}-${mesStr}-${String(ultimoDia).padStart(2, '0')}T23:59:59`;
  }

  cargarDatos() {
    // Cargamos los presupuestos 
    this.presupuestoService.listarPresupuestos(this.idUsuario).subscribe({
      next: (data: PresupuestoResponse[]) => {
        this.listaPresupuestos = data.map(p => ({
          id: p.id,
          idCategoria: p.categoria.id,
          categoria: p.categoria.nombre,
          icono: p.categoria.icono || 'category',
          gastado: p.gastoActual,
          limite: p.limite
        }));
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error al cargar presupuestos:', e)
    });

    // Cargamos las categorías globales para el dropdown del formulario
    this.categoriaService.obtenerCategorias().subscribe({
      next: (data) => {
        this.listaCategorias = data.map(cat => ({
          id: cat.id,
          nombre: cat.nombre,
          icono: cat.icono
        }));
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error al cargar el catálogo de categorías:', e)
    });

  }

  // Calculamos el porcentaje de consumo del presupuesto
  calcularPorcentaje(gastado: number, limite: number): number {
    if (!limite) return 0;
    return Math.floor((gastado / limite) * 100);
  }

  obtenerEstado(gastado: number, limite: number): 'bueno' | 'advertencia' | 'peligro' {
    const porcentaje = (gastado / limite) * 100;
    if (porcentaje >= 100) return 'peligro';
    if (porcentaje >= 80) return 'advertencia';
    return 'bueno';
  }


  // Categoría con mayor gasto
  get categoriaMasGasto(): PresupuestoInterfaz | null {
    if (this.listaPresupuestos.length === 0) return null;
    return [...this.listaPresupuestos].sort((a, b) => b.gastado - a.gastado)[0];
  }

  // Categoría con menor gasto
  get categoriaMenosGasto() {
    if (this.listaPresupuestos.length === 0) return null;
    return [...this.listaPresupuestos].sort((a, b) => a.gastado - b.gastado)[0];
  }

  //Editar
  abrirEdicion(presupuesto: PresupuestoInterfaz) {
    // Hacemos una copia para no modificar el original hasta guardar
    this.presupuestoEditando = { ...presupuesto };
  }

  cerrarEdicion() {
    this.presupuestoEditando = null;
  }

  guardarCambios() {
    if (!this.presupuestoEditando) return;

    this.presupuestoService.editarPresupuesto(
      this.presupuestoEditando.id,
      this.presupuestoEditando.idCategoria,
      this.presupuestoEditando.limite,
      this.obtenerFechaInicioMes(),
      this.obtenerFechaFinMes()
    ).subscribe({
      next: (editado) => {
        if (editado) {
          this.cargarDatos();
          this.cerrarEdicion();
        }
      },
      error: (err) => console.error('Error al actualizar presupuesto en BD:', err)
    });
  }

  eliminarPresupuesto() {
    if (!this.presupuestoEditando) return;

    if (confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
      this.presupuestoService.eliminarPresupuesto(this.presupuestoEditando.id).subscribe({
        next: (eliminado) => {
          if (eliminado) {
            this.cargarDatos();
            this.cerrarEdicion();
            console.log('Presupuesto eliminado de la BD');
          } else {
            alert('No se pudo eliminar el presupuesto.');
          }
        },
        error: (err) => console.error('Error al intentar eliminar de la BD:', err)
      });
    }
  }

  abrirCrear() {
    this.mostrarFormulario = true;
  }

  guardarNuevoPresupuesto(datos: { idCategoria: number; limite: number }) {
    const nuevoPresupuesto = {
      usuario: { id: this.idUsuario },
      categoria: { id: datos.idCategoria },
      limite: datos.limite,
      fechaInicio: this.obtenerFechaInicioMes(),
      fechaFin: this.obtenerFechaFinMes()
    };

    this.presupuestoService.crearPresupuesto(nuevoPresupuesto).subscribe({
      next: () => {
        this.cargarDatos();
        this.mostrarFormulario = false;
      },
      error: (err) => console.error('Error al guardar nuevo presupuesto:', err)
    });

  }

  get nombreMesActual(): string {
    const fecha = new Date();
    const nombre = fecha.toLocaleString('es-ES', { month: 'long' });
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
  }

}


