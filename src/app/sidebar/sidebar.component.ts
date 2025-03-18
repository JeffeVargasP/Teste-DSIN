import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isOpen = false;
  isMobile = window.innerWidth <= 768;
  @Output() sidebarToggle = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
    });
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.sidebarToggle.emit(this.isOpen);
  }

  logout() {
    this.authService.logout();
  }
}
