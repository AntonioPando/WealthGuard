import { Injectable, signal } from '@angular/core';

export type UiAlertSeverity = 'info' | 'success' | 'warning' | 'danger';

export interface UiAlertOptions {
  title: string;
  message: string;
  confirmText?: string;
  severity?: UiAlertSeverity;
}

export interface UiConfirmOptions extends UiAlertOptions {
  cancelText?: string;
}

type UiDialogKind = 'alert' | 'confirm';

interface UiDialogState {
  kind: UiDialogKind;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  severity: UiAlertSeverity;
}

@Injectable({ providedIn: 'root' })
export class UiAlertsService {
  readonly dialog = signal<UiDialogState | null>(null);

  private alertResolver: (() => void) | null = null;
  private confirmResolver: ((value: boolean) => void) | null = null;

  alert(options: UiAlertOptions): Promise<void> {
    this.cerrarDialogoActual(false);

    return new Promise<void>((resolve) => {
      this.alertResolver = resolve;
      this.dialog.set({
        kind: 'alert',
        title: options.title,
        message: options.message,
        confirmText: options.confirmText ?? 'Entendido',
        cancelText: '',
        severity: options.severity ?? 'info'
      });
    });
  }

  confirm(options: UiConfirmOptions): Promise<boolean> {
    this.cerrarDialogoActual(false);

    return new Promise<boolean>((resolve) => {
      this.confirmResolver = resolve;
      this.dialog.set({
        kind: 'confirm',
        title: options.title,
        message: options.message,
        confirmText: options.confirmText ?? 'Confirmar',
        cancelText: options.cancelText ?? 'Cancelar',
        severity: options.severity ?? 'danger'
      });
    });
  }

  aceptar(): void {
    const dialogo = this.dialog();
    if (!dialogo) return;

    this.dialog.set(null);

    if (dialogo.kind === 'alert') {
      this.alertResolver?.();
      this.alertResolver = null;
      return;
    }

    this.confirmResolver?.(true);
    this.confirmResolver = null;
  }

  cancelar(): void {
    const dialogo = this.dialog();
    if (!dialogo) return;

    this.dialog.set(null);

    if (dialogo.kind === 'alert') {
      this.alertResolver?.();
      this.alertResolver = null;
      return;
    }

    this.confirmResolver?.(false);
    this.confirmResolver = null;
  }

  cerrar(): void {
    this.cancelar();
  }

  private cerrarDialogoActual(resolverConfirmacion: boolean): void {
    const dialogo = this.dialog();
    if (!dialogo) return;

    this.dialog.set(null);

    if (dialogo.kind === 'alert') {
      this.alertResolver?.();
      this.alertResolver = null;
      return;
    }

    this.confirmResolver?.(resolverConfirmacion);
    this.confirmResolver = null;
  }
}
