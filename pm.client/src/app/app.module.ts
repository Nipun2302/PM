import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';  // 👈 add HTTP_INTERCEPTORS
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ProductComponent } from './components/product/product.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { AppRoutingModule } from './app-routing.module';

import { TokenInterceptor } from './Auth/token.interceptor';   // 👈 import interceptor
import { AuthGuard } from './Auth/auth.guard';                 // (if guard isn’t auto‑provided)
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

// ──────────────────────────────────────────────────────────────

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,  
    ToastrModule.forRoot({        
      positionClass: 'toast-bottom-right',
      timeOut: 3000
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },  // 👈 register interceptor
    AuthGuard                                                                  // (optional, if not providedIn:'root')
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
