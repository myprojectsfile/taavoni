import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit {

  @ViewChild("safeKharidGrid") dataGrid: DxDataGridComponent

  ngOnInit(): void {
    this.dataGrid.rtlEnabled = true;
  }

  constructor() { }

  books = [
    { author: 'D. Adams', title: "The Hitchhiker's Guide to the Galaxy", year: 1979, genre: 'Comedy, sci-fi' },
    { author: 'K. Vonnegut', title: "Cat's Cradle", year: 1963, genre: 'Satire, sci-fi' },
    { author: 'M. Mitchell', title: "Gone with the Wind", year: 1936, genre: 'Historical fiction' }
  ];
}
