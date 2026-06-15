import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Filtros } from './filtros/filtros';
import { Tabla } from './tabla/tabla';
import { HeaderMovimientos } from './header-movimientos/header-movimientos';
import { MenuLateral } from "../../layout/menu-lateral/menu-lateral";
import { Header } from "../../layout/header/header";
import { TransaccionResponse } from '../../../models/transaccion.model';
import { TransaccionService } from '../../../services/transaccion.service';
import { TransaccionForm } from './transaccion-form/transaccion-form';
import { CategoriaService } from '../../../services/categoria.service';
import { LoginService } from '../../../services/login.service';
import { ActivatedRoute } from '@angular/router';
import { ObjetivoService } from '../../../services/objetivo.service';
import { MetaForm } from './meta-form/meta-form';

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


  public idUsuario!: number;

  // variables para los movimientos
  movimientos: TransaccionResponse[] = [];
  movimientosFiltrados: TransaccionResponse[] = [];

  // variables para los insigths
  tendencia: number = 0;
  categoriaPrincipal: string[] = ['sin datos', '0,0'];
  meta: number[] = [0.0, 0.0];

  // variables para el filtro de categorias
  categorias: string[] = [];
  filtroCategoria: string = 'todas';

  // variables para el formulario
  mostrarPopup: boolean = false;
  transaccionSeleccionada: any = null;

  // variables para el objetivo
  mostrarModalMeta: boolean = false;
  metaActivaEditar: any = null;

  categoriasDesdeBackend: { id: number, nombre: string }[] = [];

  constructor(private route: ActivatedRoute, private objetivoService: ObjetivoService, private transaccionService: TransaccionService, private categoriaService: CategoriaService, private loginService: LoginService,
    private cdr: ChangeDetectorRef) { }


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
      console.warn('WealthGuard Alerta: No se encontró un usuario logeado.');
    }
  }

  cargarDatos() {
    // Cargamos las categorías globales para el formulario
    this.categoriaService.obtenerTodas().subscribe({
      next: (cats) => {
        this.categoriasDesdeBackend = cats.map(c => ({
          id: c.id,
          nombre: c.nombre
        }));
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error al traer categorías:', e)
    });

    // Cargamos el historial completo de las transacciones
    this.transaccionService.listarTransacciones(this.idUsuario).subscribe({
      next: (data) => {
        // Ordenamos las transacciones por fecha (de más reciente a más antigua)
        this.movimientos = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        // Extraemos los strings de categorías existentes SOLO para el componente <app-filtros> de la tabla
        this.categorias = [...new Set(data.map(m => m.nombreCategoria).filter(Boolean))] as string[];

        this.limpiarFiltros(); // Inicialmente mostramos todos los movimientos sin filtros
        this.cdr.detectChanges(); // Forzamos la detección de cambios para actualizar la vista
      },
      error: (e) => console.error('Error al cargar movimientos:', e)
    });

    // Cargamos los insights (Tendencia, Categoría Principal y Meta)
    this.transaccionService.obtenerTendencia(this.idUsuario).subscribe({
      next: (resultado) => {
        this.tendencia = resultado;
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error al obtener tendencia:', e)
    });

    this.transaccionService.obtenerCategoriaPrincipal(this.idUsuario).subscribe({
      next: (resultado) => {
        this.categoriaPrincipal = resultado;
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error al obtener categoría principal:', e)
    });

    this.transaccionService.obtenerMeta(this.idUsuario).subscribe({
      next: (resultado) => {
        this.meta = resultado;
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error al obtener meta:', e)
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

  abrirFormulario(transaccion: any = null) {
    this.transaccionSeleccionada = transaccion;
    this.mostrarPopup = true;
  }

  cerrarFormulario() {
    this.mostrarPopup = false;
  }

  guardarTransaccion(datosFormulario: any) {

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
          this.cargarDatos(); // Recarga la tabla
          this.cerrarFormulario(); // Cierra el popup
        },
        error: (err) => console.error('Error al actualizar:', err)
      });

    } else {

      // Para el modo crear
      this.transaccionService.crearTransaccion(transaccionParaJava).subscribe({
        next: () => {
          this.cargarDatos();
          this.cerrarFormulario();
        },
        error: (err) => console.error('Error al guardar:', err)
      });
    }
  }

  eliminarMovimiento(idTransaccion: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este movimiento?')) {

      // Llamamos al método eliminarTransaccion
      this.transaccionService.eliminarTransaccion(idTransaccion).subscribe({
        next: (eliminado) => {
          if (eliminado) {
            // Si Java responde true, volvemos a cargar los datos reales
            this.cargarDatos();
          } else {
            alert('No se pudo eliminar el movimiento.');
          }
        },
        error: (err) => console.error('Error al intentar eliminar de la BD:', err)
      });

    }
  }

  abrirFormularioMeta() {
    this.objetivoService.obtenerMetaActiva(this.idUsuario).subscribe({
      next: (meta) => {
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
    const request = {
      usuarioId: this.idUsuario,
      cantidadObjetivo: nuevaCantidad
    };

    if (this.metaActivaEditar && this.metaActivaEditar.id) {
      this.objetivoService.editarObjetivo(this.metaActivaEditar.id, request).subscribe({
        next: () => {
          this.mostrarModalMeta = false;
          this.cargarDatos();

        },
        error: (err) => console.error('Error al editar:', err) 
      });
    } else {
      this.objetivoService.crearObjetivo(request).subscribe({
        next: () => {
          this.mostrarModalMeta = false;
          this.cargarDatos();

        },
        error: (err) => console.error('Error al crear:', err) 
      });
    }
  }
}