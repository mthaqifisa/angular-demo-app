import { Component } from '@angular/core';
import {SearchBarComponent} from '../../components/search-bar/search-bar.component';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {TableListComponent} from '../../components/table-list/table-list.component';

@Component({
  selector: 'app-user-list',
  imports: [
    SearchBarComponent,
    NzCardComponent,
    TableListComponent
  ],
  templateUrl: './user-list.component.html'
})
export class UserListComponent {
  pageTitle = 'List of Users';
  apiUrl = 'https://dummyjson.com/users/search';
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
}
