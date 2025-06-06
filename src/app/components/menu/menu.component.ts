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
    a_dashboard: {
      text: 'Dashboard',
      icon: 'dashboard',
      child:[
        { routeLink: '/welcome', text: 'Welcome' },
      ]
    },
    b_user: {
      text: 'User Management',
      icon: 'user',
      child:[
        { routeLink: '/user-list', text: 'List of User' }
      ]
    },
    c_appStorage: {
      text: 'Application Storage',
      icon: 'database',
      child:[
        { routeLink: '/view-storage', text: 'View Storage' },
        { routeLink: '/add-storage', text: 'Add Storage' }
      ]
    },
    d_experiment: {
      text: 'Experiment',
      icon: 'experiment',
      child:[
        { routeLink: '/not-a-valid-url', text: 'Not a Valid URL' },
      ]
    },
  };

  ngOnInit() {
    this.envName = environment.envName;
  }
}
