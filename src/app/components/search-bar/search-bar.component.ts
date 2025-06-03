import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [
    FormsModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent {
  @Input() buttonText = 'Search';
  @Input() apiUrl = '';
  @Output() searchResults = new EventEmitter<any>();
  @Output() error = new EventEmitter<any>();

  searchTerm = '';

  constructor(private http: HttpClient) {}

  onSearch() {
    if (!this.searchTerm || !this.apiUrl) return;

    const url = `${this.apiUrl}?q=${encodeURIComponent(this.searchTerm)}`;

    this.http.get(url).subscribe({
      next: (res: any) => this.searchResults.emit(res.users),
      error: (err) => this.error.emit(err)
    });
  }
}
