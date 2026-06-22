import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Header } from "../../layout/header/header";
import { MenuLateral } from "../../layout/menu-lateral/menu-lateral";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresupuestoForm } from './presupuesto-form/presupuesto-form';
import { PresupuestosService } from '../../../services/presupuesto.service';
import { CategoriaService } from '../../../services/categoria.service';
import { LoginService } from '../../../services/login.service';
import { PresupuestoResponse } from '../../../models/presupuestos.model';
import { UiAlertsService } from '../../../services/ui-alerts.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  private readonly uiAlertsService = inject(UiAlertsService);
  private readonly cdr = inject(ChangeDetectorRef);

  public idUsuario!: number;

  public presupuestoEditando: PresupuestoInterfaz | null = null;
  public mostrarFormulario: boolean = false;

  public listaPresupuestos: PresupuestoInterfaz[] = []
  public listaCategorias: { id: number, nombre: string }[] = [];
  
  public mensajeError: string = '';
  public mensajeExito: string = '';
  public cargandoDatos: boolean = false;


  constructor(
    private presupuestoService: PresupuestosService,
    private categoriaService: CategoriaService,
    private loginService: LoginService
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
      this.mensajeError = 'No hay una sesión activa. Inicia sesión nuevamente para ver tus presupuestos.';
      this.cdr.detectChanges();
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
    if (!this.idUsuario) {
      this.mensajeError = 'No se pudo identificar el usuario. Inicia sesión nuevamente.';
      this.cdr.detectChanges();
      return;
    }

    this.mensajeError = '';
    this.cargandoDatos = true;

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
        this.cargandoDatos = false;
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        this.cargandoDatos = false;
        const httpError = err as HttpErrorResponse;

        if (httpError.status === 0) {
          this.mensajeError = 'No hay conexión con el backend. Revisa que http://localhost:8080 esté disponible.';
        } else if (httpError.status === 401) {
          this.mensajeError = 'Tu sesión ha expirado. Inicia sesión nuevamente.';
        } else if (httpError.status === 404) {
          this.mensajeError = 'No se encontró el endpoint de presupuestos en el backend.';
        } else {
          this.mensajeError = 'No se pudieron cargar los presupuestos. Inténtalo de nuevo.';
        }

        this.cdr.detectChanges();
      }
    });

    // Cargamos las categorías globales para el dropdown del formulario
    this.categoriaService.obtenerCategorias().subscribe({
      next: (data) => {
        this.listaCategorias = data.map(cat => ({
          id: cat.id,
          nombre: cat.nombre
        }));
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        const httpError = err as HttpErrorResponse;
        if (httpError.status === 0) {
          this.mensajeError = 'No hay conexión con el backend. Revisa que http://localhost:8080 esté disponible.';
        } else if (httpError.status === 401) {
          this.mensajeError = 'Tu sesión ha expirado. Inicia sesión nuevamente.';
        } else {
          this.mensajeError = 'No se pudieron cargar las categorías. Inténtalo de nuevo.';
        }
        this.cdr.detectChanges();
      }
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

    this.mensajeError = '';
    this.presupuestoService.editarPresupuesto(
      this.presupuestoEditando.id,
      this.presupuestoEditando.idCategoria,
      this.presupuestoEditando.limite,
      this.obtenerFechaInicioMes(),
      this.obtenerFechaFinMes()
    ).subscribe({
      next: (editado) => {
        if (editado) {
          this.mensajeExito = 'Presupuesto actualizado correctamente.';
          this.cargarDatos();
          this.cerrarEdicion();
          this.cdr.detectChanges();
          setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
        }
      },
      error: (err: unknown) => {
        const httpError = err as HttpErrorResponse;
        if (httpError.status === 0) {
          this.mensajeError = 'No hay conexión con el backend.';
        } else if (httpError.status === 401) {
          this.mensajeError = 'Tu sesión ha expirado. Inicia sesión nuevamente.';
        } else if (httpError.status === 400) {
          this.mensajeError = 'Los datos del presupuesto no son válidos.';
        } else {
          this.mensajeError = 'No se pudo actualizar el presupuesto. Inténtalo de nuevo.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  async eliminarPresupuesto() {
    if (!this.presupuestoEditando) return;

    const confirmado = await this.uiAlertsService.confirm({
      title: 'Eliminar presupuesto',
      message: '¿Estás seguro de que quieres eliminar este presupuesto?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      severity: 'danger'
    });

    if (!confirmado) return;

    this.mensajeError = '';
    this.presupuestoService.eliminarPresupuesto(this.presupuestoEditando.id).subscribe({
      next: async (eliminado) => {
        if (eliminado) {
          this.mensajeExito = 'Presupuesto eliminado correctamente.';
          this.cargarDatos();
          this.cerrarEdicion();
          this.cdr.detectChanges();
          setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
          return;
        }

        await this.uiAlertsService.alert({
          title: 'No se pudo eliminar',
          message: 'No se pudo eliminar el presupuesto.',
          confirmText: 'Entendido',
          severity: 'danger'
        });
      },
      error: async (err: unknown) => {
        const httpError = err as HttpErrorResponse;
        let mensaje = 'Se produjo un problema al intentar eliminar el presupuesto.';
        
        if (httpError.status === 0) {
          mensaje = 'No hay conexión con el backend.';
        } else if (httpError.status === 401) {
          mensaje = 'Tu sesión ha expirado. Inicia sesión nuevamente.';
        }

        this.mensajeError = mensaje;
        this.cdr.detectChanges();

        await this.uiAlertsService.alert({
          title: 'Error al eliminar',
          message: mensaje,
          confirmText: 'Entendido',
          severity: 'danger'
        });
      }
    });
  }

  abrirCrear() {
    this.mostrarFormulario = true;
  }

  guardarNuevoPresupuesto(datos: { idCategoria: number; limite: number }) {
    this.mensajeError = '';
    const nuevoPresupuesto = {
      usuario: { id: this.idUsuario },
      categoria: { id: datos.idCategoria },
      limite: datos.limite,
      fechaInicio: this.obtenerFechaInicioMes(),
      fechaFin: this.obtenerFechaFinMes()
    };

    this.presupuestoService.crearPresupuesto(nuevoPresupuesto).subscribe({
      next: () => {
        this.mensajeExito = 'Presupuesto creado correctamente.';
        this.cargarDatos();
        this.mostrarFormulario = false;
        this.cdr.detectChanges();
        setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: (err: unknown) => {
        const httpError = err as HttpErrorResponse;
        if (httpError.status === 0) {
          this.mensajeError = 'No hay conexión con el backend.';
        } else if (httpError.status === 401) {
          this.mensajeError = 'Tu sesión ha expirado. Inicia sesión nuevamente.';
        } else if (httpError.status === 400) {
          this.mensajeError = 'Los datos del presupuesto no son válidos.';
        } else {
          this.mensajeError = 'No se pudo crear el presupuesto. Inténtalo de nuevo.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  get nombreMesActual(): string {
    const fecha = new Date();
    const nombre = fecha.toLocaleString('es-ES', { month: 'long' });
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
  }

}


