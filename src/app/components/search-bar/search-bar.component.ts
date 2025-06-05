import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { GeneralApiService } from '../../services/general-api.service';

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

  constructor(private generalApiService: GeneralApiService) {} //dependency injection

  onSearch() {
    if (!this.searchTerm || !this.apiUrl) return;

    this.generalApiService.searchByKeyword(this.apiUrl, this.searchTerm).subscribe({
      next: (res: any) => this.searchResults.emit(res.users),
      error: (err) => this.error.emit(err)
    });
  }
}
