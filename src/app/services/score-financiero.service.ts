import { Injectable } from '@angular/core';
import { TransaccionService } from './transaccion.service';
import { PresupuestosService } from './presupuesto.service';
import { forkJoin, map, Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ScoreFinancieroService {

	constructor(
		private transaccionService: TransaccionService,
		private presupuestosService: PresupuestosService
	) {}

	/**
	 * Obtener score mensual de un usuario (0..1000) con desglose de componentes.
	 * Devuelve un objeto con el `score` total y el `breakdown` por componente.
	 */
	obtenerScoreMensual(idUsuario: number): Observable<{ score: number; breakdown: { ahorro: number; saludSaldo: number; calidadCategorias: number; tendencia: number } }> {
		if (!idUsuario) return of({ score: 0, breakdown: { ahorro: 0, saludSaldo: 0, calidadCategorias: 0, tendencia: 0 } });

		const ahora = new Date();
		const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1, 0, 0, 0).toISOString();
		const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

		// Peticiones necesarias:
		// - transacciones totales (para saldo)
		// - transacciones del mes (para ingreso/gasto y distribucion)
		// - transacciones últimos 3 meses (para gasto promedio)
		// - presupuestos del usuario (para control presupuesto)

		const inicio3Meses = new Date(ahora.getFullYear(), ahora.getMonth() - 2, 1, 0, 0, 0).toISOString();
		const fin3Meses = finMes;

		const reqSaldo = this.transaccionService.listarTransacciones(idUsuario);
		const reqMes = this.transaccionService.listarTransaccionesConFiltros(idUsuario, { fechaInicio: inicioMes, fechaFin: finMes });
		const req3Meses = this.transaccionService.listarTransaccionesConFiltros(idUsuario, { fechaInicio: inicio3Meses, fechaFin: fin3Meses });
		const reqPresupuestos = this.presupuestosService.listarPresupuestos(idUsuario);

		return forkJoin({ saldoTx: reqSaldo, mesTx: reqMes, tresMesesTx: req3Meses, presupuestos: reqPresupuestos }).pipe(
			map(({ saldoTx, mesTx, tresMesesTx, presupuestos }) => {

				// Si no hay transacciones, no hay score
				if (!saldoTx || saldoTx.length === 0) {
                    return {
                        score: 0,
                        breakdown: { ahorro: 0, saludSaldo: 0, calidadCategorias: 0, tendencia: 0 }
                    };
                }

				// Calcular saldo actual
				let saldo = 0;
				for (const t of saldoTx || []) {
					saldo += (t.tipoTransaccion ? 1 : -1) * Number(t.cantidad ?? 0);
				}

				// Calcular ingresos y gastos del mes
				let ingresosMes = 0;
				let gastosMes = 0;
				const gastosPorCategoria = new Map<string, number>();
				const gastosDiarios: number[] = [];

				for (const t of mesTx || []) {
					const val = Number(t.cantidad ?? 0);
					if (t.tipoTransaccion) ingresosMes += val; else {
						gastosMes += val;
						const nombre = t.nombreCategoria ?? 'Sin categoría';
						gastosPorCategoria.set(nombre, (gastosPorCategoria.get(nombre) ?? 0) + val);
						// día
						if (t.fecha) {
							gastosDiarios.push(val);
						}
					}
				}

				// Gasto promedio mensual (tomando 3 meses)
				const gastosPorMes = new Map<string, number>();
				for (const t of tresMesesTx || []) {
					if (t.tipoTransaccion === false) {
						const d = t.fecha ? new Date(t.fecha) : null;
						if (!d) continue;
						const key = `${d.getFullYear()}-${d.getMonth()}`;
						gastosPorMes.set(key, (gastosPorMes.get(key) ?? 0) + Number(t.cantidad ?? 0));
					}
				}
				const meses = Array.from(gastosPorMes.values());
				const gastoPromedio = meses.length > 0 ? meses.reduce((s, x) => s + x, 0) / meses.length : 0;

				// Presupuesto total del mes (sumar límites activos si aplica)
				let presupuestoTotal = 0;
				for (const p of presupuestos || []) {
					// Si el presupuesto tiene fechas se debería filtrar por mes; asumimos que listarPresupuestos devuelve los activos o con fecha
					presupuestoTotal += Number((p as any).limite ?? 0);
				}

				// 1) Tasa de ahorro (350)
				let puntosAhorro = 0;
				if (ingresosMes > 0) {
					const tasa = ((ingresosMes - gastosMes) / ingresosMes) * 100;
					if (tasa >= 20) puntosAhorro = 350;
					else if (tasa > 0) puntosAhorro = (tasa / 20) * 350;
					else puntosAhorro = 0;
				} else {
					puntosAhorro = 0;
				}

				// 2) Ratio de salud del saldo actual (250)
				let puntosSalud = 0;
				if (gastoPromedio <= 0) {
					puntosSalud = saldo > 0 ? 250 : 0;
				} else {
					const ratio = saldo / gastoPromedio;
					if (ratio >= 2) puntosSalud = 250;
					else if (ratio > 0) puntosSalud = Math.max(0, (ratio / 2) * 250);
					else puntosSalud = 0;
				}

				// 3) Calidad de gasto por categorías (250)
				// Clasificar categorías según reglas del negocio
				const esencialesList = ['Educación','Salud','Vivienda','Alimentación','Transporte','educacion','salud','vivienda','alimentacion','transporte'];
				const discrecionalesList = ['Ocio','Viajes','Regalos','ocio','viajes','regalos'];
				const fijosPrescindiblesList = ['Suscripciones','suscripciones','Suscripción','suscripción'];

				let totalGastos = 0;
				for (const v of gastosPorCategoria.values()) totalGastos += v;

				const sumaPorGrupo = { esenciales: 0, discrecionales: 0, fijos: 0 };
				for (const [cat, val] of gastosPorCategoria.entries()) {
					if (esencialesList.includes(cat)) sumaPorGrupo.esenciales += val;
					else if (discrecionalesList.includes(cat)) sumaPorGrupo.discrecionales += val;
					else if (fijosPrescindiblesList.includes(cat)) sumaPorGrupo.fijos += val;
				}

				const esencialesPct = totalGastos > 0 ? (sumaPorGrupo.esenciales / totalGastos) * 100 : 0;
				const discrecionalesPct = totalGastos > 0 ? (sumaPorGrupo.discrecionales / totalGastos) * 100 : 0;
				const fijosPct = totalGastos > 0 ? (sumaPorGrupo.fijos / totalGastos) * 100 : 0;

				// Penalizaciones: exceso sobre 50/30/20
				const excesoEsenciales = Math.max(0, esencialesPct - 50);
				const excesoDiscrec = Math.max(0, discrecionalesPct - 30);
				const excesoFijos = Math.max(0, fijosPct - 20);
				const totalExcesoPct = excesoEsenciales + excesoDiscrec + excesoFijos;

				const puntosCalidad = Math.max(0, 250 - (totalExcesoPct / 100) * 250);

				// 4) Tendencia y control presupuesto (150)
				let puntosTendencia = 0;
				if (presupuestoTotal > 0) {
					if (gastosMes <= presupuestoTotal) puntosTendencia = 150;
					else {
						const sobre = gastosMes - presupuestoTotal;
						const ratio = sobre / presupuestoTotal; // 0 = at budget, 1 = 100% over
						puntosTendencia = Math.max(0, (1 - ratio) * 150);
					}
				} else {
					// Si no hay presupuesto, premiar si la variabilidad es baja
					const mean = gastosDiarios.length > 0 ? gastosDiarios.reduce((s, x) => s + x, 0) / gastosDiarios.length : 0;
					const variance = gastosDiarios.length > 0 ? gastosDiarios.reduce((s, x) => s + Math.pow(x - mean, 2), 0) / gastosDiarios.length : 0;
					const std = Math.sqrt(variance);
					// si std/mean bajo (<0.5) consideramos controlado
					if (mean === 0) puntosTendencia = 150; else if ((std / mean) < 0.5) puntosTendencia = 150; else puntosTendencia = Math.max(0, (1 - (std / mean)) * 150);
				}

				const total = Math.round(puntosAhorro + puntosSalud + puntosCalidad + puntosTendencia);

				return {
					score: Math.min(1000, total),
					breakdown: {
						ahorro: Math.round(puntosAhorro),
						saludSaldo: Math.round(puntosSalud),
						calidadCategorias: Math.round(puntosCalidad),
						tendencia: Math.round(puntosTendencia)
					}
				};
			})
		);
	}

}

