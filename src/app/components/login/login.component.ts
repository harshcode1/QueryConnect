import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Adjusted path
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  loginError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    this.submitted = true;
  
    if (this.loginForm.invalid) {
      return;
    }
  
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (success: boolean) => {
        if (success) {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
          this.router.navigate([returnUrl]);
        } else {
          this.loginError = 'Login failed. Please check your credentials.';
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Login error:', error);
        this.loginError = error.error?.message || 'An error occurred while logging in.';
      }
    });
    
  
    // this.authService.login(email, password).subscribe({
    //   next: (response: any) => {
    //     // Log response for debugging
    //     console.log('Login response:', response);
  
    //     // ✅ Extract and store the token
    //     const token: string | undefined = response?.token;
    //     if (token && typeof token === 'string') {
    //       localStorage.setItem('token', token);
    //     } else {
    //       console.error('No valid token found in login response');
    //       this.loginError = 'Invalid token received from server.';
    //       return;
    //     }
  
    //     // ✅ Navigate to return URL or default
    //     const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
    //     this.router.navigate([returnUrl]);
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     console.error('Login error:', error);
    //     this.loginError = error.error?.message || 'An error occurred while logging in.';
    //   }
    // });
  }
}
