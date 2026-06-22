import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
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
import { HttpErrorResponse } from '@angular/common/http';
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

  // variables para los movimientos
  movimientos: TransaccionResponse[] = [];
  movimientosFiltrados: TransaccionResponse[] = [];

  // variables para los insigths
  tendencia: number = 0;
  categoriaPrincipal: string[] = ['sin datos', '0,0'];
  meta: number[] = [0.0, 0.0];
  metaPasada: ObjetivoResponse | null = null;

  // variables para el filtro de categorias
  categorias: string[] = [];
  filtroCategoria: string = 'todas';

  // variables para el formulario
  mostrarPopup: boolean = false;
  transaccionSeleccionada: TransaccionResponse | null = null;

  // variables para el objetivo
  mostrarModalMeta: boolean = false;
  metaActivaEditar: ObjetivoResponse | null = null;

  categoriasDesdeBackend: { id: number, nombre: string }[] = [];

  // Variables de error
  mensajeError: string = '';
  mensajeExito: string = '';
  cargandoDatos: boolean = false;

  constructor(private route: ActivatedRoute, private objetivoService: ObjetivoService, private transaccionService: TransaccionService, private categoriaService: CategoriaService, private utilsService: UtilsService) { }


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
      this.mensajeError = 'No hay una sesión activa. Inicia sesión nuevamente para ver tus movimientos.';
      this.cdr.detectChanges();
    }
  }

  cargarDatos() {
    if (!this.idUsuario) {
      this.mensajeError = 'No se pudo identificar el usuario. Inicia sesión nuevamente.';
      this.cdr.detectChanges();
      return;
    }

    this.mensajeError = '';
    this.cargandoDatos = true;

    // Cargamos las categorías globales para el formulario
    this.categoriaService.obtenerCategorias().subscribe({
      next: (cats) => {
        this.categoriasDesdeBackend = cats.map(c => ({
          id: c.id,
          nombre: c.nombre
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
          this.mensajeError = 'No se pudieron cargar las categorías.';
        }
        this.cdr.detectChanges();
      }
    });

    // Cargamos el historial completo de las transacciones
    this.transaccionService.listarTransacciones(this.idUsuario).subscribe({
      next: (data) => {
        this.movimientos = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.categorias = [...new Set(data.map(m => m.nombreCategoria).filter(Boolean))] as string[];
        this.limpiarFiltros(); 
        this.cargandoDatos = false;
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        this.cargandoDatos = false;
        const httpError = err as HttpErrorResponse;
        if (httpError.status === 0) {
          this.mensajeError = 'No hay conexión con el backend.';
        } else if (httpError.status === 401) {
          this.mensajeError = 'Tu sesión ha expirado. Inicia sesión nuevamente.';
        } else {
          this.mensajeError = 'No se pudieron cargar los movimientos. Inténtalo de nuevo.';
        }
        this.cdr.detectChanges();
      }
    });

    // Cargamos los insights (Tendencia, Categoría Principal y Meta)
    this.transaccionService.obtenerTendencia(this.idUsuario).subscribe({
      next: (resultado) => {
        this.tendencia = resultado;
        this.cdr.detectChanges();
      },
      error: () => {
        this.tendencia = 0;
      }
    });

    this.transaccionService.obtenerCategoriaPrincipal(this.idUsuario).subscribe({
      next: (resultado) => {
        this.categoriaPrincipal = resultado;
        this.cdr.detectChanges();
      },
      error: () => {
        this.categoriaPrincipal = ['sin datos', '0,0'];
      }
    });

    this.transaccionService.obtenerMeta(this.idUsuario).subscribe({
      next: (resultado) => {
        this.meta = resultado;
        this.cdr.detectChanges();
      },
      error: () => {
        this.meta = [0.0, 0.0];
      }
    });

    this.objetivoService.obtenerMetaPasada(this.idUsuario).subscribe({
      next: (resultado : ObjetivoResponse) => {
        this.metaPasada = resultado;
        this.cdr.detectChanges();
      },
      error: () => {
        this.metaPasada = null;
      }
    });
  }

  // Filtro de fechas
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

  // Limpiar filtros
  limpiarFiltros() {
    this.filtroTipo = 'todos';
    this.filtroCategoria = 'todas';
    this.movimientosFiltrados = [...this.movimientos];
  }

  // Filtro tipo
  filtroTipo: 'todos' | 'ingreso' | 'gasto' = 'todos';

  filtrarPorTipo(tipo: 'todos' | 'ingreso' | 'gasto') {
    this.filtroTipo = tipo;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let data = [...this.movimientos];

    // Filtro por tipo
    if (this.filtroTipo === 'ingreso') {
      data = data.filter(m => m.tipoTransaccion === true);
    } else if (this.filtroTipo === 'gasto') {
      data = data.filter(m => m.tipoTransaccion === false);
    }

    // Filtro por categoria
    if (this.filtroCategoria !== 'todas') {
      data = data.filter(m => m.nombreCategoria === this.filtroCategoria);
    }

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

    // Formateamos la fecha para que Java lo acepte como LocalDateTime
    const fechaParaJava = datosFormulario.fecha.includes('T')
      ? datosFormulario.fecha
      : datosFormulario.fecha + 'T00:00:00';

    // Preparamos el paquete de datos para Java
    const transaccionParaJava = {
      ...datosFormulario,
      fecha: fechaParaJava,
      idUsuario: this.idUsuario
    };

    // Comprobamos si es Edición o Creación
    if (this.transaccionSeleccionada) {

      // Para el modo editar
      const idTransaccion = this.transaccionSeleccionada.id;

      this.transaccionService.editarTransaccion(idTransaccion, transaccionParaJava).subscribe({
        next: () => {
          this.mensajeExito = 'Movimiento actualizado correctamente.';
          this.cargarDatos();
          this.cerrarFormulario();
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
            this.mensajeError = 'Los datos del movimiento no son válidos.';
          } else {
            this.mensajeError = 'No se pudo actualizar el movimiento. Inténtalo de nuevo.';
          }
          this.cdr.detectChanges();
        }
      });

    } else {

      // Para el modo crear
      this.transaccionService.crearTransaccion(transaccionParaJava).subscribe({
        next: () => {
          this.mensajeExito = 'Movimiento creado correctamente.';
          this.cargarDatos();
          this.cerrarFormulario();
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
            this.mensajeError = 'Los datos del movimiento no son válidos.';
          } else {
            this.mensajeError = 'No se pudo crear el movimiento. Inténtalo de nuevo.';
          }
          this.cdr.detectChanges();
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
    // Llamamos al método eliminarTransaccion
    this.transaccionService.eliminarTransaccion(idTransaccion).subscribe({
      next: async (eliminado) => {
        if (eliminado) {
          this.mensajeExito = 'Movimiento eliminado correctamente.';
          this.cargarDatos();
          this.cdr.detectChanges();
          setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
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
        const httpError = err as HttpErrorResponse;
        let mensaje = 'Se produjo un problema al intentar eliminar el movimiento.';
        
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

  abrirFormularioMeta() {
    this.objetivoService.obtenerMetaActiva(this.idUsuario).subscribe({
      next: (meta: ObjetivoResponse) => {
        this.metaActivaEditar = meta;
        this.mostrarModalMeta = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.metaActivaEditar = null;
        this.mostrarModalMeta = true;
        this.cdr.detectChanges();
      }
    });
  }

  guardarMeta(nuevaCantidad: number) {
    this.mensajeError = '';
    const request: ObjetivoRequest = {
      usuarioId: this.idUsuario,
      cantidadObjetivo: nuevaCantidad
    };

    if (this.metaActivaEditar && this.metaActivaEditar.id) {
      this.objetivoService.editarObjetivo(this.metaActivaEditar.id, request).subscribe({
        next: () => {
          this.mensajeExito = 'Meta actualizada correctamente.';
          this.mostrarModalMeta = false;
          this.cargarDatos();
          this.cdr.detectChanges();
          setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
        },
        error: (err: unknown) => {
          const httpError = err as HttpErrorResponse;
          if (httpError.status === 0) {
            this.mensajeError = 'No hay conexión con el backend.';
          } else if (httpError.status === 401) {
            this.mensajeError = 'Tu sesión ha expirado. Inicia sesión nuevamente.';
          } else {
            this.mensajeError = 'No se pudo actualizar la meta. Inténtalo de nuevo.';
          }
          this.cdr.detectChanges();
        }
      });
    } else {
      this.objetivoService.crearObjetivo(request).subscribe({
        next: () => {
          this.mensajeExito = 'Meta creada correctamente.';
          this.mostrarModalMeta = false;
          this.cargarDatos();
          this.cdr.detectChanges();
          setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
        },
        error: (err: unknown) => {
          const httpError = err as HttpErrorResponse;
          if (httpError.status === 0) {
            this.mensajeError = 'No hay conexión con el backend.';
          } else if (httpError.status === 401) {
            this.mensajeError = 'Tu sesión ha expirado. Inicia sesión nuevamente.';
          } else {
            this.mensajeError = 'No se pudo crear la meta. Inténtalo de nuevo.';
          }
          this.cdr.detectChanges();
        }
      });
    }
  }
}