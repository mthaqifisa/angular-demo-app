import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import {NgIf} from '@angular/common';
import {LoginComponent} from '../../pages/login/login.component';
import {MenuComponent} from '../menu/menu.component';

@Component({
  selector: 'app-root',
  imports: [NzIconModule, NzLayoutModule, NzMenuModule, LoginComponent, NgIf, MenuComponent],
  template: `
      <app-login *ngIf="!authorizedUser"></app-login>
      <app-menu *ngIf="authorizedUser"></app-menu>
    `
})
export class AppComponent {
  authorizedUser = true;
}
