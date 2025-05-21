import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ask-question',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css']
})
export class AskQuestionComponent implements OnInit {
  questionForm!: FormGroup;
  submitted = false;
  products: any[] = [];  // Will be fetched from backend

  constructor(private fb: FormBuilder, private http: HttpClient,private router: Router) {}

  ngOnInit(): void {
    this.questionForm = this.fb.group({
      subject: ['', [Validators.required, Validators.minLength(5)]],
      product: ['', Validators.required],
      body: ['', [Validators.required, Validators.minLength(10)]],
      label: ['', Validators.required] 
    });

    this.loadProducts();  // Load product list from backend
  }
  loadProducts(): void {
    this.http.get<any[]>('http://localhost:8081/api/products')
      .subscribe({
        next: (data) => {
          this.products = data;
        
        },
        error: (err) => {
          console.error('Failed to load products:', err);
          alert('Failed to load product list. Please try again later.');
        }
      });
  }
  

  
  // onSubmit(): void {
  //   this.submitted = true;
  
  //   if (this.questionForm.valid) {
  //     const formData = this.questionForm.value;
  
  //     const payload = {
  //       title: formData.subject,
  //       content: formData.body,
  //       productCode: formData.product === 'Choose a Product' ? '' : formData.product,
  //       label: formData.product.toLowerCase(),
  //       status: false
  //     };
  
  //     const token = localStorage.getItem('token');
      
  //     if (!token) {
  //       alert('You must be logged in to submit a question.');
  //       return;
  //     }
  
  //     const headers = new HttpHeaders({
  //       'Authorization': `Bearer ${token}`,
  //       'Content-Type': 'application/json'
  //     });
  
  //     this.http.post('http://localhost:8081/api/questions', payload, { headers })
  //       .subscribe({
  //         next: (res) => {
  //           alert('Question submitted successfully!');
  //           console.log('Response:', res);
  //           this.questionForm.reset();
  //           this.submitted = false;
  //         },
  //         error: (err) => {
  //           console.error('Submission failed:', err);
  //           if (err.status === 403) {
  //             alert('Access denied. Please login again.');
  //           } else {
  //             alert(`Error submitting question: ${err.message || 'Unknown error'}`);
  //           }
  //         }
  //       });
  //   }
  // }

  onSubmit(): void {
    this.submitted = true;
  
    if (this.questionForm.valid) {
      const formData = this.questionForm.value;
  
      const payload = {
        title: formData.subject,
        content: formData.body,
        productCode: formData.product === 'Choose a Product' ? '' : formData.product,
        label: formData.label,
        status: false
      };
  
      const token = localStorage.getItem('auth_token');  // ✅ Corrected key
  
      if (!token) {
        alert('You must be logged in to submit a question.');
        return;
      }
  
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
  
      this.http.post('http://localhost:8081/api/questions', payload, { headers })
        .subscribe({
          next: (res) => {
            alert('Question submitted successfully!');
            console.log('Response:', res);
            this.questionForm.reset();
            this.submitted = false;
            
setTimeout(() => {
  this.router.navigate(['/home']);
}, 1000);

          },
          error: (err) => {
            console.error('Submission failed:', err);
            if (err.status === 403) {
              alert('Access denied. Please login again.');
            } else {
              alert(`Error submitting question: ${err.message || 'Unknown error'}`);
            }
          }
        });
    }
  }
  
  
  
  onCancel(): void {
    this.questionForm.reset();
    this.submitted = false;
  }
}