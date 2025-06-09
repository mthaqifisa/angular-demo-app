// src/app/components/root/app.component.ts
import { Component, inject } from '@angular/core';
import { NgIf, AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../../state/auth/auth.selectors';
import { LoginComponent } from '../../pages/login/login.component';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-root',
  imports: [NgIf, AsyncPipe, LoginComponent, MenuComponent],
  template: `
    <app-login *ngIf="!(authorizedUser$ | async)"></app-login>
    <app-menu *ngIf="authorizedUser$ | async"></app-menu>
  `
})
export class AppComponent {
  private store = inject(Store);
  authorizedUser$ = this.store.select(selectIsAuthenticated);
}
