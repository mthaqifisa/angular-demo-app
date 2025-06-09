import {Component, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Store} from '@ngrx/store';
import {selectIsAuthenticated} from '../../state/auth/auth.selectors';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  imports: [
    DatePipe
  ],
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  constructor() {}
  username: string = 'Angular Trainee';
  currentDate: Date = new Date();

  private store = inject(Store);
  authorizedUser$ = this.store.select(selectIsAuthenticated);
  ngOnInit(): void {
    console.log(this.authorizedUser$);
  }
}
