import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FotoPerfilService {
  private fotoSubject = new BehaviorSubject<string>('/usuario.png');
  foto$ = this.fotoSubject.asObservable();

  actualizar(url: string): void {
    this.fotoSubject.next(url);
  }
}