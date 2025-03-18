import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isSidebarOpen = false;

  constructor(private authService: AuthService) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  onSidebarToggle(isOpen: boolean) {
    this.isSidebarOpen = isOpen;
  }
}
