import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Filtros } from './filtros/filtros';
import { Tabla } from './tabla/tabla';
import { HeaderMovimientos } from './header-movimientos/header-movimientos';
import { MenuLateral } from "../../layout/menu-lateral/menu-lateral";
import { Header } from "../../layout/header/header";
import { TransaccionRequest, TransaccionResponse } from '../../../models/transaccion.model';
import { TransaccionService } from '../../../services/transaccion.service';
import { TransaccionForm } from './transaccion-form/transaccion-form';
import { CategoriaService } from '../../../services/categoria.service';
import { ActivatedRoute } from '@angular/router';
import { ObjetivoService } from '../../../services/objetivo.service';
import { UtilsService } from '../../../services/utils.service';
import { ObjetivoRequest, ObjetivoResponse } from '../../../models/objetivo.model';
import { UiAlertsService } from '../../../services/ui-alerts.service';
import { MetaForm } from './meta-form/meta-form';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [
    HeaderMovimientos,
    Filtros,
    Tabla,
    MenuLateral,
    Header,
    TransaccionForm,
    MetaForm
  ],
  templateUrl: './movimientos.html',
  styleUrls: ['./movimientos.css'],
})
export class Movimientos implements OnInit {
  private readonly uiAlertsService = inject(UiAlertsService);
  private readonly loginService = inject(LoginService);
  private readonly cdr = inject(ChangeDetectorRef);

  public idUsuario!: number;

  movimientos: TransaccionResponse[] = [];
  movimientosFiltrados: TransaccionResponse[] = [];

  tendencia: number = 0;
  categoriaPrincipal: string[] = ['sin datos', '0,0'];
  meta: number[] = [0.0, 0.0];
  metaPasada: ObjetivoResponse | null = null;

  categorias: string[] = [];
  filtroCategoria: string = 'todas';

  mostrarPopup: boolean = false;
  transaccionSeleccionada: TransaccionResponse | null = null;

  mostrarModalMeta: boolean = false;
  metaActivaEditar: ObjetivoResponse | null = null;

  categoriasDesdeBackend: { id: number, nombre: string }[] = [];

  mensajeError: string = '';
  mensajeExito: string = '';
  cargandoDatos: boolean = false;
  private feedbackTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private route: ActivatedRoute,
    private objetivoService: ObjetivoService,
    private transaccionService: TransaccionService,
    private categoriaService: CategoriaService,
    private utilsService: UtilsService
  ) { }

  private mostrarExito(mensaje: string): void {
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
      this.feedbackTimeout = null;
    }

    this.mensajeError = '';
    this.mensajeExito = mensaje;

    this.feedbackTimeout = setTimeout(() => {
      this.mensajeExito = '';
      this.feedbackTimeout = null;
    }, 3000);
  }

  private mostrarError(mensaje: string): void {
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
      this.feedbackTimeout = null;
    }

    this.mensajeExito = '';
    this.mensajeError = mensaje;
  }

  ngOnInit(): void {
    this.comprobarUsuarioLogeado();

    this.route.queryParams.subscribe(params => {
      if (params['abrir'] === 'true') {
        this.abrirFormulario();
      }
    });
  }

  private comprobarUsuarioLogeado(): void {
    const id = this.loginService.obtenerIdUsuario();

    if (id !== null) {
      this.idUsuario = id;
      this.cargarDatos();
    } else {
      this.mostrarError('No hay una sesión activa. Inicia sesión nuevamente para ver tus movimientos.');
    }
  }

  cargarDatos() {
    if (!this.idUsuario) {
      this.mostrarError('No se pudo identificar el usuario. Inicia sesión nuevamente.');
      return;
    }

    this.transaccionService.notificarCambio();

    this.mensajeError = '';
    this.cargandoDatos = true;

    this.categoriaService.obtenerCategorias().subscribe({
      next: (cats) => {
        this.categoriasDesdeBackend = cats.map(c => ({ id: c.id, nombre: c.nombre }));
        this.cdr.markForCheck();
      },
      error: (err: unknown) => {
        this.mostrarError(this.utilsService.manejarError(err, 'No se pudieron cargar las categorías.'));
      }
    });

    this.transaccionService.listarTransacciones(this.idUsuario).subscribe({
      next: (data) => {
        this.movimientos = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.categorias = [...new Set(data.map(m => m.nombreCategoria).filter(Boolean))] as string[];
        this.limpiarFiltros();
        this.cargandoDatos = false;
        this.cdr.markForCheck();
      },
      error: (err: unknown) => {
        this.cargandoDatos = false;
        this.mostrarError(this.utilsService.manejarError(err, 'No se pudieron cargar los movimientos. Inténtalo de nuevo.'));
      }
    });

    this.transaccionService.obtenerTendencia(this.idUsuario).subscribe({
      next: (resultado) => { this.tendencia = resultado; this.cdr.markForCheck();},
      error: () => { this.tendencia = 0; }
    });

    this.transaccionService.obtenerCategoriaPrincipal(this.idUsuario).subscribe({
      next: (resultado) => { this.categoriaPrincipal = resultado; this.cdr.markForCheck(); },
      error: () => { this.categoriaPrincipal = ['sin datos', '0,0']; }
    });

    this.transaccionService.obtenerMeta(this.idUsuario).subscribe({
      next: (resultado) => { this.meta = resultado; this.cdr.markForCheck(); },
      error: () => { this.meta = [0.0, 0.0]; }
    });

    this.objetivoService.obtenerMetaPasada(this.idUsuario).subscribe({
      next: (resultado: ObjetivoResponse) => { this.metaPasada = resultado; this.cdr.markForCheck(); },
      error: () => { this.metaPasada = null; }
    });
  }

  aplicarFiltroFechas(rango: { inicio: Date | null, fin: Date | null }) {
    if (!rango.inicio || !rango.fin) {
      this.movimientosFiltrados = [...this.movimientos];
      return;
    }
    const inicio = new Date(rango.inicio).getTime();
    const fin = new Date(rango.fin).getTime();
    this.movimientosFiltrados = this.movimientos.filter(m => {
      const fecha = new Date(m.fecha).getTime();
      return fecha >= inicio && fecha <= fin;
    });
  }

  limpiarFiltros() {
    this.filtroTipo = 'todos';
    this.filtroCategoria = 'todas';
    this.movimientosFiltrados = [...this.movimientos];
  }

  filtroTipo: 'todos' | 'ingreso' | 'gasto' = 'todos';

  filtrarPorTipo(tipo: 'todos' | 'ingreso' | 'gasto') {
    this.filtroTipo = tipo;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let data = [...this.movimientos];
    if (this.filtroTipo === 'ingreso') data = data.filter(m => m.tipoTransaccion === true);
    else if (this.filtroTipo === 'gasto') data = data.filter(m => m.tipoTransaccion === false);
    if (this.filtroCategoria !== 'todas') data = data.filter(m => m.nombreCategoria === this.filtroCategoria);
    this.movimientosFiltrados = data;
  }

  filtrarPorCategoria(cat: string) {
    this.filtroCategoria = cat;
    this.aplicarFiltros();
  }

  abrirFormulario(transaccion: TransaccionResponse | null = null) {
    this.transaccionSeleccionada = transaccion;
    this.mostrarPopup = true;
  }

  cerrarFormulario() {
    this.mostrarPopup = false;
  }

  guardarTransaccion(datosFormulario: Omit<TransaccionRequest, 'idUsuario'>) {
    this.mensajeError = '';

    const fechaParaJava = datosFormulario.fecha.includes('T')
      ? datosFormulario.fecha
      : datosFormulario.fecha + 'T00:00:00';

    const transaccionParaJava = { ...datosFormulario, fecha: fechaParaJava, idUsuario: this.idUsuario };

    if (this.transaccionSeleccionada) {
      const idTransaccion = this.transaccionSeleccionada.id;

      this.transaccionService.editarTransaccion(idTransaccion, transaccionParaJava).subscribe({
        next: () => {
          this.mostrarExito('Movimiento actualizado correctamente.');
          this.cargarDatos();
          this.cerrarFormulario();
        },
        error: (err: unknown) => {
          this.mostrarError(this.utilsService.manejarError(err, 'No se pudo actualizar el movimiento. Inténtalo de nuevo.'));
        }
      });
    } else {
      this.transaccionService.crearTransaccion(transaccionParaJava).subscribe({
        next: () => {
          this.mostrarExito('Movimiento creado correctamente.');
          this.cargarDatos();
          this.cerrarFormulario();
        },
        error: (err: unknown) => {
          this.mostrarError(this.utilsService.manejarError(err, 'No se pudo crear el movimiento. Inténtalo de nuevo.'));
        }
      });
    }
  }

  async eliminarMovimiento(idTransaccion: number) {
    const confirmado = await this.uiAlertsService.confirm({
      title: 'Eliminar movimiento',
      message: '¿Estás seguro de que deseas eliminar este movimiento?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      severity: 'danger'
    });

    if (!confirmado) return;

    this.mensajeError = '';
    this.transaccionService.eliminarTransaccion(idTransaccion).subscribe({
      next: async (eliminado) => {
        if (eliminado) {
          this.mostrarExito('Movimiento eliminado correctamente.');
          
         setTimeout(() => {
            this.cargarDatos();
          }, 0);
          
          return;
        }
        
        await this.uiAlertsService.alert({
          title: 'No se pudo eliminar',
          message: 'No se pudo eliminar el movimiento.',
          confirmText: 'Entendido',
          severity: 'danger'
        });
      },
      error: async (err: unknown) => {
        const mensaje = this.utilsService.manejarError(err, 'Se produjo un problema al intentar eliminar el movimiento.');
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

  abrirFormularioMeta() {
    this.objetivoService.obtenerMetaActiva(this.idUsuario).subscribe({
      next: (meta: ObjetivoResponse) => {
        this.metaActivaEditar = meta;
        this.mostrarModalMeta = true;
      },
      error: () => {
        this.metaActivaEditar = null;
        this.mostrarModalMeta = true;
      }
    });
  }

  guardarMeta(nuevaCantidad: number) {
    this.mensajeError = '';
    const request: ObjetivoRequest = { usuarioId: this.idUsuario, cantidadObjetivo: nuevaCantidad };

    if (this.metaActivaEditar && this.metaActivaEditar.id) {
      this.objetivoService.editarObjetivo(this.metaActivaEditar.id, request).subscribe({
        next: () => {
          this.mostrarExito('Meta actualizada correctamente.');
          this.mostrarModalMeta = false;
          this.cargarDatos();
        },
        error: (err: unknown) => {
          this.mostrarError(this.utilsService.manejarError(err, 'No se pudo actualizar la meta. Inténtalo de nuevo.'));
        }
      });
    } else {
      this.objetivoService.crearObjetivo(request).subscribe({
        next: () => {
          this.mostrarExito('Meta creada correctamente.');
          this.mostrarModalMeta = false;
          this.cargarDatos();
        },
        error: (err: unknown) => {
          this.mostrarError(this.utilsService.manejarError(err, 'No se pudo crear la meta. Inténtalo de nuevo.'));
        }
      });
    }
  }
}