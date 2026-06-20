import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-view-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.css']
})
export class ViewDetailsComponent implements OnInit {
  questionId: string = '';
  question: any;
  isCommentBoxVisible = false;  // Flag to toggle visibility of the comment box
  newComment: string = '';  // Store the new comment
  comments: any[] = [];  // Initialize with empty array to prevent null reference
  emailFromLocalStorage: string = '';
  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private http: HttpClient  // Inject HttpClient for API calls
  ) {}

  ngOnInit(): void {
    this.emailFromLocalStorage = localStorage.getItem("user_email") || '';
    this.questionId = this.route.snapshot.paramMap.get('id')!;
    console.log('Question ID from route:', this.questionId);
    this.loadQuestionDetails();
    
    // Add a small delay to ensure question is loaded first
    setTimeout(() => {
      this.loadComments();
    }, 300);
  }

  loadQuestionDetails(): void {
    this.questionService.getQuestionById(this.questionId).subscribe({
      next: (res) => {
        this.question = res;
      },
      error: (err) => {
        console.error('Error loading question details', err);
      }
    });
  }

  loadComments(): void {
    // Make sure the questionId is treated as a number (Long in the backend)
    const numericQuestionId = parseInt(this.questionId);
    console.log('Loading comments for question ID:', numericQuestionId);
    
    this.http.get<any[]>(`http://localhost:8081/api/comments/${numericQuestionId}`).subscribe({
      next: (res) => {
        console.log('Comments received from API:', res);
        this.comments = res || []; // Ensure it's always an array even if null is returned
        console.log('Comments array after assignment:', this.comments);
        console.log(this.comments[0].likes.length);
        
      },
      error: (err) => {
        console.error('Error loading comments', err);
        this.comments = []; // Initialize to empty array on error
      }
    });
  }

  // Toggle visibility of the comment box
  toggleCommentBox(): void {
    this.isCommentBoxVisible = !this.isCommentBoxVisible;
  }

  // Submit the comment to the API
  submitComment(): void {
    if (this.newComment.trim()) {
      const commentData = {
        questionId: this.questionId,  // Assuming you have a question ID to associate with the comment
        content: this.newComment
      };

      console.log('Submitting comment:', commentData);

      // Make the API call to submit the comment
      this.http.post('http://localhost:8081/api/comments', commentData).subscribe(
        (response) => {
          console.log('Comment posted successfully:', response);
          this.isCommentBoxVisible = false;  // Hide the comment box after posting
          this.newComment = '';  // Clear the text area
          
          // Wait a moment to ensure the backend has processed the new comment
          setTimeout(() => {
            this.loadComments();  // Reload comments to show the new one
          }, 500);
        },
        (error) => {
          console.error('Error posting comment:', error);
        }
      );
    } else {
      alert('Please write a comment before posting.');
    }
  }


  toggleLike(commentId: number): void {
    const url = `http://localhost:8081/api/likes/toggle/${commentId}`;
    this.http.post(url, {}).subscribe({
      next: (res) => {
        console.log('Like toggled for comment ID:', commentId, res);
        window.location.reload();
      },
      error: (err) => {
        console.error('Error toggling like:', err);
      }
    });
  }

  // closeQuestion(commentId: number): void {
  //   if (!this.questionId) return;
    
  //   const url = `http://localhost:8081/api/questions/${this.questionId}/close`;
  //   this.http.put(url, {}).subscribe({
  //     next: (response: any) => {
  //       console.log('Question closed successfully', response);
  //       // Refresh question data to show updated status
  //       this.loadQuestionDetails();
  //     },
  //     error: (error) => {
  //       console.error('Error closing question:', error);
  //       // Handle error - could show a notification to the user
  //     }
  //   });

  //   const newUrl =  `http://localhost:8081/api/questions/${commentId}/approve`;
  //   this.http.put(newUrl, {}).subscribe({
  //     next: (res) => {
  //       console.log('comment marked as answer');
  //       window.location.reload();
  //     },
  //     error: (err) => {
  //       console.error('Error toggling like:', err);
  //     }
  //   });
  // }

  closeQuestion(commentId: number): void {
    if (!this.questionId) return;
  
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    const closeUrl = `http://localhost:8081/api/questions/${this.questionId}/close`;
    const approveUrl = `http://localhost:8081/api/comments/${commentId}/approve`;
  
    this.http.put(closeUrl, {}, { }).pipe(
      switchMap((closeRes) => {
        console.log('Question closed successfully', closeRes);
        // Optionally refresh question details here if needed
        this.loadQuestionDetails();
        return this.http.put(approveUrl, {}, { headers });
      })
    ).subscribe({
      next: (approveRes) => {
        console.log('Comment marked as answer', approveRes);
        // Prefer UI update over full reload
        this.loadQuestionDetails(); 
        window.location.reload();
      },
      error: (err) => {
        console.error('Error during close/approve sequence:', err);
      }
    });

    // 
  }

  
}