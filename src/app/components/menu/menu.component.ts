//menu.component.ts
import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {KeyValuePipe, NgForOf} from '@angular/common';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, NgForOf, KeyValuePipe],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  isCollapsed = false;
  envName = '';

  sideMenu = {
    dashboard: {
      text: 'Dashboard',
      icon: 'dashboard',
      child:[
        { routeLink: '/welcome', text: 'Welcome' },
      ]
    },
    user: {
      text: 'User Management',
      icon: 'user',
      child:[
        { routeLink: '/user-list', text: 'List of User' }
      ]
    }
  };

  ngOnInit() {
    this.envName = environment.envName;
  }
}
