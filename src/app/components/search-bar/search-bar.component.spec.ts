import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { GeneralApiService } from '../../services/general-api.service';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { of, throwError } from 'rxjs';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let mockApiService: jasmine.SpyObj<GeneralApiService>;

  beforeEach(async () => {
    mockApiService = jasmine.createSpyObj('GeneralApiService', ['searchByKeyword']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, NzInputModule, NzButtonModule, SearchBarComponent],
      providers: [{ provide: GeneralApiService, useValue: mockApiService }]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call API and emit search results', () => {
    const mockResponse = { users: [{ id: 1, name: 'Alice' }] };
    mockApiService.searchByKeyword.and.returnValue(of(mockResponse));
    spyOn(component.searchResults, 'emit');

    component.searchTerm = 'Alice';
    component.apiUrl = 'https://api.example.com/search';
    component.onSearch();

    expect(mockApiService.searchByKeyword).toHaveBeenCalledWith(component.apiUrl, component.searchTerm);
    expect(component.searchResults.emit).toHaveBeenCalledWith(mockResponse.users);
  });

  it('should emit an error when API call fails', () => {
    const mockError = { message: 'Network error' };
    mockApiService.searchByKeyword.and.returnValue(throwError(() => mockError));
    spyOn(component.error, 'emit');

    component.searchTerm = 'Alice';
    component.apiUrl = 'https://api.example.com/search';
    component.onSearch();

    expect(component.error.emit).toHaveBeenCalledWith(mockError);
  });
});
