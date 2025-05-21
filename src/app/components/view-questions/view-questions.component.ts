import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { QuestionService } from '../../services/question.service'; // Adjust path as needed
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-questions',
  standalone: true,
  imports: [CommonModule, HttpClientModule,RouterLink],
  templateUrl: './view-questions.component.html',
  styleUrls: ['./view-questions.component.css']
})
export class ViewQuestionsComponent implements OnInit {
  myQuestions: any[] = [];

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.fetchMyQuestions();
  }

  fetchMyQuestions(): void {
    this.questionService.getMyQuestions().subscribe({
      next: (questions) => {
        this.myQuestions = questions;
        console.log('Fetched questions:', questions);
      },
      error: (err) => {
        console.error('Error fetching questions', err);
      }
    });
  }

  

  // 🆕 Close question method
  closeQuestion(questionId: number): void {
    if (confirm('Are you sure you want to close this question?')) {
      this.questionService.closeQuestion(questionId).subscribe({
        next: () => {
          alert('Question closed successfully');
          this.fetchMyQuestions(); // Refresh the list
        },
        error: (err) => {
          console.error('Error closing question:', err);
          alert('Failed to close the question');
        }
      });
    }
  }
}
