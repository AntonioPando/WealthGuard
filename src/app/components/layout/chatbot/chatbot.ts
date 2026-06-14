import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogflowService, MensajeChat } from '../../../services/dialogflow.service';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class ChatBotComponent {

  @ViewChild('mensajesContainer') mensajesContainer!: ElementRef;

  abierto = false;
  textoUsuario = '';
  cargando = false;

  mensajes: MensajeChat[] = [
    {
      texto: '¡Hola! Soy tu asistente financiero de WealthGuard. ¿En qué puedo ayudarte?',
      esUsuario: false,
      hora: new Date()
    }
  ];

  constructor(private dialogflowService: DialogflowService) {}

  toggleChat(): void {
    this.abierto = !this.abierto;
    if (this.abierto) {
      setTimeout(() => this.scrollAbajo(), 100);
    }
  }

  cerrar(): void {
    this.abierto = false;
  }

  enviar(): void {
    const texto = this.textoUsuario.trim();
    if (!texto || this.cargando) return;

    this.mensajes.push({ texto, esUsuario: true, hora: new Date() });
    this.textoUsuario = '';
    this.cargando = true;
    setTimeout(() => this.scrollAbajo(), 50);

    this.dialogflowService.enviarMensaje(texto).subscribe({
      next: (res: any) => {
        const respuesta = res?.queryResult?.fulfillmentText || 'No entendí eso. ¿Puedes reformularlo?';
        this.mensajes.push({ texto: respuesta, esUsuario: false, hora: new Date() });
        this.cargando = false;
        setTimeout(() => this.scrollAbajo(), 50);
      },
      error: () => {
        this.mensajes.push({
          texto: 'Hubo un error al conectar con el asistente. Inténtalo de nuevo.',
          esUsuario: false,
          hora: new Date()
        });
        this.cargando = false;
        setTimeout(() => this.scrollAbajo(), 50);
      }
    });
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviar();
    }
  }

  private scrollAbajo(): void {
    if (this.mensajesContainer) {
      const el = this.mensajesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}