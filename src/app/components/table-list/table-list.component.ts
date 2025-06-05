import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-table-list',
  imports: [
    NzTableModule,
    NgForOf
  ],
  templateUrl: './table-list.component.html',
  host: {ngSkipHydration: 'true'}
})
export class TableListComponent {
  @Input() data: any[] = [];
  @Input() columns: { fieldName: string; displayText: string }[] = [];
  @Output() rowClick = new EventEmitter<any>();
}
