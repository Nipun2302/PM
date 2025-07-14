import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './Auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Product Management System';

  constructor(public auth: AuthService, private router: Router) { }

  /** true when a JWT is present */
  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  /** clear token and return to login page */
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
