import { Component, inject } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NgIf, AsyncPipe } from '@angular/common';
import { LoginComponent } from '../../pages/login/login.component';
import { MenuComponent } from '../menu/menu.component';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../../state/auth';

@Component({
  selector: 'app-root',
  imports: [NzIconModule, NzLayoutModule, NzMenuModule, LoginComponent, NgIf, AsyncPipe, MenuComponent],
  template: `
      <app-login *ngIf="!(authorizedUser$ | async)"></app-login>
      <app-menu *ngIf="authorizedUser$ | async"></app-menu>
    `
})
export class AppComponent {
  private store = inject(Store);
  authorizedUser$ = this.store.select(selectIsAuthenticated);
}
