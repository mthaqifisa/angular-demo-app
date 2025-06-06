import { Routes } from '@angular/router';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {UserListComponent} from './pages/user-list/user-list.component';
import {UserDetailComponent} from './pages/user-detail/user-detail.component';
import {ViewStorageComponent} from './pages/storage/view-storage/view-storage.component';
import {AddStorageComponent} from './pages/storage/add-storage/add-storage.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) },
  { path: 'user-list', component: UserListComponent },
  { path: 'users/:id', component: UserDetailComponent },
  { path: 'view-storage', component: ViewStorageComponent },
  { path: 'add-storage', component: AddStorageComponent },
  { path: '**', component: PageNotFoundComponent }
];
