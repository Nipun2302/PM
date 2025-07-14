import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  username = '';
  password = '';
  role = 'User';                  // 👈 default role
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastrService
  ) { }

  register(): void {
    this.loading = true;
    this.auth.register(this.username, this.password, this.role).subscribe({
      next: () => {
        this.toast.success('Registered successfully!');
        this.router.navigate(['/login']);
        this.loading = false;
      },
      error: (err) => {
        this.toast.error(err.error || 'Registration failed');
        this.loading = false;
      }
    });
  }
}
