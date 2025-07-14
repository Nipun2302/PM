import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';
  selectedRole = 'User';        // 👈 default role
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastrService
  ) { }

  login(): void {
    this.loading = true;

    this.auth.login(this.username, this.password, this.selectedRole)   // 👈 pass role
      .subscribe({
        next: () => {
          this.toast.success('Welcome back!');
          this.loading = false;
          this.router.navigate(['/products']);
        },
        error: () => {
          this.toast.error('Invalid username or password');
          this.loading = false;
        }
      });
  }
}
