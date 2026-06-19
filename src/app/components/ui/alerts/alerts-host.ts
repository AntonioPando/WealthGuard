import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiAlertsService } from '../../../services/ui-alerts.service';

@Component({
  selector: 'app-alerts-host',
  imports: [],
  templateUrl: './alerts-host.html',
  styleUrl: './alerts-host.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertsHost {
  private readonly uiAlertsService = inject(UiAlertsService);

  protected readonly dialog = this.uiAlertsService.dialog;

  protected cerrar(): void {
    this.uiAlertsService.cerrar();
  }

  protected aceptar(): void {
    this.uiAlertsService.aceptar();
  }

  protected cancelar(): void {
    this.uiAlertsService.cancelar();
  }
}
