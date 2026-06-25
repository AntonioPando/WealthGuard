import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatBotComponent {

  constructor(private loginService: LoginService) {}

  get estaLogueado(): boolean {
    return this.loginService.estaAutenticado();
  }
}