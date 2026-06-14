import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/layout/header/header";
import { MenuLateral } from "./components/layout/menu-lateral/menu-lateral";
import { Dashboard } from './components/pages/dashboard/dashboard';
import { ChatBotComponent } from './components/layout/chatbot/chatbot';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, MenuLateral, Dashboard, ChatBotComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('WealthWard');
}
