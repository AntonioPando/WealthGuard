import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatBotComponent } from './components/layout/chatbot/chatbot';
import { AlertsHost } from './components/ui/alerts/alerts-host';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChatBotComponent, AlertsHost],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('WealthWard');
}
