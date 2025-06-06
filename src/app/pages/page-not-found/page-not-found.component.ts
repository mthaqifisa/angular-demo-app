import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [NzButtonModule, NzResultModule, RouterLink],
  template: `
    <nz-result style="padding-top: 10%" nzStatus="404" nzTitle="404" nzSubTitle="Sorry, the page you visited does not exist.">
      <div nz-result-extra>
        <button nz-button nzType="primary" [routerLink]="'/'">Back Home</button>
      </div>
    </nz-result>
  `,

})
export class PageNotFoundComponent {

}
