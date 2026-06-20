// import { Component } from '@angular/core';
// import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { RouterLink } from '@angular/router';
// import { HttpClient, HttpClientModule } from '@angular/common/http';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterLink],
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css']
// })
// export class RegisterComponent {
//   constructor(private http: HttpClient) {}

//   registerForm = new FormGroup({
//     firstName: new FormControl('', Validators.required),
//     lastName: new FormControl('', Validators.required),
//     email: new FormControl('', [Validators.required, Validators.email]),
//     password: new FormControl('', Validators.required),
//     confirmPassword: new FormControl('', Validators.required),
//   }, { validators: this.passwordMatchValidator() });

//   // Custom validator to check if passwords match
//   passwordMatchValidator(): ValidatorFn {
//     return (control: AbstractControl): { [key: string]: boolean } | null => {
//       const password = control.get('password')?.value;
//       const confirmPassword = control.get('confirmPassword')?.value;
//       return password && confirmPassword && password !== confirmPassword
//         ? { passwordMismatch: true }
//         : null;
//     };
//   }

//   // API call on form submission
//   onRegister() {
//     if (this.registerForm.invalid) {
//       this.registerForm.markAllAsTouched();
//       return;
//     }
  
//     const formData = this.registerForm.value;
  
//     // Map form data to API format
//     const requestBody = {
//       name: `${formData.firstName} ${formData.lastName}`,
//       email: formData.email,
//       password: formData.password
//     };
  
//     this.http.post('http://localhost:8081/api/auth/register', requestBody).subscribe({
//       next: (response) => {
//         console.log('Registration successful:', response);
//         alert('Registration successful!');
//         // Optionally redirect after success
//         // this.router.navigate(['/login']);
//       },
//       error: (error) => {
//         console.error('Registration failed:', error);
//         alert('Registration failed. Please try again.');
//       }
//     });
//   }
  

//   // Getters for HTML template access
//   get firstName() {
//     return this.registerForm.get('firstName');
//   }

//   get lastName() {
//     return this.registerForm.get('lastName');
//   }

//   get email() {
//     return this.registerForm.get('email');
//   }

//   get password() {
//     return this.registerForm.get('password');
//   }

//   get confirmPassword() {
//     return this.registerForm.get('confirmPassword');
//   }
// }

//------
// import { Component } from '@angular/core';
// import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { RouterLink } from '@angular/router';
// import { HttpClient, HttpClientModule } from '@angular/common/http';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterLink],
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css']
// })
// export class RegisterComponent {
//   constructor(private http: HttpClient) {}

//   registerForm = new FormGroup({
//     firstName: new FormControl('', Validators.required),
//     lastName: new FormControl('', Validators.required),
//     email: new FormControl('', [Validators.required, Validators.email]),
//     password: new FormControl('', Validators.required),
//     //confirmPassword: new FormControl('', Validators.required),
//   }, { validators: this.passwordMatchValidator() });

//   // Custom validator to check if passwords match
//   passwordMatchValidator(): ValidatorFn {
//     return (control: AbstractControl): { [key: string]: boolean } | null => {
//       const password = control.get('password')?.value;
//       const confirmPassword = control.get('confirmPassword')?.value;
//       return password && confirmPassword && password !== confirmPassword
//         ? { passwordMismatch: true }
//         : null;
//     };
//   }

//   // API call on form submission
//   onRegister() {
//     if (this.registerForm.invalid) {
//       this.registerForm.markAllAsTouched();
//       return;
//     }

//     const formData = this.registerForm.value;

//     this.http.post('http://localhost:8081/api/auth/register', formData).subscribe({
//       next: (response) => {
//         console.log('Registration successful:', response);
//         alert('Registration successful!');
//         // Optionally redirect after success
//         // this.router.navigate(['/login']);
//       },
//       error: (error) => {
//         console.error('Registration failed:', error);
//         alert('Registration failed. Please try again.');
//       }
//     });
//   }

//   // Getters for HTML template access
//   get firstName() {
//     return this.registerForm.get('firstName');
//   }

//   get lastName() {
//     return this.registerForm.get('lastName');
//   }

//   get email() {
//     return this.registerForm.get('email');
//   }

//   get password() {
//     return this.registerForm.get('password');
//   }

//   get confirmPassword() {
//     return this.registerForm.get('confirmPassword');
//   }
// }


import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  corsTestResult: string = 'Testing...';
  apiUrl: string = 'http://localhost:8081/api/auth/register';
  isSubmitting: boolean = false;
  errorMessage: string = '';
  
  constructor(private http: HttpClient, private router: Router) {}
  
  ngOnInit() {
    // Test if CORS is properly configured
    this.http.options(this.apiUrl).subscribe({
      next: () => {
        this.corsTestResult = 'CORS is configured correctly!';
        console.log('CORS test passed!');
      },
      error: (error) => {
        this.corsTestResult = `CORS issue detected: ${error.message}`;
        console.error('CORS test failed:', error);
      }
    });
  }

  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required, 
      Validators.minLength(8),
      // Add password strength validator if needed
    ]),
    confirmPassword: new FormControl('', Validators.required),
  }, { validators: this.passwordMatchValidator() });

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      return password && confirmPassword && password !== confirmPassword
        ? { passwordMismatch: true }
        : null;
    };
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    
    const formData = this.registerForm.value;
    
    // Exact format that worked in Postman
    const requestBody = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password
    };
    
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    
    console.log('Sending registration data:', requestBody);
    
    this.http.post<any>(this.apiUrl, requestBody, {
      headers: headers,
      observe: 'response'  // Get the full response including headers
    }).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        
        // Store token from response if applicable
        if (response.body && response.body.token) {
          localStorage.setItem('auth_token', response.body.token);
        }
        
        this.isSubmitting = false;
        alert('Registration successful!');
        
        // Navigate to login or dashboard page
        this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        console.error('Registration failed:', error);
        
        // More detailed error analysis
        if (error.status === 0) {
          this.errorMessage = 'Network error: Cannot connect to the server. Please check if backend is running.';
        } else if (error.status === 403) {
          this.errorMessage = 'Access forbidden. This could be due to CORS, CSRF protection, or insufficient permissions.';
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid data: ' + (error.error?.message || 'Please check your information.');
        } else if (error.status === 409) {
          this.errorMessage = 'Email already exists.';
        } else {
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
        
        alert(this.errorMessage);
      }
    });
  }

  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}