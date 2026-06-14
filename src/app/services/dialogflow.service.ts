import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MensajeChat {
  texto: string;
  esUsuario: boolean;
  hora: Date;
}

@Injectable({ providedIn: 'root' })
export class DialogflowService {

  private readonly PROJECT_ID = 'wealthguard-bot';
  private readonly API_KEY = 'AIzaSyBtYQNTKHE7hPkArdr0vjN0J0k3r1UFT2Y';
  private readonly LANGUAGE = 'es';
  private sessionId: string;

  constructor(private http: HttpClient) {
    // Genera un ID de sesión sin dependencias externas
    this.sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  enviarMensaje(texto: string): Observable<any> {
    const url = `https://dialogflow.googleapis.com/v2/projects/${this.PROJECT_ID}/agent/sessions/${this.sessionId}:detectIntent?key=${this.API_KEY}`;

    const body = {
      queryInput: {
        text: {
          text: texto,
          languageCode: this.LANGUAGE
        }
      }
    };

    return this.http.post(url, body);
  }
}