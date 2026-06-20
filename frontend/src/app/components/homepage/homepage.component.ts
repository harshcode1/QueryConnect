import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  username: string = '';
  searchQuery: string = '';
  userInitials: string = '';
  userAvatar: string | null = null;

  communityStats = {
    totalUsers: 0,
    totalQuestions: 0,
    totalClosedQuestions: 0,
    totalComments: 0,
    online: 0
  };
  
  myQuestions: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private questionService: QuestionService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
 
      this.username = user.email.split('@')[0];
      this.userInitials = this.getInitials(this.username);
      
    }
    
    this.fetchMyQuestions();
    this.fetchCommunityStats();
  }

  fetchMyQuestions(): void {
    this.questionService.getMyQuestions().subscribe({
      next: (questions) => {
        console.log('Questions received:', questions);
        this.myQuestions = questions;
      },
      error: (err) => {
        console.error('Error fetching questions', err);
      }
    });
  }

  fetchCommunityStats(): void {
    this.questionService.getCommunityStats().subscribe({
      next: (stats) => {
        console.log('Community stats:', stats);
        this.communityStats = {
          totalUsers: stats.totalUsers,
          totalQuestions: stats.totalQuestions,
          totalClosedQuestions: stats.totalClosedQuestions,
          totalComments: stats.totalComments,
          online: this.getRandomOnlineUsers()
        };
      },
      error: (err) => {
        console.error('Error fetching community stats', err);
      }
    });
  }
    
  getRandomOnlineUsers(): number {
    return Math.floor(Math.random() * 20) + 1; // Simulated value
  }
    
  searchCommunity(): void {
    console.log('Searching for:', this.searchQuery);
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { 
        queryParams: { query: this.searchQuery }
      });
    }
  }

  createNewQuestion(): void {
    console.log('Creating new question');
    this.router.navigate(['/ask-question']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getInitials(name: string): string {
    const words = name.split(/[\s._-]+/); // splits on spaces, dot, underscore, hyphen
    const initials = words.map(word => word.charAt(0).toUpperCase()).slice(0, 2).join('');
    return initials;
  }
}