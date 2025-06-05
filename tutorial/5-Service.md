# 5.0 Angular Service & Dependency Injection
---
## 5.1 Create Angular Service to Call APIs
1.	Open CMD and run “ng g service services/user-api”
2.	Update the code in user-api.service.ts :
```javascript
//user-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserApiService {
  constructor(private http: HttpClient) {} //dependency injection
  
  searchUsers(apiUrl: string, searchKeyword: string): Observable<any> {
    const url = `${apiUrl}?q=${encodeURIComponent(searchKeyword)}`;
    return this.http.get(url);
  }
}
```

3.	Update search-bar.component.ts to use function in service to call API:
```javascript
//search-bar.component.ts
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

```
---

## 5.2 Create User Detail Page
1.	Update user-api.service.ts and add the following code in export class:
```javascript
private baseUrl = environment.apiUrl + '/users';  
getUser(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
}

updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
}
```


2.	Import environment in user-api.service.ts
```javascript
import { environment } from '../../environments/environment';
```

3.	Create new user-detail page component by running ```ng g c pages/user-detail```
4.	Update user-detail page with the following code:
```html
<!--user-detail.component.html-->
<nz-card nzTitle="User Details" *ngIf="userForm">
  <form [formGroup]="userForm">
    <!-- Personal Info -->
    <nz-card nzTitle="Personal Information" style="margin-bottom: 24px;">
      <nz-form-item>
        <nz-form-label>Username</nz-form-label>
        <input nz-input formControlName="username" [disabled]="!isEditMode">
      </nz-form-item>

      <nz-form-item>
        <nz-form-label>Email</nz-form-label>
        <input nz-input formControlName="email" [disabled]="!isEditMode">
      </nz-form-item>
    </nz-card>

    <!-- Address -->
    <nz-card nzTitle="Address" style="margin-bottom: 24px;">
      <div formGroupName="address">
        <nz-form-item>
          <nz-form-label>Street</nz-form-label>
          <input nz-input formControlName="address" [disabled]="!isEditMode">
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>City</nz-form-label>
          <input nz-input formControlName="city" [disabled]="!isEditMode">
        </nz-form-item>

        <!-- Add more address fields similarly -->
      </div>
    </nz-card>

    <!-- Bank Info -->
    <nz-card nzTitle="Bank Information">
      <div formGroupName="bank">
        <nz-form-item>
          <nz-form-label>Card Number</nz-form-label>
          <input nz-input formControlName="cardNumber" [disabled]="!isEditMode">
        </nz-form-item>

        <!-- Add more bank fields similarly -->
      </div>
    </nz-card>
  </form>

  <div style="margin-top: 24px;">
    <button
      nz-button
      nzType="primary"
      (click)="toggleEdit()"
      style="margin-right: 8px;"
    >
      {{ isEditMode ? 'Cancel' : 'Edit' }}
    </button>

    <button
      nz-button
      nzType="primary"
      *ngIf="isEditMode"
      (click)="saveChanges()"
    >
      Save Changes
    </button>
  </div>
</nz-card>
```

```javascript
//user-detail.component.ts
import {Component, OnInit} from '@angular/core';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NgIf} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {UserApiService} from '../../services/user-api.service';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-user-detail',
  imports: [
    NzCardComponent,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzInputDirective,
    ReactiveFormsModule,
    NzButtonComponent,
    NgIf
  ],
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  originalData: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserApiService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {}
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadUserData(params['id']);
    });
  }
  
  private loadUserData(userId: number) {
    this.userService.getUser(userId).subscribe(user => {
      this.originalData = user;
      this.initializeForm(user);
    });
  }
  
  private initializeForm(data: any) {
    this.userForm = this.fb.group({
      id: [data.id],
      username: [data.username],
      email: [data.email],
      macAddress: [data.macAddress],
      university: [data.university],
      address: this.fb.group({
        address: [data.address.address],
        city: [data.address.city],
        state: [data.address.state],
        postalCode: [data.address.postalCode],
        coordinates: this.fb.group({
          lat: [data.address.coordinates.lat],
          lng: [data.address.coordinates.lng]
        })
      }),
      bank: this.fb.group({
        cardNumber: [data.bank.cardNumber],
        cardExpire: [data.bank.cardExpire],
        cardType: [data.bank.cardType],
        currency: [data.bank.currency],
        iban: [data.bank.iban]
      })
    });
  
    this.disableForm();
  }
  
  toggleEdit() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.userForm.enable();
    } else {
      this.userForm.disable();
      this.userForm.patchValue(this.originalData);
    }
  }
  
  saveChanges() {
    const updatedData = this.userForm.value;
    this.userService.updateUser(updatedData.id, updatedData).subscribe({
      next: () => {
        this.message.success('User updated successfully');
        this.originalData = updatedData;
        this.toggleEdit();
      },
      error: () => this.message.error('Error updating user')
    });
  }
  
  private disableForm() {
    this.userForm.disable();
  }
}


```


5.	Update app.routes.ts and add the following code:
```javascript
{ path: 'users/:id', component: UserDetailComponent },
```

6.	Update table-list.component.html and add the following code accordingly:
```html
<tr *ngFor="let item of basicTable.data" (click)="rowClick.emit(item)">
```

7.	Update table-list.component.ts and add the following code inside export class:
```javascript
@Output() rowClick = new EventEmitter<any>();
```

8.	Update app-table-list tag in user-list.component.html to handle row click:
```html
<app-table-list
    [data]="tableData"
    [columns]="columns"
    (rowClick)="onRowClick($event)"
></app-table-list>
```

9.	Update user-list.component.ts and add/update the following code
```javascript
//import this
import {Router, RouterModule} from '@angular/router';
import {UserApiService} from '../../services/user-api.service';

//update component imports
imports: [
  SearchBarComponent,
  NzCardComponent,
  TableListComponent,
  RouterModule //add this
],

//add inside export class
constructor(
  private userApiService: UserApiService,
  private router: Router
) {
  this.apiUrl = this.userApiService.getBaseUrl() + '/search';
}

onRowClick(user: any) {
    this.router.navigate(['/users', user.id]);
}
```
10. update apiUrl in environment.<env>.ts with 
```
apiUrl: 'https://dummyjson.com',
```

11. update user-api.service.ts with the following code:
```javascript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) {} //dependency injection

  getBaseUrl(){
    return this.apiUrl;
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}
```

12. create new general-api.service.ts and replace the code with:
```javascript
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralApiService {

  constructor(private http: HttpClient) { }

  searchByKeyword(apiUrl: string, searchKeyword: string): Observable<any> {
    const url = `${apiUrl}?q=${encodeURIComponent(searchKeyword)}`;
    return this.http.get(url);
  }
}
```
