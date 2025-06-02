import { Component } from '@angular/core';
import {DatePipe} from '@angular/common';

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
}
