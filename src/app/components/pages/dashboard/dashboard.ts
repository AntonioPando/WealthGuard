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

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Header, MenuLateral, RecomendacionPopupComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly loginService = inject(LoginService);
  private readonly transaccionService = inject(TransaccionService);
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

  ngOnInit(): void {
    this.idUsuario = this.loginService.obtenerIdUsuario();

    if (this.idUsuario === null) {
      // Si no hay una sesión activa, redirige al usuario a la página de inicio de sesión
      this.mensajeError =
        'No hay una sesión activa. Inicia sesión nuevamente para acceder al dashboard.';
      return;
    }

    // Cargamos datos principales
    this.cargarPerfil();
    this.cargarSaldo();
    this.cargarGastoMensual();
    this.cargarIngresoMensual();
    this.cargarDistribucionCategorias();
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
    return `${formatter.format(this.gastoMensual)} €`;
  }

  obtenerIngresoMensual(): string {
    const formatter = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${formatter.format(this.ingresoMensual)} €`;
  }

  // Distribución por categoría (gastos del mes)
  distribucionSegments: Array<{ nombre: string; valor: number; porcentaje: number; dashArray: string; dashOffset: string; colorIndex: number; colorKey: string }> = [];

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

        // Generar segmentos: convertir porcentajes a longitudes sobre el perímetro del círculo
        let acumulado = 0;
        // Usamos una paleta ampliada c1..c8
        const palette = ['c1','c2','c3','c4','c5','c6','c7','c8'];
        // Radio usado en el SVG (r=16 en viewBox 0 0 36 36)
        const r = 16;
        const circumference = 2 * Math.PI * r;
        this.distribucionSegments = top.map((it, idx) => {
          const porcentaje = totalGastos > 0 ? (it.valor / totalGastos) * 100 : 0;
          const dashLen = (porcentaje / 100) * circumference;
          const gapLen = Math.max(0, circumference - dashLen);
          const dashArray = `${dashLen.toFixed(3)} ${gapLen.toFixed(3)}`;
          const dashOffset = `${-((acumulado / 100) * circumference).toFixed(3)}`;
          acumulado += porcentaje;
          const colorIndex = (idx % palette.length) + 1; // 1..8
          const colorKey = palette[idx % palette.length];
          return { nombre: it.nombre, valor: it.valor, porcentaje, dashArray, dashOffset, colorIndex, colorKey };
        });

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

  obtenerIngresosMensuales(): string {
    return '0,00 €';
  }
}
