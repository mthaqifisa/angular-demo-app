import { Component } from '@angular/core';
import {NzEmptyComponent} from 'ng-zorro-antd/empty';

@Component({
  selector: 'app-page-not-found',
  imports: [
    NzEmptyComponent
  ],
  template: `
    <nz-empty class="no-data"></nz-empty>
  `,
  styles: `
  .no-data {
    padding-top: 30%;
  }
  `
})
export class PageNotFoundComponent {

}
