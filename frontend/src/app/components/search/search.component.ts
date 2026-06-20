import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';

interface SearchResult {
  qid?: string;
  id?: string;
  _id?: string;
  title: string;
  username?: string; // For author name
  author?: string;  // Fallback
  datePosted?: string;
  date?: string;    // Fallback
  label?: string;
  tags?: string[];
  productCode?: string;
  content: string;
  replies?: number;
  views?: number;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  results: SearchResult[] = [];
  isLoading: boolean = false;
  private apiUrl = 'http://localhost:8081/api/questions';

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      query: [''],
      filterAuthor: [''],
      filterDate: [''],
      filterProduct: [''],
      filterTag: ['']
    });
  }

  ngOnInit() {
    // Check if there are query parameters and set them in the form
    this.route.queryParams.subscribe(params => {
      if (params['query']) this.searchForm.get('query')?.setValue(params['query']);
      if (params['author']) this.searchForm.get('filterAuthor')?.setValue(params['author']);
      if (params['date']) this.searchForm.get('filterDate')?.setValue(params['date']);
      if (params['product']) this.searchForm.get('filterProduct')?.setValue(params['product']);
      if (params['tag']) this.searchForm.get('filterTag')?.setValue(params['tag']);
      
      // If any params exist, perform search
      if (Object.keys(params).length > 0) {
        this.filterResults();
      } else {
        this.fetchResults(); // Otherwise fetch all results
      }
    });

    // Subscribe to search input changes with debounce
    this.searchForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => this.filterResults());
  }

  fetchResults() {
    this.isLoading = true;
    this.http.get<any[]>(this.apiUrl)
      .subscribe({
        next: (data) => {
          this.processResults(data);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching search results:', error);
          this.isLoading = false;
        }
      });
  }

  filterResults() {
    this.isLoading = true;
    
    // Get form values
    const query = this.searchForm.get('query')?.value?.trim() || '';
    const author = this.searchForm.get('filterAuthor')?.value?.trim() || '';
    const dateFilter = this.searchForm.get('filterDate')?.value || '';
    const productCode = this.searchForm.get('filterProduct')?.value?.trim() || '';
    const tag = this.searchForm.get('filterTag')?.value?.trim() || '';
    
    // Update URL with search parameters without reloading page
    this.updateUrlWithFilters(query, author, dateFilter, productCode, tag);
    
    // If backend search is available, use it
    if (query || productCode || tag) {
      this.searchUsingBackendApi(query, author, dateFilter, productCode, tag);
    } 
    // Otherwise fetch all and filter client-side
    else {
      this.fetchAndFilterClientSide(author, dateFilter);
    }
  }
  
  searchUsingBackendApi(query: string, author: string, dateFilter: string, productCode: string, tag: string) {
    // Initialize HTTP params
    let params = new HttpParams();
    
    // Add search parameters to the request
    if (query) params = params.set('title', query);  // Using title for content search
    if (productCode) params = params.set('productCode', productCode);
    if (tag) params = params.set('label', tag);
    
    // Make the API call
    this.http.get<any[]>(`${this.apiUrl}/search`, { params })
      .subscribe({
        next: (data) => {
          // Process results and apply additional client-side filtering for fields not supported by API
          let results = this.processResponseToSearchResults(data);
          
          // Apply client-side filters for fields not directly supported by backend
          if (author) {
            results = results.filter(result => 
              (result.username?.toLowerCase().includes(author.toLowerCase()) || 
               result.author?.toLowerCase().includes(author.toLowerCase()))
            );
          }
          
          if (dateFilter) {
            results = this.filterByDate(results, dateFilter);
          }
          
          this.results = results;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error with backend search:', error);
          this.isLoading = false;
        }
      });
  }
  
  fetchAndFilterClientSide(author: string, dateFilter: string) {
    this.http.get<any[]>(this.apiUrl)
      .subscribe({
        next: (data) => {
          let results = this.processResponseToSearchResults(data);
          
          // Apply client-side filters
          if (author) {
            results = results.filter(result => 
              (result.username?.toLowerCase().includes(author.toLowerCase()) || 
               result.author?.toLowerCase().includes(author.toLowerCase()))
            );
          }
          
          if (dateFilter) {
            results = this.filterByDate(results, dateFilter);
          }
          
          this.results = results;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error with client-side filtering:', error);
          this.isLoading = false;
        }
      });
  }
  
  processResponseToSearchResults(data: any[]): SearchResult[] {
    return data.map(item => ({
      qid: item.qid || item.id || item._id || '',
      title: item.title || '',
      username: item.username || '',
      author: item.author || 'Anonymous',
      datePosted: item.datePosted || '',
      date: item.date || '',
      label: item.label || '',
      tags: item.label ? item.label.split(',').map((tag: string) => tag.trim()) : [],
      productCode: item.productCode || '',
      content: item.content || '',
      replies: (item.comments?.length) || 0,
      views: item.views || 0
    }));
  }
  
  processResults(data: any[]) {
    this.results = this.processResponseToSearchResults(data);
  }
  
  filterByDate(results: SearchResult[], dateFilter: string): SearchResult[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);
    
    return results.filter(result => {
      // Get the post date
      const dateStr = result.datePosted || result.date || '';
      if (!dateStr) return false;
      
      const postDate = new Date(dateStr);
      
      switch (dateFilter) {
        case 'today':
          return postDate >= today;
        case 'week':
          return postDate >= weekStart;
        case 'month':
          return postDate >= monthStart;
        case 'year':
          return postDate >= yearStart;
        default:
          return true;
      }
    });
  }
  
  updateUrlWithFilters(query: string, author: string, dateFilter: string, productCode: string, tag: string) {
    // Build query params object
    const queryParams: any = {};
    if (query) queryParams.query = query;
    if (author) queryParams.author = author;
    if (dateFilter) queryParams.date = dateFilter;
    if (productCode) queryParams.product = productCode;
    if (tag) queryParams.tag = tag;
    
    // Update URL without triggering navigation
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
  
  resetSearch() {
    // Reset form controls
    this.searchForm.reset();
    
    // Clear URL parameters without page reload
    this.router.navigate(['/search'], { replaceUrl: true });
    
    // Fetch all results
    this.fetchResults();
  }
  
  // Helper function to filter by specific tag
  filterByTag(tag: string) {
    this.searchForm.get('filterTag')?.setValue(tag);
    this.filterResults();
  }
}