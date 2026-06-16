import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../layout/header/header';
import { MenuLateral } from '../../layout/menu-lateral/menu-lateral';
import { RecomendacionPopupComponent } from '../recomendaciones/recomendacion-popup/recomendacion-popup';
import { UsuarioService } from '../../../services/usuario.service';
import { LoginService } from '../../../services/login.service';
import { UsuarioResponse } from '../../../models/usuario.model';
import { TransaccionService } from '../../../services/transaccion.service';
import { TransaccionResponse } from '../../../models/transaccion.model';
import { UtilsService } from '../../../services/utils.service';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Header, MenuLateral, RecomendacionPopupComponent, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly loginService = inject(LoginService);
  private readonly transaccionService = inject(TransaccionService);
  private readonly utilsService = inject(UtilsService);
  private readonly cdr = inject(ChangeDetectorRef);

  mensajeError: string = '';

  idUsuario: number | null = null;

  cargandoPerfil: boolean = false;

  // Saldo calculado a partir de transacciones
  saldo: number = 0;
  cargandoSaldo: boolean = false;
  // Gasto mensual calculado a partir de transacciones del mes
  gastoMensual: number = 0;
  cargandoGasto: boolean = false;
  // Ingreso mensual calculado a partir de transacciones del mes
  ingresoMensual: number = 0;
  cargandoIngreso: boolean = false;

  usuario: UsuarioResponse | null = null;
  mesActual: string = '';
  private readonly _mesesEspanol = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idUsuario = this.loginService.obtenerIdUsuario();

    if (this.idUsuario === null) {
      // Si no hay una sesión activa, redirige al usuario a la página de inicio de sesión
      this.mensajeError =
        'No hay una sesión activa. Inicia sesión nuevamente para acceder al dashboard.';
      return;
    }

    // Cargamos datos principales
    this.mesActual = this.utilsService.obtenerMesActual();
    this.cargarPerfil();
    this.cargarSaldo();
    this.cargarGastoMensual();
    this.cargarIngresoMensual();
    this.cargarDistribucionCategorias();
    this.cargarUltimasTransacciones();
    this.cargarEvolucionGastos();
  }

  // cargarDatosDashboard(): void {
  //   const idUsuario = this.obtenerIdUsuarioActivo();
  //   if (idUsuario === null) {
  //     this.mensajeError = 'No se pudo cargar el dashboard. No se encontró el ID de usuario.';
  //     return;
  //   }
  // }

  cargarSaldo(): void {
    const idUsuario = this.obtenerIdUsuarioActivo();
    if (idUsuario === null) {
      this.mensajeError = 'No se pudo cargar el saldo. No se encontró el ID de usuario.';
      return;
    }
    this.mensajeError = '';
    this.cargandoSaldo = true;
    this.saldo = 0;

    this.transaccionService.listarTransacciones(idUsuario).subscribe({
      next: (txs: TransaccionResponse[]) => {
        let total = 0;
        if (txs && txs.length > 0) {
          for (const t of txs) {
            // tipoTransaccion: true = ingreso, false = gasto
            if (t.tipoTransaccion) {
              total += Number(t.cantidad ?? 0);
            } else {
              total -= Number(t.cantidad ?? 0);
            }
          }
        }
        this.saldo = total;
        this.cargandoSaldo = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar transacciones para saldo', err);
        this.mensajeError = 'No se pudo calcular el saldo. Comprueba el backend.';
        this.cargandoSaldo = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarGastoMensual(): void {
    const idUsuario = this.obtenerIdUsuarioActivo();
    if (idUsuario === null) {
      this.mensajeError = 'No se pudo cargar el gasto mensual. No se encontró el ID de usuario.';
      return;
    }

    this.mensajeError = '';
    this.cargandoGasto = true;
    this.gastoMensual = 0;

    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1, 0, 0, 0);
    const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59, 999);

    const filtros: any = {
      fechaInicio: inicioMes.toISOString(),
      fechaFin: finMes.toISOString()
    };

    this.transaccionService.listarTransaccionesConFiltros(idUsuario, filtros).subscribe({
      next: (txs: TransaccionResponse[]) => {
        let totalGastos = 0;
        if (txs && txs.length > 0) {
          for (const t of txs) {
            // tipoTransaccion: true = ingreso, false = gasto
            if (t.tipoTransaccion === false) {
              totalGastos += Number(t.cantidad ?? 0);
            }
          }
        }
        this.gastoMensual = totalGastos;
        this.cargandoGasto = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al calcular gasto mensual', err);
        this.mensajeError = 'No se pudo calcular el gasto mensual. Comprueba el backend.';
        this.cargandoGasto = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarIngresoMensual(): void {
    const idUsuario = this.obtenerIdUsuarioActivo();
    if (idUsuario === null) {
      this.mensajeError = 'No se pudo cargar los ingresos mensuales. No se encontró el ID de usuario.';
      return;
    }

    this.mensajeError = '';
    this.cargandoIngreso = true;
    this.ingresoMensual = 0;

    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1, 0, 0, 0);
    const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59, 999);

    const filtros: any = {
      fechaInicio: inicioMes.toISOString(),
      fechaFin: finMes.toISOString()
    };

    this.transaccionService.listarTransaccionesConFiltros(idUsuario, filtros).subscribe({
      next: (txs: TransaccionResponse[]) => {
        let totalIngresos = 0;
        if (txs && txs.length > 0) {
          for (const t of txs) {
            // tipoTransaccion: true = ingreso, false = gasto
            if (t.tipoTransaccion === true) {
              totalIngresos += Number(t.cantidad ?? 0);
            }
          }
        }
        this.ingresoMensual = totalIngresos;
        this.cargandoIngreso = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al calcular ingresos mensuales', err);
        this.mensajeError = 'No se pudo calcular los ingresos mensuales. Comprueba el backend.';
        this.cargandoIngreso = false;
        this.cdr.detectChanges();
      }
    });
  }

  private obtenerIdUsuarioActivo(): number | null {
    if (this.idUsuario !== null) {
      return this.idUsuario;
    }

    this.idUsuario = this.loginService.obtenerIdUsuario();
    if (this.idUsuario === null) {
      this.mensajeError = 'No hay una sesión activa. Inicia sesión nuevamente para continuar.';
      this.cdr.detectChanges();
      return null;
    }

    return this.idUsuario;
  }

  cargarPerfil() {
    const idUsuario = this.obtenerIdUsuarioActivo();
    if (idUsuario === null) {
      return;
    }

    this.mensajeError = '';
    this.cargandoPerfil = true;
    this.usuarioService.obtenerPerfil(idUsuario).subscribe({
      next: (data) => {
        this.usuario = data;
        this.cargandoPerfil = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensajeError =
          'No se pudo cargar el perfil. Verifica que el backend esté activo en http://localhost:8080.';
        this.cargandoPerfil = false;
        this.cdr.detectChanges();
      },
    });
  }

  obtenerSaldo(): string {
    const idUsuario = this.obtenerIdUsuarioActivo();
    if (idUsuario === null) {
      return '';
    }
    // Formateamos con separador de miles y 2 decimales
    const formatter = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${formatter.format(this.saldo)} €`;
  }

  obtenerGastoMensual(): string {
    const formatter = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${formatter.format(this.gastoMensual)}€`;
  }

  obtenerIngresoMensual(): string {
    const formatter = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${formatter.format(this.ingresoMensual)} €`;
  }

  // Distribución por categoría (gastos del mes)
  distribucionSegments: Array<{ nombre: string; valor: number; porcentaje: number; colorIndex: number; colorKey: string; startAngle?: number; endAngle?: number; path?: string }> = [];

  // Últimas transacciones (mostradas en dashboard)
  recentTransactions: TransaccionResponse[] = [];

  // Datos para gráfico de evolución: un elemento por día
  dailyExpenses: Array<{ date: string; label: string; value: number; heightPercent: number; colorClass: string }> = [];

  cargarDistribucionCategorias(): void {
    const idUsuario = this.obtenerIdUsuarioActivo();
    if (idUsuario === null) return;

    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1, 0, 0, 0);
    const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59, 999);

    const filtros: any = {
      fechaInicio: inicioMes.toISOString(),
      fechaFin: finMes.toISOString()
    };

    this.transaccionService.listarTransaccionesConFiltros(idUsuario, filtros).subscribe({
      next: (txs: TransaccionResponse[]) => {
        // Agrupar por nombreCategoria y sumar solo gastos
        const map = new Map<string, number>();
        let totalGastos = 0;
        for (const t of txs || []) {
          if (t.tipoTransaccion === false) {
            const nombre = t.nombreCategoria ?? 'Sin categoría';
            const val = Number(t.cantidad ?? 0);
            totalGastos += val;
            map.set(nombre, (map.get(nombre) ?? 0) + val);
          }
        }

        // Convertir a array y ordenar desc
        const items = Array.from(map.entries()).map(([nombre, valor]) => ({ nombre, valor }));
        items.sort((a, b) => b.valor - a.valor);

        // Limitar top 4 y agrupar resto como "Otros"
        const top = items.slice(0, 4);
        const resto = items.slice(4);
        if (resto.length > 0) {
          const sumaResto = resto.reduce((s, it) => s + it.valor, 0);
          top.push({ nombre: 'Otros', valor: sumaResto });
        }

        // Generar segmentos tipo 'pie' (paths SVG) basados en ángulos
        let acumulado = 0; // porcentaje acumulado
        const palette = ['c1','c2','c3','c4','c5','c6','c7','c8'];
        const cx = 18, cy = 18, r = 16;

        const polarToCartesian = (cx: number, cy: number, radius: number, angleInDegrees: number) => {
          const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
          return {
            x: cx + (radius * Math.cos(angleInRadians)),
            y: cy + (radius * Math.sin(angleInRadians))
          };
        };

        const describeSector = (cx: number, cy: number, radius: number, startAngle: number, endAngle: number) => {
          const sweep = endAngle - startAngle;
          // full circle case
          if (Math.abs(sweep) >= 360 - 1e-6) {
            return `M ${cx} ${cy - radius} A ${radius} ${radius} 0 1 1 ${cx - 0.001} ${cy - radius} A ${radius} ${radius} 0 1 1 ${cx} ${cy - radius}`;
          }
          const start = polarToCartesian(cx, cy, radius, startAngle);
          const end = polarToCartesian(cx, cy, radius, endAngle);
          const largeArcFlag = (endAngle - startAngle) % 360 > 180 ? 1 : 0;
          return `M ${cx} ${cy} L ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)} Z`;
        };

        this.distribucionSegments = top.map((it, idx) => {
          const porcentaje = totalGastos > 0 ? (it.valor / totalGastos) * 100 : 0;
          const startAngle = (acumulado / 100) * 360;
          const endAngle = ((acumulado + porcentaje) / 100) * 360;
          const colorIndex = (idx % palette.length) + 1; // 1..8
          const colorKey = palette[idx % palette.length];
          const path = describeSector(cx, cy, r, startAngle, endAngle);
          acumulado += porcentaje;
          return { nombre: it.nombre, valor: it.valor, porcentaje, colorIndex, colorKey, startAngle, endAngle, path };
        });

        // Debug: imprimir distribucion en consola para inspección
        try {
          // eslint-disable-next-line no-console
          console.table(this.distribucionSegments.map(s => ({ nombre: s.nombre, valor: s.valor, porcentaje: Number(s.porcentaje.toFixed(3)), startAngle: Number((s.startAngle ?? 0).toFixed(3)), endAngle: Number((s.endAngle ?? 0).toFixed(3)) })));
        } catch (e) {
          // ignore
        }

        // Si no hay datos, dejar vacía la distribución
        if (this.distribucionSegments.length === 0 && totalGastos === 0) {
          this.distribucionSegments = [];
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar distribución por categoría', err);
      }
    });
  }

  cargarUltimasTransacciones(): void {
    const idUsuario = this.obtenerIdUsuarioActivo();
    if (idUsuario === null) return;

    this.transaccionService.listarTransacciones(idUsuario).subscribe({
      next: (txs: TransaccionResponse[]) => {
        const ordenadas = (txs || []).slice().sort((a, b) => {
          const fa = a.fecha ? new Date(a.fecha).getTime() : 0;
          const fb = b.fecha ? new Date(b.fecha).getTime() : 0;
          return fb - fa;
        });
        this.recentTransactions = ordenadas.slice(0, 5);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar últimas transacciones', err);
      }
    });
  }

  cargarEvolucionGastos(): void {
    const idUsuario = this.obtenerIdUsuarioActivo();
    if (idUsuario === null) return;

    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1, 0, 0, 0);
    const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59, 999);

    const filtros: any = {
      fechaInicio: inicioMes.toISOString(),
      fechaFin: finMes.toISOString()
    };

    this.transaccionService.listarTransaccionesConFiltros(idUsuario, filtros).subscribe({
      next: (txs: TransaccionResponse[]) => {
        // Mapear por día YYYY-MM-DD
        const map = new Map<string, number>();
        for (const t of txs || []) {
          if (t.tipoTransaccion === false) {
            const d = t.fecha ? new Date(t.fecha) : null;
            if (!d) continue;
            const key = d.toISOString().slice(0,10); // YYYY-MM-DD
            map.set(key, (map.get(key) ?? 0) + Number(t.cantidad ?? 0));
          }
        }

        // Construir array de todos los días del mes
        const days: Array<{ date: string; label: string; value: number }> = [];
        for (let d = new Date(inicioMes); d <= finMes; d.setDate(d.getDate() + 1)) {
          const key = new Date(d).toISOString().slice(0,10);
          const value = map.get(key) ?? 0;
          days.push({ date: key, label: String(d.getDate()), value });
        }

        // Escalar alturas según máximo
        const max = days.reduce((m, it) => Math.max(m, it.value), 0);
        this.dailyExpenses = days.map(it => {
          const heightPercent = max > 0 ? (it.value / max) * 100 : 0;
          let colorClass = 'barra--verde';
          if (it.value >= 300) colorClass = 'barra--roja';
          else if (it.value >= 100) colorClass = 'barra--amarilla';
          return { date: it.date, label: it.label, value: it.value, heightPercent, colorClass };
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar evolución de gastos', err);
      }
    });
  }

  obtenerIngresosMensuales(): string {
    return '0,00 €';
  }
}
