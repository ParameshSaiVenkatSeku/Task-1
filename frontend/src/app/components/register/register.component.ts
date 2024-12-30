import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule for form handling
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  // standalone: true,  // Mark this as a standalone component
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],  // Import necessary modules
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required] ,
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.http.post('http://localhost:3000/register', this.registerForm.value).subscribe(
        (response: any) => {
          alert(response.message);
          this.router.navigate(['/login']);
        },
        (error) => {
          this.errorMessage = error.error.message || 'An error occurred';
        }
      );
    } else {
      this.errorMessage = 'Please fill out the form correctly';
    }
  }
}