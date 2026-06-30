import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Header } from "../../layout/header/header";
import { MenuLateral } from "../../layout/menu-lateral/menu-lateral";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresupuestoForm } from './presupuesto-form/presupuesto-form';
import { PresupuestosService } from '../../../services/presupuesto.service';
import { CategoriaService } from '../../../services/categoria.service';
import { LoginService } from '../../../services/login.service';
import { UtilsService } from '../../../services/utils.service';
import { PresupuestoResponse } from '../../../models/presupuestos.model';
import { UiAlertsService } from '../../../services/ui-alerts.service';

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

  public listaPresupuestos: PresupuestoInterfaz[] = [];
  public listaCategorias: { id: number, nombre: string }[] = [];

  public mensajeError: string = '';
  public mensajeExito: string = '';
  public cargandoDatos: boolean = false;
  private feedbackTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private presupuestoService: PresupuestosService,
    private categoriaService: CategoriaService,
    private loginService: LoginService,
    private utilsService: UtilsService
  ) { }

  private mostrarExito(mensaje: string): void {
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
      this.feedbackTimeout = null;
    }

    this.mensajeError = '';
    this.mensajeExito = mensaje;
    this.cdr.markForCheck();
    this.feedbackTimeout = setTimeout(() => {
      this.mensajeExito = '';
      this.feedbackTimeout = null;
      this.cdr.markForCheck();
    }, 3000);
  }

  private mostrarError(mensaje: string): void {
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
      this.feedbackTimeout = null;
    }

    this.mensajeExito = '';
    this.mensajeError = mensaje;
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.comprobarUsuarioLogeado();
  }

  private comprobarUsuarioLogeado(): void {
    const id = this.loginService.obtenerIdUsuario();
    if (id !== null) {
      this.idUsuario = id;
      this.cargarDatos();
    } else {
      this.mostrarError('No hay una sesión activa. Inicia sesión nuevamente para ver tus presupuestos.');
    }
  }

  private obtenerFechaInicioMes(): string {
    const ahora = new Date();
    return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-01T00:00:00`;
  }

  private obtenerFechaFinMes(): string {
    const ahora = new Date();
    const mes = ahora.getMonth() + 1;
    const ultimoDia = new Date(ahora.getFullYear(), mes, 0).getDate();
    return `${ahora.getFullYear()}-${String(mes).padStart(2, '0')}-${String(ultimoDia).padStart(2, '0')}T23:59:59`;
  }

  cargarDatos() {
    if (!this.idUsuario) {
      this.mostrarError('No se pudo identificar el usuario. Inicia sesión nuevamente.');
      return;
    }

    this.mensajeError = '';
    this.cargandoDatos = true;

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
        this.cdr.markForCheck();
      },
      error: (err: unknown) => {
        this.cargandoDatos = false;
        this.mostrarError(this.utilsService.manejarError(err, 'No se pudieron cargar los presupuestos. Inténtalo de nuevo.'));
      }
    });

    this.categoriaService.obtenerCategorias().subscribe({
      next: (data) => {
        this.listaCategorias = data.map(cat => ({ id: cat.id, nombre: cat.nombre }));
        this.cdr.markForCheck();
      },
      error: (err: unknown) => {
        this.mostrarError(this.utilsService.manejarError(err, 'No se pudieron cargar las categorías. Inténtalo de nuevo.'));
      }
    });
  }

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

  get categoriaMasGasto(): PresupuestoInterfaz | null {
    if (this.listaPresupuestos.length === 0) return null;
    return [...this.listaPresupuestos].sort((a, b) => b.gastado - a.gastado)[0];
  }

  get categoriaMenosGasto() {
    if (this.listaPresupuestos.length === 0) return null;
    return [...this.listaPresupuestos].sort((a, b) => a.gastado - b.gastado)[0];
  }

  abrirEdicion(presupuesto: PresupuestoInterfaz) {
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
          this.mostrarExito('Presupuesto actualizado correctamente.');
          this.cargarDatos();
          this.cerrarEdicion();
        }
      },
      error: (err: unknown) => {
        this.mostrarError(this.utilsService.manejarError(err, 'No se pudo actualizar el presupuesto. Inténtalo de nuevo.'));
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
          this.mostrarExito('Presupuesto eliminado correctamente.');
          setTimeout(() => {
            this.cargarDatos();
          }, 0); this.cerrarEdicion();
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
        const mensaje = this.utilsService.manejarError(err, 'Se produjo un problema al intentar eliminar el presupuesto.');
        this.mostrarError(mensaje);
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
        this.mostrarExito('Presupuesto creado correctamente.');
        this.cargarDatos();
        this.mostrarFormulario = false;
      },
      error: (err: unknown) => {
        this.mostrarError(this.utilsService.manejarError(err, 'No se pudo crear el presupuesto. Inténtalo de nuevo.'));
      }
    });
  }

  get nombreMesActual(): string {
    const nombre = new Date().toLocaleString('es-ES', { month: 'long' });
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
  }

  get categoriaExiste(): number[] {
    return this.listaPresupuestos.map(p => p.idCategoria);
  }

}