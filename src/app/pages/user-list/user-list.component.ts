import { Component } from '@angular/core';
import {SearchBarComponent} from '../../components/search-bar/search-bar.component';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {TableListComponent} from '../../components/table-list/table-list.component';
import {Router, RouterModule} from '@angular/router';
import {UserApiService} from '../../services/user-api.service';

@Component({
  selector: 'app-user-list',
  imports: [
    SearchBarComponent,
    NzCardComponent,
    TableListComponent,
    RouterModule
  ],
  templateUrl: './user-list.component.html'
})
export class UserListComponent {
  pageTitle = 'List of Users';
  apiUrl = 'https://dummyjson.com/users/search';

  constructor(
    private userApiService: UserApiService,
    private router: Router
  ) {
    this.apiUrl = this.userApiService.getBaseUrl() + '/search';
  }

  tableData: any[] = [];
  columns = [
    { fieldName: 'firstName', displayText: 'First Name' },
    { fieldName: 'lastName', displayText: 'Last Name' },
    { fieldName: 'email', displayText: 'Email' },
    { fieldName: 'phone', displayText: 'Phone' }
  ];

  onSearchResults(data: any[]) {
    this.tableData = data;
  }

  onSearchError(error: any) {
    console.error('Search error:', error);
  }

  onRowClick(user: any) {
    this.router.navigate(['/users', user.id]);
  }
}
